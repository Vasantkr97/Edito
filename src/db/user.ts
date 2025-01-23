import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getUser = async (userId: string | null) {
    if (!userId)  {
        return null
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    return user || null

}