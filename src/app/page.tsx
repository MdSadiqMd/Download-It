"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Download, AlertCircle } from "lucide-react";
import { downloadVideo } from "@/lib/api";
import VideoPreview from "@/components/video-preview";

export default function Home() {
    const [url, setUrl] = useState("");
    const [type, setType] = useState("instagram");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [videoData, setVideoData] = useState<any>(null);
    const [error, setError] = useState("");
    const requiresUserId = ["insta_story", "insta_highlight", "profile_pic"].includes(type);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) {
            setError("Please enter a URL");
            return;
        }
        if (requiresUserId && !userId) {
            setError("User ID is required for this type");
            return;
        }

        setLoading(true);
        setError("");
        setVideoData(null);

        try {
            const data = await downloadVideo(url, type, requiresUserId ? userId : undefined);
            setVideoData(data);
        } catch (err: any) {
            setError(err || "Failed to download video. Please check the URL and try again.");
            console.error("Download error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        try {
            let downloadUrl = "";

            if (videoData?.data?.[0]?.url) {
                downloadUrl = videoData.data[0].url;
            } else if (videoData?.url) {
                downloadUrl = videoData.url;
            } else if (videoData?.message?.data?.[0]?.url) {
                downloadUrl = videoData.message.data[0].url;
            }

            if (downloadUrl) {
                window.open(downloadUrl, "_blank");
            } else {
                setError("Download URL not found in the response data");
            }
        } catch (err) {
            console.error("Error downloading video:", err);
            setError("Failed to download the video");
        }
    };

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
                <div className="w-full max-w-xl">
                    <h1 className="text-3xl font-bold text-white mb-8 text-center">Download It</h1>

                    <Card className="bg-zinc-950 border border-zinc-800 shadow-md overflow-hidden">
                        <CardContent className="pt-6 pb-4 px-4 md:px-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="url" className="text-sm font-medium text-zinc-400">
                                        Video URL
                                    </label>
                                    <Input
                                        id="url"
                                        placeholder="Paste video URL here..."
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="bg-zinc-900 border-zinc-800 focus-visible:ring-zinc-700 text-zinc-200"
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="type" className="text-sm font-medium text-zinc-400">
                                        Platform
                                    </label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger className="bg-zinc-900 border-zinc-800 focus:ring-zinc-700 text-zinc-200 h-9">
                                            <SelectValue placeholder="Select platform" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                            <SelectItem value="instagram">Instagram</SelectItem>
                                            <SelectItem value="youtube">YouTube</SelectItem>
                                            <SelectItem value="facebook">Facebook</SelectItem>
                                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                                            <SelectItem value="twitter">Twitter</SelectItem>
                                            <SelectItem value="twitter_metadata">Twitter Metadata</SelectItem>
                                            <SelectItem value="insta_story">Instagram Story</SelectItem>
                                            <SelectItem value="insta_highlight">Instagram Highlight</SelectItem>
                                            <SelectItem value="profile_pic">Profile Picture</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {requiresUserId && (
                                    <div className="flex flex-col space-y-1.5">
                                        <label htmlFor="userId" className="text-xs font-medium text-zinc-400">
                                            User ID <span className="text-red-400">*</span>
                                        </label>
                                        <Input
                                            id="userId"
                                            placeholder="Enter user ID"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            className="bg-zinc-900 border-zinc-800 focus-visible:ring-zinc-700 text-zinc-200"
                                        />
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-white hover:bg-zinc-200 text-black font-medium h-10"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Get Video"
                                    )}
                                </Button>
                            </form>

                            {error && (
                                <div className="mt-4 text-sm px-3 py-2 bg-red-900/20 border border-red-900/50 text-red-400 rounded-sm flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {loading && (
                                <div className="mt-6 space-y-4">
                                    <div className="h-px bg-zinc-800 w-full" />
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 text-zinc-500 animate-spin mb-3" />
                                        <p className="text-sm text-zinc-500">Fetching video data...</p>
                                    </div>
                                </div>
                            )}

                            {!loading && videoData && (
                                <div className="mt-6 space-y-4">
                                    <div className="h-px bg-zinc-800 w-full" />

                                    <div className="space-y-3">
                                        <h3 className="text-xs font-medium text-zinc-400">Preview</h3>
                                        <VideoPreview videoData={videoData} type={type} />
                                    </div>

                                    <Button
                                        className="w-full bg-white hover:bg-zinc-200 text-black font-medium transition-colors h-10"
                                        onClick={handleDownload}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm text-gray-300 py-2 px-4 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300 hover:bg-opacity-100">
                    <a
                        href="https://x.com/Md_Sadiq_Md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                        title="Follow @Md_Sadiq_Md on X"
                    >
                        <span className="text-sm font-medium">Built by @Md_Sadiq_Md</span>
                    </a>
                </div>
            </footer>
        </>
    );
}
