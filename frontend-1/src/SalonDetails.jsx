import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, User, Phone, CheckCircle } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import SalonServices from './SalonServices';
import CallbackRequest from './CallbackRequest';

const SalonDetails = ({ salon, setCurrentView }) => {
  const { t } = useTranslation();
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

  const [bookingError, setBookingError] = useState('');
  const [modalError, setModalError] = useState('');

  const [availableServices, setAvailableServices] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [seatAvailability, setSeatAvailability] = useState([]);
  const [salonIsClosed, setSalonIsClosed] = useState(false);

  const [selectedSeatForDetails, setSelectedSeatForDetails] = useState(null);
  const [seatDetailedAvailability, setSeatDetailedAvailability] = useState(null);
  const [modalService, setModalService] = useState([]);
  const [modalTime, setModalTime] = useState('');

  // Clear modal error on modal close or open
  useEffect(() => {
    setModalError('');
  }, [showSeatModal, selectedSeatForDetails]);

  const handleSeatClick = async (seatId) => {
    setModalError('');
    if (!date) {
      setModalError("Please select a date first.");
      return;
    }
    setSelectedSeatForDetails(seatId);
    setModalService(service);
    setModalTime(time);
    setSeatDetailedAvailability(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/seats/${seatId}/availability?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setSeatDetailedAvailability(data);
      }
    } catch (err) {
      console.error("Error fetching detailed seat availability", err);
    }
  };

  const handleConfirmModal = () => {
    setModalError('');
    if (!modalTime) {
      setModalError("Please select a time slot.");
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/salons/${salon.id}/seats-availability?date=${date}`);
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
          fetch(`${import.meta.env.VITE_API_URL}/api/salons/${salon.id}/services`),
          fetch(`${import.meta.env.VITE_API_URL}/api/salons/${salon.id}/seats`)
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
    setBookingError('');

    // Validations
    if (!date) {
      setBookingError("Please select a date first.");
      return;
    }
    const selectedDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDate < today) {
      setBookingError("Selected date cannot be in the past.");
      return;
    }

    if (!seat) {
      setBookingError("Please select a seat.");
      return;
    }

    if (!time) {
      setBookingError("Please select a time slot.");
      return;
    }

    if (service.length === 0) {
      setBookingError("Please select at least one service.");
      return;
    }

    if (!name || name.trim().length < 2) {
      setBookingError("Name must be at least 2 characters.");
      return;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      setBookingError("Name must consist of characters only.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setBookingError("Phone number must be a valid 10-digit Indian mobile number.");
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setBookingError("Please enter a valid email address.");
        return;
      }
    }

    if (!gender) {
      setBookingError("Please select your gender.");
      return;
    }

    if (!city || city.trim().length === 0) {
      setBookingError("City is required.");
      return;
    }

    if (!address || address.trim().length === 0) {
      setBookingError("Address is required.");
      return;
    }

    setBookingState('booking');
    
    const startTime = new Date(`${date}T${time}`).toISOString();
    
    const payload = {
      salonId: salon.id,
      seatId: parseInt(seat) || 1,
      serviceIds: service.map(s => parseInt(s)),
      startTime,
      customerName: name.trim(),
      customerGender: gender,
      customerPhone: phone.trim(),
      customerEmail: email.trim(),
      customerCity: city.trim(),
      customerAddress: address.trim()
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setBookingState('success');
        // Clear all booking inputs
        setDate('');
        setTime('');
        setName('');
        setPhone('');
        setService([]);
        setEmail('');
        setGender('');
        setCity('');
        setAddress('');
        setSeat('');
      } else {
        const errorData = await response.json();
        console.error("Failed to book appointment", errorData);
        setBookingState('idle');
        setBookingError("Failed to book appointment: " + (errorData.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setBookingState('idle');
      setBookingError("Network error. Please try again.");
    }
  };

  const hasValidBanner = salon?.bannerUrl && salon.bannerUrl !== 'null' && salon.bannerUrl !== 'undefined' && salon.bannerUrl.trim() !== '';
  const bannerImage = hasValidBanner ? salon.bannerUrl : '/luxury-salon-card.png';

  return (
    <>
    <div style={{ backgroundColor: '#f8f5f2', color: '#111', minHeight: '100vh' }}>
      <header className="header-container" style={{ color: '#fff' }}>
        <div className="header-top">
          <div className="logo-section" onClick={() => setCurrentView('home')} style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
            {salon?.logoUrl && salon.logoUrl !== 'null' && salon.logoUrl !== 'undefined' && salon.logoUrl.trim() !== '' ? (
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
            <li className="nav-item" style={{ cursor: 'pointer' }} onClick={() => {
              const footer = document.getElementById('footer-section');
              if (footer) footer.scrollIntoView({ behavior: 'smooth' });
            }}>About Us</li>
            <li className={`nav-item ${activeTab === 'services' ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => {
              setActiveTab('services');
              setTimeout(() => {
                const servicesHeading = document.getElementById('our-services-heading');
                if (servicesHeading) servicesHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}>Services</li>
            <li className={`nav-item ${activeTab === 'contact' ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => {
              setActiveTab('contact');
              setTimeout(() => {
                const callbackHeading = document.getElementById('request-callback-heading');
                if (callbackHeading) callbackHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }}>Call Back</li>
            <li className="nav-item" style={{ cursor: 'pointer' }} onClick={() => {
              const footer = document.getElementById('footer-section');
              if (footer) footer.scrollIntoView({ behavior: 'smooth' });
            }}>Contact Us</li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '70vh', 
        minHeight: '500px',
        backgroundImage: `url("${bannerImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}>
      </section>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
        
        {activeTab === 'services' ? (
          <SalonServices availableServices={availableServices} />
        ) : activeTab === 'contact' ? (
          <CallbackRequest salon={salon} />
        ) : (
          <>
            {/* Salon Info */}
            <div style={{ flex: '1 1 400px' }}>
          {/* Seat Availability View */}
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea', marginTop: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px', flexWrap: 'wrap', gap: '15px' }}>
              <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#111' }}>Seat Availability</h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#f9f9f9', 
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
                        style={{ width: '100%', padding: '6px 0', backgroundColor: 'transparent', border: 'none', color: '#111', cursor: 'pointer', fontSize: '0.95rem', outline: 'none' }} 
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
                  <div key={seatItem.id} style={{ border: '1px solid #eaeaea', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9' }}>
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
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
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
                {bookingError && <div className="error-message" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>{bookingError}</div>}
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
                        <input required style={{ width: '100%', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #eaeaea', color: '#111', borderRadius: '4px', cursor: 'pointer', boxSizing: 'border-box' }} />
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
                        backgroundColor: '#f9f9f9', 
                        border: '1px solid #eaeaea', 
                        color: seat ? '#111' : '#666', 
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
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>Services <span style={{ color: '#ff6b6b' }}>*</span></label>
                    <div style={{ width: '100%', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #eaeaea', borderRadius: '4px', minHeight: '47px', maxHeight: '150px', overflowY: 'auto', boxSizing: 'border-box' }}>
                      {service.length > 0 ? service.map(sId => {
                        const s = availableServices.find(as => as.id.toString() === sId.toString());
                        return s ? (
                          <div key={s.id} style={{ color: '#111', marginBottom: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                            <CheckCircle size={14} style={{ color: 'var(--gold-accent, #d4af37)', marginRight: '8px' }} />
                            {s.service_name} - ₹{s.price}
                          </div>
                        ) : null;
                      }) : (
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>Select a seat to choose services</span>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}><Clock size={14} style={{marginRight: '5px', display: 'inline'}} />Time</label>
                    <div style={{ width: '100%', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #eaeaea', color: time ? '#111' : '#666', borderRadius: '4px', cursor: 'not-allowed', boxSizing: 'border-box', minHeight: '47px' }}>
                      {time || "Select a seat to choose time"}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}><User size={14} style={{marginRight: '5px', display: 'inline'}} />Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #eaeaea', color: '#111', borderRadius: '4px' }} placeholder="Your Name" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}><Phone size={14} style={{marginRight: '5px', display: 'inline'}} />Phone</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #eaeaea', color: '#111', borderRadius: '4px' }} placeholder="Your Phone" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #eaeaea', color: '#111', borderRadius: '4px' }} placeholder="Your Email" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>Gender</label>
                    <select required value={gender} onChange={e => setGender(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #eaeaea', color: '#111', borderRadius: '4px' }}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>City</label>
                    <input type="text" required value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #eaeaea', color: '#111', borderRadius: '4px' }} placeholder="Your City" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>Address</label>
                    <input type="text" required value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #eaeaea', color: '#111', borderRadius: '4px' }} placeholder="Your Address" />
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
      {/* Footer Section */}
      <footer id="footer-section" style={{ backgroundColor: '#111', color: '#fff', padding: '60px 5% 20px', marginTop: 'auto', borderTop: '4px solid var(--gold-accent, #d4af37)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', borderBottom: '1px solid #333', paddingBottom: '40px', marginBottom: '20px', maxWidth: '1200px', margin: '0 auto 20px' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--gold-accent, #d4af37)', marginBottom: '15px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {salon?.name ? salon.name.split(' ')[0] : 'LOOKS'} <span style={{ fontWeight: '300', fontSize: '1.2rem', letterSpacing: '6px', display: 'block' }}>{salon?.name ? salon.name.split(' ').slice(1).join(' ') : 'S A L O N'}</span>
            </h3>
            <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '0.95rem', marginTop: '20px' }}>
              {salon?.description || t('Experience the pinnacle of luxury hair and beauty services. Our expert stylists are dedicated to bringing out your best look in a relaxing, premium environment.')}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600', color: '#fff' }}>{t('Quick Links')}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#aaa', lineHeight: '2.2', fontSize: '0.95rem' }}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('booking'); }} style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color='var(--gold-accent, #d4af37)'} onMouseOut={e => e.target.style.color='#aaa'}>{t('Home')}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); const footer = document.getElementById('footer-section'); if (footer) footer.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color='var(--gold-accent, #d4af37)'} onMouseOut={e => e.target.style.color='#aaa'}>{t('About Us')}</a></li>
              <li><a href="#" onClick={(e) => {
                e.preventDefault();
                setActiveTab('services');
                setTimeout(() => {
                  const servicesHeading = document.getElementById('our-services-heading');
                  if (servicesHeading) servicesHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }} style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color='var(--gold-accent, #d4af37)'} onMouseOut={e => e.target.style.color='#aaa'}>{t('Services')}</a></li>
              <li><a href="#" onClick={(e) => {
                e.preventDefault();
                setActiveTab('contact');
                setTimeout(() => {
                  const callbackHeading = document.getElementById('request-callback-heading');
                  if (callbackHeading) callbackHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              }} style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color='var(--gold-accent, #d4af37)'} onMouseOut={e => e.target.style.color='#aaa'}>{t('Call Back')}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); const footer = document.getElementById('footer-section'); if (footer) footer.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color='var(--gold-accent, #d4af37)'} onMouseOut={e => e.target.style.color='#aaa'}>{t('Contact')}</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600', color: '#fff' }}>{t('Contact Us')}</h4>
            <div style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '2.2' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={16} color="var(--gold-accent, #d4af37)" /> {salon?.address || '123 Beauty Avenue, NY 10001'}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-accent, #d4af37)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> 
                {salon?.phoneNumber || '+1 (555) 123-4567'}
              </p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} {salon?.name || 'Looks Salon'}. {t('All rights reserved.')}</p>
        </div>
      </footer>
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
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #eaeaea',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '5px', color: 'var(--gold-accent, #d4af37)', textAlign: 'center' }}>
              {!selectedSeatForDetails ? 'Select a Seat' : 'Seat Availability'}
            </h3>
            {modalError && <div className="error-message" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>{modalError}</div>}
            
            {!date && !selectedSeatForDetails && <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>Select a date first to see availability.</p>}
            
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
                      backgroundColor: seat.toString() === s.id.toString() ? 'var(--gold-accent, #d4af37)' : '#f9f9f9',
                      color: seat.toString() === s.id.toString() ? '#000' : '#111',
                      border: '1px solid ' + (seat.toString() === s.id.toString() ? 'var(--gold-accent, #d4af37)' : '#eaeaea'),
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
                        e.currentTarget.style.borderColor = '#eaeaea';
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
                  <p style={{ color: '#666', gridColumn: '1/-1', textAlign: 'center' }}>No seats available</p>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <button onClick={() => setSelectedSeatForDetails(null)} style={{ background: 'transparent', color: 'var(--gold-accent, #d4af37)', border: 'none', cursor: 'pointer', marginRight: '10px', fontSize: '1rem', padding: 0 }}>← Back</button>
                  <h4 style={{ margin: 0, color: '#111', fontSize: '1.2rem', flex: 1, textAlign: 'center' }}>Seat: {availableSeats.find(s => s.id === selectedSeatForDetails)?.name}</h4>
                  <div style={{width: '50px'}}></div>
                </div>
                
                {!seatDetailedAvailability ? <p style={{ color: '#666', textAlign: 'center' }}>Loading availability...</p> : (
                  <div>
                    {seatDetailedAvailability.isClosed ? (
                      <p style={{ color: '#ff6b6b', textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>Salon is closed on this date.</p>
                    ) : (
                      <>
                        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                          <h5 style={{ color: '#666', marginBottom: '10px', marginTop: 0 }}>Select Services</h5>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                            {availableServices.map(s => (
                              <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#111', cursor: 'pointer' }}>
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
                                {s.service_name} - {s.duration_minutes} mins (₹{s.price})
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        {modalService.length > 0 ? (
                          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                            <h5 style={{ color: '#666', marginBottom: '15px', marginTop: 0 }}>Available Time Slots</h5>
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
                                        backgroundColor: isSelected ? 'var(--gold-accent, #d4af37)' : '#fff',
                                        color: isSelected ? '#000' : '#111',
                                        border: '1px solid ' + (isSelected ? 'var(--gold-accent, #d4af37)' : '#ccc'),
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
                          <p style={{ color: '#666', textAlign: 'center', margin: '20px 0' }}>Please select at least one service to see available times.</p>
                        )}
                        
                        <div style={{ marginTop: '20px' }}>
                          <button 
                            type="button"
                            onClick={handleConfirmModal}
                            disabled={!modalTime}
                            style={{
                              width: '100%',
                              padding: '12px',
                              backgroundColor: modalTime ? 'var(--gold-accent, #d4af37)' : '#eaeaea',
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
                border: '1px solid #ccc',
                color: '#111',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginTop: '15px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#eaeaea'}
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
