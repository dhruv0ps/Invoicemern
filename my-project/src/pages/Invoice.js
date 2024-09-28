import React from 'react';

const Invoice = ({ invoiceData }) => {
  const {
    clientEmail,
    clientName,
    invoiceId,
    items,
    total,
    createdAt,
    updatedAt,
  } = invoiceData;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-sm my-6" id="invoice">
      <div className="grid grid-cols-2 items-center">
        <div>
          {/* Company logo */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg"
            alt="company-logo"
            height="100"
            width="100"
          />
        </div>
        <div className="text-right">
          <p>Tailwind Inc.</p>
          <p className="text-gray-500 text-sm">sales@tailwindcss.com</p>
          <p className="text-gray-500 text-sm mt-1">+41-442341232</p>
          <p className="text-gray-500 text-sm mt-1">VAT: 8657671212</p>
        </div>
      </div>

      {/* Client info */}
      <div className="grid grid-cols-2 items-center mt-8">
        <div>
          <p className="font-bold text-gray-800">Bill to:</p>
          <p className="text-gray-500">
            {clientName}
            <br />
            {clientEmail}
          </p>
        </div>
        <div className="text-right">
          <p>
            Invoice number: <span className="text-gray-500">{invoiceId}</span>
          </p>
          <p>
            Invoice date: <span className="text-gray-500">{new Date(createdAt).toLocaleDateString()}</span>
            <br />
            Updated on: <span className="text-gray-500">{new Date(updatedAt).toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      {/* Invoice Items */}
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
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Items
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Price
              </th>
              <th
                scope="col"
                className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0"
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((invoiceItem, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div className="font-medium text-gray-900">{invoiceItem.name}</div>
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
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th
                scope="row"
                colSpan="3"
                className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
              >
                Total
              </th>
              <th scope="row" className="pl-6 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">
                Total
              </th>
              <td className="pl-3 pr-6 pt-6 text-right text-sm text-gray-500 sm:pr-0">
                ${total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
        Please pay the invoice before the due date. You can pay the invoice by logging in to your account from our client portal.
      </div>
    </div>
  );
};

export default Invoice;
