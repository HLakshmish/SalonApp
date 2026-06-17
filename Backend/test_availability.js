
fetch('http://localhost:3000/api/seats/1/availability?date=2026-06-17')
  .then(r => r.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);

