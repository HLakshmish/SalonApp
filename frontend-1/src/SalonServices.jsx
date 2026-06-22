import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SalonServices = ({ availableServices }) => {
  const { t } = useTranslation();
  const [serviceFilter, setServiceFilter] = useState('all');

  return (
    <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '25px', textAlign: 'center' }}>
        <h3 id="our-services-heading" style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--gold-accent, #d4af37)', fontWeight: '800', letterSpacing: '1px' }}>{t('Our Services')}</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button onClick={() => setServiceFilter('all')} style={{ padding: '10px 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease', background: serviceFilter === 'all' ? 'var(--gold-accent, #d4af37)' : '#eaeaea', color: serviceFilter === 'all' ? '#fff' : '#555' }}>{t('All')}</button>
          <button onClick={() => setServiceFilter('male')} style={{ padding: '10px 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease', background: serviceFilter === 'male' ? 'var(--gold-accent, #d4af37)' : '#eaeaea', color: serviceFilter === 'male' ? '#fff' : '#555' }}>{t('Men')}</button>
          <button onClick={() => setServiceFilter('female')} style={{ padding: '10px 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease', background: serviceFilter === 'female' ? 'var(--gold-accent, #d4af37)' : '#eaeaea', color: serviceFilter === 'female' ? '#fff' : '#555' }}>{t('Women')}</button>
        </div>
      </div>
      {availableServices && availableServices.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {availableServices.filter(svc => serviceFilter === 'all' || svc.gender === serviceFilter || svc.gender === 'both').map((svc, index) => (
            <div key={index} style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              padding: '30px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
              border: '1px solid #eaeaea',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }} 
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h4 style={{ fontSize: '1.4rem', margin: 0, color: '#111', fontWeight: '700' }}>{svc.service_name}</h4>
                <span style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-accent, #d4af37)', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{svc.price}</span>
              </div>
              {svc.description && <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px', fontSize: '0.95rem' }}>{svc.description}</p>}
              <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: '600', color: '#333' }}>{t('Duration')}:</span> {svc.duration_minutes} mins
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: '600', color: '#333' }}>{t('For')}:</span> {svc.gender === 'both' ? t('Unisex') : svc.gender === 'male' ? t('Men') : t('Women')}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888' }}>{t('No services listed yet.')}</p>
      )}
    </div>
  );
};

export default SalonServices;
