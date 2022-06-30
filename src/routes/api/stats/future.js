import Book from "../models/Book";
import {
    connect
} from "../db";
import {
    verifyToken
} from "../verify";

export async function get(event) {
    const token = event.request.headers.get("cookie")?.split("=")[1];
    const valid = verifyToken(token);
    if (valid) {
        try {
            await connect();
            //query projection to limit info
            const projection = event.request.headers.get("projection") ? JSON.parse(event.request.headers.get("projection")) : {};
            const skipNum = event.request.headers.get("skip") || 0;

            const upcomingBookings = await Book.find({
                begHour: {
                    $gte: new Date().getTime(),
                }
            }).sort({
                begHour: 1
            }).select(projection).skip(skipNum).limit(10);

            const unconfirmed = upcomingBookings.filter((b) => {
                return !b.confirmed;
            });

            return {
                body: {
                    upcomingBookings,
                    unconfirmed,
                },
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
        }
    } else {
        return{
            status: 302,
            headers: {
                location: "/login"
            }
        }
    }
};