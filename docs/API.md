# API Documentation

## Base URL
- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://api.aibuilder.com/api/v1`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe",
  "userType": "business|student|startup|freelancer"
}

Response (201):
{
  "success": true,
  "message": "User registered. Please verify your email.",
  "data": {
    "userId": "1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "business"
  }
}
```

#### Verify Email
```http
POST /auth/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "email": "user@example.com",
      "verified": true
    }
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "userType": "business"
    }
  }
}
```

#### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "message": "Logout successful"
}
```

#### Resend OTP
```http
POST /auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

#### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "newPassword": "NewPassword123"
}

Response (200):
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### Projects

#### Get All Projects
```http
GET /projects
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "My First Website",
      "type": "website",
      "status": "published",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-02T00:00:00Z",
      "url": "https://example.aibuilder.com"
    }
  ]
}
```

#### Create Project
```http
POST /projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "My Website",
  "type": "website|app",
  "idea": "E-commerce store for selling books",
  "style": "Modern|Minimal|Premium",
  "colorTheme": "blue"
}

Response (201):
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "123",
    "name": "My Website",
    "type": "website",
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Project by ID
```http
GET /projects/:id
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Project Name",
    "type": "website",
    "pages": ["home", "about", "contact"],
    "sections": []
  }
}
```

#### Update Project
```http
PUT /projects/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "colorTheme": "green"
}

Response (200):
{
  "success": true,
  "message": "Project updated successfully",
  "data": { ... }
}
```

#### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

### AI Generation

#### Generate Website
```http
POST /ai/generate-website
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "projectId": "123",
  "idea": "E-commerce bookstore",
  "requirements": "Product pages, shopping cart, payment gateway",
  "style": "Modern",
  "colorTheme": "blue"
}

Response (200):
{
  "success": true,
  "message": "Website layout generated",
  "data": {
    "projectId": "123",
    "layout": {
      "pages": [
        {
          "name": "home",
          "title": "Home",
          "sections": [...]
        }
      ]
    },
    "branding": {
      "colors": [...],
      "fonts": [...],
      "logo": "url"
    }
  }
}
```

#### Generate Code
```http
POST /ai/generate-code
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "projectId": "123",
  "pages": ["home", "about"],
  "components": ["header", "footer"]
}

Response (200):
{
  "success": true,
  "message": "Code generated successfully",
  "data": {
    "projectId": "123",
    "frontend": {
      "html": "...",
      "css": "...",
      "javascript": "..."
    },
    "backend": {
      "nodejs": "...",
      "database": "..."
    }
  }
}
```

---

### Deployment

#### Publish Project
```http
POST /deployment/publish
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "projectId": "123",
  "platform": "web|android|ios"
}

Response (200):
{
  "success": true,
  "message": "Publishing started",
  "data": {
    "projectId": "123",
    "status": "publishing",
    "deploymentId": "dep_123",
    "estimatedTime": "5-10 minutes"
  }
}
```

#### Get Deployment Status
```http
GET /deployment/:deploymentId/status
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "deploymentId": "dep_123",
    "status": "completed",
    "url": "https://my-site.aibuilder.com",
    "sslStatus": "active",
    "cdnStatus": "active"
  }
}
```

#### Export Code
```http
POST /deployment/export-code
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "projectId": "123"
}

Response (200):
{
  "success": true,
  "message": "Export started",
  "data": {
    "projectId": "123",
    "downloadUrl": "https://downloads.aibuilder.com/project-export-zip",
    "expiresIn": "24 hours"
  }
}
```

---

### Dashboard

#### Get Stats
```http
GET /dashboard/stats
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "totalProjects": 12,
    "publishedProjects": 8,
    "totalVisitors": 45230,
    "totalSales": 15420,
    "uptime": "99.95%"
  }
}
```

#### Get Analytics
```http
GET /dashboard/analytics
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "trafficByDay": [...],
    "trafficByCountry": [...],
    "deviceBreakdown": {...},
    "topPages": [...]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 99
  - `X-RateLimit-Reset`: 1234567890

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

