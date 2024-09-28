const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, 
  email: { type: String, required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  companyName : { type: String, required: true },
  items: [
    {
      description: String,
      quantity: Number,
      price: Number,
    },
  ],
  subtotal :{ type: Number   },
  taxRate :{ type: Number  },
  taxType :{ type: String },
  total: { type: Number, required: true },
  invoiceId: { type: String, unique: true },  
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);

