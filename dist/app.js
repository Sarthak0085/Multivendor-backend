"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const error_1 = require("./middleware/error");
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
//middlewares
app.use(express_1.default.json({ limit: "50mb" }));
// app.use('/mails', express.static(path.join(__dirname, 'mails')));
// app.use(cors({
//     origin: ["https://multivendor-frontend-self.vercel.app"],
//     credentials: true
// }));
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use((0, morgan_1.default)('tiny'));
//remove it in production
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.status(200).send("Ok");
});
app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
app.use(error_1.ErrorMiddleware);
exports.default = app;
