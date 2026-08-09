export const OrderViewDialogue = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="w-full overflow-hidden rounded-xl bg-white font-sans">
          <div className="flex items-center justify-between rounded-t-xl bg-[#4F30A9] px-6 py-4">
            <h2 className="m-0 text-[15px] font-semibold text-white">Order Details</h2>
            <span className="text-white text-sm opacity-80">{order.orderNumber}</span>
          </div>

          <div className="px-6 py-6">
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium">{order.user?.name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-medium">{order.user?.email || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <div className="text-sm">
                  {typeof order.shippingAddress === 'object' ? (
                    <div>
                      <p className="font-medium">{order.shippingAddress?.street}</p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                      <p>{order.shippingAddress?.country}</p>
                    </div>
                  ) : (
                    <p>{order.shippingAddress || "No address provided"}</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm pb-3 border-b border-gray-200 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">SKU: {item.sku}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-gray-500 text-xs">${item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Totals</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${(order.totals?.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-${(order.totals?.discount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${(order.totals?.shipping || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${(order.totals?.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300 text-base font-semibold">
                    <span>Total</span>
                    <span>${(order.totals?.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Status</span>
                    <span className="font-medium capitalize">{order.status || "Pending"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span className="font-medium capitalize">{order.payment?.status || "Pending"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium capitalize">{order.payment?.method || "Offline"}</span>
                  </div>
                </div>
              </div>

              {/* Admin Modification Info */}
              {order.adminModified && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-2">Admin Modification</h3>
                  <p className="text-sm text-yellow-700">
                    This order was {order.adminModified} by admin on{" "}
                    {order.adminModifiedAt ? new Date(order.adminModifiedAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              )}

              <div className="h-px bg-gray-200" />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-5 py-2 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};