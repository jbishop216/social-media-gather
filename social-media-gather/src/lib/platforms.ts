export interface PlatformInfo {
    name: string;
    description: string;
    icon: string;
    exportUrl: string;
    estimatedWaitTime: string;
    estimatedWaitMs: number;
    format: string;
    linkExpiryNote: string;
    steps: string[];
}

export const platformConfig: Record<string, PlatformInfo> = {
    "Google Takeout": {
        name: "Google Takeout",
        description: "Includes Drive, Photos, Gmail, Maps, and YouTube data.",
        icon: "https://www.google.com/favicon.ico",
        exportUrl: "https://takeout.google.com",
        estimatedWaitTime: "Minutes to a few hours",
        estimatedWaitMs: 2 * 60 * 60 * 1000, // 2 hours
        format: "ZIP or TGZ archive",
        linkExpiryNote: "Download link expires in 7 days.",
        steps: [
            "Go to takeout.google.com and sign in with your Google account.",
            "Click \"Deselect all\" first, then select only the services you need (or keep all selected).",
            "Scroll to the bottom and click \"Next step\".",
            "Choose delivery method: \"Send download link via email\" is recommended.",
            "Select \"Export once\", file type \".zip\", and max file size.",
            "Click \"Create export\" and wait for the email notification.",
            "Once you receive the email, download the archive file(s).",
            "Return here and click \"I received my archive\" to proceed with upload."
        ],
    },
    "Facebook": {
        name: "Facebook",
        description: "Posts, messages, friends, and profile information.",
        icon: "/facebook-logo.svg",
        exportUrl: "https://www.facebook.com/dyi/?referrer=yfi_settings",
        estimatedWaitTime: "Minutes to a few days",
        estimatedWaitMs: 24 * 60 * 60 * 1000, // 24 hours
        format: "ZIP archive (JSON or HTML)",
        linkExpiryNote: "Download available for a few days after processing.",
        steps: [
            "Go to Facebook Settings → \"Your Facebook Information\" → \"Download Your Information\".",
            "Or use the direct link provided when you click \"Open Export Page\".",
            "Select a date range (or choose \"All time\" for complete data).",
            "Choose format: JSON is recommended for forensic analysis, HTML for readability.",
            "Select media quality (High for thorough collection).",
            "Click \"Request a download\".",
            "Facebook will notify you when the file is ready — this can take minutes to days.",
            "Download the ZIP file(s) from the \"Available copies\" tab.",
            "Return here and click \"I received my archive\" to proceed with upload."
        ],
    },
    "LinkedIn": {
        name: "LinkedIn",
        description: "Connections, messages, posts, and profile history.",
        icon: "https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca",
        exportUrl: "https://www.linkedin.com/mypreferences/d/download-my-data",
        estimatedWaitTime: "24 to 72 hours",
        estimatedWaitMs: 48 * 60 * 60 * 1000, // 48 hours
        format: "ZIP archive (CSV and JSON files)",
        linkExpiryNote: "Download link expires in 72 hours after notification.",
        steps: [
            "Go to LinkedIn → Settings → Data Privacy → \"Get a copy of your data\".",
            "Or use the direct link provided when you click \"Open Export Page\".",
            "Select \"Want something in particular?\" and check all categories, or choose \"Download larger data archive\".",
            "Click \"Request archive\".",
            "LinkedIn will email you when the data is ready (typically 24–72 hours).",
            "Click the download link in the email — note it expires in 72 hours.",
            "Download the ZIP file.",
            "Return here and click \"I received my archive\" to proceed with upload."
        ],
    },
    "X (Twitter)": {
        name: "X (Twitter)",
        description: "Tweets, DMs, followers, and account history.",
        icon: "https://abs.twimg.com/favicons/twitter.3.ico",
        exportUrl: "https://twitter.com/settings/download_your_data",
        estimatedWaitTime: "24 to 48 hours",
        estimatedWaitMs: 36 * 60 * 60 * 1000, // 36 hours
        format: "ZIP archive (JSON and HTML)",
        linkExpiryNote: "Download link expires in 7–30 days.",
        steps: [
            "Go to X (Twitter) → Settings and Privacy → Your Account → \"Download an archive of your data\".",
            "Or use the direct link provided when you click \"Open Export Page\".",
            "Enter your account password when prompted.",
            "Complete identity verification (code sent to your email or phone).",
            "Click \"Request archive\".",
            "X will send you a notification and email when the archive is ready (24–48 hours).",
            "Return to the same settings page and click \"Download archive\".",
            "Return here and click \"I received my archive\" to proceed with upload."
        ],
    },
    "Apple": {
        name: "Apple",
        description: "iCloud contents, App Store history, and device data.",
        icon: "https://www.apple.com/favicon.ico",
        exportUrl: "https://privacy.apple.com",
        estimatedWaitTime: "Up to 7 days",
        estimatedWaitMs: 7 * 24 * 60 * 60 * 1000, // 7 days
        format: "Multiple ZIP files",
        linkExpiryNote: "Available for download for 14 days.",
        steps: [
            "Go to privacy.apple.com and sign in with your Apple ID.",
            "Click \"Request a copy of your data\".",
            "Select the data categories you want (or select all).",
            "Choose a maximum file size for splitting large archives.",
            "Click \"Continue\" and confirm your request.",
            "Apple will email you when the data is ready — this can take up to 7 days.",
            "Return to privacy.apple.com and download all the ZIP files from the \"Data\" tab.",
            "Note: Large accounts may have multiple separate files to download.",
            "Return here and click \"I received my archive\" to proceed with upload."
        ],
    },
    "Amazon": {
        name: "Amazon",
        description: "Purchase history, Alexa data, and account details.",
        icon: "https://www.amazon.com/favicon.ico",
        exportUrl: "https://www.amazon.com/gp/privacycentral/dsar/preview.html",
        estimatedWaitTime: "1 to 30 days",
        estimatedWaitMs: 5 * 24 * 60 * 60 * 1000, // 5 days estimate
        format: "Multiple individual files",
        linkExpiryNote: "Download link active for about 2 weeks.",
        steps: [
            "Go to Amazon → Account → \"Request Your Data\" (or use the direct link).",
            "Select \"Request All Your Data\" for a complete archive.",
            "Verify your identity if prompted (phone number or email).",
            "Confirm your data request.",
            "Amazon will send status updates via email — processing can take 1–30 days.",
            "Once ready, you'll receive a secure download link via email.",
            "Download all provided files (Amazon sends multiple individual files, not a single archive).",
            "Return here and click \"I received my archive\" to proceed with upload."
        ],
    },
};
