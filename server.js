require('dotenv').config();
const express = require('express');
const path    = require('path');
const https   = require('https');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const NOTIFY_EMAIL    = 'info.nwfle@gmail.com';
const RESERVATION_URL = 'https://be.synxis.com/?adult=1&arrive=2026-10-09&chain=6255&child=0&currency=USD&depart=2026-10-11&group=091126NWFL&hotel=37398&level=hotel&locale=en-US&productcurrency=USD&rooms=1';

function sendEmail({ to, subject, html }) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return reject(new Error('RESEND_API_KEY not set'));

    const body = JSON.stringify({
      from: 'Marriage on a Mission <onboarding@resend.dev>',
      to:   Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    const req = https.request({
      hostname: 'api.resend.com',
      path:     '/emails',
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
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(data));
        else reject(new Error(`Resend ${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

app.post('/api/register', async (req, res) => {
  const { fname, lname, sfname, slname, email, phone, heard, lodging } = req.body;
  if (!fname || !lname || !email)
    return res.status(400).json({ success: false, error: 'Missing required fields.' });

  try {
    await sendEmail({
      to: NOTIFY_EMAIL,
      subject: `New Registration — ${fname} ${lname} & ${sfname||''} ${slname||''}`.trim(),
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;background:#0e0e0e;color:#e4e4e4;padding:32px;border-radius:8px;border:1px solid #2a2a2a">
        <div style="text-align:center;margin-bottom:24px">
          <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9acd32;margin-bottom:8px">New Registration</p>
          <h1 style="color:#9acd32;font-size:22px;margin:0">Marriage on a Mission</h1>
          <p style="color:#999;font-size:13px;margin-top:6px">October 9-10, 2025</p>
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

    await sendEmail({
      to: email,
      subject: `You're Registered — Marriage on a Mission, October 9-10, 2025`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;background:#0e0e0e;color:#e4e4e4;padding:32px;border-radius:8px;border:1px solid #2a2a2a">
        <div style="text-align:center;margin-bottom:28px">
          <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9acd32;margin-bottom:8px">You're Registered!</p>
          <h1 style="color:#9acd32;font-size:24px;margin:0">Marriage on a Mission</h1>
          <p style="color:#d4a820;font-style:italic;font-size:14px;margin-top:8px">A 2-Day Transformational Conference</p>
        </div>
        <p style="color:#e4e4e4;font-size:15px;line-height:1.7">Hi ${fname} &amp; ${sfname||'your spouse'},</p>
        <p style="color:#e4e4e4;font-size:15px;line-height:1.7;margin-top:12px">Your registration for <strong style="color:#fff">Marriage on a Mission — October 9-10, 2025</strong> has been received. We can't wait to spend this weekend with you!</p>
        <div style="margin:24px 0;padding:20px;background:#131313;border:1px solid #4d6e15;border-radius:6px">
          <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9acd32;margin-bottom:12px">Conference Details</p>
          <p style="color:#fff;margin:6px 0"><strong>Friday, October 9</strong> — 6:00 PM Dinner &amp; Opening Session</p>
          <p style="color:#fff;margin:6px 0"><strong>Saturday, October 10</strong> — 8:00 AM Full Day + Closing Dinner</p>
        </div>
        ${lodging&&lodging.includes('Yes')?`<div style="margin:24px 0;padding:20px;background:#1a1300;border:1px solid #8a6a0a;border-radius:6px">
          <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#d4a820;margin-bottom:10px">Reserve Your Room</p>
          <p style="color:#e4e4e4;font-size:14px;line-height:1.6;margin-bottom:14px">Room block deadline is <strong style="color:#f0c830">September 19</strong>.</p>
          <a href="${RESERVATION_URL}" style="display:inline-block;background:#d4a820;color:#000;font-weight:bold;font-size:13px;text-decoration:none;padding:12px 24px;border-radius:4px">Reserve Your Room</a>
          <p style="color:#aaa;font-size:12px;margin-top:10px">Block Code: MISSION2025</p>
        </div>`:''}
        <p style="color:#ccc;font-size:13px">Questions? <a href="mailto:info.nwfle@gmail.com" style="color:#9acd32">info.nwfle@gmail.com</a></p>
        <p style="text-align:center;color:#aaa;font-size:12px;margin-top:24px;font-style:italic">"Strengthening Unity. Restoring Connection. Building Legacy."</p>
      </div>`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ success: false, error: 'Email could not be sent. Please contact info.nwfle@gmail.com' });
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
        <p style="color:#e4e4e4">A participant clicked the room reservation link.</p>
        <p style="color:#fff;margin-top:12px"><strong>Name:</strong> ${fname||'—'} ${lname||''} &amp; ${sfname||'—'} ${slname||''}</p>
        <p style="color:#fff"><strong>Email:</strong> ${email||'—'}</p>
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
