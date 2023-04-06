import express from 'express';
import session from "cookie-session"
import { api } from './api';
import { auth } from './auth';

const app = express();
// app.use(
//     cookieSession({
//         secret: process.env["SESSION_SECRET"] || "my secret"
//     })
// )
app.use(
    session({
        secret: "secret"
    })
)
app.use(auth)
app.use(api)
app.listen(3002, () => console.log("Server started"));