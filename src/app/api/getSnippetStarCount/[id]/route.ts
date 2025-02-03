import { getStarCount } from "@/src/db/snippet";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params:{ id: string}}) {

    try {
        const { id: snippetId } = await params;

        if (!snippetId) {
            return NextResponse.json({ error: "Snippet ID is required"}, { status: 400})
        }

        const starCount = await getStarCount(snippetId);

        return NextResponse.json({ starCount}, { status: 200 });
    } catch (error) {
        console.error("Error fetching star count:", error);
        return NextResponse.json({ error: "Failed to fetch star count" }, { status: 500 });
    }
}