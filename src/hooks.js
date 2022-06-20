/* import { get } from 'svelte/store';
import { credentials } from './stores/login';
export async function handle({ event, resolve }) {
    const headers = event.request.headers;
    if (event.url.pathname !== ('/login')) {
        const token = get(credentials.accessToken);
        const res = await fetch(`${import.meta.env.VITE_API_URL}auth/verifytoken`, {
            headers: {
                'Content-Type': 'application/json',
                token : `Bearer ${token}`,
            },
            method: "POST",
        });
        if (res.ok) {
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
}; */