import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, User, Phone, CheckCircle } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SalonDetails = ({ salon, setCurrentView }) => {
  const [activeTab, setActiveTab] = useState('booking');
  const [bookingState, setBookingState] = useState('idle'); // idle, booking, success
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState([]);
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [seat, setSeat] = useState('');

  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactServices, setContactServices] = useState('');
  const [contactPurpose, setContactPurpose] = useState('');
  const [contactDateTime, setContactDateTime] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState('idle');

  const [availableServices, setAvailableServices] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [seatAvailability, setSeatAvailability] = useState([]);
  const [salonIsClosed, setSalonIsClosed] = useState(false);

  const [selectedSeatForDetails, setSelectedSeatForDetails] = useState(null);
  const [seatDetailedAvailability, setSeatDetailedAvailability] = useState(null);
  const [modalService, setModalService] = useState([]);
  const [modalTime, setModalTime] = useState('');

  const handleSeatClick = async (seatId) => {
    if (!date) {
      alert("Please select a date first.");
      return;
    }
    setSelectedSeatForDetails(seatId);
    setModalService(service);
    setModalTime(time);
    setSeatDetailedAvailability(null);
    try {
      const res = await fetch(`http://localhost:3000/api/seats/${seatId}/availability?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setSeatDetailedAvailability(data);
      }
    } catch (err) {
      console.error("Error fetching detailed seat availability", err);
    }
  };

  const handleConfirmModal = () => {
    if (!modalTime) {
      alert("Please select a time slot.");
      return;
    }
    setSeat(selectedSeatForDetails);
    setService(modalService);
    setTime(modalTime);
    setShowSeatModal(false);
    setSelectedSeatForDetails(null);
  };
  
  const generateTimeSlots = () => {
    if (!seatDetailedAvailability || !seatDetailedAvailability.availableSlots || !modalService || modalService.length === 0) return [];
    
    const durationMins = modalService.reduce((total, svcId) => {
      const svc = availableServices.find(s => s.id.toString() === svcId.toString());
      return total + (svc ? svc.duration_minutes : 30);
    }, 0);

    let slots = [];
    seatDetailedAvailability.availableSlots.forEach(avSlot => {
      let current = new Date(avSlot.startTime);
      const mins = current.getMinutes();
      const remainder = mins % 15;
      if (remainder !== 0) {
        current.setMinutes(mins + (15 - remainder));
      }
      
      let currentMs = current.getTime();
      const endMs = new Date(avSlot.endTime).getTime();
      
      while (currentMs + (durationMins * 60000) <= endMs) {
        const slotDate = new Date(currentMs);
        if (slotDate > new Date()) {
          slots.push(slotDate);
        }
        currentMs += 30 * 60000; // Increment by 30 mins
      }
    });
    return slots;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!date || !salon?.id) return;
      try {
        const res = await fetch(`http://localhost:3000/api/salons/${salon.id}/seats-availability?date=${date}`);
        if (res.ok) {
          const data = await res.json();
          setSeatAvailability(data.seats || []);
          setSalonIsClosed(data.isClosed || false);
        }
      } catch (err) {
        console.error("Error fetching seat availability", err);
      }
    };
    fetchAvailability();
  }, [date, salon]);

  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const [servicesRes, seatsRes] = await Promise.all([
          fetch(`http://localhost:3000/api/salons/${salon.id}/services`),
          fetch(`http://localhost:3000/api/salons/${salon.id}/seats`)
        ]);
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setAvailableServices(Array.isArray(servicesData) ? servicesData : (servicesData.services || []));
        }
        if (seatsRes.ok) {
          const seatsData = await seatsRes.json();
          setAvailableSeats(Array.isArray(seatsData) ? seatsData : (seatsData.seats || []));
        }
      } catch (err) {
        console.error("Error fetching salon data", err);
      }
    };
    if (salon && salon.id) {
      fetchSalonData();
    }
  }, [salon]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (service.length === 0) {
      alert("Please select at least one service.");
      return;
    }
    setBookingState('booking');
    
    const startTime = new Date(`${date}T${time}`).toISOString();
    
    const payload = {
      salonId: salon.id,
      seatId: parseInt(seat) || 1,
      serviceIds: service.map(s => parseInt(s)),
      startTime,
      customerName: name,
      customerGender: gender,
      customerPhone: phone,
      customerEmail: email,
      customerCity: city,
      customerAddress: address
    };

    try {
      const response = await fetch('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setBookingState('success');
      } else {
        const errorData = await response.json();
        console.error("Failed to book appointment", errorData);
        setBookingState('idle');
        alert("Failed to book appointment: " + (errorData.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setBookingState('idle');
      alert("Network error. Please try again.");
    }
  };

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
    <>
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <header className="header-container" style={{ backgroundColor: '#000' }}>
        <div className="header-top">
          <div className="logo-section" onClick={() => setCurrentView('home')} style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
            {salon?.logoUrl ? (
              <img src={salon.logoUrl} alt={salon.name || "Salon Logo"} style={{ maxHeight: '60px', maxWidth: '180px', objectFit: 'contain' }} />
            ) : (
              <div>
                <div className="logo-main">{salon?.name ? salon.name.split(' ')[0] : 'LOOKS'}</div>
                <div className="logo-sub">{salon?.name ? salon.name.split(' ').slice(1).join(' ') : 'S A L O N'}</div>
              </div>
            )}
          </div>
          <div className="header-actions-wrapper">
            <div className="top-buttons">
              <button className="outline-btn" onClick={() => setCurrentView('home')}>Back to Home</button>
            </div>
          </div>
        </div>
        <nav className="main-nav">
          <ul className="nav-list">
            <li className={`nav-item ${activeTab === 'booking' ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setActiveTab('booking')}>Home</li>
            <li className="nav-item" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('booking')}>About Us</li>
            <li className="nav-item" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('booking')}>Services</li>
            <li className={`nav-item ${activeTab === 'contact' ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setActiveTab('contact')}>Contact Us</li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '70vh', 
        minHeight: '500px',
        backgroundImage: `url(${salon.bannerUrl || 'https://images.unsplash.com/photo-1521590832167-7bfc1748b565?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}>
      </section>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
        
        {activeTab === 'contact' ? (
          <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
            <style>{`
              .premium-contact-card {
                background: rgba(17, 17, 17, 0.6);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                padding: 50px;
                border-radius: 24px;
                border: 1px solid rgba(212, 175, 55, 0.15);
                max-width: 650px;
                width: 100%;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(212, 175, 55, 0.02);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
              }
              .premium-contact-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(212, 175, 55, 0.05);
                border-color: rgba(212, 175, 55, 0.4);
              }
              .premium-input {
                flex: 1;
                padding: 16px 20px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                color: #fff;
                border-radius: 12px;
                outline: none;
                font-size: 1rem;
                transition: all 0.3s ease;
              }
              .premium-input:focus {
                background: rgba(255, 255, 255, 0.08);
                border-color: var(--gold-accent, #d4af37);
                box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.15);
                transform: translateY(-2px);
              }
              .premium-input::placeholder {
                color: rgba(255, 255, 255, 0.3);
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
              .contact-icon-wrapper {
                background: rgba(212, 175, 55, 0.1);
                padding: 15px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 25px;
                border: 1px solid rgba(212, 175, 55, 0.2);
                transition: transform 0.3s ease, background 0.3s ease;
              }
              .contact-info-row:hover .contact-icon-wrapper {
                transform: scale(1.1) rotate(5deg);
                background: rgba(212, 175, 55, 0.2);
              }
            `}</style>

            {/* Contact Info Card */}
            <div className="premium-contact-card">
              <h3 style={{ fontSize: '2.5rem', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '25px', color: 'var(--gold-accent, #d4af37)', textAlign: 'center', fontWeight: '800', letterSpacing: '1px' }}>Get In Touch</h3>
              
              <div className="contact-info-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '35px', color: '#eaeaea', fontSize: '1.25rem', padding: '10px 20px', borderRadius: '12px', transition: 'background 0.3s ease', cursor: 'default' }}>
                <div className="contact-icon-wrapper">
                  <MapPin size={28} style={{ color: 'var(--gold-accent, #d4af37)' }} />
                </div>
                <span style={{ lineHeight: '1.5' }}>{salon.address},<br/>{salon.city}, {salon.state} - {salon.pincode}</span>
              </div>
              
              <div className="contact-info-row" style={{ display: 'flex', alignItems: 'center', color: '#eaeaea', fontSize: '1.25rem', padding: '10px 20px', borderRadius: '12px', transition: 'background 0.3s ease', cursor: 'default' }}>
                <div className="contact-icon-wrapper">
                  <Phone size={28} style={{ color: 'var(--gold-accent, #d4af37)' }} />
                </div>
                <span style={{ fontWeight: '500', letterSpacing: '1px' }}>{salon.phoneNumber}</span>
              </div>
            </div>

            {/* Request Callback Card */}
            <div className="premium-contact-card">
              <h3 style={{ fontSize: '2rem', marginBottom: '35px', color: 'var(--gold-accent, #d4af37)', textAlign: 'center', fontWeight: '800', letterSpacing: '1px' }}>Request a Callback</h3>
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="Your Name" value={contactName} onChange={e => setContactName(e.target.value)} required className="premium-input" />
                  <input type="tel" placeholder="Phone Number" value={contactPhone} onChange={e => setContactPhone(e.target.value)} required className="premium-input" />
                </div>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <input type="email" placeholder="Email Address" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required className="premium-input" />
                  <input type="datetime-local" value={contactDateTime} onChange={e => setContactDateTime(e.target.value)} required className="premium-input" style={{ colorScheme: 'dark' }} />
                </div>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="Services interested in (e.g., Hair cut)" value={contactServices} onChange={e => setContactServices(e.target.value)} required className="premium-input" />
                  <input type="text" placeholder="Purpose" value={contactPurpose} onChange={e => setContactPurpose(e.target.value)} required className="premium-input" />
                </div>
                <textarea placeholder="How can we help you?" value={contactMessage} onChange={e => setContactMessage(e.target.value)} required className="premium-input" style={{ minHeight: '140px', resize: 'vertical' }}></textarea>
                <button type="submit" disabled={contactStatus === 'submitting'} className="premium-btn">
                  {contactStatus === 'submitting' ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Salon Info */}
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--gold-accent, #d4af37)', marginBottom: '20px' }}>About The Salon</h2>
              <p style={{ color: '#aaa', lineHeight: '1.8', marginBottom: '30px', fontSize: '1.1rem' }}>
                {salon.description || 'Welcome to our premium salon. Experience the best in class hair and beauty services with our expert professionals.'}
              </p>

          {/* Seat Availability View */}
          <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px', flexWrap: 'wrap', gap: '15px' }}>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Seat Availability</h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#222', 
                border: '1px solid var(--gold-accent, #d4af37)', 
                borderRadius: '6px', 
                padding: '5px 15px',
                boxShadow: '0 0 10px rgba(212, 175, 55, 0.1)'
              }}>
                <Calendar size={18} style={{ color: 'var(--gold-accent, #d4af37)', marginRight: '10px' }} />
                <div style={{ width: '130px' }}>
                  <DatePicker 
                    selected={date ? new Date(date + 'T00:00:00') : null} 
                    onChange={(d) => {
                      if (d) {
                        const year = d.getFullYear();
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        setDate(`${year}-${month}-${day}`);
                      } else {
                        setDate('');
                      }
                    }}
                    minDate={new Date()}
                    customInput={
                      <input 
                        style={{ width: '100%', padding: '6px 0', backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.95rem', outline: 'none' }} 
                        placeholder="Select Date..." 
                      />
                    }
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>
            </div>
            {!date ? (
              <p style={{ color: '#888', fontStyle: 'italic', margin: 0 }}>Please select a date above to view availability.</p>
            ) : salonIsClosed ? (
              <p style={{ color: '#ff6b6b' }}>Salon is closed on this date.</p>
            ) : seatAvailability.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {seatAvailability.map(seatItem => (
                  <div key={seatItem.id} style={{ border: '1px solid #333', borderRadius: '8px', padding: '15px', backgroundColor: '#222' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, color: 'var(--gold-accent, #d4af37)' }}>{seatItem.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{seatItem.description}</span>
                    </div>
                    
                    <div>
                      <div>
                        <h5 style={{ margin: '0 0 5px 0', color: '#4caf50', fontSize: '0.85rem' }}>Available Slots:</h5>
                        {seatItem.availableSlots && seatItem.availableSlots.length > 0 ? (
                          seatItem.availableSlots.map((slot, i) => {
                            const start = new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                            const end = new Date(slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                            return <div key={i} style={{ fontSize: '0.8rem', color: '#ccc' }}>{start} - {end}</div>;
                          })
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: '#888' }}>None</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#888' }}>No seat availability data found.</p>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ backgroundColor: '#111', padding: '40px', borderRadius: '12px', border: '1px solid #333' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--gold-accent, #d4af37)', marginBottom: '30px', textAlign: 'center' }}>Book Appointment</h2>
            
            {bookingState === 'success' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle size={64} style={{ color: '#4caf50', margin: '0 auto 20px' }} />
                <h3 style={{ fontSize: '1.5rem', color: '#4caf50', marginBottom: '10px' }}>Booking Confirmed!</h3>
                <p style={{ color: '#aaa' }}>We will contact you shortly to confirm your slot.</p>
                <button 
                  onClick={() => setBookingState('idle')}
                  style={{ marginTop: '30px', padding: '12px 30px', backgroundColor: 'transparent', border: '1px solid var(--gold-accent, #d4af37)', color: 'var(--gold-accent, #d4af37)', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Book Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleBook}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  {/* Date */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}><Calendar size={14} style={{marginRight: '5px', display: 'inline'}} />Date</label>
                    <DatePicker 
                      selected={date ? new Date(date + 'T00:00:00') : null} 
                      onChange={(d) => {
                        if (d) {
                          // Format securely in local time to avoid timezone shifts
                          const year = d.getFullYear();
                          const month = String(d.getMonth() + 1).padStart(2, '0');
                          const day = String(d.getDate()).padStart(2, '0');
                          setDate(`${year}-${month}-${day}`);
                        } else {
                          setDate('');
                        }
                      }}
                      minDate={new Date()}
                      customInput={
                        <input required style={{ width: '100%', padding: '12px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px', cursor: 'pointer', boxSizing: 'border-box' }} />
                      }
                      placeholderText="Select date"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>

                  {/* Seat */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Seat</label>
                    <div 
                      onClick={() => setShowSeatModal(true)}
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: '#222', 
                        border: '1px solid #333', 
                        color: seat ? '#fff' : '#888', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxSizing: 'border-box',
                        minHeight: '47px'
                      }}
                    >
                      <span>{availableSeats.find(s => s.id.toString() === seat.toString())?.name || "Select a seat"}</span>
                      <span style={{ fontSize: '0.8em' }}>▼</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  {/* Services */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Services <span style={{ color: '#ff6b6b' }}>*</span></label>
                    <div style={{ width: '100%', padding: '12px', backgroundColor: '#222', border: '1px solid #333', borderRadius: '4px', minHeight: '47px', maxHeight: '150px', overflowY: 'auto', boxSizing: 'border-box' }}>
                      {service.length > 0 ? service.map(sId => {
                        const s = availableServices.find(as => as.id.toString() === sId.toString());
                        return s ? (
                          <div key={s.id} style={{ color: '#fff', marginBottom: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                            <CheckCircle size={14} style={{ color: 'var(--gold-accent, #d4af37)', marginRight: '8px' }} />
                            {s.service_name} - ${s.price}
                          </div>
                        ) : null;
                      }) : (
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>Select a seat to choose services</span>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}><Clock size={14} style={{marginRight: '5px', display: 'inline'}} />Time</label>
                    <div style={{ width: '100%', padding: '12px', backgroundColor: '#222', border: '1px solid #333', color: time ? '#fff' : '#888', borderRadius: '4px', cursor: 'not-allowed', boxSizing: 'border-box', minHeight: '47px' }}>
                      {time || "Select a seat to choose time"}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}><User size={14} style={{marginRight: '5px', display: 'inline'}} />Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} placeholder="Your Name" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}><Phone size={14} style={{marginRight: '5px', display: 'inline'}} />Phone</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} placeholder="Your Phone" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} placeholder="Your Email" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Gender</label>
                    <select required value={gender} onChange={e => setGender(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>City</label>
                    <input type="text" required value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} placeholder="Your City" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Address</label>
                    <input type="text" required value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} placeholder="Your Address" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={bookingState === 'booking'}
                  style={{ 
                    width: '100%', 
                    padding: '15px', 
                    backgroundColor: 'var(--gold-accent, #d4af37)', 
                    color: '#000', 
                    border: 'none', 
                    borderRadius: '4px', 
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: bookingState === 'booking' ? 'not-allowed' : 'pointer',
                    opacity: bookingState === 'booking' ? 0.7 : 1
                  }}
                >
                  {bookingState === 'booking' ? 'Confirming...' : 'CONFIRM APPOINTMENT'}
                </button>
              </form>
            )}
          </div>
        </div>
      </>
      )}
      </div>
    </div>
      {/* Seat Selection Modal */}
      {showSeatModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#111',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #333',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '5px', color: 'var(--gold-accent, #d4af37)', textAlign: 'center' }}>
              {!selectedSeatForDetails ? 'Select a Seat' : 'Seat Availability'}
            </h3>
            
            {!date && !selectedSeatForDetails && <p style={{ textAlign: 'center', color: '#888', marginBottom: '20px', fontSize: '0.9rem' }}>Select a date first to see availability.</p>}
            
            {!selectedSeatForDetails ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '15px',
                marginBottom: '30px',
                maxHeight: '60vh',
                overflowY: 'auto',
                padding: '10px'
              }}>
                {availableSeats.length > 0 ? availableSeats.map(s => {
                  const availability = seatAvailability.find(sa => sa.id === s.id);
                  const bookedSlots = availability?.bookedSlots || [];
                  
                  return (
                  <div 
                    key={s.id}
                    onClick={() => handleSeatClick(s.id)}
                    style={{
                      backgroundColor: seat.toString() === s.id.toString() ? 'var(--gold-accent, #d4af37)' : '#222',
                      color: seat.toString() === s.id.toString() ? '#000' : '#fff',
                      border: '1px solid ' + (seat.toString() === s.id.toString() ? 'var(--gold-accent, #d4af37)' : '#444'),
                      borderRadius: '8px',
                      padding: '15px 10px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: 'bold',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: seat.toString() === s.id.toString() ? '0 0 10px rgba(212, 175, 55, 0.5)' : 'none',
                    }}
                    onMouseOver={(e) => {
                      if (seat.toString() !== s.id.toString()) {
                        e.currentTarget.style.borderColor = 'var(--gold-accent, #d4af37)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (seat.toString() !== s.id.toString()) {
                        e.currentTarget.style.borderColor = '#444';
                      }
                    }}
                  >
                    <div style={{ 
                      width: '30px', height: '30px', 
                      border: '2px solid currentColor', 
                      borderRadius: '4px',
                      borderBottomWidth: '4px',
                      marginBottom: '8px',
                      position: 'relative'
                    }}>
                      <div style={{ position: 'absolute', bottom: '-4px', left: '4px', width: '4px', height: '8px', backgroundColor: 'currentColor' }}></div>
                      <div style={{ position: 'absolute', bottom: '-4px', right: '4px', width: '4px', height: '8px', backgroundColor: 'currentColor' }}></div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>{s.name}</div>
                    {date && (
                      <div style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold', 
                        color: seat.toString() === s.id.toString() ? '#000' : '#aaa', 
                        minHeight: '30px',
                        marginTop: '5px'
                      }}>
                        {bookedSlots.length > 0 ? (
                           <div>
                             {bookedSlots.map((slot, i) => {
                               const start = new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                               const end = new Date(slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                               return <div key={i}>{start} - {end}</div>;
                             })}
                           </div>
                        ) : (
                          <span style={{ color: seat.toString() === s.id.toString() ? '#000' : '#4caf50' }}>Available</span>
                        )}
                      </div>
                    )}
                  </div>
                  );
                }) : (
                  <p style={{ color: '#888', gridColumn: '1/-1', textAlign: 'center' }}>No seats available</p>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <button onClick={() => setSelectedSeatForDetails(null)} style={{ background: 'transparent', color: 'var(--gold-accent, #d4af37)', border: 'none', cursor: 'pointer', marginRight: '10px', fontSize: '1rem', padding: 0 }}>← Back</button>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', flex: 1, textAlign: 'center' }}>Seat: {availableSeats.find(s => s.id === selectedSeatForDetails)?.name}</h4>
                  <div style={{width: '50px'}}></div>
                </div>
                
                {!seatDetailedAvailability ? <p style={{ color: '#888', textAlign: 'center' }}>Loading availability...</p> : (
                  <div>
                    {seatDetailedAvailability.isClosed ? (
                      <p style={{ color: '#ff6b6b', textAlign: 'center', padding: '20px', background: '#333', borderRadius: '8px' }}>Salon is closed on this date.</p>
                    ) : (
                      <>
                        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#222', borderRadius: '8px', border: '1px solid #333' }}>
                          <h5 style={{ color: '#aaa', marginBottom: '10px', marginTop: 0 }}>Select Services</h5>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                            {availableServices.map(s => (
                              <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', cursor: 'pointer' }}>
                                <input 
                                  type="checkbox" 
                                  checked={modalService.includes(s.id.toString())}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setModalService([...modalService, s.id.toString()]);
                                    } else {
                                      setModalService(modalService.filter(id => id !== s.id.toString()));
                                    }
                                    setModalTime('');
                                  }}
                                  style={{ width: '18px', height: '18px', accentColor: 'var(--gold-accent, #d4af37)', cursor: 'pointer' }}
                                />
                                {s.service_name} - {s.duration_minutes} mins (${s.price})
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        {modalService.length > 0 ? (
                          <div style={{ padding: '15px', backgroundColor: '#222', borderRadius: '8px', border: '1px solid #333' }}>
                            <h5 style={{ color: '#aaa', marginBottom: '15px', marginTop: 0 }}>Available Time Slots</h5>
                            {generateTimeSlots().length > 0 ? (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                                {generateTimeSlots().map((slot, i) => {
                                  const timeStr = slot.toTimeString().slice(0, 5); // "HH:MM"
                                  const displayStr = slot.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                                  const isSelected = modalTime === timeStr;
                                  return (
                                    <button 
                                      key={i} 
                                      type="button"
                                      onClick={() => setModalTime(timeStr)}
                                      style={{
                                        padding: '10px',
                                        backgroundColor: isSelected ? 'var(--gold-accent, #d4af37)' : '#111',
                                        color: isSelected ? '#000' : '#fff',
                                        border: '1px solid ' + (isSelected ? 'var(--gold-accent, #d4af37)' : '#444'),
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: isSelected ? 'bold' : 'normal'
                                      }}
                                    >
                                      {displayStr}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <p style={{ color: '#ff6b6b', margin: 0 }}>No available slots for this service duration.</p>
                            )}
                          </div>
                        ) : (
                          <p style={{ color: '#888', textAlign: 'center', margin: '20px 0' }}>Please select at least one service to see available times.</p>
                        )}
                        
                        <div style={{ marginTop: '20px' }}>
                          <button 
                            type="button"
                            onClick={handleConfirmModal}
                            disabled={!modalTime}
                            style={{
                              width: '100%',
                              padding: '12px',
                              backgroundColor: modalTime ? 'var(--gold-accent, #d4af37)' : '#333',
                              color: modalTime ? '#000' : '#666',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: modalTime ? 'pointer' : 'not-allowed',
                              fontWeight: 'bold',
                              fontSize: '1.1rem'
                            }}
                          >
                            Confirm Selection
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <button 
              type="button"
              onClick={() => { setShowSeatModal(false); setSelectedSeatForDetails(null); }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                border: '1px solid #444',
                color: '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginTop: '15px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SalonDetails;
