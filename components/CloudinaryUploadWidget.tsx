"use client";

import { useEffect, useState } from "react";

// This type matches the Cloudinary widget's upload response
interface CloudinaryUploadWidgetResults {
  event: string;
  info: {
    secure_url?: string;
  };
}

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void;
}

declare global {
  interface Window {
    cloudinary?: any;
  }
}

export function CloudinaryUploadWidget({
  onUpload,
}: CloudinaryUploadWidgetProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded && typeof window !== "undefined" && !window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    } else if (window.cloudinary) {
      setLoaded(true);
    }
  }, [loaded]);

  const handleUpload = () => {
    if (!loaded || !window.cloudinary) {
      alert(
        "Cloudinary widget is still loading. Please try again in a moment."
      );
      return;
    }

    // Get values from environment variables or use fallbacks for local development
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        multiple: false,
        maxFiles: 1,
        resourceType: "image",
        sources: ["local", "url"],
        showAdvancedOptions: false,
        cropping: true,
        styles: {
          palette: {
            window: "#000000",
            sourceBg: "#222222",
            windowBorder: "#555555",
            tabIcon: "#FFFFFF",
            inactiveTabIcon: "#AAAAAA",
            menuIcons: "#CCCCCC",
            link: "#0078FF",
            action: "#0078FF",
            inProgress: "#0078FF",
            complete: "#33ff00",
            error: "#EA2727",
            textDark: "#000000",
            textLight: "#FFFFFF",
          },
        },
      },
      (error: any, result: CloudinaryUploadWidgetResults) => {
        if (!error && result && result.event === "success") {
          onUpload(result.info.secure_url || "");
        }
      }
    );

    widget.open();
  };

  return (
    <button
      type="button"
      onClick={handleUpload}
      className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition-colors bg-zinc-800"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      Upload Image
    </button>
  );
}
