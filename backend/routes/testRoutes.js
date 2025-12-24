const express = require('express');
const router = express.Router();

router.get('/emit-seller', (req, res) => {
  console.log('🔥 TEST ROUTE HIT');

  if (!global.io) {
    console.log('❌ Socket not initialized');
    return res.status(500).json({
      success: false,
      message: 'Socket not initialized',
    });
  }

  global.io.emit('NEW_SELLER_REGISTERED', {
    id: 'test123',
    name: 'Test Seller',
    email: 'test@seller.com',
  });

  console.log('✅ Event emitted');

  res.json({
    success: true,
    message: 'Socket event emitted',
  });
});

module.exports = router;
