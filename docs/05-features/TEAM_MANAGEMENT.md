# 👥 TEAM MANAGEMENT FEATURE

Complete documentation for team registration, editing, and management.

---

## 📋 Overview

Team Management allows students to:

- Create capstone project teams
- Add team members
- Validate team composition
- Edit team members
- Track team status
- Receive team invitations

---

## 🎯 Key Features

### 1. Team Registration

- Dynamic form based on selected use case
- Auto-generated member input fields
- Auto-fetch learning paths from student IDs
- Real-time composition validation
- Automatic invitation creation

### 2. Team Editing

- Add new members
- Remove existing members
- Validate composition
- Update invitations
- Track changes

### 3. Team Approval

- Admin review of team composition
- Approve or reject teams
- Provide rejection reasons
- Notify team leaders

### 4. Invitation System

- Automatic invitation creation
- Email notifications
- Accept/reject workflow
- Track invitation status

---

## 🔄 Team Creation Flow

### Step 1: Select Use Case

```
Student selects use case (e.g., DC-01)
↓
Form displays:
- Use case name
- Total team size (5 members)
- Required composition (2 Front-End + 3 ML)
- Member input fields auto-generate
```

### Step 2: Add Members

```
For each member field:
1. Enter student ID (e.g., fui0001)
2. System fetches student data
3. Learning path auto-populates
4. Display member information
```

### Step 3: Validate Composition

```
System validates:
- Total members = required team size
- Learning path composition matches requirements
- All members are valid students
- No duplicate members
- Members not already in another team
```

### Step 4: Submit

```
1. Click "Daftar Tim"
2. Backend validates again
3. Team created in database
4. Invitations created for members
5. Emails sent to members
6. Team status = "Pending"
```

---

## 📊 Team Composition Validation

### Validation Rules

**Example: Use Case DC-01**

```
Required Composition:
- 2 members with "Front-End Web & Back-End with AI"
- 3 members with "Machine Learning"
- Total: 5 members

Valid Team:
✓ fui0001 - Front-End Web & Back-End with AI
✓ fui0002 - Front-End Web & Back-End with AI
✓ fui0003 - Machine Learning
✓ fui0004 - Machine Learning
✓ fui0005 - Machine Learning

Invalid Team:
✗ fui0001 - Front-End Web & Back-End with AI
✗ fui0002 - Front-End Web & Back-End with AI
✗ fui0003 - Front-End Web & Back-End with AI (should be ML)
✗ fui0004 - Machine Learning
✗ fui0005 - Machine Learning
```

### Validation Error Messages

```
"Total members must equal 5"
"Composition mismatch: Need 2 Front-End, got 3"
"Student fui0001 is already in another team"
"Student fui0001 not found in system"
"Duplicate member: fui0001 appears twice"
```

---

## ✏️ Team Editing

### When Can Teams Be Edited?

- Only when team status = "Pending"
- Only by team leader
- Before admin approval

### What Can Be Changed?

- Add new members
- Remove existing members
- Change member order

### What Cannot Be Changed?

- Team name (after creation)
- Use case (after creation)
- Team leader

### Edit Process

```
1. Go to Tim Saya
2. Click "Edit" on team
3. Modal opens showing:
   - Current members (with "Existing" badge)
   - Add member button
   - Delete buttons for each member
4. Make changes:
   - Add new members
   - Remove members
5. System validates new composition
6. Click "Save Changes"
7. New invitations created for added members
8. Invitations deleted for removed members
```

---

## 📧 Invitation System

### Automatic Invitation Creation

```
When team is created/edited:
1. System identifies new members
2. Creates Invitation record for each new member
3. Sends email to member
4. Member sees invitation in "Tim Saya"
```

### Invitation Email

```
Subject: You've been invited to join a team!

Body:
- Team name
- Use case
- Team leader name
- Accept link
- Reject link
- Deadline to respond
```

### Invitation Status

```
- Pending: Awaiting member response
- Accepted: Member joined team
- Rejected: Member declined
```

### Member Actions

```
Accept Invitation:
1. Click "Accept" button
2. Member added to team
3. Invitation status = "Accepted"
4. Member can see team details

Reject Invitation:
1. Click "Reject" button
2. Enter reason (optional)
3. Invitation status = "Rejected"
4. Member not added to team
```

---

## 👥 Team Members

### Member Information

```
For each team member:
- Student ID
- Name
- Email
- Learning Path
- University
- Status (Accepted/Pending/Rejected)
```

### Member Roles

```
- Leader: Created the team
- Member: Invited and accepted
- Pending: Invited but not responded
```

---

## 📊 Team Status Workflow

```
Team Created
    ↓
Status: Pending
(Awaiting admin approval)
    ↓
Admin Reviews
    ↓
├─ Approve → Status: Approved
│            (Team is official)
│
└─ Reject → Status: Rejected
            (Team declined)
            (Can create new team)
```

---

## 🔍 Admin Team Approval

### Review Process

```
1. Admin goes to "Kelola Tim"
2. Filters by "Pending" status
3. Clicks team to view details
4. Checks:
   - Team composition
   - Member information
   - Use case requirements
5. Approves or rejects
```

### Approval Criteria

```
✓ Team has correct number of members
✓ Composition matches use case requirements
✓ All members are valid students
✓ No duplicate members
✓ Members not in other teams
```

### Rejection Reasons

```
- Incorrect composition
- Invalid student IDs
- Duplicate members
- Use case requirements not met
- Other (specify in notes)
```

---

## 📈 Team Statistics

### Dashboard Metrics

```
- Total Teams: All teams in system
- Pending Teams: Awaiting approval
- Approved Teams: Accepted teams
- Rejected Teams: Declined teams
- Average Team Size: Members per team
```

---

## 🔗 Related Features

### Invitations

- Automatic creation when team created
- Email notifications
- Accept/reject workflow

### Documents

- Team can access all documents
- Download guidelines and templates

### Worksheet

- Team members submit individual worksheets
- Admin validates submissions

### Timeline

- Team follows project timeline
- Meets deadlines

---

## ⚠️ Important Notes

- **Composition Validation:** Strictly enforced
- **Member Limits:** Based on use case
- **Editing Window:** Only before approval
- **Invitations:** Auto-sent to new members
- **Status Tracking:** Always visible to team leader

---

## 🆘 Troubleshooting

### Team creation fails

- Verify all members are valid student IDs
- Check composition matches use case
- Ensure no duplicate members
- Check members not in other teams

### Can't edit team

- Team must have "Pending" status
- You must be team leader
- Try refreshing page

### Invitation not received

- Check email spam folder
- Verify email address is correct
- Ask admin to resend invitation

### Can't add member

- Check student ID is valid
- Verify member not already in team
- Check team size limit not exceeded

---

**Last Updated:** 29 November 2025
