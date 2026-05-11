require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Email transporter ──────────────────────────────────────────────────────
// Uses Gmail SMTP. Set GMAIL_USER and GMAIL_APP_PASSWORD in Railway env vars.
// To create a Gmail App Password:
//   Google Account → Security → 2-Step Verification → App Passwords
function createTransporter() {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

const NOTIFY_EMAIL = 'info.nwfle@gmail.com';
const RESERVATION_URL = 'https://be.synxis.com/?adult=1&arrive=2026-10-09&chain=6255&child=0&currency=USD&depart=2026-10-11&group=091126NWFL&hotel=37398&level=hotel&locale=en-US&productcurrency=USD&rooms=1';

// ── POST /api/register ─────────────────────────────────────────────────────
// Receives form data, emails info.nwfle@gmail.com and sends confirmation
app.post('/api/register', async (req, res) => {
  const { fname, lname, sfname, slname, email, phone, heard, lodging } = req.body;

  if (!fname || !lname || !email) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  try {
    const transporter = createTransporter();

    // 1) Notify ministry team
    await transporter.sendMail({
      from: `"Marriage on a Mission" <${process.env.GMAIL_USER}>`,
      to: NOTIFY_EMAIL,
      subject: `New Conference Registration — ${fname} ${lname} & ${sfname || ''} ${slname || ''}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;background:#0e0e0e;color:#e4e4e4;padding:32px;border-radius:8px;border:1px solid #2a2a2a">
          <div style="text-align:center;margin-bottom:24px">
            <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9acd32;margin-bottom:8px">New Registration</p>
            <h1 style="color:#9acd32;font-size:22px;margin:0">Marriage on a Mission</h1>
            <p style="color:#999;font-size:13px;margin-top:6px">October 9–10, 2025 Conference</p>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <tr style="border-bottom:1px solid #252525">
              <td style="padding:10px 12px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#9acd32;width:140px">Couple</td>
              <td style="padding:10px 12px;color:#ffffff;font-weight:bold">${fname} ${lname} &amp; ${sfname || '—'} ${slname || ''}</td>
            </tr>
            <tr style="background:#111;border-bottom:1px solid #252525">
              <td style="padding:10px 12px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#9acd32">Email</td>
              <td style="padding:10px 12px;color:#ffffff">${email}</td>
            </tr>
            <tr style="border-bottom:1px solid #252525">
              <td style="padding:10px 12px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#9acd32">Phone</td>
              <td style="padding:10px 12px;color:#ffffff">${phone || '—'}</td>
            </tr>
            <tr style="background:#111;border-bottom:1px solid #252525">
              <td style="padding:10px 12px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#9acd32">Heard Via</td>
              <td style="padding:10px 12px;color:#ffffff">${heard || '—'}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#9acd32">Lodging</td>
              <td style="padding:10px 12px;color:#ffffff">${lodging || '—'}</td>
            </tr>
          </table>
          <div style="margin-top:24px;padding:16px;background:#131313;border:1px solid #252525;border-radius:6px;text-align:center">
            <p style="color:#999;font-size:12px;margin:0">Submitted via marriageonamission.com</p>
          </div>
        </div>
      `,
    });

    // 2) Confirmation to registrant
    await transporter.sendMail({
      from: `"Marriage on a Mission" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `You're Registered — Marriage on a Mission, October 9–10, 2025`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;background:#0e0e0e;color:#e4e4e4;padding:32px;border-radius:8px;border:1px solid #2a2a2a">
          <div style="text-align:center;margin-bottom:28px">
            <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9acd32;margin-bottom:8px">You're Registered ✦</p>
            <h1 style="color:#9acd32;font-size:24px;margin:0">Marriage on a Mission</h1>
            <p style="color:#d4a820;font-style:italic;font-size:14px;margin-top:8px">A 2-Day Transformational Conference</p>
          </div>

          <p style="color:#e4e4e4;font-size:15px;line-height:1.7">Hi ${fname} &amp; ${sfname || 'your spouse'},</p>
          <p style="color:#e4e4e4;font-size:15px;line-height:1.7">We're so glad you're joining us! Your registration for <strong style="color:#ffffff">Marriage on a Mission — October 9–10, 2025</strong> has been received. We can't wait to spend this weekend with you.</p>

          <div style="margin:24px 0;padding:20px;background:#131313;border:1px solid #4d6e15;border-radius:6px">
            <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9acd32;margin-bottom:12px">Conference Details</p>
            <p style="color:#ffffff;margin:6px 0"><strong>📅 Friday, October 9</strong> — 6:00 PM Dinner &amp; Opening Session</p>
            <p style="color:#ffffff;margin:6px 0"><strong>📅 Saturday, October 10</strong> — 8:00 AM Full Day + Closing Dinner</p>
            <p style="color:#999;font-size:13px;margin-top:10px">Further details and a full schedule will be sent closer to the event date.</p>
          </div>

          ${lodging && lodging.includes('Yes') ? `
          <div style="margin:24px 0;padding:20px;background:#1a1300;border:1px solid #8a6a0a;border-radius:6px">
            <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#d4a820;margin-bottom:10px">🏨 Don't Forget — Reserve Your Room</p>
            <p style="color:#e4e4e4;font-size:14px;line-height:1.6;margin-bottom:14px">You indicated you'll need lodging. Our room block is limited — secure your spot now before the <strong style="color:#f0c830">September 19 deadline</strong>.</p>
            <a href="${RESERVATION_URL}" style="display:inline-block;background:#d4a820;color:#000000;font-weight:bold;font-size:13px;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:12px 24px;border-radius:4px">Reserve Your Room →</a>
            <p style="color:#999;font-size:12px;margin-top:10px">Block Code: <strong style="color:#d4a820">MISSION2025</strong> — Check-in Oct 9, Check-out Oct 11</p>
          </div>
          ` : ''}

          <div style="margin-top:24px;padding:16px;background:#131313;border:1px solid #252525;border-radius:6px">
            <p style="color:#999;font-size:13px;line-height:1.6;margin:0">Questions? Reply to this email or contact us at <a href="mailto:info.nwfle@gmail.com" style="color:#9acd32">info.nwfle@gmail.com</a></p>
          </div>

          <p style="text-align:center;color:#484848;font-size:12px;margin-top:24px;font-style:italic">"Strengthening Unity. Restoring Connection. Building Legacy."</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Registration email error:', err);
    res.status(500).json({ success: false, error: 'Email could not be sent. Please try again or contact us directly.' });
  }
});

// ── POST /api/room-notify ──────────────────────────────────────────────────
// Called client-side when user clicks "Reserve Your Room" — notifies ministry
app.post('/api/room-notify', async (req, res) => {
  const { fname, lname, sfname, slname, email } = req.body;

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Marriage on a Mission" <${process.env.GMAIL_USER}>`,
      to: NOTIFY_EMAIL,
      subject: `Room Reservation Started — ${fname || ''} ${lname || ''} & ${sfname || ''} ${slname || ''}`.trim(),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;background:#0e0e0e;color:#e4e4e4;padding:32px;border-radius:8px;border:1px solid #2a2a2a">
          <div style="text-align:center;margin-bottom:24px">
            <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#d4a820;margin-bottom:8px">🏨 Room Reservation Initiated</p>
            <h1 style="color:#9acd32;font-size:22px;margin:0">Marriage on a Mission</h1>
          </div>
          <p style="color:#e4e4e4;font-size:15px;line-height:1.7">A participant has clicked the room reservation link and was directed to the booking portal.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr style="border-bottom:1px solid #252525">
              <td style="padding:10px 12px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#d4a820;width:130px">Couple</td>
              <td style="padding:10px 12px;color:#ffffff;font-weight:bold">${fname || '—'} ${lname || ''} &amp; ${sfname || '—'} ${slname || ''}</td>
            </tr>
            <tr style="background:#111">
              <td style="padding:10px 12px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#d4a820">Email</td>
              <td style="padding:10px 12px;color:#ffffff">${email || '—'}</td>
            </tr>
          </table>
          <div style="margin-top:20px;padding:14px;background:#1a1300;border:1px solid #8a6a0a;border-radius:6px">
            <p style="color:#999;font-size:13px;margin:0">Note: This confirms the participant clicked through to the reservation portal. Follow up if their room does not appear confirmed within 24 hours.</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Room notify error:', err);
    // Non-critical — still redirect even if notify fails
    res.json({ success: true });
  }
});

// ── Catch-all → index.html ─────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Marriage on a Mission server running on port ${PORT}`);
});
