import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const InvoiceForm = () => {
  const [formDetails, setFormDetails] = useState({
    invoiceId: '',
    companyName: '',
    clientName: '',
    clientEmail: '',
    items: [],
    taxType: '',
    taxRate: 0,
  });
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const taxOptions = [
    { label: 'Select Tax Type', value: '' },
    { label: 'GST', value: '18' },
    { label: 'VAT', value: '15' },
    { label: 'Service Tax', value: '14' },
  ];

  useEffect(() => {
    const calculateTotals = () => {
      const subtotal = formDetails.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const tax = formDetails.taxRate ? (formDetails.taxRate / 100) * subtotal : 0;
      const total = subtotal + tax;

      setSubtotal(subtotal);
      setTaxAmount(tax);
      setTotal(total);
    };

    calculateTotals();
  }, [formDetails.items, formDetails.taxRate]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const items = [...formDetails.items];
    items[index][name] = value;
    setFormDetails({ ...formDetails, items });
  };

  const handleTaxTypeChange = (e) => {
    const selectedTaxRate = e.target.value;
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      taxType: e.target.value,
      taxRate: selectedTaxRate ? parseInt(selectedTaxRate) : 0,
    }));
  };

  const addItem = () => {
    setFormDetails({
      ...formDetails,
      items: [...formDetails.items, { description: '', quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = formDetails.items.filter((_, i) => i !== index);
    setFormDetails({ ...formDetails, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 

    if (!token) {
      toast.error('You need to be logged in to create an invoice.');
      return;
    }
    console.log(token);
    const decodedToken = jwtDecode(token); 
    const userId = decodedToken.id; 
    console.log(userId);
    try {
      const response = await axios.post(`http://localhost:5000/api/invoices`, {
        ...formDetails,
        total,
        userId
      }, { headers: { Authorization: `Bearer ${token}` } });
      const id = response.data.invoiceId;
      console.log(id);
      toast.success('Invoice created successfully');
      setFormDetails({
        invoiceId: response.data.invoiceId,
        companyName: '',
        clientName: '',
        clientEmail: '',
        items: [],
        taxType: '',
        taxRate: 0,
      });
      navigate(`/invoicedetail/${id}`);
    } catch (error) {
      toast.error('Failed to create invoice');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Create Invoice</h1>
      {formDetails.invoiceId && (
        <div className="mb-4">
          <strong>Invoice Number: {formDetails.invoiceId}</strong>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={formDetails.companyName}
            onChange={(e) => setFormDetails({ ...formDetails, companyName: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Client Name:</label>
          <input
            type="text"
            name="clientName"
            value={formDetails.clientName}
            onChange={(e) => setFormDetails({ ...formDetails, clientName: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Client Email:</label>
          <input
            type="email"
            name="clientEmail"
            value={formDetails.clientEmail}
            onChange={(e) => setFormDetails({ ...formDetails, clientEmail: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>

        {formDetails.items.length === 0 && (
          <div className="flex justify-start mb-4">
            <button
              type="button"
              onClick={addItem}
              className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
            >
              Add Item
            </button>
          </div>
        )}

        {formDetails.items.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label>Description:</label>
              <input
                type="text"
                name="description"
                placeholder="Item description"
                value={item.description}
                onChange={(e) => handleChange(e, index)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="flex-1">
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleChange(e, index)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="flex-1">
              <label>Price ($):</label>
              <div className="flex items-center border p-2">
                <span className="mr-1">$</span>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:mt-0 mt-2">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="border border-red-500 text-red-500 px-4 py-2 mt-4 rounded hover:bg-red-500 hover:text-white transition-colors"
              >
                Remove Item
              </button>
            </div>
          </div>
        ))}

        {formDetails.items.length > 0 && (
          <div className="flex justify-start mb-4">
            <button
              type="button"
              onClick={addItem}
              className="border border-blue-500 text-blue-500 px-4 py-2 mt-4 rounded hover:bg-blue-500 hover:text-white transition-colors"
            >
              Add Item
            </button>
          </div>
        )}

        <div>
          <label>Tax Type:</label>
          <select
            name="taxType"
            value={formDetails.taxType}
            onChange={handleTaxTypeChange}
            className="border p-2 w-full"
          >
            {taxOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Display Subtotal, Tax, and Total */}
        <div className='flex justify-end'>
          <h2 className="text-xl font-bold mt-4">Subtotal: ${subtotal.toFixed(2)}</h2>
        </div>
        <div className='flex justify-end'>
          <h2 className="text-xl font-bold mt-4">Tax: ${taxAmount.toFixed(2)}</h2>
        </div>
        <div className='flex justify-end'>
          <h2 className="text-xl font-bold mt-4">Total Price: ${total.toFixed(2)}</h2>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-green-500 text-white px-4 py-2">
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
