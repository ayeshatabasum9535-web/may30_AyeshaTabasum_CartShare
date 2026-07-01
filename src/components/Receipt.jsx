import React from 'react';
import { X, Printer, Calendar, FileText, ShoppingBag, ListChecks } from 'lucide-react';


export default function Receipt({ isOpen, onClose, roomCode, items = [], logs = [] }) {
  if (!isOpen) return null;

  const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const timestamp = new Date().toLocaleString();

  const handlePrint = () => {
    window.print();
  };


  const userActionsCount = logs.reduce((acc, log) => {
    acc[log.userName] = (acc[log.userName] || 0) + 1;
    return acc;
  }, {});

  const totalActions = logs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-all duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/20">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-850 dark:text-slate-100">Receipt Summary</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Printable Receipt Paper Sheet */}
          <div
            id="print-area"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
          >
            {/* Store / Room info */}
            <div className="text-center pb-6 border-b border-dashed border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">CART SHARE</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 uppercase tracking-wider">Shared Shopping Cart Session</p>
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Date: {timestamp}</span>
                </div>
                <div className="text-right">
                  <span>Room Code: <b className="font-mono text-slate-800 dark:text-slate-200">{roomCode}</b></span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4" />
                <span>Purchased Items</span>
              </h4>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    <th className="py-2">Item</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-semibold text-slate-850 dark:text-slate-100">{item.name}</td>
                      <td className="py-3 text-center font-mono">{item.quantity}</td>
                      <td className="py-3 text-right font-mono text-slate-500">${item.price.toFixed(2)}</td>
                      <td className="py-3 text-right font-mono font-bold">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 py-4 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wider">Total Items Count</span>
                <span className="block font-bold text-slate-800 dark:text-slate-100">{totalItemsCount} items</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wider">Grand Total</span>
                <span className="block font-mono text-2xl font-black text-blue-600 dark:text-blue-400">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Log / Session Summary */}
            {logs.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-850 pt-4 mt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                  <ListChecks className="h-4 w-4" />
                  <span>Activity Summary</span>
                </h4>
                <div className="rounded-lg bg-slate-50/80 p-3 text-xs text-slate-500 dark:bg-slate-800/40 dark:text-slate-450 space-y-1.5">
                  <p>Total actions logged during session: <b>{totalActions}</b></p>
                  <div>
                    <p className="font-semibold mb-0.5 text-slate-600 dark:text-slate-350">Contributions:</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {Object.entries(userActionsCount).map(([user, count]) => (
                        <li key={user}>
                          {user}: <b>{count}</b> modifications
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Note */}
            <div className="mt-8 text-center text-xs text-slate-600 dark:text-slate-400">
              <p>Thank you for using CartShare!</p>
              <p className="mt-1">Generated by frontend collaboration simulation.</p>
            </div>

          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/20">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-100 dark:shadow-none transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Print Receipt / PDF</span>
          </button>
        </div>

      </div>

    </div>
  );
}
