import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  ShoppingCart,
  ThumbsUp,
  MessageCircle,
  Star,
  Search,
  Filter,
  SlidersHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import OwnerDashboard from './OwnerDashboard';
import SalonDetails from './SalonDetails';
import AdminDashboard from './Admin/AdminDashboard';
import SubscriptionPayment from './SubscriptionPayment';

const App = () => {
  const { t, i18n } = useTranslation();
  const [activeNav, setActiveNav] = useState('HOME');

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('currentView') || 'home');
  const [authMode, setAuthMode] = useState('login');

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Dashboard States
  const [salons, setSalons] = useState([]);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '');
  const [paymentUserId, setPaymentUserId] = useState(() => {
    const saved = localStorage.getItem('paymentUserId');
    return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
  });
  const [allSalons, setAllSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(() => {
    const saved = localStorage.getItem('selectedSalon');
    return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
  });

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortOrder, setSortOrder] = useState('none');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [websiteDetails, setWebsiteDetails] = useState(null);

  useEffect(() => {
    const fetchWebsiteDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/website-details`);
        if (response.ok) {
          const data = await response.json();
          setWebsiteDetails(data);
        }
      } catch (err) {
        console.error('Failed to fetch website details:', err);
      }
    };
    fetchWebsiteDetails();
  }, []);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('authToken', authToken);
  }, [authToken]);

  useEffect(() => {
    if (selectedSalon) {
      localStorage.setItem('selectedSalon', JSON.stringify(selectedSalon));
    } else {
      localStorage.removeItem('selectedSalon');
    }
  }, [selectedSalon]);

  useEffect(() => {
    if (paymentUserId) {
      localStorage.setItem('paymentUserId', JSON.stringify(paymentUserId));
    } else {
      localStorage.removeItem('paymentUserId');
    }
  }, [paymentUserId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, sortOrder]);

  const uniqueCities = [...new Set(allSalons.map(s => s.city).filter(Boolean))];

  const filteredSalons = allSalons
    .filter(s => {
      const query = searchQuery.toLowerCase();
      return (s.name && s.name.toLowerCase().includes(query)) ||
        (s.address && s.address.toLowerCase().includes(query)) ||
        (s.city && s.city.toLowerCase().includes(query));
    })
    .filter(s => selectedCity === '' || s.city === selectedCity)
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      if (sortOrder === 'desc') return b.name.localeCompare(a.name);
      return 0; // 'none'
    });

  const totalPages = Math.ceil(filteredSalons.length / itemsPerPage);
  const paginatedSalons = filteredSalons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const fetchAllSalons = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/salons`);
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

  const navItems = ['HOME', 'EXPLORE SALONS', 'ABOUT US', 'CONTACT'];

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    // Validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setAuthError('Password is required.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setAuthToken(data.token);
        if (data.user && data.user.role === 'Admin') {
          setCurrentView('admin');
        } else {
          setCurrentView('dashboard');
        }
      } else if (response.status === 402 && data.requiresPayment) {
        setPaymentUserId(data.userId);
        setCurrentView('subscription');
      } else {
        setAuthError(data.error || data.message || 'Login failed');
      }
    } catch (err) {
      setAuthError('Network error. Please check your backend connection.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    // Validations
    if (!name || name.trim().length < 2) {
      setAuthError('Full Name must be at least 2 characters.');
      return;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      setAuthError('Full Name must consist of characters only.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setAuthError('Phone Number must be a valid 10-digit Indian mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.requiresPayment) {
          setPaymentUserId(data.userId);
          setCurrentView('subscription');
        } else {
          setAuthMode('login');
          setPassword('');
          setAuthSuccess('Registration successful. You can now login.');
        }
      } else {
        setAuthError(data.error || data.message || 'Registration failed');
      }
    } catch (err) {
      setAuthError('Network error. Please check your backend connection.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    // Validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setAuthError('Phone Number must be a valid 10-digit Indian mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError('New Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, newPassword: password })
      });
      const data = await response.json();
      if (response.ok) {
        setAuthMode('login');
        setPassword('');
        setAuthSuccess('Password reset successful. You can now login.');
      } else {
        setAuthError(data.error || data.message || 'Password reset failed');
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
          <div className="auth-image-side">
            <div className="auth-image-overlay">
              <div className="auth-brand-text">
                <span className="auth-brand-sub">LOOKS SALON</span>
                <h3 className="auth-brand-title">Owner Portal</h3>
                <p className="auth-brand-desc">
                  Manage your salon's seats, schedules, employees, services, and bookings in one high-end, responsive system.
                </p>
              </div>
            </div>
          </div>
          <div className="auth-form-side">
            <div className="auth-box">
              <h2 className="auth-title">
                Salon Owner {authMode === 'login' ? 'Login' : authMode === 'register' ? 'Registration' : 'Reset Password'}
              </h2>
              {authError && <div className="error-message">{authError}</div>}
              {authSuccess && <div className="success-message">{authSuccess}</div>}

              <form onSubmit={
                authMode === 'login'
                  ? handleLogin
                  : authMode === 'register'
                    ? handleRegister
                    : handleForgotPassword
              }>
                {authMode === 'register' && (
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} />
                  </div>
                )}
                {(authMode === 'register' || authMode === 'forgot') && (
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" required value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {authMode === 'forgot' ? 'New Password' : 'Password'}
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {authMode === 'login' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <span
                        onClick={() => { setAuthMode('forgot'); setAuthError(''); setAuthSuccess(''); }}
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          cursor: 'pointer',
                          fontWeight: '500',
                          transition: 'color 0.3s ease',
                        }}
                        onMouseOver={e => e.target.style.color = 'var(--gold-accent)'}
                        onMouseOut={e => e.target.style.color = 'rgba(255, 255, 255, 0.5)'}
                      >
                        Forgot Password?
                      </span>
                    </div>
                  )}
                </div>

                <button type="submit" className="auth-btn">
                  {authMode === 'login' ? 'Sign In' : authMode === 'register' ? 'Create Account' : 'Reset Password'}
                </button>
              </form>

              <div className="auth-switch">
                {authMode === 'login' && (
                  <>Don't have an account? <span onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}>Register here</span></>
                )}
                {authMode === 'register' && (
                  <>Already have an account? <span onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}>Login here</span></>
                )}
                {authMode === 'forgot' && (
                  <>Remember your password? <span onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}>Login here</span></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'subscription') {
    return <SubscriptionPayment userId={paymentUserId} setCurrentView={setCurrentView} />;
  }

  if (currentView === 'admin') {
    return <AdminDashboard authToken={authToken} setCurrentView={setCurrentView} />;
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
              <li key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => {
                setActiveNav(item);
                if (item === 'HOME') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (item === 'EXPLORE SALONS') {
                  document.getElementById('salons-section')?.scrollIntoView({ behavior: 'smooth' });
                } else if (item === 'ABOUT US' || item === 'CONTACT') {
                  document.getElementById('footer-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                {t(item)}
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <section className="white-hero-section">
        <div className="white-hero-content">
          <h1 className="white-hero-title">{t('Hair &')}<br />{t('Beauty Salon')}</h1>
          <p className="white-hero-subtitle">{t('Premium Hair & Beauty Salons near you')}</p>
          <button
            className="white-hero-btn"
            onClick={() => {
              document.getElementById('salons-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('EXPLORE SALONS')}
          </button>
        </div>
        <div className="white-hero-image-container"></div>
      </section>

      <section id="salons-section" className="salons-section" style={{ padding: '60px 20px', backgroundColor: '#f8f5f2', color: '#111' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', fontWeight: 'bold', color: '#1a1a1a', letterSpacing: '2px' }}>{t('DISCOVER OUR SALONS')}</h2>

        {/* Search and Filters */}
        <div style={{ maxWidth: '1200px', margin: '0 auto 40px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>

          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input
              type="text"
              placeholder={t('Search salons by name or location...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '15px 15px 15px 45px', backgroundColor: '#f9f9f9', border: '1px solid #eee', color: '#111', borderRadius: '8px', outline: 'none', fontSize: '1rem', transition: 'border-color 0.3s' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--gold-accent, #d4af37)'}
              onBlur={(e) => e.target.style.borderColor = '#eee'}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', flex: '1 1 300px' }}>
            <div style={{ flex: '1 1 140px', position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ width: '100%', padding: '15px 15px 15px 40px', backgroundColor: '#f9f9f9', border: '1px solid #eee', color: '#111', borderRadius: '8px', outline: 'none', fontSize: '1rem', cursor: 'pointer', appearance: 'none' }}
              >
                <option value="">{t('All Cities')}</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 140px', position: 'relative' }}>
              <SlidersHorizontal size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{ width: '100%', padding: '15px 15px 15px 40px', backgroundColor: '#f9f9f9', border: '1px solid #eee', color: '#111', borderRadius: '8px', outline: 'none', fontSize: '1rem', cursor: 'pointer', appearance: 'none' }}
              >
                <option value="none">{t('Sort By')}</option>
                <option value="asc">{t('Name (A - Z)')}</option>
                <option value="desc">{t('Name (Z - A)')}</option>
              </select>
            </div>
          </div>
        </div>

        <style>{`
          .premium-salon-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
            transition: all 0.4s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            min-height: 340px;
          }
          .premium-salon-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 0 15px rgba(212, 175, 55, 0.1);
            border-color: rgba(212, 175, 55, 0.4);
          }
          .premium-salon-img {
            height: 180px;
            background-size: cover;
            background-position: center;
            position: relative;
          }
          .premium-salon-img::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 50%;
            background: linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 100%);
          }
          .premium-salon-content {
            padding: 20px;
            display: flex;
            flex-direction: column;
            flex: 1;
            z-index: 1;
            margin-top: -20px;
          }
          .premium-salon-title {
            font-size: 1.25rem;
            color: #111;
            font-weight: 700;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: 0.5px;
          }
          .premium-salon-address {
            color: #666;
            font-size: 1rem;
            margin-bottom: 25px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
            line-height: 1.4;
          }
          .premium-salon-btn {
            margin-top: auto;
            width: 100%;
            padding: 12px;
            background: transparent;
            color: var(--gold-accent, #d4af37);
            border: 1px solid var(--gold-accent, #d4af37);
            border-radius: 6px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .premium-salon-btn:hover {
            background: var(--gold-accent, #d4af37);
            color: #000;
          }
          .pagination-btn {
            padding: 10px 20px;
            background: #fff;
            border: 1px solid #eaeaea;
            color: #111;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .pagination-btn:hover:not(:disabled) {
            background: var(--gold-accent, #d4af37);
            color: #000;
            border-color: var(--gold-accent, #d4af37);
          }
          .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .salon-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
            max-width: 1200px;
            margin: 0 auto;
          }
          @media (max-width: 1024px) {
            .salon-grid { grid-template-columns: repeat(3, 1fr); }
          }
          @media (max-width: 768px) {
            .salon-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          }
          @media (max-width: 576px) {
            .salon-grid { grid-template-columns: 1fr; }
          }
        `}</style>
        <div className="salon-grid">
          {paginatedSalons.length > 0 ? paginatedSalons.map(salon => {
            const hasValidImage = salon.bannerUrl && salon.bannerUrl !== 'null' && salon.bannerUrl !== 'undefined' && salon.bannerUrl.trim() !== '';
            const bgImage = hasValidImage ? salon.bannerUrl : '/luxury-salon-card.png';

            return (
              <div key={salon.id} className="premium-salon-card">
                <div className="premium-salon-img" style={{ backgroundImage: `url(${bgImage})`, backgroundColor: '#eaddd5' }}>
                </div>
                <div className="premium-salon-content">
                  <h3 className="premium-salon-title">
                    {salon.name}
                  </h3>
                  <p className="premium-salon-address">
                    <MapPin size={18} style={{ color: 'var(--gold-accent, #d4af37)', flexShrink: 0, marginTop: '2px' }} />
                    {salon.address ? `${salon.address}, ${salon.city}` : (salon.city || t('Location Not Specified'))}
                  </p>
                  <button
                    className="premium-salon-btn"
                    onClick={() => { setSelectedSalon(salon); setCurrentView('salon'); }}
                  >
                    {t('View Salon')}
                  </button>
                </div>
              </div>
            )
          }) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <Search size={48} style={{ color: '#ccc', margin: '0 auto 20px', display: 'block' }} />
              <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '10px' }}>{t('No salons found')}</h3>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>{t('Try adjusting your search or filters to find what you are looking for.')}</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '50px' }}>
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              {t('Previous')}
            </button>
            <span style={{ fontSize: '1.1rem', fontWeight: '500', color: '#666' }}>
              {t('Page')} <span style={{ color: 'var(--gold-accent, #d4af37)' }}>{currentPage}</span> {t('of')} {totalPages}
            </span>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              {t('Next')}
            </button>
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer id="footer-section" style={{ backgroundColor: '#111', color: '#fff', padding: '60px 5% 20px', marginTop: 'auto', borderTop: '4px solid var(--gold-accent, #d4af37)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', borderBottom: '1px solid #333', paddingBottom: '40px', marginBottom: '20px', maxWidth: '1200px', margin: '0 auto 20px' }}>
          <div>
            {websiteDetails && websiteDetails.websiteName ? (
              <h3 style={{ fontSize: '1.8rem', color: 'var(--gold-accent, #d4af37)', marginBottom: '15px', fontWeight: '700', letterSpacing: '1px' }}>
                {websiteDetails.websiteName.toUpperCase()}
              </h3>
            ) : (
              <h3 style={{ fontSize: '1.8rem', color: 'var(--gold-accent, #d4af37)', marginBottom: '15px', fontWeight: '700', letterSpacing: '1px' }}>LOOKS <span style={{ fontWeight: '300', fontSize: '1.2rem', letterSpacing: '6px', display: 'block' }}>S A L O N</span></h3>
            )}
            <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '0.95rem', marginTop: '20px', wordWrap: 'break-word' }}>
              {websiteDetails && websiteDetails.about ? websiteDetails.about : t('Experience the pinnacle of luxury hair and beauty services. Our expert stylists are dedicated to bringing out your best look in a relaxing, premium environment.')}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600', color: '#fff' }}>{t('Quick Links')}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#aaa', lineHeight: '2.2', fontSize: '0.95rem' }}>
              <li><a href="#" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'var(--gold-accent, #d4af37)'} onMouseOut={e => e.target.style.color = '#aaa'}>{t('Home')}</a></li>
              <li><a href="#" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'var(--gold-accent, #d4af37)'} onMouseOut={e => e.target.style.color = '#aaa'}>{t('About Us')}</a></li>
              {/* <li><a href="#" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'var(--gold-accent, #d4af37)'} onMouseOut={e => e.target.style.color = '#aaa'}>{t('Services')}</a></li> */}
              <li><a href="#salons-section" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'var(--gold-accent, #d4af37)'} onMouseOut={e => e.target.style.color = '#aaa'}>{t('Our Salons')}</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600', color: '#fff' }}>{t('Contact Us')}</h4>
            <div style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '2.2' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={16} color="var(--gold-accent, #d4af37)" /> {websiteDetails && websiteDetails.address ? websiteDetails.address : '123 Beauty Avenue, NY 10001'}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-accent, #d4af37)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                {websiteDetails && websiteDetails.phoneNumber ? websiteDetails.phoneNumber : '+1 (555) 123-4567'}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-accent, #d4af37)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                {websiteDetails && websiteDetails.email ? websiteDetails.email : 'hello@lookssalon.com'}
              </p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} {websiteDetails && websiteDetails.websiteName ? websiteDetails.websiteName : 'Looks Salon'}. {t('All rights reserved.')}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
