# Authentication Implementation Documentation

This document describes the implementation of the new authentication flow and UI integration for the Algorithmic Trading System (ATS).

## Overview

The system now supports a complete authentication flow with JWT tokens stored in HTTP-only cookies, automatic token refresh, and integrated broker registration for Zerodha trading.

## Features Implemented

### 1. Login Page (`/login`)
- **Location**: `algorithmic_trade_ui/src/components/Auth/Login.js`
- **Framework**: Material UI
- **Fields**: Email and Password only
- **Features**:
  - Form validation
  - Loading states
  - Error handling
  - Automatic redirect to home page on success

### 2. Broker Registration Page (`/broker-registration`)
- **Location**: `algorithmic_trade_ui/src/components/Auth/BrokerRegistration.js`
- **Framework**: Material UI
- **Fields**: 
  - Broker Name (dropdown, currently supports Zerodha only)
  - API Key
  - API Secret
- **Features**:
  - Form validation
  - Success/error messaging
  - Automatic redirect after successful registration

### 3. HTTP-Only Cookie Authentication
- **Backend**: Modified `ats_gateway/views/AuthView.py`
- **Middleware**: Updated `ats_gateway/middleware/jwt_auth_middleware.py`
- **Security Features**:
  - Tokens stored in HTTP-only cookies (not accessible via JavaScript)
  - Automatic token refresh on expiry
  - Secure cookie settings for production

### 4. Token Management
- **Long-lived Token**: 30 days expiry, used only for token refresh
- **Short-lived Token**: 15 minutes expiry, used for API access
- **Automatic Refresh**: Frontend automatically refreshes tokens when needed

### 5. Zerodha Integration Flow
- **Enhanced Flow**: System checks for broker credentials before allowing Kite login
- **Auto-redirect**: Users without broker credentials are redirected to registration
- **Error Handling**: Clear error messages for missing credentials

## API Endpoints

### Authentication Endpoints
- `POST /login` - User login
- `POST /register` - User registration  
- `GET /refresh-token` - Token refresh
- `POST /logout` - User logout

### Broker Management Endpoints
- `POST /integration/register_broker` - Register broker credentials
- `GET /integration/get_user_brokers` - Get user's brokers
- `POST /integration/set_default_broker` - Set default broker

### Kite Integration Endpoints
- `GET /integration/get_login_url` - Get Kite login URL (checks broker credentials)
- `POST /integration/set_session` - Set Kite session with request token
- `GET /integration/get_profile_info` - Get Kite profile information

## Frontend Components

### Core Components
1. **Login** (`/src/components/Auth/Login.js`)
2. **BrokerRegistration** (`/src/components/Auth/BrokerRegistration.js`)
3. **KiteLoginButton** (`/src/components/Common/KiteLoginButton.js`)

### Services
1. **apiService** (`/src/services/apiService.js`) - HTTP client with automatic token refresh
2. **kiteService** (`/src/services/kiteService.js`) - Kite/Zerodha integration
3. **AuthContext** (`/src/contexts/AuthContext.js`) - Authentication state management

## Usage Examples

### 1. User Login Flow
```javascript
import { useAuth } from '../contexts/AuthContext';

const { login } = useAuth();

try {
  await login({ email: 'user@example.com', password: 'password' });
  // User is now logged in, tokens stored in cookies
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### 2. Broker Registration
```javascript
import apiService from '../services/apiService';
import ENDPOINTS from '../services/endpoints';

const brokerData = {
  broker_name: 'zerodha',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
};

try {
  const response = await apiService.post(ENDPOINTS.BROKER.REGISTER, brokerData);
  console.log('Broker registered:', response);
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

### 3. Kite Login with Auto-redirect
```javascript
import KiteLoginButton from '../components/Common/KiteLoginButton';

// Component automatically handles broker credential check
<KiteLoginButton>
  Connect to Zerodha
</KiteLoginButton>
```

## Security Features

### HTTP-Only Cookies
- Tokens cannot be accessed via JavaScript
- Automatic inclusion in requests
- Secure flag for HTTPS in production
- SameSite protection against CSRF

### Token Refresh
- Automatic refresh before expiry
- Queue management for concurrent requests
- Fallback to login page on refresh failure

### Middleware Protection
- All protected endpoints require valid short-lived token
- Refresh endpoint requires valid long-lived token
- Public endpoints (login, register) bypass authentication

## Configuration

### Backend Settings
```python
# settings.py
SECURE_COOKIES = True  # Set to True in production for HTTPS
```

### Frontend Configuration
```javascript
// config.js - Update API base URL as needed
export const getApiUrl = (endpoint) => {
  return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${endpoint}`;
};
```

## Error Handling

### Frontend Error Types
- **Authentication Errors**: Redirect to login page
- **Broker Credential Errors**: Redirect to broker registration
- **Network Errors**: Display user-friendly messages
- **Validation Errors**: Show field-specific errors

### Backend Error Responses
```json
{
  "status": "error",
  "error": "Error message",
  "error_code": "NO_BROKER_CREDENTIALS", // Optional
  "redirect_to": "broker_registration"    // Optional
}
```

## Testing

### Manual Testing Steps
1. **Login Flow**:
   - Navigate to `/login`
   - Enter valid credentials
   - Verify redirect to `/home`
   - Check that cookies are set

2. **Broker Registration**:
   - Navigate to `/broker-registration`
   - Enter broker credentials
   - Verify successful registration
   - Test Kite login flow

3. **Token Refresh**:
   - Wait for token expiry (or manually expire)
   - Make an API request
   - Verify automatic refresh

4. **Logout**:
   - Click logout
   - Verify cookies are cleared
   - Verify redirect to login

## Deployment Notes

### Production Checklist
- [ ] Set `SECURE_COOKIES = True` in Django settings
- [ ] Configure HTTPS for secure cookie transmission
- [ ] Update CORS settings for production domain
- [ ] Set appropriate cookie domain settings
- [ ] Configure JWT secret keys securely

### Environment Variables
```bash
# Backend
SECURE_COOKIES=True
JWT_SECRET_KEY=your_secret_key
BROKER_ENCRYPTION_SECRET=your_encryption_key

# Frontend
REACT_APP_API_URL=https://your-api-domain.com
```

## Troubleshooting

### Common Issues
1. **Cookies not being set**: Check CORS and domain settings
2. **Token refresh failing**: Verify middleware configuration
3. **Broker registration errors**: Check database connectivity
4. **Kite login not working**: Verify broker credentials and API keys

### Debug Tips
- Check browser developer tools for cookie values
- Monitor network requests for authentication headers
- Check Django logs for middleware processing
- Verify database records for broker credentials

## Future Enhancements

### Potential Improvements
1. **Multi-broker Support**: Add support for additional brokers
2. **Session Management**: Add session timeout warnings
3. **Security Enhancements**: Add 2FA support
4. **User Management**: Add password reset functionality
5. **Audit Logging**: Track authentication events

This implementation provides a secure, user-friendly authentication system that integrates seamlessly with the existing trading platform while maintaining high security standards. 