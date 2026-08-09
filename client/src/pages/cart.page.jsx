import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../common";
import { UiDelete } from "../common/ui.delete";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useToast } from "../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const CartPage = () => {
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const [clearingCart, setClearingCart] = useState(false);

  // ==========================
  // GET CART
  // ==========================

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ==========================
  // UPDATE ITEM QUANTITY
  // ==========================

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItem(itemId);

      const response = await fetch(`${BaseUrl}/api/cart/items/${itemId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchCart();
      } else {
        error("Failed to update quantity");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUpdatingItem(null);
    }
  };

  // ==========================
  // REMOVE ITEM
  // ==========================

  const handleRemoveConfirm = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/cart/items/${removingItem._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchCart();
        success("Item removed from cart");
      } else {
        error("Failed to remove item");
      }
    } catch (error) {
      console.log(error);
    }

    setRemovingItem(null);
  };

  // ==========================
  // CLEAR CART
  // ==========================

  const clearCart = async () => {
    try {
      setClearingCart(true);

      const response = await fetch(`${BaseUrl}/api/cart`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchCart();
        success("Cart cleared successfully");
      } else {
        error("Failed to clear cart");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setClearingCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading cart...</div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard", "Cart"]}
          title="Shopping Cart"
          subtitle="Manage your cart items"
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500">Add some products to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item._id} className="p-6 flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product?.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBag size={32} className="text-gray-400" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                        <p className="text-sm text-gray-500">SKU: {item.product?.sku}</p>
                        <p className="text-lg font-bold text-[#4F30A9] mt-1">
                          ${item.price}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItem === item._id}
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={updatingItem === item._id}
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => setRemovingItem(item)}
                        className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/dashboard/checkout")}
                  className="w-full bg-[#4F30A9] text-white py-3 rounded-lg font-medium hover:bg-[#3d01d2] transition"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={clearCart}
                  disabled={clearingCart}
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  {clearingCart ? "Clearing..." : "Clear Cart"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {removingItem && (
        <UiDelete
          open={!!removingItem}
          onClose={() => setRemovingItem(null)}
          onConfirm={handleRemoveConfirm}
          title="Remove Item"
          itemType="item"
          itemName={removingItem.product?.name || "this item"}
        />
      )}
    </div>
  );
};