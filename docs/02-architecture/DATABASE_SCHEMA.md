# 🗄️ DATABASE SCHEMA

Complete database schema documentation for all 14 models.

---

## 📊 Database Overview

- **Database:** MongoDB
- **Total Models:** 14
- **Total Collections:** 14
- **Database Name:** `dicoding-capstone`

---

## 👤 User Model

**Collection:** `users`

```javascript
{
  _id: ObjectId,

  // Basic Info
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required for local auth),

  // Authentication
  provider: String (enum: ['local', 'google']),
  googleId: String (for Google OAuth),

  // Profile
  dicodingId: String (unique, auto-generated),
  profilePicture: String (Cloudinary URL),
  university: String,

  // Learning Path
  learningPathId: ObjectId (ref: LearningPath),
  learningPathName: String,

  // Role & Status
  role: String (enum: ['student', 'admin', 'mentor']),
  capstoneGroupId: ObjectId (ref: CapstoneGroup),

  // Timestamps
  lastLogin: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `email` (unique)
- `dicodingId` (unique)
- `provider`
- `learningPathId`

---

## 🎓 LearningPath Model

**Collection:** `learningpaths`

```javascript
{
  _id: ObjectId,

  // Basic Info
  name: String (unique, required),
  code: String (unique, required),
  description: String,

  // Configuration
  dicodingIdPrefix: String (e.g., 'ML', 'FEBE', 'REBE'),
  isActive: Boolean (default: true),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `name` (unique)
- `code` (unique)
- `isActive`

**Example Data:**

```json
{
  "name": "Machine Learning",
  "code": "ML",
  "dicodingIdPrefix": "ML",
  "description": "Learn machine learning fundamentals"
}
```

---

## 📋 UseCase Model

**Collection:** `usecases`

```javascript
{
  _id: ObjectId,

  // Basic Info
  name: String (required),
  code: String (unique, required),
  description: String,

  // Team Composition
  totalTeamSize: Number (required),
  composition: [
    {
      learningPath: String,
      count: Number
    }
  ],

  // Configuration
  isActive: Boolean (default: true),
  maxSlots: Number,
  usedSlots: Number (default: 0),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `code` (unique)
- `isActive`

**Example Data:**

```json
{
  "name": "DC-01",
  "code": "DC-01",
  "totalTeamSize": 5,
  "composition": [
    { "learningPath": "Front-End Web & Back-End with AI", "count": 2 },
    { "learningPath": "Machine Learning", "count": 3 }
  ],
  "maxSlots": 10,
  "usedSlots": 3
}
```

---

## 👥 CapstoneGroup (Team) Model

**Collection:** `capstonegroups`

```javascript
{
  _id: ObjectId,

  // Basic Info
  name: String (required),
  leaderId: ObjectId (ref: User, required),

  // Team Members
  memberIds: [ObjectId] (ref: User),

  // Use Case & Learning Paths
  useCaseId: ObjectId (ref: UseCase),
  learningPaths: [String],

  // Status
  status: String (enum: ['pending', 'approved', 'rejected']),
  rejectionReason: String,

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `leaderId`
- `useCaseId`
- `status`

---

## 📧 Invitation Model

**Collection:** `invitations`

```javascript
{
  _id: ObjectId,

  // References
  leaderId: ObjectId (ref: User),
  memberId: ObjectId (ref: User),
  teamId: ObjectId (ref: CapstoneGroup),

  // Status
  status: String (enum: ['pending', 'accepted', 'rejected']),
  rejectionReason: String,

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `memberId`
- `teamId`
- `status`

---

## 📄 Document Model

**Collection:** `documents`

```javascript
{
  _id: ObjectId,

  // Basic Info
  title: String (required),
  description: String,

  // File Info
  fileName: String,
  fileUrl: String (Cloudinary or local URL),
  fileSize: Number,
  mimeType: String,

  // Categorization
  category: String (enum: ['guidelines', 'template', 'example', 'other']),

  // Metadata
  uploadedBy: ObjectId (ref: User),
  isPublic: Boolean (default: true),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `category`
- `uploadedBy`
- `isPublic`

---

## 📅 Timeline Model

**Collection:** `timelines`

```javascript
{
  _id: ObjectId,

  // Basic Info
  title: String (required),
  description: String,

  // Dates
  startDate: Date (required),
  endDate: Date (required),

  // Type & Status
  type: String (enum: ['milestone', 'deadline', 'event']),
  status: String (enum: ['upcoming', 'ongoing', 'completed', 'overdue']),

  // Metadata
  createdBy: ObjectId (ref: User),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `type`
- `status`
- `startDate`
- `endDate`

---

## 📢 Announcement Model

**Collection:** `announcements`

```javascript
{
  _id: ObjectId,

  // Basic Info
  title: String (required),
  content: String (required),

  // Priority & Status
  priority: String (enum: ['low', 'medium', 'high']),
  isPublished: Boolean (default: true),

  // Metadata
  createdBy: ObjectId (ref: User),
  viewCount: Number (default: 0),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `priority`
- `isPublished`
- `createdAt`

---

## 📋 Worksheet Model

**Collection:** `worksheets`

```javascript
{
  _id: ObjectId,

  // References
  studentId: ObjectId (ref: User),
  worksheetPeriodId: ObjectId (ref: WorksheetPeriod),
  teamId: ObjectId (ref: CapstoneGroup),

  // Content
  description: String (required, min: 50 chars),
  attachments: [
    {
      fileName: String,
      fileUrl: String,
      fileSize: Number
    }
  ],

  // Status & Validation
  status: String (enum: ['draft', 'submitted', 'completed', 'incomplete']),
  submittedAt: Date,
  isLate: Boolean (default: false),

  // Admin Review
  validatedBy: ObjectId (ref: User),
  validationNotes: String,
  validatedAt: Date,

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `studentId`
- `worksheetPeriodId`
- `teamId`
- `status`

---

## 📅 WorksheetPeriod Model

**Collection:** `worksheetperiods`

```javascript
{
  _id: ObjectId,

  // Basic Info
  periodNumber: Number (required),
  title: String (required),
  description: String,

  // Dates
  startDate: Date (required),
  endDate: Date (required),
  autoValidationDate: Date,

  // Status
  status: String (enum: ['draft', 'active', 'closed', 'validated']),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `periodNumber`
- `status`
- `startDate`

---

## 👥 LearningGroup Model

**Collection:** `learninggroups`

```javascript
{
  _id: ObjectId,

  // Basic Info
  name: String (required),
  description: String,

  // Members
  mentorId: ObjectId (ref: User),
  memberIds: [ObjectId] (ref: User),

  // Metadata
  isActive: Boolean (default: true),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `mentorId`
- `isActive`

---

## 🔢 Counter Model

**Collection:** `counters`

```javascript
{
  _id: String (e.g., 'dicodingId'),
  sequence: Number
}
```

**Purpose:** Auto-increment counter for generating dicodingId

**Example:**

```json
{
  "_id": "dicodingId",
  "sequence": 1234
}
```

---

## 📊 Relationships Diagram

```
User
├── learningPathId → LearningPath
├── capstoneGroupId → CapstoneGroup
└── (many) Invitation (as leaderId or memberId)

CapstoneGroup
├── leaderId → User
├── memberIds → User (array)
└── useCaseId → UseCase

UseCase
└── (referenced by) CapstoneGroup

Invitation
├── leaderId → User
├── memberId → User
└── teamId → CapstoneGroup

Document
└── uploadedBy → User

Timeline
└── createdBy → User

Announcement
└── createdBy → User

Worksheet
├── studentId → User
├── worksheetPeriodId → WorksheetPeriod
├── teamId → CapstoneGroup
└── validatedBy → User

WorksheetPeriod
└── (referenced by) Worksheet

LearningGroup
├── mentorId → User
└── memberIds → User (array)

LearningPath
└── (referenced by) User
```

---

## 🔍 Indexing Strategy

### High-Frequency Queries

- `users.email` (unique)
- `users.dicodingId` (unique)
- `capstonegroups.status`
- `invitations.memberId`
- `worksheets.studentId`

### Sorting Queries

- `timelines.startDate`
- `announcements.createdAt`
- `documents.createdAt`

### Filtering Queries

- `usecases.isActive`
- `learninggroups.isActive`
- `announcements.priority`

---

## 📈 Data Growth Estimates

Assuming 30,000 students:

| Collection     | Estimated Records | Size        |
| -------------- | ----------------- | ----------- |
| users          | 30,000            | 150 MB      |
| capstonegroups | 6,000             | 30 MB       |
| invitations    | 24,000            | 50 MB       |
| worksheets     | 180,000           | 200 MB      |
| documents      | 100               | 500 MB      |
| announcements  | 500               | 5 MB        |
| timelines      | 50                | 1 MB        |
| learninggroups | 1,000             | 10 MB       |
| **Total**      | **~242,000**      | **~946 MB** |

---

## 🔐 Security Considerations

- Passwords are hashed with bcrypt
- Sensitive data (API keys, secrets) not stored in DB
- User roles control data access
- Timestamps track all changes
- Soft deletes recommended for audit trail

---

## 🔄 Backup Strategy

- Daily automated backups to MongoDB Atlas
- Weekly full database exports
- Monthly archive to cold storage
- Recovery tested monthly

---

## 📚 Related Documentation

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - System design
- [API Reference](../03-api/API_REFERENCE.md) - API endpoints
- [Developer Setup](../01-getting-started/DEVELOPER_SETUP.md) - Database setup

---

**Last Updated:** 29 November 2025
