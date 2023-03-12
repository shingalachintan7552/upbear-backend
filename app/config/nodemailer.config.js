"use strict";
const nodemailer = require("nodemailer");

const main = async(req,res) => {
    let transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "shingalachintan7552@gmail.com",
            pass: "nhvuwajagetaqjzj",
        }
    });

    let info = await transporter.sendMail({
        from: `<shingalachintan7552@gmail.com>`,
        to: `<${req.email}>`,
        subject: `Hi`,
        text: "You can reset password",
        html: `<b>Hello click here for password reset</b><br/> http://127.0.0.1:5173/resetpassword?email=${req.email}&token=${req.token}`,
    });
    return info;
}

main().catch(console.error);

const Mailer = {
    main: main
};
module.exports = Mailer;