require('dotenv').config();
const express = require('express');
const path    = require('path');
const https   = require('https');

// ── Branded email templates ──────────────────────────────────────────────────
const { confirmationEmail } = require('./emails');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const NOTIFY_EMAIL    = 'info.nwfle@gmail.com';
const RESERVATION_URL = 'https://be.synxis.com/?adult=1&arrive=2026-10-09&chain=6255&child=0&currency=USD&depart=2026-10-11&group=091126NWFL&hotel=37398&level=hotel&locale=en-US&productcurrency=USD&rooms=1';

function sendEmail({ to, subject, html }) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) return reject(new Error('SENDGRID_API_KEY not set'));

    const body = JSON.stringify({
      personalizations: [{ to: [{ email: Array.isArray(to) ? to[0] : to }] }],
      from: { email: NOTIFY_EMAIL, name: 'Marriage on a Mission' },
      subject,
      content: [{ type: 'text/html', value: html }],
    });

    const req = https.request({
      hostname: 'api.sendgrid.com',
      path:     '/v3/mail/send',
      method:   'POST',
      headers: {
        'Authorization':  `Bearer ${apiKey}`,
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve({ status: res.statusCode });
        else reject(new Error(`SendGrid ${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

app.post('/api/register', async (req, res) => {
  // REGISTRATION CLOSED — reject all attempts immediately
  return res.status(403).json({ success: false, error: "Registration is closed. The conference is at full capacity." });
  const { fname, lname, sfname, slname, email, phone, heard, lodging } = req.body;
  if (!fname || !lname || !email)
    return res.status(400).json({ success: false, error: 'Missing required fields.' });

  try {
    // 1) Notify ministry team
    await sendEmail({
      to: NOTIFY_EMAIL,
      subject: `New Registration — ${fname} ${lname} & ${sfname||''} ${slname||''}`.trim(),
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;background:#0e0e0e;color:#e4e4e4;padding:32px;border-radius:8px;border:1px solid #2a2a2a">
        <div style="text-align:center;margin-bottom:24px">
          <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9acd32;margin-bottom:8px">New Registration</p>
          <h1 style="color:#9acd32;font-size:22px;margin:0">Marriage on a Mission</h1>
          <p style="color:#cccccc;font-size:13px;margin-top:6px">October 9-10, 2026</p>
        </div>
        <table style="width:100%;border-collapse:collapse">
          <tr style="border-bottom:1px solid #252525"><td style="padding:10px 12px;font-size:11px;text-transform:uppercase;color:#9acd32;width:130px">Couple</td><td style="padding:10px 12px;color:#fff;font-weight:bold">${fname} ${lname} &amp; ${sfname||'—'} ${slname||''}</td></tr>
          <tr style="background:#111;border-bottom:1px solid #252525"><td style="padding:10px 12px;font-size:11px;text-transform:uppercase;color:#9acd32">Email</td><td style="padding:10px 12px;color:#fff">${email}</td></tr>
          <tr style="border-bottom:1px solid #252525"><td style="padding:10px 12px;font-size:11px;text-transform:uppercase;color:#9acd32">Phone</td><td style="padding:10px 12px;color:#fff">${phone||'—'}</td></tr>
          <tr style="background:#111;border-bottom:1px solid #252525"><td style="padding:10px 12px;font-size:11px;text-transform:uppercase;color:#9acd32">Heard Via</td><td style="padding:10px 12px;color:#fff">${heard||'—'}</td></tr>
          <tr><td style="padding:10px 12px;font-size:11px;text-transform:uppercase;color:#9acd32">Lodging</td><td style="padding:10px 12px;color:#fff">${lodging||'—'}</td></tr>
        </table>
      </div>`,
    });

    // 2) Branded confirmation to registrant
    await sendEmail({
      to: email,
      subject: `You're Registered — Marriage on a Mission, October 9-10, 2026`,
      html: confirmationEmail({ fname, sfname, lname, slname, lodging, reservationUrl: RESERVATION_URL }),
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/room-notify', async (req, res) => {
  const { fname, lname, sfname, slname, email } = req.body;
  try {
    await sendEmail({
      to: NOTIFY_EMAIL,
      subject: `Room Reservation Started — ${fname||''} ${lname||''}`.trim(),
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;background:#0e0e0e;color:#e4e4e4;padding:32px;border-radius:8px">
        <h2 style="color:#d4a820;margin-bottom:16px">Room Reservation Initiated</h2>
        <p style="color:#e4e4e4;margin-bottom:12px">A participant clicked the room reservation link.</p>
        <p style="color:#fff"><strong>Name:</strong> ${fname||'—'} ${lname||''} &amp; ${sfname||'—'} ${slname||''}</p>
        <p style="color:#fff;margin-top:8px"><strong>Email:</strong> ${email||'—'}</p>
      </div>`,
    });
  } catch (err) {
    console.error('Room notify error:', err.message);
  }
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Marriage on a Mission running on port ${PORT}`));
