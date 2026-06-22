import React, { useState, useEffect } from 'react';

const SubscriptionPayment = ({ userId, setCurrentView }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch plans
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/subscription/plans');
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
          if (data.length > 0) setSelectedPlan(data[0].id);
        } else {
          setError('Failed to load plans');
        }
      } catch (err) {
        setError('Network error loading plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan || !userId) return;
    setError('');

    try {
      // 1. Create order
      const orderRes = await fetch('http://localhost:3000/api/subscription/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, planId: selectedPlan })
      });
      
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Looks Salon",
        description: orderData.plan.plan_name,
        order_id: orderData.order.id,
        handler: async function (response) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch('http://localhost:3000/api/subscription/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                planId: selectedPlan
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              alert('Payment successful! You can now log in.');
              setCurrentView('auth'); // Go back to login
            } else {
              setError('Payment verification failed');
            }
          } catch (err) {
            setError('Error verifying payment');
          }
        },
        theme: {
          color: "#d4af37"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        setError(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();
    } catch (err) {
      setError(err.message || 'Error initializing payment');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Loading plans...</div>;

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', backgroundColor: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: '#151515', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '40px', borderRadius: '8px', maxWidth: '500px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h2 style={{ color: 'var(--gold-accent, #d4af37)', fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>Choose a Subscription Plan</h2>
        <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '30px' }}>You need an active subscription to access the salon owner dashboard.</p>
        
        {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '4px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          {plans.map(plan => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              style={{ 
                border: `2px solid ${selectedPlan === plan.id ? 'var(--gold-accent, #d4af37)' : 'rgba(255,255,255,0.1)'}`, 
                borderRadius: '8px', 
                padding: '20px', 
                cursor: 'pointer',
                backgroundColor: selectedPlan === plan.id ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>{plan.plan_name}</h3>
                <span style={{ color: 'var(--gold-accent, #d4af37)', fontWeight: 'bold', fontSize: '20px' }}>₹{plan.price}</span>
              </div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>
                Duration: {plan.duration_days} days<br/>
                Max Salons: {plan.max_salons}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handlePayment} 
          disabled={!selectedPlan}
          style={{ width: '100%', background: 'var(--gold-accent, #d4af37)', color: '#000', border: 'none', padding: '15px', fontSize: '16px', fontWeight: 'bold', borderRadius: '4px', cursor: selectedPlan ? 'pointer' : 'not-allowed', opacity: selectedPlan ? 1 : 0.7, transition: 'all 0.3s' }}
        >
          Pay Now & Subscribe
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
           <button 
             onClick={() => setCurrentView('auth')} 
             style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
           >
             Cancel and go back to Login
           </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPayment;
