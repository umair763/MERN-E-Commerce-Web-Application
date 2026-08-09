import { Star } from "lucide-react";

export const ReviewsCreateDialogue = ({
  isOpen,
  onClose,
  formData,
  onChange,
  errors,
  loading,
  onSubmit,
  products = [],
}) => {
  if (!isOpen) return null;

  const handleChange = (field, value) => {
    onChange(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleChange("rating", star)}
            className="transition hover:scale-110"
          >
            <Star
              size={24}
              className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-xl bg-[#4F30A9] px-6 py-4">
        <h2 className="m-0 text-[15px] font-semibold text-white">Add Review</h2>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {errors?.general && (
            <div className="rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700">
              {errors.general}
            </div>
          )}

          {/* Product */}
          <div className="flex flex-col gap-2">
            <label className="text-[13.5px] font-medium">Product</label>

            <select
              value={formData.product}
              onChange={(e) => handleChange("product", e.target.value)}
              className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                errors?.product ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>

            {errors?.product && (
              <span className="text-xs text-red-500">{errors.product}</span>
            )}
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-[13.5px] font-medium">Rating</label>

            <div className="flex items-center gap-2">
              {renderStars(formData.rating)}
              <span className="text-sm text-gray-600">
                {formData.rating > 0 ? `${formData.rating} out of 5` : "Select a rating"}
              </span>
            </div>

            {errors?.rating && (
              <span className="text-xs text-red-500">{errors.rating}</span>
            )}
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <label className="text-[13.5px] font-medium">Comment</label>

            <textarea
              placeholder="Share your experience with this product"
              value={formData.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
              className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                errors?.comment ? "border-red-500" : "border-gray-300"
              }`}
              rows="4"
            />

            {errors?.comment && (
              <span className="text-xs text-red-500">{errors.comment}</span>
            )}
          </div>

          <div className="h-px bg-gray-200" />

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#4F30A9] px-5 py-2 text-sm text-white disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};