import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

interface VideoPreviewProps {
    videoData: any;
    type: string;
}

export default function VideoPreview({ videoData, type }: VideoPreviewProps) {
    let previewData = null;
    if (videoData?.message?.data?.length > 0) {
        previewData = videoData.message.data[0];
    } else if (videoData?.data?.length > 0) {
        previewData = videoData.data[0];
    }

    if (!previewData) {
        return (
            <div className="rounded-md border border-zinc-800 bg-zinc-900 flex items-center justify-center p-8">
                <p className="text-sm text-zinc-500">No preview available</p>
            </div>
        );
    }

    const { thumbnail, url } = previewData;

    return (
        <Card className="overflow-hidden bg-transparent border-0 shadow-none">
            <div className="relative aspect-video rounded-md overflow-hidden bg-zinc-900 border border-zinc-800">
                {thumbnail ? (
                    <>
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group">
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                                <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-zinc-700" />
                    </div>
                )}
            </div>
        </Card>
    );
}