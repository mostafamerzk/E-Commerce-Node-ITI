# Angular Authentication Module - Frontend Implementation Guide

## 🎯 Overview
This document provides frontend developers with all necessary information to build the Angular authentication module. The backend supports user registration, login, account activation, password reset, and token refresh functionality.

---

## 📋 Authentication Features

### 1. **User Registration**
- Allow new users to create accounts as regular users or sellers
- Email validation and verification required before active login
- Password confirmation (client-side validation)

### 2. **User Login**
- Email & password-based authentication
- Returns both access and refresh tokens
- Sets user as logged-in status in backend

### 3. **Account Activation**
- Verification email sent after registration
- Click activation link in email to activate account
- Account must be activated before first login

### 4. **Password Reset Flow**
- "Forgot Password" sends OTP to email
- User submits OTP + new password to reset

### 5. **Token Management**
- Access token for API requests (short-lived)
- Refresh token for obtaining new access tokens (long-lived)
- Automatic token refresh when access token expires

---

## 🔗 API Endpoints

### Base URL
```
POST /auth/register
POST /auth/login
GET  /auth/acctivate_account/:token
POST /auth/forgetPass
POST /auth/resetPass
POST /auth/new_access_token
```

---

## 📤 Request/Response Specifications

### 1. REGISTER
**POST** `/auth/register`

#### Request Body
```json
{
  "userName": "string (5-15 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (min 8 chars, required)",
  "confirmPassword": "string (must match password, required)",
  "isSeller": "boolean (optional, default: false)"
}
```

#### Success Response (201)
```json
{
  "message": "User created successfully"
}
```

#### Error Responses
- **400**: `"Email already in use"`
- **400**: `"Validation error"` (invalid email format, password < 8 chars, etc.)

#### Next Steps
- Show success message
- User receives verification email
- Prompt user to verify email before login

---

### 2. LOGIN
**POST** `/auth/login`

#### Request Body
```json
{
  "email": "string (valid email, required)",
  "password": "string (min 8 chars, required)"
}
```

#### Success Response (200)
```json
{
  "success": "true",
  "message": "login success",
  "access_token": "JWT string",
  "refresh_token": "JWT string"
}
```

#### Error Responses
- **404**: `"Email Not Found!!"`
- **401**: `"invalid password!!"`

#### Client Actions
- Store tokens in localStorage/sessionStorage
- Store user ID and email from token payload
- Redirect to dashboard/home
- Set auth state in global store (NgRx/State Management)

---

### 3. ACCOUNT ACTIVATION
**GET** `/auth/acctivate_account/:token`

#### URL Parameter
```
:token = verification token from email link
```

#### Success Response (200)
```json
{
  "message": "Account activated successfully"
}
```

#### Error Responses
- **400**: `"User not found"`
- **401**: `"Invalid or expired token"`

#### Implementation
- Create activation component that accepts token from URL
- Auto-call this endpoint when user clicks email verification link
- Show success/error message
- Redirect to login page after 3 seconds

---

### 4. FORGET PASSWORD (Request OTP)
**POST** `/auth/forgetPass`

#### Request Body
```json
{
  "email": "string (valid email, required)"
}
```

#### Success Response (200)
```json
{
  "message": "otp sent successfully!!"
}
```

#### Error Responses
- **400**: `"user not found!"`

#### Client Actions
- Show confirmation message: "OTP sent to your email"
- Store email in component/service state
- Navigate to OTP verification step

---

### 5. RESET PASSWORD (With OTP)
**POST** `/auth/resetPass`

#### Request Body
```json
{
  "email": "string (required)",
  "otp": "string (required)",
  "password": "string (min 8 chars, required)",
  "confirmPassword": "string (must match password, required)"
}
```

#### Success Response (201)
```json
{
  "message": "try to login now! "
}
```

#### Error Responses
- **400**: `"user not found!"`
- **401**: `"invalid otp!!"`

#### Client Actions
- Validate OTP input (numeric, required length)
- Show success message
- Redirect to login page

---

### 6. REFRESH ACCESS TOKEN
**POST** `/auth/new_access_token`

#### Request Body
```json
{
  "refresh_token": "JWT string (required)"
}
```

#### Success Response (200)
```json
{
  "message": "success",
  "access_token": "new JWT string"
}
```

#### Error Responses
- **404**: `"Invalid Refresh Token!!"`
- **404**: `"user not found!"`

#### Implementation
- Call this endpoint automatically when access token expires
- Add HTTP interceptor to detect 401 responses and refresh token
- Retry failed request with new access token
- If refresh fails, redirect to login

---

## 🔐 Token Management

### Token Structure
Both access and refresh tokens are JWTs containing:
```json
{
  "id": "user_id (MongoDB ObjectId)",
  "email": "user_email@example.com",
  "iat": "issued at (timestamp)",
  "exp": "expiration (timestamp)"
}
```

### Token Storage Strategy
```
Access Token → Storage: localStorage/sessionStorage
              Lifetime: Short (15-30 minutes recommended)
              Use: Include in API Authorization header

Refresh Token → Storage: httpOnly Cookie (if possible) OR localStorage
                Lifetime: Long (7-30 days)
                Use: Request new access token when expired
```

### HTTP Interceptor Example Flow
```
1. Make API request with access_token in header
2. Server returns 401 (token expired)
3. Interceptor catches 401
4. Call /auth/new_access_token with refresh_token
5. Store new access_token
6. Retry original request
7. If refresh also fails → redirect to login
```

---

## 📝 Validation Rules (Implement on Frontend)

| Field | Rules | Error Message |
|-------|-------|---------------|
| userName | Min 5, Max 15 chars | "Username must be 5-15 characters" |
| email | Valid email format | "Please enter a valid email" |
| password | Min 8 chars | "Password must be at least 8 characters" |
| confirmPassword | Must match password | "Passwords do not match" |
| otp | Required, numeric | "OTP is required" |

---

## 🎨 Recommended Angular Architecture

### 1. **Services Structure**
```
auth-service.ts
├── register(userData)
├── login(email, password)
├── logout()
├── forgotPassword(email)
├── resetPassword(email, otp, password)
├── activateAccount(token)
├── refreshAccessToken(refreshToken)
└── getStoredTokens()

token.service.ts
├── saveTokens(accessToken, refreshToken)
├── getAccessToken()
├── getRefreshToken()
├── clearTokens()
└── isTokenExpired()
```

### 2. **Guards (Route Protection)**
```
auth.guard.ts → Check if user is authenticated before accessing protected routes
role.guard.ts → Check user role (seller vs buyer) for seller-specific routes
```

### 3. **State Management (NgRx/Signals)**
```
auth.state.ts
├── isAuthenticated: boolean
├── user: { id, email, userName, isSeller }
├── accessToken: string
├── refreshToken: string
└── loading: boolean
```

### 4. **HTTP Interceptor**
```
auth.interceptor.ts
├── Add access_token to all requests
├── Handle 401 responses → refresh token flow
└── Redirect to login on refresh failure
```

### 5. **Components Structure**
```
auth/
├── register/
│  └── register.component.ts
├── login/
│  └── login.component.ts
├── forgot-password/
│  ├── request-otp.component.ts
│  └── reset-password.component.ts
├── activate-account/
│  └── activate-account.component.ts
└── auth.service.ts
```

---

## 🚀 Implementation Checklist

### Phase 1: Setup
- [ ] Create auth service with all API methods
- [ ] Create token service for token management
- [ ] Setup HTTP interceptor for authorization headers
- [ ] Create auth guard for route protection
- [ ] Setup state management (NgRx or Signal-based)

### Phase 2: Components
- [ ] Build login component with form validation
- [ ] Build register component with role selection
- [ ] Build forgot password flow (2 steps: OTP request & reset)
- [ ] Build account activation component
- [ ] Add loading states and error handling

### Phase 3: Integration
- [ ] Implement token refresh mechanism
- [ ] Add logout functionality
- [ ] Store user info in state after login
- [ ] Protect dashboard/seller routes with auth guard
- [ ] Show user profile/logout button in header

### Phase 4: Polish
- [ ] Add error notifications (Toast/Snackbar)
- [ ] Implement "remember me" functionality
- [ ] Add password strength indicator
- [ ] Implement session timeout
- [ ] Add email verification resend option

---

## 💡 Key Implementation Notes

1. **Email Verification**: Registration endpoint sends email automatically. User must verify before login.

2. **Token Expiration**: Implement automatic token refresh. Don't wait for 401 error if possible.

3. **Security**: 
   - Never store passwords
   - Use httpOnly cookies for refresh tokens if possible
   - Always use HTTPS in production
   - Implement CSRF protection

4. **User Experience**:
   - Show loading spinners during API calls
   - Display clear error messages
   - Implement "forgot password" prominently
   - Allow resending verification email

5. **Provider Support**: Backend supports two auth providers:
   - `system`: Email/password (standard)
   - `google`: OAuth (commented out, but infrastructure exists for future)

---

## 📞 Common Scenarios

### Scenario 1: New User Registration Flow
```
1. User fills registration form (userName, email, password, isSeller)
2. Submit to POST /auth/register
3. Show: "Check your email to verify account"
4. User clicks link in email → GET /auth/acctivate_account/:token
5. Account activated, redirect to login
6. User logs in with email/password
7. Receive access & refresh tokens
8. Redirect to dashboard
```

### Scenario 2: Forgot Password Flow
```
1. User clicks "Forgot Password" on login
2. Enter email → POST /auth/forgetPass
3. OTP sent to email
4. User enters OTP + new password
5. Submit to POST /auth/resetPass
6. Success → redirect to login
7. Login with new password
```

### Scenario 3: Automatic Token Refresh
```
1. User makes API request with access_token
2. API returns 401 (token expired)
3. Interceptor detects 401
4. POST /auth/new_access_token with refresh_token
5. Receive new access_token
6. Interceptor retries original request
7. Request succeeds
```

---

## 🔧 Environment Configuration

Create environment files:

**environment.ts** (Development)
```typescript
export const environment = {
  apiUrl: 'http://localhost:5000/api',
  tokenExpiryTime: 15 * 60 * 1000 // 15 minutes in ms
};
```

**environment.prod.ts** (Production)
```typescript
export const environment = {
  apiUrl: 'https://api.yourdomain.com/api',
  tokenExpiryTime: 15 * 60 * 1000
};
```

---

## ✅ Backend Response Format

All endpoints follow this response pattern:

**Success**:
```json
{
  "message": "string",
  "success": "true",
  "access_token": "optional token",
  "refresh_token": "optional token"
}
```

**Error**:
```json
{
  "message": "error description"
}
```

HTTP Status Code indicates success/failure (200, 201, 400, 401, 404, etc.)

---

## 📝 Additional Notes

- All passwords are hashed on backend using bcrypt
- User account has `isAcctivated` flag that must be true for login
- `isSeller` flag determines seller/buyer functionality
- `isLogged` flag is set to true after successful login
- `provider` field indicates auth method (system or google)

---

**Last Updated**: February 2026
**Backend Repository**: Connected to this auth module
**Frontend Framework**: Angular 15+
