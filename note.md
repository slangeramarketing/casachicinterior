# 🚀 Casachic Interior - VPS Management Cheat Sheet (2026)

This document contains essential commands and configurations required to manage your staging server.

## 🍃 MongoDB Commands

### 1. Service Management
| Task | Command |
| :--- | :--- |
| **Check Status** | `sudo systemctl status mongod` |
| **Restart DB** | `sudo systemctl restart mongod` |
| **Start DB** | `sudo systemctl start mongod` |
| **Stop DB** | `sudo systemctl stop mongod` |

### 2. Database Access (Login)
To log in with your admin user via the terminal:
```bash
mongosh -u casachic_admin -p 'Teamnoida@1234' --authenticationDatabase casachic_db casachic_db

----------------------------------------------------------------------------------


3. Useful Commands Inside Shell
show dbs – To list all databases.
show collections – To list all collections in the current DB.
db.users.find().pretty() – To view user data in a readable format.


🚀 PM2 & Deployment Commands
1. Initial Application Start (Fresh Deployment)
Run this when starting the process for the first time or after a delete:

PORT=3001 NODE_ENV=production pm2 start npm --name "casachic-staging" -- run start

-------------------------------------------------------------------------------------

2. Logs and Monitoring
Task	Command
View Logs	pm2 logs casachic-staging --lines 20
Process List	pm2 status
Flush Logs	pm2 flush casachic-staging (Deletes old log files)
Real-time Monit	pm2 monit



3. Update and Remove

# Restart with Environment changes
pm2 restart casachic-staging --update-env

# Completely remove the process
pm2 delete casachic-staging

# Save process list for Auto-restart after VPS Reboot
pm2 save


🛠 Troubleshooting & Environment
1. Environment Variables Check
If .env is not loading, check for hidden or priority files:

ls -la | grep .env
Next.js Priority: .env.production > .env.local > .env


-----------------------------------------------------------------

2. MongoDB Config (/etc/mongod.conf)
Standard networking and security settings:

net:
  port: 27017
  bindIp: 0.0.0.0  # Allows internal/external loopback

security:
  authorization: enabled

-------------------------------------------------------------------

3. Firewall (UFW)
Ensuring ports are open for traffic:

sudo ufw status
sudo ufw allow 3001/tcp
sudo ufw allow from 127.0.0.1 to any port 27017

-------------------------------------------------------------

📝 Important Maintenance Notes
IPv4 Family: Always keep family: 4 in db.ts to prevent IPv6 timeout issues in 2026.
URI Encoding: Special characters like @ in passwords must be encoded as %40 in the connection string.
Clean Build: After any change in .env, run rm -rf .next and then npm run build to ensure changes are baked into the production build.
Direct Connection: If using a single VPS, use directConnection: true in Mongoose options for faster resolution.

