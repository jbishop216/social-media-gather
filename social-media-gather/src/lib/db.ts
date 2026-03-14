import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const prismaClientSingleton = () => {
    const dbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL !== "undefined"
        ? process.env.DATABASE_URL
        : "file:./dev.db";

    let url = dbUrl;
    let authToken = undefined;

    if (dbUrl.includes("?authToken=")) {
        const parts = dbUrl.split("?authToken=");
        url = parts[0];
        authToken = parts[1];
    }

    const adapter = new PrismaLibSql({
        url: url,
        authToken: authToken
    })
    return new PrismaClient({ adapter })
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma
