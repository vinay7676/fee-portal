import React from "react";
import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      {/* Container for the Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <div className="absolute w-15 h-15 border-4 border-blue-100 rounded-full animate-ping"></div>

        {/* Main Spinning Icon */}
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin relative z-10" />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `,
        }}
      />
    </div>
  );
};

export default Loader;
