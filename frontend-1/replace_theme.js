const fs = require('fs');
const file = 'src/SalonDetails.jsx';
let content = fs.readFileSync(file, 'utf8');

// Global Backgrounds
content = content.replace(/backgroundColor: '#000'/g, "backgroundColor: '#f8f5f2'");
content = content.replace(/color: '#fff', minHeight: '100vh'/g, "color: '#111', minHeight: '100vh'");

// Cards and Containers
content = content.replace(/backgroundColor: '#111'/g, "backgroundColor: '#fff'");
content = content.replace(/backgroundColor: '#222'/g, "backgroundColor: '#f9f9f9'");

// Borders
content = content.replace(/border: '1px solid #333'/g, "border: '1px solid #eaeaea'");
content = content.replace(/borderBottom: '1px solid #333'/g, "borderBottom: '1px solid #eaeaea'");
content = content.replace(/borderTop: '1px solid #333'/g, "borderTop: '1px solid #eaeaea'");

// Text Colors
// For #aaa and #888, let's use #666
content = content.replace(/color: '#aaa'/g, "color: '#666'");
content = content.replace(/color: '#888'/g, "color: '#666'");
content = content.replace(/color: '#eaeaea'/g, "color: '#333'");

// Premium Contact Card CSS
content = content.replace(/background: rgba\(17, 17, 17, 0\.6\)/g, "background: rgba(255, 255, 255, 0.8)");
content = content.replace(/border: 1px solid rgba\(212, 175, 55, 0\.15\)/g, "border: 1px solid rgba(0, 0, 0, 0.05)");
content = content.replace(/box-shadow: 0 15px 35px rgba\(0, 0, 0, 0\.4\)/g, "box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05)");
content = content.replace(/box-shadow: 0 25px 50px rgba\(0, 0, 0, 0\.6\)/g, "box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1)");
content = content.replace(/background: rgba\(255, 255, 255, 0\.03\)/g, "background: rgba(0, 0, 0, 0.03)");
content = content.replace(/border: 1px solid rgba\(255, 255, 255, 0\.08\)/g, "border: 1px solid rgba(0, 0, 0, 0.08)");
content = content.replace(/background: rgba\(255, 255, 255, 0\.08\)/g, "background: rgba(0, 0, 0, 0.05)");
content = content.replace(/color: rgba\(255, 255, 255, 0\.3\)/g, "color: rgba(0, 0, 0, 0.4)");
content = content.replace(/borderBottom: '1px solid rgba\\(255,255,255,0\.1\\)'/g, "borderBottom: '1px solid rgba(0,0,0,0.1)'");

// Specific text colors in inputs or selected items
content = content.replace(/color: '#fff'/g, "color: '#111'"); // There are inputs with color: '#fff', and main text with color: '#fff'

// Modals
content = content.replace(/background: '#111'/g, "background: '#fff'");

fs.writeFileSync(file, content);
console.log('Replacements completed.');
