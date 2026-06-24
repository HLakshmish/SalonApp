import React, { useState, useEffect } from 'react';

// Self-contained Icon component to avoid bundling dependency syntax errors
const AdminIcon = ({ name, size = 18, className = '', style = {} }) => {
  const props = {
    width: size,
    height: size,
    className: className,
    style: style,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (name) {
    case 'settings':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...props}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );
    case 'activity':
      return (
        <svg {...props}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...props}>
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
        </svg>
      );
    case 'globe':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...props}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'map-pin':
      return (
        <svg {...props}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...props}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...props}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...props}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...props}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'save':
      return (
        <svg {...props}>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      );
    case 'info':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    default:
      return null;
  }
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [planData, setPlanData] = useState({
    plan_name: '',
    price: '',
    duration_days: '',
    max_salons: '',
    is_active: true
  });
  const [planMessage, setPlanMessage] = useState('');
  const [planError, setPlanError] = useState('');
  const [isPlanSubmitting, setIsPlanSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('website');
  const [plansList, setPlansList] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/subscription/plans');
      if (response.ok) {
        const data = await response.json();
        setPlansList(data);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

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
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    // Validations
    if (!formData.websiteName || formData.websiteName.trim().length === 0) {
      setError('Website Name is required.');
      setIsSubmitting(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.about || formData.about.trim().length === 0) {
      setError('About paragraph is required.');
      setIsSubmitting(false);
      return;
    } else if (formData.about.length > 1000) {
      setError('About paragraph cannot exceed 1000 characters.');
      setIsSubmitting(false);
      return;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
      setError('Phone number must be a valid 10-digit Indian mobile number.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.address || formData.address.trim().length === 0) {
      setError('Office Address is required.');
      setIsSubmitting(false);
      return;
    }
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    if (formData.websiteLink && !urlRegex.test(formData.websiteLink)) {
      setError('Website URL is invalid.');
      setIsSubmitting(false);
      return;
    }
    if (formData.instaLink && !urlRegex.test(formData.instaLink)) {
      setError('Instagram URL is invalid.');
      setIsSubmitting(false);
      return;
    }
    if (formData.facebookLink && !urlRegex.test(formData.facebookLink)) {
      setError('Facebook URL is invalid.');
      setIsSubmitting(false);
      return;
    }

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
        setMessage(data.message || 'Website details saved successfully!');
        // Automatically clear status message after 4 seconds
        setTimeout(() => setMessage(''), 4000);
      } else {
        setError(data.message || data.error || 'Failed to save website details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPlanData({ ...planData, [e.target.name]: value });
  };

  const handleEditPlan = (plan) => {
    setEditingPlanId(plan.id);
    setPlanData({
      plan_name: plan.plan_name,
      price: plan.price,
      duration_days: plan.duration_days,
      max_salons: plan.max_salons,
      is_active: plan.is_active
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingPlanId(null);
    setPlanData({ plan_name: '', price: '', duration_days: '', max_salons: '', is_active: true });
    setPlanMessage('');
    setPlanError('');
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription plan?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/subscription/plan/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        setPlanMessage('Plan deleted successfully!');
        fetchPlans();
        setTimeout(() => setPlanMessage(''), 3000);
      } else {
        const data = await response.json();
        setPlanError(data.error || 'Failed to delete plan');
        setTimeout(() => setPlanError(''), 3000);
      }
    } catch (err) {
      setPlanError('Network error. Failed to delete.');
    }
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    setPlanMessage('');
    setPlanError('');
    setIsPlanSubmitting(true);

    const url = editingPlanId 
      ? `http://localhost:3000/api/subscription/plan/${editingPlanId}`
      : 'http://localhost:3000/api/subscription/plan';
    const method = editingPlanId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          plan_name: planData.plan_name,
          price: parseFloat(planData.price),
          duration_days: parseInt(planData.duration_days, 10),
          max_salons: parseInt(planData.max_salons, 10),
          is_active: planData.is_active
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPlanMessage(`Subscription plan ${editingPlanId ? 'updated' : 'created'} successfully!`);
        setPlanData({ plan_name: '', price: '', duration_days: '', max_salons: '', is_active: true });
        setEditingPlanId(null);
        fetchPlans(); // Refresh the plans list
        setTimeout(() => setPlanMessage(''), 4000);
      } else {
        setPlanError(data.error || `Failed to ${editingPlanId ? 'update' : 'create'} plan`);
      }
    } catch (err) {
      setPlanError('Network error. Please try again.');
    } finally {
      setIsPlanSubmitting(false);
    }
  };

  return (
    <div className="admin-portal-wrapper">
      <div className="ambient-blob-3"></div>
      <style>{`
        .admin-portal-wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 50%, #f7f3ed 0%, #e8e0d5 100%);
          color: #2a251e;
          padding: 40px 5%;
          font-family: 'Montserrat', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .admin-portal-wrapper::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(207, 168, 86, 0.25) 0%, rgba(255, 255, 255, 0) 70%);
          top: -15%;
          right: -10%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .admin-portal-wrapper::after {
          content: '';
          position: absolute;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(207, 168, 86, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
          bottom: -15%;
          left: -15%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .ambient-blob-3 {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(184, 145, 57, 0.12) 0%, rgba(184, 145, 57, 0) 70%);
          top: 35%;
          left: 25%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(184, 145, 57, 0.18);
          padding-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
        }

        .admin-brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, rgba(184, 145, 57, 0.15) 0%, rgba(184, 145, 57, 0.05) 100%);
          border: 1px solid rgba(184, 145, 57, 0.35);
          border-radius: 12px;
          color: #8e722a;
          box-shadow: 0 4px 15px rgba(184, 145, 57, 0.08);
        }

        .admin-brand-icon svg {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .admin-brand:hover .admin-brand-icon svg {
          transform: rotate(180deg);
        }

        .admin-brand-text h1 {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 1px;
          margin: 0;
          color: #1a1612;
        }

        .admin-brand-text span {
          font-size: 11px;
          letter-spacing: 3px;
          color: #8e722a;
          text-transform: uppercase;
          font-weight: 600;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid rgba(184, 145, 57, 0.35);
          color: #8e722a;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          text-transform: uppercase;
        }

        .logout-btn:hover {
          background: rgba(184, 145, 57, 0.08);
          border-color: #aa8c2c;
          color: #aa8c2c;
          box-shadow: 0 4px 15px rgba(184, 145, 57, 0.15);
          transform: translateY(-2px);
        }

        .admin-grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          max-width: 1000px;
          margin: 0 auto;
          gap: 40px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 1024px) {
          .admin-grid-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(184, 145, 57, 0.22);
          border-radius: 20px;
          padding: 35px;
          box-shadow: 0 20px 40px rgba(184, 145, 57, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-card:hover {
          border-color: rgba(184, 145, 57, 0.35);
          box-shadow: 0 30px 60px rgba(184, 145, 57, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transform: translateY(-4px);
        }

        .admin-banner-container {
          position: relative;
          width: 100%;
          height: 180px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 30px;
          border: 1px solid rgba(184, 145, 57, 0.25);
          box-shadow: 0 10px 25px rgba(184, 145, 57, 0.08);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .admin-banner-container:hover {
          border-color: rgba(184, 145, 57, 0.45);
          box-shadow: 0 15px 35px rgba(184, 145, 57, 0.15);
          transform: translateY(-2px);
        }

        .admin-banner-image {
          width: 100%;
          height: 100%;
          background-image: url('/admin-banner.png');
          background-size: cover;
          background-position: center;
          transition: transform 0.8s ease;
        }

        .admin-banner-container:hover .admin-banner-image {
          transform: scale(1.05);
        }

        .admin-banner-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 100%);
          display: flex;
          align-items: flex-end;
          padding: 20px;
        }

        .admin-banner-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }

        .admin-banner-title span {
          display: block;
          font-size: 11px;
          color: #cfa856;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .live-preview-section {
          margin-top: 30px;
        }

        .preview-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
          color: #8e722a;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .mockup-footer {
          background: #0c0c0c;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .mockup-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #cfa856;
        }

        .mockup-brand {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #cfa856;
          margin-bottom: 10px;
        }

        .mockup-desc {
          font-size: 12px;
          color: #888;
          line-height: 1.5;
          margin-bottom: 20px;
          word-wrap: break-word;
          min-height: 36px;
        }

        .mockup-contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #aaa;
          margin-bottom: 8px;
        }

        .mockup-contact-item svg {
          color: #cfa856;
          flex-shrink: 0;
        }

        .mockup-socials {
          display: flex;
          gap: 12px;
          margin-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 15px;
        }

        .mockup-social-icon {
          color: #666;
          transition: color 0.3s;
        }

        .mockup-social-icon.active {
          color: #cfa856;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 30px;
        }

        .stat-box {
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(184, 145, 57, 0.15);
          border-radius: 12px;
          padding: 15px 10px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stat-box:hover {
          transform: translateY(-3px);
          border-color: rgba(184, 145, 57, 0.35);
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 10px 20px rgba(184, 145, 57, 0.08);
        }

        .stat-box-icon {
          margin-bottom: 8px;
          color: #8e722a;
        }

        .stat-box-title {
          font-size: 10px;
          color: #696055;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .stat-box-value {
          font-size: 12px;
          font-weight: 700;
          color: #1a1612;
        }

        .pulse-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #10b981;
          border-radius: 50%;
          margin-right: 6px;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .form-title-group {
          margin-bottom: 30px;
          border-bottom: 1px solid rgba(184, 145, 57, 0.18);
          padding-bottom: 15px;
        }

        .form-title-group h2 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: #8e722a;
          margin: 0 0 5px 0;
        }

        .form-title-group p {
          font-size: 13px;
          color: #696055;
          margin: 0;
        }

        .form-section-divider {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 15px 0 5px 0;
          color: rgba(142, 114, 42, 0.8);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 600;
        }

        .form-section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(184, 145, 57, 0.15);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 5px;
        }

        .input-group label {
          font-size: 12px;
          color: #554e45;
          margin-bottom: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .input-wrapper-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper-with-icon svg {
          position: absolute;
          left: 15px;
          color: rgba(42, 37, 30, 0.35);
          transition: color 0.3s;
          pointer-events: none;
        }

        .input-wrapper-with-icon input:focus ~ svg,
        .input-wrapper-with-icon textarea:focus ~ svg {
          color: #aa8c2c;
        }

        .admin-form-input {
          width: 100%;
          padding: 13px 15px 13px 45px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(184, 145, 57, 0.2);
          border-radius: 8px;
          color: #2a251e;
          font-size: 14px;
          transition: all 0.3s ease;
          box-shadow: inset 0 1px 3px rgba(184, 145, 57, 0.05);
        }

        .admin-form-input:focus {
          outline: none;
          border-color: #aa8c2c;
          box-shadow: 0 0 0 3px rgba(184, 145, 57, 0.15);
          background: #ffffff;
        }

        .admin-form-textarea {
          width: 100%;
          padding: 13px 15px 13px 45px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(184, 145, 57, 0.2);
          border-radius: 8px;
          color: #2a251e;
          font-size: 14px;
          transition: all 0.3s ease;
          box-shadow: inset 0 1px 3px rgba(184, 145, 57, 0.05);
          resize: vertical;
          min-height: 90px;
        }

        .admin-form-textarea:focus {
          outline: none;
          border-color: #aa8c2c;
          box-shadow: 0 0 0 3px rgba(184, 145, 57, 0.15);
          background: #ffffff;
        }

        .save-btn {
          width: 100%;
          background: linear-gradient(135deg, #cfa856 0%, #aa8c2c 100%);
          color: #000;
          border: none;
          padding: 15px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 2px;
          box-shadow: 0 4px 15px rgba(207, 168, 86, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .save-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #e8c678 0%, #cfa856 100%);
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(207, 168, 86, 0.35);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .alert-box {
          padding: 14px 18px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideDown 0.4s ease;
        }

        .alert-success {
          background: rgba(16, 185, 129, 0.08);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .full-width {
          grid-column: 1 / -1;
        }
      `}</style>

      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <AdminIcon name="settings" size={22} />
          </div>
          <div className="admin-brand-text">
            <h1>Lumière</h1>
            <span>Admin Portal</span>
          </div>
        </div>
        
        <button className="logout-btn" onClick={() => setCurrentView('home')}>
          <AdminIcon name="logout" size={16} />
          Logout / Home
        </button>
      </header>

      <div className="admin-grid-layout">
        


        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '15px', borderBottom: '1px solid rgba(184, 145, 57, 0.2)', paddingBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('website')}
              style={{
                background: 'none', border: 'none', padding: '10px 20px', cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '15px',
                color: activeTab === 'website' ? '#cfa856' : '#888',
                borderBottom: activeTab === 'website' ? '2px solid #cfa856' : '2px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              Website Details
            </button>
            <button 
              onClick={() => setActiveTab('subscription')}
              style={{
                background: 'none', border: 'none', padding: '10px 20px', cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '15px',
                color: activeTab === 'subscription' ? '#cfa856' : '#888',
                borderBottom: activeTab === 'subscription' ? '2px solid #cfa856' : '2px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              Subscription Plans
            </button>
          </div>

          {activeTab === 'website' && (
            <div className="glass-card">
              <div className="form-title-group">
                <h2>Update Website Details</h2>
                <p>Modify global contact options, about information, and external social media links.</p>
              </div>

          {message && (
            <div className="alert-box alert-success">
              <AdminIcon name="info" size={18} />
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="alert-box alert-error">
              <AdminIcon name="info" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            <div className="form-section-divider">Core Branding</div>

            <div className="input-group">
              <label>Website Name</label>
              <div className="input-wrapper-with-icon">
                <input 
                  type="text" 
                  name="websiteName" 
                  value={formData.websiteName} 
                  onChange={handleChange} 
                  required 
                  className="admin-form-input" 
                  placeholder="e.g. Looks Salon"
                />
                <AdminIcon name="sparkles" size={16} />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper-with-icon">
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="admin-form-input"
                  placeholder="e.g. contact@looks.com"
                />
                <AdminIcon name="mail" size={16} />
              </div>
            </div>

            <div className="input-group full-width">
              <label>About Paragraph</label>
              <div className="input-wrapper-with-icon">
                <textarea 
                  name="about" 
                  value={formData.about} 
                  onChange={handleChange} 
                  required 
                  rows="3" 
                  className="admin-form-textarea"
                  placeholder="Tell clients about your luxury salon services, styling philosophy, etc..."
                ></textarea>
                <AdminIcon name="info" size={16} style={{ top: '15px' }} />
              </div>
            </div>

            <div className="form-section-divider">Contact Details</div>

            <div className="input-group">
              <label>Phone Number</label>
              <div className="input-wrapper-with-icon">
                <input 
                  type="text" 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={handleChange} 
                  required 
                  className="admin-form-input"
                  placeholder="e.g. +1 (555) 019-2834"
                />
                <AdminIcon name="phone" size={16} />
              </div>
            </div>

            <div className="input-group">
              <label>Office Address</label>
              <div className="input-wrapper-with-icon">
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                  className="admin-form-input"
                  placeholder="e.g. 123 Beauty Ave, Suite 10"
                />
                <AdminIcon name="map-pin" size={16} />
              </div>
            </div>

            <div className="form-section-divider">Integrations & Social Links</div>

            <div className="input-group">
              <label>Website URL</label>
              <div className="input-wrapper-with-icon">
                <input 
                  type="text" 
                  name="websiteLink" 
                  value={formData.websiteLink} 
                  onChange={handleChange} 
                  className="admin-form-input"
                  placeholder="e.g. https://looks.com"
                />
                <AdminIcon name="globe" size={16} />
              </div>
            </div>

            <div className="input-group">
              <label>Instagram URL</label>
              <div className="input-wrapper-with-icon">
                <input 
                  type="text" 
                  name="instaLink" 
                  value={formData.instaLink} 
                  onChange={handleChange} 
                  className="admin-form-input"
                  placeholder="e.g. https://instagram.com/looks"
                />
                <AdminIcon name="instagram" size={16} />
              </div>
            </div>

            <div className="input-group full-width">
              <label>Facebook URL</label>
              <div className="input-wrapper-with-icon">
                <input 
                  type="text" 
                  name="facebookLink" 
                  value={formData.facebookLink} 
                  onChange={handleChange} 
                  className="admin-form-input"
                  placeholder="e.g. https://facebook.com/lookssalon"
                />
                <AdminIcon name="facebook" size={16} />
              </div>
            </div>

            <div className="full-width" style={{ marginTop: '20px' }}>
              <button 
                type="submit" 
                className="save-btn" 
                disabled={isSubmitting}
              >
                <AdminIcon name="save" size={18} />
                {isSubmitting ? 'Saving Changes...' : 'Save Configuration'}
              </button>
            </div>

          </form>
        </div>
        )}

        {/* Subscription Plan Creation Card */}
        {activeTab === 'subscription' && (
        <div className="glass-card">
          <div className="form-title-group">
            <h2>{editingPlanId ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</h2>
            <p>{editingPlanId ? 'Modify the details of the selected subscription plan.' : 'Define new subscription packages for salon owners.'}</p>
          </div>

          {planMessage && (
            <div className="alert-box alert-success">
              <AdminIcon name="info" size={18} />
              <span>{planMessage}</span>
            </div>
          )}
          {planError && (
            <div className="alert-box alert-error">
              <AdminIcon name="info" size={18} />
              <span>{planError}</span>
            </div>
          )}

          <form onSubmit={handlePlanSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label>Plan Name</label>
              <div className="input-wrapper-with-icon">
                <input type="text" name="plan_name" value={planData.plan_name} onChange={handlePlanChange} required className="admin-form-input" placeholder="e.g. basic" />
                <AdminIcon name="sparkles" size={16} />
              </div>
            </div>

            <div className="input-group">
              <label>Price (INR)</label>
              <div className="input-wrapper-with-icon">
                <input type="number" name="price" value={planData.price} onChange={handlePlanChange} required min="0" className="admin-form-input" placeholder="e.g. 100" />
                <AdminIcon name="star" size={16} />
              </div>
            </div>

            <div className="input-group">
              <label>Duration (Days)</label>
              <div className="input-wrapper-with-icon">
                <input type="number" name="duration_days" value={planData.duration_days} onChange={handlePlanChange} required min="1" className="admin-form-input" placeholder="e.g. 365" />
                <AdminIcon name="calendar" size={16} />
              </div>
            </div>

            <div className="input-group">
              <label>Max Salons Allowed</label>
              <div className="input-wrapper-with-icon">
                <input type="number" name="max_salons" value={planData.max_salons} onChange={handlePlanChange} required min="1" className="admin-form-input" placeholder="e.g. 1" />
                <AdminIcon name="users" size={16} />
              </div>
            </div>

            <div className="input-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" name="is_active" checked={planData.is_active} onChange={handlePlanChange} id="plan_is_active" style={{ width: '20px', height: '20px', accentColor: 'var(--gold-accent, #d4af37)' }} />
              <label htmlFor="plan_is_active" style={{ margin: 0, cursor: 'pointer', fontWeight: 600, color: '#333' }}>Is Active</label>
            </div>

            <div className="full-width" style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
              <button type="submit" className="save-btn" disabled={isPlanSubmitting}>
                <AdminIcon name="save" size={18} />
                {isPlanSubmitting ? 'Saving...' : (editingPlanId ? 'Update Plan' : 'Create Plan')}
              </button>
              {editingPlanId && (
                <button type="button" className="save-btn" onClick={handleCancelEdit} style={{ background: 'transparent', color: '#666', border: '1px solid #ccc' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#8e722a', borderBottom: '1px solid rgba(184, 145, 57, 0.2)', paddingBottom: '10px', marginBottom: '20px' }}>Existing Plans</h3>
            {plansList.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
                {plansList.map(plan => (
                  <div key={plan.id} style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(184, 145, 57, 0.2)', borderRadius: '12px', padding: '15px', position: 'relative' }}>
                    <h4 style={{ margin: '0 0 15px 0', textTransform: 'capitalize', color: '#2a251e', fontSize: '18px' }}>{plan.plan_name}</h4>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#555', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{color: '#888'}}>Price:</span> <strong>₹{plan.price}</strong>
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#555', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{color: '#888'}}>Duration:</span> <strong>{plan.duration_days} days</strong>
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#555', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{color: '#888'}}>Max Salons:</span> <strong>{plan.max_salons}</strong>
                    </p>
                    <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', background: plan.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: plan.is_active ? '#10b981' : '#ef4444' }}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </div>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(184, 145, 57, 0.15)' }}>
                      <button onClick={() => handleEditPlan(plan)} style={{ background: 'none', border: 'none', color: '#8e722a', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <AdminIcon name="settings" size={14} /> Edit
                      </button>
                      <button onClick={() => handleDeletePlan(plan.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <AdminIcon name="info" size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#888', fontStyle: 'italic', fontSize: '14px' }}>No plans have been created yet.</p>
            )}
          </div>

        </div>
        )}

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
