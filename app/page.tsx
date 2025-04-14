"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThreeScene } from "@/components/three-scene";
import { ParticlesBackground } from "@/components/particles-background";
import Image from "next/image";
import Link from "next/link";

interface ArtworkItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [featuredWorks, setFeaturedWorks] = useState<ArtworkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Ensure component is mounted before animations start
  useEffect(() => {
    setIsRendered(true);
  }, []);

  // Show content immediately but with animation after component is mounted
  useEffect(() => {
    if (isRendered) {
      setIsContentVisible(true);
    }
  }, [isRendered]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        // Add cache headers and retry logic
        console.log("Home page: Fetching artworks...");

        // Use a timestamp to ensure we get fresh data
        const timestamp = Date.now();
        const response = await fetch(`/api/artworks?t=${timestamp}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch artworks: ${response.status}`);
        }

        const allArtworks = await response.json();
        console.log(
          `Home page: Successfully fetched ${allArtworks.length} artworks`
        );

        // Log the first few artworks for debugging
        if (allArtworks.length > 0) {
          console.log(
            "Home page: First few artworks:",
            allArtworks
              .slice(0, Math.min(3, allArtworks.length))
              .map((a: ArtworkItem) => `${a.id}: ${a.title} (${a.category})`)
              .join(", ")
          );
        }

        // Ensure we have artworks before shuffling
        if (allArtworks && allArtworks.length > 0) {
          const randomWorks = shuffleArray([...allArtworks]).slice(0, 6);
          setFeaturedWorks(randomWorks);
        }
      } catch (error) {
        console.error("Home page: Failed to load artworks:", error);
        // Set empty array to avoid blocking UI in case of error
        setFeaturedWorks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  // Only render content when component is mounted
  if (!isRendered) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-black via-primary/5 to-black">
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <ThreeScene />
        {isContentVisible && <ParticlesBackground />}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container relative z-10 px-4 text-center text-white"
        >
          <div className="relative mb-8 inline-block">
            <motion.span
              className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-primary via-accent to-primary/50 shadow-glow animate-glow"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isContentVisible ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <h1 className="pl-4 text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isContentVisible ? 1 : 0,
                  y: isContentVisible ? 0 : 20,
                }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              >
                Bringing
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: isContentVisible ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="animate-pulse-slow text-gray-100"
              >
                Imagination to Life
              </motion.span>
            </h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isContentVisible ? 1 : 0,
              y: isContentVisible ? 0 : 20,
            }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mx-auto mb-12 max-w-[700px] text-xl text-gray-200/90 sm:text-2xl"
          >
            Creating stunning visual experiences through CG artistry and
            innovative design
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isContentVisible ? 1 : 0,
              y: isContentVisible ? 0 : 20,
            }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center gap-4"
          >
            <Link
              href="#work"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary to-accent p-0.5 text-lg font-medium text-white shadow-glow transition-shadow hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <span className="relative rounded-md bg-black/80 px-8 py-3 transition-all duration-300 ease-in group-hover:bg-opacity-0">
                View Work
              </span>
            </Link>
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-primary/30 p-0.5 text-lg font-medium text-white backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <span className="relative rounded-md px-8 py-3 transition-all duration-300 ease-in group-hover:bg-primary/10">
                Contact Me
              </span>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <Image
            src="/images/cg (2).jpg"
            alt="Stunning CG artwork showcasing a futuristic cityscape"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            loading="eager"
          />
        </motion.div>
      </section>

      <section id="work" className="py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold tracking-tighter text-primary sm:text-5xl">
              Featured{" "}
              <span className="bg-gradient-to-r from-primary-light via-accent to-primary bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="mx-auto max-w-[600px] text-lg text-gray-400/90">
              A selection of my latest and most impactful projects
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? // Skeleton loading state
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-xl bg-gradient-glass p-1 shadow-glow backdrop-blur-sm"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-primary/5">
                      <div className="absolute inset-0 animate-pulse bg-primary/10" />
                    </div>
                  </div>
                ))
              : featuredWorks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative overflow-hidden rounded-xl bg-gradient-glass p-1 shadow-glow backdrop-blur-sm transition-all duration-300 hover:shadow-glow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-dark opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute inset-0 flex items-end p-6 opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <div className="transform text-white">
                          <h3 className="mb-2 text-xl font-semibold">
                            {artwork.title}
                          </h3>
                          <p className="mb-4 text-sm text-gray-300/90">
                            {artwork.description}
                          </p>
                          <span className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-accent/20 px-3 py-1 text-sm text-primary-light backdrop-blur-sm">
                            {artwork.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 text-white shadow-glow transition-all hover:shadow-glow-lg"
            >
              View All Works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
