const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ urlencoded: true }));

app.post("/sendEmail", async (req, res) => {
  const { name, mail, msg } = req.body;

  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "eb6c8e5ccbd8ec",
      pass: "dfe255e7dbc7fa",
    },
  });

  let info = await transport.sendMail({
    from: '"Vini👻" <sydo26@gmail.com>', // sender address
    to: `"${name}" <${mail}>`, // list of receivers
    subject: "Olá! ", // Subject line
    text: msg, // plain text body
  });

  res.status(200).json(info);
});

app.listen(3000, () => {
  console.log("servidor on na porta 3000");
});
