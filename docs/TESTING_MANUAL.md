# 📋 PANDUAN TESTING MANUAL - CUSTOM TEAM COMPOSITION FEATURE

## 🎯 OVERVIEW

Panduan lengkap untuk testing fitur Custom Team Composition dengan skenario dan checklist.

**CATATAN PENTING:**

- Email testing di-skip (karena student data dummy)
- Focus pada: Form, Validation, Database, API responses
- Testing dilakukan manual di browser + database

---

## 🧪 SKENARIO TESTING LENGKAP

### PHASE 1: DYNAMIC FORM & AUTO-FETCH LEARNING PATH

---

## TEST 1.1: Dynamic Member Fields

### Setup:

- Backend running ✅
- Frontend running ✅
- Login sebagai `fui0001@student.devacademy.id` ✅

### Steps:

1. Navigate ke `/team/register`
2. **Team Name:** Input `Team Berkah Koding`
3. **Use Case:** Select `DC-01 - Learning Telcom`
4. Observe member input fields

### Expected Result:

- [ ] Form auto-generates **5 member input fields** (DC-01 butuh 5 members)
- [ ] Learning Path fields juga 5
- [ ] Add Member button disabled (sudah max 5)
- [ ] Delete button visible untuk setiap member (kecuali jika hanya 1)

### Checklist:

```
✅ Form generates 5 fields
✅ Learning Path fields = 5
✅ Add button disabled
✅ Delete buttons visible
```

---

## TEST 1.2: Auto-fetch Learning Path

### Setup:

Continue dari TEST 1.1

### Steps:

1. **Member 1 ID:** Input `fui0001`
2. Wait 1 second
3. Check Learning Path field auto-populated
4. **Member 2 ID:** Input `fui0002`
5. Check Learning Path field auto-populated
6. **Member 3 ID:** Input `fui0003`
7. Check Learning Path field auto-populated
8. **Member 4 ID:** Input `fui0004`
9. Check Learning Path field auto-populated
10. **Member 5 ID:** Input `fui0005`
11. Check Learning Path field auto-populated

### Expected Result:

- [ ] Member 1 (fui0001) → Learning Path: `Front-End & Back-End with AI`
- [ ] Member 2 (fui0002) → Learning Path: `Front-End & Back-End with AI`
- [ ] Member 3 (fui0003) → Learning Path: `Machine Learning`
- [ ] Member 4 (fui0004) → Learning Path: `Machine Learning`
- [ ] Member 5 (fui0005) → Learning Path: `Machine Learning`
- [ ] No console errors

### Checklist:

```
✅ fui0001 → Front-End & Back-End with AI
✅ fui0002 → Front-End & Back-End with AI
✅ fui0003 → Machine Learning
✅ fui0004 → Machine Learning
✅ fui0005 → Machine Learning
✅ No console errors
```

---

## TEST 1.3: Validation - Correct Composition

### Setup:

Continue dari TEST 1.2 (semua fields sudah filled)

### Steps:

1. Scroll ke bawah
2. Check "Ketentuan Komposisi Tim" section
3. Verify menampilkan:
   - 2 orang dari Front-end & Back-end with AI
   - 3 orang dari Machine Learning
   - Total: 5 anggota (termasuk ketua)
4. Check "Saya menyetujui bahwa..." checkbox
5. Click "Daftar Tim" button

### Expected Result:

- [ ] Composition requirement ditampilkan dengan benar
- [ ] Form submitted successfully
- [ ] Success message muncul atau redirect ke `/team`
- [ ] No validation errors

### Checklist:

```
✅ Composition requirement displayed correctly
✅ Form submitted
✅ Success message shown
✅ No validation errors
```

---

## TEST 1.4: Validation - Wrong Composition (Too Many ML)

### Setup:

Register new team

### Steps:

1. **Team Name:** `Team Test Wrong`
2. **Use Case:** `DC-01 - Learning Telcom`
3. **Members:**
   - fui0001 (Front-End)
   - fui0002 (Front-End)
   - fui0003 (ML)
   - fui0004 (ML)
   - fui0006 (ML) ← **3 ML members** (should be 2)
4. Check checkbox
5. Click "Daftar Tim"

### Expected Result:

- [ ] Error message appears: `Komposisi tidak sesuai. Dibutuhkan 2 dari "Machine Learning", Anda input 3`
- [ ] Form NOT submitted
- [ ] Error message in red color

### Checklist:

```
✅ Error message displayed
✅ Form not submitted
✅ Error message correct
```

---

## TEST 1.5: Validation - Wrong Team Size

### Setup:

Register new team

### Steps:

1. **Team Name:** `Team Test Size`
2. **Use Case:** `DC-01 - Learning Telcom` (requires 5 members)
3. **Members:** Input only 4 members
4. Check checkbox
5. Click "Daftar Tim"

### Expected Result:

- [ ] Error message appears: `Tim harus memiliki tepat 5 anggota (termasuk ketua), Anda input 4`
- [ ] Form NOT submitted

### Checklist:

```
✅ Error message displayed
✅ Form not submitted
✅ Error message correct
```

---

## PHASE 2: INVITATION SYSTEM

---

## TEST 2.1: Invitations Created in Database

### Setup:

After successful team registration (TEST 1.3)

### Steps:

1. Open MongoDB Compass atau terminal
2. Query database:

   ```javascript
   // Check team created
   db.capstonegroups.findOne({ teamName: "Team Berkah Koding" });

   // Check invitations created
   db.invitations.find({ teamId: ObjectId("...") }).pretty();
   ```

### Expected Result:

- [ ] Team document exists dengan status `pending`
- [ ] 4 invitation documents created (untuk fui0002, fui0003, fui0004, fui0005)
- [ ] Each invitation has:
  - `leaderId`: fui0001's ObjectId
  - `memberId`: member's ObjectId
  - `teamId`: team's ObjectId
  - `status`: `pending`
  - `createdAt`, `updatedAt` timestamps

### Checklist:

```
✅ Team created with status pending
✅ 4 invitations created
✅ Each invitation has correct fields
✅ Status = pending
```

---

## TEST 2.2: Pending Invitations Display

### Setup:

- Invitations created (from TEST 2.1)
- Login sebagai `fui0002@student.devacademy.id` (member)

### Steps:

1. Navigate ke `/team` (Tim Saya)
2. Observe page

### Expected Result:

- [ ] Section "Undangan Tim Tertunda" appears
- [ ] Shows 1 pending invitation
- [ ] Displays:
  - Team Name: `Team Berkah Koding`
  - Use Case: `DC-01 - Learning Telcom`
  - From: `Lutfan Gunawan` (leader name)
  - Buttons: "Terima" (green) dan "Tolak" (red)

### Checklist:

```
✅ Pending invitations section visible
✅ Team name displayed
✅ Use case displayed
✅ Leader name displayed
✅ Accept/Reject buttons visible
```

---

## TEST 2.3: Accept Invitation

### Setup:

Continue dari TEST 2.2

### Steps:

1. Click "Terima" button
2. Wait for loading
3. Observe page

### Expected Result:

- [ ] Loading state shows briefly
- [ ] Invitation disappears from list
- [ ] Console log: `Invitation accepted`
- [ ] Page updates

### Database Check:

```javascript
// Check invitation status changed
db.invitations.findOne({ memberId: ObjectId("fui0002"), status: "accepted" });
```

### Expected:

- [ ] Invitation status = `accepted`
- [ ] updatedAt timestamp updated

### Checklist:

```
✅ Loading state shown
✅ Invitation removed from UI
✅ Console log correct
✅ Database status = accepted
```

---

## TEST 2.4: Reject Invitation

### Setup:

- Login sebagai `fui0003@student.devacademy.id` (member)
- Has pending invitation

### Steps:

1. Navigate ke `/team`
2. Click "Tolak" button
3. Wait for loading

### Expected Result:

- [ ] Loading state shows briefly
- [ ] Invitation disappears from list
- [ ] Console log: `Invitation rejected`

### Database Check:

```javascript
db.invitations.findOne({ memberId: ObjectId("fui0003"), status: "rejected" });
```

### Expected:

- [ ] Invitation status = `rejected`

### Checklist:

```
✅ Loading state shown
✅ Invitation removed from UI
✅ Console log correct
✅ Database status = rejected
```

---

## TEST 2.5: Multiple Use Cases

### Setup:

Register team dengan different use case

### Steps:

1. Login sebagai `fui0010@student.devacademy.id` (new leader)
2. Register team dengan `DC-02 - E-Commerce Platform`
3. **Members:**
   - fui0010 (React & Back-end)
   - fui0011 (React & Back-end)
   - fui0012 (React & Back-end)
   - fui0013 (Machine Learning)
   - fui0014 (Machine Learning)
4. Submit form

### Expected Result:

- [ ] Form generates 5 fields (DC-02 also requires 5)
- [ ] Composition requirement shows: 3 React & Back-end + 2 ML
- [ ] Team created successfully
- [ ] 4 invitations created in database

### Checklist:

```
✅ Form generates 5 fields
✅ Correct composition displayed
✅ Team created
✅ Invitations created
```

---

## ✅ MASTER CHECKLIST - TESTING COMPLETE

### Phase 1 - Dynamic Form:

```
[ ] TEST 1.1: Dynamic Member Fields ✅
[ ] TEST 1.2: Auto-fetch Learning Path ✅
[ ] TEST 1.3: Validation - Correct Composition ✅
[ ] TEST 1.4: Validation - Wrong Composition ✅
[ ] TEST 1.5: Validation - Wrong Team Size ✅
```

### Phase 2 - Invitations:

```
[ ] TEST 2.1: Invitations Created in Database ✅
[ ] TEST 2.2: Pending Invitations Display ✅
[ ] TEST 2.3: Accept Invitation ✅
[ ] TEST 2.4: Reject Invitation ✅
[ ] TEST 2.5: Multiple Use Cases ✅
```

---

## 🔍 DATABASE VERIFICATION QUERIES

Copy-paste ke MongoDB Compass:

```javascript
// 1. Check all teams
db.capstonegroups.find({}).pretty();

// 2. Check all invitations
db.invitations.find({}).pretty();

// 3. Check specific team
db.capstonegroups.findOne({ teamName: "Team Berkah Koding" });

// 4. Check pending invitations
db.invitations.find({ status: "pending" }).pretty();

// 5. Check accepted invitations
db.invitations.find({ status: "accepted" }).pretty();

// 6. Check rejected invitations
db.invitations.find({ status: "rejected" }).pretty();

// 7. Count invitations by status
db.invitations.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
```

---

## 🐛 TROUBLESHOOTING

| Issue                             | Solution                              |
| --------------------------------- | ------------------------------------- |
| Learning path tidak auto-populate | Check student ID exists in DB         |
| Form tidak generate fields        | Select use case dulu                  |
| Validation error muncul           | Check composition matches requirement |
| Invitation tidak muncul           | Refresh page atau check DB            |
| Accept/Reject button tidak work   | Check token valid, re-login           |

---

## 📸 SCREENSHOTS TO CAPTURE

1. **Dynamic Form** - 5 member fields
2. **Auto-fetch** - Learning paths populated
3. **Validation Error** - Wrong composition
4. **Pending Invitations** - List of invitations
5. **Database** - Invitations in MongoDB
6. **Accept Success** - Invitation removed

---

## 🎯 SUCCESS CRITERIA

**ALL TESTS PASS IF:**

- ✅ All 5 Phase 1 tests pass
- ✅ All 5 Phase 2 tests pass
- ✅ Database queries show correct data
- ✅ No console errors
- ✅ No validation errors (except intentional)

---

## 📝 NOTES

- Testing dilakukan secara manual di browser
- Database queries menggunakan MongoDB Compass
- Email testing di-skip (dummy data)
- Focus pada functionality dan validation
- Report hasil testing ke team lead

---

**READY TO TEST BERSAMA TIM!** 🚀
