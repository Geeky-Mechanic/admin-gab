import User from "./models/User.js";
import jwt from 'jsonwebtoken';
import { Decrypt } from './encryption';

export async function login(username, pass) {
    try{
        const user = await User.findOne({
            username
        });
        if (!user) {
            return ("Wrong credentials");
        } else {
            const decryptedPassword = Decrypt(user.password, process.env.PASS_SECRET);
            if (decryptedPassword !== pass) {
                return "Wrong credentials";
            }else {
                const accessToken = jwt.sign({
                    id: user._id,
                },
                process.env.JWT_SECRET, {
                    expiresIn: "1h"
                }
            );
            return {token : accessToken};
            }
        }
    }catch(err){
        return err;
    };
}