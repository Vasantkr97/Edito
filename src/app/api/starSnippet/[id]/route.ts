import { starSnippet } from "@/src/db/snippet";
import { getUser } from "@/src/db/user";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
    try {
        const { id: snippetId } = await params;
                
        if(!snippetId) {
            return NextResponse.json({ error: "Snippet ID id required" }, { status: 400 });
        };
        
        const clerkUser = await currentUser();
        const user = clerkUser ? await getUser(clerkUser.id) : null;

        if (!user) {
            throw new Error("User not found in the database")
        };

        const starTheSnippet = await starSnippet(snippetId);
        return NextResponse.json({ message: "Snippet starred successfully", isStarred: starTheSnippet}, { status: 200 });

    } catch (error) {
        console.log("error while starring the snippet:", error);
        return NextResponse.json({ error: "internal server Error"}, { status:  500 })
    }
} 