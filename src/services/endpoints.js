/**
 * Centralized API endpoints for the application
 */
const ENDPOINTS = {
  // Kite integration endpoints
  KITE: {
    GET_LOGIN_URL: 'tmu/get_login_url',
    SET_SESSION: 'tmu/set_session',
    GET_PROFILE_INFO: 'tmu/get_profile_info',
  },
  
  // Trade session endpoints
  TRADE_SESSIONS: {
    INITIATE: 'tmu/initiate_trade_session',
    GET_ALL: 'tmu/get_trade_sessions',
    GET_PARAMS: 'tmu/get_new_session_param_options',
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
    GET_HOLDINGS: 'tmu/get_holdings',
    GET_POSITIONS: 'tmu/get_positions',
    GET_ORDERS: 'tmu/get_orders',
    GET_ORDERS_TRADES: 'tmu/get_orders_trades',
    GET_ORDER_HISTORY: 'tmu/get_order_history',
    PLACE_ORDER: 'tmu/place_order',
  },
  
  // Trade endpoints
  TRADES: {
    GET_QUOTES: 'tmu/get_quotes',
    GET_ALL_TRADES_INFO: 'tmu/get_all_trades_info',
  },
  
  // Scanner algorithm endpoints
  SCANNER_ALGOS: {
    GET_ELIGIBLE_INSTRUMENTS: 'tmu/get_eligible_instruments',
    GET_UDTS_ELIGIBILITY: 'tmu/get_udts_eligibility',
    GET_UDTS_RECORD: 'tmu/get_udts_redcord',
  },
};

export default ENDPOINTS; 