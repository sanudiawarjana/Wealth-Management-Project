const Income = require('../models/income');

// Get all incomes
exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find();
    res.status(200).json(incomes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single income
exports.getSingleIncome = async (req, res) => {
  // Validate ObjectId format first
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid income ID format' });
  }
  
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new income
exports.createIncome = async (req, res) => {
  try {
    const newIncome = new Income(req.body);
    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update income
exports.updateIncome = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({ error: 'Invalid income ID format' });
    }
    
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedIncome) {
      return res.status(404).json({ error: 'Income not found' });
    }
    
    res.status(200).json(updatedIncome);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete income
exports.deleteIncome = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({ error: 'Invalid income ID format' });
    }
    
    const deletedIncome = await Income.findByIdAndDelete(req.params.id);
    if (!deletedIncome) {
      return res.status(404).json({ error: 'Income not found' });
    }
    
    res.status(200).json({ message: 'Income deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
