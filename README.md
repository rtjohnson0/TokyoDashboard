# Japan 2026 Trip App — Setup

One file (`index.html`) — itinerary, an "Explore" list filterable by city/type
with photos and map links, a live map, a budget tracker, a packing list, a
reservations tracker, and a phrasebook/train-tips guide. Built for GitHub
Pages, works offline and syncs back up when you get signal.

You only need to do the Firebase part once. ~10 minutes.

## 1. Create a free Firebase project

1. Go to https://console.firebase.google.com and sign in with a Google account.
2. Click **Add project** → name it anything (e.g. `japan-2026-trip`) → skip
   Google Analytics (not needed) → **Create project**.
3. Once created, click the **`</>`  (Web)** icon to add a web app.
4. Name it anything, click **Register app**. Skip the "Firebase Hosting" checkbox.
5. You'll see a `firebaseConfig` object like this:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "japan-2026-trip.firebaseapp.com",
     projectId: "japan-2026-trip",
     storageBucket: "japan-2026-trip.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
   Copy the whole thing.

## 2. Turn on Firestore (the database)

1. In the left sidebar, click **Build → Firestore Database**.
2. Click **Create database** → choose a region close to you → start in
   **test mode** for now (we'll lock it down in step 4).

## 3. Paste your config into the app

Open `index.html`, find this block near the top of the `<script>` tag:

```js
const firebaseConfig = {
  apiKey: "PASTE_ME",
  ...
};
```

Replace it with the config you copied in step 1. Save the file.

## 4. Lock down access

In Firestore, click the **Rules** tab and replace the contents with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/{tripCode} {
      allow read, write: if true;
    }
  }
}
```

This opens up the `trips/{tripCode}` documents only — nothing else in your
project is exposed. It's not password-protected, so anyone who is given a
specific trip code could read/write that trip's data — see the trip code
section below for what that means in practice.

## 5. Put it on GitHub Pages

1. Create a new GitHub repo (public or private both work for Pages).
2. Upload `index.html`, `manifest.json`, `icon-192.png`, `icon-512.png`,
   `apple-touch-icon.png`, and `service-worker.js` to the repo (drag-and-drop
   on github.com works).
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment," set **Source: Deploy from a branch**,
   branch: `main`, folder: `/ (root)`. Save.
5. Wait ~1 minute, then your site is live at:
   `https://<your-username>.github.io/<repo-name>/`

## Trip codes — how sharing works

The first time the site loads with Firebase connected, it'll ask for a
**trip code** — make one up (a word, a phrase, anything) and tap OK. That
code is the "room" your data lives in.

- **You and your travel partner**: both enter the *exact same* trip code
  the first time you open the site. From then on your budget, packing list,
  and checked-off Explore items sync live between your two phones.
- **A friend you send the link to**: if they enter a *different* trip code
  (or you never tell them yours), they get their own empty version of the
  same app — completely separate from your data. They'd only see your real
  trip data if you told them your exact code.
- **Change your code anytime**: tap the "Code: ..." pill at the top of the
  Budget tab to switch codes — useful if you want to start fresh or split
  off a different group.

Since the rules above don't require a password, treat your trip code like a
shared secret between just you and your travel partner — don't post it
publicly, and you're fine.

## Notes on what's static vs. live

- **Itinerary tab**, the **Explore list** (names, categories, notes, prices),
  the **phrasebook/train tips**, and the **reservation deadlines** are baked
  into the page — edit the relevant arrays near the top of the `<script>`
  block to change them, then re-upload the file to GitHub.
- **Budget expenses**, **packing list**, and **"done" checkmarks** in
  Explore are the live, shared, synced parts — those don't need a
  re-upload, they just work from any browser once Firebase + a trip code
  are set up.
- **Photos**: most places use hand-picked links you supplied (permanent,
  no API needed). Anything without one falls back to Google Image Search →
  Unsplash → a generic category photo, in that order, each with its own
  free-tier rate limit.
- **Map links** open Google Maps search for the place name. The Map tab
  embeds your actual Google My Maps.
