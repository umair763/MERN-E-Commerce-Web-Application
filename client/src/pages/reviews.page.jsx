import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../common";
import { ReviewsTableResp, ReviewsCreateDialogue } from "../components/modules/reviews";
import { UiDelete } from "../common/ui.delete";
import { useToast } from "../common";

const BaseUrl = import.meta.env.VITE_API_URL;

const EMPTY_REVIEW_FORM = {
  product: "",
  rating: 0,
  comment: "",
};

export const ReviewsPage = () => {
  const { success, error } = useToast();
  const [reviews, setReviews] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);

  // ADD STATES
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_REVIEW_FORM);
  const [addErrors, setAddErrors] = useState({});
  const [addLoading, setAddLoading] = useState(false);

  // DELETE STATE
  const [deletingReview, setDeletingReview] = useState(null);

  // ==========================
  // GET USER REVIEWS
  // ==========================

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/reviews/mine`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setReviews(result.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Fetch delivered orders to get purchased products
  const fetchPurchasedProducts = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/orders`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        const deliveredOrders = (result.data || []).filter(
          order => order.status === 'delivered'
        );
        
        // Extract unique products from delivered orders
        const productMap = new Map();
        deliveredOrders.forEach(order => {
          order.items?.forEach(item => {
            if (item.product && !productMap.has(item.product._id)) {
              productMap.set(item.product._id, {
                _id: item.product._id,
                name: item.product.name,
                image: item.product.image,
              });
            }
          });
        });
        
        setPurchasedProducts(Array.from(productMap.values()));
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    fetchPurchasedProducts();
  }, [fetchReviews, fetchPurchasedProducts]);

  // ==========================
  // ADD REVIEW
  // ==========================

  const openAdd = () => {
    if (purchasedProducts.length === 0) {
      error("You need to purchase a product first before reviewing");
      return;
    }
    setAddForm(EMPTY_REVIEW_FORM);
    setAddErrors({});
    setIsAddOpen(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    setAddForm(EMPTY_REVIEW_FORM);
    setAddErrors({});
  };

  const handleAddChange = (field, value) => {
    setAddForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSubmit = async () => {
    let errors = {};

    if (!addForm.product) errors.product = "Product is required";
    if (!addForm.rating) errors.rating = "Rating is required";
    if (!addForm.comment) errors.comment = "Comment is required";

    if (Object.keys(errors).length) {
      setAddErrors(errors);
      return;
    }

    try {
      setAddLoading(true);

      const response = await fetch(`${BaseUrl}/api/reviews/product/${addForm.product}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: addForm.rating,
          comment: addForm.comment,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchReviews();
        success("Review added successfully!");
        closeAdd();
      } else {
        error(result.message || "Failed to add review");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAddLoading(false);
    }
  };

  // ==========================
  // DELETE REVIEW
  // ==========================

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/reviews/${deletingReview._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchReviews();
        success("Review deleted successfully!");
      } else {
        error("Failed to delete review");
      }
    } catch (error) {
      console.log(error);
    }

    setDeletingReview(null);
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard", "Reviews"]}
          title="My Reviews"
          subtitle="Manage your product reviews"
          buttonLabel="Add Review"
          onButtonClick={openAdd}
        />
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl">
            <ReviewsCreateDialogue
              isOpen={isAddOpen}
              onClose={closeAdd}
              formData={addForm}
              onChange={handleAddChange}
              errors={addErrors}
              loading={addLoading}
              onSubmit={handleAddSubmit}
              products={purchasedProducts}
            />
          </div>
        </div>
      )}

      {deletingReview && (
        <UiDelete
          open={!!deletingReview}
          onClose={() => setDeletingReview(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Review"
          itemType="review"
          itemName={`by ${deletingReview.user?.name || "unknown user"}`}
        />
      )}

      <div className="ml-3 mr-3">
        <ReviewsTableResp
          reviews={reviews}
          onDelete={setDeletingReview}
        />
      </div>
    </div>
  );
};
