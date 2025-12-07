# 📊 Database Schema & Data Models

Dokumentasi lengkap 14 MongoDB collections dan relationships.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [User Model](#user-model)
3. [CapstoneGroup Model](#capstonegroup-model)
4. [Invitation Model](#invitation-model)
5. [Document Model](#document-model)
6. [Timeline Model](#timeline-model)
7. [Announcement Model](#announcement-model)
8. [UseCase Model](#usecase-model)
9. [LearningPath Model](#learningpath-model)
10. [LearningGroup Model](#learninggroup-model)
11. [Counter Model](#counter-model)
12. [Worksheet Model](#worksheet-model)
13. [WorksheetPeriod Model](#worksheetperiod-model)
14. [Relationships](#relationships)
15. [Indexes](#indexes)
16. [Query Patterns](#query-patterns)

---

## Overview

### Database Statistics

| Metric                  | Value           |
| ----------------------- | --------------- |
| **Total Collections**   | 14              |
| **Total Indexes**       | 30+             |
| **Estimated Documents** | 10,000+         |
| **Storage (estimated)** | 500MB-1GB       |
| **Backup Frequency**    | Every 5 minutes |
| **Retention Period**    | 35 days         |

---

## User Model

### Schema

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  name: String (required),
  password: String (hashed, required for email/password auth),
  role: String (enum: ['student', 'admin', 'mentor'], default: 'student'),
  learningPath: String (enum: ['Front-End', 'Back-End', 'Multi-Platform', 'React', 'Machine Learning']),
  learningPathId: ObjectId (reference to LearningPath),
  capstoneGroupId: ObjectId (reference to CapstoneGroup),
  provider: String (enum: ['local', 'google'], default: 'local'),
  googleId: String (unique, for Google OAuth),
  profilePicture: String (URL from Cloudinary),
  isEmailVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Field Descriptions

| Field             | Type     | Required | Unique | Description                      |
| ----------------- | -------- | -------- | ------ | -------------------------------- |
| `_id`             | ObjectId | ✓        | ✓      | MongoDB auto-generated ID        |
| `email`           | String   | ✓        | ✓      | User email address               |
| `name`            | String   | ✓        |        | User full name                   |
| `password`        | String   | ✓\*      |        | Hashed password (bcrypt)         |
| `role`            | String   | ✓        |        | User role (student/admin/mentor) |
| `learningPath`    | String   |          |        | Learning path name               |
| `learningPathId`  | ObjectId |          |        | Reference to LearningPath        |
| `capstoneGroupId` | ObjectId |          |        | Reference to CapstoneGroup       |
| `provider`        | String   | ✓        |        | Auth provider (local/google)     |
| `googleId`        | String   |          | ✓      | Google OAuth ID                  |
| `profilePicture`  | String   |          |        | Profile picture URL              |
| `isEmailVerified` | Boolean  | ✓        |        | Email verification status        |
| `isActive`        | Boolean  | ✓        |        | Account active status            |

### Indexes

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ capstoneGroupId: 1 });
db.users.createIndex({ learningPathId: 1 });
```

---

## CapstoneGroup Model

### Schema

```javascript
{
  _id: ObjectId,
  capstoneGroupId: String (unique, assigned by admin),
  teamName: String (unique, required),
  leaderId: ObjectId (reference to User, required),
  membersUserId: [ObjectId] (references to User),
  selectedUseCaseId: ObjectId (reference to UseCase),
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  rejectionReason: String (if rejected),
  approvedBy: ObjectId (reference to User, admin who approved),
  submittedAt: Date,
  approvedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Field Descriptions

| Field               | Type       | Required | Unique | Description                                  |
| ------------------- | ---------- | -------- | ------ | -------------------------------------------- |
| `_id`               | ObjectId   | ✓        | ✓      | MongoDB auto-generated ID                    |
| `capstoneGroupId`   | String     |          | ✓      | Unique team identifier (e.g., A25-CS246-001) |
| `teamName`          | String     | ✓        | ✓      | Team name                                    |
| `leaderId`          | ObjectId   | ✓        |        | Team leader user ID                          |
| `membersUserId`     | [ObjectId] | ✓        |        | Array of member user IDs                     |
| `selectedUseCaseId` | ObjectId   | ✓        |        | Selected use case ID                         |
| `status`            | String     | ✓        |        | Team approval status                         |
| `rejectionReason`   | String     |          |        | Reason if rejected                           |
| `approvedBy`        | ObjectId   |          |        | Admin who approved                           |
| `submittedAt`       | Date       |          |        | Submission timestamp                         |
| `approvedAt`        | Date       |          |        | Approval timestamp                           |

### Indexes

```javascript
db.capstonegroups.createIndex({ capstoneGroupId: 1 }, { unique: true });
db.capstonegroups.createIndex({ teamName: 1 }, { unique: true });
db.capstonegroups.createIndex({ leaderId: 1 });
db.capstonegroups.createIndex({ status: 1 });
db.capstonegroups.createIndex({ selectedUseCaseId: 1 });
```

---

## Invitation Model

### Schema

```javascript
{
  _id: ObjectId,
  leaderId: ObjectId (reference to User, required),
  memberId: ObjectId (reference to User, required),
  teamId: ObjectId (reference to CapstoneGroup, required),
  status: String (enum: ['pending', 'accepted', 'rejected'], default: 'pending'),
  rejectionReason: String (if rejected),
  expiresAt: Date (7 days from creation),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Field Descriptions

| Field             | Type     | Required | Description               |
| ----------------- | -------- | -------- | ------------------------- |
| `_id`             | ObjectId | ✓        | MongoDB auto-generated ID |
| `leaderId`        | ObjectId | ✓        | Team leader user ID       |
| `memberId`        | ObjectId | ✓        | Invited member user ID    |
| `teamId`          | ObjectId | ✓        | Team ID                   |
| `status`          | String   | ✓        | Invitation status         |
| `rejectionReason` | String   |          | Reason if rejected        |
| `expiresAt`       | Date     | ✓        | Expiration date (7 days)  |

### Indexes

```javascript
db.invitations.createIndex({ memberId: 1, status: 1 });
db.invitations.createIndex({ teamId: 1 });
db.invitations.createIndex({ leaderId: 1 });
db.invitations.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

---

## Document Model

### Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  fileUrl: String (Cloudinary URL),
  link: String (external link),
  fileSize: Number (in bytes),
  fileType: String (e.g., 'pdf', 'docx'),
  uploadedBy: ObjectId (reference to User),
  category: String (enum: ['guidance', 'reference', 'template', 'other']),
  isPublished: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Field Descriptions

| Field         | Type     | Required | Description               |
| ------------- | -------- | -------- | ------------------------- |
| `_id`         | ObjectId | ✓        | MongoDB auto-generated ID |
| `title`       | String   | ✓        | Document title            |
| `description` | String   |          | Document description      |
| `fileUrl`     | String   |          | Cloudinary file URL       |
| `link`        | String   |          | External link             |
| `fileSize`    | Number   |          | File size in bytes        |
| `fileType`    | String   |          | File type/extension       |
| `uploadedBy`  | ObjectId | ✓        | Uploader user ID          |
| `category`    | String   | ✓        | Document category         |
| `isPublished` | Boolean  | ✓        | Publication status        |

### Indexes

```javascript
db.documents.createIndex({ category: 1 });
db.documents.createIndex({ uploadedBy: 1 });
db.documents.createIndex({ isPublished: 1 });
```

---

## Timeline Model

### Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  startDate: Date (required),
  endDate: Date (required),
  status: String (enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming'),
  createdBy: ObjectId (reference to User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Field Descriptions

| Field         | Type     | Required | Description               |
| ------------- | -------- | -------- | ------------------------- |
| `_id`         | ObjectId | ✓        | MongoDB auto-generated ID |
| `title`       | String   | ✓        | Milestone title           |
| `description` | String   |          | Milestone description     |
| `startDate`   | Date     | ✓        | Start date                |
| `endDate`     | Date     | ✓        | End date                  |
| `status`      | String   | ✓        | Milestone status          |
| `createdBy`   | ObjectId | ✓        | Creator user ID           |

### Indexes

```javascript
db.timelines.createIndex({ startDate: 1, endDate: 1 });
db.timelines.createIndex({ status: 1 });
db.timelines.createIndex({ createdBy: 1 });
```

---

## Announcement Model

### Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  type: String (enum: ['info', 'warning', 'success', 'error'], default: 'info'),
  createdBy: ObjectId (reference to User),
  isPublished: Boolean (default: true),
  publishedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Field Descriptions

| Field         | Type     | Required | Description               |
| ------------- | -------- | -------- | ------------------------- |
| `_id`         | ObjectId | ✓        | MongoDB auto-generated ID |
| `title`       | String   | ✓        | Announcement title        |
| `content`     | String   | ✓        | Announcement content      |
| `type`        | String   | ✓        | Announcement type         |
| `createdBy`   | ObjectId | ✓        | Creator user ID           |
| `isPublished` | Boolean  | ✓        | Publication status        |
| `publishedAt` | Date     |          | Publication timestamp     |

### Indexes

```javascript
db.announcements.createIndex({ isPublished: 1, createdAt: -1 });
db.announcements.createIndex({ type: 1 });
db.announcements.createIndex({ createdBy: 1 });
```

---

## UseCase Model

### Schema

```javascript
{
  _id: ObjectId,
  useCaseId: String (unique, required),
  title: String (required),
  description: String,
  composition: Object {
    'Front-End': Number,
    'Back-End': Number,
    'Multi-Platform': Number,
    'React': Number,
    'Machine Learning': Number
  },
  totalSlots: Number (required),
  availableSlots: Number (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Field Descriptions

| Field            | Type     | Required | Description                              |
| ---------------- | -------- | -------- | ---------------------------------------- |
| `_id`            | ObjectId | ✓        | MongoDB auto-generated ID                |
| `useCaseId`      | String   | ✓        | Unique use case identifier (e.g., DC-01) |
| `title`          | String   | ✓        | Use case title                           |
| `description`    | String   |          | Use case description                     |
| `composition`    | Object   | ✓        | Required team composition                |
| `totalSlots`     | Number   | ✓        | Total available slots                    |
| `availableSlots` | Number   | ✓        | Currently available slots                |

### Indexes

```javascript
db.usecases.createIndex({ useCaseId: 1 }, { unique: true });
db.usecases.createIndex({ availableSlots: 1 });
```

---

## LearningPath Model

### Schema

```javascript
{
  _id: ObjectId,
  name: String (unique, required),
  code: String (unique, required),
  description: String,
  isActive: Boolean (default: true),
  dicodingIdPrefix: String (e.g., 'FE', 'BE'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Field Descriptions

| Field              | Type     | Required | Description               |
| ------------------ | -------- | -------- | ------------------------- |
| `_id`              | ObjectId | ✓        | MongoDB auto-generated ID |
| `name`             | String   | ✓        | Learning path name        |
| `code`             | String   | ✓        | Learning path code        |
| `description`      | String   |          | Description               |
| `isActive`         | Boolean  | ✓        | Active status             |
| `dicodingIdPrefix` | String   |          | ID prefix for students    |

### Indexes

```javascript
db.learningpaths.createIndex({ name: 1 }, { unique: true });
db.learningpaths.createIndex({ code: 1 }, { unique: true });
db.learningpaths.createIndex({ isActive: 1 });
```

---

## LearningGroup Model

### Schema

```javascript
{
  _id: ObjectId,
  learningGroupId: String (unique, required),
  cohort: String (required),
  mentorName: String,
  maxMembers: Number,
  currentMembers: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Field Descriptions

| Field             | Type     | Required | Description               |
| ----------------- | -------- | -------- | ------------------------- |
| `_id`             | ObjectId | ✓        | MongoDB auto-generated ID |
| `learningGroupId` | String   | ✓        | Unique group identifier   |
| `cohort`          | String   | ✓        | Cohort name               |
| `mentorName`      | String   |          | Mentor name               |
| `maxMembers`      | Number   |          | Maximum members           |
| `currentMembers`  | Number   | ✓        | Current member count      |
| `isActive`        | Boolean  | ✓        | Active status             |

### Indexes

```javascript
db.learninggroups.createIndex({ learningGroupId: 1 }, { unique: true });
db.learninggroups.createIndex({ cohort: 1 });
db.learninggroups.createIndex({ isActive: 1 });
```

---

## Counter Model

### Schema

```javascript
{
  _id: String (e.g., 'capstoneGroupId'),
  sequence_value: Number
}
```

### Purpose

Used for generating sequential IDs for capstone groups and other entities.

### Indexes

```javascript
db.counters.createIndex({ _id: 1 });
```

---

## Worksheet Model

### Schema

```javascript
{
  _id: ObjectId,
  periodId: ObjectId (reference to WorksheetPeriod),
  userId: ObjectId (reference to User),
  teamId: ObjectId (reference to CapstoneGroup),
  content: String,
  status: String (enum: ['pending', 'completed', 'incomplete'], default: 'pending'),
  submittedAt: Date,
  validatedAt: Date,
  validatedBy: ObjectId (reference to User, admin),
  notes: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Note:** Phase 2 feature - currently disabled in MVP

---

## WorksheetPeriod Model

### Schema

```javascript
{
  _id: ObjectId,
  periodNumber: Number (required),
  title: String (required),
  description: String,
  startDate: Date (required),
  deadline: Date (required),
  autoValidationDate: Date,
  status: String (enum: ['upcoming', 'active', 'closed'], default: 'upcoming'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Note:** Phase 2 feature - currently disabled in MVP

---

## Relationships

### Entity Relationship Diagram

```
User ──┬─→ CapstoneGroup (leader)
       ├─→ CapstoneGroup (member)
       ├─→ Invitation (sender)
       ├─→ Invitation (receiver)
       ├─→ Document (uploader)
       ├─→ Timeline (creator)
       ├─→ Announcement (creator)
       ├─→ LearningPath
       └─→ Worksheet (Phase 2)

CapstoneGroup ──┬─→ Invitation
                ├─→ UseCase
                └─→ Worksheet (Phase 2)

LearningPath ──→ LearningGroup

LearningGroup ──→ User

WorksheetPeriod ──→ Worksheet (Phase 2)
```

### Relationship Rules

1. **User → CapstoneGroup**

   - One user can be leader of ONE capstone group
   - One user can be member of ONE capstone group
   - Cascade delete: If user deleted, remove from team

2. **CapstoneGroup → UseCase**

   - One team selects ONE use case
   - One use case can be selected by MANY teams
   - Cannot delete use case if teams selected it

3. **User → Invitation**

   - One user can send MANY invitations
   - One user can receive MANY invitations
   - Cascade delete: If user deleted, delete invitations

4. **CapstoneGroup → Invitation**
   - One team has MANY invitations
   - Cascade delete: If team deleted, delete invitations

---

## Indexes

### Performance Indexes

```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ capstoneGroupId: 1 });
db.users.createIndex({ learningPathId: 1 });

// CapstoneGroup indexes
db.capstonegroups.createIndex({ capstoneGroupId: 1 }, { unique: true });
db.capstonegroups.createIndex({ teamName: 1 }, { unique: true });
db.capstonegroups.createIndex({ leaderId: 1 });
db.capstonegroups.createIndex({ status: 1 });
db.capstonegroups.createIndex({ selectedUseCaseId: 1 });

// Invitation indexes
db.invitations.createIndex({ memberId: 1, status: 1 });
db.invitations.createIndex({ teamId: 1 });
db.invitations.createIndex({ leaderId: 1 });
db.invitations.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Document indexes
db.documents.createIndex({ category: 1 });
db.documents.createIndex({ uploadedBy: 1 });
db.documents.createIndex({ isPublished: 1 });

// Timeline indexes
db.timelines.createIndex({ startDate: 1, endDate: 1 });
db.timelines.createIndex({ status: 1 });

// Announcement indexes
db.announcements.createIndex({ isPublished: 1, createdAt: -1 });
db.announcements.createIndex({ type: 1 });

// UseCase indexes
db.usecases.createIndex({ useCaseId: 1 }, { unique: true });
db.usecases.createIndex({ availableSlots: 1 });

// LearningPath indexes
db.learningpaths.createIndex({ name: 1 }, { unique: true });
db.learningpaths.createIndex({ code: 1 }, { unique: true });
db.learningpaths.createIndex({ isActive: 1 });

// LearningGroup indexes
db.learninggroups.createIndex({ learningGroupId: 1 }, { unique: true });
db.learninggroups.createIndex({ cohort: 1 });
db.learninggroups.createIndex({ isActive: 1 });
```

---

## Query Patterns

### Common Queries

#### 1. Get User with Team

```javascript
db.users
  .findOne({ _id: userId })
  .populate("capstoneGroupId")
  .populate("learningPathId");
```

#### 2. Get Team with Members

```javascript
db.capstonegroups
  .findOne({ _id: teamId })
  .populate("leaderId")
  .populate("membersUserId")
  .populate("selectedUseCaseId");
```

#### 3. Get Pending Invitations for User

```javascript
db.invitations.find({
  memberId: userId,
  status: "pending",
  expiresAt: { $gt: new Date() },
});
```

#### 4. Get Teams by Status

```javascript
db.capstonegroups.find({ status: "pending" }).sort({ createdAt: -1 }).limit(10);
```

#### 5. Get Available UseCase Slots

```javascript
db.usecases.find({ availableSlots: { $gt: 0 } });
```

#### 6. Get Recent Announcements

```javascript
db.announcements.find({ isPublished: true }).sort({ createdAt: -1 }).limit(5);
```

---

## Data Consistency Rules

1. **Team Composition Validation**

   - Total members must match use case requirement
   - Learning path distribution must match composition

2. **Invitation Expiry**

   - Invitations expire after 7 days
   - Expired invitations auto-delete

3. **Team Status Transitions**

   - pending → approved (by admin)
   - pending → rejected (by admin)
   - Cannot change status after approval

4. **Member Uniqueness**

   - One user cannot be in multiple teams
   - One user cannot be invited twice

5. **Use Case Slot Management**
   - Slots decrease when team approved
   - Slots increase when team rejected/deleted

---

## Backup & Recovery

### Backup Strategy

- **Frequency:** Every 5 minutes
- **Retention:** 35 days
- **Type:** Automatic snapshots
- **Location:** MongoDB Atlas cloud

### Recovery Procedures

1. **Point-in-Time Restore**

   - Select timestamp
   - Restore to new cluster
   - Verify data
   - Switch connection

2. **Full Restore**
   - Download backup
   - Restore to local MongoDB
   - Verify integrity

---

**Last Updated:** December 8, 2025 | **Version:** 1.0.0
