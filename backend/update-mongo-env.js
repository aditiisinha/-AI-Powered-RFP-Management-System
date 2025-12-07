const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

const updates = {
    MONGODB_URI: 'mongodb+srv://aditya7760_db_user:9899700261@rpf-mail-data.wwumtub.mongodb.net/rfp_management?retryWrites=true&w=majority',
    // Ensure other keys are preserved or updated if needed
};

// Remove DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD if they exist to avoid confusion
const lines = content.split('\n');
const newLines = [];
const keysProcessed = new Set();

const keysToRemove = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

for (const line of lines) {
    const match = line.match(/^([^=]+)=/);
    if (match) {
        const key = match[1].trim();
        if (keysToRemove.includes(key)) {
            continue; // Skip postgres keys
        }
        if (updates[key]) {
            newLines.push(`${key}=${updates[key]}`);
            keysProcessed.add(key);
        } else {
            newLines.push(line);
        }
    } else {
        newLines.push(line);
    }
}

for (const [key, value] of Object.entries(updates)) {
    if (!keysProcessed.has(key)) {
        newLines.push(`${key}=${value}`);
    }
}

fs.writeFileSync(envPath, newLines.join('\n'));
console.log("Updated .env with MongoDB URI");
