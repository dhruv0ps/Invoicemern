const express = require('express');
const { createInvoice, getInvoices, deleteInvoice } = require('../controllers/invoiceController');
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/',protect, createInvoice);
router.get('/:id',protect, getInvoices);
router.delete('/:id', deleteInvoice);

module.exports = router;
