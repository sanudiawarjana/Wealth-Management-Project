const Liability = require('../models/liabilities');

exports.getAll = async (req, res) => {
  try {
    const items = await Liability.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSingle = async (req, res) => {
  // Validate ObjectId format first
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid liability ID format' });
  }
  
  try {
    const item = await Liability.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const item = new Liability(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  // Validate ObjectId format first
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid liability ID format' });
  }
  
  try {
    const item = await Liability.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!item) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  // Validate ObjectId format first
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid liability ID format' });
  }
  
  try {
    const deletedItem = await Liability.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    
    res.status(200).json({ message: 'Liability deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
