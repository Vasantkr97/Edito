import { getUser } from "./user";
import prisma from "./client";
import {  currentUser } from "@clerk/nextjs/server";

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


export const deleteSnippet = async ( snippetId: string ) => {

    try {
        const clerkUser = await currentUser();
        const user = clerkUser ? await getUser(clerkUser.id) : null;

        if (!user) throw new Error("Not Authenticated");

        const snippet = await prisma.snippet.findUnique({
            where: { id: snippetId }
        })
        
        if (!snippet) throw new Error("Snippet not found");
        

        if (user.id !== snippet.userId) throw new Error("Not authorized to delete this snippet");

        // Delete Comments
        await prisma.comments.deleteMany({
            where: {
                snippetId: snippet.id,
            }
        })

        // Delete Stars
        await prisma.star.deleteMany({
            where: {
                snippetId: snippet.id,
            }
        })

        //Delete Snippet
        await prisma.snippet.delete({
            where: {
                id: snippet.id
            }
        })
    } catch(error) {
        console.log("error in creating", error);
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
        return snippet;
    } catch (error) {
        console.error("Error fetching snippet from database:", error);
        throw new Error("Failed to fetch Snippet")
    }
}


export const snippetStarred = async (snippetId: string,userId:string) => {
    try {
        const star = await prisma.star.findFirst({
            where: {
                userId,
                snippetId
            }
        })

        return !!star;
    } catch(error) {
        console.log("error in SnippetStarred function:", error);
        return false;
    }
}


export const getStarCount = async ( id: string ) => {
    try {
        const starsCount = await prisma.star.count({
            where: {
                snippetId: id,
            }
        })

        return starsCount;
    } catch (error) {
        console.error("Error fetching star count:", error);
        throw new Error("Failed to fetch star count");
    }
}


export const starSnippet = async (snippetId: string) => {

    try{
        const clerkUser = await currentUser();
        const user = clerkUser ? await getUser(clerkUser.id) : null;

        if (!user) throw new Error("Not Authenticated");

        const existingStar = await prisma.star.findUnique({
            where: {
                userId_snippetId: {
                    userId: user.id,
                    snippetId: snippetId,
                }
            }
        })
        console.log("existing Star",existingStar)

        if (existingStar) {
            console.log("deleteing star")
            await prisma.star.delete({
                where: {
                    userId_snippetId: {
                        userId: user.id,
                        snippetId: snippetId
                    }
                }
            })
            return { isStarred: false };
        } else {
            await prisma.star.create({
                data: {
                    userId: user.id,
                    snippetId: snippetId,
                }
            })
            return { isStarred: true };
        }
    }catch (error) {
        throw new Error("Something went wrong in the snippetStar");
    }
}

export const getComments = async (snippetId: string) => {
    try {
        const comment = await prisma.comments.findMany({
            where: {
                snippetId: snippetId,
            },
            orderBy: {
                createdAt: 'desc',
            }
        })
        return comment;
    }catch (error) {
        console.log("erro fetching Comment", error);
        throw error;
    }
};

export const addComment = async (snippetId: string, content: string) => {
    try {
        const clerkUser = await currentUser();
        const user = clerkUser ? await getUser(clerkUser.id) : null;

        if (!user) throw new Error("Not Authenticated");

        const comment = await prisma.comments.create({
            data: {
                snippetId,
                userId: user.id,
                userName: user.userName,
                content
            }
        })

        return comment
    } catch (error) {
        console.log("Error adding Comment", error);
        throw new Error("Failed to add comment");
    }
}

export const deleteComment = async (commentId: string) => {
    try {
        const clerkUser = await currentUser();
        const user = clerkUser ? await getUser(clerkUser.id) : null;

        if (!user) throw new Error("Not authenticated!");

        const comment = await prisma.comments.findUnique({
            where: { 
                id: commentId
            },
        })

        if (!comment) throw new Error("Comment not Found");

        if (comment.userId !== user.id) {
            throw new Error("Not authorized to delete this comment!");
        }

        await prisma.comments.delete({
            where: {
                id: commentId,
            },
        })
    } catch (error) {
        console.log("Error deleting comment:", error);
        throw new Error("Failed to delete Comment");
    }
}