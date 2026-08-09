import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../common";
import { UiDelete } from "../common/ui.delete";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useToast } from "../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const WishlistPage = () => {
  const { success, error } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingProduct, setRemovingProduct] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  // ==========================
  // GET WISHLIST
  // ==========================

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BaseUrl}/api/wishlist`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setWishlist(result.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // ==========================
  // REMOVE FROM WISHLIST
  // ==========================

  const handleRemoveConfirm = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/wishlist/${removingProduct._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchWishlist();
      }
    } catch (error) {
      console.log(error);
    }

    setRemovingProduct(null);
  };

  // ==========================
  // ADD TO CART
  // ==========================

  const addToCart = async (product) => {
    try {
      setAddingToCart(product._id);

      const response = await fetch(`${BaseUrl}/api/cart/items`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        success("Added to cart!");
      } else {
        error("Failed to add to cart");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard", "Wishlist"]}
          title="My Wishlist"
          subtitle="Manage your favorite products"
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <Heart size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500">Save products you love by clicking the heart icon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={48} className="text-gray-400" />
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => setRemovingProduct(product)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-bold text-[#4F30A9]">
                      ${product.price}
                    </p>
                    {product.stock > 0 ? (
                      <span className="text-xs text-green-600 font-medium">
                        In Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={addingToCart === product._id || product.stock === 0}
                    className="w-full bg-[#4F30A9] text-white py-2 rounded-lg font-medium hover:bg-[#3d01d2] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart === product._id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {removingProduct && (
        <UiDelete
          open={!!removingProduct}
          onClose={() => setRemovingProduct(null)}
          onConfirm={handleRemoveConfirm}
          title="Remove from Wishlist"
          itemType="product"
          itemName={removingProduct.name}
          message="Are you sure you want to remove this product from your wishlist?"
        />
      )}
    </div>
  );
};