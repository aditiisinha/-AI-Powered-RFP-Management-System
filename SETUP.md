# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Set Up Database

1. Install PostgreSQL if not already installed
2. Create database:
   ```bash
   createdb rfp_management
   ```
3. Run schema:
   ```bash
   psql -U postgres -d rfp_management -f backend/db/schema.sql
   ```

### 3. Configure Environment Variables

**Backend:**
1. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   copy .env.example .env
   ```
2. Edit `.env` and fill in:
   - Database credentials
   - OpenAI API key
   - Email credentials (SMTP and IMAP)

**Frontend (optional):**
```bash
cd frontend
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 4. Get API Keys

**OpenAI:**
1. Go to https://platform.openai.com/
2. Create account or sign in
3. Navigate to API Keys
4. Create new secret key
5. Copy to `OPENAI_API_KEY` in backend `.env`

**Gmail App Password (for email):**
1. Go to Google Account settings
2. Security → 2-Step Verification (enable if not enabled)
3. App passwords → Generate app password
4. Use this password for `SMTP_PASSWORD` and `IMAP_PASSWORD`

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 6. Access the Application

Open your browser and go to: http://localhost:3000

## Testing the Application

1. **Create an RFP:**
   - Click "Create RFP"
   - Enter: "I need 10 laptops with 16GB RAM. Budget is $20,000. Delivery in 30 days."
   - Click "Create RFP"

2. **Add Vendors:**
   - Go to "Vendors"
   - Add at least 2 vendors with email addresses

3. **Send RFP:**
   - Go to RFPs list
   - Click "Send to Vendors" on an RFP
   - Select vendors and send

4. **Check Responses:**
   - Have vendors reply to the email
   - Go to the RFP's proposal page
   - Click "Check for New Responses"

5. **Compare Proposals:**
   - Once you have 2+ proposals
   - Click "Generate AI Comparison"
   - View recommendations

## Troubleshooting

**Backend won't start:**
- Check database is running: `pg_isready`
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use

**Frontend won't start:**
- Check Node.js version: `node --version` (should be 16+)
- Delete `node_modules` and `package-lock.json`, then `npm install` again

**Database errors:**
- Ensure PostgreSQL is running
- Check database exists: `psql -l | grep rfp_management`
- Verify user has permissions

**Email errors:**
- Use App Password, not regular password for Gmail
- Check SMTP/IMAP settings match your email provider
- Verify firewall allows connections

**OpenAI errors:**
- Check API key is valid
- Verify account has credits
- Check rate limits

