import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://miu33-arch.github.io'],
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.protonmail.ch',
  port: 465,
  secure: true,
  auth: {
    user: process.env.PROTON_USER,
    pass: process.env.PROTON_PASS
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing fields' });
  }

  try {
    await transporter.sendMail({
      from: `"MIU_33 Contact" <${process.env.PROTON_USER}>`,
      to: 'miu.digital.studio@proton.me',
      replyTo: email,
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Email failed' });
  }
});

app.get('/', (req, res) => {
  res.send('MIU backend online');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
