import Contact from "../models/Contact";
import { connect } from "../db";
import { verifyToken } from '../verify';

export async function get(event) {
    const token = event.request.headers.get("cookie")?.split("=")[1];
    const valid = verifyToken(token);
    if (valid) {
        try {
            await connect();
            const skipNum = event.request.headers.get("skip") || 0;
    
            const messages = await Contact.find({
                answered: false,
            }).sort({
                date: 1
            }).limit(10).skip(skipNum);
            return {
                body: messages,
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                }
            };
        } catch (err) {
            return {
                body: err,
                status: 500,
            };
        }
    } else {
        return {
            status: 302,
            headers: {
                location: "/login"
            }
        }
    }
};