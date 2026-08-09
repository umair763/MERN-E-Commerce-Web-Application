import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../layout/navbar";
import { HeroSection } from "../components/hero.section";
import { Footer } from "../layout/footer";
import { ShoppingBag, Heart, Filter, Search } from "lucide-react";
import { useToast } from "../common";
import { useAuth } from "../context/AuthContext";
import { UiPagination } from "../common/ui.pagination.jsx";

const BaseUrl = import.meta.env.VITE_API_URL;

const ITEMS_PER_PAGE = 8;

export const LandingPage = () => {
  const { success, error } = useToast();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [categoryPages, setCategoryPages] = useState({});
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [productsLoadedCount, setProductsLoadedCount] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/categories`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setCategories(result.data || []);
        setCategoriesLoaded(true);
      }
    } catch (error) {
      console.log(error);
      setCategoriesLoaded(true);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (categoryId) => {
    try {
      let url = `${BaseUrl}/api/products?status=active&category=${categoryId}`;
      if (searchQuery) url += `&q=${searchQuery}`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setCategoryProducts((prev) => ({
          ...prev,
          [categoryId]: result.data || [],
        }));
        setProductsLoadedCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
      setProductsLoadedCount((prev) => prev + 1);
    }
  }, [searchQuery]);

  const fetchCartCount = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`${BaseUrl}/api/cart`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        const items = result.data?.items || [];
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (categories.length > 0) {
      setProductsLoadedCount(0); // Reset counter when categories change
      categories.forEach((cat) => {
        fetchProductsByCategory(cat._id);
      });
    }
  }, [categories, fetchProductsByCategory]);

  useEffect(() => {
    if (categoriesLoaded && productsLoadedCount >= categories.length) {
      setLoading(false);
    }
    // Fallback: if categories are loaded but empty, stop loading
    if (categoriesLoaded && categories.length === 0) {
      setLoading(false);
    }
  }, [categoriesLoaded, productsLoadedCount, categories.length]);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  const handlePageChange = (categoryId, page) => {
    setCategoryPages((prev) => ({
      ...prev,
      [categoryId]: page,
    }));
  };

  const addToCart = async (product) => {
    if (!user) {
      error("Please login to add items to cart");
      return;
    }

    const variantId = product.variants?.[0]?._id;

    try {
      const response = await fetch(`${BaseUrl}/api/cart/items`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          variantId: variantId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        success("Added to cart!");
        await fetchCartCount();
      } else {
        const result = await response.json();
        error(result.message || "Failed to add to cart");
      }
    } catch (error) {
      error("Failed to add to cart");
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) {
      error("Please login to add to wishlist");
      return;
    }

    try {
      const response = await fetch(`${BaseUrl}/api/wishlist/${productId}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        success("Added to wishlist!");
      } else {
        error("Failed to add to wishlist");
      }
    } catch (error) {
      error("Failed to add to wishlist");
    }
  };

  const getPaginatedProducts = (categoryId) => {
    const products = categoryProducts[categoryId] || [];
    const currentPage = categoryPages[categoryId] || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  };

  return (
    <div id="top" className="min-h-screen bg-white">
      <Navbar category="Shop" cartCount={cartCount} onCartClick={() => {}} />

      <main>
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F30A9]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category Sections */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-500">Loading products...</div>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No categories found</h3>
            </div>
          ) : (
            categories.map((category) => {
              const products = categoryProducts[category._id] || [];
              const currentPage = categoryPages[category._id] || 1;
              const paginatedProducts = getPaginatedProducts(category._id);
              const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

              if (products.length === 0) return null;

              return (
                <div key={category._id} className="mb-16">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                    <Link
                      to={`/products?category=${category._id}`}
                      className="text-[#4F30A9] hover:text-[#3D1F8A] font-medium"
                    >
                      View All
                    </Link>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {paginatedProducts.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition"
                      >
                        {/* Product Image */}
                        <div className="relative h-48 bg-gray-100">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={48} className="text-gray-400" />
                            </div>
                          )}

                          {/* Wishlist Button */}
                          <button
                            onClick={() => addToWishlist(product._id)}
                            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          >
                            <Heart size={16} />
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
                              ${product.variants?.[0]?.price || product.price}
                            </p>
                            {product.variants?.[0]?.stock > 0 ? (
                              <span className="text-xs text-green-600 font-medium">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-xs text-red-600 font-medium">
                                Out of Stock
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => addToCart(product)}
                            disabled={product.variants?.[0]?.stock <= 0}
                            className="w-full bg-[#4F30A9] text-white py-2 rounded-lg font-medium hover:bg-[#3D1F8A] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <ShoppingBag size={16} />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <UiPagination
                      currentPage={currentPage}
                      itemsPerPage={ITEMS_PER_PAGE}
                      totalItems={products.length}
                      itemLabel="products"
                      onPageChange={(page) => handlePageChange(category._id, page)}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};