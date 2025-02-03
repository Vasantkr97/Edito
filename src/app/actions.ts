'use server';
import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "../db/user";


export async function fetchUser() {
    const  clerkId  = await currentUser();
    const user = clerkId ? await getUser(clerkId.id) : null;
    return user
}