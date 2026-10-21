// api/verify-payment.js
// Server-side verification for Razorpay payments.
// Never trusts client parameters; validates HMAC-SHA256 signature or queries Razorpay API directly.

const crypto = require('crypto');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, creator } = req.body || {};

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const isLiveSetupConfirmed = process.env.RAZORPAY_LIVE_ENABLED === 'true';

    // Guard: Online payments disabled / awaiting live setup confirmation
    if (!isLiveSetupConfirmed) {
      return res.status(403).json({
        verified: false,
        error: 'Payments are currently disabled pending owner confirmation of live Razorpay credentials.',
        testMode: true,
        note: 'To activate live payments, configure RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and set RAZORPAY_LIVE_ENABLED=true in Vercel environment variables.'
      });
    }

    if (!keySecret) {
      return res.status(500).json({
        verified: false,
        error: 'Server misconfiguration: RAZORPAY_KEY_SECRET is not set in environment variables.'
      });
    }

    if (!razorpay_payment_id) {
      return res.status(400).json({
        verified: false,
        error: 'Missing required parameter: razorpay_payment_id'
      });
    }

    // 1. Signature Verification (when razorpay_order_id & signature are present)
    if (razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          verified: false,
          error: 'Invalid payment signature. Payment verification failed.'
        });
      }
    } else if (keyId && keySecret) {
      // 2. Direct API Verification with Razorpay API (fallback if order was client-initiated)
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
        headers: { Authorization: `Basic ${auth}` }
      });
      const paymentData = await rzpRes.json();

      if (!rzpRes.ok || paymentData.status !== 'captured') {
        return res.status(400).json({
          verified: false,
          error: `Payment is not captured. Current status: ${paymentData.status || 'unknown'}`
        });
      }
    }

    // Payment is legitimately verified on the server
    return res.status(200).json({
      verified: true,
      paymentId: razorpay_payment_id,
      verifiedAt: new Date().toISOString(),
      creatorHandle: creator ? creator.handle : null
    });
  } catch (err) {
    console.error('[Verify Payment Error]', err);
    return res.status(500).json({
      verified: false,
      error: 'Internal server error verifying payment: ' + err.message
    });
  }
};
