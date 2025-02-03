import prisma from './client'

type CreateUserInput = {
    clerkId: string;
    email: string;
    userName: string;
    createdAt: Date;
}

export const createUser=  async ({ clerkId, email, userName, createdAt } : CreateUserInput) => {
    try {
        const user = await prisma.user.create({
            data: {
                clerkId,
                email,
                userName,
                createdAt,
            }
        })
        return user;
    } catch (err) {
        throw new Error("Failed to create user")
    }
    
}


export const getUser = async (clerkId: string | null) => {
    if (!clerkId)  {
        return null
    }
    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkId
        }
    });

    return user || null

}