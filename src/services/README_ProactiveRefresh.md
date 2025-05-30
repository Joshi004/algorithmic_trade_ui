# Proactive Token Refresh System

## Overview

This system implements **proactive token refresh** to ensure that the `isAuthenticated` state in the AuthContext always reflects the actual token validity. Instead of waiting for API calls to fail with 401 errors, tokens are refreshed automatically before they expire.

## How It Works

### 1. **Backend Changes**
- **Login API** (`/login`) now returns token expiry information:
  ```json
  {
    "message": "Login successful",
    "user": { "email": "user@example.com", "public_id": "..." },
    "token_info": {
      "slt_expires_in_seconds": 60,
      "slt_expires_at": "2024-01-15T10:30:00Z"
    }
  }
  ```
- **Refresh Token API** (`/refresh-token`) also returns token expiry information:
  ```json
  {
    "message": "Token refreshed successfully",
    "token_info": {
      "slt_expires_in_seconds": 60,
      "slt_expires_at": "2024-01-15T10:35:00Z"
    }
  }
  ```

### 2. **TokenManager Class**
- Manages proactive refresh with **10% safety margin**
- If SLT expires in 60 seconds, refresh is triggered after 54 seconds (60 - 6)
- Uses `setTimeout` to schedule refresh before expiry
- Handles refresh failures by calling `onTokenExpired` callback

### 3. **AuthContext Integration**
- Sets up callbacks with TokenManager on initialization
- Starts token management after successful login
- Stops token management on logout or authentication failure
- Provides `getTokenStatus()` for debugging

### 4. **Safety Margin Calculation**
```javascript
const expiresInMs = tokenInfo.slt_expires_in_seconds * 1000;
const safetyMarginMs = (expiresInMs * 10) / 100; // 10% margin
const refreshAfterMs = expiresInMs - safetyMarginMs;
```

## Token Lifecycle

```
Login → SLT expires in 1 minute (60s)
     → TokenManager schedules refresh after 54 seconds (60s - 6s)
     → Refresh happens automatically
     → New SLT expires in 1 minute
     → Cycle continues...
```

## Key Benefits

1. **Accurate Authentication State**: `isAuthenticated` reflects actual token validity
2. **Seamless User Experience**: No failed API calls due to expired tokens
3. **Proactive Security**: Tokens are refreshed before expiry, not after failure
4. **Automatic Management**: No manual intervention required
5. **Graceful Failure Handling**: Falls back to login redirect if refresh fails

## Current Configuration

- **SLT (Short Lived Token) expiry**: 1 minute (60 seconds)
- **Safety margin**: 10% (6 seconds for 1-minute tokens)
- **Refresh timing**: 54 seconds after token issue
- **LLT (Long Lived Token) expiry**: 24 hours (for refresh operations)

## Components

### TokenManager (`src/services/tokenManager.js`)
- Singleton class managing token refresh schedules
- Methods: `startTokenManagement()`, `stopTokenManagement()`, `isTokenExpired()`

### AuthContext (`src/contexts/AuthContext.js`)
- Integrates with TokenManager
- Provides callbacks for token events
- Maintains accurate `isAuthenticated` state

### TokenStatus (`src/components/Common/TokenStatus.js`)
- Debug component showing real-time token status
- Shows time until expiry and authentication state
- Useful for development and monitoring

## Testing

The `TokenStatus` component can be added to any page during development:
```jsx
import TokenStatus from '../Common/TokenStatus';

// In your component render:
<TokenStatus show={true} />
```

This will show a floating card with:
- Token status (Valid/Expired)
- Time until expiry (live countdown)
- Authentication state

## Error Handling

If token refresh fails:
1. TokenManager calls `onTokenExpired` callback
2. AuthContext sets `isAuthenticated = false`
3. User is automatically redirected to login
4. All token management is stopped

## Cookie Names

- **SLT Cookie**: `slt` (contains the Short Lived Token)
- **LLT Cookie**: `llt` (contains the Long Lived Token)

## Token Types

- **SLT (Short Lived Token)**: Used for API access, expires in 1 minute
- **LLT (Long Lived Token)**: Used only for refreshing SLT, expires in 24 hours

## Future Enhancements

1. **Network-aware refresh**: Delay refresh if network is offline
2. **User activity monitoring**: Only refresh if user is active
3. **Background tab handling**: Pause refresh in background tabs
4. **Configurable margins**: Allow different safety margins per environment 