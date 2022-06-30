import Book from "../models/Book";
import {
    verifyToken
} from "../verify";
import {
    connect
} from "../db";

export async function get(event) {
    const token = event.request.headers.get("cookie")?.split("=")[1];
    const valid = verifyToken(token);
    const id = event.params.id;

    if (valid) {
        try {
            await connect();

            const booking = await Book.findById(id);

            return {
                body: booking,
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                }
            }

        } catch (err) {
            return {
                body: err,
                status: 500
            };
        };

    } else {
        return{
            status: 302,
            headers: {
                location: "/login"
            }
        }
    }
}