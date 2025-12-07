# 🧪 Testing & QA Guide

Panduan testing dan quality assurance untuk DC-09 Capstone Project Management System.

---

## 📋 Table of Contents

1. [Testing Levels](#testing-levels)
2. [Backend Testing](#backend-testing)
3. [Frontend Testing](#frontend-testing)
4. [Test Cases](#test-cases)
5. [Running Tests](#running-tests)
6. [Coverage Reports](#coverage-reports)
7. [QA Checklist](#qa-checklist)

---

## Testing Levels

### Unit Tests

- Test individual functions/components
- Fast execution
- High coverage target: 80%+
- Framework: Vitest

### Integration Tests

- Test multiple components together
- Test API endpoints
- Test database operations
- Framework: Vitest + Supertest

### E2E Tests

- Test complete user workflows
- Test from UI perspective
- Slower execution
- Framework: Playwright (optional)

---

## Backend Testing

### Setup

```bash
# Install testing dependencies
npm install --save-dev vitest @vitest/ui supertest

# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Unit Test Example

```javascript
import { describe, it, expect, beforeEach } from "vitest";
import User from "../models/User.js";

describe("User Model", () => {
  beforeEach(async () => {
    // Setup before each test
  });

  it("should create user with valid data", async () => {
    const user = await User.create({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
      learningPath: "Front-End",
    });

    expect(user).toBeDefined();
    expect(user.email).toBe("test@example.com");
    expect(user.role).toBe("student");
  });

  it("should not create user with invalid email", async () => {
    expect(async () => {
      await User.create({
        email: "invalid-email",
        name: "Test User",
        password: "password123",
      });
    }).rejects.toThrow();
  });
});
```

### Integration Test Example

```javascript
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server.js";

describe("Auth API", () => {
  it("should register new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      learningPath: "Front-End",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe("test@example.com");
  });

  it("should login with valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBeDefined();
  });
});
```

### Test Coverage Targets

| Module          | Target |
| --------------- | ------ |
| **Models**      | 85%+   |
| **Controllers** | 80%+   |
| **Services**    | 85%+   |
| **Middleware**  | 80%+   |
| **Utils**       | 90%+   |
| **Overall**     | 80%+   |

---

## Frontend Testing

### Setup

```bash
# Install testing dependencies
npm install --save-dev vitest @vitest/ui @vue/test-utils happy-dom

# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

### Component Test Example

```javascript
import { describe, it, expect } from "vitest";
import { render, screen } from "@vue/test-utils";
import LoginForm from "../components/LoginForm.vue";

describe("LoginForm Component", () => {
  it("should render login form", () => {
    render(LoginForm);
    expect(screen.getByText("Login")).toBeDefined();
  });

  it("should submit form with valid data", async () => {
    const { getByRole, getByLabelText } = render(LoginForm);

    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const submitButton = getByRole("button", { name: "Login" });

    await emailInput.setValue("test@example.com");
    await passwordInput.setValue("password123");
    await submitButton.click();

    // Assert form submission
  });
});
```

### Store Test Example

```javascript
import { describe, it, expect } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../stores/authStore.js";

describe("Auth Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should set user on login", () => {
    const store = useAuthStore();

    store.setUser({
      id: "123",
      email: "test@example.com",
      role: "student",
    });

    expect(store.user.email).toBe("test@example.com");
    expect(store.isAuthenticated).toBe(true);
  });
});
```

---

## Test Cases

### Team Management Tests

**Registration:**

- [ ] Register team with valid data
- [ ] Reject registration with invalid composition
- [ ] Reject registration with duplicate team name
- [ ] Send invitations to team members
- [ ] Handle invitation acceptance
- [ ] Handle invitation rejection

**Approval:**

- [ ] Admin can approve pending team
- [ ] Admin can reject team with reason
- [ ] Bulk approve teams
- [ ] Bulk reject teams
- [ ] Assign team ID

### Authentication Tests

**Login:**

- [ ] Login with email and password
- [ ] Login with Google OAuth
- [ ] Reject login with invalid credentials
- [ ] Reject login with unverified email
- [ ] Generate JWT token

**Registration:**

- [ ] Register with email and password
- [ ] Validate email format
- [ ] Validate password strength
- [ ] Send verification email
- [ ] Verify email address

### Document Tests

**Upload:**

- [ ] Upload document with valid file
- [ ] Reject upload with invalid file type
- [ ] Reject upload with file too large
- [ ] Store file in Cloudinary
- [ ] Save document metadata

**Download:**

- [ ] Download document file
- [ ] Track download statistics
- [ ] Handle missing files

---

## Running Tests

### Backend Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.js

# Run tests matching pattern
npm test -- --grep "login"

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

### Frontend Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- LoginForm.test.js

# Run tests matching pattern
npm test -- --grep "login"

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

---

## Coverage Reports

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html  # macOS
start coverage/index.html # Windows
xdg-open coverage/index.html # Linux
```

### Coverage Thresholds

```javascript
// vitest.config.js
export default {
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
};
```

---

## QA Checklist

### Pre-Release Checklist

**Functionality:**

- [ ] All features working as expected
- [ ] No broken links
- [ ] All forms validating correctly
- [ ] All API endpoints responding
- [ ] Database operations working

**Performance:**

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] Bundle size acceptable
- [ ] Database queries optimized

**Security:**

- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] CORS properly configured
- [ ] JWT tokens secure
- [ ] Passwords hashed

**Browser Compatibility:**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

**Accessibility:**

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast adequate
- [ ] Form labels present
- [ ] ARIA attributes used

**Testing:**

- [ ] Unit tests passing (80%+ coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] No console errors
- [ ] No console warnings

**Documentation:**

- [ ] README updated
- [ ] API documentation updated
- [ ] User guide updated
- [ ] Code comments present
- [ ] CHANGELOG updated

---

## Continuous Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

**Last Updated:** December 8, 2025 | **Version:** 1.0.0
