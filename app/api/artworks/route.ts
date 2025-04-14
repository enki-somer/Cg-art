import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Type definition for artwork items
interface ArtworkItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  createdAt?: string;
}

// Path to store artwork data
const dataFilePath = path.join(process.cwd(), "data", "artworks.json");

// Initial sample artworks
const initialArtworks: ArtworkItem[] = [
  {
    id: "1",
    title: "Mystical Forest",
    category: "Environment",
    image: "/images/cg (1).jpg",
    description: "A serene and enchanting forest environment with magical elements.",
  },
  {
    id: "2",
    title: "Futuristic City",
    category: "Environment",
    image: "/images/cg (2).jpg",
    description: "A sprawling metropolis showcasing advanced architecture and technology.",
  },
  {
    id: "3",
    title: "Digital Warrior",
    category: "3D Character",
    image: "/images/cg (3).jpg",
    description: "A detailed character design blending traditional and futuristic elements.",
  },
  {
    id: "4",
    title: "Ancient Temple",
    category: "Environment",
    image: "/images/cg (4).jpg",
    description: "A mysterious temple environment with intricate architectural details.",
  },
  {
    id: "5",
    title: "Cyber Realm",
    category: "Concept Art",
    image: "/images/cg (5).jpg",
    description: "A conceptual piece exploring themes of technology and nature.",
  },
];

// Make sure the data directory exists
async function ensureDataDir() {
  const dirPath = path.join(process.cwd(), "data");
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath);
  }
  return dirPath;
}

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(dataFilePath);
    console.log("Data file exists already");
  } catch {
    console.log("Creating new data file");
    await ensureDataDir();
    await fs.writeFile(dataFilePath, JSON.stringify(initialArtworks, null, 2));
  }
}

// Helper to read artworks
async function getArtworks(): Promise<ArtworkItem[]> {
  await initDataFile();
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    const artworks = JSON.parse(data) as ArtworkItem[];
    console.log(`Successfully read ${artworks.length} artworks from file storage`);
    return artworks;
  } catch (error) {
    console.error("Error reading artworks file:", error);
    return initialArtworks;
  }
}

// Helper to write artworks
async function writeArtworks(artworks: ArtworkItem[]): Promise<boolean> {
  try {
    await ensureDataDir();
    await fs.writeFile(dataFilePath, JSON.stringify(artworks, null, 2));
    console.log(`Successfully wrote ${artworks.length} artworks to file storage`);
    return true;
  } catch (error) {
    console.error("Error writing artworks file:", error);
    return false;
  }
}

// GET /api/artworks
export async function GET(request: NextRequest) {
  console.log("GET /api/artworks - started");
  
  try {
    const artworks = await getArtworks();
    console.log(`GET /api/artworks - Returning ${artworks.length} artworks`);
    
    // Log the first few artworks for debugging
    if (artworks.length > 0) {
      console.log("Sample artworks:", 
        artworks.slice(0, Math.min(3, artworks.length)).map((a: ArtworkItem) => 
          `${a.id}: ${a.title} (${a.category})`
        )
      );
    }
    
    return NextResponse.json(artworks, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Type": "application/json",
        "x-timestamp": Date.now().toString(),
        "x-random": Math.random().toString()
      }
    });
  } catch (error) {
    console.error("GET /api/artworks - Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch artworks", details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/artworks
export async function POST(request: NextRequest) {
  console.log("POST /api/artworks - started");
  
  try {
    const artworks = await getArtworks();
    const data = await request.json();
    
    console.log("POST /api/artworks - Received new artwork:", {
      title: data.title,
      category: data.category,
      description: data.description?.substring(0, 30) + "...",
      imageLength: data.image?.length || 0
    });
    
    // Create new artwork with unique ID
    const newArtwork: ArtworkItem = {
      id: uuidv4(),
      title: data.title,
      category: data.category,
      description: data.description,
      image: data.image,
      createdAt: new Date().toISOString()
    };
    
    // Add to collection and save
    artworks.push(newArtwork);
    const success = await writeArtworks(artworks);
    
    if (success) {
      console.log("POST /api/artworks - Successfully saved new artwork with ID:", newArtwork.id);
      return NextResponse.json(newArtwork, { 
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Content-Type": "application/json"
        }
      });
    } else {
      throw new Error("Failed to save artwork to file system");
    }
  } catch (error) {
    console.error("POST /api/artworks - Error:", error);
    return NextResponse.json(
      { error: "Failed to create artwork", details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/artworks?id=X
export async function DELETE(request: NextRequest) {
  console.log("DELETE /api/artworks - started");
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      console.error("DELETE /api/artworks - No ID provided");
      return NextResponse.json(
        { error: "Artwork ID is required" },
        { status: 400 }
      );
    }
    
    console.log(`DELETE /api/artworks - Attempting to delete artwork with ID: ${id}`);
    
    // Read current artworks
    const artworks = await getArtworks();
    const initialCount = artworks.length;
    
    // Filter out the one to delete
    const updatedArtworks = artworks.filter(artwork => artwork.id !== id);
    
    // Check if anything was removed
    if (updatedArtworks.length === initialCount) {
      console.log(`DELETE /api/artworks - Artwork with ID ${id} not found`);
      return NextResponse.json(
        { error: "Artwork not found" },
        { status: 404 }
      );
    }
    
    // Save updated collection
    const success = await writeArtworks(updatedArtworks);
    
    if (success) {
      console.log(`DELETE /api/artworks - Successfully deleted artwork with ID: ${id}`);
      return NextResponse.json({ 
        success: true,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Content-Type": "application/json"
        }
      });
    } else {
      throw new Error("Failed to save updated artworks to file system");
    }
  } catch (error) {
    console.error("DELETE /api/artworks - Error:", error);
    return NextResponse.json(
      { error: "Failed to delete artwork", details: String(error) },
      { status: 500 }
    );
  }
} 