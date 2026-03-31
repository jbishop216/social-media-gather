import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const prismaClientSingleton = () => {
    const dbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL !== "undefined"
        ? process.env.DATABASE_URL
        : "file:./dev.db";

    let url = dbUrl;
    let authToken: string | undefined = undefined;

    if (!dbUrl.startsWith("file:")) {
        try {
            const urlObj = new URL(dbUrl);
            // Standard format: ?authToken=jwt
            authToken = urlObj.searchParams.get("authToken") ?? undefined;
            // Bracket format: ?authToken[jwt]= (some Turso URL formats)
            if (!authToken) {
                for (const [key] of urlObj.searchParams) {
                    if (key.startsWith("authToken[") && key.endsWith("]")) {
                        authToken = key.slice("authToken[".length, -1);
                        break;
                    }
                }
            }
            url = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
        } catch {
            // Fallback: try simple split
            if (dbUrl.includes("?authToken=")) {
                const parts = dbUrl.split("?authToken=");
                url = parts[0];
                authToken = parts[1];
            }
        }
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
