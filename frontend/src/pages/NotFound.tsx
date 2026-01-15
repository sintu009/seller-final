import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <style>
        {`
          .water-text {
            color: transparent;
            background: linear-gradient(
              -45deg,
              #2563eb 25%,
              #3b82f6 25%,
              #3b82f6 50%,
              #2563eb 50%,
              #2563eb 75%,
              #3b82f6 75%,
              #3b82f6
            );
            background-size: 200% 200%;
            background-position: 0% 50%;
            -webkit-background-clip: text;
            background-clip: text;
            animation: waveMove 4s linear infinite;
            opacity: 0.9;
          }

          @keyframes waveMove {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }
        `}
      </style>

      <div className="w-full max-w-4xl text-center px-4">
        {/* 404 with Water Animation */}
        <div className="relative inline-block">
          {/* Base Text */}
          <h1 className="text-[160px] font-extrabold text-blue-900 tracking-widest relative z-10">
            404
          </h1>

          {/* Water Layer */}
          <h1 className="absolute inset-0 text-[160px] font-extrabold tracking-widest water-text">
            404
          </h1>
        </div>

        {/* Cable Line */}
        <div className="relative flex items-center justify-center my-6">
          <div className="h-1 bg-blue-600 w-1/3"></div>

          <div className="mx-4 flex gap-2">
            <span className="w-1 h-1 bg-blue-600 rounded-full animate-ping"></span>
            <span className="w-1 h-1 bg-blue-600 rounded-full animate-ping delay-150"></span>
            <span className="w-1 h-1 bg-blue-600 rounded-full animate-ping delay-300"></span>
          </div>

          <div className="h-1 bg-blue-600 w-1/3 relative">
            <div className="absolute -right-6 -top-3 w-6 h-8 bg-blue-600 rounded-sm">
              <div className="absolute -right-2 top-2 w-2 h-1 bg-blue-600"></div>
              <div className="absolute -right-2 top-5 w-2 h-1 bg-blue-600"></div>
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">
          Page Not Found
        </h2>
        <p className="text-gray-500 mt-2">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
          <br />
          Please go back to the Home page.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block mt-8 px-8 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Go back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
