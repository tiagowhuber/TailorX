# TailorX Authentication Setup

## Frontend Configuration

### 1. Environment Variables

Create a `.env` file in the TailorX root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 2. Installed Packages

- **axios**: HTTP client for API calls
- **pinia**: State management library

### 3. Project Structure

```
src/
├── lib/
│   ├── api.ts          # Axios instance with interceptors
│   └── utils.ts
├── stores/
│   └── auth.ts         # Authentication store (Pinia)
├── views/
│   ├── CreateAccountView.vue  # Registration page
│   └── LoginView.vue          # Login page
└── main.ts             # App initialization with Pinia
```

## Authentication Features

### Auth Store (Pinia)

Located at `src/stores/auth.ts`, provides:

**State:**
- `user`: Current user object
- `token`: JWT authentication token
- `loading`: Loading state for async operations
- `error`: Error messages

**Getters:**
- `isAuthenticated`: Boolean indicating if user is logged in
- `userName`: User's full name or email

**Actions:**
- `login(credentials)`: Login with email and password
- `register(credentials)`: Create new account
- `logout()`: Clear session and redirect
- `getCurrentUser()`: Fetch current user data
- `initializeAuth()`: Restore session from localStorage
- `signInWithGoogle()`: Google OAuth (placeholder)

### API Client

Located at `src/lib/api.ts`:

- Axios instance configured with base URL from environment variables
- Request interceptor: Automatically adds JWT token to requests
- Response interceptor: Handles 401 errors and redirects to login

### Authentication Flow

#### Registration:
1. User fills form in `CreateAccountView.vue`
2. Form validation (password match, length)
3. Calls `authStore.register()` with user data
4. API returns user object and JWT token
5. Token and user stored in localStorage
6. Redirect to home page

#### Login:
1. User fills form in `LoginView.vue`
2. Form validation
3. Calls `authStore.login()` with credentials
4. API validates and returns JWT token
5. Token and user stored in localStorage
6. Redirect to home page

#### Google Sign-In:
Currently a placeholder. To implement:
1. Set up Google OAuth 2.0 credentials
2. Add `VITE_GOOGLE_CLIENT_ID` to `.env`
3. Implement Google OAuth library
4. Send Google token to backend for verification
5. Backend creates/finds user and returns JWT token

## Backend Configuration

### CORS Setup

The backend API (`TailorX-api`) has been configured with CORS to accept requests from the frontend:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

### Available Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (protected)
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/refresh` - Refresh JWT token (protected)

## Running the Application

### Backend (TailorX-api):

```bash
cd TailorX-api
npm run dev
```

Server runs at `http://localhost:3000`

### Frontend (TailorX):

```bash
cd TailorX
npm run dev
```

Frontend runs at `http://localhost:5173`

## Security Notes

1. **JWT Tokens**: Stored in localStorage (consider httpOnly cookies for production)
2. **Password Requirements**: Minimum 8 characters
3. **Token Expiration**: Configure in backend JWT settings
4. **HTTPS**: Use HTTPS in production
5. **Environment Variables**: Never commit `.env` file (already in `.gitignore`)

## Google OAuth Setup (TODO)

To enable Google Sign-In:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins: `http://localhost:5173`
6. Add authorized redirect URIs
7. Copy Client ID to `.env` as `VITE_GOOGLE_CLIENT_ID`
8. Implement Google OAuth library in frontend
9. Create backend endpoint to verify Google tokens

## Testing

### Test Registration:
1. Navigate to `/crear-cuenta`
2. Fill in the form
3. Submit and check network tab for API call
4. Verify redirect to home page
5. Check localStorage for token and user

### Test Login:
1. Navigate to `/login`
2. Enter registered credentials
3. Submit and verify authentication
4. Check that token is added to subsequent API requests

## Troubleshooting

### CORS Errors:
- Ensure backend is running on port 3000
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS configuration in backend

### Authentication Not Persisting:
- Check localStorage in browser DevTools
- Verify `initializeAuth()` is called on app startup
- Check token expiration settings

### API Connection Issues:
- Verify backend server is running
- Check console for network errors
- Ensure API routes are properly mounted at `/api`
