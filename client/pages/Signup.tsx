import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/welcome", {
          state: {
            userData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
            },
          },
        });
      } else {
        setError("Account creation failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Section - Logo & Message */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:items-start lg:p-12 lg:bg-white">
        <div className="max-w-md">
          <h1 className="text-7xl font-black text-blue-600 mb-6">facebook</h1>
          <p className="text-2xl font-bold text-gray-900 leading-tight">
            Приєднуйтеся до Facebook
          </p>
        </div>
      </div>

      {/* Right Section - Signup Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 lg:p-0 lg:w-1/2 lg:bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <h1 className="text-4xl font-black text-blue-600">facebook</h1>
          </div>

          {/* Signup Card */}
          <div className="bg-white rounded-lg lg:rounded-none lg:shadow-none shadow-lg p-6 lg:p-0">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center lg:text-left">
              Створіть обліковий запис
            </h2>
            <p className="text-gray-600 text-sm mb-6 text-center lg:text-left">
              Це займе менше хвилини
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Name Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ім'я"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 text-sm"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Прізвище"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 text-sm"
                  required
                />
              </div>

              {/* Email Input */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Електронна адреса"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 text-sm"
                required
              />

              {/* Password Input */}
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Новий пароль"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 text-sm"
                required
              />

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition-colors duration-200 mt-4"
              >
                {loading ? "Створення..." : "Створити обліковий запис"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>

            {/* Already have account */}
            <p className="text-center text-gray-600 text-sm">
              Вже маєте обліковий запис?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-bold hover:underline"
              >
                Увійти
              </Link>
            </p>

            {/* Footer Links */}
            <div className="mt-6 pt-4 border-t border-gray-300 text-center text-xs text-gray-600 space-y-1">
              <div className="flex flex-wrap justify-center gap-2">
                <button className="hover:underline">Українська</button>
                <span>•</span>
                <button className="hover:underline">Русский</button>
                <span>•</span>
                <button className="hover:underline">English (US)</button>
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
