import { verifyToken } from "./routes/api/verify";

export async function handle({ event, resolve }) {
    const token = event.request.headers.get("cookie")?.split("=")[1];
    if (event.url.pathname !== '/login' && event.url.pathname !== '/api/login') {
        const valid = verifyToken(token);
        if (valid) {
            const response = await resolve(event);
            return response;
        }else {
            return new Response(null, {
                status: 302,
                headers: {
                    location: "/login",
                }
            });
        }
    }else {
        const response = await resolve(event);
        return response;
    }
};