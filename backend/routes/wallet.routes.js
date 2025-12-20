const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const walletController = require('../controllers/wallet.controller');

router.get('/balance', protect, walletController.getWalletBalance);
router.get('/transactions', protect, walletController.getTransactions);
router.post('/add-funds', protect, walletController.addFunds);
router.post('/withdraw', protect, walletController.withdrawFunds);

module.exports = router;
