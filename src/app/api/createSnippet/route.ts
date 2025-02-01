import { createSnippet } from "@/src/db/snippet";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const { title, language, code } = await req.json();

        if (!title || !language || !code) {
            return NextResponse.json(
                {error: "Missing required fields: title, language, or code"},
                { status: 400 }
            )
        }

        const snippet = await createSnippet({ title, language, code });
        return NextResponse.json({ snippet }, { status: 201 } )
    } catch (error) {
        console.error("Error in Snippet Route", error);
        return NextResponse.json(
            { error: "Failed to create snippet"},
            { status: 500 }
        )
    }
}