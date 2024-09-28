import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const InvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5000/api/invoices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setInvoice(res.data[0]); 
      } catch (err) {
        setError('Failed to fetch invoice.');
      }
    };
    fetchInvoice();
  }, [id]);
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const invoiceTitle = `Invoice Details: ${invoice.invoiceId}`;

    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204);
    doc.text(invoiceTitle, 14, 22);

    const leftX = 14;
    doc.setFontSize(16);
    doc.setTextColor(255, 99, 71);
    doc.text("From:", leftX, 40);
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`Name: ${invoice.name}`, leftX, 50);
    doc.text(`Email: ${invoice.email}`, leftX, 60);
    doc.text(`Invoice ID: ${invoice.invoiceId}`, leftX, 70);
    doc.text(`Invoice Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, leftX, 80);

    const pageWidth = doc.internal.pageSize.getWidth();
    const rightX = pageWidth - 14;
    doc.setFontSize(16);
    doc.setTextColor(34, 139, 34);
    doc.text("Client Information:", rightX, 40, { align: "right" });
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`Client: ${invoice.clientName}`, rightX, 50, { align: "right" });
    doc.text(`Email: ${invoice.clientEmail}`, rightX, 60, { align: "right" });
    doc.text(`Company Name: ${invoice.companyName}`, rightX, 70, { align: "right" });

    const tableColumn = ["Items", "Quantity", "Price", "Amount"];
    const tableRows = [];

    if (Array.isArray(invoice.items) && invoice.items.length > 0) {
        invoice.items.forEach(item => {
            const itemData = [
                item.description,
                item.quantity,
                `$${item.price.toFixed(2)}`,
                `$${(item.price * item.quantity).toFixed(2)}`,
            ];
            tableRows.push(itemData);
        });
    } else {
        tableRows.push(["No items available", "", "", ""]);
    }

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 100,
        styles: {
            fillColor: [240, 240, 240],
            textColor: 40,
            fontSize: 12,
        },
        headStyles: {
            fillColor: [0, 102, 204],
            textColor: 255,
        },
        alternateRowStyles: {
            fillColor: [220, 240, 255],
        },
        margin: { top: 10 },
    });

    const summaryX = rightX;
    doc.setFontSize(16);
    doc.setTextColor(255, 165, 0);
    doc.text("Invoice Summary:", summaryX, doc.autoTable.previous.finalY + 10, { align: "right" });
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, summaryX, doc.autoTable.previous.finalY + 20, { align: "right" });
    doc.text(`Tax (${invoice.taxRate}%): $${(invoice.subtotal * invoice.taxRate / 100).toFixed(2)}`, summaryX, doc.autoTable.previous.finalY + 30, { align: "right" });
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0);
    doc.text(`Total: $${invoice.total.toFixed(2)}`, summaryX, doc.autoTable.previous.finalY + 40, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Please pay the invoice before the due date.", 14, doc.internal.pageSize.height - 20);
    doc.text("You can pay the invoice by logging in to your account from our client portal.", 14, doc.internal.pageSize.height - 15);

    doc.save(`Invoice_${invoice.invoiceId}.pdf`);
};

  if (error) return <div className="text-red-500">{error}</div>;
  if (!invoice) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">

    <h1 className="text-3xl mb-6 text-center sm:text-left text-blue-600">Invoice Details</h1>
  
    <div className="flex flex-col sm:flex-row justify-between mb-4">
      <div className="text-lg">
        <h2 className="font-semibold text-blue-600">From:</h2>
        <p>Name: <span className="font-semibold">{invoice.name}</span></p>
        <p>Email: <span className="font-semibold">{invoice.email}</span></p>
        <p className="text-lg">Invoice ID: <span className="font-semibold">{invoice.invoiceId}</span></p>
        <p className="text-lg">Invoice Date: <span className="font-semibold">{new Date(invoice.createdAt).toLocaleDateString()}</span></p>
      </div>
  
      <div className="text-lg sm:mt-0">
        <h2 className="font-semibold text-blue-600 ml-12">To:</h2>
        <h2 className="font-semibold text-right text-blue-600">Client Information:</h2>
        <p className="flex justify-end">Client: <span className="font-semibold">{invoice.clientName}</span></p>
        <p className="flex justify-end">Email: <span className="font-semibold">{invoice.clientEmail}</span></p>
        <p className="flex justify-end">Company Name: <span className="font-semibold">{invoice.companyName}</span></p>
      </div>
    </div>
  
    <div className="-mx-4 mt-8 flow-root sm:mx-0">
      <table className="min-w-full">
        <colgroup>
          <col className="w-full sm:w-1/2" />
          <col className="sm:w-1/6" />
          <col className="sm:w-1/6" />
          <col className="sm:w-1/6" />
        </colgroup>
        <thead className="border-b border-gray-300 text-gray-900">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white bg-blue-600">
              Items
            </th>
            <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-white bg-blue-600 sm:table-cell">
              Quantity
            </th>
            <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-white bg-blue-600 sm:table-cell">
              Price
            </th>
            <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-white bg-blue-600 sm:pr-0">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
            invoice.items.map((invoiceItem, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div className="mt-1 truncate text-gray-500">{invoiceItem.description}</div>
                </td>
                <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                  {invoiceItem.quantity}
                </td>
                <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                  ${invoiceItem.price.toFixed(2)}
                </td>
                <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">
                  ${(invoiceItem.price * invoiceItem.quantity).toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-5 text-center text-gray-500">
                No items available in this invoice.
              </td>
            </tr>
          )}
        </tbody>
      </table>
  
      <div className="">
        <p className="text-lg flex justify-end p-2 text-gray-900">Subtotal: <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span></p>
        <p className="text-lg flex justify-end p-2 text-gray-900">Tax ({invoice.taxRate}%): <span className="font-semibold">${(invoice.subtotal * invoice.taxRate / 100).toFixed(2)}</span></p>
        <p className="text-lg flex justify-end p-2 text-gray-900">Total: <span className="font-semibold text-red-600">${invoice.total.toFixed(2)}</span></p>
      </div>
      
      <div className='flex justify-center'>
        <button onClick={handleDownloadPDF} className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300">Download PDF</button>
      </div>
    </div>
  
    <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
      Please pay the invoice before the due date. You can contact Dhruv
    </div>
  </div>
  
  );
};

export default InvoiceDetail;
