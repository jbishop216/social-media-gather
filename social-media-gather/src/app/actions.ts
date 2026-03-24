"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/db";
import type { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { platformConfig } from "@/lib/platforms";

const PLATFORMS = ["Google Takeout", "Facebook", "LinkedIn", "X (Twitter)", "Apple", "Amazon"];

export async function loginClient(formData: FormData) {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        redirect("/login?error=missing_fields");
    }

    let user;
    try {
        user = await prisma.user.findUnique({
            where: { email },
        });
    } catch (err) {
        console.error("[loginClient] Database error:", err);
        redirect("/login?error=server_error");
    }

    if (!user) {
        redirect("/login?error=invalid_credentials");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        redirect("/login?error=invalid_credentials");
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_session", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    redirect("/");
}

export async function registerClient(formData: FormData) {
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!email || !password || !confirmPassword) {
        redirect("/register?error=missing_fields");
    }

    if (password !== confirmPassword) {
        redirect("/register?error=password_mismatch");
    }

    if (password.length < 8) {
        redirect("/register?error=password_too_short");
    }

    // Check if user already exists
    let existing;
    try {
        existing = await prisma.user.findUnique({
            where: { email },
        });
    } catch (err) {
        console.error("[registerClient] Database error:", err);
        redirect("/register?error=server_error");
    }

    if (existing) {
        redirect("/register?error=email_exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let user: User;
    try {
        user = await prisma.user.create({
            data: {
                name: name || null,
                email,
                passwordHash,
            },
        });

        // Create default pending requests for all platforms
        await Promise.all(
            PLATFORMS.map((platform) =>
                prisma.dataRequest.create({
                    data: {
                        platform,
                        userId: user.id,
                    },
                })
            )
        );
    } catch (err) {
        console.error("[registerClient] Database error:", err);
        redirect("/register?error=server_error");
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_session", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    redirect("/");
}

export async function logoutClient() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_session");
    redirect("/login");
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("auth_session")?.value;

    if (!sessionId) return null;

    return prisma.user.findUnique({
        where: { id: sessionId },
        include: { requests: true },
    });
}

export async function requestPlatformArchive(requestId: string) {
    const request = await prisma.dataRequest.findUnique({
        where: { id: requestId },
    });

    if (!request) return;

    const config = platformConfig[request.platform];
    const now = new Date();
    const estimatedReady = config
        ? new Date(now.getTime() + config.estimatedWaitMs)
        : new Date(now.getTime() + 48 * 60 * 60 * 1000);

    await prisma.dataRequest.update({
        where: { id: requestId },
        data: {
            status: "requesting",
            requestedAt: now,
            estimatedReady,
            statusNote: "Follow the steps below to request your archive from " + request.platform + ".",
        },
    });

    revalidatePath("/");
}

export async function updateRequestStatus(requestId: string, status: string, note?: string) {
    const validTransitions: Record<string, string[]> = {
        requesting: ["waiting"],
        waiting: ["ready"],
        ready: ["completed"],
    };

    const request = await prisma.dataRequest.findUnique({
        where: { id: requestId },
    });

    if (!request) return;

    const allowed = validTransitions[request.status];
    if (!allowed || !allowed.includes(status)) return;

    await prisma.dataRequest.update({
        where: { id: requestId },
        data: {
            status,
            statusNote: note || null,
            completedAt: status === "completed" ? new Date() : undefined,
        },
    });

    revalidatePath("/");
}
