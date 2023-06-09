import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccountPath = path.join(__dirname, "sa.json");
// Read the service account JSON file
const serviceAccountData = fs.readFileSync(serviceAccountPath, "utf8");
// Parse the service account JSON data
const serviceAccount = JSON.parse(serviceAccountData);

export default serviceAccount;
