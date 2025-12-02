# 💾 BACKUP & RECOVERY GUIDE

Data backup and disaster recovery procedures.

---

## 📋 Backup Strategy

### Backup Types

**Full Backup**

- Complete database copy
- Frequency: Weekly
- Retention: 4 weeks

**Incremental Backup**

- Changes since last backup
- Frequency: Daily
- Retention: 7 days

**Transaction Log**

- All database changes
- Frequency: Continuous
- Retention: 7 days

---

## 🗄️ Database Backup

### MongoDB Atlas (Automated)

**Features:**

- Automatic backups every 6 hours
- 7-day retention
- Point-in-time recovery
- Stored in AWS S3

**Manual Backup:**

```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/db" --out=./backup
tar -czf backup.tar.gz backup/
```

---

## 📁 File Backup

### Cloudinary (Profile Pictures)

**Automatic:**

- Stored in Cloudinary CDN
- Automatic backups
- Redundancy across regions

**Manual Export:**

```bash
# Use Cloudinary API to export all images
curl -X GET "https://api.cloudinary.com/v1_1/cloud_name/resources"
```

### Application Code

**GitHub:**

- All code backed up
- Version history
- Branch protection
- Automated backups

---

## 🔄 Recovery Procedures

### Database Recovery

**Step 1: Identify Issue**

```
- Check MongoDB Atlas dashboard
- Review backup timestamps
- Determine recovery point
```

**Step 2: Restore Backup**

```bash
# Download backup from Atlas
# Restore to new cluster
mongorestore --uri="mongodb+srv://..." ./backup
```

**Step 3: Verify Data**

```bash
# Check record count
db.users.countDocuments()

# Verify data integrity
db.users.findOne()
```

### Application Recovery

**Step 1: Rollback Code**

```bash
git revert <commit-hash>
git push origin main
```

**Step 2: Restart Application**

```bash
# Redeploy from Railway/Vercel
# Or restart manually
npm start
```

---

## 🚨 Disaster Recovery Plan

### RTO (Recovery Time Objective)

- Database: 1 hour
- Application: 30 minutes
- Full system: 2 hours

### RPO (Recovery Point Objective)

- Database: 6 hours (latest backup)
- Application: Real-time (GitHub)
- Files: 24 hours

### Escalation

```
Level 1: Automated backup restore
Level 2: Manual intervention (30 min)
Level 3: Full system rebuild (2 hours)
```

---

## ✅ Recovery Checklist

- [ ] Identify issue
- [ ] Determine recovery point
- [ ] Backup current state
- [ ] Restore from backup
- [ ] Verify data integrity
- [ ] Test application
- [ ] Notify users
- [ ] Document incident

---

**Last Updated:** 30 November 2025
