import { addComment } from "@/src/db/snippet";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
    
    try {
        const body = await req.json();
        const { snippetId, content }= body;

        if (!snippetId || !content?.trim()) {
            return NextResponse.json({ error: "INvalid input"}, { status: 400 });
        }

        const comment = await addComment(snippetId, content);
        
        return NextResponse.json(comment, { status: 201 });

    } catch(error) {
        console.log("Error adding Comment", error);
        return NextResponse.json({ error: "internal server error"}, { status: 500 });
    }
}