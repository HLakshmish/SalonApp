
fetch('http://localhost:3000/api/appointments', {
  method: 'POST',
  headers: {
    'accept': '*/*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    salonId: 1,
    seatId: 1,
    serviceIds: [1],
    startTime: '2026-06-17T04:46:50.995Z',
    customerName: 'string',
    customerGender: 'string',
    customerPhone: 'string',
    customerEmail: 'user@example.com',
    customerCity: 'string',
    customerAddress: 'string'
  })
}).then(r => r.json()).then(console.log).catch(console.error);

