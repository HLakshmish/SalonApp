import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ authToken, setCurrentView }) => {
  const [formData, setFormData] = useState({
    websiteName: '',
    about: '',
    address: '',
    phoneNumber: '',
    email: '',
    websiteLink: '',
    instaLink: '',
    facebookLink: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/website-details');
        if (response.ok) {
          const data = await response.json();
          setFormData({
            websiteName: data.websiteName || '',
            about: data.about || '',
            address: data.address || '',
            phoneNumber: data.phoneNumber || '',
            email: data.email || '',
            websiteLink: data.websiteLink || '',
            instaLink: data.instaLink || '',
            facebookLink: data.facebookLink || ''
          });
        }
      } catch (error) {
        console.error("Failed to fetch website details:", error);
      }
    };
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/admin/website-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Website details saved successfully');
      } else {
        setError(data.message || data.error || 'Failed to save website details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8f5f2', minHeight: '100vh', color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
        <button 
          onClick={() => setCurrentView('home')}
          style={{ padding: '10px 20px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout / Home
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>Update Website Details</h2>
        
        {message && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>{message}</div>}
        {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Website Name</label>
            <input type="text" name="websiteName" value={formData.websiteName} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>About</label>
            <textarea name="about" value={formData.about} onChange={handleChange} required rows="4" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Website Link</label>
            <input type="text" name="websiteLink" value={formData.websiteLink} onChange={handleChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Instagram Link</label>
            <input type="text" name="instaLink" value={formData.instaLink} onChange={handleChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Facebook Link</label>
            <input type="text" name="facebookLink" value={formData.facebookLink} onChange={handleChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#d4af37', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
