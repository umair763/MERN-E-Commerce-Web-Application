import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, ShoppingBag, Heart, Gift, Zap, Percent, ArrowRight, CheckCircle2, Sparkles, CreditCard, Tag } from "lucide-react";
import { useToast } from "../common";
import { useAuth } from "../context/AuthContext";

const BaseUrl = import.meta.env.VITE_API_URL;

const EMPTY_FORM = {
  name: "",
  email: "",
  contact: "",
  password: "",
  confirmPassword: "",
};

export const SignupPage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let errors = {};

    if (!form.name) errors.name = "Name is required";
    if (!form.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Please enter a valid email";
    if (!form.contact) errors.contact = "Phone number is required";
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) errors.confirmPassword = "Please confirm your password";
    if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BaseUrl}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          contact: form.contact,
          password: form.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        success("Account created successfully!");
        refreshUser();
        navigate("/dashboard");
      } else {
        error(result.message || "Failed to create account");
        setErrors({ general: result.message });
      }
    } catch (err) {
      console.log(err);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 flex items-center justify-center p-2 sm:p-6">
      <div className="w-full max-w-[1200px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side - Form Section */}
        <div className="lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center order-2 lg:order-1">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Create account</h2>
              <p className="text-gray-600">Join StyleHive and start shopping</p>
            </div>

            {errors?.general && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
                <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                aria-label="Sign up with Google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button
                onClick={() => handleSocialLogin('apple')}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                aria-label="Sign up with Apple"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>
              <button
                onClick={() => handleSocialLogin('facebook')}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                aria-label="Sign up with Facebook"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Full name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all ${
                      errors?.name 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    }`}
                    aria-invalid={!!errors?.name}
                    aria-describedby={errors?.name ? "name-error" : undefined}
                  />
                </div>
                {errors?.name && (
                  <p id="name-error" className="text-sm text-red-600 flex items-center gap-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all ${
                      errors?.email 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    }`}
                    aria-invalid={!!errors?.email}
                    aria-describedby={errors?.email ? "email-error" : undefined}
                  />
                </div>
                {errors?.email && (
                  <p id="email-error" className="text-sm text-red-600 flex items-center gap-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="contact" className="text-sm font-medium text-gray-700">Phone number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="contact"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={form.contact}
                    onChange={(e) => handleChange("contact", e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all ${
                      errors?.contact 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    }`}
                    aria-invalid={!!errors?.contact}
                    aria-describedby={errors?.contact ? "contact-error" : undefined}
                  />
                </div>
                {errors?.contact && (
                  <p id="contact-error" className="text-sm text-red-600 flex items-center gap-1">
                    {errors.contact}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl outline-none transition-all ${
                      errors?.password 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    }`}
                    aria-invalid={!!errors?.password}
                    aria-describedby={errors?.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors?.password && (
                  <p id="password-error" className="text-sm text-red-600 flex items-center gap-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl outline-none transition-all ${
                      errors?.confirmPassword 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    }`}
                    aria-invalid={!!errors?.confirmPassword}
                    aria-describedby={errors?.confirmPassword ? "confirmPassword-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors?.confirmPassword && (
                  <p id="confirmPassword-error" className="text-sm text-red-600 flex items-center gap-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-6"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/signin" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1">
                  Sign in
                  <ArrowRight size={16} />
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Onboarding Section */}
        <div className="lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-4 sm:p-6 lg:p-8 relative overflow-hidden order-1 lg:order-2">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <ShoppingBag size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white">StyleHive</span>
            </div>

            {/* Main Content */}
            <div className="py-8 lg:py-12">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-yellow-300" size={24} />
                <span className="text-yellow-300 font-semibold text-sm uppercase tracking-wider">Exclusive Benefits</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Your Shopping Journey Starts
              </h1>
              <p className="text-lg text-white/80 mb-12 max-w-md">
                Unlock exclusive rewards, personalized recommendations, and a seamless shopping experience tailored just for you.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-colors">
                  <h3 className="text-white font-semibold mb-1">Welcome Rewards</h3>
                  <p className="text-white/70 text-sm">$50 credit on signup</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-colors">
                  <h3 className="text-white font-semibold mb-1">Exclusive Coupons</h3>
                  <p className="text-white/70 text-sm">Up to 50% off deals</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-colors">
                  <h3 className="text-white font-semibold mb-1">Wishlist Access</h3>
                  <p className="text-white/70 text-sm">Save favorites easily</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-colors">
                  <h3 className="text-white font-semibold mb-1">Flash Sales</h3>
                  <p className="text-white/70 text-sm">Early access alerts</p>
                </div>
              </div>

              {/* Additional Features */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-white/90">
                  <CheckCircle2 size={20} className="text-yellow-300 flex-shrink-0" />
                  <span className="text-sm">Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <CheckCircle2 size={20} className="text-yellow-300 flex-shrink-0" />
                  <span className="text-sm">30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <CheckCircle2 size={20} className="text-yellow-300 flex-shrink-0" />
                  <span className="text-sm">24/7 customer support</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-white">2M+</div>
                <div className="text-white/70 text-sm">Happy Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">$10M+</div>
                <div className="text-white/70 text-sm">Saved by Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-white/70 text-sm">Top Brands</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};