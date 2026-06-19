import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  ShoppingCart,
  ThumbsUp,
  MessageCircle,
  Star
} from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import OwnerDashboard from './OwnerDashboard';
import SalonDetails from './SalonDetails';

const App = () => {
  const { t, i18n } = useTranslation();
  const [activeNav, setActiveNav] = useState('HOME');

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  const [currentView, setCurrentView] = useState('home');
  const [authMode, setAuthMode] = useState('login');

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard States
  const [salons, setSalons] = useState([]);
  const [authToken, setAuthToken] = useState('');
  const [allSalons, setAllSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);

  useEffect(() => {
    const fetchAllSalons = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/salons');
        if (response.ok) {
          const data = await response.json();
          setAllSalons(data);
        } else {
          console.error('Failed to fetch salons');
        }
      } catch (err) {
        console.error('Network error fetching salons', err);
      }
    };
    fetchAllSalons();
  }, []);

  const navItems = ['HOME', 'ABOUT US', 'SERVICES', 'CONTACT', 'OFFERS'];

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setAuthToken(data.token);
        setCurrentView('dashboard');
      } else {
        setAuthError(data.message || 'Login failed');
      }
    } catch (err) {
      setAuthError('Network error. Please check your backend connection.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await response.json();
      if (response.ok) {
        setAuthMode('login');
        setAuthError('Registration successful. You can now login.');
      } else {
        setAuthError(data.message || 'Registration failed');
      }
    } catch (err) {
      setAuthError('Network error. Please check your backend connection.');
    }
  };



  if (currentView === 'auth') {
    return (
      <div>
        <header className="header-container">
          <div className="header-top">
            <div className="logo-section" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer' }}>
              <div className="logo-main">LOOKS</div>
              <div className="logo-sub">S A L O N</div>
            </div>
            <div className="header-actions-wrapper">
              <div className="top-buttons">
                <select onChange={handleLanguageChange} value={i18n.language} className="outline-btn" style={{ marginRight: '10px', padding: '5px', backgroundColor: '#1a1a1a', color: '#fff' }}>
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="hi">हिंदी</option>
                </select>
                <button className="outline-btn" onClick={() => setCurrentView('home')}>{t('Back to Home')}</button>
              </div>
            </div>
          </div>
        </header>

        <div className="auth-container">
          <div className="auth-box">
            <h2 className="auth-title">Salon Owner {authMode === 'login' ? 'Login' : 'Registration'}</h2>
            {authError && <div className="error-message">{authError}</div>}

            <form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
              {authMode === 'register' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" required value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </>
              )}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              <button type="submit" className="auth-btn">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="auth-switch">
              {authMode === 'login' ? (
                <>Don't have an account? <span onClick={() => { setAuthMode('register'); setAuthError(''); }}>Register here</span></>
              ) : (
                <>Already have an account? <span onClick={() => { setAuthMode('login'); setAuthError(''); }}>Login here</span></>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <OwnerDashboard
        setCurrentView={setCurrentView}
        salons={salons}
        setSalons={setSalons}
        authToken={authToken}
        setAuthToken={setAuthToken}
      />
    );
  }

  if (currentView === 'salon' && selectedSalon) {
    return <SalonDetails salon={selectedSalon} setCurrentView={setCurrentView} />;
  }

  // Home View
  return (
    <div>
      <header className="header-container">
        <div className="header-top">
          <div className="logo-section">
            <div className="logo-main">LOOKS</div>
            <div className="logo-sub">S A L O N</div>
          </div>
          <div className="header-actions-wrapper">
            <div className="top-buttons">
              <select onChange={handleLanguageChange} value={i18n.language} className="outline-btn" style={{ marginRight: '10px', padding: '5px', backgroundColor: 'transparent', color: 'inherit' }}>
                <option value="en" style={{ color: '#000' }}>English</option>
                <option value="kn" style={{ color: '#000' }}>ಕನ್ನಡ</option>
                <option value="hi" style={{ color: '#000' }}>हिंदी</option>
              </select>
              <button className="outline-btn" onClick={() => setCurrentView('auth')}>{t('Salon Owner')}</button>
              {/* <button className="outline-btn">Book Appointment</button> */}
              {/* <button className="outline-btn">Salon Finder <MapPin size={16} /></button> */}
              {/* <div className="social-icons">
                <FaFacebookF className="social-icon" size={18} />
                <FaTwitter className="social-icon" size={18} />
                <FaInstagram className="social-icon" size={18} />
              </div> */}
            </div>
          </div>
        </div>
        <nav className="main-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => setActiveNav(item)}>
                {t(item)}
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hex-pattern"></div>
        <div className="hero-content">
          <div className="hero-top-text">{t('YOUR FAVORITE')} <span className="looks-bold">LOOKS</span> {t('IS NOW ONLINE')}</div>
          <div style={{ textAlign: 'center' }}><span className="salon-spaced">S A L O N</span></div>
          <div className="promo-section">
            <div className="shop-brands-text">{t('SHOP YOUR FAVORITE BEAUTY BRANDS AT')}</div>
            <div className="looks-kart-logo">
              <span className="kart-text">LOOKS</span><span className="kart-sub">kart</span>
              <ShoppingCart className="cart-icon" strokeWidth={1.5} />
            </div>
            <div className="cta-container">
              <div className="offers-text">{t('AVAIL EXCITING OFFERS AND')}<br />{t('MANY OTHER GOODIES.')}</div>
              <button className="shop-now-btn">{t('SHOP NOW')}</button>
            </div>
            <div className="website-link">www.lookskart.com</div>
          </div>
        </div>
      </section>

      <section className="salons-section" style={{ padding: '60px 20px', backgroundColor: '#000', color: '#fff' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--gold-accent, #d4af37)', letterSpacing: '2px' }}>{t('DISCOVER OUR SALONS')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {allSalons.length > 0 ? allSalons.map(salon => (
            <div key={salon.id} style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', color: '#333', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ height: '200px', backgroundColor: '#eee', backgroundImage: `url(${salon.bannerUrl || 'https://via.placeholder.com/400x200?text=Salon+Banner'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ backgroundColor: '#333', color: '#fff', borderRadius: '6px', padding: '6px', display: 'flex' }}><ThumbsUp size={16} /></div>
                  {salon.name}
                </h3>
                

                
                <p style={{ marginBottom: '20px', color: '#777', fontSize: '1.1rem' }}>
                  {salon.address || salon.city || t('Location Not Specified')}
                </p>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#0078d7',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '1.1rem',
                    transition: 'opacity 0.2s'
                  }}
                    onMouseOver={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                    onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
                    onClick={() => { setSelectedSalon(salon); setCurrentView('salon'); }}
                  >
                    {t('View Salon')}
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <p style={{ textAlign: 'center', color: '#888', gridColumn: '1 / -1', fontSize: '1.2rem', padding: '40px' }}>{t('Loading salons or no salons available at the moment.')}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default App;
