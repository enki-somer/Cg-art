import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/revalidate - Started");
    
    // Parse the request body
    const data = await request.json();
    const { paths = [] } = data;
    
    if (!Array.isArray(paths) || paths.length === 0) {
      console.error("POST /api/revalidate - No paths provided");
      return NextResponse.json(
        { error: "No paths provided for revalidation" },
        { status: 400 }
      );
    }
    
    console.log(`POST /api/revalidate - Revalidating paths: ${paths.join(', ')}`);
    
    // Revalidate each path
    const results: Record<string, string> = {};
    for (const path of paths) {
      try {
        // Revalidate the path
        revalidatePath(path);
        results[path] = "success";
      } catch (error) {
        console.error(`POST /api/revalidate - Error revalidating path ${path}:`, error);
        results[path] = "error";
      }
    }
    
    console.log("POST /api/revalidate - Completed with results:", results);
    
    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      results
    });
  } catch (error) {
    console.error("POST /api/revalidate - Failed:", error);
    return NextResponse.json(
      { error: "Failed to revalidate", details: String(error) },
      { status: 500 }
    );
  }
} 