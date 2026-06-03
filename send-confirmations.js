'use strict';

const https   = require('https');
const path    = require('path');
const { confirmationEmail } = require('./emails');

const RESERVATION_URL = 'https://be.synxis.com/?adult=1&arrive=2026-10-09&chain=6255&child=0&currency=USD&depart=2026-10-11&group=091126NWFL&hotel=37398&level=hotel&locale=en-US&productcurrency=USD&rooms=1';
const FROM_EMAIL      = 'info.nwfle@gmail.com';

// ── Registered couples ───────────────────────────────────────────────────────
const couples = [
  { fname: 'Lindsey',  sfname: 'Michael',  lname: 'Steffanini', slname: 'Steffanini', email: 'lindseyk90@icloud.com',          lodging: 'Yes' },
  { fname: 'Jason',    sfname: 'Lorena',   lname: 'Palmer',     slname: 'Palmer',     email: 'jason.palmer618@gmail.com',      lodging: 'Yes' },
  { fname: 'Christopher', sfname: 'Brittany', lname: 'Scott',   slname: 'Scott',      email: 'brittany.scott0625@gmail.com',   lodging: 'Yes' },
  { fname: 'Lucina',   sfname: 'Carlos',   lname: 'Lastra',     slname: 'Lastra',     email: 'lucinalastra81@gmail.com',       lodging: 'Yes' },
  { fname: 'Lisa',     sfname: 'Glenn',    lname: 'Brown',      slname: 'Brown',      email: 'Gypseebrown76@gmail.com',        lodging: 'Yes' },
  { fname: 'Paulette', sfname: 'John',     lname: 'Colwill',    slname: 'Colwill',    email: 'paulettec2020@gmail.com',        lodging: 'Yes' },
  { fname: 'Kim',      sfname: 'Kimberly', lname: 'Bruening',   slname: 'Bruening',   email: 'kbruening@uhm.com',              lodging: 'Yes' },
  { fname: 'Jennifer', sfname: 'Rich',     lname: 'Motley-Mercer', slname: 'Mercer',  email: 'jenndev97@gmail.com',            lodging: 'Yes' },
  { fname: 'Lymann',   sfname: 'Hollie',   lname: 'Rea',        slname: 'Rea',        email: 'Reddirtprecision@yahoo.com',     lodging: 'Yes' },
  { fname: 'Michael',  sfname: 'Morgan',   lname: 'Taylor',     slname: 'Taylor',     email: 'mkaytaylor90@gmail.com',         lodging: 'Yes' },
  { fname: 'Mark',     sfname: 'Cary',     lname: 'Baker',      slname: 'Baker',      email: 'markbaker1973@gmail.com',        lodging: 'Yes' },
  { fname: 'Angela',   sfname: 'Don',      lname: 'Ward',       slname: 'Ward',       email: 'passionforsharing@yahoo.com',    lodging: 'Yes' },
  { fname: 'Shannon',  sfname: 'Tammy',    lname: 'Taylor',     slname: 'Taylor',     email: 'tammynshannon@yahoo.com',        lodging: 'Yes' },
  { fname: 'Justin',   sfname: 'Cheryl',   lname: 'Jordan',     slname: 'Jordan',     email: 'jmj12152001@gmail.com',          lodging: 'Yes' },
  { fname: 'Wayne',    sfname: 'Tonya',    lname: 'Moore',      slname: 'Moore',      email: 'tonyasmail77@gmail.com',         lodging: 'No'  },
  { fname: 'Michael',  sfname: 'Shanna',   lname: 'Suggs',      slname: 'Suggs',      email: 'suggsjm@yahoo.com',              lodging: 'Yes' },
  { fname: 'Chuck',    sfname: 'Chuck',    lname: 'Allen',      slname: 'Allen',      email: 'cjallen3299@gmail.com',          lodging: 'Yes' },
  { fname: 'Jason',    sfname: 'Meranda',  lname: 'Mobley',     slname: 'Mobley',     email: 'jason_mobley@me.com',            lodging: 'Yes' },
  { fname: 'Shawn',    sfname: 'Shawn',    lname: 'Hartz',      slname: 'Hartz',      email: 'shawnhartz@gmail.com',           lodging: 'Yes' },
];

// ── Send via SendGrid ────────────────────────────────────────────────────────
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
        if (res.statusCode >= 200 && res.statusCode < 300) resolve();
        else reject(new Error(`SendGrid ${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Main: send one at a time with a small delay ──────────────────────────────
async function main() {
  console.log(`Sending confirmation emails to ${couples.length} couples...\n`);
  let success = 0;
  let failed  = 0;

  for (const c of couples) {
    try {
      const html = confirmationEmail({
        fname:          c.fname,
        sfname:         c.sfname,
        lname:          c.lname,
        slname:         c.slname,
        lodging:        c.lodging,
        reservationUrl: RESERVATION_URL,
      });

      await sendEmail({
        to:      c.email,
        subject: `You're Registered — Marriage on a Mission, October 9–10, 2026`,
        html,
      });

      console.log(`✓  ${c.fname} & ${c.sfname} ${c.lname} <${c.email}>`);
      success++;

      // Small delay to stay well within SendGrid rate limits
      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      console.error(`✗  ${c.fname} & ${c.sfname} ${c.lname} <${c.email}> — ERROR: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`Done. ${success} sent, ${failed} failed.`);
}

main();
