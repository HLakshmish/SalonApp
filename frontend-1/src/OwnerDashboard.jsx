import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const OwnerIcon = ({ name, size = 18, className = '', style = {} }) => {
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
    case 'plus':
      return (
        <svg {...props}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
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
    case 'info':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...props}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
    case 'trash':
      return (
        <svg {...props}>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'user':
      return (
        <svg {...props}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'image':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case 'check':
      return (
        <svg {...props}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...props}>
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
        </svg>
      );
    default:
      return null;
  }
};

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

  const [validationErrors, setValidationErrors] = useState({});

  const [seatValidationError, setSeatValidationError] = useState('');
  const [seatSuccessMessage, setSeatSuccessMessage] = useState('');

  const [serviceValidationError, setServiceValidationError] = useState('');
  const [serviceSuccessMessage, setServiceSuccessMessage] = useState('');

  const [employeeValidationError, setEmployeeValidationError] = useState('');
  const [employeeSuccessMessage, setEmployeeSuccessMessage] = useState('');

  const [configTab, setConfigTab] = useState('seats');
  const [isConfiguring, setIsConfiguring] = useState(false);

  useEffect(() => {
    setSeatValidationError('');
    setSeatSuccessMessage('');
    setServiceValidationError('');
    setServiceSuccessMessage('');
    setEmployeeValidationError('');
    setEmployeeSuccessMessage('');
  }, [configTab]);

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
  }, [configTab, salons, activeSalon]);

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
  }, [configTab, salons, activeSalon]);

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
  }, [configTab, salons, activeSalon]);

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

  const validateSalon = (data, logoFile, bannerFile) => {
    const errors = {};
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Salon name is required.';
    } else if (data.name.length > 100) {
      errors.name = 'Salon name cannot exceed 100 characters.';
    }

    if (!data.address || data.address.trim().length === 0) {
      errors.address = 'Address is required.';
    } else if (data.address.length > 200) {
      errors.address = 'Address cannot exceed 200 characters.';
    }

    if (!data.city || data.city.trim().length === 0) {
      errors.city = 'City is required.';
    }

    if (!data.state || data.state.trim().length === 0) {
      errors.state = 'State is required.';
    }

    const pinRegex = /^\d{5,6}$/;
    if (!data.pincode) {
      errors.pincode = 'Pincode is required.';
    } else if (!pinRegex.test(data.pincode)) {
      errors.pincode = 'Pincode must be exactly 5 or 6 digits (numeric only).';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!data.phoneNumber) {
      errors.phoneNumber = 'Phone number is required.';
    } else if (!phoneRegex.test(data.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be a valid 10-digit Indian mobile number.';
    }

    if (data.description && data.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters.';
    }

    // Logo validation
    if (logoFile) {
      if (!logoFile.type.startsWith('image/')) {
        errors.logo = 'Logo must be an image file.';
      } else if (logoFile.size > 5242880) {
        errors.logo = 'Logo size must be under 5MB.';
      }
    }

    // Banner validation
    if (bannerFile) {
      if (!bannerFile.type.startsWith('image/')) {
        errors.banner = 'Banner must be an image file.';
      } else if (bannerFile.size > 5242880) {
        errors.banner = 'Banner size must be under 5MB.';
      }
    }

    // Operating Hours validation
    let hoursError = false;
    Object.keys(operatingHours).forEach(day => {
      if (!operatingHours[day].closed) {
        const [openH, openM] = operatingHours[day].open.split(':').map(Number);
        const [closeH, closeM] = operatingHours[day].close.split(':').map(Number);
        const openMin = openH * 60 + openM;
        const closeMin = closeH * 60 + closeM;
        if (closeMin <= openMin) {
          hoursError = true;
        }
      }
    });
    if (hoursError) {
      errors.operatingHours = 'Closing time must be after opening time on all open days.';
    }

    return errors;
  };

  useEffect(() => {
    setValidationErrors({});
    setCreateError('');
    setUpdateError('');
  }, [isCreatingSalon, isEditingSalon]);

  const handleCreateSalon = async (e) => {
    e.preventDefault();
    setCreateError('');
    setValidationErrors({});

    const errors = validateSalon(salonData, files.logo, files.banner);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setCreateError('Please correct the validation errors below.');
      return;
    }

    setCreateLoading(true);

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
        try { parsedHours = JSON.parse(s.operatingHours); } catch (e) { }
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
    setValidationErrors({});

    const errors = validateSalon(salonData, files.logo, files.banner);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setUpdateError('Please correct the validation errors below.');
      return;
    }

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
        } catch (e) {
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
    setSeatValidationError('');
    setSeatSuccessMessage('');

    // Validations
    if (!seatName || seatName.trim().length === 0) {
      setSeatValidationError('Seat name is required.');
      return;
    }
    if (seatName.length > 50) {
      setSeatValidationError('Seat name cannot exceed 50 characters.');
      return;
    }
    if (seatDesc && seatDesc.length > 200) {
      setSeatValidationError('Seat description cannot exceed 200 characters.');
      return;
    }
    // Duplicate check
    const isDuplicate = seatsList.some(s => s.name.toLowerCase().trim() === seatName.toLowerCase().trim());
    if (isDuplicate) {
      setSeatValidationError(`A seat with the name "${seatName}" already exists in this salon.`);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}/seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ name: seatName.trim(), description: seatDesc.trim(), isActive: true })
      });
      if (res.ok) {
        const data = await res.json();
        setSeatsList([...seatsList, data.seat]);
        setSeatName(''); setSeatDesc('');
        setSeatSuccessMessage('Seat added successfully.');
      } else {
        const text = await res.text();
        setSeatValidationError(`Error adding seat: ${text}`);
      }
    } catch (err) {
      console.error("Add seat error:", err);
      setSeatValidationError('Network error: ' + err.message);
    }
  };

  const handleEditClick = (seat) => {
    setSeatValidationError('');
    setSeatSuccessMessage('');
    setEditingSeatId(seat.id);
    setEditSeatName(seat.name);
    setEditSeatDesc(seat.description || '');
  };

  const handleUpdateSeat = async (id) => {
    setSeatValidationError('');
    setSeatSuccessMessage('');

    // Validations
    if (!editSeatName || editSeatName.trim().length === 0) {
      setSeatValidationError('Seat name is required.');
      return;
    }
    if (editSeatName.length > 50) {
      setSeatValidationError('Seat name cannot exceed 50 characters.');
      return;
    }
    if (editSeatDesc && editSeatDesc.length > 200) {
      setSeatValidationError('Seat description cannot exceed 200 characters.');
      return;
    }
    // Duplicate check excluding current seat
    const isDuplicate = seatsList.some(s => s.id !== id && s.name.toLowerCase().trim() === editSeatName.toLowerCase().trim());
    if (isDuplicate) {
      setSeatValidationError(`A seat with the name "${editSeatName}" already exists in this salon.`);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/seats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ name: editSeatName.trim(), description: editSeatDesc.trim(), isActive: true })
      });
      if (res.ok) {
        const data = await res.json();
        setSeatsList(seatsList.map(s => s.id === id ? data.seat : s));
        setEditingSeatId(null);
        setSeatSuccessMessage('Seat updated successfully.');
      } else {
        const text = await res.text();
        setSeatValidationError(`Error updating seat: ${text}`);
      }
    } catch (err) {
      console.error("Update seat error:", err);
      setSeatValidationError('Network error: ' + err.message);
    }
  };

  const handleDeleteSeat = async (id) => {
    setSeatValidationError('');
    setSeatSuccessMessage('');
    if (!window.confirm('Are you sure you want to delete this seat?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/seats/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        setSeatsList(seatsList.filter(s => s.id !== id));
        setSeatSuccessMessage('Seat deleted successfully.');
      } else {
        const text = await res.text();
        setSeatValidationError(`Error deleting seat: ${text}`);
      }
    } catch (err) {
      console.error("Delete seat error:", err);
      setSeatValidationError('Network error: ' + err.message);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!activeSalon) return;
    setServiceValidationError('');
    setServiceSuccessMessage('');

    // Validations
    if (!serviceName || serviceName.trim().length === 0) {
      setServiceValidationError('Service name is required.');
      return;
    }
    if (serviceName.length > 100) {
      setServiceValidationError('Service name cannot exceed 100 characters.');
      return;
    }
    if (serviceDesc && serviceDesc.length > 200) {
      setServiceValidationError('Service description cannot exceed 200 characters.');
      return;
    }
    const priceNum = Number(servicePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setServiceValidationError('Price must be a valid positive number or zero.');
      return;
    }
    const durationNum = Number(serviceDuration);
    if (isNaN(durationNum) || !Number.isInteger(durationNum) || durationNum < 1 || durationNum > 480) {
      setServiceValidationError('Duration must be a positive integer between 1 and 480 minutes.');
      return;
    }
    // Duplicate check
    const isDuplicate = servicesList.some(s => s.service_name.toLowerCase().trim() === serviceName.toLowerCase().trim());
    if (isDuplicate) {
      setServiceValidationError(`A service with the name "${serviceName}" already exists in this salon.`);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
          service_name: serviceName.trim(),
          description: serviceDesc.trim(),
          duration_minutes: durationNum,
          price: priceNum,
          status: 'active',
          gender: serviceGender
        })
      });
      if (res.ok) {
        const data = await res.json();
        setServicesList([...servicesList, data.service]);
        setServiceName(''); setServiceDesc(''); setServiceDuration(''); setServicePrice(''); setServiceGender('both');
        setServiceSuccessMessage('Service added successfully.');
      } else {
        const text = await res.text();
        setServiceValidationError(`Error adding service: ${text}`);
      }
    } catch (err) {
      console.error("Add service error:", err);
      setServiceValidationError('Network error: ' + err.message);
    }
  };

  const handleEditServiceClick = (s) => {
    setServiceValidationError('');
    setServiceSuccessMessage('');
    setEditingServiceId(s.id);
    setEditServiceName(s.service_name);
    setEditServiceDesc(s.description || '');
    setEditServiceDuration(s.duration_minutes);
    setEditServicePrice(s.price);
    setEditServiceStatus(s.status || 'active');
    setEditServiceGender(s.gender || 'both');
  };

  const handleUpdateService = async (id) => {
    setServiceValidationError('');
    setServiceSuccessMessage('');

    // Validations
    if (!editServiceName || editServiceName.trim().length === 0) {
      setServiceValidationError('Service name is required.');
      return;
    }
    if (editServiceName.length > 100) {
      setServiceValidationError('Service name cannot exceed 100 characters.');
      return;
    }
    if (editServiceDesc && editServiceDesc.length > 200) {
      setServiceValidationError('Service description cannot exceed 200 characters.');
      return;
    }
    const priceNum = Number(editServicePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setServiceValidationError('Price must be a valid positive number or zero.');
      return;
    }
    const durationNum = Number(editServiceDuration);
    if (isNaN(durationNum) || !Number.isInteger(durationNum) || durationNum < 1 || durationNum > 480) {
      setServiceValidationError('Duration must be a positive integer between 1 and 480 minutes.');
      return;
    }
    // Duplicate check excluding current service
    const isDuplicate = servicesList.some(s => s.id !== id && s.service_name.toLowerCase().trim() === editServiceName.toLowerCase().trim());
    if (isDuplicate) {
      setServiceValidationError(`A service with the name "${editServiceName}" already exists in this salon.`);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
          service_name: editServiceName.trim(),
          description: editServiceDesc.trim(),
          duration_minutes: durationNum,
          price: priceNum,
          status: editServiceStatus,
          gender: editServiceGender
        })
      });
      if (res.ok) {
        const data = await res.json();
        setServicesList(servicesList.map(s => s.id === id ? data.service : s));
        setEditingServiceId(null);
        setServiceSuccessMessage('Service updated successfully.');
      } else {
        const text = await res.text();
        setServiceValidationError(`Error updating service: ${text}`);
      }
    } catch (err) {
      console.error("Update service error:", err);
      setServiceValidationError('Network error: ' + err.message);
    }
  };

  const handleDeleteService = async (id) => {
    setServiceValidationError('');
    setServiceSuccessMessage('');
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        setServicesList(servicesList.filter(s => s.id !== id));
        setServiceSuccessMessage('Service deleted successfully.');
      } else {
        const text = await res.text();
        setServiceValidationError(`Error deleting service: ${text}`);
      }
    } catch (err) {
      console.error("Delete service error:", err);
      setServiceValidationError('Network error: ' + err.message);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!activeSalon) return;
    setEmployeeValidationError('');
    setEmployeeSuccessMessage('');

    // Validations
    if (!empName || empName.trim().length === 0) {
      setEmployeeValidationError('Employee name is required.');
      return;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(empName)) {
      setEmployeeValidationError('Employee name must consist of characters only.');
      return;
    }
    if (empName.length > 50) {
      setEmployeeValidationError('Employee name cannot exceed 50 characters.');
      return;
    }
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!empPhone || !phoneRegex.test(empPhone)) {
      setEmployeeValidationError('Employee phone number must be between 10 and 15 digits (spaces, +, -, and parentheses allowed).');
      return;
    }
    if (!empRole || empRole.trim().length === 0) {
      setEmployeeValidationError('Role is required.');
      return;
    }
    const expNum = Number(empExp);
    if (isNaN(expNum) || !Number.isInteger(expNum) || expNum < 0) {
      setEmployeeValidationError('Experience must be a valid positive integer (years).');
      return;
    }
    // Duplicate phone check
    const isDuplicatePhone = employeesList.some(emp => emp.phone.trim() === empPhone.trim());
    if (isDuplicatePhone) {
      setEmployeeValidationError(`An employee with the phone number "${empPhone}" already exists.`);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/salons/${activeSalon.id}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
          name: empName.trim(),
          phone: empPhone.trim(),
          role: empRole.trim(),
          experience: expNum
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEmployeesList([...employeesList, data.employee]);
        setEmpName(''); setEmpPhone(''); setEmpRole(''); setEmpExp('');
        setEmployeeSuccessMessage('Employee added successfully.');
      } else {
        const text = await res.text();
        setEmployeeValidationError(`Error adding employee: ${text}`);
      }
    } catch (err) {
      console.error("Add employee error:", err);
      setEmployeeValidationError('Network error: ' + err.message);
    }
  };

  const handleEditEmployeeClick = (e) => {
    setEmployeeValidationError('');
    setEmployeeSuccessMessage('');
    setEditingEmployeeId(e.id);
    setEditEmpName(e.name);
    setEditEmpPhone(e.phone);
    setEditEmpRole(e.role);
    setEditEmpExp(e.experience);
  };

  const handleUpdateEmployee = async (id) => {
    setEmployeeValidationError('');
    setEmployeeSuccessMessage('');

    // Validations
    if (!editEmpName || editEmpName.trim().length === 0) {
      setEmployeeValidationError('Employee name is required.');
      return;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(editEmpName)) {
      setEmployeeValidationError('Employee name must consist of characters only.');
      return;
    }
    if (editEmpName.length > 50) {
      setEmployeeValidationError('Employee name cannot exceed 50 characters.');
      return;
    }
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!editEmpPhone || !phoneRegex.test(editEmpPhone)) {
      setEmployeeValidationError('Employee phone number must be between 10 and 15 digits (spaces, +, -, and parentheses allowed).');
      return;
    }
    if (!editEmpRole || editEmpRole.trim().length === 0) {
      setEmployeeValidationError('Role is required.');
      return;
    }
    const expNum = Number(editEmpExp);
    if (isNaN(expNum) || !Number.isInteger(expNum) || expNum < 0) {
      setEmployeeValidationError('Experience must be a valid positive integer (years).');
      return;
    }
    // Duplicate phone check excluding current employee
    const isDuplicatePhone = employeesList.some(emp => emp.id !== id && emp.phone.trim() === editEmpPhone.trim());
    if (isDuplicatePhone) {
      setEmployeeValidationError(`An employee with the phone number "${editEmpPhone}" already exists.`);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
          name: editEmpName.trim(),
          phone: editEmpPhone.trim(),
          role: editEmpRole.trim(),
          experience: expNum
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEmployeesList(employeesList.map(emp => emp.id === id ? data.employee : emp));
        setEditingEmployeeId(null);
        setEmployeeSuccessMessage('Employee updated successfully.');
      } else {
        const text = await res.text();
        setEmployeeValidationError(`Error updating employee: ${text}`);
      }
    } catch (err) {
      console.error("Update employee error:", err);
      setEmployeeValidationError('Network error: ' + err.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    setEmployeeValidationError('');
    setEmployeeSuccessMessage('');
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        setEmployeesList(employeesList.filter(emp => emp.id !== id));
        setEmployeeSuccessMessage('Employee deleted successfully.');
      } else {
        const text = await res.text();
        setEmployeeValidationError(`Error deleting employee: ${text}`);
      }
    } catch (err) {
      console.error("Delete employee error:", err);
      setEmployeeValidationError('Network error: ' + err.message);
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
    <div className="owner-portal-wrapper">
      <style>{`
        .owner-portal-wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 50%, #f7f3ed 0%, #e8e0d5 100%);
          color: #2a251e;
          font-family: 'Montserrat', sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .owner-portal-wrapper::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(207, 168, 86, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
          top: 10%;
          left: 10%;
          pointer-events: none;
          z-index: 0;
        }
        .owner-portal-wrapper::after {
          content: '';
          position: absolute;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(207, 168, 86, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
          bottom: 10%;
          right: 10%;
          pointer-events: none;
          z-index: 0;
        }
        .owner-topbar {
          background-color: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(184, 145, 57, 0.18);
          position: relative;
          z-index: 2;
        }
        .owner-brand-logo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          cursor: pointer;
        }
        .owner-brand-title {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 2px;
          line-height: 1;
        }
        .owner-brand-subtitle {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 6px;
          margin-top: 5px;
          color: #cfa856;
          text-transform: uppercase;
        }
        .logout-btn-wrapper .secondary-action-btn {
          background: transparent;
          border: 1px solid rgba(207, 168, 86, 0.4);
          color: #cfa856;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .logout-btn-wrapper .secondary-action-btn:hover {
          background: #cfa856;
          color: #000;
          box-shadow: 0 0 15px rgba(207, 168, 86, 0.2);
        }
        .dashboard-main-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 50px 20px;
          position: relative;
          z-index: 1;
        }
        .dashboard-header-block {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 45px;
          flex-wrap: wrap;
          gap: 20px;
        }
        .dashboard-title-area h1 {
          font-family: 'Playfair Display', serif;
          font-size: 38px;
          color: #1a1612;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .dashboard-title-area p {
          font-size: 13px;
          color: #888;
          letter-spacing: 1px;
        }
        .primary-cta-btn {
          background: linear-gradient(135deg, #cfa856 0%, #aa8c2c 100%);
          color: #000;
          border: none;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(207, 168, 86, 0.2);
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .primary-cta-btn:hover {
          background: linear-gradient(135deg, #e8c678 0%, #cfa856 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(207, 168, 86, 0.35);
        }
        .salon-row-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(184, 145, 57, 0.22);
          border-radius: 16px;
          display: flex;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          margin-bottom: 30px;
        }
        .salon-row-card:hover {
          transform: translateY(-4px);
          border-color: rgba(207, 168, 86, 0.35);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(207, 168, 86, 0.05);
        }
        @media (max-width: 768px) {
          .salon-row-card {
            flex-direction: column;
          }
        }
        .salon-cover-visual {
          width: 35%;
          min-width: 250px;
          position: relative;
          overflow: hidden;
          background-size: cover;
          background-position: center;
          border-right: 1px solid rgba(207, 168, 86, 0.15);
        }
        @media (max-width: 768px) {
          .salon-cover-visual {
            width: 100%;
            height: 200px;
            border-right: none;
            border-bottom: 1px solid rgba(207, 168, 86, 0.15);
          }
        }
        .salon-cover-visual::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%);
        }
        @media (max-width: 768px) {
          .salon-cover-visual::before {
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%);
          }
        }
        .salon-logo-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 70px;
          height: 70px;
          border-radius: 12px;
          border: 2px solid #cfa856;
          background: #000;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .salon-row-details {
          flex: 1;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .salon-row-details h2 {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #cfa856;
          margin-bottom: 15px;
        }
        .salon-meta-group {
          margin-bottom: 25px;
        }
        .salon-meta-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: #555;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .salon-meta-item svg {
          color: #cfa856;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .salon-description-box {
          font-size: 13px;
          color: #888;
          line-height: 1.6;
          margin-top: 10px;
          border-left: 2px solid rgba(207, 168, 86, 0.3);
          padding-left: 12px;
          font-style: italic;
        }
        .btn-toolbar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .owner-outline-btn {
          background: transparent;
          border: 1px solid rgba(184, 145, 57, 0.4);
          color: #8e722a;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .owner-outline-btn:hover {
          border-color: #cfa856;
          color: #cfa856;
          background: rgba(207, 168, 86, 0.05);
        }
        .owner-danger-btn {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .owner-danger-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: #f87171;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.15);
        }
        .config-panel-container {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(184, 145, 57, 0.22);
          border-radius: 16px;
          overflow: hidden;
          margin-top: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .config-tabs-bar {
          display: flex;
          background: rgba(255, 255, 255, 0.4);
          border-bottom: 1px solid rgba(184, 145, 57, 0.18);
          flex-wrap: wrap;
        }
        .config-tab-item {
          padding: 18px 24px;
          font-size: 13px;
          font-weight: 600;
          color: #888;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .config-tab-item:hover {
          color: #8e722a;
          background: rgba(184, 145, 57, 0.05);
        }
        .config-tab-item.active {
          color: #cfa856;
          border-bottom-color: #cfa856;
          background: rgba(184, 145, 57, 0.1);
        }
        .config-tab-content {
          padding: 30px;
        }
        .tab-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          border-bottom: 1px solid rgba(184, 145, 57, 0.18);
          padding-bottom: 15px;
        }
        .tab-title-row h3 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #cfa856;
          margin: 0;
        }
        .tab-grid-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 25px;
          background: rgba(255, 255, 255, 0.4);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(184, 145, 57, 0.18);
        }
        .form-row-flex {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
          background: rgba(255, 255, 255, 0.4);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(184, 145, 57, 0.18);
          flex-wrap: wrap;
        }
        .owner-form-input {
          flex: 1;
          min-width: 200px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(184, 145, 57, 0.25);
          border-radius: 8px;
          color: #1a1612;
          font-size: 14px;
          transition: all 0.3s;
        }
        .owner-form-input:focus {
          outline: none;
          border-color: #cfa856;
          box-shadow: 0 0 0 3px rgba(207, 168, 86, 0.15);
          background: rgba(255, 255, 255, 0.8);
        }
        .owner-form-select {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(184, 145, 57, 0.25);
          border-radius: 8px;
          color: #1a1612;
          font-size: 14px;
          cursor: pointer;
          min-width: 150px;
        }
        .owner-form-select:focus {
          outline: none;
          border-color: #cfa856;
        }
        .owner-add-btn {
          background: linear-gradient(135deg, #cfa856 0%, #aa8c2c 100%);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s;
        }
        .owner-add-btn:hover {
          background: linear-gradient(135deg, #e8c678 0%, #cfa856 100%);
          box-shadow: 0 4px 15px rgba(207, 168, 86, 0.25);
        }
        .items-listing-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .item-list-row {
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(184, 145, 57, 0.18);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s;
        }
        .item-list-row:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(184, 145, 57, 0.4);
        }
        .item-row-info h4 {
          font-size: 15px;
          font-weight: 600;
          color: #1a1612;
          margin-bottom: 4px;
        }
        .item-row-info p {
          font-size: 12px;
          color: #555;
        }
        .item-action-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .status-badge-custom {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 4px 8px;
          border-radius: 4px;
          background: rgba(184, 145, 57, 0.1);
          color: #8e722a;
        }
        .status-badge-custom.active {
          background: rgba(16, 185, 129, 0.08);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }
        .appt-card {
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(184, 145, 57, 0.18);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          transition: all 0.3s;
        }
        .appt-card:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(184, 145, 57, 0.4);
        }
        .appt-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(184, 145, 57, 0.18);
          padding-bottom: 10px;
        }
        .appt-time-info {
          font-size: 13px;
          font-weight: 700;
          color: #cfa856;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .appt-details-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .appt-details-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }
        .appt-col-left {
          border-right: 1px solid rgba(184, 145, 57, 0.18);
          padding-right: 15px;
        }
        @media (max-width: 600px) {
          .appt-col-left {
            border-right: none;
            padding-right: 0;
          }
        }
        .appt-col-right {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .appt-detail-text {
          font-size: 13px;
          color: #555;
          margin-bottom: 6px;
          line-height: 1.4;
        }
        .appt-detail-text strong {
          color: #1a1612;
        }
        .register-form-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(184, 145, 57, 0.22);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.05);
          max-width: 850px;
          margin: 0 auto;
          animation: slideUp 0.4s ease;
        }
        .form-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .form-grid-layout {
            grid-template-columns: 1fr;
          }
        }
        .form-full-width {
          grid-column: 1 / -1;
        }
        .form-label-txt {
          display: block;
          font-size: 12px;
          color: #aaa;
          margin-bottom: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .hours-row-item {
          display: grid;
          grid-template-columns: 120px 1.2fr 1.2fr auto;
          gap: 15px;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(184, 145, 57, 0.18);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        @media (max-width: 600px) {
          .hours-row-item {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 15px;
          }
        }
        .custom-switch-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #555;
          font-size: 13px;
          cursor: pointer;
        }
        .custom-switch-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #cfa856;
          cursor: pointer;
        }
        .form-btn-row {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .file-upload-input {
          padding: 8px 0;
          color: #aaa;
          font-size: 13px;
          cursor: pointer;
        }
        .empty-state-text {
          color: #888;
          text-align: center;
          margin-top: 40px;
          font-size: 16px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.4);
          border: 1px dashed rgba(184, 145, 57, 0.3);
          border-radius: 12px;
        }
      `}</style>

      <header className="owner-topbar">
        <div className="owner-brand-logo" onClick={() => setCurrentView('home')}>
          <span className="owner-brand-title">LOOKS</span>
          <span className="owner-brand-subtitle">S A L O N</span>
        </div>
        <div className="logout-btn-wrapper">
          <button className="secondary-action-btn" onClick={() => {
            setCurrentView('home');
            setSalons([]);
            setIsCreatingSalon(false);
            setAuthToken('');
            setIsConfiguring(false);
          }}>
            <OwnerIcon name="logout" size={14} />
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-main-container">

        <div className="dashboard-header-block">
          <div className="dashboard-title-area">
            <h1>Owner Dashboard</h1>
            <p>Portfolio: {salons.length} of {maxSalons} salons registered</p>
          </div>
          {salons.length < maxSalons && !isCreatingSalon && !isEditingSalon && (
            <button className="primary-cta-btn" onClick={() => setIsCreatingSalon(true)}>
              <OwnerIcon name="plus" size={16} />
              Register New Salon
            </button>
          )}
        </div>

        {isCreatingSalon && salons.length < maxSalons ? (
          <div className="register-form-card">
            <div style={{ marginBottom: '30px', borderBottom: '1px solid rgba(184, 145, 57, 0.18)', paddingBottom: '15px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: '#cfa856', margin: 0 }}>Register New Salon</h2>
              <p style={{ fontSize: '13px', color: '#888', margin: '5px 0 0 0' }}>Provide the details below to publish your salon listing.</p>
            </div>

            {createError && <div className="error-message">{createError}</div>}

            <form onSubmit={handleCreateSalon}>
              <div className="form-grid-layout">
                <div className="form-group form-full-width">
                  <label className="form-label-txt">Salon Name</label>
                  <input type="text" name="name" className="owner-form-input" required value={salonData.name} onChange={handleSalonDataChange} placeholder="e.g. Looks Elite Salon" />
                  {validationErrors.name && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">Phone Number</label>
                  <input type="tel" name="phoneNumber" className="owner-form-input" required value={salonData.phoneNumber} onChange={handleSalonDataChange} placeholder="e.g. 9876543210" />
                  {validationErrors.phoneNumber && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.phoneNumber}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">Pincode</label>
                  <input type="text" name="pincode" className="owner-form-input" required value={salonData.pincode} onChange={handleSalonDataChange} placeholder="e.g. 576201" />
                  {validationErrors.pincode && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.pincode}</div>}
                </div>

                <div className="form-group form-full-width">
                  <label className="form-label-txt">Address</label>
                  <input type="text" name="address" className="owner-form-input" required value={salonData.address} onChange={handleSalonDataChange} placeholder="e.g. 1st Cross, MG Road" />
                  {validationErrors.address && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.address}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">City</label>
                  <input type="text" name="city" className="owner-form-input" required value={salonData.city} onChange={handleSalonDataChange} placeholder="e.g. Kundapur" />
                  {validationErrors.city && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.city}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">State</label>
                  <input type="text" name="state" className="owner-form-input" required value={salonData.state} onChange={handleSalonDataChange} placeholder="e.g. Karnataka" />
                  {validationErrors.state && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.state}</div>}
                </div>

                <div className="form-group form-full-width">
                  <label className="form-label-txt" style={{ marginBottom: '12px' }}>Operating Hours</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255, 255, 255, 0.4)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(184, 145, 57, 0.18)' }}>
                    {Object.keys(operatingHours).map(day => (
                      <div key={day} className="hours-scheduler-item hours-row-item">
                        <span style={{ textTransform: 'capitalize', color: operatingHours[day].closed ? '#888' : '#1a1612', fontWeight: '700', fontSize: '13px' }}>{day}</span>
                        <select className="owner-form-select" disabled={operatingHours[day].closed} value={operatingHours[day].open} onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)} style={{ opacity: operatingHours[day].closed ? 0.3 : 1 }}>
                          {timeOptions.map(opt => <option key={`open-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <select className="owner-form-select" disabled={operatingHours[day].closed} value={operatingHours[day].close} onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)} style={{ opacity: operatingHours[day].closed ? 0.3 : 1 }}>
                          {timeOptions.map(opt => <option key={`close-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <label className="custom-switch-label">
                          <input type="checkbox" className="custom-switch-checkbox" checked={operatingHours[day].closed} onChange={(e) => handleOperatingHoursChange(day, 'closed', e.target.checked)} />
                          Closed
                        </label>
                      </div>
                    ))}
                  </div>
                  {validationErrors.operatingHours && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.operatingHours}</div>}
                </div>

                <div className="form-group form-full-width">
                  <label className="form-label-txt">Description</label>
                  <textarea name="description" className="owner-form-input" style={{ resize: 'vertical', minHeight: '80px' }} rows="3" value={salonData.description} onChange={handleSalonDataChange} placeholder="Describe the ambiance, services, and specialties of your salon..." />
                  {validationErrors.description && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.description}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">Salon Logo</label>
                  <input type="file" name="logo" className="file-upload-input" onChange={handleFileChange} accept="image/*" />
                  {validationErrors.logo && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.logo}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">Banner Image</label>
                  <input type="file" name="banner" className="file-upload-input" onChange={handleFileChange} accept="image/*" />
                  {validationErrors.banner && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.banner}</div>}
                </div>

                <div className="form-group form-full-width form-btn-row">
                  <button type="submit" className="primary-cta-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={createLoading}>
                    <OwnerIcon name="check" size={16} />
                    {createLoading ? 'Registering Salon...' : 'Register Salon'}
                  </button>
                  <button type="button" className="owner-outline-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsCreatingSalon(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : isEditingSalon && salons.length > 0 ? (
          <div className="register-form-card">
            <div style={{ marginBottom: '30px', borderBottom: '1px solid rgba(184, 145, 57, 0.18)', paddingBottom: '15px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: '#cfa856', margin: 0 }}>Edit Salon Details</h2>
              <p style={{ fontSize: '13px', color: '#888', margin: '5px 0 0 0' }}>Modify the details of your registered salon.</p>
            </div>

            {updateError && <div className="error-message">{updateError}</div>}

            <form onSubmit={handleUpdateSalon}>
              <div className="form-grid-layout">
                <div className="form-group form-full-width">
                  <label className="form-label-txt">Salon Name</label>
                  <input type="text" name="name" className="owner-form-input" required value={salonData.name} onChange={handleSalonDataChange} />
                  {validationErrors.name && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">Phone Number</label>
                  <input type="tel" name="phoneNumber" className="owner-form-input" required value={salonData.phoneNumber} onChange={handleSalonDataChange} />
                  {validationErrors.phoneNumber && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.phoneNumber}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">Pincode</label>
                  <input type="text" name="pincode" className="owner-form-input" required value={salonData.pincode} onChange={handleSalonDataChange} />
                  {validationErrors.pincode && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.pincode}</div>}
                </div>

                <div className="form-group form-full-width">
                  <label className="form-label-txt">Address</label>
                  <input type="text" name="address" className="owner-form-input" required value={salonData.address} onChange={handleSalonDataChange} />
                  {validationErrors.address && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.address}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">City</label>
                  <input type="text" name="city" className="owner-form-input" required value={salonData.city} onChange={handleSalonDataChange} />
                  {validationErrors.city && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.city}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">State</label>
                  <input type="text" name="state" className="owner-form-input" required value={salonData.state} onChange={handleSalonDataChange} />
                  {validationErrors.state && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.state}</div>}
                </div>

                <div className="form-group form-full-width">
                  <label className="form-label-txt" style={{ marginBottom: '12px' }}>Operating Hours</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255, 255, 255, 0.4)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(184, 145, 57, 0.18)' }}>
                    {Object.keys(operatingHours).map(day => (
                      <div key={day} className="hours-row-item">
                        <span style={{ textTransform: 'capitalize', color: operatingHours[day].closed ? '#888' : '#1a1612', fontWeight: '700', fontSize: '13px' }}>{day}</span>
                        <select className="owner-form-select" disabled={operatingHours[day].closed} value={operatingHours[day].open} onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)} style={{ opacity: operatingHours[day].closed ? 0.3 : 1 }}>
                          {timeOptions.map(opt => <option key={`open-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <select className="owner-form-select" disabled={operatingHours[day].closed} value={operatingHours[day].close} onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)} style={{ opacity: operatingHours[day].closed ? 0.3 : 1 }}>
                          {timeOptions.map(opt => <option key={`close-${opt.value}`} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <label className="custom-switch-label">
                          <input type="checkbox" className="custom-switch-checkbox" checked={operatingHours[day].closed} onChange={(e) => handleOperatingHoursChange(day, 'closed', e.target.checked)} />
                          Closed
                        </label>
                      </div>
                    ))}
                  </div>
                  {validationErrors.operatingHours && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.operatingHours}</div>}
                </div>

                <div className="form-group form-full-width">
                  <label className="form-label-txt">Description</label>
                  <textarea name="description" className="owner-form-input" style={{ resize: 'vertical', minHeight: '80px' }} rows="3" value={salonData.description} onChange={handleSalonDataChange} />
                  {validationErrors.description && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.description}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">Salon Logo (Leave blank to keep current)</label>
                  <input type="file" name="logo" className="file-upload-input" onChange={handleFileChange} accept="image/*" />
                  {validationErrors.logo && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.logo}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label-txt">Banner Image (Leave blank to keep current)</label>
                  <input type="file" name="banner" className="file-upload-input" onChange={handleFileChange} accept="image/*" />
                  {validationErrors.banner && <div className="field-error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{validationErrors.banner}</div>}
                </div>

                <div className="form-group form-full-width form-btn-row">
                  <button type="submit" className="primary-cta-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={updateLoading}>
                    <OwnerIcon name="save" size={16} />
                    {updateLoading ? 'Updating Salon...' : 'Save Changes'}
                  </button>
                  <button type="button" className="owner-outline-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsEditingSalon(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : salons.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {salons.map(salon => {
              const hasValidBanner = salon.bannerUrl && salon.bannerUrl !== 'null' && salon.bannerUrl !== 'undefined' && salon.bannerUrl.trim() !== '';
              const bgImg = hasValidBanner ? salon.bannerUrl : '/luxury-salon-card.png';

              return (
                <div key={salon.id}>
                  <div className="salon-row-card" style={{ border: selectedSalonId === salon.id ? '1px solid var(--gold-accent, #cfa856)' : '1px solid rgba(184, 145, 57, 0.18)' }}>
                    <div className="salon-cover-visual" style={{ backgroundImage: `url(${bgImg})` }}>
                      <div className="salon-logo-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {salon.logoUrl ? (
                          <img src={salon.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{
                            color: '#cfa856',
                            fontSize: '20px',
                            fontWeight: '700',
                            fontFamily: "'Playfair Display', serif",
                            letterSpacing: '1px'
                          }}>
                            {salon.name ? salon.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'LS'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="salon-row-details">
                      <div>
                        <h2>{salon.name}</h2>
                        <div className="salon-meta-group">
                          <div className="salon-meta-item">
                            <OwnerIcon name="map-pin" size={15} />
                            <span>{salon.address}, {salon.city}, {salon.state} - {salon.pincode}</span>
                          </div>
                          <div className="salon-meta-item">
                            <OwnerIcon name="phone" size={15} />
                            <span>{salon.phoneNumber}</span>
                          </div>
                          {salon.description && (
                            <p className="salon-description-box">
                              "{salon.description}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="btn-toolbar">
                        <button className="primary-cta-btn" onClick={() => {
                          setSelectedSalonId(salon.id);
                          if (selectedSalonId === salon.id && isConfiguring) setIsConfiguring(false);
                          else setIsConfiguring(true);
                        }}>
                          <OwnerIcon name="settings" size={14} style={{ stroke: '#000' }} />
                          {isConfiguring && selectedSalonId === salon.id ? 'Close Panel' : 'Configure Salon'}
                        </button>

                        <button className="owner-outline-btn" onClick={() => { setSelectedSalonId(salon.id); handleEditSalonClick(); }}>
                          <OwnerIcon name="edit" size={14} />
                          Edit Details
                        </button>

                        <button className="owner-danger-btn" onClick={() => { setSelectedSalonId(salon.id); handleDeleteSalon(); }}>
                          <OwnerIcon name="trash" size={14} />
                          Delete Salon
                        </button>
                      </div>
                    </div>
                  </div>

                  {isConfiguring && selectedSalonId === salon.id && (
                    <div className="config-panel-container">
                      <div className="config-tabs-bar">
                        <div className={`config-tab-item ${configTab === 'seats' ? 'active' : ''}`} onClick={() => setConfigTab('seats')}>
                          <OwnerIcon name="user" size={14} /> Seats
                        </div>
                        <div className={`config-tab-item ${configTab === 'services' ? 'active' : ''}`} onClick={() => setConfigTab('services')}>
                          <OwnerIcon name="sparkles" size={14} /> Services
                        </div>
                        <div className={`config-tab-item ${configTab === 'employees' ? 'active' : ''}`} onClick={() => setConfigTab('employees')}>
                          <OwnerIcon name="settings" size={14} /> Employees
                        </div>
                        <div className={`config-tab-item ${configTab === 'appointments' ? 'active' : ''}`} onClick={() => setConfigTab('appointments')}>
                          <OwnerIcon name="calendar" size={14} /> Appointments
                        </div>
                        <div className={`config-tab-item ${configTab === 'callbacks' ? 'active' : ''}`} onClick={() => setConfigTab('callbacks')}>
                          <OwnerIcon name="phone" size={14} /> Callbacks
                        </div>
                      </div>

                      <div className="config-tab-content">
                        {configTab === 'seats' && (
                          <div>
                            <div className="tab-title-row">
                              <h3>Manage Styling Seats</h3>
                            </div>
                            {seatValidationError && <div className="error-message" style={{ marginBottom: '15px' }}>{seatValidationError}</div>}
                            {seatSuccessMessage && <div className="success-message" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>{seatSuccessMessage}</div>}
                            <form onSubmit={handleAddSeat} className="form-row-flex">
                              <input type="text" placeholder="Seat Name (e.g. Chair 1)" className="owner-form-input" value={seatName} onChange={e => setSeatName(e.target.value)} required />
                              <input type="text" placeholder="Short Description / Area" className="owner-form-input" style={{ flex: 2 }} value={seatDesc} onChange={e => setSeatDesc(e.target.value)} />
                              <button type="submit" className="owner-add-btn">
                                <OwnerIcon name="plus" size={14} /> Add Seat
                              </button>
                            </form>
                            <div className="items-listing-stack">
                              {seatsList.map((s, i) => (
                                <div key={i} className="item-list-row">
                                  {editingSeatId === s.id ? (
                                    <div style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}>
                                      <input type="text" className="owner-form-input" value={editSeatName} onChange={e => setEditSeatName(e.target.value)} style={{ flex: 1 }} />
                                      <input type="text" className="owner-form-input" value={editSeatDesc} onChange={e => setEditSeatDesc(e.target.value)} style={{ flex: 2 }} />
                                      <button onClick={() => handleUpdateSeat(s.id)} className="owner-add-btn">Save</button>
                                      <button onClick={() => setEditingSeatId(null)} className="owner-outline-btn">Cancel</button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="item-row-info">
                                        <h4>{s.name}</h4>
                                        <p>{s.description || 'No description'}</p>
                                      </div>
                                      <div className="item-action-group">
                                        <span className={`status-badge-custom ${s.isActive ? 'active' : ''}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                                        <button onClick={() => handleEditClick(s)} className="owner-outline-btn" style={{ padding: '6px 12px', fontSize: '11px' }}>Edit</button>
                                        <button onClick={() => handleDeleteSeat(s.id)} className="owner-danger-btn" style={{ padding: '6px 12px', fontSize: '11px' }}>Delete</button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                              {seatsList.length === 0 && <p className="empty-state-text">No styling seats configured yet. Create one above.</p>}
                            </div>
                          </div>
                        )}

                        {configTab === 'services' && (
                          <div>
                            <div className="tab-title-row">
                              <h3>Manage Service Catalog</h3>
                            </div>
                            {serviceValidationError && <div className="error-message" style={{ marginBottom: '15px' }}>{serviceValidationError}</div>}
                            {serviceSuccessMessage && <div className="success-message" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>{serviceSuccessMessage}</div>}
                            <form onSubmit={handleAddService} className="tab-grid-form">
                              <div className="input-group">
                                <label className="form-label-txt">Service Name</label>
                                <input type="text" placeholder="e.g. Premium Haircut" className="owner-form-input" value={serviceName} onChange={e => setServiceName(e.target.value)} required />
                              </div>
                              <div className="input-group">
                                <label className="form-label-txt">Price (₹)</label>
                                <input type="number" placeholder="e.g. 500" className="owner-form-input" value={servicePrice} onChange={e => setServicePrice(e.target.value)} required />
                              </div>
                              <div className="input-group">
                                <label className="form-label-txt">Duration (Minutes)</label>
                                <input type="number" placeholder="e.g. 45" className="owner-form-input" value={serviceDuration} onChange={e => setServiceDuration(e.target.value)} required />
                              </div>
                              <div className="input-group">
                                <label className="form-label-txt">Gender Target</label>
                                <select className="owner-form-select" style={{ width: '100%', height: '47px' }} value={serviceGender} onChange={e => setServiceGender(e.target.value)} required>
                                  <option value="both">Both (Unisex)</option>
                                  <option value="male">Male Only</option>
                                  <option value="female">Female Only</option>
                                </select>
                              </div>
                              <div className="input-group form-full-width">
                                <label className="form-label-txt">Description</label>
                                <input type="text" placeholder="e.g. Wash, condition, haircut and blow dry styling included" className="owner-form-input" value={serviceDesc} onChange={e => setServiceDesc(e.target.value)} />
                              </div>
                              <button type="submit" className="owner-add-btn form-full-width" style={{ marginTop: '10px' }}>
                                <OwnerIcon name="plus" size={14} /> Add Service
                              </button>
                            </form>
                            <div className="items-listing-stack">
                              {servicesList.map((s, i) => (
                                <div key={i} className="item-list-row">
                                  {editingServiceId === s.id ? (
                                    <div style={{ display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap', flexDirection: 'column' }}>
                                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <input type="text" className="owner-form-input" value={editServiceName} onChange={e => setEditServiceName(e.target.value)} placeholder="Service Name" style={{ flex: 2 }} />
                                        <input type="number" className="owner-form-input" value={editServicePrice} onChange={e => setEditServicePrice(e.target.value)} placeholder="Price" style={{ flex: 0.5 }} />
                                        <input type="number" className="owner-form-input" value={editServiceDuration} onChange={e => setEditServiceDuration(e.target.value)} placeholder="Duration" style={{ flex: 0.5 }} />
                                        <select className="owner-form-select" value={editServiceGender} onChange={e => setEditServiceGender(e.target.value)} style={{ height: '47px' }}>
                                          <option value="both">Both</option>
                                          <option value="male">Male</option>
                                          <option value="female">Female</option>
                                        </select>
                                      </div>
                                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <input type="text" className="owner-form-input" value={editServiceDesc} onChange={e => setEditServiceDesc(e.target.value)} placeholder="Description" style={{ flex: 2 }} />
                                        <select className="owner-form-select" value={editServiceStatus} onChange={e => setEditServiceStatus(e.target.value)} style={{ height: '47px' }}>
                                          <option value="active">Active</option>
                                          <option value="inactive">Inactive</option>
                                        </select>
                                        <button onClick={() => handleUpdateService(s.id)} className="owner-add-btn">Save</button>
                                        <button onClick={() => setEditingServiceId(null)} className="owner-outline-btn">Cancel</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="item-row-info">
                                        <h4>{s.service_name} <span style={{ color: '#cfa856', marginLeft: '8px' }}>₹{s.price}</span></h4>
                                        <p>{s.duration_minutes} Mins • Target: <span style={{ textTransform: 'capitalize' }}>{s.gender || 'both'}</span> • {s.description || 'No description'}</p>
                                      </div>
                                      <div className="item-action-group">
                                        <span className={`status-badge-custom ${s.status === 'active' ? 'active' : ''}`}>{s.status}</span>
                                        <button onClick={() => handleEditServiceClick(s)} className="owner-outline-btn" style={{ padding: '6px 12px', fontSize: '11px' }}>Edit</button>
                                        <button onClick={() => handleDeleteService(s.id)} className="owner-danger-btn" style={{ padding: '6px 12px', fontSize: '11px' }}>Delete</button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                              {servicesList.length === 0 && <p className="empty-state-text">No services registered. Publish your first service above.</p>}
                            </div>
                          </div>
                        )}

                        {configTab === 'employees' && (
                          <div>
                            <div className="tab-title-row">
                              <h3>Manage Salon Employees</h3>
                            </div>
                            {employeeValidationError && <div className="error-message" style={{ marginBottom: '15px' }}>{employeeValidationError}</div>}
                            {employeeSuccessMessage && <div className="success-message" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>{employeeSuccessMessage}</div>}
                            <form onSubmit={handleAddEmployee} className="tab-grid-form">
                              <div className="input-group">
                                <label className="form-label-txt">Employee Name</label>
                                <input type="text" placeholder="e.g. Sarah Connor" className="owner-form-input" value={empName} onChange={e => setEmpName(e.target.value)} required />
                              </div>
                              <div className="input-group">
                                <label className="form-label-txt">Phone Number</label>
                                <input type="tel" placeholder="e.g. +91 9900887766" className="owner-form-input" value={empPhone} onChange={e => setEmpPhone(e.target.value)} required />
                              </div>
                              <div className="input-group">
                                <label className="form-label-txt">Role / Title</label>
                                <input type="text" placeholder="e.g. Master Colorist" className="owner-form-input" value={empRole} onChange={e => setEmpRole(e.target.value)} required />
                              </div>
                              <div className="input-group">
                                <label className="form-label-txt">Experience</label>
                                <input type="text" placeholder="e.g. 6 Years" className="owner-form-input" value={empExp} onChange={e => setEmpExp(e.target.value)} required />
                              </div>
                              <button type="submit" className="owner-add-btn form-full-width" style={{ marginTop: '10px' }}>
                                <OwnerIcon name="plus" size={14} /> Add Employee
                              </button>
                            </form>
                            <div className="items-listing-stack">
                              {employeesList.map((emp, i) => (
                                <div key={i} className="item-list-row">
                                  {editingEmployeeId === emp.id ? (
                                    <div style={{ display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap', flexDirection: 'column' }}>
                                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <input type="text" className="owner-form-input" value={editEmpName} onChange={e => setEditEmpName(e.target.value)} placeholder="Name" style={{ flex: 1 }} />
                                        <input type="tel" className="owner-form-input" value={editEmpPhone} onChange={e => setEditEmpPhone(e.target.value)} placeholder="Phone" style={{ flex: 1 }} />
                                      </div>
                                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <input type="text" className="owner-form-input" value={editEmpRole} onChange={e => setEditEmpRole(e.target.value)} placeholder="Role" style={{ flex: 1.5 }} />
                                        <input type="text" className="owner-form-input" value={editEmpExp} onChange={e => setEditEmpExp(e.target.value)} placeholder="Experience" style={{ flex: 1 }} />
                                        <button onClick={() => handleUpdateEmployee(emp.id)} className="owner-add-btn">Save</button>
                                        <button onClick={() => setEditingEmployeeId(null)} className="owner-outline-btn">Cancel</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="item-row-info">
                                        <h4>{emp.name} <span style={{ fontSize: '11px', color: '#cfa856', marginLeft: '10px', background: 'rgba(207, 168, 86, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{emp.role}</span></h4>
                                        <p>📞 Phone: {emp.phone} • Experience: {emp.experience}</p>
                                      </div>
                                      <div className="item-action-group">
                                        <button onClick={() => handleEditEmployeeClick(emp)} className="owner-outline-btn" style={{ padding: '6px 12px', fontSize: '11px' }}>Edit</button>
                                        <button onClick={() => handleDeleteEmployee(emp.id)} className="owner-danger-btn" style={{ padding: '6px 12px', fontSize: '11px' }}>Delete</button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                              {employeesList.length === 0 && <p className="empty-state-text">No employees listed. Add your salon team above.</p>}
                            </div>
                          </div>
                        )}

                        {configTab === 'appointments' && (
                          <div>
                            <div className="tab-title-row" style={{ flexWrap: 'wrap', gap: '15px' }}>
                              <h3>Scheduled Appointments</h3>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <DatePicker
                                  selected={appointmentDateFilter}
                                  onChange={(date) => setAppointmentDateFilter(date)}
                                  customInput={
                                    <input className="owner-form-input" style={{ width: '130px', cursor: 'pointer', margin: 0, padding: '10px 14px' }} />
                                  }
                                  placeholderText="Filter by Date"
                                  dateFormat="yyyy-MM-dd"
                                />
                                {appointmentDateFilter && (
                                  <button onClick={() => setAppointmentDateFilter(null)} className="owner-outline-btn">Clear</button>
                                )}
                                <button onClick={fetchAppointments} className="owner-outline-btn">
                                  Refresh
                                </button>
                              </div>
                            </div>

                            {loadingAppointments ? (
                              <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Loading appointments list...</p>
                            ) : (
                              <div className="items-listing-stack">
                                {filteredAppointments.length > 0 ? filteredAppointments.map((apt, i) => (
                                  <div key={i} className="appt-card">
                                    <div className="appt-header-row">
                                      <div className="appt-time-info">
                                        <OwnerIcon name="clock" size={14} />
                                        <span>
                                          {new Date(apt.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                          {' • '}
                                          {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(apt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                      <span className={`status-badge-custom ${apt.status === 'scheduled' ? 'active' : ''}`}>{apt.status || 'Scheduled'}</span>
                                    </div>

                                    <div className="appt-details-grid">
                                      <div className="appt-col-left">
                                        <div className="appt-detail-text"><strong>Customer:</strong> {apt.customerName} {apt.customerGender ? `(${apt.customerGender})` : ''}</div>
                                        <div className="appt-detail-text"><strong>Phone:</strong> {apt.customerPhone}</div>
                                        {apt.customerEmail && <div className="appt-detail-text"><strong>Email:</strong> {apt.customerEmail}</div>}
                                      </div>
                                      <div className="appt-col-right">
                                        <div className="appt-detail-text"><strong>Styling Seat:</strong> {apt.seat?.name || 'Unassigned'}</div>
                                        <div className="appt-detail-text"><strong>Booked Services:</strong> {apt.services?.map(s => s.service_name).join(', ') || 'N/A'}</div>
                                        <div className="appt-detail-text"><strong>Total Duration:</strong> {apt.services?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0} mins</div>
                                      </div>
                                    </div>
                                  </div>
                                )) : (
                                  <p className="empty-state-text">
                                    {appointmentsList.length > 0 && appointmentDateFilter ? `No appointments found for ${appointmentDateFilter.toLocaleDateString()}.` : 'No appointments scheduled.'}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {configTab === 'callbacks' && (
                          <div>
                            <div className="tab-title-row">
                              <h3>Callback Requests</h3>
                              <button onClick={fetchCallbacks} className="owner-outline-btn">Refresh</button>
                            </div>

                            {loadingCallbacks ? (
                              <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Loading requests...</p>
                            ) : (
                              <div className="items-listing-stack">
                                {callbacksList.length > 0 ? callbacksList.map((cb, i) => (
                                  <div key={i} className="appt-card">
                                    <div className="appt-header-row">
                                      <div className="appt-time-info">
                                        <OwnerIcon name="calendar" size={14} />
                                        <span>
                                          Requested on: {new Date(cb.dateTime).toLocaleDateString()} at {new Date(cb.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                      <span className={`status-badge-custom ${cb.status === 'pending' ? 'active' : ''}`}>{cb.status || 'Pending'}</span>
                                    </div>

                                    <div className="appt-details-grid">
                                      <div className="appt-col-left">
                                        <div className="appt-detail-text"><strong>Requestor Name:</strong> {cb.name}</div>
                                        <div className="appt-detail-text"><strong>Phone Number:</strong> {cb.phoneNumber}</div>
                                        <div className="appt-detail-text"><strong>Email:</strong> {cb.email}</div>
                                      </div>
                                      <div className="appt-col-right">
                                        <div className="appt-detail-text"><strong>Services Desired:</strong> {cb.services}</div>
                                        <div className="appt-detail-text"><strong>Purpose of Call:</strong> {cb.purpose}</div>
                                        {cb.message && <div className="appt-detail-text" style={{ fontStyle: 'italic', background: 'rgba(255, 255, 255, 0.4)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(184, 145, 57, 0.18)' }}><strong>Notes:</strong> {cb.message}</div>}
                                      </div>
                                    </div>
                                  </div>
                                )) : (
                                  <p className="empty-state-text">No callback requests received yet.</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state-text" style={{ padding: '60px 40px', fontSize: '18px' }}>
            <OwnerIcon name="sparkles" size={48} style={{ color: '#cfa856', marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
            You haven't listed any salons yet.
            <button className="primary-cta-btn" style={{ margin: '20px auto 0 auto' }} onClick={() => setIsCreatingSalon(true)}>
              Register Your First Salon
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default OwnerDashboard;
