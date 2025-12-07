# How to Run the RFP Management System

## Prerequisites Check

Before running, ensure you have:
- ✅ Node.js installed (v16 or higher) - Check with: `node --version`
- ✅ PostgreSQL installed and running - Check with: `pg_isready` (or check services on Windows)
- ✅ OpenAI API key
- ✅ Email account with SMTP/IMAP access (Gmail recommended)

## Step 1: Install Dependencies

### Backend Dependencies

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

This will install all backend packages (Express, PostgreSQL client, OpenAI, Nodemailer, etc.)

### Frontend Dependencies

Open another terminal (or navigate back) and run:

```bash
cd frontend
npm install
```

This will install React and all frontend dependencies.

## Step 2: Set Up Database

### Option A: Using psql (Command Line)

```bash
# Create the database
createdb rfp_management

# Or if you need to specify user:
createdb -U postgres rfp_management

# Run the schema
psql -U postgres -d rfp_management -f backend/db/schema.sql
```

### Option B: Using pgAdmin (GUI)

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → Create → Database
4. Name it `rfp_management`
5. Right-click on the new database → Query Tool
6. Open `backend/db/schema.sql` and execute it

### Option C: Using psql Interactive

```bash
psql -U postgres
```

Then in psql:
```sql
CREATE DATABASE rfp_management;
\c rfp_management
\i backend/db/schema.sql
\q
```

## Step 3: Configure Environment Variables

### Backend Configuration

1. Navigate to the `backend` folder
2. Create a `.env` file (copy from `.env.example` if it exists, or create new)
3. Add the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rfp_management
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email Configuration (SMTP for sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com

# Email Configuration (IMAP for receiving)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your_email@gmail.com
IMAP_PASSWORD=your_gmail_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Important Notes:**
- Replace `your_postgres_password` with your actual PostgreSQL password
- Get OpenAI API key from: https://platform.openai.com/api-keys
- For Gmail, use an **App Password** (not your regular password):
  1. Go to Google Account → Security
  2. Enable 2-Step Verification if not enabled
  3. Go to App Passwords → Generate
  4. Use this 16-character password for `SMTP_PASSWORD` and `IMAP_PASSWORD`

### Frontend Configuration (Optional)

The frontend uses Vite with a proxy configured in `vite.config.js` that automatically forwards `/api` requests to `http://localhost:5000`. No additional configuration needed!

## Step 4: Run the Application

You need **TWO terminals** running simultaneously:

### Terminal 1: Backend Server

```bash
cd backend
npm start
```

You should see:
```
Server is running on port 5000
```

If you see database connection errors, check your `.env` file and ensure PostgreSQL is running.

### Terminal 2: Frontend Development Server

```bash
cd frontend
npm start
```

Or if using Vite:
```bash
cd frontend
npm run dev
```

This will:
- Start the Vite development server
- Automatically open your browser to `http://localhost:5173` (or the port shown)
- Enable hot-reload (changes auto-refresh)

## Step 5: Access the Application

Open your browser and navigate to:
**http://localhost:5173** (or the port shown in terminal)

You should see the RFP Management System interface!

## Quick Test

1. **Create an RFP:**
   - Click "Create RFP"
   - Enter: "I need 10 laptops with 16GB RAM. Budget is $20,000. Delivery in 30 days."
   - Click "Create RFP"
   - You should see a structured RFP preview

2. **Add a Vendor:**
   - Go to "Vendors" page
   - Click "Add Vendor"
   - Fill in name and email
   - Click "Create Vendor"

3. **View RFPs:**
   - Go back to "RFPs" page
   - You should see your created RFP

## Troubleshooting

### Backend Issues

**Error: Cannot connect to database**
- Check PostgreSQL is running: `pg_isready` or check Windows Services
- Verify database exists: `psql -l | grep rfp_management`
- Check `.env` file has correct database credentials

**Error: Port 5000 already in use**
- Change `PORT` in `backend/.env` to another port (e.g., 5001)
- Update `FRONTEND_URL` if you changed the port

**Error: Module not found**
- Run `npm install` again in the `backend` folder
- Delete `node_modules` and `package-lock.json`, then `npm install`

### Frontend Issues

**Error: Cannot connect to backend**
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `frontend/.env` matches backend URL
- Check browser console for CORS errors (verify `FRONTEND_URL` in backend `.env`)

**Error: Module not found**
- Run `npm install` again in the `frontend` folder
- Delete `node_modules` and `package-lock.json`, then `npm install`

**Port 3000 already in use**
- React will ask to use a different port (e.g., 3001)
- Or kill the process using port 3000

### Database Issues

**Schema errors**
- Make sure you're connected to the correct database
- Check that schema.sql ran successfully
- Verify tables exist: `psql -d rfp_management -c "\dt"`

### Email Issues

**Cannot send emails**
- Use Gmail App Password (not regular password)
- Check SMTP settings in `.env`
- Verify firewall allows SMTP connections

**Cannot receive emails**
- Use Gmail App Password for IMAP
- Check IMAP is enabled in Gmail settings
- Verify IMAP settings in `.env`

### OpenAI API Issues

**API errors**
- Verify API key is correct and active
- Check you have credits in your OpenAI account
- Ensure GPT-4 access (may require API tier upgrade)

## Development Mode

For development with auto-reload:

**Backend:**
```bash
cd backend
npm run dev
```
(Requires nodemon - installs automatically)

**Frontend:**
```bash
cd frontend
npm start
```
(Already has hot-reload enabled)

## Production Build

To create production builds:

**Frontend:**
```bash
cd frontend
npm run build
```
Output will be in `frontend/build/`

**Backend:**
```bash
cd backend
NODE_ENV=production npm start
```

## Stopping the Application

- Press `Ctrl+C` in both terminal windows to stop the servers
- Close the browser tab

## Next Steps

Once running:
1. Create your first RFP using natural language
2. Add vendors to your system
3. Send RFPs to vendors via email
4. Check for vendor responses
5. Compare proposals and get AI recommendations

For detailed usage instructions, see the main README.md file.

