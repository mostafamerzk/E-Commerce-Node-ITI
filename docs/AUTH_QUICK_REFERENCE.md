# Auth Module - Quick Reference Guide

## 🎯 At a Glance

| Endpoint | Method | Purpose | Returns |
|----------|--------|---------|---------|
| `/auth/register` | POST | Create new account | Success message |
| `/auth/login` | POST | Sign in user | access_token, refresh_token |
| `/auth/acctivate_account/:token` | GET | Verify email | Success message |
| `/auth/forgetPass` | POST | Request password reset OTP | Success message |
| `/auth/resetPass` | POST | Reset password with OTP | Success message |
| `/auth/new_access_token` | POST | Get new access token | new access_token |

---

## 📋 Input/Output Reference

### Register
```javascript
// INPUT
{
  userName: "john_doe",      // 5-15 chars
  email: "user@example.com",
  password: "secure123",     // 8+ chars
  confirmPassword: "secure123",
  isSeller: false            // optional
}

// SUCCESS RESPONSE (201)
{ message: "User created successfully" }

// ERRORS
400 → "Email already in use"
400 → Validation errors
```

### Login
```javascript
// INPUT
{
  email: "user@example.com",
  password: "secure123"
}

// SUCCESS RESPONSE (200)
{
  success: "true",
  message: "login success",
  access_token: "eyJhbGc...",
  refresh_token: "eyJhbGc..."
}

// ERRORS
404 → "Email Not Found!!"
401 → "invalid password!!"
```

### Activate Account
```javascript
// INPUT: GET /auth/acctivate_account/TOKEN_FROM_EMAIL

// SUCCESS RESPONSE (200)
{ message: "Account activated successfully" }

// ERRORS
400 → "User not found"
401 → Invalid/expired token
```

### Forgot Password (Request OTP)
```javascript
// INPUT
{ email: "user@example.com" }

// SUCCESS RESPONSE (200)
{ message: "otp sent successfully!!" }

// ERRORS
400 → "user not found!"
```

### Reset Password
```javascript
// INPUT
{
  email: "user@example.com",
  otp: "123456",
  password: "newpass123",      // 8+ chars
  confirmPassword: "newpass123"
}

// SUCCESS RESPONSE (201)
{ message: "try to login now! " }

// ERRORS
400 → "user not found!"
401 → "invalid otp!!"
```

### Refresh Access Token
```javascript
// INPUT
{ refresh_token: "eyJhbGc..." }

// SUCCESS RESPONSE (200)
{
  message: "success",
  access_token: "eyJhbGc..." // New token!
}

// ERRORS
404 → "Invalid Refresh Token!!"
404 → "user not found!"
```

---

## 🔑 Token Structure

Both tokens decode to:
```json
{
  "id": "MongoDB_User_ID",
  "email": "user@example.com",
  "iat": 1708000000,
  "exp": 1708003600
}
```

---

## 📊 User Flow Diagram

```
User → Register → Verify Email → Account Activated
                      ↓
                 Click Email Link
                 GET /acctivate_account/:token
                      ↓
                 isAcctivated = true
                      ↓
User → Login (email + password) → Check Email → Check Password
                                       ↓              ↓
                                    404-Error    401-Error
                                       
                                 ✓ Both Valid
                                       ↓
                        Return: access_token, refresh_token
                                       ↓
                        Save tokens + Redirect Dashboard
```

---

## 🔄 Token Refresh Flow

```
API Request with access_token
         ↓
    Server responds 401
         ↓
Interceptor catches error
         ↓
POST /auth/new_access_token with refresh_token
         ↓
Receive new access_token
         ↓
Retry original request
         ↓
Success ✓
```

---

## 🛡️ Implementation Quick Tips

### Service Methods Needed
```typescript
register(userData)
login(email, password)
logout()
forgotPassword(email)
resetPassword(email, otp, password)
activateAccount(token)
refreshAccessToken()
getAccessToken()
saveTokens()
```

### Guard Needed
```typescript
canActivate() → Check if isAuthenticated
```

### Interceptor Needed
```typescript
Add Authorization header: "Bearer access_token"
Catch 401 errors → Refresh token
Retry request
```

### Storage
```
Access Token → localStorage (or sessionStorage)
Refresh Token → localStorage (httpOnly cookie if possible)
```

---

## ✅ Component Checklist

- [ ] Login Component
  - [ ] Email input
  - [ ] Password input
  - [ ] Submit button
  - [ ] Forgot password link
  - [ ] Register link
  - [ ] Loading state
  - [ ] Error display

- [ ] Register Component
  - [ ] Username input (5-15 chars)
  - [ ] Email input
  - [ ] Password input
  - [ ] Confirm password input
  - [ ] isSeller checkbox
  - [ ] Terms & conditions
  - [ ] Submit button
  - [ ] Validation feedback
  - [ ] Login link

- [ ] Forgot Password Component
  - [ ] Step 1: Email input → Send OTP
  - [ ] Step 2: OTP input + New password → Reset
  - [ ] Back to login link

- [ ] Email Verification Component
  - [ ] Auto-extract token from URL
  - [ ] Auto-call activation endpoint
  - [ ] Show success/error message
  - [ ] Redirect to login

---

## 🚨 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| 400 "Email already in use" | Email exists | Show message, suggest login |
| 401 "invalid password" | Wrong password | Show error, prevent brute force |
| 404 "Email Not Found" | User doesn't exist | Show error, suggest registration |
| 401 "Invalid OTP" | Wrong OTP value | Show error, suggest resend |
| 401 "Invalid Refresh Token" | Token expired/invalid | Force logout, redirect to login |

---

## 📝 Form Validation Rules

```typescript
// Frontend validation (before sending to backend)

userName: {
  required: true,
  minLength: 5,
  maxLength: 15,
  pattern: /^[a-zA-Z0-9_]*$/ // alphanumeric + underscore
}

email: {
  required: true,
  email: true
}

password: {
  required: true,
  minLength: 8,
  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]*$/ // at least 1 letter + 1 number
}

confirmPassword: {
  required: true,
  mustMatch: password // custom validator
}

otp: {
  required: true,
  length: 6, // typically 6 digits
  pattern: /^\d{6}$/ // numbers only
}
```

---

## 🔗 API Base URL

Development: `http://localhost:5000/api`
Production: `https://api.yourdomain.com/api`

Add `/auth` prefix to all endpoints.

**Example**:
```
POST http://localhost:5000/api/auth/login
POST http://localhost:5000/api/auth/register
GET http://localhost:5000/api/auth/acctivate_account/TOKEN
```

---

## 📧 Email Lifecycle

1. **Registration Email** (automatic)
   - Sent after successful registration
   - Contains: Activation link with token
   - Action: User clicks link

2. **Password Reset Email** (on request)
   - Sent after POST /auth/forgetPass
   - Contains: OTP code
   - Action: User enters OTP on form

---

## 🎨 Recommended UI States

### Loading State
- Disable submit button
- Show spinner/loader
- Display "Processing..."

### Error State
- Display error message (toast/alert/inline)
- Keep form filled
- Allow retry

### Success State
- Show success message
- Clear sensitive fields
- Auto-redirect after 2-3 seconds

### Authenticated State
- Show user profile menu
- Display logout button
- Enable protected routes

---

## 💾 State Management Structure

```typescript
interface AuthState {
  user: {
    id: string;
    email: string;
    userName: string;
    isSeller: boolean;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Actions needed
register, login, logout, forgotPassword, 
resetPassword, activateAccount, refreshToken,
setUser, setTokens, clearAuth
```

---

## 🔐 Security Checklist

- [ ] Use HTTPS only in production
- [ ] Store sensitive tokens securely (httpOnly cookies preferred)
- [ ] Implement token expiration checks
- [ ] Clear tokens on logout
- [ ] Validate all input on frontend
- [ ] Don't expose tokens in URLs
- [ ] Use secure password requirements
- [ ] Implement rate limiting for login attempts
- [ ] CSRF protection enabled
- [ ] XSS protection in place

---

**Quick Links**:
- Detailed Guide: `ANGULAR_AUTH_SUMMARY.md`
- Backend Code: `/src/modules/auth/`
- Task List: `/docs/tasks.md`
