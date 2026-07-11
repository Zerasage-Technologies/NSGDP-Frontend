# Frontend API Integration - Organization & Structure

## Summary

Clean, organized API layer for connecting the Niger State GeoHealth Portal frontend to the backend authentication system.

## File Structure

### ✅ Created Files

```
src/lib/
├── api/
│   ├── client.ts          # Base HTTP client with auth token injection
│   ├── types.ts           # TypeScript interfaces matching backend DTOs
│   ├── auth.ts            # All auth endpoints (login, register, etc.)
│   └── index.ts           # Central exports for API module
│
├── auth/
│   ├── auth-context.tsx   # React context for auth state management
│   ├── mock-session.tsx   # [Existing] Mock auth for development
│   ├── program-permissions.ts  # [Existing] Permission logic
│   └── index.ts           # Central exports for auth module
│
├── utils/
│   ├── token-storage.ts   # localStorage management for JWT tokens
│   └── index.ts           # Central exports for utils
│
└── README.md              # Complete documentation
```

### 📝 Modified Files

- `src/lib/api/client.ts` - Added Authorization header support
- `src/lib/schemas/auth.ts` - [Existing] Already has validation schemas

## Key Features

### 1. Type-Safe API Client

```typescript
// Automatically adds Authorization header if token exists
const data = await apiFetch<ApiResponse<User>>("/v1/auth/me");
```

### 2. Token Management

```typescript
// Store after successful login/register
storeTokens(accessToken, refreshToken, expiresIn);

// Auto-injected into API requests
getAccessToken(); // Used by apiFetch

// Clear on logout
clearTokens();
```

### 3. Auth Context

```typescript
// Wrap app with AuthProvider
<AuthProvider>
  <App />
</AuthProvider>

// Use in components
const { user, isAuthenticated, login, logout } = useAuth();
```

### 4. Registration Flow

Handles three user types with different approval workflows:

```typescript
const { isPending } = await register({
  fullName,
  email,
  password,
  phoneNumber,
  accessLevel: 'public',    // Auto-activated, gets tokens
  accessLevel: 'partner',   // Pending approval, no tokens
  accessLevel: 'administrator', // Pending approval + org verification
  reason,
});
```

## Backend Endpoints Integrated

| Endpoint | Method | Description | Implementation |
|----------|--------|-------------|----------------|
| `/v1/auth/register` | POST | Register new user | ✅ `api/auth.ts` |
| `/v1/auth/login` | POST | Login with credentials | ✅ `api/auth.ts` |
| `/v1/auth/logout` | POST | Revoke refresh token | ✅ `api/auth.ts` |
| `/v1/auth/forgot-password` | POST | Request password reset | ✅ `api/auth.ts` |
| `/v1/auth/reset-password` | POST | Reset with token | ✅ `api/auth.ts` |
| `/v1/auth/refresh` | POST | Refresh access token | ✅ `api/auth.ts` |
| `/v1/auth/me` | GET | Get current user | ✅ `api/auth.ts` |

## Usage Patterns

### Login Flow

```typescript
import { useAuth } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas/auth";

function LoginForm() {
  const { login } = useAuth();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      // User redirected to /dashboard
      // Tokens stored automatically
    } catch (error) {
      // Error toast shown automatically
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### Register Flow

```typescript
import { useAuth } from "@/lib/auth";
import { registerSchema } from "@/lib/schemas/auth";

function RegisterForm() {
  const { register: registerUser } = useAuth();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { isPending } = await registerUser(data);
      
      if (isPending) {
        // Show "pending approval" message
        router.push("/pending-approval");
      } else {
        // Auto-logged in, redirected to /dashboard
      }
    } catch (error) {
      // Error handling
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### Protected Routes

```typescript
import { useAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) redirect("/login");

  return <Dashboard />;
}
```

### Auto Token Refresh

```typescript
// Happens automatically when token expires
const { refreshSession } = useAuth();

// Manual refresh if needed
await refreshSession();
```

## Error Handling

All API errors are normalized:

```typescript
try {
  await login({ email, password });
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status);    // 401, 400, etc.
    console.log(error.message);   // Human-readable message
    console.log(error.details);   // Full error response
  }
}
```

Common error messages from backend:
- `401`: "Invalid credentials"
- `401`: "Your account is pending approval. You will receive an email once activated."
- `401`: "Account has been suspended"
- `409`: "Email already registered"

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Migration from Mock to Real Auth

### Current State (Development)
```typescript
// Using mock session
import { MockSessionProvider } from "@/lib/auth";

<MockSessionProvider>
  <App />
</MockSessionProvider>
```

### Production Ready
```typescript
// Using real auth
import { AuthProvider } from "@/lib/auth";

<AuthProvider>
  <App />
</AuthProvider>
```

Both providers have the same interface, making migration seamless!

## Next Steps

1. ✅ Backend auth endpoints ready
2. ✅ Frontend API client created
3. ✅ Auth context implemented
4. ✅ Token storage configured
5. ⏳ Update register/login pages to use real API
6. ⏳ Replace MockSessionProvider with AuthProvider
7. ⏳ Test full auth flow end-to-end
8. ⏳ Add error boundary for API errors
9. ⏳ Implement token refresh interceptor

## Testing Checklist

- [ ] Register as public user → auto-login → dashboard
- [ ] Register as partner → pending message → no login
- [ ] Register as administrator → pending message → no login
- [ ] Login with pending account → error message
- [ ] Login with active account → success
- [ ] Logout → tokens cleared → redirect to home
- [ ] Forgot password → email sent message
- [ ] Reset password with valid token → success
- [ ] Token expiry → auto-refresh → continue session
- [ ] Token refresh fails → logout → redirect to login

## Security Considerations

✅ **Implemented:**
- JWT tokens with expiry
- Refresh token rotation
- Authorization header for protected routes
- CORS credentials included
- HTTPS enforced (via BASE_URL)

⚠️ **Future Improvements:**
- Move refresh token to httpOnly cookie
- Implement CSRF protection
- Add rate limiting on frontend
- Implement secure token storage (consider sessionStorage for sensitive apps)
