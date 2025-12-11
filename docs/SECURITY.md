# 🔒 Security Best Practices

Panduan keamanan untuk DC-09 Capstone Project Management System.

---

## 📋 Table of Contents

1. [Authentication Security](#authentication-security)
2. [Authorization](#authorization)
3. [Data Protection](#data-protection)
4. [API Security](#api-security)
5. [File Upload Security](#file-upload-security)
6. [Environment Variables](#environment-variables)
7. [Security Checklist](#security-checklist)

---

## Authentication Security

### JWT Implementation

**Best Practices:**

- Use strong secret key (32+ characters)
- Set appropriate expiration (7 days)
- Refresh tokens before expiry
- Store tokens securely (localStorage)

**Example:**

```javascript
// Generate JWT
const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});

// Verify JWT
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Password Hashing

**Use Bcrypt:**

```javascript
import bcrypt from "bcrypt";

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Compare password
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Requirements:**

- Minimum 8 characters
- Mix of uppercase, lowercase, numbers
- No common passwords

### Google OAuth Security

**Best Practices:**

- Validate OAuth tokens
- Use HTTPS callback URL
- Store refresh tokens securely
- Implement token refresh

---

## Authorization

### Role-Based Access Control (RBAC)

**Roles:**

- `student` - Can register team, view documents
- `admin` - Can approve teams, manage documents
- `mentor` - Can monitor teams (Phase 2)

**Implementation:**

```javascript
// Middleware
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Admin access required",
    });
  }
  next();
};

// Usage
router.post("/teams/:id/approve", adminOnly, approveTeam);
```

### Permission Checking

**Best Practices:**

- Check role before action
- Check resource ownership
- Validate user permissions
- Log authorization failures

---

## Data Protection

### HTTPS/TLS

**Requirements:**

- All endpoints use HTTPS
- Valid SSL certificate
- TLS 1.2 or higher
- HSTS header enabled

### CORS Configuration

**Secure Setup:**

```javascript
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### Input Validation

**Use Joi Schemas:**

```javascript
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().required(),
});

const { error, value } = schema.validate(data);
```

### XSS Prevention

**Best Practices:**

- Sanitize user input
- Use Vue's template escaping
- Avoid innerHTML
- Use textContent for text

---

## API Security

### Rate Limiting

**Implementation:**

```javascript
import rateLimit from "express-rate-limit";

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 300 : 100,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 50 : 10,
  skipSuccessfulRequests: true, // Don't count successful requests
  message: "Too many login attempts, please try again later",
});

app.use("/api/", globalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
```

**Rate Limits by Environment:**

| Endpoint Type | Development | Production |
| ------------- | ----------- | ---------- |
| Global API    | 100/15min   | 300/15min  |
| Auth (login)  | 10/15min    | 50/15min   |
| Upload        | 50/15min    | 100/15min  |
| Export        | 20/15min    | 50/15min   |

**Configuration Location:** `backend/src/middleware/security.js`

**Adjustment Tips:**

- Increase limits if legitimate users are blocked
- Decrease limits if under attack
- Use `skipSuccessfulRequests` for auth endpoints
- Monitor rate limit hits in logs

### Security Headers

**Use Helmet.js:**

```javascript
import helmet from "helmet";

app.use(helmet());
// Sets: X-Frame-Options, X-Content-Type-Options, etc.
```

### Error Handling

**Don't Expose Sensitive Info:**

```javascript
// Bad
res.status(500).json({ error: error.message });

// Good
res.status(500).json({
  success: false,
  error: "Internal server error",
});
```

---

## File Upload Security

### File Type Validation

```javascript
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

if (!ALLOWED_TYPES.includes(file.mimetype)) {
  throw new Error("Invalid file type");
}
```

### File Size Limits

```javascript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

if (file.size > MAX_FILE_SIZE) {
  throw new Error("File too large");
}
```

### Cloudinary Security

**Best Practices:**

- Use API key and secret securely
- Set upload restrictions
- Enable virus scanning
- Use signed URLs for downloads

---

## Environment Variables

### Secrets Management

**Never commit .env file:**

```bash
# .gitignore
.env
.env.local
.env.*.local
```

**Use environment variables for:**

- Database credentials
- API keys
- JWT secret
- OAuth credentials
- SMTP credentials

### Production Secrets

**Best Practices:**

- Use strong, random values
- Rotate secrets regularly
- Use secret management service
- Limit access to secrets

---

## Security Checklist

### Development

- [ ] Use HTTPS in development
- [ ] Validate all inputs
- [ ] Hash passwords with Bcrypt
- [ ] Use JWT for authentication
- [ ] Implement RBAC
- [ ] Add rate limiting
- [ ] Use security headers
- [ ] Validate file uploads
- [ ] Sanitize error messages
- [ ] Log security events

### Deployment

- [ ] Enable HTTPS/TLS
- [ ] Set strong JWT secret
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set security headers
- [ ] Use environment variables
- [ ] Implement logging
- [ ] Monitor for attacks
- [ ] Regular security audits
- [ ] Keep dependencies updated

### Database

- [ ] Use strong passwords
- [ ] Enable authentication
- [ ] Restrict IP access
- [ ] Enable backups
- [ ] Monitor access logs
- [ ] Use encryption at rest
- [ ] Regular security updates
- [ ] Test restore procedures

### Frontend

- [ ] Use HTTPS
- [ ] Validate user input
- [ ] Escape output
- [ ] Use secure cookies
- [ ] Implement CSP headers
- [ ] Regular dependency updates
- [ ] Security testing
- [ ] Code review

---

## Dependency Security

### Check for Vulnerabilities

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### Keep Dependencies Updated

```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package@latest
```

---

## Incident Response

### If Breach Detected

1. **Immediate Actions**

   - Disable affected accounts
   - Revoke compromised tokens
   - Notify affected users
   - Preserve evidence

2. **Investigation**

   - Review logs
   - Identify attack vector
   - Determine scope
   - Document findings

3. **Remediation**

   - Fix vulnerability
   - Reset credentials
   - Update security
   - Deploy patch

4. **Follow-up**
   - Monitor for recurrence
   - Update security measures
   - Conduct security audit
   - Update documentation

---

## Resources

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Node.js Security:** https://nodejs.org/en/docs/guides/security/
- **Express Security:** https://expressjs.com/en/advanced/best-practice-security.html

---

## Database Security

### MongoDB Transactions

**Best Practices:**

- Use transactions for multi-document operations
- Require replica set for transactions
- Move long-running operations outside transactions
- Implement proper error handling and rollback

**Configuration:**

```env
# CRITICAL: Must include replicaSet parameter
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority&replicaSet=atlas-l46ddf-shard-0
```

**Example - Correct Pattern:**

```javascript
// ✅ CORRECT - Email outside transaction
const result = await withTransaction(async (session) => {
  // Database operations only
  const team = await CapstoneGroup.create([teamData], { session });
  await User.updateMany(
    { _id: { $in: memberIds } },
    { capstoneGroupId: team._id },
    { session }
  );
  return team;
});

// Send email asynchronously (non-blocking)
(async () => {
  await EmailService.sendInvitationEmail(memberEmail);
})();
```

---

**Last Updated:** December 11, 2025 | **Version:** 1.0.1
