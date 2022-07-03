import Book from "../models/Book";
import {
    verifyToken
} from "../verify";
import {
    connect
} from "../db";
import * as sgMail from '@sendgrid/mail';

/* import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sgMail = require("@sendgrid/mail"); */

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function post(event) {
    const token = event.request.headers.get("cookie")?.split("=")[1];
    const valid = verifyToken(token);
    if (valid) {
    try {
        await connect();
        //add email
        const req = await event.request.json();
        const id = req.id;
        const subject = "Appreciation";
        const text = "Hi! Thanks for choosing us, did you have a good service?";
        const to = req.email;
        let html = req.html;

        if (html === "" || !html) {
            html = text
        };

        const msg = {
            to, // Change to your recipient
            from: 'jeremychampagne@hotmail.com', // Change to your verified sender
            subject,
            text,
            html,
        };

        await sgMail.send(msg);

        await Book.findByIdAndUpdate(id, {
            completed: true,
        }, {
            new: true,
        });

        return {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                }
        };
    } catch (err) {
        console.log(err);
        return {
            body: err,
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
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