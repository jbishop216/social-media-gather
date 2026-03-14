import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, CheckCircle2, Clock, AlertCircle, ExternalLink, ChevronDown } from "lucide-react";
import { getCurrentUser, logoutClient, requestPlatformArchive, updateRequestStatus } from "@/app/actions";
import { redirect } from "next/navigation";
import { platformConfig } from "@/lib/platforms";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              S
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">Social Data Vault</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500 mr-4">{user.name || user.email}</span>
            <form action={logoutClient}>
              <Button variant="outline" size="sm" type="submit">Log out</Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Data Collection Dashboard</h2>
          <p className="text-gray-500 text-lg max-w-2xl">
            Welcome to your secure data portal. Follow the guided steps for each platform
            to request and collect your social media data archives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {user.requests.map((request) => (
            <PlatformCard key={request.id} request={request} />
          ))}
        </div>
      </main>
    </div>
  );
}

function PlatformCard({ request }: { request: any }) {
  const meta = platformConfig[request.platform];
  if (!meta) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { variant: "default" as const, icon: <AlertCircle className="w-4 h-4 mr-1" />, label: "Not Started" };
      case "requesting":
        return { variant: "secondary" as const, icon: <Clock className="w-4 h-4 mr-1 animate-pulse" />, label: "In Progress" };
      case "waiting":
        return { variant: "outline" as const, icon: <Clock className="w-4 h-4 mr-1" />, label: "Waiting for Archive" };
      case "ready":
        return { variant: "destructive" as const, icon: <UploadCloud className="w-4 h-4 mr-1 animate-bounce" />, label: "Ready to Upload" };
      case "completed":
        return { variant: "default" as const, icon: <CheckCircle2 className="w-4 h-4 mr-1" />, label: "Completed" };
      default:
        return { variant: "outline" as const, icon: null, label: "Unknown" };
    }
  };

  const config = getStatusConfig(request.status);
  const lastUpdated = new Date(request.updatedAt).toLocaleDateString() + " " + new Date(request.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Bind actions
  const handleRequest = requestPlatformArchive.bind(null, request.id);
  const handleConfirmSubmitted = updateRequestStatus.bind(null, request.id, "waiting", "Archive request submitted. Waiting for " + request.platform + " to process.");
  const handleConfirmReceived = updateRequestStatus.bind(null, request.id, "ready", "Archive received and ready for upload.");
  const handleMarkComplete = updateRequestStatus.bind(null, request.id, "completed", "Archive uploaded and securely vaulted.");

  return (
    <Card className="flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={meta.icon} alt={request.platform} className="w-6 h-6 rounded-sm object-contain" />
          <CardTitle className="text-lg text-gray-900">{request.platform}</CardTitle>
        </div>
        <Badge variant={config.variant} className="ml-2 shrink-0">
          {config.icon}
          {config.label}
        </Badge>
      </CardHeader>

      <CardContent className="flex-grow pt-3 space-y-4">
        <CardDescription className="text-sm">{meta.description}</CardDescription>

        {/* Status Note */}
        {request.statusNote && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800">
            {request.statusNote}
          </div>
        )}

        {/* Estimated Ready Time */}
        {request.estimatedReady && request.status !== "completed" && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            Expected ready by: {new Date(request.estimatedReady).toLocaleDateString()} {new Date(request.estimatedReady).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}

        {/* Step-by-Step Instructions (shown during requesting / waiting) */}
        {(request.status === "requesting" || request.status === "waiting") && (
          <details className="group" open={request.status === "requesting"}>
            <summary className="flex items-center cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              <ChevronDown className="w-4 h-4 mr-1 transition-transform group-open:rotate-180" />
              Step-by-step instructions
            </summary>
            <div className="mt-3 space-y-2">
              {meta.steps.map((step, i) => (
                <div key={i} className="flex items-start text-sm text-gray-600">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#3b82f6] text-white rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 font-medium">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
              <a
                href={meta.exportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-2 px-3 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-md hover:bg-[#2563eb] transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open {request.platform} Export Page
              </a>
              <p className="text-xs text-gray-400 mt-1">
                ⏱ Estimated wait: {meta.estimatedWaitTime} · {meta.linkExpiryNote}
              </p>
            </div>
          </details>
        )}

        <div className="text-xs text-gray-400 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Last updated: {lastUpdated}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t bg-gray-50/50 rounded-b-xl">
        {/* Step 1: Start the process */}
        {request.status === "pending" && (
          <form action={handleRequest} className="w-full">
            <Button className="w-full font-medium" variant="default" type="submit">
              Request Data Archive
            </Button>
          </form>
        )}

        {/* Step 2: User confirms they submitted the request on the platform */}
        {request.status === "requesting" && (
          <form action={handleConfirmSubmitted} className="w-full">
            <Button className="w-full font-medium bg-amber-500 hover:bg-amber-600 text-white" type="submit">
              I&apos;ve Submitted the Request
            </Button>
          </form>
        )}

        {/* Step 3: User confirms they received the archive */}
        {request.status === "waiting" && (
          <form action={handleConfirmReceived} className="w-full">
            <Button className="w-full font-medium bg-indigo-600 hover:bg-indigo-700 text-white" type="submit">
              I Received My Archive
            </Button>
          </form>
        )}

        {/* Step 4: Upload the archive */}
        {request.status === "ready" && (
          <form action={handleMarkComplete} className="w-full">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md font-medium" type="submit">
              <UploadCloud className="w-4 h-4 mr-2" />
              Mark as Uploaded
            </Button>
          </form>
        )}

        {/* Completed */}
        {request.status === "completed" && (
          <div className="w-full flex items-center justify-center text-sm text-green-700 bg-green-50 p-2 rounded-md border border-green-100 font-medium">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Securely vaulted
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
