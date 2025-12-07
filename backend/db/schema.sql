-- Create database schema for RFP Management System

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RFPs table
CREATE TABLE IF NOT EXISTS rfps (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    budget DECIMAL(15, 2),
    delivery_deadline DATE,
    payment_terms VARCHAR(255),
    warranty_terms VARCHAR(255),
    requirements JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RFP-Vendor mapping (many-to-many)
CREATE TABLE IF NOT EXISTS rfp_vendors (
    id SERIAL PRIMARY KEY,
    rfp_id INTEGER REFERENCES rfps(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    sent_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    UNIQUE(rfp_id, vendor_id)
);

-- Proposals table (vendor responses)
CREATE TABLE IF NOT EXISTS proposals (
    id SERIAL PRIMARY KEY,
    rfp_id INTEGER REFERENCES rfps(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    email_subject VARCHAR(500),
    email_body TEXT,
    total_price DECIMAL(15, 2),
    itemized_prices JSONB,
    delivery_time VARCHAR(255),
    payment_terms VARCHAR(255),
    warranty_terms VARCHAR(255),
    additional_terms TEXT,
    raw_response TEXT,
    parsed_data JSONB,
    completeness_score DECIMAL(5, 2),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id SERIAL PRIMARY KEY,
    rfp_id INTEGER REFERENCES rfps(id) ON DELETE CASCADE,
    recommendation_text TEXT,
    vendor_rankings JSONB,
    comparison_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rfps_status ON rfps(status);
CREATE INDEX IF NOT EXISTS idx_proposals_rfp_id ON proposals(rfp_id);
CREATE INDEX IF NOT EXISTS idx_proposals_vendor_id ON proposals(vendor_id);
CREATE INDEX IF NOT EXISTS idx_rfp_vendors_rfp_id ON rfp_vendors(rfp_id);

