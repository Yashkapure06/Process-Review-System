import { NextResponse } from "next/server";
import processesData from "@/data/processes.json";

/*
 * GET /api/processes
 * Returns the list of processes with simulated network delay
 */
export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    return NextResponse.json(processesData.processes, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching processes:", error);
    return NextResponse.json(
      { error: "Failed to fetch processes" },
      { status: 500 }
    );
  }
}
