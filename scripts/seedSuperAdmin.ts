/***************************************************
 * File: scripts/seed-super-admin.ts
 *
 * Purpose:
 * - Seeds the first Super Admin user into the database
 * - Used only once during initial project setup
 *
 * Responsibilities:
 * - Connect to database
 * - Check if super admin already exists
 * - Create super admin with ACTIVE status
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT be reused for runtime operations
 ***************************************************/

import "dotenv/config"; // ✅ REQUIRED
import db from "@/lib/db";
import User from "@/modules/users/user.model";

async function seedSuperAdmin() {
  await db();

  console.log("MONGO URI =", process.env.MONGODB_URI);

  const exists = await User.findOne({
    email: "427rohitkumar@gmail.com",
  });

  if (exists) {
    console.log("Super admin already exists");
    process.exit(0);
  }

  await User.create({
    name: "Rohit Kumar",
    email: "427rohitkumar@gmail.com",
    password: "Teamnoida@1234", // auto-hashed by schema
    role: "super_admin",
    status: "active", // ✅ REQUIRED (new model)
  });

  console.log("Super admin created successfully");
  process.exit(0);
}

seedSuperAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
