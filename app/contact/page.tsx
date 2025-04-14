"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  availableFor: string[];
}

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "contact@example.com",
    phone: "+1 (555) 123-4567",
    location: "Los Angeles, CA",
    availableFor: ["Freelance", "Collaboration", "Full-time", "Consultation"],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const response = await fetch("/api/site-info");
        if (response.ok) {
          const data = await response.json();
          setContactInfo(data.contact);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteInfo();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formState);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-primary/20 to-black pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl"
        >
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
              Get in{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="mx-auto max-w-[600px] text-lg text-gray-200">
              Let's discuss your project and bring your vision to life
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-sm shadow-lg"
              >
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-white">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>{contactInfo.email}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-white">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>{contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-white">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{contactInfo.location}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-sm shadow-lg"
              >
                <h2 className="mb-4 text-xl font-semibold text-white">
                  Available For
                </h2>
                <div className="flex flex-wrap gap-2">
                  {contactInfo.availableFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-primary/30 px-3 py-1 text-sm font-medium text-white shadow-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-sm shadow-lg"
            >
              <div className="grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-white/30 bg-black/50 px-4 py-2.5 text-white placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-white"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-white/30 bg-black/50 px-4 py-2.5 text-white placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/30 bg-black/50 px-4 py-2.5 text-white placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Project Discussion"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    rows={6}
                    className="w-full rounded-lg border border-white/30 bg-black/50 px-4 py-2.5 text-white placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-blue-500 px-6 py-3 text-white font-medium shadow-md hover:from-primary hover:to-blue-600"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </motion.button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
