import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <AlertTriangle size={60} className="text-red-500 mb-4" />

      <h1 className="text-6xl font-bold text-slate-800">404</h1>
      <p className="text-lg text-slate-600 mt-2">Oops! Page not found</p>

      <Link
        to="/"
        className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default PageNotFound;
