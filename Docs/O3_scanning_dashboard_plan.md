## Scanning Dashboard – Design & Implementation Plan

### 1. Objectives
1. Provide **real-time and historical visibility** into every Trade Session for a user.
2. Surface scanning-specific telemetry first, while remaining **extensible** to Initiation & Termination services.
3. Keep backend queries lean; use a hybrid **REST + WebSocket** model.
4. Offer user controls to **pause / resume / stop** a Trade Session safely.

---

### 2. Current State Snapshot
| Layer | Status | Notes |
|-------|--------|-------|
| Trade Management Unit (TMU) | ✅ | `/trade_sessions` model in Django.  `status`, `is_active`, `closed_at` determine liveness. |
| Scanning Service | ✅ | Publishes logs only. No structured event stream. |
| UI (React) | 🚧 | Basic pages exist; lacks session overview & live feed. |

**How a session is _active_ now**  
```
status == "started" && is_active == true && closed_at IS NULL
```
Future logic will centralise in `TradeSession.is_live()` helper to avoid duplication.

---

### 3. Data Contracts
#### 3.1 REST – Trade Session Summary (List)
`GET /api/v1/trade-sessions?user_id=<uuid>&page=<n>&page_size=<m>`
Response (trimmed):
```json
[
  {
    "id": 42,
    "started_at": "2025-06-12T09:31:00Z",
    "status": "started",
    "is_active": true,
    "trading_frequency": "10-minute",
    "pnl": 1234.56,
    "scanning_algo": "UDTS v3",
    "initiation_algo": "SmartEntry v2",
    "termination_algo": "ATR-Trail v1"
  },
  ...
]
```
*Only lightweight aggregates returned; trade/order rows deferred until details view.*

#### 3.2 REST – Trade Session Detail
`GET /api/v1/trade-sessions/{session_id}` -> full object incl. aggregated PnL, counts, etc.

#### 3.3 WebSocket – Live Event Stream
Endpoint: `wss://ats.example.com/ws/trade-sessions/{session_id}/events/`
Authentication: JWT in query param or `Sec-WebSocket-Protocol` header.

Event envelope:
```json
{
  "event_id": "<uuid>",
  "ts": "2025-06-12T09:42:01.234Z",
  "service": "SCANNING",   // INITIATION | TERMINATION (future)
  "level": "INFO",          // DEBUG | INFO | WARN | ERROR
  "payload": {
    "instrument": "AAPL",
    "action": "ANALYSING", // ANALYSING | SELECTED | REJECTED
    "details": {
      "reason": "RR=2.4, S/R matched"
    }
  }
}
```
*Back-pressure*: server may batch >50 events/sec or drop DEBUG level if UI not focused.

---

### 4. Backend Tasks
1. **Structured event model**  
   • Create `scan_events` (or generic `session_events`) table with minimal columns: `id, session_id, service, level, payload(JSON), ts`.
   • Scanning Service writes one row per meaningful milestone.  
2. **Event publisher**  
   • Use Redis Streams → Django Channels group broadcast.  
   • `trade_management_unit.lib.common.event_publisher` already exists – extend for scan events.
3. **API Layer**  
   • Add DRF `TradeSessionSummaryViewSet` (list, retrieve).  
   • Annotate queryset with aggregates (`Sum(PnL)`).
4. **WebSocket consumer**  
   • `TradeSessionConsumer` exists; extend to multiplex services via `service` key.
5. **Safety endpoints**  
   • `POST /api/v1/trade-sessions/{id}/pause`  
   • `POST /api/v1/trade-sessions/{id}/resume`  
   • `POST /api/v1/trade-sessions/{id}/stop` (double confirmation).
6. **Log shipper** (interim)  
   • Until #1 complete, tail `logfile.log` with Filebeat → Redis Stream; parse lines by regexp.

---

### 5. Front-End Requirements (React + TypeScript)
#### 5.1 Routing Summary
```
/portfolio/sessions          → SessionsOverviewPage
/portfolio/sessions/:id      → SessionDetailPage
```

#### 5.2 SessionsOverviewPage
Component hierarchy:
```
SessionsOverviewPage
 ├─ SessionRowAccordion (one per session)
 │   ├─ SummaryBar  // id, status badge, startedAt, pnl
 │   └─ ExpandedArea (lazy-load)
 │       ├─ KeyValueGrid (freq, algorithms)
 │       └─ ControlsBar (Pause | Resume | Stop)
 └─ PaginationControls
```
UX notes:
• **Virtualised list** (`react-window`) for >100 sessions.  
• Status badge colours: started=green, paused=yellow, stopped=red.  
• Clicking anywhere on SummaryBar navigates to Detail Page.

#### 5.3 SessionDetailPage
Layout:
```
HeaderSummary (sticky)
 ├─ SessionStatusBadge
 ├─ LivePnLIndicator
 └─ QuickActions (Pause | Resume | Stop)

TabbedContent (MUI Tabs)
 ├─ ScanningTab (default)
 │   ├─ LiveFeedPanel (left, 30%) – auto-scroll list, colour-coded rows
 │   └─ HistoricalTable (right, 70%) – paginated, sortable
 │       • Each row ⇢ ChartModalButton
 ├─ InitiationTab (placeholder)
 └─ TerminationTab (placeholder)
```

##### ChartModal
Uses `TradingView Lightweight Charts` or `Recharts` with candlestick graph.
Props:
```
<ChartModal
  instrument="AAPL"
  sessionId={id}
  overlays={[ 'support', 'resistance' ]}
  window={400}     // #candles
  frequency="5m"
/>
```
The modal fetches OHLC data via `/api/v1/market-data?...` + overlays from `payload.details`.

#### 5.4 State Management & Data Flow
```
REST bootstrap → React Query cache
     ↓
openWebSocket(session_id)
     ↓         (reconnect w/ backoff)
stream events → Zod schema parse → Zustand store
     ↓
UI components subscribe for live updates
```
On network drop:
1. Socket closes → set `isOffline` flag.
2. Banner shown: "Reconnecting…".
3. Exponential retry (1s,2s,5s,10s).
4. Upon reconnect send `last_event_id`; server streams missed events before resuming live.

---

### 6. Performance & Scalability
1. **DB indices** already exist on `TradeSession`; add composite `(session_id, service, ts)` on `session_events`.
2. Paginate REST (`page_size` default 20).  
3. WebSocket messages capped at 1 KB; batch if backlog.
4. UI: throttle renders (e.g., limit LiveFeedPanel to last 500 events in DOM).

---

### 7. Security Considerations
• JWT auth for all REST and WS.  
• Authorise that `user_id` owns the session.  
• Ensure Pause/Stop endpoints require `POST` with CSRF/Origin checks.

---

### 8. Extensibility Hooks
• `service` field in events enables Initiation/Termination reuse.  
• SessionDetailPage Tabs auto-generate from `services[]` array.

---

### 9. Deployment Checklist
1. Migrate DB – `session_events` table.  
2. Roll out Scanning Service update – structured logging.  
3. Roll out TMU & UI simultaneously (maintain backward compatibility with raw log tail fallback).
4. Update Prometheus/Grafana dashboards for event ingest rate.

---

### 10. Open Questions
1. **Event volume**: expected peak msgs/sec per session? impacts socket batching.
2. **Retention**: how long to keep `session_events`? cold storage policy.
3. **Market-data source** for ChartModal? existing endpoint or new micro-service?
4. **PnL calculation**: rely on TMU aggregate or compute client-side from trades?
5. **Multi-tenant scaling**: any per-user WS connection limits?
6. **Access control**: support read-only roles?
7. **Algorithm metadata**: versioning strategy when an algo is upgraded mid-session.
8. **Notification hooks**: should severe events trigger email / push?
9. **Testing strategy** for live feed (mock event generator?)
10. **Mobile layout** requirements?

---

### 11. Ordered Task List for Coding Agent

> All tasks are **self-contained**; copy the entire task text when handing it to the agent. Execute in order 1→N.

1. **Create SessionEvents DB Model & Migration**
   • Context: We need a table to persist structured events emitted by Scanning/Initiation/Termination services.  
   • Action: In `trade_management_unit/models`, add `SessionEvent.py`:
   ```python
   from django.db import models
   from django_mysql.models import EnumField
   from trade_management_unit.models.TradeSession import TradeSession

   class SessionEvent(models.Model):
       class Meta:
           db_table = "session_events"
           indexes = [
               models.Index(fields=["session_id", "service", "ts"]),
           ]

       SERVICE_CHOICES = [
           ("SCANNING", "SCANNING"),
           ("INITIATION", "INITIATION"),
           ("TERMINATION", "TERMINATION"),
       ]

       LEVEL_CHOICES = [
           ("DEBUG", "DEBUG"), ("INFO", "INFO"), ("WARN", "WARN"), ("ERROR", "ERROR"),
       ]

       id = models.BigAutoField(primary_key=True)
       session = models.ForeignKey(TradeSession, on_delete=models.CASCADE)
       service = EnumField(choices=SERVICE_CHOICES)
       level = EnumField(choices=LEVEL_CHOICES)
       payload = models.JSONField()
       ts = models.DateTimeField(auto_now_add=True)
   ```
   • Run `python manage.py makemigrations trade_management_unit && python manage.py migrate`.

2. **Extend Scanning Service to Emit SessionEvents**
   • Context: Scanning micro-service currently only logs to file. We will publish events via Redis Stream *and* write `SessionEvent` rows.  
   • Action: In `scanning_service/lib/event_publisher.py`, create `publish_session_event(session_id, level, payload)` that does:  
     a) `SessionEvent.objects.create(...)`  
     b) `redis.xadd("session:{session_id}:events", data)` with same JSON.
   • Ensure importer path correctness and that function is called at key milestones (ANALYSING, SELECTED, REJECTED).

3. **Create DRF ViewSets for TradeSession and SessionEvent**
   • Context: REST APIs power overview + detail pages.  
   • Action:  
     a) `TradeSessionSummaryViewSet` (list, retrieve) under `trade_management_unit/api/views.py`. Use `TradeSession` queryset annotated with PnL aggregates.  
     b) `SessionEventViewSet` (list) filtered by `session_id`, paginated, ordering `-ts`.  
   • Register in `api/urls.py` under `/api/v1/`.

4. **Implement Django Channels WebSocket Consumer**
   • Context: UI needs live feed.  
   • Action: In `trade_management_unit/consumers/trade_session_consumer.py`, extend existing consumer:  
     – Accept path `ws/trade-sessions/<session_id>/events/`.  
     – On `connect`, join Channels group `session_{session_id}`.  
     – On Redis `xreadgroup`, forward new event JSON to client.  
     – Support `last_event_id` query param to replay missed events.

5. **Add Pause / Resume / Stop Endpoints**
   • Context: User controls on UI.  
   • Action: In `trade_management_unit/api/views.py`, add `@action(detail=True, methods=["post"])` handlers mutating `TradeSession.status` & `is_active`.  
   • Validate ownership and forbid changes if already stopped.

6. **Front-End Bootstrapping (React + Vite)**
   • Context: Build UI inside `algorithmic_trade_ui/`.  
   • Action: Ensure Vite + React-TS setup with `react-router-dom`, `@tanstack/react-query`, `zustand`, `@mui/material`, `@tradingview/lightweight-charts`.

7. **Create SessionsOverviewPage**
   • Context: Lists all sessions with accordion rows.  
   • Action:  
     – Fetch `/api/v1/trade-sessions` via React Query.  
     – Render virtualised list with summary bar + expand section.  
     – Integrate Pause/Resume/Stop buttons calling endpoints from Task 5.

8. **Create SessionDetailPage with Tabs**
   • Context: Deep dive into one session.  
   • Action:  
     – URL `/portfolio/sessions/:id`.  
     – Fetch session summary.  
     – Render sticky header (status, PnL, controls).  
     – Implement MUI Tabs: Scanning (default), Initiation, Termination.

9. **Implement LiveFeedPanel in ScanningTab**
   • Context: Real-time events.  
   • Action:  
     – Open WebSocket `ws/trade-sessions/{id}/events/`.  
     – On message, parse JSON (Zod).  
     – Store last 500 events in Zustand.  
     – Auto-scroll; colour by `action`.

10. **Implement HistoricalTable & ChartModal**
    • Context: Historical scan decisions & charting.  
    • Action:  
      – Fetch `/api/v1/session-events?session_id={id}&page=1` to prime table.  
      – Each row has `View Chart` → opens `ChartModal`.  
      – ChartModal loads OHLC via `/api/v1/market-data?instrument=XYZ&freq=<freq>&window=400` and overlays from `payload.details`.

11. **Reconnect & Offline Handling**
    • Context: Robust UX.  
    • Action: Use WebSocket wrapper with exponential backoff; on reconnect send `{"last_event_id": <stored>}` to catch-up.

12. **Provide Unit & Integration Tests**
    • Context: Quality gates.  
    • Action:  
      – Backend: pytest for API & consumer.  
      – Frontend: component tests with React Testing Library.

13. **Update CI/CD & Docker Compose**
    • Context: Deployability.  
    • Action:  
      – Add migration step in `docker-entrypoint.sh`.  
      – Expose Channels worker, Redis Streams service.  
      – Update NGINX to route WS path.

14. **Roll-out & Monitor**
    • Context: Production readiness.  
    • Action:  
      – Deploy backend → confirm DB schema.  
      – Deploy scanning-service patch.  
      – Deploy UI.  
      – Add Grafana panels for `events/sec`, WS errors.

---

These tasks, executed sequentially, will deliver the complete Scanning Dashboard with real-time visibility and future-proof architecture for initiation & termination services.

---

*End of document* 