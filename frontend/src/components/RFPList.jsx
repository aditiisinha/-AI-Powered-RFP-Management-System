import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRFPs, deleteRFP, sendRFP, getVendors } from '../services/api';
import './RFPList.css';

function RFPList() {
  const [rfps, setRfps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRFP, setSelectedRFP] = useState(null);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rfpsResponse, vendorsResponse] = await Promise.all([
        getRFPs(),
        getVendors()
      ]);
      setRfps(rfpsResponse.data);
      setVendors(vendorsResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this RFP?')) {
      return;
    }

    try {
      await deleteRFP(id);
      setRfps(rfps.filter(rfp => rfp.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete RFP');
    }
  };

  const handleSendRFP = async () => {
    if (selectedVendors.length === 0) {
      alert('Please select at least one vendor');
      return;
    }

    setSending(true);
    try {
      const rfpId = selectedRFP._id || selectedRFP.id;
      await sendRFP(rfpId, selectedVendors);
      alert('RFP sent successfully!');
      setSelectedRFP(null);
      setSelectedVendors([]);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send RFP');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading RFPs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="rfp-list">
      <div className="header">
        <h2>RFPs</h2>
        <Link to="/create" className="create-btn">+ Create New RFP</Link>
      </div>

      {rfps.length === 0 ? (
        <div className="empty-state">
          <p>No RFPs yet. Create your first RFP to get started!</p>
          <Link to="/create" className="create-btn">Create RFP</Link>
        </div>
      ) : (
        <div className="rfp-grid">
          {rfps.map(rfp => (
            <div key={rfp._id || rfp.id} className="rfp-card">
              <div className="rfp-card-header">
                <h3>{rfp.title}</h3>
                <span className={`status-badge status-${rfp.status}`}>
                  {rfp.status}
                </span>
              </div>
              <p className="rfp-description">{rfp.description}</p>
              <div className="rfp-details">
                {rfp.budget && (
                  <div className="detail-item">
                    <strong>Budget:</strong> ${parseFloat(rfp.budget).toLocaleString()}
                  </div>
                )}
                {rfp.delivery_deadline && (
                  <div className="detail-item">
                    <strong>Deadline:</strong> {new Date(rfp.delivery_deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="rfp-actions">
                <button
                  onClick={() => setSelectedRFP(rfp)}
                  className="action-btn send-btn"
                >
                  Send to Vendors
                </button>
                <Link to={`/rfp/${rfp._id || rfp.id}`} className="action-btn view-btn">
                  View Proposals
                </Link>
                <button
                  onClick={() => handleDelete(rfp._id || rfp.id)}
                  className="action-btn delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRFP && (
        <div className="modal-overlay" onClick={() => setSelectedRFP(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Send RFP to Vendors</h3>
            <p><strong>RFP:</strong> {selectedRFP.title}</p>
            <div className="vendor-selection">
              <h4>Select Vendors:</h4>
              {vendors.length === 0 ? (
                <p>No vendors available. <Link to="/vendors">Add vendors first</Link></p>
              ) : (
                vendors.map(vendor => (
                  <label key={vendor._id || vendor.id} className="vendor-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor._id || vendor.id)}
                      onChange={(e) => {
                        const vendorId = vendor._id || vendor.id;
                        if (e.target.checked) {
                          setSelectedVendors([...selectedVendors, vendorId]);
                        } else {
                          setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
                        }
                      }}
                    />
                    <span className="vendor-info">
                      <strong>{vendor.name}</strong>
                      <span className="vendor-email">{vendor.email}</span>
                    </span>
                  </label>
                ))
              )}
            </div>
            <div className="modal-actions">
              <button onClick={() => setSelectedRFP(null)} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={handleSendRFP}
                disabled={sending || selectedVendors.length === 0}
                className="send-btn"
              >
                {sending ? 'Sending...' : 'Send RFP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RFPList;

