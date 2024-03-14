import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import router from "./routes";
import { ErrorMiddleware } from "./middleware/error";
import morgan from "morgan";

const app = express();

//middlewares
app.use(express.json({ limit: "50mb" }));

// app.use('/mails', express.static(path.join(__dirname, 'mails')));

app.use(cors({
    origin: ['https://multivendor-frontend-self.vercel.app'],
    credentials: true
}));

// app.use(cors({
//     origin: ['http://localhost:5173'],
//     credentials: true
// }));

app.use(morgan('tiny'));

//remove it in production
app.use(cookieParser(process.env.COOKIE_SECRET));


app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Ok")
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

app.use(ErrorMiddleware);

export default app;
