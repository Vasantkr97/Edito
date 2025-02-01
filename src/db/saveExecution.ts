import { currentUser } from "@clerk/nextjs/server";
import prisma from "./client";
import { getUser } from "./user";

interface saveExecutionArgs {
    language: string;
    code: string;
    output: string;
    error: string;
}

export async function saveExecution( args: saveExecutionArgs) {
    try {
        const clerkUser = await currentUser();
        const user = clerkUser ? await getUser(clerkUser.id) : null;

        if (!user) {
            throw new Error("User not Authenticated");
        }

        return await prisma.codeExecution.create({
            data: {
                userId: user.id,
                language: args.language,
                code: args.code,
                output: args.output || "",
                error: args.error || "",
            },
        })
    } catch (error) {
        throw new Error("Failed to save execution");
    }


}