import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, LogOut } from "lucide-react";

interface LocationState {
  userData?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState<LocationState["userData"] | null>(
    null
  );

  useEffect(() => {
    const state = location.state as LocationState | null;
  }, [location, navigate]);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Ваш обліковий запис успішно підтверджено!
          </h1>

          {userData && (
            <div className="mb-6">
              <p className="text-xl text-gray-700 font-semibold">
                {userData.firstName} {userData.lastName}
              </p>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          )}

          <p className="text-gray-600 mb-8 leading-relaxed">
            Ласкаво просимо на Facebook
          </p>

          {/* Features List */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                Спілкуйтеся з друзями
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                Діліться своїми моментами
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                Приєднуйтесь до спільнот
              </li>
            </ul>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
