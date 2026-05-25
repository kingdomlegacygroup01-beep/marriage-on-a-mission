'use strict';

// ─────────────────────────────────────────────────────────────────────────────
//  Marriage on a Mission — Email Templates
//  Drop this file in the root of your GitHub repo (same folder as server.js).
//  Usage in server.js:
//    const { confirmationEmail } = require('./emails');
//    html: confirmationEmail({ fname, sfname, lname, slname, lodging, reservationUrl: RESERVATION_URL })
// ─────────────────────────────────────────────────────────────────────────────

const SITE_URL   = 'https://marriage-on-a-mission-production.up.railway.app/';
const SOCIAL_URL = 'https://www.instagram.com/marriageonamission/';   // update if needed

/**
 * Branded registration confirmation email.
 *
 * @param {object} params
 * @param {string}  params.fname          Primary registrant first name
 * @param {string} [params.sfname]        Spouse first name
 * @param {string} [params.lname]         Primary registrant last name
 * @param {string} [params.slname]        Spouse last name
 * @param {string} [params.lodging]       Lodging field value from the form
 * @param {string}  params.reservationUrl Hotel block reservation URL
 * @returns {string} Full HTML string ready to pass to sendEmail()
 */
function confirmationEmail({ fname, sfname, lname, slname, lodging, reservationUrl }) {
  const coupleNames  = sfname ? `${fname} &amp; ${sfname}` : fname;
  const wantsLodging = lodging && lodging.toLowerCase().includes('yes');

  const lodgingBlock = wantsLodging ? `
          <!-- LODGING -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:#2A200A; border-radius:6px; border:1px solid #C8A84B; overflow:hidden;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin:0 0 10px; font-family:Arial,sans-serif; font-size:13px; font-weight:bold;
                               letter-spacing:2px; color:#C8A84B; text-transform:uppercase;">
                      RESERVE YOUR ROOM
                    </p>
                    <p style="margin:0 0 12px; font-family:Arial,sans-serif; font-size:14px; color:#DDDDDD; line-height:1.6;">
                      You indicated interest in hotel accommodations. Our room block deadline is
                      <strong style="color:#FFFFFF;">September 1, 2026</strong> — reserve early to secure your rate.
                    </p>
                    <p style="margin:0 0 14px; font-family:Arial,sans-serif; font-size:13px; color:#AAAAAA;">
                      Block Code: <strong style="color:#C8A84B;">091126NWFL</strong>
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#C8A84B; border-radius:4px; padding:12px 24px;">
                          <a href="${reservationUrl}"
                             style="font-family:Arial,sans-serif; font-size:13px; font-weight:bold;
                                    color:#1A1A1A; text-decoration:none; letter-spacing:1px; text-transform:uppercase;">
                            Reserve Your Room &#8594;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>You're Registered — Marriage on a Mission</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; display: block; }
    body { margin: 0; padding: 0; background-color: #0D0D0D; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; }
      .content-cell  { padding: 28px 20px !important; }
      .hero-title    { font-size: 32px !important; }
      .hero-sub      { font-size: 16px !important; }
      .expect-card   { margin-bottom: 12px !important; }
      .footer-cell   { padding: 24px 20px !important; }
    }
    a { color: #96C11F; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#0D0D0D; font-family: Arial, Helvetica, sans-serif;">

  <!-- PREHEADER -->
  <div style="display:none; max-height:0; overflow:hidden; font-size:1px; color:#0D0D0D;">
    You're registered for Marriage on a Mission &mdash; October 9&ndash;10, 2026. We can't wait to see you there! &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#0D0D0D; min-height:100vh;">
    <tr>
      <td align="center" style="padding: 32px 16px 48px;">

        <table class="email-wrapper" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px; width:100%; background-color:#1A1A1A; border-radius:8px;
                      border: 1px solid #2a2a2a; overflow:hidden;">

          <!-- TOP LIME BAR -->
          <tr>
            <td style="background-color:#96C11F; height:5px; font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- BRAND NAME -->
          <tr>
            <td align="center" style="background-color:#1A1A1A; padding: 32px 40px 20px;">
              <p style="margin:0; font-family:Arial,sans-serif; font-size:11px; font-weight:bold;
                         letter-spacing:4px; color:#FFFFFF; text-transform:uppercase;">
                MARRIAGE ON A MISSION
              </p>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td align="center" style="background-color:#1A1A1A; padding: 0 40px 12px;">
              <p style="margin:0 0 8px; font-family:Arial,sans-serif; font-size:11px; font-weight:bold;
                         letter-spacing:3px; color:#96C11F; text-transform:uppercase;">
                YOU'RE REGISTERED!
              </p>
              <h1 class="hero-title"
                  style="margin:0 0 10px; font-family:Arial,sans-serif; font-size:40px; font-weight:bold;
                         color:#FFD700; line-height:1.1;">
                Marriage on a Mission
              </h1>
              <p class="hero-sub"
                 style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:18px;
                         color:#C8A84B; font-style:italic;">
                A 2-Day Transformational Conference
              </p>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding: 20px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid #96C11F; font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td class="content-cell" style="padding: 32px 40px 28px;">
              <p style="margin:0 0 18px; font-family:Arial,sans-serif; font-size:18px; color:#FFFFFF; line-height:1.5;">
                Hi <strong>${coupleNames}</strong>,
              </p>
              <p style="margin:0 0 16px; font-family:Arial,sans-serif; font-size:16px; color:#FFFFFF; line-height:1.7;">
                Your registration for <strong style="color:#FFFFFF;">Marriage on a Mission &mdash; October 9&ndash;10, 2026</strong>
                has been received. We are so glad you said yes to this weekend.
              </p>
              <p style="margin:0; font-family:Arial,sans-serif; font-size:16px; color:#FFFFFF; line-height:1.7;">
                God has something specific for your marriage at this conference &mdash; and the fact that you're
                coming means you're already opening the door to it. We cannot wait to spend this weekend with you.
              </p>
            </td>
          </tr>

          <!-- CONFERENCE DETAILS -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="border: 1px solid #96C11F; border-radius:6px; background-color:#111111; overflow:hidden;">
                <tr>
                  <td style="padding: 12px 24px; background-color:#1E3A0E;">
                    <p style="margin:0; font-family:Arial,sans-serif; font-size:10px; font-weight:bold;
                               letter-spacing:3px; color:#96C11F; text-transform:uppercase;">
                      CONFERENCE DETAILS
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 24px 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom:14px; border-bottom:1px solid #2a2a2a;">
                          <p style="margin:0 0 3px; font-family:Arial,sans-serif; font-size:13px;
                                     font-weight:bold; color:#96C11F; letter-spacing:1px; text-transform:uppercase;">
                            Friday, October 9
                          </p>
                          <p style="margin:0; font-family:Arial,sans-serif; font-size:15px; color:#FFFFFF; font-weight:bold;">
                            6:00 PM &mdash; Dinner &amp; Opening Session
                          </p>
                          <p style="margin:4px 0 0; font-family:Arial,sans-serif; font-size:13px; color:#999999;">
                            Arrive ready to connect. Dinner is provided.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:14px; padding-bottom:14px; border-bottom:1px solid #2a2a2a;">
                          <p style="margin:0 0 3px; font-family:Arial,sans-serif; font-size:13px;
                                     font-weight:bold; color:#96C11F; letter-spacing:1px; text-transform:uppercase;">
                            Saturday, October 10
                          </p>
                          <p style="margin:0; font-family:Arial,sans-serif; font-size:15px; color:#FFFFFF; font-weight:bold;">
                            8:00 AM &mdash; Full Day + Closing Dinner
                          </p>
                          <p style="margin:4px 0 0; font-family:Arial,sans-serif; font-size:13px; color:#999999;">
                            Sessions, meals, and the Covenant Activation all included.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:14px;">
                          <p style="margin:0 0 3px; font-family:Arial,sans-serif; font-size:13px;
                                     font-weight:bold; color:#96C11F; letter-spacing:1px; text-transform:uppercase;">
                            Location
                          </p>
                          <p style="margin:0; font-family:Arial,sans-serif; font-size:15px; color:#FFFFFF; font-weight:bold;">
                            The Island Resort at Fort Walton Beach
                          </p>
                          <p style="margin:4px 0 0; font-family:Arial,sans-serif; font-size:13px; color:#999999;">
                            1500 Miracle Strip Parkway SE &bull; Fort Walton Beach, FL 32548
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WHAT TO EXPECT -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <p style="margin:0 0 16px; font-family:Arial,sans-serif; font-size:14px; font-weight:bold;
                         letter-spacing:2px; color:#96C11F; text-transform:uppercase;">
                WHAT TO EXPECT THIS WEEKEND
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="expect-card" style="padding-bottom:10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                           style="background-color:#111111; border-radius:6px; border-left:4px solid #96C11F; overflow:hidden;">
                      <tr>
                        <td style="padding:14px 18px;">
                          <p style="margin:0 0 4px; font-family:Arial,sans-serif; font-size:14px; font-weight:bold; color:#FFFFFF;">
                            Biblical Teaching
                          </p>
                          <p style="margin:0; font-family:Arial,sans-serif; font-size:13px; color:#999999; line-height:1.5;">
                            God's design for marriage &mdash; rooted in covenant truth, not self-help.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="expect-card" style="padding-bottom:10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                           style="background-color:#111111; border-radius:6px; border-left:4px solid #96C11F; overflow:hidden;">
                      <tr>
                        <td style="padding:14px 18px;">
                          <p style="margin:0 0 4px; font-family:Arial,sans-serif; font-size:14px; font-weight:bold; color:#FFFFFF;">
                            Real, Honest Conversations
                          </p>
                          <p style="margin:0; font-family:Arial,sans-serif; font-size:13px; color:#999999; line-height:1.5;">
                            A safe space to be vulnerable and experience the breakthrough that honesty brings.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="expect-card" style="padding-bottom:10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                           style="background-color:#111111; border-radius:6px; border-left:4px solid #96C11F; overflow:hidden;">
                      <tr>
                        <td style="padding:14px 18px;">
                          <p style="margin:0 0 4px; font-family:Arial,sans-serif; font-size:14px; font-weight:bold; color:#FFFFFF;">
                            Practical Tools to Take Home
                          </p>
                          <p style="margin:0; font-family:Arial,sans-serif; font-size:13px; color:#999999; line-height:1.5;">
                            Exercises, templates, and habits you can start using immediately after the conference.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="expect-card">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                           style="background-color:#111111; border-radius:6px; border-left:4px solid #C8A84B; overflow:hidden;">
                      <tr>
                        <td style="padding:14px 18px;">
                          <p style="margin:0 0 4px; font-family:Arial,sans-serif; font-size:14px; font-weight:bold; color:#FFFFFF;">
                            Spirit-Led Encounter
                          </p>
                          <p style="margin:0; font-family:Arial,sans-serif; font-size:13px; color:#999999; line-height:1.5;">
                            The Holy Spirit is welcome and expected. Come open &mdash; God will meet you here.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BEFORE YOU ARRIVE -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:#1E3A0E; border-radius:6px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin:0 0 12px; font-family:Arial,sans-serif; font-size:13px; font-weight:bold;
                               letter-spacing:2px; color:#96C11F; text-transform:uppercase;">
                      BEFORE YOU ARRIVE
                    </p>
                    <p style="margin:0 0 8px; font-family:Arial,sans-serif; font-size:14px; color:#DDDDDD; line-height:1.6;">
                      &#10003;&nbsp; <strong style="color:#FFFFFF;">Bring your Participant Guide</strong> &mdash; you'll receive it at check-in. Come ready to write in it.
                    </p>
                    <p style="margin:0 0 8px; font-family:Arial,sans-serif; font-size:14px; color:#DDDDDD; line-height:1.6;">
                      &#10003;&nbsp; <strong style="color:#FFFFFF;">Arrive 15 minutes early</strong> on Friday evening &mdash; dinner begins at 6:00 PM.
                    </p>
                    <p style="margin:0 0 8px; font-family:Arial,sans-serif; font-size:14px; color:#DDDDDD; line-height:1.6;">
                      &#10003;&nbsp; <strong style="color:#FFFFFF;">Come with an open heart</strong> &mdash; not a perfect marriage. This weekend is for real couples in real life.
                    </p>
                    <p style="margin:0; font-family:Arial,sans-serif; font-size:14px; color:#DDDDDD; line-height:1.6;">
                      &#10003;&nbsp; <strong style="color:#FFFFFF;">Pray together this week</strong> &mdash; ask God to prepare your hearts for what He has for you.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${lodgingBlock}

          <!-- COVENANT DECLARATION -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:#2A1A00; border-radius:6px;">
                <tr>
                  <td align="center" style="padding: 24px 28px;">
                    <p style="margin:0 0 4px; font-family:Georgia,'Times New Roman',serif;
                               font-size:15px; font-style:italic; color:#FFFFFF; line-height:1.8;">
                      &ldquo;Our marriage belongs to God.
                    </p>
                    <p style="margin:0 0 4px; font-family:Georgia,'Times New Roman',serif;
                               font-size:15px; font-style:italic; color:#FFFFFF; line-height:1.8;">
                      We choose unity, love, and purpose.
                    </p>
                    <p style="margin:0 0 4px; font-family:Georgia,'Times New Roman',serif;
                               font-size:15px; font-style:italic; color:#FFFFFF; line-height:1.8;">
                      We will fight for each other, not against each other.
                    </p>
                    <p style="margin:0 0 12px; font-family:Georgia,'Times New Roman',serif;
                               font-size:15px; font-style:italic; color:#FFFFFF; line-height:1.8;">
                      And we will walk out our calling together.&rdquo;
                    </p>
                    <p style="margin:0; font-family:Arial,sans-serif; font-size:13px;
                               font-weight:bold; color:#C8A84B; letter-spacing:1px;">
                      &mdash; Your Covenant Declaration, Saturday Evening
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- QUESTIONS -->
          <tr>
            <td style="padding: 0 40px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid #2a2a2a; padding-top:24px;">
                    <p style="margin:0 0 8px; font-family:Arial,sans-serif; font-size:15px; color:#FFFFFF; font-weight:bold;">
                      Questions?
                    </p>
                    <p style="margin:0; font-family:Arial,sans-serif; font-size:14px; color:#999999; line-height:1.6;">
                      We're here to help. Reach us at
                      <a href="mailto:info.nwfle@gmail.com" style="color:#96C11F; text-decoration:none;">
                        info.nwfle@gmail.com
                      </a>
                      and we'll get back to you as soon as possible.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SHARE -->
          <tr>
            <td style="padding: 16px 40px 32px;">
              <p style="margin:0 0 10px; font-family:Arial,sans-serif; font-size:13px; color:#666666;">
                Know a couple who needs this weekend?
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#96C11F; border-radius:4px; padding:10px 22px;">
                    <a href="${SITE_URL}"
                       style="font-family:Arial,sans-serif; font-size:13px; font-weight:bold;
                              color:#1A1A1A; text-decoration:none; letter-spacing:1px; text-transform:uppercase;">
                      Share This Conference &#8594;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BOTTOM LIME BAR -->
          <tr>
            <td style="background-color:#96C11F; height:4px; font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer-cell" align="center" style="background-color:#111111; padding: 28px 40px 32px;">
              <p style="margin:0 0 6px; font-family:Arial,sans-serif; font-size:13px; font-weight:bold;
                         color:#96C11F; letter-spacing:2px; text-transform:uppercase;">
                MARRIAGE ON A MISSION MINISTRY
              </p>
              <p style="margin:0 0 16px; font-family:Georgia,'Times New Roman',serif; font-size:13px;
                         font-style:italic; color:#666666;">
                &ldquo;Strengthening Unity. Restoring Connection. Building Legacy.&rdquo;
              </p>
              <p style="margin:0 0 6px; font-family:Arial,sans-serif; font-size:12px; color:#555555;">
                <a href="${SITE_URL}" style="color:#555555;">Website</a>
                &nbsp;&bull;&nbsp;
                <a href="mailto:info.nwfle@gmail.com" style="color:#555555;">info.nwfle@gmail.com</a>
                &nbsp;&bull;&nbsp;
                <a href="${SOCIAL_URL}" style="color:#555555;">@MarriageonaMission</a>
              </p>
              <p style="margin:16px 0 0; font-family:Arial,sans-serif; font-size:11px; color:#444444; line-height:1.6;">
                You received this email because you registered for Marriage on a Mission.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

module.exports = { confirmationEmail };
