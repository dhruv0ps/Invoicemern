const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});