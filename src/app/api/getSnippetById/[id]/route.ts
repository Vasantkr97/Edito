import { getSnippetById } from "@/src/db/snippet";
import { NextResponse } from "next/server";

export async function GET(req:Request, { params } : { params: { id: string }}) {
   
    try {
        const { id: snippetId } = await params;

        if (!snippetId) {
            return NextResponse.json({ error: "Snippet Id is required"}, { status: 400});
        }

        const snippet = await getSnippetById(snippetId);
        
        if (!snippet) {
            return NextResponse.json({ error: "Snippet not found"}, { status: 404})
        }
        return NextResponse.json(snippet, { status: 200});
    } catch (error) {
        console.error("Error fetching snippet:", error);
        return NextResponse.json({ error: "internal Server Error"}, { status: 400})
    }
}
