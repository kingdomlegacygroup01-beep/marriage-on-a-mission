'use strict';

const https = require('https');
const { confirmationEmail } = require('./emails');

const RESERVATION_URL = 'https://be.synxis.com/?adult=1&arrive=2026-10-09&chain=6255&child=0&currency=USD&depart=2026-10-11&group=091126NWFL&hotel=37398&level=hotel&locale=en-US&productcurrency=USD&rooms=1';
const FROM_EMAIL      = 'info.nwfle@gmail.com';

const couples = [
  { fname: 'Dave', sfname: 'Sherri', lname: 'Noble', slname: 'Noble', email: 'slnoble40@gmail.com', lodging: 'Yes' },
];

function sendEmail({ to, subject, html }) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) return reject(new Error('SENDGRID_API_KEY not set'));
    const body = JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM_EMAIL, name: 'Marriage on a Mission' },
      subject,
      content: [{ type: 'text/html', value: html }],
    });
    const req = https.request({
      hostname: 'api.sendgrid.com', path: '/v3/mail/send', method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve();
        else reject(new Error(`SendGrid ${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`Sending to ${couples.length} couple(s)...\n`);
  for (const c of couples) {
    try {
      await sendEmail({
        to: c.email,
        subject: `You're Registered — Marriage on a Mission, October 9–10, 2026`,
        html: confirmationEmail({ fname: c.fname, sfname: c.sfname, lname: c.lname, slname: c.slname, lodging: c.lodging, reservationUrl: RESERVATION_URL }),
      });
      console.log(`✓  ${c.fname} & ${c.sfname} ${c.lname} <${c.email}>`);
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`✗  ${c.fname} & ${c.sfname} ${c.lname} — ERROR: ${err.message}`);
    }
  }
  console.log('\nDone.');
}

main();
