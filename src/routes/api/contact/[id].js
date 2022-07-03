import Contact from "../models/Contact";
import { verifyToken } from "../verify";
import { connect } from "../db";
 
export async function get(event) {

    const token = event.request.headers.get("cookie")?.split("=")[1];
    const valid = verifyToken(token);
    if(valid){
        await connect();
        const id = event.params.id;
        try {
            const message = await Contact.findById(id);
            return {
                body: message,
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
