# Project Structure

```
internship_proj/
├── backend/                    # Node.js/Express Backend
│   ├── db/                     # Database related files
│   │   ├── connection.js      # PostgreSQL connection pool
│   │   ├── init.js            # Database initialization script
│   │   └── schema.sql         # Database schema (tables, indexes)
│   ├── routes/                # API route handlers
│   │   ├── ai.js              # AI comparison endpoints
│   │   ├── email.js           # Email sending/receiving endpoints
│   │   ├── proposal.js        # Proposal CRUD endpoints
│   │   ├── rfp.js             # RFP CRUD endpoints
│   │   └── vendor.js          # Vendor CRUD endpoints
│   ├── services/              # Business logic services
│   │   ├── aiService.js       # OpenAI integration (RFP creation, parsing, comparison)
│   │   └── emailService.js    # Email sending (Nodemailer) and receiving (IMAP)
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Backend dependencies
│   └── server.js              # Express server entry point
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ProposalComparison.js/css  # Proposal comparison view
│   │   │   ├── RFPCreator.js/css           # RFP creation form
│   │   │   ├── RFPList.js/css              # RFP list view
│   │   │   └── VendorManagement.js/css     # Vendor management
│   │   ├── services/
│   │   │   └── api.js         # API client (Axios)
│   │   ├── App.js             # Main app component with routing
│   │   ├── App.css            # App styles
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Frontend dependencies
│   └── .env                   # Frontend environment (optional)
│
├── README.md                  # Main documentation
├── SETUP.md                   # Quick setup guide
├── PROJECT_STRUCTURE.md       # This file
└── .gitignore                # Git ignore rules
```

## Key Files Explained

### Backend

**server.js**
- Express server setup
- Middleware configuration (CORS, body parser)
- Route registration
- Server startup

**db/schema.sql**
- PostgreSQL schema definition
- Tables: vendors, rfps, rfp_vendors, proposals, ai_recommendations
- Indexes for performance

**services/aiService.js**
- `createRFPFromNaturalLanguage()` - Converts natural language to structured RFP
- `parseVendorResponse()` - Extracts structured data from vendor emails
- `generateProposalComparison()` - Generates AI comparison and recommendations

**services/emailService.js**
- `sendRFPEmail()` - Sends RFP to vendors via SMTP
- `checkForVendorResponses()` - Checks IMAP inbox for new responses

### Frontend

**App.js**
- React Router setup
- Navigation structure
- Route definitions

**components/RFPCreator.js**
- Natural language input form
- Displays structured RFP preview
- Calls AI API to create RFP

**components/RFPList.js**
- Lists all RFPs
- Send RFP to vendors modal
- Delete RFP functionality

**components/VendorManagement.js**
- CRUD operations for vendors
- Add, edit, delete vendors

**components/ProposalComparison.js**
- Displays RFP details
- Shows all proposals
- AI comparison and recommendations
- Check for new email responses

**services/api.js**
- Centralized API client
- All backend API calls
- Axios configuration

## Data Flow

1. **RFP Creation:**
   User input → Frontend → Backend API → AI Service → Database

2. **Sending RFP:**
   RFP selection → Vendor selection → Email Service → SMTP → Vendor inbox

3. **Receiving Response:**
   Vendor email → IMAP → Email Service → AI Service (parsing) → Database

4. **Comparison:**
   Proposals → AI Service → Comparison → Database → Frontend display

## Database Schema

- **vendors**: Vendor contact information
- **rfps**: RFP details and requirements
- **rfp_vendors**: Many-to-many relationship (which vendors received which RFPs)
- **proposals**: Vendor responses with parsed data
- **ai_recommendations**: AI-generated comparisons and rankings

