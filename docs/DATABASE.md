# Database Schema

## Database Type
- **Primary**: MongoDB (for flexibility) or PostgreSQL (for relational integrity)
- **Cache**: Redis
- **Backup**: AWS S3

---

## Collections/Tables

### Users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed - bcrypt),
  name: String,
  userType: String (enum: ['business', 'student', 'startup', 'freelancer']),
  avatar: String,
  emailVerified: Boolean,
  twoFactorEnabled: Boolean,
  phone: String,
  company: String,
  
  // Subscription
  plan: String (enum: ['free', 'pro', 'business']),
  trialEndsAt: Date,
  subscriptionEndsAt: Date,
  
  // Preferences
  theme: String,
  language: String,
  notifications: {
    email: Boolean,
    push: Boolean,
    sms: Boolean
  },
  
  // Metadata
  lastLogin: Date,
  loginCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Projects
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  name: String,
  description: String,
  type: String (enum: ['website', 'app']),
  
  // AI Configuration
  idea: String,
  requirements: String,
  style: String (enum: ['Modern', 'Minimal', 'Premium']),
  colorTheme: String,
  
  // Status
  status: String (enum: ['draft', 'published', 'archived']),
  publishedUrl: String,
  
  // Pages
  pages: [
    {
      _id: ObjectId,
      name: String,
      slug: String,
      title: String,
      description: String,
      icon: String
    }
  ],
  
  // Analytics
  visitorsCount: Number,
  conversions: Number,
  revenue: Number,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date
}
```

### Pages
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Projects),
  userId: ObjectId (ref: Users),
  name: String,
  slug: String,
  title: String,
  description: String,
  
  // Content
  sections: [
    {
      _id: ObjectId,
      type: String (enum: ['hero', 'features', 'cta', 'testimonials', etc.]),
      title: String,
      description: String,
      content: Object,
      image: String,
      order: Number
    }
  ],
  
  // SEO
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  
  // Status
  published: Boolean,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Components
```javascript
{
  _id: ObjectId,
  name: String,
  category: String (enum: ['header', 'footer', 'card', 'button', etc.]),
  html: String,
  css: String,
  javascript: String,
  preview: String,
  
  // Library
  isPublic: Boolean,
  userId: ObjectId (ref: Users, null if public),
  downloads: Number,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Deployments
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Projects),
  userId: ObjectId (ref: Users),
  
  // Deployment Info
  status: String (enum: ['pending', 'publishing', 'completed', 'failed']),
  version: String,
  url: String,
  
  // Infrastructure
  hosting: String (enum: ['vercel', 'heroku', 'aws', 'custom']),
  domain: String,
  sslStatus: String,
  cdnStatus: String,
  
  // Logs
  logs: [String],
  error: String,
  
  createdAt: Date,
  completedAt: Date
}
```

### Forms
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Projects),
  pageId: ObjectId (ref: Pages),
  
  name: String,
  fields: [
    {
      _id: ObjectId,
      name: String,
      label: String,
      type: String (enum: ['text', 'email', 'phone', 'textarea', etc.]),
      required: Boolean,
      placeholder: String
    }
  ],
  
  // Notifications
  notificationEmail: String,
  webhookUrl: String,
  
  // Submissions
  submissionsCount: Number,
  
  createdAt: Date,
  updatedAt: Date
}
```

### FormSubmissions
```javascript
{
  _id: ObjectId,
  formId: ObjectId (ref: Forms),
  projectId: ObjectId (ref: Projects),
  
  // Data
  data: Object (dynamic based on form fields),
  
  // Metadata
  ipAddress: String,
  userAgent: String,
  
  createdAt: Date
}
```

### Analytics
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Projects),
  pageId: ObjectId (ref: Pages),
  
  // Events
  eventType: String (enum: ['pageview', 'click', 'form_submit', etc.]),
  
  // User Info
  userId: String (anonymous or logged-in),
  ipAddress: String,
  userAgent: String,
  
  // Location
  country: String,
  city: String,
  
  // Device
  device: String (enum: ['mobile', 'tablet', 'desktop']),
  browser: String,
  
  // Timing
  timestamp: Date,
  sessionDuration: Number
}
```

### Payments
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  
  // Payment Info
  amount: Number,
  currency: String,
  status: String (enum: ['pending', 'completed', 'failed', 'refunded']),
  
  // Plan
  plan: String,
  billingPeriod: String,
  
  // Gateway
  gateway: String (enum: ['stripe', 'razorpay']),
  transactionId: String,
  invoiceId: String,
  
  createdAt: Date,
  completedAt: Date
}
```

### ApiKeys
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  
  name: String,
  key: String (hashed),
  
  // Permissions
  permissions: [String],
  
  // Usage
  lastUsedAt: Date,
  requestCount: Number,
  
  // Status
  active: Boolean,
  
  createdAt: Date,
  expiresAt: Date
}
```

### AuditLogs
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  projectId: ObjectId (ref: Projects),
  
  action: String,
  resourceType: String,
  resourceId: String,
  
  // Change Tracking
  previousValue: Object,
  newValue: Object,
  
  // Metadata
  ipAddress: String,
  userAgent: String,
  
  createdAt: Date
}
```

### Backups
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Projects),
  
  name: String,
  backupUrl: String,
  size: Number,
  
  // Status
  status: String (enum: ['completed', 'failed']),
  
  // Metadata
  automatedBackup: Boolean,
  
  createdAt: Date,
  expiresAt: Date
}
```

---

## Indexes

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

// Projects
db.projects.createIndex({ userId: 1, createdAt: -1 });
db.projects.createIndex({ status: 1 });

// Pages
db.pages.createIndex({ projectId: 1 });

// Analytics
db.analytics.createIndex({ projectId: 1, timestamp: -1 });
db.analytics.createIndex({ pageId: 1 });

// FormSubmissions
db.form_submissions.createIndex({ formId: 1, createdAt: -1 });

// Deployments
db.deployments.createIndex({ projectId: 1, createdAt: -1 });
```

---

## Relationships

```
Users
├── Projects (1:N)
│   ├── Pages (1:N)
│   │   └── Sections (1:N)
│   ├── Forms (1:N)
│   │   └── FormSubmissions (1:N)
│   ├── Deployments (1:N)
│   └── Analytics (1:N)
├── ApiKeys (1:N)
├── Payments (1:N)
└── AuditLogs (1:N)
```

---

## Backup Strategy

- Daily automated backups to AWS S3
- Point-in-time recovery enabled
- 30-day retention policy
- Encrypted backups
- Tested restore procedures

