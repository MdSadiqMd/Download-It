import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, type, user_id }: any = body;
        if (!url) {
            return NextResponse.json({ error: "Video URL is required" }, { status: 400 });
        }
        if (!type) {
            return NextResponse.json({ error: "Type is required" }, { status: 400 });
        }

        const payload: any = {
            video_url: url,
            type,
        };
        if (user_id && ["insta_story", "insta_highlight", "profile_pic"].includes(type)) {
            payload.user_id = user_id;
        }
        if (type === "youtube") {
            payload.get_url = true;
        }

        try {
            const response = await axios.post(
                process.env.NEXT_PUBLIC_API_URL as string,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Avatar-Key": process.env.NEXT_PUBLIC_API_KEY as string,
                    },
                }
            );
            return NextResponse.json(response.data);
        } catch (axiosError: any) {
            if (axiosError.response) {
                return NextResponse.json({
                    error: axiosError.response.data.message || "API request failed",
                    details: axiosError.response.data,
                    status: axiosError.response.status
                }, { status: axiosError.response.status });
            } else if (axiosError.request) {
                return NextResponse.json({
                    error: "No response from API service",
                    message: "The request was made but no response was received"
                }, { status: 500 });
            } else {
                return NextResponse.json({
                    error: "Request configuration error",
                    message: axiosError.message
                }, { status: 500 });
            }
        }
    } catch (error: any) {
        console.error("General error in download API:", error);
        return NextResponse.json({
            error: "Failed to process request",
            message: error.message || "Unknown error"
        }, { status: 500 });
    }
}