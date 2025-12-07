import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRFP, getProposals, compareProposals, getRecommendations, checkResponses } from '../services/api';
import './ProposalComparison.css';

function ProposalComparison() {
  const { id } = useParams();
  const [rfp, setRfp] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [rfpResponse, proposalsResponse] = await Promise.all([
        getRFP(id),
        getProposals(id)
      ]);
      setRfp(rfpResponse.data);
      setProposals(proposalsResponse.data);

      // Try to load existing recommendation
      try {
        const recResponse = await getRecommendations(id);
        setRecommendation(recResponse.data);
      } catch (err) {
        // No recommendation yet, that's okay
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckResponses = async () => {
    try {
      await checkResponses();
      alert('Checking for new responses... Please refresh the page in a moment.');
      setTimeout(() => loadData(), 2000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to check for responses');
    }
  };

  const handleCompare = async () => {
    if (proposals.length < 2) {
      alert('Need at least 2 proposals to compare');
      return;
    }

    setComparing(true);
    try {
      const response = await compareProposals(id);
      setRecommendation(response.data.comparison);
      loadData(); // Reload to get updated data
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate comparison');
    } finally {
      setComparing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!rfp) {
    return <div className="error">RFP not found</div>;
  }

  return (
    <div className="proposal-comparison">
      <div className="header">
        <h2>{rfp.title}</h2>
        <div className="header-actions">
          <button onClick={handleCheckResponses} className="check-btn">
            Check for New Responses
          </button>
          {proposals.length >= 2 && (
            <button
              onClick={handleCompare}
              disabled={comparing}
              className="compare-btn"
            >
              {comparing ? 'Generating...' : 'Generate AI Comparison'}
            </button>
          )}
        </div>
      </div>

      <div className="rfp-details">
        <h3>RFP Details</h3>
        <div className="details-grid">
          <div><strong>Description:</strong> {rfp.description}</div>
          {rfp.budget && <div><strong>Budget:</strong> ${parseFloat(rfp.budget).toLocaleString()}</div>}
          {rfp.delivery_deadline && (
            <div><strong>Deadline:</strong> {new Date(rfp.delivery_deadline).toLocaleDateString()}</div>
          )}
          {rfp.payment_terms && <div><strong>Payment Terms:</strong> {rfp.payment_terms}</div>}
          {rfp.warranty_terms && <div><strong>Warranty:</strong> {rfp.warranty_terms}</div>}
        </div>
      </div>

      {recommendation && (
        <div className="recommendation-section">
          <h3>AI Recommendation</h3>
          <div className="recommendation-card">
            {recommendation.comparison_summary && (
              <div className="comparison-summary">
                <h4>Comparison Summary</h4>
                <p>{recommendation.comparison_summary}</p>
              </div>
            )}
            {recommendation.vendor_rankings && (
              <div className="rankings">
                <h4>Vendor Rankings</h4>
                {JSON.parse(recommendation.vendor_rankings).map((ranking, idx) => (
                  <div key={idx} className="ranking-item">
                    <div className="rank-number">#{ranking.rank}</div>
                    <div className="rank-details">
                      <strong>{ranking.vendor_name}</strong>
                      <div className="rank-score">Score: {ranking.score}/100</div>
                      <p className="rank-reasoning">{ranking.reasoning}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {recommendation.recommendation && (
              <div className="final-recommendation">
                <h4>Recommendation</h4>
                <p>{recommendation.recommendation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="proposals-section">
        <h3>Proposals ({proposals.length})</h3>
        {proposals.length === 0 ? (
          <div className="empty-state">
            <p>No proposals received yet. Check for responses or wait for vendors to reply.</p>
          </div>
        ) : (
          <div className="proposals-grid">
            {proposals.map(proposal => (
              <div key={proposal.id} className="proposal-card">
                <div className="proposal-header">
                  <h4>{proposal.vendor_name}</h4>
                  {proposal.completeness_score && (
                    <span className="completeness-score">
                      {proposal.completeness_score}% Complete
                    </span>
                  )}
                </div>
                <div className="proposal-details">
                  {proposal.total_price && (
                    <div className="detail-row">
                      <strong>Total Price:</strong> ${parseFloat(proposal.total_price).toLocaleString()}
                    </div>
                  )}
                  {proposal.delivery_time && (
                    <div className="detail-row">
                      <strong>Delivery Time:</strong> {proposal.delivery_time}
                    </div>
                  )}
                  {proposal.payment_terms && (
                    <div className="detail-row">
                      <strong>Payment Terms:</strong> {proposal.payment_terms}
                    </div>
                  )}
                  {proposal.warranty_terms && (
                    <div className="detail-row">
                      <strong>Warranty:</strong> {proposal.warranty_terms}
                    </div>
                  )}
                  {proposal.additional_terms && (
                    <div className="detail-row">
                      <strong>Additional Terms:</strong> {proposal.additional_terms}
                    </div>
                  )}
                  {proposal.itemized_prices && proposal.itemized_prices.length > 0 && (
                    <div className="itemized-prices">
                      <strong>Itemized Prices:</strong>
                      <ul>
                        {proposal.itemized_prices.map((item, idx) => (
                          <li key={idx}>
                            {item.item_name}: ${parseFloat(item.price || 0).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="proposal-footer">
                  <small>Received: {new Date(proposal.received_at).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProposalComparison;

