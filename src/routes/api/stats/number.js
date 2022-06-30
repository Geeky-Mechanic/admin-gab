import {
    connect
} from "../db";
import {
    verifyToken
} from "../verify";
import Book from '../models/Book';

export async function get(event) {
    const token = event.request.headers.get("cookie")?.split("=")[1];
    const valid = verifyToken(token);
    if (valid) {
            await connect();
            try {
                const bookings = async (query) => await Book.countDocuments(query);

                //get the total number of completed bookings
                const completedBookings = await bookings({
                    completed: true
                });

                //get the number of bookings which were done in the last calendar month
                const lastMonthFirstDay = new Date().setUTCMonth(new Date().getUTCMonth() - 1, 1);
                const lastMonthLastDay = new Date().setUTCDate(0);

                const completedLastMonth = await bookings({
                    completed: true,
                    begHour: {
                        $gte: lastMonthFirstDay,
                        $lte: lastMonthLastDay,
                    },
                });

                //get the number of bookings which were done during this calendar month
                const thisMonthFirstDay = new Date().setUTCDate(1);
                const completedThisMonth = await bookings({
                    completed: true,
                    begHour: {
                        $gte: thisMonthFirstDay,
                    },
                })

                const now = new Date().getTime();

                //get number of bookings that were not completed
                const missed = await bookings({
                    completed: false,
                    begHour: {
                        $lte: now
                    }
                });

                //get number of bookings that are coming
                const upcomingBookings = await bookings({
                    begHour: {
                        $gte: now,
                    },
                });

                //get the number of upcoming bookings that still need confirmation
                const unconfirmed = await bookings({
                    begHour: {
                        $gte: now,
                    },
                    confirmed: false,
                });

                return {
                    body: {
                        completedBookings,
                        completedThisMonth,
                        completedLastMonth,
                        missed,
                        upcomingBookings,
                        unconfirmed
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
            };
    }else {
        return{
            status: 302,
            headers: {
                location: "/login"
            }
        }
    }
};