import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { loginClient } from "@/app/actions";
import Link from "next/link";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams;
    const error = params.error;

    const errorMessages: Record<string, string> = {
        missing_fields: "Please fill in all fields.",
        invalid_credentials: "Invalid email or password.",
        server_error: "A server error occurred. Please try again later.",
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="w-16 h-16 bg-[#3b82f6] rounded-2xl flex items-center justify-center text-white font-bold shadow-lg mx-auto text-3xl">
                    S
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Social Data Vault
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Secure forensics portal for clients
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="shadow-lg border-0 ring-1 ring-gray-200">
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Enter your email and password to access your portal.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                                {errorMessages[error] || "An error occurred."}
                            </div>
                        )}
                        <form action={loginClient} className="space-y-6">
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
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6] sm:text-sm"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button type="submit" className="w-full h-11 text-base">
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t rounded-b-xl flex flex-col items-center gap-2">
                        <Link href="/register" className="text-sm text-[#3b82f6] hover:underline font-medium">
                            Don&apos;t have an account? Create one
                        </Link>
                        <p className="text-xs text-gray-500">
                            Protected by end-to-end encryption and chain-of-custody logging.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
