import { login } from './auth.js';
import mongoose from 'mongoose';

export async function connect () {
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to DB"))
.catch((err) => console.log(err));
};

export async function auth(method, info) {
    await connect();
    if(method === "login"){ 
       const res = await login(info.username, info.password);
       return res;
    }
};