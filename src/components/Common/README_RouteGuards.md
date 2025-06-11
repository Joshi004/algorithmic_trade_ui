# Route Guards Implementation

## Overview

This application implements a comprehensive route guard system to control access to different pages based on user authentication status. The system ensures that:

- **Unauthenticated users** cannot access protected routes
- **Authenticated users** are redirected away from guest-only pages (login/signup)
- **Proper redirection** happens after login to the originally intended destination

## Components

### 1. ProtectedRoute Component (`ProtectedRoute.js`)

Protects routes that require authentication.

```jsx
import ProtectedRoute from './components/Common/ProtectedRoute';

<Route 
  path="/stock-management" 
  element={
    <ProtectedRoute>
      <StockManagement />
    </ProtectedRoute>
  } 
/>
```

**Behavior:**
- ✅ **Authenticated users**: Access granted
- ❌ **Unauthenticated users**: Redirected to `/login` with return path
- ⏳ **Loading state**: Shows spinner while checking auth

### 2. GuestRoute Component (`GuestRoute.js`)

Protects routes that should only be accessible to unauthenticated users.

```jsx
import GuestRoute from './components/Common/GuestRoute';

<Route 
  path="/login" 
  element={
    <GuestRoute>
      <Login />
    </GuestRoute>
  } 
/>
```

**Behavior:**
- ✅ **Unauthenticated users**: Access granted
- ❌ **Authenticated users**: Redirected to `/home`
- ⏳ **Loading state**: Shows spinner while checking auth

### 3. AuthGuard Hooks (`useAuthGuard.js`)

Custom hooks for flexible authentication control within components.

```jsx
import { useProtectedRoute, useGuestRoute, useAuthGuard } from '../hooks/useAuthGuard';

// For protected content
const { isAuthenticated, loading, canAccess } = useProtectedRoute();

// For guest-only content  
const { isAuthenticated, loading, canAccess } = useGuestRoute();

// Custom guard
const { isAuthenticated, loading, canAccess } = useAuthGuard(true, '/custom-redirect');
```

## Route Categories

### 🔓 **Public Routes**
Accessible to everyone, regardless of authentication status:
- `/home` - Shows different content based on auth status
- `/` - Redirects to home

### 🛡️ **Protected Routes** 
Require authentication, redirect to login if not authenticated:
- `/stock-management`
- `/trade-management` 
- `/profile`  
- `/broker-registration`

### 👤 **Guest Only Routes**
Only accessible to unauthenticated users, redirect to home if authenticated:
- `/login`
- `/signup`

## Authentication Flow

### 1. **Accessing Protected Route (Unauthenticated)**
```
User visits /stock-management
    ↓
ProtectedRoute checks isAuthenticated = false
    ↓
Redirects to /login with state: { from: { pathname: '/stock-management' } }
    ↓
User logs in successfully
    ↓
Login component reads from state and redirects to /stock-management
```

### 2. **Accessing Guest Route (Authenticated)**
```
Authenticated user visits /login
    ↓
GuestRoute checks isAuthenticated = true
    ↓
Redirects to /home immediately
```

### 3. **Direct Navigation**
```
User types URL directly in browser
    ↓
Route guard components check authentication
    ↓
Redirect or allow access based on rules
```

## Implementation Details

### App.js Route Structure
```jsx
<Routes>
  {/* Guest Only Routes */}
  <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
  <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
  
  {/* Public Routes */}
  <Route path="/home" element={<Home />} />
  
  {/* Protected Routes */}
  <Route path="/stock-management" element={
    <ProtectedRoute><StockManagement /></ProtectedRoute>
  } />
  <Route path="/trade-management" element={
    <ProtectedRoute><TradeManagement /></ProtectedRoute>
  } />
  <Route path="/profile" element={
    <ProtectedRoute><Profile /></ProtectedRoute>
  } />
  <Route path="/broker-registration" element={
    <ProtectedRoute><BrokerRegistration /></ProtectedRoute>
  } />
  
  {/* Default Routes */}
  <Route path="/" element={<Navigate to="/home" replace />} />
  <Route path="*" element={<Navigate to="/home" replace />} />
</Routes>
```

### Authentication Context Integration

The route guards rely on the `AuthContext` for authentication state:

```jsx
const { isAuthenticated, loading } = useAuth();
```

**Key States:**
- `loading: true` - Authentication check in progress
- `loading: false, isAuthenticated: true` - User is authenticated
- `loading: false, isAuthenticated: false` - User is not authenticated

### Token Management Integration

The route guards work seamlessly with the proactive token refresh system:

- **Token expires** → `isAuthenticated` becomes `false` → User redirected to login
- **Token refreshed** → `isAuthenticated` remains `true` → User stays on page
- **Refresh fails** → `isAuthenticated` becomes `false` → User redirected to login

## Security Features

1. **No Route Bypassing**: All protected routes are wrapped with guards
2. **Proper State Management**: Uses React Router's state for return paths
3. **Loading States**: Prevents flashing of unauthorized content
4. **Token Integration**: Works with proactive token refresh system
5. **Fallback Routes**: Unknown routes redirect to home

## Testing the Guards

### Test Scenarios:

1. **Unauthenticated Access**:
   - Try accessing `/stock-management` → Should redirect to login
   - After login → Should redirect back to `/stock-management`

2. **Authenticated Access**:
   - Try accessing `/login` → Should redirect to home
   - Access `/stock-management` → Should work normally

3. **Token Expiry**:
   - Wait for token to expire → Should redirect to login
   - Login again → Should work normally

4. **Direct URLs**:
   - Type protected URLs directly → Should enforce guards
   - Use browser back/forward → Should maintain guards

## Future Enhancements

1. **Role-based Guards**: Add role checking for different user types
2. **Permission Guards**: Fine-grained permission checking
3. **Route Middleware**: Additional validation before route access
4. **Analytics**: Track authentication failures and redirects 