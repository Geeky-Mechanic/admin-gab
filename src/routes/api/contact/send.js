import Contact from "../models/Contact";
import {
    connect
} from "../db";
import {
    verifyToken
} from '../verify';
import * as sgMail from '@sendgrid/mail';

/* import {
    createRequire
} from 'node:module';
const require = createRequire(import.meta.url);
const sgMail = require("@sendgrid/mail"); */
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function post(event) {
    const token = event.request.headers.get("cookie")?.split("=")[1];
    const valid = verifyToken(token);
    if (valid) {
        try {
        await connect();
        const req = await event.request.json();
        const id = req._id;
        const subject = req.subj;
        const text = req.text;
        const to = req.email;
        let html = req.html;

        if (html === "" || !html) {
            html = text;
        };
        const msg = {
            to, // Change to your recipient
            from: 'jeremychampagne@hotmail.com', // Change to your verified sender
            subject,
            text,
            html,
        };

        const sentMail = await sgMail.send(msg);

        const updated = await Contact.findByIdAndUpdate(id, {
            answered: true,
        }, {
            new: true
        });

        return {
            body: {
                sentMail, 
                updated
            },
            status: 200,
            headers: {
                "Content-Type": "application/json",
            }
        }
    } catch (err) {
        return {
            body: err,
            status: 500,
            headers: {
                "Content-Type": "application/json",
            }
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
