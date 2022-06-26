import {
    auth
} from "./db";

export async function post({
    request
}) {
    const data = await request.json();
    const res = await auth("login", data);
    if (res.token) {
        return {
            status: 200,
            headers: {
                "Set-Cookie": `token=${res.token}; HttpOnly; Expires=${new Date().getTime() + (30 * 1000)}; Path=/`
            }
        };
    } else {
        return {
            status: 403,
            headers: {
                location: "/login",
            },
        };
    };
};