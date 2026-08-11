import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../common";
import { useToast } from "../common";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, MapPin, CreditCard } from "lucide-react";

const BaseUrl = import.meta.env.VITE_API_URL;

export const CheckoutPage = () => {
  const { success, error } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/cart`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setCart(result.data || { items: [] });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/addresses`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setAddresses(result.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCart, fetchAddresses]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress && (!newAddress.street || !newAddress.city)) {
      error("Please select or enter a shipping address");
      return;
    }

    try {
      setPlacingOrder(true);

      const shippingAddress = selectedAddress
        ? addresses.find((a) => a._id === selectedAddress)
        : newAddress;

      // Create the order with payment method
      const orderResponse = await fetch(`${BaseUrl}/api/orders`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        error(orderResult.message || "Failed to place order");
        setPlacingOrder(false);
        return;
      }

      const order = orderResult.data;

      if (paymentMethod === "online") {
        // Create a Stripe Checkout Session and redirect the
        // customer to Stripe to complete payment (STAGE 1).
        const paymentResponse = await fetch(`${BaseUrl}/api/payments/checkout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId: order._id }),
        });

        const paymentResult = await paymentResponse.json();

        if (paymentResponse.ok && paymentResult.url) {
          window.location.href = paymentResult.url;
          return;
        }

        error(paymentResult.message || "Failed to start payment");
        navigate("/dashboard/orders");
      } else {
        success("Order placed successfully!");
        navigate("/dashboard/orders");
      }
    } catch (error) {
      error("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading checkout...</div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal >= 100 ? 0 : 10;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div>
        <div className="ml-3 mr-3">
          <PageHeader
            breadcrumbs={["Dashboard", "Checkout"]}
            title="Checkout"
            subtitle="Complete your order"
            showButton={false}
          />
        </div>
        <div className="ml-3 mr-3">
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500">Add products to proceed with checkout</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard", "Checkout"]}
          title="Checkout"
          subtitle="Complete your order"
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={20} className="text-[#4F30A9]" />
                <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-[#4F30A9]" />
                <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
              </div>

              {addresses.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Select existing address
                  </label>
                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr._id}
                          checked={selectedAddress === addr._id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="mt-1"
                        />
                        <div className="text-sm">
                          <p className="font-medium">{addr.street}</p>
                          <p className="text-gray-600">
                            {addr.city}, {addr.state} {addr.zip}
                          </p>
                          <p className="text-gray-600">{addr.country}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {addresses.length > 0
                    ? "Or enter new address"
                    : "Enter shipping address"}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs text-gray-600">Street Address</label>
                    <input
                      type="text"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">State</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">ZIP Code</label>
                    <input
                      type="text"
                      value={newAddress.zip}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, zip: e.target.value })
                      }
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Country</label>
                    <input
                      type="text"
                      value={newAddress.country}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, country: e.target.value })
                      }
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-[#4F30A9]" />
                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery (COD)</p>
                    <p className="text-sm text-gray-500">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-gray-500">Pay securely with card or UPI</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={20} className="text-[#4F30A9]" />
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
              </div>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 pb-4 border-b">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product?.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingBag size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-[#4F30A9]" />
                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full bg-[#4F30A9] text-white py-3 rounded-lg font-medium hover:bg-[#3d01d2] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                {placingOrder
                  ? paymentMethod === "online"
                    ? "Redirecting to Stripe..."
                    : "Placing Order..."
                  : paymentMethod === "online"
                    ? "Pay with Stripe"
                    : "Place Order"}
              </button>

              <button
                onClick={() => navigate("/dashboard/cart")}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
