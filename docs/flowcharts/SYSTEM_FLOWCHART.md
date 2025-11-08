# System Flowchart - DC-09 Enhanced Academic Dashboard

**Project:** Dicoding Academic Dashboard - Capstone Project Management  
**Use Case:** DC-09  
**Version:** 1.0.0  
**Last Updated:** 8 November 2025

---

## 📋 Table of Contents

1. [Overall System Flow](#overall-system-flow)
2. [User Registration & Authentication Flow](#user-registration--authentication-flow)
3. [Team Registration Flow](#team-registration-flow)
4. [Admin Approval Flow](#admin-approval-flow)
5. [Document Management Flow](#document-management-flow)
6. [Timeline Management Flow](#timeline-management-flow)

---

## 🌐 Overall System Flow

```mermaid
flowchart TD
    Start([User Accesses Dashboard]) --> Auth{Authenticated?}
    
    Auth -->|No| LoginPage[Login/Register Page]
    LoginPage --> Login[Login]
    LoginPage --> Register[Register New Account]
    
    Register --> CreateAccount[Create Account]
    CreateAccount --> Login
    
    Login --> ValidateAuth{Valid Credentials?}
    ValidateAuth -->|No| LoginError[Show Error Message]
    LoginError --> LoginPage
    ValidateAuth -->|Yes| Dashboard
    
    Auth -->|Yes| Dashboard[Main Dashboard]
    
    Dashboard --> CheckRole{User Role?}
    
    CheckRole -->|Student| StudentDashboard[Student Dashboard]
    CheckRole -->|Admin| AdminDashboard[Admin Dashboard]
    CheckRole -->|Mentor| MentorDashboard[Mentor Dashboard]
    
    StudentDashboard --> StudentMenu{Select Menu}
    StudentMenu -->|Team Registration| TeamFlow[Team Registration Flow]
    StudentMenu -->|Documents| DocFlow[Document Flow]
    StudentMenu -->|Timeline| TimelineFlow[Timeline Flow]
    StudentMenu -->|Profile| ProfileFlow[Profile Management]
    
    AdminDashboard --> AdminMenu{Select Menu}
    AdminMenu -->|Approve Teams| ApprovalFlow[Team Approval Flow]
    AdminMenu -->|Manage Documents| DocManagement[Document Management]
    AdminMenu -->|Manage Timeline| TimelineManagement[Timeline Management]
    AdminMenu -->|Manage Users| UserManagement[User Management]
    AdminMenu -->|Manage Use Cases| UseCaseManagement[Use Case Management]
    
    TeamFlow --> End([End])
    DocFlow --> End
    TimelineFlow --> End
    ProfileFlow --> End
    ApprovalFlow --> End
    DocManagement --> End
    TimelineManagement --> End
    UserManagement --> End
    UseCaseManagement --> End
```

---

## 🔐 User Registration & Authentication Flow

```mermaid
flowchart TD
    Start([Start]) --> HomePage[Access Dashboard]
    
    HomePage --> AuthCheck{Already Have Account?}
    
    AuthCheck -->|No| RegisterForm[Fill Registration Form]
    RegisterForm --> InputData[Input:<br/>- Dicoding ID<br/>- Name<br/>- Email<br/>- Password<br/>- Learning Path<br/>- University]
    
    InputData --> ValidateInput{Valid Input?}
    ValidateInput -->|No| ShowError1[Show Validation Error]
    ShowError1 --> RegisterForm
    
    ValidateInput -->|Yes| CheckEmail{Email Exists?}
    CheckEmail -->|Yes| ShowError2[Email Already Registered]
    ShowError2 --> RegisterForm
    
    CheckEmail -->|No| HashPassword[Hash Password]
    HashPassword --> CreateUser[Create User in Database]
    CreateUser --> GenerateToken[Generate JWT Token]
    GenerateToken --> LoginSuccess
    
    AuthCheck -->|Yes| LoginForm[Fill Login Form]
    LoginForm --> InputCredentials[Input:<br/>- Email<br/>- Password]
    
    InputCredentials --> ValidateCredentials{Valid Credentials?}
    ValidateCredentials -->|No| ShowError3[Invalid Email/Password]
    ShowError3 --> LoginForm
    
    ValidateCredentials -->|Yes| CheckPassword{Password Match?}
    CheckPassword -->|No| ShowError3
    CheckPassword -->|Yes| GenerateToken2[Generate JWT Token]
    GenerateToken2 --> LoginSuccess[Login Success]
    
    LoginSuccess --> UpdateLastLogin[Update Last Login]
    UpdateLastLogin --> RedirectDashboard[Redirect to Dashboard]
    RedirectDashboard --> End([End])
```

---

## 👥 Team Registration Flow (Combined with Company Recommendation)

```mermaid
flowchart TD
    Start([Student Accesses Capstone Menu]) --> CheckTeam{Already in Team?}
    
    CheckTeam -->|Yes| ShowTeamInfo[Display Team Information]
    ShowTeamInfo --> TeamStatus{Team Status?}
    
    TeamStatus -->|Draft| EditTeam[Edit Team Details]
    TeamStatus -->|Pending| WaitApproval[Wait for Admin Approval]
    TeamStatus -->|Approved| ViewTeamDetails[View Team Details & Documents]
    TeamStatus -->|Rejected| ViewReason[View Rejection Reason]
    ViewReason --> EditTeam
    
    EditTeam --> TeamMenu
    ViewTeamDetails --> End([End])
    WaitApproval --> End
    
    CheckTeam -->|No| ShowOptions[Display Options:<br/>1. Create New Team<br/>2. View Pending Invitations]
    
    ShowOptions --> UserChoice{User Choice?}
    
    UserChoice -->|Create Team| CreateTeamForm[Fill Team Registration Form]
    CreateTeamForm --> InputTeamData[Input:<br/>- Team ID<br/>- Team Name<br/>- Cohort ID]
    
    InputTeamData --> ValidateTeamData{Valid Data?}
    ValidateTeamData -->|No| ShowError1[Show Validation Error]
    ShowError1 --> CreateTeamForm
    
    ValidateTeamData -->|Yes| CheckTeamID{Team ID Available?}
    CheckTeamID -->|No| ShowError2[Team ID Already Exists]
    ShowError2 --> CreateTeamForm
    
    CheckTeamID -->|Yes| CreateTeamDraft[Create Team (Draft Status)]
    CreateTeamDraft --> AddMembers[Add Team Members]
    
    AddMembers --> SelectMembers[Select Members:<br/>Min: 3, Max: 5]
    SelectMembers --> SendInvitations[Send Invitations to Members]
    SendInvitations --> WaitInvitations[Wait for All Members to Accept]
    
    WaitInvitations --> CheckInvitations{All Accepted?}
    CheckInvitations -->|No| ShowPending[Show Pending Invitations<br/>Display: Who accepted, who pending]
    ShowPending --> WaitInvitations
    
    CheckInvitations -->|Yes| SelectUseCase[Select Use Case]
    SelectUseCase --> ShowUseCases[Display Available Use Cases]
    ShowUseCases --> ChooseUseCase[Choose Use Case]
    
    ChooseUseCase --> CheckSlots{Slots Available?}
    CheckSlots -->|No| ShowError3[No Slots Available]
    ShowError3 --> ShowUseCases
    
    CheckSlots -->|Yes| ValidateComposition[Validate Team Composition]
    ValidateComposition --> CheckLearningPaths{Valid Learning Paths?}
    
    CheckLearningPaths -->|No| ShowError4[Team must have<br/>at least 2 different<br/>learning paths]
    ShowError4 --> AddMembers
    
    CheckLearningPaths -->|Yes| CheckTeamSize{Valid Team Size?}
    CheckTeamSize -->|No| ShowError5[Team must have<br/>3-5 members]
    ShowError5 --> AddMembers
    
    CheckTeamSize -->|Yes| InputProjectDetails[Input Project Details:<br/>- Project Title<br/>- Description<br/>- GitHub Repo]
    
    InputProjectDetails --> ReviewSubmission[Review All Information]
    ReviewSubmission --> ConfirmSubmit{Confirm Submit?}
    
    ConfirmSubmit -->|No| TeamMenu{Edit What?}
    TeamMenu -->|Members| AddMembers
    TeamMenu -->|Use Case| SelectUseCase
    TeamMenu -->|Project Details| InputProjectDetails
    
    ConfirmSubmit -->|Yes| SubmitForApproval[Submit for Admin Approval]
    SubmitForApproval --> UpdateStatus[Update Status to 'Pending']
    UpdateStatus --> ReserveSlot[Reserve Use Case Slot]
    ReserveSlot --> NotifyAdmin[Notify Admin]
    NotifyAdmin --> ShowSuccess[Show Success Message:<br/>'Team submitted for approval']
    ShowSuccess --> WaitApproval
    
    UserChoice -->|View Invitations| ShowInvitationList[Display Pending Invitations]
    ShowInvitationList --> SelectInvitation[Select Invitation]
    SelectInvitation --> ViewInvitationDetails[View Team Details]
    ViewInvitationDetails --> InvitationChoice{Accept or Reject?}
    
    InvitationChoice -->|Accept| AcceptInvitation[Accept Invitation]
    AcceptInvitation --> JoinTeam[Join Team]
    JoinTeam --> UpdateUserTeam[Update User's Team ID]
    UpdateUserTeam --> NotifyTeamLeader[Notify Team Leader]
    NotifyTeamLeader --> ShowTeamInfo
    
    InvitationChoice -->|Reject| RejectInvitation[Reject Invitation]
    RejectInvitation --> NotifyTeamLeader2[Notify Team Leader]
    NotifyTeamLeader2 --> ShowInvitationList
```

---

## 👨‍💼 Admin Approval Flow

```mermaid
flowchart TD
    Start([Admin Accesses Dashboard]) --> ViewPending[View Pending Teams List]
    
    ViewPending --> FilterOptions{Apply Filters?}
    FilterOptions -->|Yes| ApplyFilters[Filter by:<br/>- Cohort<br/>- Use Case<br/>- Submission Date]
    ApplyFilters --> ShowFiltered[Display Filtered Teams]
    ShowFiltered --> SelectTeam
    
    FilterOptions -->|No| SelectTeam[Select Team to Review]
    
    SelectTeam --> ViewTeamDetails[View Team Details:<br/>- Team Info<br/>- Members<br/>- Learning Paths<br/>- Selected Use Case<br/>- Project Details]
    
    ViewTeamDetails --> CheckComposition[Check Team Composition]
    CheckComposition --> ValidateRules{Meets Requirements?}
    
    ValidateRules --> ShowValidation[Show Validation Results:<br/>- Team size: 3-5 ✓/✗<br/>- Learning paths: ≥2 ✓/✗<br/>- Use case slots: available ✓/✗]
    
    ShowValidation --> AdminDecision{Admin Decision?}
    
    AdminDecision -->|Approve| ConfirmApprove{Confirm Approval?}
    ConfirmApprove -->|No| ViewTeamDetails
    ConfirmApprove -->|Yes| ApproveTeam[Approve Team]
    
    ApproveTeam --> UpdateStatusApproved[Update Status to 'Approved']
    UpdateStatusApproved --> RecordValidator[Record:<br/>- Validated By<br/>- Validated At]
    RecordValidator --> NotifyTeamApproved[Notify Team Members]
    NotifyTeamApproved --> UpdateSlots[Confirm Use Case Slot]
    UpdateSlots --> LogActivity[Log Admin Activity]
    LogActivity --> ShowSuccessApprove[Show Success Message]
    ShowSuccessApprove --> ViewPending
    
    AdminDecision -->|Reject| InputReason[Input Rejection Reason]
    InputReason --> ConfirmReject{Confirm Rejection?}
    ConfirmReject -->|No| ViewTeamDetails
    ConfirmReject -->|Yes| RejectTeam[Reject Team]
    
    RejectTeam --> UpdateStatusRejected[Update Status to 'Rejected']
    UpdateStatusRejected --> RecordReason[Record:<br/>- Rejection Reason<br/>- Validated By<br/>- Validated At]
    RecordReason --> ReleaseSlot[Release Use Case Slot]
    ReleaseSlot --> NotifyTeamRejected[Notify Team Members<br/>with Reason]
    NotifyTeamRejected --> LogActivity2[Log Admin Activity]
    LogActivity2 --> ShowSuccessReject[Show Success Message]
    ShowSuccessReject --> ViewPending
    
    AdminDecision -->|Request Changes| InputChanges[Input Required Changes]
    InputChanges --> SendFeedback[Send Feedback to Team]
    SendFeedback --> UpdateStatusDraft[Update Status to 'Draft']
    UpdateStatusDraft --> NotifyTeamChanges[Notify Team with Feedback]
    NotifyTeamChanges --> ViewPending
    
    ViewPending --> BackToDashboard{Back to Dashboard?}
    BackToDashboard -->|Yes| End([End])
    BackToDashboard -->|No| ViewPending
```

---

## 📄 Document Management Flow

```mermaid
flowchart TD
    Start([User Accesses Documents]) --> CheckRole{User Role?}
    
    CheckRole -->|Student| StudentDocView[View Documents]
    StudentDocView --> FilterDocs[Filter Documents:<br/>- Category<br/>- Tags<br/>- Search]
    FilterDocs --> ShowDocs[Display Available Documents:<br/>- Public<br/>- Team-only (if in team)]
    
    ShowDocs --> SelectDoc[Select Document]
    SelectDoc --> CheckAccess{Has Access?}
    CheckAccess -->|No| ShowError[Access Denied]
    ShowError --> ShowDocs
    
    CheckAccess -->|Yes| ViewDoc[View Document Details]
    ViewDoc --> DocAction{Action?}
    DocAction -->|Download| DownloadDoc[Download Document]
    DownloadDoc --> IncrementCount[Increment Download Count]
    IncrementCount --> UpdateTimestamp[Update Last Downloaded]
    UpdateTimestamp --> ShowDocs
    
    DocAction -->|View| ViewInBrowser[View in Browser]
    ViewInBrowser --> ShowDocs
    
    DocAction -->|Back| ShowDocs
    
    CheckRole -->|Admin| AdminDocView[Admin Document Management]
    AdminDocView --> AdminMenu{Select Action}
    
    AdminMenu -->|Upload| UploadForm[Upload Document Form]
    UploadForm --> InputDocData[Input:<br/>- Title<br/>- Description<br/>- Category<br/>- Visibility<br/>- Tags<br/>- Related To]
    
    InputDocData --> SelectFile[Select File to Upload]
    SelectFile --> ValidateFile{Valid File?}
    ValidateFile -->|No| ShowError2[Invalid file type/size]
    ShowError2 --> SelectFile
    
    ValidateFile -->|Yes| UploadFile[Upload to Storage]
    UploadFile --> SaveMetadata[Save Document Metadata]
    SaveMetadata --> ShowSuccess[Upload Success]
    ShowSuccess --> AdminDocView
    
    AdminMenu -->|View All| ViewAllDocs[View All Documents]
    ViewAllDocs --> FilterAdminDocs[Filter & Search]
    FilterAdminDocs --> ShowAllDocs[Display All Documents]
    ShowAllDocs --> SelectAdminDoc[Select Document]
    SelectAdminDoc --> AdminDocAction{Action?}
    
    AdminDocAction -->|Edit| EditDoc[Edit Document Metadata]
    EditDoc --> UpdateDoc[Update Document]
    UpdateDoc --> ShowAllDocs
    
    AdminDocAction -->|Delete| ConfirmDelete{Confirm Delete?}
    ConfirmDelete -->|No| ShowAllDocs
    ConfirmDelete -->|Yes| DeleteDoc[Delete Document]
    DeleteDoc --> RemoveFile[Remove from Storage]
    RemoveFile --> ShowAllDocs
    
    AdminDocAction -->|View Stats| ViewStats[View Download Statistics]
    ViewStats --> ShowAllDocs
    
    AdminMenu -->|Back| End([End])
    ShowDocs --> BackStudent{Back?}
    BackStudent -->|Yes| End
    BackStudent -->|No| ShowDocs
```

---

## 📅 Timeline Management Flow

```mermaid
flowchart TD
    Start([User Accesses Timeline]) --> CheckRole{User Role?}
    
    CheckRole -->|Student| StudentTimeline[View Timeline]
    StudentTimeline --> FilterTimeline[Filter Timeline:<br/>- Type<br/>- Status<br/>- Date Range]
    FilterTimeline --> ShowTimeline[Display Timeline Items:<br/>- Upcoming<br/>- Ongoing<br/>- Completed<br/>- Overdue]
    
    ShowTimeline --> HighlightDeadlines[Highlight:<br/>- Upcoming deadlines<br/>- Overdue items<br/>- Critical priority]
    
    HighlightDeadlines --> SelectItem[Select Timeline Item]
    SelectItem --> ViewDetails[View Item Details:<br/>- Title<br/>- Description<br/>- Dates<br/>- Priority<br/>- Status]
    
    ViewDetails --> CheckType{Item Type?}
    CheckType -->|Submission| ShowSubmission[Show Submission Details]
    CheckType -->|Deadline| ShowDeadline[Show Deadline Info]
    CheckType -->|Milestone| ShowMilestone[Show Milestone Info]
    CheckType -->|Meeting| ShowMeeting[Show Meeting Details]
    
    ShowSubmission --> BackToTimeline
    ShowDeadline --> BackToTimeline
    ShowMilestone --> BackToTimeline
    ShowMeeting --> BackToTimeline
    
    BackToTimeline[Back to Timeline] --> ShowTimeline
    
    CheckRole -->|Admin| AdminTimeline[Admin Timeline Management]
    AdminTimeline --> AdminTimelineMenu{Select Action}
    
    AdminTimelineMenu -->|Create| CreateTimelineForm[Create Timeline Item Form]
    CreateTimelineForm --> InputTimelineData[Input:<br/>- Title<br/>- Description<br/>- Type<br/>- Start Date<br/>- End Date<br/>- Priority<br/>- Related To]
    
    InputTimelineData --> ValidateTimeline{Valid Data?}
    ValidateTimeline -->|No| ShowError[Show Validation Error]
    ShowError --> CreateTimelineForm
    
    ValidateTimeline -->|Yes| SaveTimeline[Save Timeline Item]
    SaveTimeline --> AutoSetStatus[Auto-set Status based on Dates]
    AutoSetStatus --> NotifyUsers[Notify Relevant Users]
    NotifyUsers --> ShowSuccessCreate[Timeline Item Created]
    ShowSuccessCreate --> AdminTimeline
    
    AdminTimelineMenu -->|View All| ViewAllTimeline[View All Timeline Items]
    ViewAllTimeline --> FilterAdminTimeline[Filter & Search]
    FilterAdminTimeline --> ShowAllTimeline[Display All Items]
    ShowAllTimeline --> SelectAdminItem[Select Item]
    SelectAdminItem --> AdminItemAction{Action?}
    
    AdminItemAction -->|Edit| EditTimeline[Edit Timeline Item]
    EditTimeline --> UpdateTimeline[Update Item]
    UpdateTimeline --> UpdateStatus[Update Status if Needed]
    UpdateStatus --> ShowAllTimeline
    
    AdminItemAction -->|Delete| ConfirmDeleteTimeline{Confirm Delete?}
    ConfirmDeleteTimeline -->|No| ShowAllTimeline
    ConfirmDeleteTimeline -->|Yes| DeleteTimeline[Delete Timeline Item]
    DeleteTimeline --> ShowAllTimeline
    
    AdminItemAction -->|Mark Complete| MarkComplete[Mark as Completed]
    MarkComplete --> RecordCompletion[Record:<br/>- Completed At<br/>- Completed By]
    RecordCompletion --> ShowAllTimeline
    
    AdminTimelineMenu -->|View Overdue| ViewOverdue[View Overdue Items]
    ViewOverdue --> ShowOverdueList[Display Overdue Items]
    ShowOverdueList --> TakeAction{Take Action?}
    TakeAction -->|Extend Deadline| ExtendDeadline[Extend End Date]
    ExtendDeadline --> NotifyExtension[Notify Users]
    NotifyExtension --> ViewOverdue
    
    TakeAction -->|Cancel| CancelItem[Cancel Timeline Item]
    CancelItem --> ViewOverdue
    
    AdminTimelineMenu -->|Back| End([End])
    ShowTimeline --> BackStudentTimeline{Back?}
    BackStudentTimeline -->|Yes| End
    BackStudentTimeline -->|No| ShowTimeline
```

---

## 📊 Data Flow Summary

### **User → System:**
1. Registration → Authentication → Dashboard
2. Team Creation → Validation → Approval Request
3. Document Access → Permission Check → Download
4. Timeline View → Filter → Display

### **Admin → System:**
1. Review Teams → Approve/Reject → Notify Users
2. Upload Documents → Set Permissions → Publish
3. Create Timeline → Set Dates → Notify Users
4. Manage Users → Update Roles → Update Permissions

### **System → Database:**
1. User actions → Validate → Store
2. Status changes → Update → Log
3. File uploads → Store → Generate URL
4. Notifications → Queue → Send

---

## 🔄 Integration Points

### **Frontend ↔ Backend:**
- REST API calls
- JWT authentication
- Real-time updates (optional)
- File upload/download

### **Backend ↔ Database:**
- Mongoose ODM
- CRUD operations
- Aggregation queries
- Transactions

### **System ↔ External:**
- Email notifications (future)
- File storage (local/cloud)
- Analytics (future)

---

## 📝 Notes

### **Key Decision Points:**
1. **Team Registration:** Invitation acceptance is required from all members
2. **Admin Approval:** Can approve, reject, or request changes
3. **Document Access:** Role-based and visibility-based
4. **Timeline Status:** Auto-updated based on dates

### **Validation Rules:**
1. **Team Size:** 3-5 members
2. **Learning Paths:** Minimum 2 different paths
3. **Use Case Slots:** Must be available
4. **File Upload:** Max 5MB, specific formats

### **Status Transitions:**
- **Team:** Draft → Pending → Approved/Rejected
- **Timeline:** Upcoming → Ongoing → Completed/Overdue
- **Document:** Active → Inactive (soft delete)

---

**Last Updated:** 8 November 2025  
**Maintained by:** Tim A25-CS246  
**Version:** 1.0.0
