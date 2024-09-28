const Invoice = require('../model/invoicemodel');
const User = require("../model/usermodel")
const createInvoice = async (req, res) => {
  try {
    const { clientName, clientEmail, items,taxType,taxRate , companyName} = req.body;
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    console.log(subtotal);
    const taxAmount = (taxRate / 100) * subtotal; 
    const total = subtotal + taxAmount; 
    const randomId = Math.floor(1000 + Math.random() * 9000);
const invoiceId = `INV-${randomId}`;


const user = await User.findById(req.user._id).select('name email'); 
if (!user) {
  return res.status(404).json({ message: 'User not found' });
}

    const invoice = new Invoice({
      userId: req.user._id,
      clientName,
      clientEmail,
      items,
      total,
      invoiceId,
      taxRate,
      subtotal,
taxType,
companyName,
name: user.name,   
      email: user.email,
    });
    await invoice.save();
    const response = {
        invoiceId: invoice.invoiceId,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        items: invoice.items,
        taxRate : invoice.taxRate,
        taxType : invoice.taxType,
        total: invoice.total,
        subtotal : invoice.subtotal,
        companyName : invoice.companyName,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        user: {
          id: req.user._id,       
          name: invoice.name, 
          email: invoice.email,  
        },
      };
    res.status(201).json(response);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Invoice creation failed' });
  }
};

const getInvoices = async (req, res) => {
  try {
    const { id: invoiceId } = req.params; 
    console.log(invoiceId); 
    const invoices = await Invoice.find({ userId: req.user._id,invoiceId });
    res.status(200).json(invoices);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Invoice deletion failed' });
  }
};

module.exports = { createInvoice, getInvoices, deleteInvoice };
