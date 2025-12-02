# 🧪 TESTING GUIDE

Complete testing strategy and best practices.

---

## 📋 Testing Levels

### Unit Tests

- Test individual functions
- Mock external dependencies
- Fast execution
- High coverage target: 80%+

### Integration Tests

- Test component interactions
- Use real database (test DB)
- Medium execution time
- Coverage target: 60%+

### E2E Tests

- Test complete user flows
- Use real application
- Slow execution
- Coverage target: 40%+

---

## 🧪 Backend Testing

### Unit Tests

**Setup:**

```bash
npm install --save-dev jest supertest
npm test
```

**Example Test:**

```javascript
describe("authController", () => {
  it("should login user with valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });
});
```

### Integration Tests

**Test Database Interactions:**

```javascript
describe("Team Creation", () => {
  it("should create team and invitations", async () => {
    // Create team
    // Verify team created
    // Verify invitations created
    // Verify emails sent
  });
});
```

### Running Tests

```bash
npm test                    # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

---

## 🎨 Frontend Testing

### Unit Tests (Vue Components)

**Setup:**

```bash
npm install --save-dev vitest @vue/test-utils
npm run test
```

**Example Test:**

```javascript
describe("LoginForm.vue", () => {
  it("should submit form with valid data", async () => {
    const wrapper = mount(LoginForm);

    await wrapper.find('input[type="email"]').setValue("test@example.com");
    await wrapper.find('input[type="password"]').setValue("password123");
    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("submit")).toBeTruthy();
  });
});
```

### E2E Tests (Playwright)

**Setup:**

```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Example Test:**

```javascript
test("should login and create team", async ({ page }) => {
  // Navigate to login
  await page.goto("http://localhost:5173/login");

  // Fill login form
  await page.fill('input[type="email"]', "test@example.com");
  await page.fill('input[type="password"]', "password123");
  await page.click('button[type="submit"]');

  // Verify redirected to dashboard
  await expect(page).toHaveURL("http://localhost:5173/dashboard");
});
```

### Running Tests

```bash
npm run test              # Run all tests
npm run test:ui          # UI mode
npm run test:coverage    # Coverage report
```

---

## 📊 Test Coverage

### Backend Targets

- Controllers: 80%+
- Services: 85%+
- Models: 90%+
- Overall: 80%+

### Frontend Targets

- Components: 70%+
- Stores: 80%+
- Services: 75%+
- Overall: 70%+

### Check Coverage

```bash
# Backend
npm run test:coverage

# Frontend
npm run test:coverage
```

---

## 🔍 Testing Checklist

### Before Commit

- [ ] All tests passing
- [ ] Coverage target met
- [ ] No console errors
- [ ] No warnings

### Before PR

- [ ] Unit tests added
- [ ] Integration tests added
- [ ] E2E tests added (if needed)
- [ ] Coverage report reviewed

### Before Deployment

- [ ] All tests passing
- [ ] Coverage 80%+
- [ ] No flaky tests
- [ ] Performance acceptable

---

## 🐛 Debugging Tests

### Backend

```bash
# Debug mode
node --inspect-brk ./node_modules/.bin/jest --runInBand

# Verbose output
npm test -- --verbose
```

### Frontend

```bash
# UI mode
npm run test:ui

# Watch mode
npm run test:watch
```

---

## 📈 Test Metrics

### Track

- Test count
- Coverage percentage
- Execution time
- Failure rate
- Flaky tests

### Goals

- Increase coverage monthly
- Reduce execution time
- Zero flaky tests
- 100% pass rate

---

## 🔗 Testing Best Practices

- Write tests as you code
- Test edge cases
- Mock external dependencies
- Use descriptive test names
- Keep tests simple
- Avoid test interdependencies
- Run tests before commit

---

**Last Updated:** 30 November 2025
