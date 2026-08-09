import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../common";
import { useToast } from "../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const CouponsPage = () => {
  const { success, error } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const fetchCoupons = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/coupons/my-coupons`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setCoupons(result.data || []);
      } else {
        error("Failed to load your coupons");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleRegisterCoupon = async () => {
    if (!couponCode.trim()) {
      error("Please enter a coupon code");
      return;
    }

    try {
      setRegisterLoading(true);
      const response = await fetch(`${BaseUrl}/api/coupons/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: couponCode }),
      });

      const result = await response.json();

      if (response.ok) {
        success("Coupon registered successfully!");
        setCouponCode("");
        setIsRegisterOpen(false);
        await fetchCoupons();
      } else {
        error(result.message || "Failed to register coupon");
      }
    } catch (error) {
      console.log(error);
      error("Failed to register coupon");
    } finally {
      setRegisterLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading coupons...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard", "Coupons"]}
          title="My Coupons"
          subtitle="Your registered discount coupons"
          buttonLabel="Register Coupon"
          onButtonClick={() => setIsRegisterOpen(true)}
        />
      </div>

      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md">
            <div className="w-full overflow-hidden rounded-xl bg-white font-sans">
              <div className="flex items-center justify-between rounded-t-xl bg-[#4F30A9] px-6 py-4">
                <h2 className="m-0 text-[15px] font-semibold text-white">Register Coupon</h2>
              </div>

              <div className="px-6 py-6">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-medium">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                    />
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterOpen(false);
                        setCouponCode("");
                      }}
                      disabled={registerLoading}
                      className="rounded-lg border border-gray-300 px-5 py-2 text-sm disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRegisterCoupon}
                      disabled={registerLoading}
                      className="rounded-lg bg-[#4F30A9] px-5 py-2 text-sm text-white disabled:opacity-50"
                    >
                      {registerLoading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ml-3 mr-3">
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <div className="text-gray-300 mb-4">No coupons registered</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No coupons yet</h3>
            <p className="text-gray-500">Register a coupon code to see your discounts</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-[#4F30A9]">
                    {coupon.type === "percent" ? `${coupon.value}%` : `$${coupon.value}`}
                  </div>
                  <div className="text-xs text-gray-500 uppercase font-medium">
                    {coupon.type === "percent" ? "Percentage" : "Fixed"}
                  </div>
                </div>

                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {coupon.code}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  {coupon.minOrder > 0 && (
                    <div>Min order: ${coupon.minOrder}</div>
                  )}
                  {coupon.maxDiscount && (
                    <div>Max discount: ${coupon.maxDiscount}</div>
                  )}
                  {coupon.expiresAt && (
                    <div>Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</div>
                  )}
                  {coupon.usageLimit && (
                    <div>Usage: {coupon.usedCount || 0}/{coupon.usageLimit}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};