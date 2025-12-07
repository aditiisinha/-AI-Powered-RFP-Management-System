import React, { useState, useEffect } from 'react';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../services/api';
import './VendorManagement.css';

function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_person: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await getVendors();
      setVendors(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        await updateVendor(editingVendor.id, formData);
      } else {
        await createVendor(formData);
      }
      setShowForm(false);
      setEditingVendor(null);
      setFormData({ name: '', email: '', contact_person: '', phone: '', address: '' });
      loadVendors();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save vendor');
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      contact_person: vendor.contact_person || '',
      phone: vendor.phone || '',
      address: vendor.address || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) {
      return;
    }

    try {
      await deleteVendor(id);
      loadVendors();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete vendor');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVendor(null);
    setFormData({ name: '', email: '', contact_person: '', phone: '', address: '' });
  };

  if (loading) {
    return <div className="loading">Loading vendors...</div>;
  }

  return (
    <div className="vendor-management">
      <div className="header">
        <h2>Vendor Management</h2>
        <button onClick={() => setShowForm(true)} className="create-btn">
          + Add Vendor
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="vendor-form-container">
          <h3>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h3>
          <form onSubmit={handleSubmit} className="vendor-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Person</label>
                <input
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {editingVendor ? 'Update' : 'Create'} Vendor
              </button>
            </div>
          </form>
        </div>
      )}

      {vendors.length === 0 ? (
        <div className="empty-state">
          <p>No vendors yet. Add your first vendor to get started!</p>
        </div>
      ) : (
        <div className="vendor-grid">
          {vendors.map(vendor => (
            <div key={vendor.id} className="vendor-card">
              <h3>{vendor.name}</h3>
              <div className="vendor-details">
                <p><strong>Email:</strong> {vendor.email}</p>
                {vendor.contact_person && (
                  <p><strong>Contact:</strong> {vendor.contact_person}</p>
                )}
                {vendor.phone && (
                  <p><strong>Phone:</strong> {vendor.phone}</p>
                )}
                {vendor.address && (
                  <p><strong>Address:</strong> {vendor.address}</p>
                )}
              </div>
              <div className="vendor-actions">
                <button onClick={() => handleEdit(vendor)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(vendor.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VendorManagement;

