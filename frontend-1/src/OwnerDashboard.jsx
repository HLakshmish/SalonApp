import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const OwnerDashboard = ({ setCurrentView, salons, setSalons, authToken, setAuthToken }) => {
  useEffect(() => {
    const fetchMySalons = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/salons/my-salons', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSalons(data);
        }
      } catch (err) {
        console.error("Error fetching my salons", err);
      }
    };
    if (authToken) {
      fetchMySalons();
    }
  }, [authToken, setSalons]);
  const [maxSalons, setMaxSalons] = useState(1);
  const [selectedSalonId, setSelectedSalonId] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/subscription/me', {
          headers: { 'Authorization': `Bearer ${authToken}`, 'accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.hasSubscription && data.subscription?.plan) {
            setMaxSalons(data.subscription.plan.max_salons);
          }
        }
      } catch (err) { console.error(err); }
    };
    if (authToken) fetchSubscription();
  }, [authToken]);

  const activeSalon = selectedSalonId ? salons.find(s => s.id === selectedSalonId) : (salons.length > 0 ? salons[0] : null);

  const [isCreatingSalon, setIsCreatingSalon] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const [isEditingSalon, setIsEditingSalon] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Configuration States
  const [configTab, setConfigTab] = useState('seats'); // 'seats', 'services', 'employees'
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  // Dynamic Lists for demo/feedback
  const [seatsList, setSeatsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [appointmentDateFilter, setAppointmentDateFilter] = useState(null);
  const [callbacksList, setCallbacksList] = useState([]);
  const [loadingCallbacks, setLoadingCallbacks] = useState(false);

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await fetch('http://localhost:3000/api/appointments/owner/salons', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointmentsList(data);
      }
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    if (configTab === 'appointments') {
      fetchAppointments();
    }
  }, [configTab, authToken]);

  const fetchCallbacks = async () => {
    if (!activeSalon) return;
    setLoadingCallbacks(true);
    try {
      const response = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}/callbacks`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': '*/*'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCallbacksList(data);
      }
    } catch (err) {
      console.error("Error fetching callbacks", err);
    } finally {
      setLoadingCallbacks(false);
    }
  };

  useEffect(() => {
    if (configTab === 'callbacks') {
      fetchCallbacks();
    }
  }, [configTab, activeSalon, authToken]);

  const fetchSeats = async () => {
    if (!activeSalon) return;
    try {
      const response = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}/seats`, {
        headers: { 'accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setSeatsList(data);
      }
    } catch (err) {
      console.error("Error fetching seats", err);
    }
  };

  useEffect(() => {
    if (configTab === 'seats' && salons.length > 0) {
      fetchSeats();
    }
  }, [configTab, salons]);

  const fetchServices = async () => {
    if (!activeSalon) return;
    try {
      const response = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}/services`, {
        headers: { 'accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setServicesList(data);
      }
    } catch (err) {
      console.error("Error fetching services", err);
    }
  };

  useEffect(() => {
    if (configTab === 'services' && salons.length > 0) {
      fetchServices();
    }
  }, [configTab, salons]);

  const fetchEmployees = async () => {
    if (!activeSalon) return;
    try {
      const response = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}/employees`, {
        headers: { 'accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setEmployeesList(data);
      }
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  useEffect(() => {
    if (configTab === 'employees' && salons.length > 0) {
      fetchEmployees();
    }
  }, [configTab, salons]);

  // Form States for Configuration
  const [seatName, setSeatName] = useState('');
  const [seatDesc, setSeatDesc] = useState('');
  const [editingSeatId, setEditingSeatId] = useState(null);
  const [editSeatName, setEditSeatName] = useState('');
  const [editSeatDesc, setEditSeatDesc] = useState('');

  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceGender, setServiceGender] = useState('both');

  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editServiceName, setEditServiceName] = useState('');
  const [editServiceDesc, setEditServiceDesc] = useState('');
  const [editServiceDuration, setEditServiceDuration] = useState('');
  const [editServicePrice, setEditServicePrice] = useState('');
  const [editServiceStatus, setEditServiceStatus] = useState('active');
  const [editServiceGender, setEditServiceGender] = useState('both');

  const [empName, setEmpName] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empExp, setEmpExp] = useState('');

  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editEmpName, setEditEmpName] = useState('');
  const [editEmpPhone, setEditEmpPhone] = useState('');
  const [editEmpRole, setEditEmpRole] = useState('');
  const [editEmpExp, setEditEmpExp] = useState('');

  // New Salon Form States
  const [salonData, setSalonData] = useState({
    name: '', address: '', city: '', state: '', pincode: '', phoneNumber: '', description: ''
  });
  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '18:00', closed: false },
    sunday: { open: '09:00', close: '18:00', closed: true }
  });
  const [files, setFiles] = useState({ logo: null, banner: null, photos: null });

  const handleSalonDataChange = (e) => {
    const { name, value } = e.target;
    setSalonData(prev => ({ ...prev, [name]: value }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles.length > 0) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleCreateSalon = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    const formData = new FormData();
    Object.keys(salonData).forEach(key => formData.append(key, salonData[key]));

    // Construct operatingHours JSON using the UI inputs
    const payloadHours = {};
    Object.keys(operatingHours).forEach(day => {
      if (operatingHours[day].closed) {
        payloadHours[day] = { closed: true };
      } else {
        payloadHours[day] = { open: operatingHours[day].open, close: operatingHours[day].close };
      }
    });
    formData.append('operatingHours', JSON.stringify(payloadHours));

    if (files.logo) formData.append('logo', files.logo);
    if (files.banner) formData.append('banner', files.banner);
    if (files.photos) formData.append('photos', files.photos); 

    try {
      const response = await fetch('http://localhost:3000/api/salons', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData
      });
      const data = await response.json();
      
      if (response.ok) {
        setSalons(prev => [...prev, data.salon]);
        setIsCreatingSalon(false);
      } else {
        setCreateError(data.message || 'Failed to create salon');
      }
    } catch (err) {
      setCreateError('Network error while creating salon.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditSalonClick = () => {
    const s = activeSalon;
    setSalonData({
      name: s.name || '',
      address: s.address || '',
      city: s.city || '',
      state: s.state || '',
      pincode: s.pincode || '',
      phoneNumber: s.phoneNumber || '',
      description: s.description || ''
    });
    
    let parsedHours = {};
    if (s.operatingHours) {
      if (typeof s.operatingHours === 'string') {
        try { parsedHours = JSON.parse(s.operatingHours); } catch(e) {}
      } else {
        parsedHours = s.operatingHours;
      }
    }
    
    const defaultHours = {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: true }
    };

    const newHours = { ...defaultHours };
    Object.keys(newHours).forEach(day => {
      if (parsedHours[day]) {
         if (parsedHours[day].closed) {
           newHours[day].closed = true;
         } else {
           newHours[day].open = parsedHours[day].open || '09:00';
           newHours[day].close = parsedHours[day].close || '18:00';
           newHours[day].closed = false;
         }
      }
    });
    setOperatingHours(newHours);
    setFiles({ logo: null, banner: null, photos: null });
    setIsEditingSalon(true);
    setIsConfiguring(false);
  };

  const handleUpdateSalon = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateLoading(true);

    const formData = new FormData();
    Object.keys(salonData).forEach(key => formData.append(key, salonData[key]));

    const payloadHours = {};
    Object.keys(operatingHours).forEach(day => {
      if (operatingHours[day].closed) {
        payloadHours[day] = { closed: true };
      } else {
        payloadHours[day] = { open: operatingHours[day].open, close: operatingHours[day].close };
      }
    });
    formData.append('operatingHours', JSON.stringify(payloadHours));

    if (files.logo) formData.append('logo', files.logo);
    if (files.banner) formData.append('banner', files.banner);
    if (files.photos) formData.append('photos', files.photos); 

    try {
      const response = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData
      });
      const data = await response.json();
      
      if (response.ok) {
        setSalons(prev => prev.map(s => s.id === data.salon.id ? data.salon : s));
        setIsEditingSalon(false);
      } else {
        setUpdateError(data.message || 'Failed to update salon');
      }
    } catch (err) {
      setUpdateError('Network error while updating salon.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteSalon = async () => {
    if (!window.confirm('Are you sure you want to delete this salon? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': '*/*'
        }
      });
      
      if (response.ok) {
        setSalons([]);
        setIsConfiguring(false);
        setIsEditingSalon(false);
      } else {
        let errorMsg = 'Unknown error';
        try {
          const data = await response.json();
          errorMsg = data.message || errorMsg;
        } catch(e) {
          errorMsg = await response.text();
        }
        alert(`Error deleting salon: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Error deleting salon:", err);
      alert('Network error while deleting salon.');
    }
  };

  const handleAddSeat = async (e) => {
    e.preventDefault();
    if (!activeSalon) return;
    try {
      const res = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}/seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ name: seatName, description: seatDesc, isActive: true })
      });
      if (res.ok) {
        const data = await res.json();
        setSeatsList([...seatsList, data.seat]);
        setSeatName(''); setSeatDesc('');
      } else {
        const text = await res.text();
        alert(`Error adding seat: ${text}`);
      }
    } catch (err) {
      console.error("Add seat error:", err);
      alert('Network error: ' + err.message);
    }
  };

  const handleEditClick = (seat) => {
    setEditingSeatId(seat.id);
    setEditSeatName(seat.name);
    setEditSeatDesc(seat.description || '');
  };

  const handleUpdateSeat = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/seats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ name: editSeatName, description: editSeatDesc, isActive: true })
      });
      if (res.ok) {
        const data = await res.json();
        setSeatsList(seatsList.map(s => s.id === id ? data.seat : s));
        setEditingSeatId(null);
      } else {
        const text = await res.text();
        alert(`Error updating seat: ${text}`);
      }
    } catch(err) {
      console.error("Update seat error:", err);
      alert('Network error: ' + err.message);
    }
  };

  const handleDeleteSeat = async (id) => {
    if (!window.confirm('Are you sure you want to delete this seat?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/seats/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        setSeatsList(seatsList.filter(s => s.id !== id));
      } else {
        const text = await res.text();
        alert(`Error deleting seat: ${text}`);
      }
    } catch(err) {
      console.error("Delete seat error:", err);
      alert('Network error: ' + err.message);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!activeSalon) return;
    try {
      const res = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ service_name: serviceName, description: serviceDesc, duration_minutes: Number(serviceDuration), price: Number(servicePrice), status: 'active', gender: serviceGender })
      });
      if (res.ok) {
        const data = await res.json();
        setServicesList([...servicesList, data.service]);
        setServiceName(''); setServiceDesc(''); setServiceDuration(''); setServicePrice(''); setServiceGender('both');
      } else {
        const text = await res.text();
        alert(`Error adding service: ${text}`);
      }
    } catch (err) {
      console.error("Add service error:", err);
      alert('Network error: ' + err.message);
    }
  };

  const handleEditServiceClick = (s) => {
    setEditingServiceId(s.id);
    setEditServiceName(s.service_name);
    setEditServiceDesc(s.description || '');
    setEditServiceDuration(s.duration_minutes);
    setEditServicePrice(s.price);
    setEditServiceStatus(s.status || 'active');
    setEditServiceGender(s.gender || 'both');
  };

  const handleUpdateService = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
          service_name: editServiceName,
          description: editServiceDesc,
          duration_minutes: Number(editServiceDuration),
          price: Number(editServicePrice),
          status: editServiceStatus,
          gender: editServiceGender
        })
      });
      if (res.ok) {
        const data = await res.json();
        setServicesList(servicesList.map(s => s.id === id ? data.service : s));
        setEditingServiceId(null);
      } else {
        const text = await res.text();
        alert(`Error updating service: ${text}`);
      }
    } catch(err) {
      console.error("Update service error:", err);
      alert('Network error: ' + err.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        setServicesList(servicesList.filter(s => s.id !== id));
      } else {
        const text = await res.text();
        alert(`Error deleting service: ${text}`);
      }
    } catch(err) {
      console.error("Delete service error:", err);
      alert('Network error: ' + err.message);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!activeSalon) return;
    try {
      const res = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ name: empName, phone: empPhone, role: empRole, experience: empExp })
      });
      if (res.ok) {
        const data = await res.json();
        setEmployeesList([...employeesList, data.employee]);
        setEmpName(''); setEmpPhone(''); setEmpRole(''); setEmpExp('');
      } else {
        const text = await res.text();
        alert(`Error adding employee: ${text}`);
      }
    } catch (err) {
      console.error("Add employee error:", err);
      alert('Network error: ' + err.message);
    }
  };

  const handleEditEmployeeClick = (e) => {
    setEditingEmployeeId(e.id);
    setEditEmpName(e.name);
    setEditEmpPhone(e.phone);
    setEditEmpRole(e.role);
    setEditEmpExp(e.experience);
  };

  const handleUpdateEmployee = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
          name: editEmpName,
          phone: editEmpPhone,
          role: editEmpRole,
          experience: editEmpExp
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEmployeesList(employeesList.map(emp => emp.id === id ? data.employee : emp));
        setEditingEmployeeId(null);
      } else {
        const text = await res.text();
        alert(`Error updating employee: ${text}`);
      }
    } catch(err) {
      console.error("Update employee error:", err);
      alert('Network error: ' + err.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        setEmployeesList(employeesList.filter(emp => emp.id !== id));
      } else {
        const text = await res.text();
        alert(`Error deleting employee: ${text}`);
      }
    } catch(err) {
      console.error("Delete employee error:", err);
      alert('Network error: ' + err.message);
    }
  };

  const timeOptions = Array.from({ length: 96 }).map((_, i) => {
    const h = Math.floor(i / 4);
    const m = (i % 4) * 15;
    const mStr = m === 0 ? '00' : m.toString();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    const val = `${h.toString().padStart(2, '0')}:${mStr}`;
    return { value: val, label: `${displayH}:${mStr} ${ampm}` };
  });

  const filteredAppointments = appointmentsList.filter(apt => {
    if (!appointmentDateFilter) return true;
    const aptDateObj = new Date(apt.startTime);
    const aptY = aptDateObj.getFullYear();
    const aptM = aptDateObj.getMonth();
    const aptD = aptDateObj.getDate();

    const filY = appointmentDateFilter.getFullYear();
    const filM = appointmentDateFilter.getMonth();
    const filD = appointmentDateFilter.getDate();
    
    return aptY === filY && aptM === filM && aptD === filD;
  });

  return (
    <div>
      <header className="header-container">
        <div className="header-top">
          <div className="logo-section" onClick={() => setCurrentView('home')} style={{cursor: 'pointer'}}>
            <div className="logo-main">LOOKS</div>
            <div className="logo-sub">S A L O N</div>
          </div>
          <div className="header-actions-wrapper">
            <div className="top-buttons">
              <button className="outline-btn" onClick={() => {
                setCurrentView('home');
                setSalons([]);
                setIsCreatingSalon(false);
                setAuthToken('');
                setIsConfiguring(false);
              }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Owner Dashboard</h1>
          {salons.length < maxSalons && !isCreatingSalon && (
            <button className="create-salon-btn" onClick={() => setIsCreatingSalon(true)}>
              + Create Salon
            </button>
          )}
        </div>

        {isCreatingSalon && salons.length < maxSalons ? (
          <div className="create-salon-form">
            <h2 className="auth-title" style={{ textAlign: 'left', marginBottom: '30px' }}>Register New Salon</h2>
            {createError && <div className="error-message">{createError}</div>}
            
            <form onSubmit={handleCreateSalon}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Salon Name</label>
                  <input type="text" name="name" className="form-input" required value={salonData.name} onChange={handleSalonDataChange} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" name="phoneNumber" className="form-input" required value={salonData.phoneNumber} onChange={handleSalonDataChange} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input type="text" name="pincode" className="form-input" required value={salonData.pincode} onChange={handleSalonDataChange} />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Address</label>
                  <input type="text" name="address" className="form-input" required value={salonData.address} onChange={handleSalonDataChange} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" name="city" className="form-input" required value={salonData.city} onChange={handleSalonDataChange} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input type="text" name="state" className="form-input" required value={salonData.state} onChange={handleSalonDataChange} />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Operating Hours</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#222', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                    {Object.keys(operatingHours).map(day => (
                      <div key={day} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr auto', gap: '15px', alignItems: 'center' }}>
                        <span style={{ textTransform: 'capitalize', color: operatingHours[day].closed ? '#888' : '#fff', fontWeight: 'bold' }}>{day}</span>
                        <select className="form-input" disabled={operatingHours[day].closed} value={operatingHours[day].open} onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)} style={{ opacity: operatingHours[day].closed ? 0.3 : 1, cursor: 'pointer' }}>
                          {timeOptions.map(opt => <option key={`open-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <select className="form-input" disabled={operatingHours[day].closed} value={operatingHours[day].close} onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)} style={{ opacity: operatingHours[day].closed ? 0.3 : 1, cursor: 'pointer' }}>
                          {timeOptions.map(opt => <option key={`close-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#aaa', fontSize: '0.9rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={operatingHours[day].closed} onChange={(e) => handleOperatingHoursChange(day, 'closed', e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                          Closed
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-input" rows="3" value={salonData.description} onChange={handleSalonDataChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Salon Logo</label>
                  <input type="file" name="logo" className="form-input file-input" onChange={handleFileChange} accept="image/*" />
                </div>

                <div className="form-group">
                  <label className="form-label">Banner Image</label>
                  <input type="file" name="banner" className="form-input file-input" onChange={handleFileChange} accept="image/*" />
                </div>

                <div className="form-group full-width">
                  <button type="submit" className="auth-btn" disabled={createLoading}>
                    {createLoading ? 'Creating Salon...' : 'Submit Salon Details'}
                  </button>
                  <button type="button" className="outline-btn" style={{marginTop: '15px', width: '100%', justifyContent: 'center'}} onClick={() => setIsCreatingSalon(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : isEditingSalon && salons.length > 0 ? (
          <div className="create-salon-form">
            <h2 className="auth-title" style={{ textAlign: 'left', marginBottom: '30px' }}>Edit Salon Details</h2>
            {updateError && <div className="error-message">{updateError}</div>}
            
            <form onSubmit={handleUpdateSalon}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Salon Name</label>
                  <input type="text" name="name" className="form-input" required value={salonData.name} onChange={handleSalonDataChange} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" name="phoneNumber" className="form-input" required value={salonData.phoneNumber} onChange={handleSalonDataChange} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input type="text" name="pincode" className="form-input" required value={salonData.pincode} onChange={handleSalonDataChange} />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Address</label>
                  <input type="text" name="address" className="form-input" required value={salonData.address} onChange={handleSalonDataChange} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" name="city" className="form-input" required value={salonData.city} onChange={handleSalonDataChange} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input type="text" name="state" className="form-input" required value={salonData.state} onChange={handleSalonDataChange} />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Operating Hours</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#222', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                    {Object.keys(operatingHours).map(day => (
                      <div key={day} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr auto', gap: '15px', alignItems: 'center' }}>
                        <span style={{ textTransform: 'capitalize', color: operatingHours[day].closed ? '#888' : '#fff', fontWeight: 'bold' }}>{day}</span>
                        <select className="form-input" disabled={operatingHours[day].closed} value={operatingHours[day].open} onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)} style={{ opacity: operatingHours[day].closed ? 0.3 : 1, cursor: 'pointer' }}>
                          {timeOptions.map(opt => <option key={`open-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <select className="form-input" disabled={operatingHours[day].closed} value={operatingHours[day].close} onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)} style={{ opacity: operatingHours[day].closed ? 0.3 : 1, cursor: 'pointer' }}>
                          {timeOptions.map(opt => <option key={`close-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#aaa', fontSize: '0.9rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={operatingHours[day].closed} onChange={(e) => handleOperatingHoursChange(day, 'closed', e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                          Closed
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-input" rows="3" value={salonData.description} onChange={handleSalonDataChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Salon Logo (Leave blank to keep current)</label>
                  <input type="file" name="logo" className="form-input file-input" onChange={handleFileChange} accept="image/*" />
                </div>

                <div className="form-group">
                  <label className="form-label">Banner Image (Leave blank to keep current)</label>
                  <input type="file" name="banner" className="form-input file-input" onChange={handleFileChange} accept="image/*" />
                </div>

                <div className="form-group full-width">
                  <button type="submit" className="auth-btn" disabled={updateLoading}>
                    {updateLoading ? 'Updating Salon...' : 'Update Salon Details'}
                  </button>
                  <button type="button" className="outline-btn" style={{marginTop: '15px', width: '100%', justifyContent: 'center'}} onClick={() => setIsEditingSalon(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : salons.length > 0 ? (
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {salons.map(salon => (
              <div key={salon.id}>
                <div className="salon-card" style={{ border: selectedSalonId === salon.id ? '2px solid var(--gold-accent, #d4af37)' : '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="salon-logo-placeholder">
                    {salon.logoUrl ? (
                      <img src={salon.logoUrl} alt="Logo" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} />
                    ) : (
                      <ImageIcon size={48} />
                    )}
                  </div>
                  <div className="salon-info">
                    <h2>{salon.name}</h2>
                    <p><strong>Address:</strong> {salon.address}, {salon.city}, {salon.state} - {salon.pincode}</p>
                    <p><strong>Phone:</strong> {salon.phoneNumber}</p>
                    <p><strong>Description:</strong> {salon.description || 'No description provided.'}</p>
                    
                    <div style={{marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                      <button className="outline-btn" onClick={() => {
                        setSelectedSalonId(salon.id);
                        if (selectedSalonId === salon.id && isConfiguring) setIsConfiguring(false);
                        else setIsConfiguring(true);
                      }}>
                        {isConfiguring && selectedSalonId === salon.id ? 'Close Configuration' : 'Manage Salon'}
                      </button>
                      <button className="outline-btn" onClick={() => { setSelectedSalonId(salon.id); handleEditSalonClick(); }}>
                        Edit Salon Details
                      </button>
                      <button className="outline-btn" style={{color: '#ff4d4d', borderColor: '#552222', backgroundColor: 'rgba(255, 77, 77, 0.1)'}} onClick={() => { setSelectedSalonId(salon.id); handleDeleteSalon(); }}>
                        Delete Salon
                      </button>
                    </div>
                  </div>
                </div>

                {/* Configuration Section for this specific salon */}
                {isConfiguring && selectedSalonId === salon.id && (
              <div className="config-container">
                <div className="config-tabs">
                  <div className={`config-tab ${configTab === 'seats' ? 'active' : ''}`} onClick={() => setConfigTab('seats')}>Seats</div>
                  <div className={`config-tab ${configTab === 'services' ? 'active' : ''}`} onClick={() => setConfigTab('services')}>Services</div>
                  <div className={`config-tab ${configTab === 'employees' ? 'active' : ''}`} onClick={() => setConfigTab('employees')}>Employees</div>
                  <div className={`config-tab ${configTab === 'appointments' ? 'active' : ''}`} onClick={() => setConfigTab('appointments')}>Appointments</div>
                  <div className={`config-tab ${configTab === 'callbacks' ? 'active' : ''}`} onClick={() => setConfigTab('callbacks')}>Callbacks</div>
                </div>

                <div className="config-content">
                  {/* Seats Configuration */}
                  {configTab === 'seats' && (
                    <div>
                      <div className="config-header">
                        <h3 className="config-title">Manage Seats</h3>
                      </div>
                      <form onSubmit={handleAddSeat} style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
                        <input type="text" placeholder="Seat Name (e.g. S1)" className="form-input" value={seatName} onChange={e => setSeatName(e.target.value)} required />
                        <input type="text" placeholder="Description" className="form-input" value={seatDesc} onChange={e => setSeatDesc(e.target.value)} />
                        <button type="submit" className="add-btn" style={{whiteSpace: 'nowrap'}}><Plus size={16} style={{marginRight:'4px', verticalAlign:'text-bottom'}}/> Add</button>
                      </form>
                      <div className="config-list">
                        {seatsList.map((s, i) => (
                          <div key={i} className="config-item" style={{ alignItems: 'center' }}>
                            {editingSeatId === s.id ? (
                              <div style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}>
                                <input type="text" className="form-input" value={editSeatName} onChange={e => setEditSeatName(e.target.value)} style={{ flex: 1, minWidth: '150px' }} />
                                <input type="text" className="form-input" value={editSeatDesc} onChange={e => setEditSeatDesc(e.target.value)} style={{ flex: 2, minWidth: '200px' }} />
                                <button onClick={() => handleUpdateSeat(s.id)} className="add-btn" style={{ padding: '6px 15px', whiteSpace: 'nowrap' }}>Save</button>
                                <button onClick={() => setEditingSeatId(null)} className="outline-btn" style={{ padding: '6px 15px', whiteSpace: 'nowrap' }}>Cancel</button>
                              </div>
                            ) : (
                              <>
                                <div style={{ flex: 1 }}>
                                  <div className="config-item-main">{s.name}</div>
                                  <div className="config-item-sub">{s.description}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <span className={`status-badge ${s.isActive ? 'active' : ''}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                                  <button onClick={() => handleEditClick(s)} className="outline-btn" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Edit</button>
                                  <button onClick={() => handleDeleteSeat(s.id)} className="outline-btn" style={{ padding: '4px 10px', fontSize: '0.8rem', color: '#ff4d4d', borderColor: '#552222', backgroundColor: 'rgba(255, 77, 77, 0.1)' }}>Delete</button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        {seatsList.length === 0 && <p style={{color: '#888'}}>No seats added yet.</p>}
                      </div>
                    </div>
                  )}

                  {/* Services Configuration */}
                  {configTab === 'services' && (
                    <div>
                      <div className="config-header">
                        <h3 className="config-title">Manage Services</h3>
                      </div>
                      <form onSubmit={handleAddService} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
                        <input type="text" placeholder="Service Name (e.g. Hair Cut)" className="form-input" value={serviceName} onChange={e => setServiceName(e.target.value)} required />
                        <input type="number" placeholder="Price ($)" className="form-input" value={servicePrice} onChange={e => setServicePrice(e.target.value)} required />
                        <input type="number" placeholder="Duration (Mins)" className="form-input" value={serviceDuration} onChange={e => setServiceDuration(e.target.value)} required />
                        <select className="form-input" value={serviceGender} onChange={e => setServiceGender(e.target.value)} required>
                          <option value="both">Both (Unisex)</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        <input type="text" placeholder="Description" className="form-input" value={serviceDesc} onChange={e => setServiceDesc(e.target.value)} style={{gridColumn: '1 / -1'}} />
                        <button type="submit" className="add-btn" style={{gridColumn: '1 / -1'}}><Plus size={16} style={{marginRight:'4px', verticalAlign:'text-bottom'}}/> Add Service</button>
                      </form>
                      <div className="config-list">
                        {servicesList.map((s, i) => (
                          <div key={i} className="config-item" style={{ alignItems: 'center' }}>
                            {editingServiceId === s.id ? (
                              <div style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                  <input type="text" className="form-input" value={editServiceName} onChange={e => setEditServiceName(e.target.value)} style={{ flex: 1, minWidth: '150px' }} placeholder="Service Name" />
                                  <input type="number" className="form-input" value={editServicePrice} onChange={e => setEditServicePrice(e.target.value)} style={{ width: '100px' }} placeholder="Price ($)" />
                                  <input type="number" className="form-input" value={editServiceDuration} onChange={e => setEditServiceDuration(e.target.value)} style={{ width: '120px' }} placeholder="Duration (mins)" />
                                  <select className="form-input" value={editServiceGender} onChange={e => setEditServiceGender(e.target.value)} style={{ width: '100px', margin: 0 }}>
                                    <option value="both">Both</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                  </select>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                  <input type="text" className="form-input" value={editServiceDesc} onChange={e => setEditServiceDesc(e.target.value)} style={{ flex: 1, minWidth: '200px' }} placeholder="Description" />
                                  <select className="form-input" value={editServiceStatus} onChange={e => setEditServiceStatus(e.target.value)} style={{ width: '120px', margin: 0 }}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                  </select>
                                  <button onClick={() => handleUpdateService(s.id)} className="add-btn" style={{ padding: '6px 15px', whiteSpace: 'nowrap' }}>Save</button>
                                  <button onClick={() => setEditingServiceId(null)} className="outline-btn" style={{ padding: '6px 15px', whiteSpace: 'nowrap' }}>Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div style={{ flex: 1 }}>
                                  <div className="config-item-main">{s.service_name} <span style={{color: 'var(--gold-accent)'}}>- ${s.price}</span></div>
                                  <div className="config-item-sub">{s.duration_minutes} mins | {s.gender ? s.gender.charAt(0).toUpperCase() + s.gender.slice(1) : 'Both'} | {s.description}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <span className={`status-badge ${s.status === 'active' ? 'active' : ''}`} style={{ textTransform: 'capitalize' }}>{s.status}</span>
                                  <button onClick={() => handleEditServiceClick(s)} className="outline-btn" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Edit</button>
                                  <button onClick={() => handleDeleteService(s.id)} className="outline-btn" style={{ padding: '4px 10px', fontSize: '0.8rem', color: '#ff4d4d', borderColor: '#552222', backgroundColor: 'rgba(255, 77, 77, 0.1)' }}>Delete</button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        {servicesList.length === 0 && <p style={{color: '#888'}}>No services added yet.</p>}
                      </div>
                    </div>
                  )}

                  {/* Employees Configuration */}
                  {configTab === 'employees' && (
                    <div>
                      <div className="config-header">
                        <h3 className="config-title">Manage Employees</h3>
                      </div>
                      <form onSubmit={handleAddEmployee} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
                        <input type="text" placeholder="Employee Name" className="form-input" value={empName} onChange={e => setEmpName(e.target.value)} required />
                        <input type="tel" placeholder="Phone Number" className="form-input" value={empPhone} onChange={e => setEmpPhone(e.target.value)} required />
                        <input type="text" placeholder="Role (e.g. Senior Stylist)" className="form-input" value={empRole} onChange={e => setEmpRole(e.target.value)} required />
                        <input type="text" placeholder="Experience (e.g. 5 Years)" className="form-input" value={empExp} onChange={e => setEmpExp(e.target.value)} required />
                        <button type="submit" className="add-btn" style={{gridColumn: '1 / -1'}}><Plus size={16} style={{marginRight:'4px', verticalAlign:'text-bottom'}}/> Add Employee</button>
                      </form>
                      <div className="config-list">
                        {employeesList.map((emp, i) => (
                          <div key={i} className="config-item" style={{ alignItems: 'center' }}>
                            {editingEmployeeId === emp.id ? (
                              <div style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                  <input type="text" className="form-input" value={editEmpName} onChange={e => setEditEmpName(e.target.value)} style={{ flex: 1, minWidth: '150px' }} placeholder="Name" />
                                  <input type="tel" className="form-input" value={editEmpPhone} onChange={e => setEditEmpPhone(e.target.value)} style={{ flex: 1, minWidth: '150px' }} placeholder="Phone" />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                  <input type="text" className="form-input" value={editEmpRole} onChange={e => setEditEmpRole(e.target.value)} style={{ flex: 1, minWidth: '150px' }} placeholder="Role" />
                                  <input type="text" className="form-input" value={editEmpExp} onChange={e => setEditEmpExp(e.target.value)} style={{ flex: 1, minWidth: '100px' }} placeholder="Experience" />
                                  <button onClick={() => handleUpdateEmployee(emp.id)} className="add-btn" style={{ padding: '6px 15px', whiteSpace: 'nowrap' }}>Save</button>
                                  <button onClick={() => setEditingEmployeeId(null)} className="outline-btn" style={{ padding: '6px 15px', whiteSpace: 'nowrap' }}>Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div style={{ flex: 1 }}>
                                  <div className="config-item-main">{emp.name} - {emp.role}</div>
                                  <div className="config-item-sub">📞 {emp.phone} | ⭐ {emp.experience} Exp</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <button onClick={() => handleEditEmployeeClick(emp)} className="outline-btn" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Edit</button>
                                  <button onClick={() => handleDeleteEmployee(emp.id)} className="outline-btn" style={{ padding: '4px 10px', fontSize: '0.8rem', color: '#ff4d4d', borderColor: '#552222', backgroundColor: 'rgba(255, 77, 77, 0.1)' }}>Delete</button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        {employeesList.length === 0 && <p style={{color: '#888'}}>No employees added yet.</p>}
                      </div>
                    </div>
                  )}

                  {/* Appointments View */}
                  {configTab === 'appointments' && (
                    <div>
                      <div className="config-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <h3 className="config-title" style={{ margin: 0 }}>Salon Appointments</h3>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <DatePicker 
                            selected={appointmentDateFilter} 
                            onChange={(date) => setAppointmentDateFilter(date)}
                            customInput={
                              <input className="form-input" style={{ padding: '6px 10px', width: '130px', margin: 0, cursor: 'pointer' }} />
                            }
                            placeholderText="Select date"
                            dateFormat="yyyy-MM-dd"
                          />
                          {appointmentDateFilter && (
                            <button onClick={() => setAppointmentDateFilter(null)} className="outline-btn" style={{ padding: '6px 15px', fontSize: '0.9rem' }}>Clear</button>
                          )}
                          <button onClick={fetchAppointments} className="outline-btn" style={{ padding: '6px 15px', fontSize: '0.9rem' }}>Refresh</button>
                        </div>
                      </div>
                      
                      {loadingAppointments ? (
                        <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Loading appointments...</p>
                      ) : (
                        <div className="config-list" style={{ display: 'grid', gap: '15px' }}>
                          {filteredAppointments.length > 0 ? filteredAppointments.map((apt, i) => (
                            <div key={i} className="config-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '15px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
                                <div className="config-item-main" style={{ color: 'var(--gold-accent, #d4af37)' }}>
                                  {new Date(apt.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} | {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(apt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <span className={`status-badge ${apt.status === 'scheduled' ? 'active' : ''}`} style={{ textTransform: 'capitalize' }}>{apt.status || 'Scheduled'}</span>
                              </div>
                              
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', gap: '10px', fontSize: '0.95rem' }}>
                                <div style={{ borderRight: '1px solid #333', paddingRight: '10px' }}>
                                  <p style={{ margin: '5px 0', color: '#fff' }}><strong>Customer:</strong> {apt.customerName} {apt.customerGender ? `(${apt.customerGender})` : ''}</p>
                                  <p style={{ margin: '5px 0', color: '#aaa' }}>📞 {apt.customerPhone}</p>
                                  <p style={{ margin: '5px 0', color: '#aaa' }}>✉️ {apt.customerEmail}</p>
                                </div>
                                <div style={{ paddingLeft: '10px' }}>
                                  <p style={{ margin: '5px 0', color: '#fff' }}><strong>Seat:</strong> {apt.seat?.name || 'N/A'}</p>
                                  <p style={{ margin: '5px 0', color: '#aaa' }}>
                                    <strong>Services:</strong> {apt.services?.map(s => s.service_name).join(', ') || 'N/A'}
                                  </p>
                                  <p style={{ margin: '5px 0', color: '#aaa' }}>
                                    <strong>Duration:</strong> {apt.services?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0} mins
                                  </p>
                                </div>
                              </div>
                            </div>
                          )) : (
                            <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
                              {appointmentsList.length > 0 && appointmentDateFilter ? `No appointments found for ${appointmentDateFilter.toLocaleDateString()}.` : 'No appointments found.'}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Callbacks Configuration */}
                  {configTab === 'callbacks' && (
                    <div>
                      <div className="config-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 className="config-title">Callback Requests</h3>
                        <button onClick={fetchCallbacks} className="outline-btn" style={{ padding: '6px 15px', fontSize: '0.9rem' }}>Refresh</button>
                      </div>
                      
                      {loadingCallbacks ? (
                        <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Loading callbacks...</p>
                      ) : (
                        <div className="config-list" style={{ display: 'grid', gap: '15px' }}>
                          {callbacksList.length > 0 ? callbacksList.map((cb, i) => (
                            <div key={i} className="config-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '15px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
                                <div className="config-item-main" style={{ color: 'var(--gold-accent, #d4af37)' }}>
                                  {new Date(cb.dateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} | {new Date(cb.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <span className={`status-badge ${cb.status === 'pending' ? 'active' : ''}`} style={{ textTransform: 'capitalize' }}>{cb.status || 'Pending'}</span>
                              </div>
                              
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', gap: '10px', fontSize: '0.95rem' }}>
                                <div style={{ borderRight: '1px solid #333', paddingRight: '10px' }}>
                                  <p style={{ margin: '5px 0', color: '#fff' }}><strong>Name:</strong> {cb.name}</p>
                                  <p style={{ margin: '5px 0', color: '#aaa' }}>📞 {cb.phoneNumber}</p>
                                  <p style={{ margin: '5px 0', color: '#aaa' }}>✉️ {cb.email}</p>
                                </div>
                                <div style={{ paddingLeft: '10px' }}>
                                  <p style={{ margin: '5px 0', color: '#fff' }}><strong>Services:</strong> {cb.services}</p>
                                  <p style={{ margin: '5px 0', color: '#aaa' }}>
                                    <strong>Purpose:</strong> {cb.purpose}
                                  </p>
                                  <p style={{ margin: '5px 0', color: '#aaa' }}>
                                    <strong>Message:</strong> {cb.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )) : (
                            <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
                              No callback requests found.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{color: '#888', textAlign: 'center', marginTop: '40px', fontSize: '18px'}}>
            You haven't created any salons yet. Click "+ Create Salon" to get started.
          </p>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
