# 📊 MONITORING GUIDE

Application monitoring, logging, and alerting setup.

---

## 📋 Monitoring Overview

### What to Monitor

- Application health
- API response time
- Database performance
- Server resources
- Error rates
- User activity

---

## 🔍 Application Monitoring

### Sentry (Error Tracking)

**Setup:**

```bash
npm install @sentry/node @sentry/tracing
```

**Backend Integration:**

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Features:**

- Automatic error tracking
- Stack traces
- Session replay
- Performance monitoring
- Release tracking

### New Relic (Performance)

**Setup:**

```bash
npm install newrelic
```

**Configuration:**

```javascript
require("newrelic");
// Add at top of server.js
```

**Monitors:**

- Response time
- Throughput
- Error rate
- Database queries
- External calls

---

## 📝 Logging

### Winston Logger

**Setup:**

```bash
npm install winston
```

**Configuration:**

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

**Usage:**

```javascript
logger.info("User logged in", { userId: 123 });
logger.error("Database error", { error: err });
logger.warn("High memory usage", { memory: 85 });
```

### Morgan (HTTP Logging)

**Setup:**

```bash
npm install morgan
```

**Usage:**

```javascript
const morgan = require("morgan");
app.use(morgan("combined"));
```

---

## 📈 Metrics

### Key Metrics to Track

**Application:**

- Request count
- Response time (avg, p95, p99)
- Error rate
- Success rate
- Active users

**Database:**

- Query count
- Query time
- Connection pool usage
- Slow queries
- Index usage

**Server:**

- CPU usage
- Memory usage
- Disk usage
- Network I/O
- Process count

---

## 🚨 Alerting

### Alert Rules

**High Error Rate:**

```
Trigger: Error rate > 5% for 5 minutes
Action: Send email to team
```

**Slow Response Time:**

```
Trigger: P95 response time > 2 seconds
Action: Send Slack notification
```

**Database Down:**

```
Trigger: Database connection fails
Action: Page on-call engineer
```

**High Memory Usage:**

```
Trigger: Memory > 90%
Action: Send alert, consider restart
```

---

## 📊 Dashboard Setup

### Grafana Dashboard

**Metrics to Display:**

- Request rate (graph)
- Response time (gauge)
- Error rate (gauge)
- Database connections (graph)
- Memory usage (gauge)
- CPU usage (gauge)

**Update Frequency:**

- Real-time for critical metrics
- 1-minute for performance metrics
- 5-minute for resource metrics

---

## 🔐 Security Monitoring

### Monitor For

- Failed login attempts
- Unusual API usage
- Large data exports
- Admin actions
- Permission changes

### Log

- User ID
- Action performed
- Timestamp
- IP address
- Result (success/failure)

---

## 📅 Maintenance Tasks

### Daily

- Check error logs
- Review alert notifications
- Monitor error rate

### Weekly

- Review performance metrics
- Check database performance
- Analyze user patterns

### Monthly

- Review capacity planning
- Optimize slow queries
- Update monitoring rules
- Review security logs

---

## 🔗 Monitoring Stack

```
Application
    ↓
Winston Logger
    ↓
Log Files / Sentry / New Relic
    ↓
Grafana Dashboard
    ↓
Alert Rules
    ↓
Notifications (Email, Slack, PagerDuty)
```

---

## 📞 On-Call Rotation

### Escalation

```
Level 1: Automated alert
Level 2: Slack notification (5 min)
Level 3: SMS alert (10 min)
Level 4: Phone call (15 min)
```

### On-Call Responsibilities

- Monitor alerts
- Investigate issues
- Implement fixes
- Document incidents
- Post-incident review

---

**Last Updated:** 30 November 2025
