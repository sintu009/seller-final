const Wallet = require('../models/wallet.model');
const User = require('../models/user.model');

const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      wallet = await Wallet.create({
        user: userId,
        balance: 0,
        transactions: []
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: 'INR'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const transactions = wallet.transactions
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(offset, offset + parseInt(limit));

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const addFunds = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, paymentMethod, transactionId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      wallet = await Wallet.create({
        user: userId,
        balance: 0,
        transactions: []
      });
    }

    wallet.balance += amount;
    wallet.transactions.push({
      type: 'credit',
      amount,
      description: `Funds added via ${paymentMethod}`,
      transactionId,
      balanceAfter: wallet.balance
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      message: 'Funds added successfully',
      data: {
        balance: wallet.balance,
        transaction: wallet.transactions[wallet.transactions.length - 1]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const withdrawFunds = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, bankDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    wallet.balance -= amount;
    wallet.transactions.push({
      type: 'debit',
      amount,
      description: `Withdrawal to bank account`,
      bankDetails,
      balanceAfter: wallet.balance,
      status: 'pending'
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: {
        balance: wallet.balance,
        transaction: wallet.transactions[wallet.transactions.length - 1]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getWalletBalance,
  getTransactions,
  addFunds,
  withdrawFunds
};
