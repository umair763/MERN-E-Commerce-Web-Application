import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Package } from "lucide-react";
import { useToast } from "../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const { success } = useToast();
  const toastShownRef = useRef(false);

  const [payment, setPayment] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | paid | pending | failed | error

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const check = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/payments/session/${sessionId}`, {
          credentials: "include",
        });
        const result = await response.json();

        if (response.ok && result.data) {
          if (result.data.status === "paid") {
            if (!cancelled) {
              setPayment(result.data);
              setStatus("paid");
              if (!toastShownRef.current) {
                toastShownRef.current = true;
                success("Payment successful! Your order is confirmed.");
              }
            }
            return;
          }
          if (result.data.status === "failed") {
            if (!cancelled) {
              setPayment(result.data);
              setStatus("failed");
            }
            return;
          }
        }
      } catch (error) {
        // Network hiccup — keep retrying below.
      }

      attempts += 1;
      if (attempts < 6 && !cancelled) {
        setTimeout(check, 1500);
      } else if (!cancelled) {
        setStatus("error");
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [sessionId, success]);

  const order = payment?.order;
  const total = order?.totals?.total;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
        {status === "loading" && (
          <>
            <Loader2 size={48} className="text-[#4F30A9] animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying payment...
            </h1>
            <p className="text-gray-500 text-sm">
              Please wait while we confirm your payment with Stripe.
            </p>
          </>
        )}

        {status === "paid" && (
          <>
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Payment successful!
            </h1>
            <p className="text-gray-500 text-sm mb-4">
              Thank you, your order has been paid and confirmed.
            </p>
            {order && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Package size={16} className="text-[#4F30A9]" />
                  Order:{" "}
                  <span className="font-medium text-gray-900">{order.orderNumber}</span>
                </p>
                {typeof total === "number" && (
                  <p className="text-sm text-gray-600 mt-1">
                    Amount paid:{" "}
                    <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
                  </p>
                )}
              </div>
            )}
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="w-full bg-[#4F30A9] text-white py-3 rounded-lg font-medium hover:bg-[#3d01d2] transition"
            >
              View My Orders
            </button>
          </>
        )}

        {status === "pending" && (
          <>
            <Loader2 size={48} className="text-[#4F30A9] animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Payment processing
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Your payment is being confirmed. This usually takes a few seconds.
            </p>
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Go to My Orders
            </button>
          </>
        )}

        {(status === "failed" || status === "error") && (
          <>
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {status === "failed" ? "Payment failed" : "Unable to verify payment"}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {status === "failed"
                ? "Your payment was not completed. You can try again from your orders."
                : "We could not confirm your payment right now. Check your orders for the latest status."}
            </p>
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="w-full bg-[#4F30A9] text-white py-3 rounded-lg font-medium hover:bg-[#3d01d2] transition"
            >
              Go to My Orders
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
        <XCircle size={48} className="text-amber-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Payment cancelled</h1>
        <p className="text-gray-500 text-sm mb-6">
          You have cancelled the payment. Your order is still open — you can pay for it
          anytime from your orders.
        </p>
        <button
          onClick={() => navigate("/dashboard/orders")}
          className="w-full bg-[#4F30A9] text-white py-3 rounded-lg font-medium hover:bg-[#3d01d2] transition"
        >
          Back to My Orders
        </button>
      </div>
    </div>
  );
};
