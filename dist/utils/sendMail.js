"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASS,
        }
    });
    const { email, subject, template, data, message } = options;
    if (template && data) {
        //get the path of email template file
        const templatePath = path_1.default.join(__dirname, "../mails", template);
        //Render the email template with ejs
        const html = await ejs_1.default.renderFile(templatePath, data);
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
    }
    else {
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            message
        };
        await transporter.sendMail(mailOptions);
    }
};
exports.default = sendEmail;
