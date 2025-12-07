# AI-Powered RFP Management System

A comprehensive web application that streamlines the Request for Proposal (RFP) workflow using AI to automate procurement processes.

## Features

- **Natural Language RFP Creation**: Describe procurement needs in plain English, and AI converts it into a structured RFP
- **Vendor Management**: Maintain a database of vendors with contact information
- **Automated Email Sending**: Send RFPs to multiple vendors via email
- **AI-Powered Response Parsing**: Automatically extract structured data from vendor response emails
- **Proposal Comparison**: AI-assisted comparison and recommendation system to help choose the best vendor

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **OpenAI GPT-4** - AI/LLM integration
- **Nodemailer** - Email sending (SMTP)
- **IMAP** - Email receiving

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- OpenAI API key
- Email account with SMTP/IMAP access (Gmail recommended)

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd internship_proj
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rfp_management
DB_USER=postgres
DB_PASSWORD=your_password

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Email Configuration (SMTP for sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# Email Configuration (IMAP for receiving)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your_email@gmail.com
IMAP_PASSWORD=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

Create a PostgreSQL database:

```bash
createdb rfp_management
```

Or using psql:

```sql
CREATE DATABASE rfp_management;
```

Run the schema:

```bash
psql -U postgres -d rfp_management -f backend/db/schema.sql
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Running the Application

**Start the backend server:**

```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

**Start the frontend:**

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## API Documentation

### RFP Endpoints

- `POST /api/rfps/create-from-text` - Create RFP from natural language
  - Body: `{ "userInput": "I need to procure..." }`
  
- `GET /api/rfps` - Get all RFPs
- `GET /api/rfps/:id` - Get single RFP
- `PUT /api/rfps/:id` - Update RFP
- `DELETE /api/rfps/:id` - Delete RFP

### Vendor Endpoints

- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get single vendor
- `POST /api/vendors` - Create vendor
  - Body: `{ "name": "...", "email": "...", ... }`
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Proposal Endpoints

- `GET /api/proposals/rfp/:rfpId` - Get all proposals for an RFP
- `GET /api/proposals/:id` - Get single proposal
- `POST /api/proposals` - Create proposal (usually via email parsing)

### Email Endpoints

- `POST /api/email/send-rfp` - Send RFP to vendors
  - Body: `{ "rfpId": 1, "vendorIds": [1, 2, 3] }`
  
- `POST /api/email/check-responses` - Check for new vendor response emails

### AI Endpoints

- `POST /api/ai/compare-proposals/:rfpId` - Generate AI comparison and recommendation
- `GET /api/ai/recommendations/:rfpId` - Get AI recommendations for an RFP

## Usage Guide

### 1. Create an RFP

1. Navigate to "Create RFP" in the application
2. Enter your procurement requirements in natural language, for example:
   ```
   I need to procure laptops and monitors for our new office. Budget is $50,000 total. 
   Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. 
   Payment terms should be net 30, and we need at least 1 year warranty.
   ```
3. Click "Create RFP"
4. The AI will parse your input and create a structured RFP

### 2. Manage Vendors

1. Go to "Vendors" page
2. Click "Add Vendor" to add new vendors
3. Fill in vendor details (name, email, contact person, etc.)
4. Edit or delete vendors as needed

### 3. Send RFP to Vendors

1. Go to the RFPs list
2. Click "Send to Vendors" on an RFP
3. Select the vendors you want to send the RFP to
4. Click "Send RFP"
5. Emails will be sent to selected vendors

### 4. Receive and Parse Vendor Responses

1. Vendors reply to the RFP email
2. In the proposal comparison page, click "Check for New Responses"
3. The system will:
   - Check for new emails
   - Identify vendor responses
   - Use AI to extract structured data (prices, terms, etc.)
   - Automatically create proposal records

### 5. Compare Proposals and Get Recommendations

1. Navigate to an RFP's proposal comparison page
2. Once you have at least 2 proposals, click "Generate AI Comparison"
3. The AI will:
   - Compare all proposals
   - Rank vendors
   - Provide a recommendation with reasoning

## Key Design Decisions

### RFP Structure
- RFPs are stored with structured fields: title, description, budget, deadlines, terms
- Requirements are stored as JSONB for flexibility
- Status tracking: draft → sent → completed

### AI Integration
- **RFP Creation**: Uses GPT-4 with structured JSON output to convert natural language to structured RFP
- **Response Parsing**: GPT-4 extracts key information from vendor emails (prices, terms, delivery times)
- **Comparison**: GPT-4 analyzes proposals and provides rankings and recommendations

### Email Handling
- **Sending**: Uses Nodemailer with SMTP
- **Receiving**: Uses IMAP to check for new emails
- Email parsing identifies vendor responses by keywords (proposal, quote, RFP, etc.)

### Database Design
- PostgreSQL with normalized schema
- JSONB fields for flexible data (requirements, itemized prices, parsed data)
- Foreign key relationships for data integrity

## Assumptions & Limitations

### Assumptions
1. Single-user system (no authentication required)
2. Email responses come from known vendor emails
3. Vendor responses contain relevant keywords (proposal, quote, etc.)
4. Gmail is used for email (can be configured for other providers)
5. OpenAI GPT-4 API is available and accessible

### Known Limitations
1. Email parsing requires manual trigger ("Check for New Responses" button)
2. IMAP email checking is not real-time (polling-based)
3. Vendor response matching is based on email address matching
4. No support for complex attachments (PDF parsing not implemented)
5. No email tracking (opens, clicks)
6. No version control for RFPs

## Future Enhancements

- Real-time email polling/notification
- PDF attachment parsing
- Multi-user support with authentication
- Email tracking and analytics
- RFP templates and versioning
- Advanced filtering and search
- Export functionality (PDF, Excel)
- Integration with procurement systems

## AI Tools Usage

This project was built with assistance from:
- **Cursor AI** - Code generation, refactoring, and debugging
- **ChatGPT/Claude** - Design decisions and architecture planning

AI tools helped with:
- Generating boilerplate code structure
- Creating API endpoints and database schemas
- Designing React components and styling
- Writing documentation
- Debugging and error handling

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check that the database exists

### Email Sending Issues
- For Gmail, use an "App Password" instead of regular password
- Enable "Less secure app access" or use OAuth2
- Verify SMTP settings match your email provider

### Email Receiving Issues
- Ensure IMAP is enabled in your email account
- Check IMAP credentials
- Verify firewall/network allows IMAP connections

### OpenAI API Issues
- Verify API key is correct and has credits
- Check API rate limits
- Ensure GPT-4 access (may require API tier upgrade)

## License

This project is created for internship assignment purposes.

## Contact

For questions or issues, please refer to the repository issues or contact the development team.
