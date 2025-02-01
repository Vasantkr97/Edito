import { getUser } from "./user";
import prisma from "./client";
import { currentUser } from "@clerk/nextjs/server";

interface snippetArgs {
    title: string;
    language: string;
    code: string;
}

export const createSnippet = async (args: snippetArgs) => {
    try {
        const clerkUser = await currentUser();
        const user = clerkUser ? await getUser(clerkUser.id) : null;

        if (!user) {
            throw new Error("User not found in the database")
        };

        return await prisma.snippet.create({
            data: {
                userId: user.id,
                title: args.title,
                language: args.language,
                code: args.code,
                userName: user.userName,
            }
        })
    } catch (error) {
        console.log("failed to create snippet:", error);
        throw new Error("Failed to Save Snippet")
    }
}


export const getSnippets = async () => {
    try {
        const snippets = await prisma.snippet.findMany({
            orderBy: {
                createdAt: "desc",
            },
        })
        return snippets
    } catch(error) {
        console.log("error in getting snippets", error);
        throw new Error("Failed to get snippets")
    }
}


export const getSnippetById = async (snippetId: string) => {
    console.log("Fetching snippet with ID:", snippetId);
    try {
        const snippet = await prisma.snippet.findUnique({
            where: {
                id: snippetId,
            }
        });

        if (!snippet) {
            console.error(`Snippet with ID ${snippetId} not found`);
            throw new Error("snippet not found");
        }
        console.log("Snippet found:", snippet); 
        return snippet;
    } catch (error) {
        console.error("Error fetching snippet from database:", error);
        throw new Error("Failed to fetch Snippet")
    }
}