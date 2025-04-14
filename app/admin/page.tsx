"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  Upload,
  Lock,
  CheckCircle,
  Edit,
  Save,
  Settings,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin,
  Plus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { CloudinaryUploadWidget } from "@/components/CloudinaryUploadWidget";

interface ArtworkItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

interface AboutInfo {
  title: string;
  subtitle: string;
  description: string[];
  image: string;
  skills: string[];
}

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  availableFor: string[];
}

interface SiteInfo {
  about: AboutInfo;
  contact: ContactInfo;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { user, isAdmin, signOut: authSignOut } = useAuth();

  // New state for managing tabs and site info
  const [activeTab, setActiveTab] = useState<"gallery" | "about" | "contact">(
    "gallery"
  );
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    about: {
      title: "About Me",
      subtitle: "CG Artist & Designer",
      description: [],
      image: "/images/cg (3).jpg",
      skills: [],
    },
    contact: {
      email: "contact@example.com",
      phone: "+1 (555) 123-4567",
      location: "Los Angeles, CA",
      availableFor: [],
    },
  });
  const [newSkill, setNewSkill] = useState("");
  const [newAvailability, setNewAvailability] = useState("");
  const [tempDescription, setTempDescription] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState({
    about: false,
    contact: false,
  });

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/unauthorized");
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchArtworks = async () => {
    try {
      const response = await fetch("/api/artworks");
      if (!response.ok) throw new Error("Failed to fetch artworks");
      const data = await response.json();
      setArtworks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this should be a secure authentication process
    if (password === "Bat160") {
      setIsAuthenticated(true);
      setError("");
      fetchArtworks();
      fetchSiteInfo();
    } else {
      setError("Invalid password");
    }
  };

  const handleAddArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate that we have an image
      if (!newArtwork.image) {
        setError("Please upload an image first");
        setIsLoading(false);
        return;
      }

      // Log the data we're sending to help debug
      console.log("Sending artwork data:", newArtwork);

      const response = await fetch("/api/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        body: JSON.stringify(newArtwork),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error response:", errorData);
        throw new Error(`Failed to add artwork: ${response.status}`);
      }

      const data = await response.json();
      console.log("Artwork added successfully:", data);

      // Add to the state
      setArtworks([data, ...artworks]);

      // Clear the form
      setNewArtwork({
        title: "",
        category: "",
        description: "",
        image: "",
      });

      setSuccess(
        "Artwork added successfully! It will appear in the gallery shortly."
      );

      // Force a revalidation by making multiple GET requests with different cache-busting techniques
      try {
        console.log("Force revalidating artwork cache...");

        // Method 1: Use no-store cache option
        await fetch("/api/artworks", {
          method: "GET",
          cache: "no-store",
          headers: {
            "x-force-revalidate": "true",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });

        // Method 2: Use timestamp query parameter to bust cache
        const timestamp = new Date().getTime();
        await fetch(`/api/artworks?t=${timestamp}`, {
          method: "GET",
          cache: "no-store",
        });

        // Method 3: Attempt to manually revalidate the paths
        try {
          await fetch("/api/revalidate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paths: ["/work", "/"],
            }),
          });
        } catch (revalidatePathError) {
          console.warn("Path revalidation failed:", revalidatePathError);
        }

        console.log("Cache revalidation attempts completed");
      } catch (revalidateError) {
        console.warn("Failed to force revalidation:", revalidateError);
        // We don't need to show this error to the user
      }
    } catch (error: any) {
      console.error("Failed to add artwork:", error);
      setError(`Failed to add artwork: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      console.log(`Attempting to delete artwork with ID: ${id}`);

      const response = await fetch(`/api/artworks?id=${id}`, {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Delete artwork error response:", errorData);
        throw new Error(`Failed to delete artwork: ${response.status}`);
      }

      // Remove from state
      setArtworks(artworks.filter((artwork) => artwork.id !== id));
      setSuccess("Artwork deleted successfully!");

      // Force a revalidation to ensure the deletion is reflected everywhere
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paths: ["/work", "/"],
          }),
        });
      } catch (revalidateError) {
        console.warn(
          "Failed to revalidate paths after delete:",
          revalidateError
        );
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete artwork"
      );
    } finally {
      setIsLoading(false);
      setDeleteConfirm(null);
    }
  };

  const fetchSiteInfo = async () => {
    try {
      const response = await fetch("/api/site-info");
      if (!response.ok) throw new Error("Failed to fetch site info");
      const data = await response.json();
      setSiteInfo(data);

      // Initialize tempDescription for text area editing
      if (data.about && data.about.description) {
        setTempDescription(data.about.description);
      }
    } catch (error) {
      setError("Failed to load site information");
    }
  };

  const handleSaveAbout = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Prepare the updated about data
      const updatedAbout = {
        ...siteInfo.about,
        description: tempDescription, // Use the textarea content
      };

      const response = await fetch("/api/site-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ about: updatedAbout }),
      });

      if (!response.ok) throw new Error("Failed to update about information");

      const data = await response.json();
      setSiteInfo(data);
      setIsEditing({ ...isEditing, about: false });
      setSuccess("About information updated successfully!");
    } catch (error) {
      setError("Failed to update about information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContact = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/site-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact: siteInfo.contact }),
      });

      if (!response.ok) throw new Error("Failed to update contact information");

      const data = await response.json();
      setSiteInfo(data);
      setIsEditing({ ...isEditing, contact: false });
      setSuccess("Contact information updated successfully!");
    } catch (error) {
      setError("Failed to update contact information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() === "") return;

    if (!siteInfo.about.skills.includes(newSkill)) {
      const updatedSkills = [...siteInfo.about.skills, newSkill];
      setSiteInfo({
        ...siteInfo,
        about: {
          ...siteInfo.about,
          skills: updatedSkills,
        },
      });
    }

    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = siteInfo.about.skills.filter((s) => s !== skill);
    setSiteInfo({
      ...siteInfo,
      about: {
        ...siteInfo.about,
        skills: updatedSkills,
      },
    });
  };

  const handleAddAvailability = () => {
    if (newAvailability.trim() === "") return;

    if (!siteInfo.contact.availableFor.includes(newAvailability)) {
      const updatedAvailability = [
        ...siteInfo.contact.availableFor,
        newAvailability,
      ];
      setSiteInfo({
        ...siteInfo,
        contact: {
          ...siteInfo.contact,
          availableFor: updatedAvailability,
        },
      });
    }

    setNewAvailability("");
  };

  const handleRemoveAvailability = (item: string) => {
    const updatedAvailability = siteInfo.contact.availableFor.filter(
      (a) => a !== item
    );
    setSiteInfo({
      ...siteInfo,
      contact: {
        ...siteInfo.contact,
        availableFor: updatedAvailability,
      },
    });
  };

  const handleAboutImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setSiteInfo({
        ...siteInfo,
        about: {
          ...siteInfo.about,
          image: data.url,
        },
      });
    } catch (error) {
      setError("Failed to upload image");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => authSignOut()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded flex items-center"
          >
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-500">{success}</span>
          </motion.div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Add New Artwork</h2>
            <form onSubmit={handleAddArtwork} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newArtwork.title}
                  onChange={(e) =>
                    setNewArtwork({ ...newArtwork, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newArtwork.category}
                  onChange={(e) =>
                    setNewArtwork({ ...newArtwork, category: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={newArtwork.description}
                  onChange={(e) =>
                    setNewArtwork({
                      ...newArtwork,
                      description: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                {newArtwork.image ? (
                  <div className="relative w-full h-48 mb-2">
                    <Image
                      src={newArtwork.image}
                      alt="Artwork preview"
                      fill
                      className="object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setNewArtwork({ ...newArtwork, image: "" })
                      }
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <CloudinaryUploadWidget
                    onUpload={(url) =>
                      setNewArtwork({ ...newArtwork, image: url })
                    }
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding..." : "Add Artwork"}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Existing Artworks</h2>
            <div className="space-y-4">
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              ) : (
                artworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="p-4 bg-zinc-900 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{artwork.title}</h3>
                      <p className="text-sm text-gray-400">
                        {artwork.category}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {deleteConfirm === artwork.id ? (
                        <>
                          <button
                            onClick={() => handleDeleteArtwork(artwork.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 bg-zinc-700 text-white rounded hover:bg-zinc-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleDeleteArtwork(artwork.id)}
                          className="p-2 text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
