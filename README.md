# Marriage on a Mission — Conference Website

A Node.js/Express site for conference registration and room reservations, hosted on Railway.

---

## What It Does

- **Conference registration form** — collects couple info and sends:
  - A notification email to `info.nwfle@gmail.com`
  - A confirmation email to the registrant
- **Room reservation button** — notifies `info.nwfle@gmail.com` when a participant clicks through to the hotel booking portal, then opens the Synxis booking link in a new tab
- Fully responsive — desktop and mobile

---

## Project Structure

```
mom-conference/
├── server.js          # Express server + email API routes
├── package.json
├── railway.toml       # Railway deployment config
├── .env.example       # Environment variable template
├── .gitignore
└── public/
    ├── index.html     # Full conference website
    └── logo.png       # Logo image (add this file — see below)
```

---

## Step 1 — Add Your Logo

Copy your logo image into the `public/` folder and name it `logo.png`.

---

## Step 2 — Deploy to GitHub

```bash
# From inside the mom-conference folder:
git init
git add .
git commit -m "Initial commit — Marriage on a Mission conference site"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/marriage-on-a-mission.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy to Railway

1. Go to **railway.app** and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select your `marriage-on-a-mission` repository
4. Railway will auto-detect Node.js and deploy

### Set Environment Variables in Railway

In your Railway project → **Variables** tab, add:

| Variable | Value |
|---|---|
| `GMAIL_USER` | The Gmail address that sends emails (e.g. `info.nwfle@gmail.com`) |
| `GMAIL_APP_PASSWORD` | 16-character Gmail App Password (see below) |

**How to create a Gmail App Password:**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification (must be ON)
3. Security → App Passwords
4. Select "Mail" + "Other" → name it "Marriage on a Mission"
5. Copy the 16-character password → paste into Railway

Railway sets `PORT` automatically — do not set it manually.

---

## Step 4 — Get Your Live URL

Once deployed, Railway gives you a URL like:
`https://marriage-on-a-mission-production.up.railway.app`

You can also add a **custom domain** in Railway → Settings → Domains.

---

## Local Development

```bash
npm install
cp .env.example .env
# Fill in GMAIL_USER and GMAIL_APP_PASSWORD in .env
npm start
# Open http://localhost:3000
```

---

## How Emails Work

### Registration (`POST /api/register`)
1. Participant fills out the form and submits
2. Server sends a **notification** to `info.nwfle@gmail.com` with all couple details
3. Server sends a **confirmation** to the registrant's email with event details and, if they selected lodging, a direct link to reserve their room

### Room Reservation Notification (`POST /api/room-notify`)
1. Participant clicks "Reserve Your Room Now"
2. Server silently sends a **room reservation started** notification to `info.nwfle@gmail.com`
3. Participant is redirected to the Synxis hotel booking portal in a new tab

---

## Updating the Site

Push changes to GitHub — Railway auto-redeploys on every push to `main`.
