import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CallbackRequest = ({ salon }) => {
  const { t } = useTranslation();
  
  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactServices, setContactServices] = useState('');
  const [contactPurpose, setContactPurpose] = useState('');
  const [contactDateTime, setContactDateTime] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState('idle');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('submitting');
    
    const payload = {
      name: contactName,
      phoneNumber: contactPhone,
      email: contactEmail,
      services: contactServices,
      purpose: contactPurpose,
      dateTime: contactDateTime ? new Date(contactDateTime).toISOString() : new Date().toISOString(),
      message: contactMessage,
      status: "pending",
      salonId: salon?.id || 0
    };

    try {
      const response = await fetch('http://localhost:3000/api/callbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setContactStatus('success');
        setContactName('');
        setContactPhone('');
        setContactEmail('');
        setContactServices('');
        setContactPurpose('');
        setContactDateTime('');
        setContactMessage('');
        alert("Callback request submitted successfully.");
      } else {
        const errorData = await response.json();
        setContactStatus('idle');
        alert("Failed to submit request: " + (errorData.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setContactStatus('idle');
      alert("Network error. Please try again.");
    }
  };

  return (
    <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
      <style>{`
        .premium-contact-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 50px;
          border-radius: 24px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          max-width: 650px;
          width: 100%;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05), inset 0 0 20px rgba(212, 175, 55, 0.02);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .premium-contact-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1), inset 0 0 30px rgba(212, 175, 55, 0.05);
          border-color: rgba(212, 175, 55, 0.4);
        }
        .premium-input {
          flex: 1;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #111;
          border-radius: 12px;
          outline: none;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .premium-input:focus {
          background: rgba(0, 0, 0, 0.05);
          border-color: var(--gold-accent, #d4af37);
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.15);
          transform: translateY(-2px);
        }
        .premium-input::placeholder {
          color: rgba(0, 0, 0, 0.4);
        }
        .premium-btn {
          padding: 18px;
          background: linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%);
          color: #000;
          border: none;
          border-radius: 12px;
          font-size: 1.15rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          position: relative;
          overflow: hidden;
        }
        .premium-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.5s ease;
        }
        .premium-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #f1c40f 0%, #d4af37 100%);
          transform: scale(1.02) translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
        }
        .premium-btn:hover:not(:disabled)::before {
          left: 100%;
        }
        .premium-btn:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
        }
      `}</style>

      {/* Request Callback Card */}
      <div className="premium-contact-card">
        <h3 id="request-callback-heading" style={{ fontSize: '2rem', marginBottom: '35px', color: 'var(--gold-accent, #d4af37)', textAlign: 'center', fontWeight: '800', letterSpacing: '1px' }}>{t('Request a Callback')}</h3>
        <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <input type="text" placeholder={t("Your Name")} value={contactName} onChange={e => setContactName(e.target.value)} required className="premium-input" />
            <input type="tel" placeholder={t("Phone Number")} value={contactPhone} onChange={e => setContactPhone(e.target.value)} required className="premium-input" />
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <input type="email" placeholder={t("Email Address")} value={contactEmail} onChange={e => setContactEmail(e.target.value)} required className="premium-input" />
            <input type="datetime-local" value={contactDateTime} onChange={e => setContactDateTime(e.target.value)} required className="premium-input" style={{ colorScheme: 'dark' }} />
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <input type="text" placeholder={t("Services interested in (e.g., Hair cut)")} value={contactServices} onChange={e => setContactServices(e.target.value)} required className="premium-input" />
            <input type="text" placeholder={t("Purpose")} value={contactPurpose} onChange={e => setContactPurpose(e.target.value)} required className="premium-input" />
          </div>
          <textarea placeholder={t("How can we help you?")} value={contactMessage} onChange={e => setContactMessage(e.target.value)} required className="premium-input" style={{ minHeight: '140px', resize: 'vertical' }}></textarea>
          <button type="submit" disabled={contactStatus === 'submitting'} className="premium-btn">
            {contactStatus === 'submitting' ? t('Submitting...') : t('Submit Request')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CallbackRequest;
