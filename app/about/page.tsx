"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ParticlesBackground } from "@/components/particles-background";
import { useEffect, useState } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface AboutInfo {
  title: string;
  subtitle: string;
  description: string[];
  image: string;
  skills: string[];
}

export default function AboutPage() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>({
    title: "About Me",
    subtitle: "CG Artist & Designer",
    description: [],
    image: "/images/cg (3).jpg",
    skills: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const response = await fetch("/api/site-info");
        if (response.ok) {
          const data = await response.json();
          setAboutInfo(data.about);
        }
      } catch (error) {
        console.error("Failed to fetch about info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteInfo();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-primary/20 to-black pt-24">
      <ParticlesBackground />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="order-2 lg:order-1">
            <h1 className="mb-6 text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
              {aboutInfo.title.split(" ")[0]}{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                {aboutInfo.title.split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <div className="space-y-6 text-lg text-white/90">
              {aboutInfo.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                Specializations
              </h2>
              <div className="flex flex-wrap gap-3">
                {aboutInfo.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/10 p-1 backdrop-blur-sm">
              <Image
                src={aboutInfo.image}
                alt={`${aboutInfo.title} - ${aboutInfo.subtitle}`}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
