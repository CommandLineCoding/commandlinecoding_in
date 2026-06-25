/* set-env.js */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'environments');
const filePath = path.join(dir, 'environment.ts');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Directly extracts the build-time tokens from Cloudflare's environment
const envConfigFile = `export const environment = {
  production: true,
  supabaseUrl: '${process.env.SUPABASE_URL || ""}',
  supabaseKey: '${process.env.SUPABASE_ANON_KEY || ""}'
};
`;

fs.writeFileSync(filePath, envConfigFile, 'utf-8');
console.log(`[SYS] Environment matrix written successfully from build tokens.`);