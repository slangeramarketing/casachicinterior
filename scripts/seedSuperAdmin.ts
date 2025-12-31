import "dotenv/config"; // ✅ THIS IS MANDATORY
import db from "@/lib/db";
import User from "@/modules/user/user.model";


async function seedSuperAdmin() {
  await db();

  console.log("MONGO URI =", process.env.MONGODB_URI);


  const exists = await User.findOne({
    email: "superadmin@casachic.com",
  });

  if (exists) {
    console.log("Super admin already exists");
    process.exit(0);
  }

  await User.create({
    name: "Super Admin",
    email: "admin@gmail.com",
    password: "admin@123", // auto-hashed by schema
    role: "super_admin",
  });

  console.log("Super admin created successfully");
  process.exit(0);
}

seedSuperAdmin();
