# 📋 WORKSHEET FEATURE

Bi-weekly progress check-in and evidence submission system.

---

## 📋 Overview

Worksheet system allows:

- Submit progress reports bi-weekly
- Upload evidence files
- Track submission status
- Admin validation
- Automatic validation

---

## 📅 Worksheet Periods

### Create Period (Admin)

```
1. Go to "Kelola Worksheet"
2. Click "Create Period"
3. Fill form:
   - Period Number: 1, 2, 3, etc.
   - Title: Period title
   - Start Date: When period starts
   - End Date: Submission deadline
   - Auto Validation Date: When auto-validation runs
4. Click "Create"
5. Period status = "Draft"
```

### Activate Period (Admin)

```
1. Go to "Kelola Worksheet"
2. Find period with "Draft" status
3. Click "Activate" button
4. Period status = "Active"
5. Students can now submit worksheets
```

---

## 📝 Submit Worksheet (Student)

### Step 1: Select Period

```
1. Go to "Worksheet" in sidebar
2. Find active period
3. Click "Submit Worksheet"
```

### Step 2: Fill Form

```
1. Write description:
   - Minimum 50 characters
   - Describe activities this week
   - Be specific and detailed

2. Upload evidence files:
   - Screenshots
   - Documents
   - Code snippets
   - Maximum 5 files
   - Maximum 5MB per file
```

### Step 3: Submit

```
1. Click "Submit Worksheet"
2. Confirm submission
3. Status changes to "Submitted"
4. Admin notified
```

### Save as Draft

```
1. Click "Save as Draft"
2. Worksheet saved but not submitted
3. Can edit later
4. Status = "Draft"
```

---

## 📊 Submission Status

### Possible Statuses

```
- Draft: Not yet submitted
- Submitted: Waiting for validation
- Completed: Validated and approved
- Incomplete: Rejected or not submitted
```

### Status Transitions

```
Draft → Submitted (student submits)
Submitted → Completed (admin validates as complete)
Submitted → Incomplete (admin validates as incomplete)
```

---

## ✅ Admin Validation

### View Submissions

```
1. Go to "Kelola Worksheet"
2. Select a period
3. You'll see all submissions
4. Filter by status:
   - Draft
   - Submitted
   - Completed
   - Incomplete
```

### Validate Worksheet

```
1. Find submission to validate
2. Click "Validate"
3. Review:
   - Description
   - Evidence files
   - Submission date
4. Set status:
   - Completed: Approved
   - Incomplete: Rejected
5. Add validation notes
6. Click "Save"
```

### Auto Validation

```
- Runs on auto validation date
- Marks all submitted as "Completed"
- Can be overridden manually
```

---

## 🔍 View Feedback

### Student View

```
1. Go to "Worksheet"
2. Find your submission
3. Click "View Details"
4. You'll see:
   - Your submission
   - Admin validation notes
   - Validation status
   - Validation date
```

---

## 📊 Worksheet Statistics

### Admin View

```
- Total submissions: Count
- Submitted: Awaiting validation
- Completed: Approved
- Incomplete: Rejected
- On-time: Submitted before deadline
- Late: Submitted after deadline
```

---

## ⚠️ Important Notes

- Submit before deadline
- Late submissions still accepted
- Detailed descriptions help validation
- Keep evidence files organized
- Check feedback regularly

---

**Last Updated:** 29 November 2025
