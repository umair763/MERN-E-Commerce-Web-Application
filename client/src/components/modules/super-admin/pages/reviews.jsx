import { useState, useEffect } from "react";
import { PageHeader } from "../../../../common";
import { ReviewsTableResp } from "../../reviews";
import { UiDelete } from "../../../../common";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const SuperAdminReviews = () => {
  const { success, error } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingReview, setDeletingReview] = useState(null);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/reviews/admin/all`, {
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setReviews(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/reviews/admin/${deletingReview._id}`, {
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
      console.error("Failed to delete review:", error);
      error("Failed to delete review");
    }

    setDeletingReview(null);
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Super Admin", "Reviews"]}
          title="Reviews"
          subtitle="Manage all product reviews"
          showButton={false}
        />
      </div>

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
          loading={loading}
          onDelete={setDeletingReview}
        />
      </div>
    </div>
  );
};
