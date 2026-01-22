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






{
  "_id": {
    "$oid": "696e880b6965437f2e49e805"
  },
  "slug": "premium-u-shaped-modular-kitchen",
  "title": "Premium U-Shaped Modular Kitchen",
  "shortDescription": "Transform your cooking space with our high-end, ergonomic U-shaped modular kitchen featuring marine ply and soft-close hardware.",
  "description": "Our U-shaped modular kitchens are designed for maximum efficiency and storage. We use boiling water-resistant (BWR) marine plywood and premium finishes like acrylic and laminate. Every corner is utilized with modern pull-out accessories and tall units.",
  "highlights": [
    {
      "icon": "quality",
      "title": "15 Years Warranty",
      "_id": {
        "$oid": "696ebd1d6965437f2e49ead0"
      }
    },
    {
      "icon": "delivery",
      "title": "45 Days Delivery",
      "_id": {
        "$oid": "696ebd1d6965437f2e49ead1"
      }
    },
    {
      "icon": "guarantee",
      "title": "German Hardware (Hettich/Hafele)",
      "_id": {
        "$oid": "696ebd1d6965437f2e49ead2"
      }
    },
    {
      "icon": "support",
      "title": "Eco-Friendly Materials",
      "_id": {
        "$oid": "696ebd1d6965437f2e49ead3"
      }
    }
  ],
  "categoryId": {
    "$oid": "696e613954b392e54fdaf3ac"
  },
  "coverImage": "/uploads/services/1768851466994.jpeg",
  "gallery": [
    {
      "url": "/uploads/common/1768851467080.jpg",
      "alt": "Modern Kitchen Cabinets",
      "caption": "High-gloss acrylic finish cabinets with profile handles.",
      "_id": {
        "$oid": "696ebd1d6965437f2e49ead4"
      }
    },
    {
      "url": "/uploads/common/1768851467091.png",
      "alt": "Kitchen Island Layout",
      "caption": "Elegant island setup for extra preparation space.",
      "_id": {
        "$oid": "696ebd1d6965437f2e49ead5"
      }
    },
    {
      "url": "/uploads/common/1768860103971.png",
      "alt": "Premium U-Shaped Modular Kitchen",
      "caption": "Elegent",
      "_id": {
        "$oid": "696ebd1d6965437f2e49ead6"
      }
    },
    {
      "url": "/uploads/common/1768860103986.png",
      "alt": "Premium U-Shaped Modular Kitchen",
      "caption": "Waiting room",
      "_id": {
        "$oid": "696ebd1d6965437f2e49ead7"
      }
    },
    {
      "url": "/uploads/common/1768864881197.jpg",
      "alt": "Premium U-Shaped Modular Kitchen",
      "caption": "",
      "_id": {
        "$oid": "696ebd1d6965437f2e49ead8"
      }
    },
    {
      "url": "/uploads/common/1768864881192.jpg",
      "alt": "Premium U-Shaped Modular Kitchen",
      "caption": "",
      "_id": {
        "$oid": "696ebd1d6965437f2e49ead9"
      }
    }
  ],
  "faqs": [
    {
      "question": "What materials do you use for the cabinets?",
      "answer": "We primarily use BWP (Boiling Water Proof) Marine Plywood to ensure durability against moisture and heat.",
      "_id": {
        "$oid": "696ebd1d6965437f2e49eacd"
      }
    },
    {
      "question": "Is the chimney included in the package?",
      "answer": "We provide the provision for the chimney; however, the appliance can be purchased separately or as part of our appliance add-on pack.",
      "_id": {
        "$oid": "696ebd1d6965437f2e49eace"
      }
    },
    {
      "question": "How long does the installation take?",
      "answer": "Once the factory-finished modules arrive at your site, installation is typically completed within 3 to 5 days.",
      "_id": {
        "$oid": "696ebd1d6965437f2e49eacf"
      }
    }
  ],
  "priceUnit": "sq ft",
  "seo": {
    "title": "Modern Modular Kitchen Designs | Best Interior Services",
    "description": "Looking for the best modular kitchen? Our U-shaped designs offer maximum storage and sleek aesthetics. Book a free consultation today.",
    "keywords": [
      "modular kitchen",
      "interior design",
      "U-shaped kitchen",
      "odern home decor",
      "kitchen cabinets"
    ],
    "metaRobots": "index, follow"
  },
  "featured": true,
  "status": "published",
  "displayOrder": 0,
  "ctaText": "Get Free Quote",
  "ctaLink": "/contact?service=modular-kitche",
  "createdAt": {
    "$date": "2026-01-19T19:37:47.382Z"
  },
  "updatedAt": {
    "$date": "2026-01-19T23:24:13.747Z"
  },
  "startingPrice": 50000
}



----------------------------------------------------------------------------------------------------------


### 1. Overview Metrics (The Big Numbers) 📊

Ye metrics aapko ek jhalak mein batate hain ki website kaisa perform kar rahi hai:

* **Total Active Users:** Kitne real log aapki site visit kar rahe hain. 👥
* **Total Page Views:** Aapki site ke pages kitni baar dekhe gaye. 📄
* **New vs Returning Users:** Kitne log pehli baar aaye aur kitne dobara laut kar aaye. ✨

### 2. User Engagement (Behavior) 🧠

Ye batata hai ki log aapki site ke saath kaise interact kar rahe hain:

* **Average Engagement Time:** Ek user average kitna waqt aapke design/portfolio ko dekhne mein bita raha hai. ⏳
* **Top Pages:** Kaunsa design ya service page sabse zyada popular hai (e.g., Living Room designs vs Kitchen designs). 🏠
* **Session Duration:** Log ek baar aane par kitni der rukte hain.

### 3. Geographical & Technical Data 🌍

Marketing aur optimization ke liye zaroori:

* **Top Cities/Countries:** Aapka traffic kahan se aa raha hai (Taki aap wahan target ads chala sakein). 📍
* **Device Category:** Log mobile se zyada dekh rahe hain ya desktop se (Portfolio sites aksar mobile par zyada dekhi jati hain). 📱

### 4. Conversion & Events (Business Impact) 📈

* **Click Events:** Kitne logon ne "Contact Us" ya "WhatsApp" button par click kiya. 📞
* **Form Submissions:** Kitne potential clients ne inquiry form bhara. 📝

---

**Industry Standard Tip:** Dashboard ko hamesha "Actionable" hona chahiye. Sirf numbers nahi, balki wo numbers jo business owner ko decision lene mein help karein.

Inmein se kaunsa section aap sabse pehle build karna chahenge?

1. **Overview Metrics:** Sabse pehle main counters (Users, Views) dikhayenge.
2. **User Engagement:** Top pages aur time spent ka data nikalenge.
3. **Visual Charts:** Users ka trend line graph (Pichle 7 ya 30 din ka).

Aap option chuniye, phir hum `route.ts` ko us specific data ke liye update karenge! 🚀