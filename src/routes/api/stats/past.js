import Book from '../models/Book';
import {
    connect
} from "../db";
import {
    verifyToken
} from "../verify";

export async function get(event) {
    const token = event.request.headers.get("cookie")?.split("=")[1];
    const valid = verifyToken(token);
    if(valid){
    try {
        await connect();
        //query projection to limit info
        const projection = event.request.headers.get("projection") ? JSON.parse(event.request.headers.get("projection")) : {};
        const skipNum = event.request.headers.get("skip") || 0;
        const date = new Date().getTime();
        console.log(projection, skipNum);
        const compBookings = await Book.find({
            begHour: {
                $lte: date
            },
            completed: true
        }).sort({
            begHour: -1
        }).select(projection).skip(skipNum).limit(10);

        /*         const completedLastMonth = bookings.filter((b) => {
                    const begH = new Date(b.begHour);
                    if ((date.getMonth() - 1) === begH.getMonth() && b.completed) {
                        return b;
                    }
                });

                const completedThisMonth = bookings.filter((b) => {
                    const begH = new Date(b.begHour);
                    if (date.getMonth() === begH.getMonth() && b.completed) {
                        return b;
                    }
                });  */

        const missedBookings = await Book.find({
            begHour: {
                $lte: date
            },
            completed: false
        }).sort({
            begHour: -1
        }).select(projection).skip(skipNum).limit(10);

        return {
            body: {
                completedBookings: compBookings,
                missed: missedBookings
            },
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        };

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