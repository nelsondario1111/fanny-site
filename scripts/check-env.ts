// scripts/check-env.ts
import { config } from "dotenv";
import { existsSync } from "fs";
import path from "path";
import process from "process";

// --------------------------------------------
// 🧩 Load environment file manually
// --------------------------------------------
const root = process.cwd();
const localEnv = path.join(root, ".env.local");
const prodEnv = path.join(root, ".env.production");

if (existsSync(localEnv)) {
  console.log("🧩 Loading environment from .env.local...");
  config({ path: localEnv });
} else if (existsSync(prodEnv)) {
  console.log("🧩 Loading environment from .env.production...");
  config({ path: prodEnv });
} else {
  console.warn("⚠️ No .env.local or .env.production found in project root.");
}

// --------------------------------------------
// ✅ Check required variables
// --------------------------------------------
const REQUIRED_VARS = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SITE_NAME",
  "NEXT_PUBLIC_TWITTER",
  "MAILERLITE_API_TOKEN",
  "MAILERLITE_GROUP_ID",
];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `❌ Missing required environment variables:\n${missing
      .map((v) => `   - ${v}`)
      .join("\n")}`
  );
  console.error(
    "💡 Please set them in your .env.local (for dev) or .env.production / Vercel Settings → Environment Variables."
  );
  process.exit(1);
}

// --------------------------------------------
// 🌍 Summary output
// --------------------------------------------
console.log("✅ Environment variables verified successfully.");
console.log("🌍 Environment:", process.env.VERCEL_ENV || "local");
console.log("🔗 Base URL:", process.env.NEXT_PUBLIC_SITE_URL);
