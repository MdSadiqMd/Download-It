import axios from 'axios';

export async function downloadVideo(url: string, type: string, userId?: string) {
    try {
        const response = await axios.post('/api/download', {
            url,
            type,
            user_id: userId,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Download video error:', error);
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || `Request failed with status ${error.response.status}`);
        }
        throw new Error(error.message || 'Failed to download the video');
    }
}
