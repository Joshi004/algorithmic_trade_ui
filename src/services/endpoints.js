/**
 * Centralized API endpoints for the application
 */
const ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    REFRESH_TOKEN: 'refresh-token',
    LOGOUT: 'logout',
  },

  // Kite integration endpoints
  KITE: {
    GET_LOGIN_URL: 'integration/get_login_url',
    SET_SESSION: 'integration/set_session',
    GET_PROFILE_INFO: 'integration/get_profile_info',
  },

  // Broker management endpoints
  BROKER: {
    REGISTER: 'integration/register_broker',
    GET_USER_BROKERS: 'integration/get_user_brokers',
    SET_DEFAULT: 'integration/set_default_broker',
  },
  
  // Trade session endpoints
  TRADE_SESSIONS: {
    INITIATE: 'tmu/initiate_trade_session',
    GET_ALL: 'tmu/get_user_trade_sessions',
    GET_PARAMS: 'tmu/get_new_session_param_options',
    GET_DETAILS: 'tmu/get_trade_session_details',
    PAUSE: 'tmu/pause_trade_session',
    RESUME: 'tmu/resume_trade_session',
    CHECK_ACTIVE: 'tmu/session_active',
    TERMINATE: 'tmu/terminate_trade_session',
  },
  
  // Instrument endpoints
  INSTRUMENTS: {
    GET_ALL: 'tmu/get_instruments',
    UPDATE: 'tmu/update_instruments',
    GET_HISTORICAL_DATA: 'tmu/get_historical_data',
  },
  
  // Portfolio endpoints
  PORTFOLIO: {
    GET_HOLDINGS: 'integration/get_holdings',
    GET_POSITIONS: 'integration/get_positions',
    GET_ORDERS: 'integration/get_orders',
    GET_ORDERS_TRADES: 'integration/get_order_trades',
    GET_ORDER_HISTORY: 'integration/get_order_history',
    PLACE_ORDER: 'integration/place_order',
  },
  
  // Trade endpoints
  TRADES: {
    GET_QUOTES: 'integration/get_quotes',
    GET_ALL_TRADES_INFO: 'tmu/get_all_trades_info',
  },
  
  // Scanner algorithm endpoints
  SCANNER_ALGOS: {
    GET_ELIGIBLE_INSTRUMENTS: 'tmu/get_eligible_instruments',
    GET_UDTS_ELIGIBILITY: 'tmu/get_udts_eligibility',
    GET_UDTS_RECORD: 'tmu/get_udts_redcord',
  },
  
  // WebSocket endpoints
  WEBSOCKET: {
    ATS: '/ws/ats/',
  },
};

export default ENDPOINTS; 