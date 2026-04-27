
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loader from "./Loader";

// Lazy Imports
const Login = lazy(() => import("./Login"));
const Home = lazy(() => import("./Home"));
const PageNotFound = lazy(() => import("./Pagenotfound"));


const App = () => {
  return (
    <BrowserRouter>
      <Toaster />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;