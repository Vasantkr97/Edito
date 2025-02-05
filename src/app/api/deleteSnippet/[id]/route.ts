import { deleteSnippet } from "@/src/db/snippet";
import { NextResponse } from "next/server";


export async function DELETE(req: Request, { params }: { params: { id: string} }) {
    try {
        const snippetId = params?.id;

        if (!snippetId) {
            return NextResponse.json({ error: "Snippet Id is required"}, { status: 400 });
        }

        await deleteSnippet(snippetId);

        return NextResponse.json({ message: "Snippet deleted successfully"}, { status: 200 });
    } catch (error) {
        console.log("error deleting snippet:", error);

        return NextResponse.json(
            { error: (error instanceof Error ? error.message : "Internal Server Error") },
            { status: 500 }
        )
    }
}