import "dotenv/config";
import db from "@/lib/db";
import User from "@/modules/users/user.model";
import { sendMail } from "@/lib/email/mailer"; // ✅ Import mailer
import { getWelcomeEmailTemplate } from "@/lib/email/templates/welcomeEmail"; // ✅ Import template

async function seedSuperAdmin() {
  await db();

  const adminEmail = "427rohitkumar@gmail.com";
  const adminPass = "Teamnoida@1234";
  
  // Seed script ke liye manual base URL (Development ya Production ke hisaab se)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  console.log("Checking for Super Admin...");

  const exists = await User.findOne({ email: adminEmail });

  if (exists) {
    console.log("Super admin already exists");
    process.exit(0);
  }

  // 1. Create the Super Admin
  const newUser = await User.create({
    name: "Rohit Kumar",
    email: adminEmail,
    password: adminPass, // Schema automatically hashes this
    role: "super_admin",
    status: "active",
  });

  console.log("Super admin created in database.");

  // 2. Send Welcome Email
  try {
    await sendMail({
      to: adminEmail,
      subject: "CasaChic - Super Admin Access Granted",
      html: getWelcomeEmailTemplate({
        name: "Rohit Kumar",
        email: adminEmail,
        password: adminPass, // Sending the plain password for reference
        role: "super_admin",
        baseUrl: baseUrl,
      }),
    });
    console.log("Welcome email sent to Super Admin successfully.");
  } catch (emailError) {
    console.error("User created, but email failed:", emailError);
  }

  process.exit(0);
}

seedSuperAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});