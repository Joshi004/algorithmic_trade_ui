# Scanning Dashboard Implementation Plan

## Executive Summary

This document outlines the comprehensive plan for implementing a Scanning Dashboard that provides complete visibility into trade sessions and scanning operations for the algorithmic trading service. The implementation will be designed to be extensible for future integration with initiation and termination services.

## Architecture Overview

### Current State Analysis
Based on the codebase analysis:

1. **Backend Services**:
   - Trade Management Unit (TMU) - Working ✓
   - Scanning Service - Working ✓
   - Initiation Service - Structure exists, not fully implemented
   - Termination Service - Not implemented yet

2. **Frontend**:
   - Basic React UI with authentication
   - Trade Management component exists but lacks visibility features
   - No real-time data feed implementation
   - No charting capabilities

3. **Data Models**:
   - TradeSession: Contains session info, status, algorithms used
   - Trade: Individual trades within a session
   - ScannerEvent: Stores scanning results
   - Order: Buy/sell orders within trades

### Proposed Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  Trade Sessions List → Trade Session Details → Service Tabs     │
│         ↓                      ↓                    ↓            │
│    Summary View          Live Feed View       Historical View   │
│         ↓                      ↓                    ↓            │
│    REST API              WebSocket             REST API         │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                          Backend Layer                           │
├─────────────────────────────────────────────────────────────────┤
│   TMU Service    →    Redis Streams    ←    Scanning Service   │
│       ↓                    ↓                        ↓           │
│   Database            Event Storage            Log Files        │
└─────────────────────────────────────────────────────────────────┘
```

## UI/UX Design Specification

### 1. Trade Sessions Summary Page

**Route**: `/trade-sessions`

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Trade Sessions Dashboard                          [+ New]   │
├─────────────────────────────────────────────────────────────┤
│  Active Sessions (3)              Filters: [All ▼] [Date ▼] │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Session #123                         Status: Active  │   │
│  │ Started: 2024-01-15 10:30 AM                       │   │
│  │ Algorithms: UDTS | Simple Buy | ATR Stop           │   │
│  │ P&L: +₹2,450                    [Stop] [Pause] [▼] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Session #122                        Status: Paused  │   │
│  │ Started: 2024-01-15 09:15 AM                       │   │
│  │ Algorithms: MA Cross | Fixed % | Time Based        │   │
│  │ P&L: -₹350                    [Resume] [Stop] [▼]  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Expandable Card Details**:
When expanded, show:
- Total trades executed
- Win/Loss ratio
- Trading frequency
- Is dummy session
- Quick stats (max profit, max loss, avg trade duration)

### 2. Trade Session Details Page

**Route**: `/trade-sessions/:sessionId`

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│  ← Back    Session #123                    [Stop] [Pause]    │
├──────────────────────────────────────────────────────────────┤
│  Overview Stats                                              │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────────┐   │
│  │ P&L     │ Trades  │ Win %   │ Active  │ Duration    │   │
│  │ +₹2,450 │ 23      │ 65%     │ 3       │ 2h 45m      │   │
│  └─────────┴─────────┴─────────┴─────────┴─────────────┘   │
├──────────────────────────────────────────────────────────────┤
│  [Scanning] [Initiation] [Termination]                       │
├──────────────────────────────────────────────────────────────┤
│                   Tab Content Area                           │
└──────────────────────────────────────────────────────────────┘
```

### 3. Scanning Tab Design

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│  Scanning Activity                              [Chart View] │
├──────────────────────────────────────────────────────────────┤
│  Live Feed                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 10:45:23 - Analyzing RELIANCE...                    │   │
│  │ 10:45:22 - ✓ TATAMOTORS selected (R:R 1:2.5)      │   │
│  │ 10:45:21 - ✗ HDFC rejected (No clear trend)        │   │
│  │ 10:45:20 - Scanning HDFC...                        │   │
│  └─────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│  Selected Instruments (5)                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Symbol    │ Entry  │ SL    │ Target │ R:R  │ View  │   │
│  │ TATAMOTORS│ 425.50 │ 420   │ 438    │ 1:2.5│ [📊]  │   │
│  │ RELIANCE  │ 2340   │ 2320  │ 2390   │ 1:2  │ [📊]  │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 4. Chart View Modal

**Triggered by**: Clicking chart icon [📊] on any instrument

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│  TATAMOTORS - 5min Chart                               [X]  │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │         Candlestick Chart Area                       │   │
│  │         - Support/Resistance Lines                   │   │
│  │         - Entry/Exit Points                          │   │
│  │         - Volume Bars                                │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│  Timeframe: [5m] [10m] [15m]    Indicators: [S&R ✓] [MA □] │
└──────────────────────────────────────────────────────────────┘
```

## Real-time Data Architecture

### WebSocket Connection Design

1. **Connection Strategy**:
   - Single WebSocket connection per trade session
   - Multiplexed channels for different data types
   - Automatic reconnection with exponential backoff

2. **Message Types**:
   ```javascript
   {
     type: 'scanning_update',
     data: {
       timestamp: '2024-01-15T10:45:23Z',
       action: 'analyzing|selected|rejected',
       instrument: { symbol, price, analysis }
     }
   }
   
   {
     type: 'session_stats',
     data: {
       pnl: 2450,
       activeTradesCount: 3,
       totalTrades: 23
     }
   }
   ```

3. **Disconnection Handling**:
   - Queue messages during disconnection
   - Show connection status indicator
   - Sync missed data on reconnection
   - Maintain session state locally

### Data Fetching Strategy

1. **Live Data**: 
   - Parse log files in real-time
   - Stream via Redis Streams
   - Push to frontend via WebSocket

2. **Historical Data**:
   - Store ScannerEvents in database
   - Paginated REST API endpoints
   - Cache frequently accessed data

## Implementation Tasks

### Task 1: Database Schema Updates
**Context**: Need to track scanning session details and live operations
**Requirements**:
- Add `last_activity_at` field to TradeSession model for activity tracking
- Create `ScanningLog` model to persist live scanning operations
- Add indexes for efficient querying of trade sessions by user and status
**Specific Steps**:
1. Create Django migration to add `last_activity_at` DateTimeField to TradeSession
2. Create new ScanningLog model with fields: id, trade_session_id, timestamp, action_type, instrument_id, details (JSON), result
3. Add compound indexes on (user_id, status, last_activity_at) for TradeSession
4. Create migration and apply to database

### Task 2: Backend API Endpoints
**Context**: Need APIs to fetch trade sessions with optimized data and scanning details
**Requirements**:
- Create `/api/trade-sessions/list` endpoint with pagination and filtering
- Create `/api/trade-sessions/:id/details` endpoint for full session details
- Create `/api/trade-sessions/:id/scanning/history` for historical scanning data
- Add session activity status logic based on last_activity_at
**Specific Steps**:
1. In trade_session_view.py, create `get_trade_sessions_list` view that returns paginated sessions with summary data only
2. Create `get_trade_session_details` view that returns complete session info including profit/loss calculations
3. Create new scanning_view.py with `get_scanning_history` endpoint
4. Add URL patterns in TMU urls.py for all new endpoints

### Task 3: WebSocket Infrastructure
**Context**: Need real-time communication for live scanning updates
**Requirements**:
- Extend existing TradeSessionConsumer for scanning updates
- Implement message routing for different update types
- Add connection management and reconnection logic
**Specific Steps**:
1. Modify trade_session_consumer.py to handle scanning update messages
2. Create ScanningUpdatePublisher class in scanning service to publish updates to Redis
3. Add WebSocket URL routing for `/ws/trade-session/:id/scanning`
4. Implement consumer group management for scalability

### Task 4: Frontend - Trade Sessions List Page
**Context**: Main dashboard page showing all user's trade sessions
**Requirements**:
- Create TradeSessionsList component with expandable cards
- Implement filtering and sorting functionality
- Add action buttons (stop/pause/resume) with API integration
- Show real-time status updates
**Specific Steps**:
1. Create `src/components/TradeSessions/TradeSessionsList.jsx` component
2. Create `TradeSessionCard.jsx` for individual session display
3. Add Redux/Context state management for sessions data
4. Integrate with apiService.js for fetching sessions
5. Add route in App.js for `/trade-sessions`

### Task 5: Frontend - Trade Session Details Page
**Context**: Detailed view of a specific trade session with tabs
**Requirements**:
- Create main details page with tab navigation
- Display session statistics header
- Implement tab switching between Scanning/Initiation/Termination
- Add action buttons at page level
**Specific Steps**:
1. Create `src/components/TradeSessions/TradeSessionDetails.jsx`
2. Create `SessionStatsHeader.jsx` for overview statistics
3. Create `TabNavigation.jsx` component for service tabs
4. Add route with parameter `/trade-sessions/:sessionId`
5. Implement tab content loading based on selected tab

### Task 6: Frontend - Scanning Tab Implementation
**Context**: Display live scanning feed and historical results
**Requirements**:
- Create split view for live feed and selected instruments
- Implement WebSocket connection for live updates
- Display historical scanning results in table format
- Add chart view trigger buttons
**Specific Steps**:
1. Create `src/components/TradeSessions/Tabs/ScanningTab.jsx`
2. Create `LiveFeedPanel.jsx` for real-time updates display
3. Create `SelectedInstrumentsTable.jsx` for historical data
4. Implement WebSocket hook `useWebSocket.js` for connection management
5. Add state management for live feed messages

### Task 7: WebSocket Connection Management
**Context**: Robust WebSocket implementation with disconnection handling
**Requirements**:
- Create reusable WebSocket hook with auto-reconnection
- Implement message queuing during disconnection
- Add connection status indicator
- Handle authentication for WebSocket connections
**Specific Steps**:
1. Create `src/hooks/useWebSocket.js` with connection management
2. Implement exponential backoff for reconnection attempts
3. Create message queue in localStorage for offline resilience
4. Add WebSocketProvider context for app-wide connection state
5. Create ConnectionStatus component for UI indication

### Task 8: Chart Integration
**Context**: Technical analysis charts for selected instruments
**Requirements**:
- Integrate charting library (recommend TradingView Lightweight Charts)
- Create configurable chart component
- Add support/resistance line overlays
- Make chart settings algorithm-agnostic
**Specific Steps**:
1. Install lightweight-charts package
2. Create `src/components/Charts/InstrumentChart.jsx`
3. Create `ChartModal.jsx` for fullscreen chart view
4. Implement chart configuration system for different algorithms
5. Add price level annotations for support/resistance

### Task 9: Scanning Service Enhancement
**Context**: Backend service needs to publish real-time updates
**Requirements**:
- Modify scanning service to publish events to WebSocket
- Implement structured logging for live operations
- Create log parsing mechanism for real-time feed
- Add database persistence for scanning results
**Specific Steps**:
1. In scanning_service, create `live_update_publisher.py`
2. Modify scanning algorithms to emit structured events
3. Create log tail reader for real-time parsing
4. Implement batch insert for ScanningLog entries
5. Add Redis pub/sub for event distribution

### Task 10: Data Synchronization
**Context**: Handle data consistency during disconnections
**Requirements**:
- Implement catch-up mechanism for missed updates
- Add timestamp-based synchronization
- Create API endpoint for fetching missed events
- Handle duplicate event prevention
**Specific Steps**:
1. Add `last_sync_timestamp` tracking in frontend
2. Create `/api/trade-sessions/:id/sync` endpoint
3. Implement event deduplication logic
4. Add frontend sync manager for reconnection
5. Create progressive data loading strategy

### Task 11: Performance Optimization
**Context**: Ensure smooth performance with real-time updates
**Requirements**:
- Implement virtual scrolling for live feed
- Add data pagination for historical views
- Optimize WebSocket message size
- Implement frontend caching strategy
**Specific Steps**:
1. Install react-window for virtual scrolling
2. Implement pagination in all list views
3. Create message compression for WebSocket
4. Add Redux persistence for offline capability
5. Implement lazy loading for chart data

### Task 12: Error Handling and Recovery
**Context**: Robust error handling for production reliability
**Requirements**:
- Add comprehensive error boundaries
- Implement retry logic for failed API calls
- Create user-friendly error messages
- Add error logging and monitoring
**Specific Steps**:
1. Create ErrorBoundary components for each major section
2. Implement retry wrapper for apiService
3. Add toast notifications for errors
4. Create error tracking service integration
5. Add fallback UI states for errors

## Technical Considerations

### Frontend State Management
```javascript
// Redux Store Structure
{
  tradeSessions: {
    list: [],
    activeSession: null,
    filters: {},
    pagination: {}
  },
  scanning: {
    liveFeed: [],
    selectedInstruments: [],
    connectionStatus: 'connected'
  },
  websocket: {
    connected: false,
    reconnectAttempts: 0,
    messageQueue: []
  }
}
```

### WebSocket Message Protocol
```javascript
// Client -> Server
{
  action: 'subscribe',
  sessionId: 123,
  channels: ['scanning', 'stats']
}

// Server -> Client
{
  channel: 'scanning',
  event: 'instrument_analyzed',
  data: {
    timestamp: '',
    instrument: {},
    result: {}
  }
}
```

### API Response Formats
```javascript
// Trade Sessions List
{
  data: [{
    id: 123,
    status: 'active',
    startedAt: '',
    lastActivityAt: '',
    summary: {
      pnl: 2450,
      tradesCount: 23,
      winRate: 0.65
    },
    algorithms: {
      scanning: 'UDTS',
      initiation: 'Simple Buy',
      termination: 'ATR Stop'
    }
  }],
  pagination: {
    page: 1,
    totalPages: 5,
    totalCount: 48
  }
}
```

## Configuration Requirements

### Environment Variables
```bash
# Backend
REDIS_STREAM_SCANNING_UPDATES=scanning_updates_stream
WEBSOCKET_HEARTBEAT_INTERVAL=30
SCANNING_LOG_RETENTION_DAYS=30

# Frontend
REACT_APP_WS_URL=ws://localhost:8000/ws
REACT_APP_WS_RECONNECT_INTERVAL=1000
REACT_APP_WS_MAX_RECONNECT_ATTEMPTS=5
```

### Chart Configuration Schema
```javascript
{
  algorithmType: 'price_action',
  indicators: {
    supportResistance: {
      enabled: true,
      levels: []
    },
    movingAverages: {
      enabled: false,
      periods: []
    }
  },
  timeframes: ['5m', '10m', '15m'],
  defaultTimeframe: '5m'
}
```

## Security Considerations

1. **WebSocket Authentication**:
   - Use JWT tokens for WebSocket connections
   - Implement token refresh mechanism
   - Validate user permissions per session

2. **Data Access Control**:
   - Ensure users can only access their own sessions
   - Implement row-level security in database
   - Validate all inputs on backend

3. **Rate Limiting**:
   - Limit WebSocket messages per second
   - Implement API rate limiting
   - Add circuit breakers for external services

## Additional Questions and Considerations

### Architecture Questions
1. **Data Retention Policy**: How long should we keep scanning logs and live feed history? This impacts database size and query performance.

2. **Multi-User Scaling**: How many concurrent WebSocket connections do we expect? Should we implement connection pooling or use a message broker like RabbitMQ?

3. **Algorithm Flexibility**: How different might future algorithms be? Should we create a plugin architecture for algorithm-specific UI components?

### Technical Questions
4. **Chart Library Selection**: Should we use TradingView (paid but feature-rich) or open-source alternatives like Lightweight Charts?

5. **State Management**: Should we use Redux, Context API, or a newer solution like Zustand for state management?

6. **Real-time Data Source**: Should we read directly from log files or implement a proper event streaming architecture with Kafka?

### Business Logic Questions
7. **Session Activity Definition**: What determines if a session is "active"? Last trade time? Last scan time? User-defined timeout?

8. **Data Aggregation**: Should P&L calculations include fees? How do we handle partial fills?

9. **Historical Data Limits**: How far back should users be able to view historical scanning data?

### User Experience Questions
10. **Mobile Responsiveness**: Should the dashboard be mobile-friendly? This would impact component design significantly.

11. **Export Functionality**: Do users need to export trade session data, scanning results, or charts?

12. **Notification System**: Should users receive notifications for important events (big profits/losses, connection issues)?

### Performance Questions
13. **Live Feed Limits**: Should we limit the live feed to last N messages to prevent memory issues?

14. **Caching Strategy**: What data should be cached? Session lists? Historical data? Chart data?

15. **Background Sync**: Should we implement service workers for offline capability and background sync?

### Integration Questions
16. **External Services**: Will we need to integrate with external services for market data or alternative data sources?

17. **Backtesting Integration**: Should historical scanning results be available for backtesting analysis?

18. **Multi-Broker Support**: How should the system handle multiple broker connections per user?

### Monitoring Questions
19. **Observability**: What metrics should we track? WebSocket connection health? API latency? User engagement?

20. **Error Tracking**: Should we integrate with services like Sentry for error tracking? What level of logging is needed?

## Implementation Priority

1. **Phase 1** (MVP - 2 weeks):
   - Tasks 1-3: Database and basic API setup
   - Tasks 4-6: Core UI components
   - Basic WebSocket for live updates

2. **Phase 2** (Enhanced Features - 2 weeks):
   - Tasks 7-9: Robust WebSocket and live feed
   - Task 8: Chart integration
   - Task 10: Data synchronization

3. **Phase 3** (Production Ready - 1 week):
   - Tasks 11-12: Performance and error handling
   - Testing and bug fixes
   - Documentation

## Success Metrics

1. **Performance**:
   - Page load time < 2 seconds
   - WebSocket latency < 100ms
   - Live feed update rate: 10 messages/second

2. **Reliability**:
   - 99.9% uptime for WebSocket connections
   - Successful reconnection rate > 95%
   - Zero data loss during disconnections

3. **User Experience**:
   - Time to first meaningful paint < 1 second
   - Smooth scrolling in live feed (60 fps)
   - Chart interaction latency < 50ms

## Conclusion

This plan provides a comprehensive roadmap for implementing the Scanning Dashboard with real-time capabilities, robust error handling, and extensibility for future services. The modular architecture ensures that initiation and termination services can be easily integrated using the same patterns established for the scanning service. 