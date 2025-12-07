import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRFPFromText } from '../services/api';
import './RFPCreator.css';

function RFPCreator() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [structuredRFP, setStructuredRFP] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) {
      setError('Please enter your procurement requirements');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createRFPFromText(userInput);
      setStructuredRFP(response.data.structuredData);
      
      // Auto-navigate to RFP list after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create RFP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rfp-creator">
      <h2>Create New RFP</h2>
      <p className="subtitle">Describe what you need to procure in natural language</p>

      <form onSubmit={handleSubmit} className="rfp-form">
        <div className="form-group">
          <label htmlFor="userInput">Procurement Requirements</label>
          <textarea
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Example: I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty."
            rows="8"
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating RFP...' : 'Create RFP'}
        </button>
      </form>

      {structuredRFP && (
        <div className="structured-preview">
          <h3>Structured RFP Created:</h3>
          <div className="preview-card">
            <p><strong>Title:</strong> {structuredRFP.title}</p>
            <p><strong>Description:</strong> {structuredRFP.description}</p>
            <p><strong>Budget:</strong> {structuredRFP.budget ? `$${structuredRFP.budget.toLocaleString()}` : 'Not specified'}</p>
            <p><strong>Delivery Deadline:</strong> {structuredRFP.delivery_deadline || 'Not specified'}</p>
            <p><strong>Payment Terms:</strong> {structuredRFP.payment_terms || 'Not specified'}</p>
            <p><strong>Warranty Terms:</strong> {structuredRFP.warranty_terms || 'Not specified'}</p>
            {structuredRFP.requirements && structuredRFP.requirements.length > 0 && (
              <div>
                <strong>Requirements:</strong>
                <ul>
                  {structuredRFP.requirements.map((req, idx) => (
                    <li key={idx}>
                      {req.item_name}: {req.quantity} units
                      {req.specifications && ` - ${req.specifications}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className="success-message">✓ RFP created successfully! Redirecting...</p>
        </div>
      )}
    </div>
  );
}

export default RFPCreator;

