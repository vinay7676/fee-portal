

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { BASE_URL } from "./Apipath";
import { toast } from "react-hot-toast";
import {
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RefreshCcw,
  BarChart3,
  PieChart,
} from "lucide-react";

Chart.register(...registerables);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Helper to format currency properly
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [selYear, setSelYear] = useState(new Date().getFullYear());
  const [syncing, setSyncing] = useState(false);

  const donutRef = useRef(null);
  const barRef = useRef(null);
  const donutInst = useRef(null);
  const barInst = useRef(null);

  useEffect(() => {
    fetchData();

    // Re-fetch whenever the user comes back to this tab/page
    window.addEventListener("focus", fetchData);
    return () => window.removeEventListener("focus", fetchData);
  }, []);

  // Re-fetch monthly stats whenever selected year changes (after initial load)
  useEffect(() => {
    if (!loading) {
      fetchMonthlyStats(selYear);
    }
  }, [selYear]);

  const fetchMonthlyStats = async (year) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/students/monthly-stats?year=${year}`,
        { withCredentials: true },
      );
      setMonthlyStats(res.data.monthly || Array(12).fill(0));
    } catch (err) {
      console.error("Failed to fetch monthly stats", err);
      setMonthlyStats(Array(12).fill(0));
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Auth Check
      await axios.get(`${BASE_URL}/api/adminlogin/getcookie`, {
        withCredentials: true,
      });
      // Fetch Students
      const res = await axios.get(`${BASE_URL}/api/students/all`, {
        withCredentials: true,
      });
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setStudents(data);

      // Fetch monthly stats for the current selected year
      await fetchMonthlyStats(selYear);
    } catch (err) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.get(`${BASE_URL}/api/students/sync`, {
        withCredentials: true,
      });
      toast.success("Google Sheets Synced Successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Sync Failed");
    } finally {
      setSyncing(false);
    }
  };

  // --- Calculations ---
  const totalRevenue = students.reduce((sum, s) => sum + (s.totalFee || 0), 0);
  const totalCollected = students.reduce(
    (sum, s) => sum + (s.paidAmount || 0),
    0,
  );
  const totalPending = students.reduce(
    (sum, s) => sum + (s.pendingDues || 0),
    0,
  );

  // This month's income comes directly from monthlyStats (no frontend date parsing)
  const thisMonthIncome = monthlyStats[new Date().getMonth()] || 0;

  // --- Donut Chart ---
  useEffect(() => {
    if (loading || !donutRef.current) return;
    if (donutInst.current) donutInst.current.destroy();

    donutInst.current = new Chart(donutRef.current, {
      type: "doughnut",
      data: {
        labels: ["Collected", "Pending"],
        datasets: [
          {
            data: [totalCollected, totalPending],
            backgroundColor: ["#4F46E5", "#E2E8F0"],
            borderWidth: 0,
          },
        ],
      },
      options: { cutout: "80%", plugins: { legend: { display: false } } },
    });
  }, [students, loading]);

  // --- Bar Chart ---
  useEffect(() => {
    if (loading || !barRef.current) return;
    if (barInst.current) barInst.current.destroy();

    barInst.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: MONTHS,
        datasets: [
          {
            label: "Collection",
            data: monthlyStats, 
            backgroundColor: "#4F46E5",
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { display: false } },
          x: { grid: { display: false } },
        },
      },
    });
  }, [monthlyStats, loading]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 font-medium">
            Preparing Finance Dashboard...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans mt-20">
      <div className="mx-auto max-w-7xl">
        {/* --- Header --- */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
               ANSH InfoTech Finance Dashboard
            </h1>
            <p className="text-slate-500">Real-time fee collection overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              <RefreshCcw size={16} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing Sheets..." : "Sync Sheets"}
            </button>
          </div>
        </div>

        {/* --- Top Metrics --- */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<BarChart3 className="text-blue-600" />}
            color="blue"
          />
          <MetricCard
            title="Total Collected"
            value={formatCurrency(totalCollected)}
            icon={<CheckCircle className="text-emerald-600" />}
            color="emerald"
          />
          <MetricCard
            title="Total Pending"
            value={formatCurrency(totalPending)}
            icon={<AlertCircle className="text-rose-600" />}
            color="rose"
          />
          <MetricCard
            title="This Month"
            value={formatCurrency(thisMonthIncome)}
            icon={<TrendingUp className="text-indigo-600" />}
            color="indigo"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* --- Recovery Status (Donut) --- */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                Recovery Status
              </h2>
              <PieChart size={20} className="text-slate-400" />
            </div>
            <div className="relative mx-auto mb-8 flex h-48 w-48 items-center justify-center">
              <canvas ref={donutRef} />
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-slate-900">
                  {totalRevenue
                    ? Math.round((totalCollected / totalRevenue) * 100)
                    : 0}
                  %
                </span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Collected
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <StatusRow
                color="bg-indigo-600"
                label="Received"
                value={formatCurrency(totalCollected)}
              />
              <StatusRow
                color="bg-slate-200"
                label="Pending"
                value={formatCurrency(totalPending)}
              />
            </div>
          </div>

          {/* --- Monthly Collection Bar Chart --- */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                Monthly Trends ({selYear})
              </h2>
              <select
                value={selYear}
                onChange={(e) => setSelYear(Number(e.target.value))}
                className="rounded-lg bg-slate-50 px-3 py-1 text-sm font-semibold border-none outline-none ring-1 ring-slate-200"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-64">
              <canvas ref={barRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---
function MetricCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50",
    emerald: "bg-emerald-50",
    rose: "bg-rose-50",
    indigo: "bg-indigo-50",
  };
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <div
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusRow({ color, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="font-medium text-slate-500">{label}</span>
      </div>
      <span className="font-bold text-slate-700">{value}</span>
    </div>
  );
}