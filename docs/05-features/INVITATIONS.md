# 📧 INVITATIONS FEATURE

Team invitation system with email notifications.

---

## 📋 Overview

The invitation system allows:

- Automatic invitation creation when teams are formed
- Email notifications to invited members
- Accept/reject workflow
- Track invitation status
- Manage team membership

---

## 🔄 Invitation Flow

### Creation

```
Team Created/Edited
    ↓
System identifies new members
    ↓
Creates Invitation record for each member
    ↓
Sends email notification
    ↓
Member sees invitation in "Tim Saya"
```

### Response

```
Member receives email
    ↓
Clicks Accept or Reject link
    ↓
System updates invitation status
    ↓
If Accept: Member added to team
If Reject: Member not added
```

---

## 📧 Email Notification

### Email Content

```
Subject: You've been invited to join a team!

Body includes:
- Team name
- Use case name
- Team leader name
- Team size and composition
- Accept button/link
- Reject button/link
- Deadline to respond
```

### Email Delivery

- Sent immediately after invitation creation
- Uses Nodemailer with Gmail SMTP
- Async sending (doesn't block team creation)
- Retry on failure

---

## ✅ Accept Invitation

### Process

```
1. Member receives email
2. Clicks "Accept" link or uses UI
3. System updates invitation status to "Accepted"
4. Member added to team
5. Confirmation email sent
6. Member can see team details
```

### Result

- Invitation status: "Accepted"
- Member role: Team member
- Can access team documents
- Can submit worksheets with team

---

## ❌ Reject Invitation

### Process

```
1. Member receives email
2. Clicks "Reject" link or uses UI
3. Optional: Enter rejection reason
4. System updates invitation status to "Rejected"
5. Member NOT added to team
6. Rejection email sent to leader
```

### Result

- Invitation status: "Rejected"
- Member not in team
- Leader notified of rejection
- Leader can invite another member

---

## 📊 Invitation Status

### Possible Statuses

```
- Pending: Awaiting member response
- Accepted: Member joined team
- Rejected: Member declined
```

### Status Transitions

```
Pending → Accepted (member accepts)
Pending → Rejected (member rejects)
Pending → Deleted (leader removes member)
```

---

## 🔍 View Invitations

### Student View

```
1. Go to "Tim Saya"
2. Look for "Pending Invitations" section
3. See all pending invitations
4. Each shows:
   - Team name
   - Use case
   - Team leader name
   - Accept/Reject buttons
```

### Admin View

```
1. Go to "Kelola Tim"
2. Select a team
3. View all invitations for that team
4. See status of each invitation
```

---

## 🔄 Edit Invitations

### When Team is Edited

```
If new members added:
- New invitations created
- Emails sent to new members

If members removed:
- Invitations deleted
- Removal email sent to member
```

---

## 🔐 Security

- JWT authentication required
- Only team leader can manage invitations
- Email verification (optional)
- Rate limiting on invitation creation

---

## ⚠️ Important Notes

- Invitations auto-created (no manual action needed)
- Email delivery may take few seconds
- Check spam folder if email not received
- Invitations expire after 30 days (optional)

---

**Last Updated:** 29 November 2025
