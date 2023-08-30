const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice.model');

// Create a new invoice
router.post('/add', (req, res) => {
  const { name, totalPrice, date, isPaid, customerId } = req.body;
  const newInvoice = new Invoice({ name, totalPrice, date, isPaid, customerId });

  newInvoice.save()
    .then(savedInvoice => {
      res.json(savedInvoice);
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});

// Get all invoices
router.get('/', (req, res) => {
  Invoice.find()
    .then(invoices => {
      res.json(invoices);
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});

// Get a specific invoice by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Invoice.findById(id)
    .then(invoice => {
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      res.json(invoice);
    })
    .catch(error => {
      res.status(404).json({ error: error.message });
    });
});

// Update an invoice by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, totalPrice, date, isPaid, customerId } = req.body;

  Invoice.findByIdAndUpdate(id, { name, totalPrice, date, isPaid, customerId }, { new: true })
    .then(updatedInvoice => {
      if (!updatedInvoice) {
        throw new Error('Invoice not found');
      }
      res.json(updatedInvoice);
    })
    .catch(error => {
      res.status(404).json({ error: error.message });
    });
});

// Delete an invoice by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Invoice.findByIdAndDelete(id)
    .then(deletedInvoice => {
      if (!deletedInvoice) {
        throw new Error('Invoice not found');
      }
      res.json({ message: 'Invoice deleted successfully' });
    })
    .catch(error => {
      res.status(404).json({ error: error.message });
    });
});

module.exports = router;
