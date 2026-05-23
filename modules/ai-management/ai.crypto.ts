import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

// Key must be a 32-byte hex string in .env
const getMasterKey = () => {
  const envKey = process.env.MASTER_ENCRYPTION_KEY;
  if (!envKey || envKey.length < 32) {
    throw new Error("CRITICAL: MASTER_ENCRYPTION_KEY is missing or invalid in .env");
  }
  return envKey.substring(0, 32);
};

export const aiCrypto = {
  encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = crypto.pbkdf2Sync(getMasterKey(), salt, 100000, 32, "sha512");

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const tag = cipher.getAuthTag();

    // Format: iv:salt:tag:encrypted
    return `${iv.toString("hex")}:${salt.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
  },

  decrypt(hash: string): string | null {
    try {
      const parts = hash.split(":");
      if (parts.length !== 4) throw new Error("Invalid hash format");

      const iv = Buffer.from(parts[0], "hex");
      const salt = Buffer.from(parts[1], "hex");
      const tag = Buffer.from(parts[2], "hex");
      const encryptedText = parts[3];

      const key = crypto.pbkdf2Sync(getMasterKey(), salt, 100000, 32, "sha512");

      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encryptedText, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      console.error("[aiCrypto] Decryption failed:", error);
      return null;
    }
  },

  maskKey(key: string): string {
    if (!key) return "";
    if (key.length < 8) return "***";
    const prefix = key.substring(0, 5);
    const suffix = key.substring(key.length - 4);
    return `${prefix}-****-${suffix}`;
  }
};
