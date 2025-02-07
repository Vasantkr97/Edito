import { deleteComment } from "@/src/db/snippet";
import { getUser } from "@/src/db/user";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, {params}: {params: { id: string }}) {
    try {
        const { id: commentId } =  await params;
        const clerkUser = await currentUser();
        const user = clerkUser ? getUser(clerkUser?.id) : null;

        if (!user) throw new Error("Not authenticated!")

        if (!commentId) {
            return NextResponse.json({ error: "Comment ID is required"}, { status: 400 })
        }

        await deleteComment(commentId);

        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log("Error deleting Comment:", error);
        return NextResponse.json({ error: "Internal server error"}, { status: 500 })
    }
}