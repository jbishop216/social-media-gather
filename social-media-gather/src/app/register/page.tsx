import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { registerClient } from "@/app/actions";
import Link from "next/link";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams;
    const error = params.error;

    const errorMessages: Record<string, string> = {
        missing_fields: "Please fill in all required fields.",
        password_mismatch: "Passwords do not match.",
        password_too_short: "Password must be at least 8 characters.",
        email_exists: "An account with this email already exists.",
        server_error: "A server error occurred. Please try again later.",
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="w-16 h-16 bg-[#3b82f6] rounded-2xl flex items-center justify-center text-white font-bold shadow-lg mx-auto text-3xl">
                    S
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create Your Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Set up access to the Social Data Vault
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="shadow-lg border-0 ring-1 ring-gray-200">
                    <CardHeader>
                        <CardTitle>Register</CardTitle>
                        <CardDescription>Create an account to begin collecting social media data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                                {errorMessages[error] || "An error occurred."}
                            </div>
                        )}
                        <form action={registerClient} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name <span className="text-gray-400">(optional)</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6] sm:text-sm"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6] sm:text-sm"
                                        placeholder="client@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        minLength={8}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6] sm:text-sm"
                                        placeholder="Minimum 8 characters"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        minLength={8}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6] sm:text-sm"
                                        placeholder="Re-enter your password"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button type="submit" className="w-full h-11 text-base">
                                    Create Account
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t rounded-b-xl flex flex-col items-center gap-2">
                        <Link href="/login" className="text-sm text-[#3b82f6] hover:underline font-medium">
                            Already have an account? Sign in
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
