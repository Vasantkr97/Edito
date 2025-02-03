import { getSnippets } from "@/src/db/snippet";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const snippets = await getSnippets();
        return NextResponse.json(snippets, { status: 200})
    } catch(error) {
        return NextResponse.json(
            { error: "Failed to fetch Snippets"},
            { status: 500 }
        )
    }
}