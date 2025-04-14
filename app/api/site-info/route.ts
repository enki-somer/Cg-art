import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

// Define the data file path
const dataDir = path.join(process.cwd(), "data");
const siteInfoFile = path.join(dataDir, "site-info.json");

// Define the data structure
interface SiteInfo {
  about: {
    title: string;
    subtitle: string;
    description: string[];
    image: string;
    skills: string[];
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    availableFor: string[];
  };
}

// Initialize the data file if it doesn't exist
const initDataFile = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(siteInfoFile)) {
    const initialSiteInfo: SiteInfo = {
      about: {
        title: "About Me",
        subtitle: "CG Artist & Designer",
        description: [
          "As a passionate CG artist, I blend creativity with technical expertise to bring imagination to life. My journey in digital art spans over several years, during which I've developed a deep understanding of 3D modeling, texturing, and environmental design.",
          "I specialize in creating immersive environments and compelling character designs that tell stories and evoke emotions. My work combines traditional artistic principles with cutting-edge digital techniques to achieve unique and memorable results.",
          "Whether it's crafting detailed character models, designing expansive environments, or creating concept art, I approach each project with dedication and creativity. I'm constantly exploring new techniques and pushing the boundaries of what's possible in CG artistry."
        ],
        image: "/images/cg (3).jpg",
        skills: [
          "3D Modeling",
          "Environment Design",
          "Character Art",
          "Texturing",
          "Concept Art",
          "Digital Sculpting"
        ]
      },
      contact: {
        email: "contact@example.com",
        phone: "+1 (555) 123-4567",
        location: "Los Angeles, CA",
        availableFor: [
          "Freelance",
          "Collaboration",
          "Full-time",
          "Consultation"
        ]
      }
    };
    
    fs.writeFileSync(siteInfoFile, JSON.stringify(initialSiteInfo, null, 2));
  }
};

// GET handler - retrieve site information
export async function GET() {
  try {
    initDataFile();
    const data = fs.readFileSync(siteInfoFile, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading site info:", error);
    return NextResponse.json({ error: "Failed to load site information" }, { status: 500 });
  }
}

// POST handler - update site information
export async function POST(request: NextRequest) {
  try {
    initDataFile();
    
    const body = await request.json();
    const currentData = JSON.parse(fs.readFileSync(siteInfoFile, "utf8"));
    
    // Update only the fields that were provided
    const updatedData = {
      about: {
        ...currentData.about,
        ...(body.about || {})
      },
      contact: {
        ...currentData.contact,
        ...(body.contact || {})
      }
    };
    
    fs.writeFileSync(siteInfoFile, JSON.stringify(updatedData, null, 2));
    
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error updating site info:", error);
    return NextResponse.json({ error: "Failed to update site information" }, { status: 500 });
  }
} 