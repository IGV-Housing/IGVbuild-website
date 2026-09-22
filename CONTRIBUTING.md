# Contributing to the IGVbuild website

This is a plain HTML/CSS/JS website — there's no build framework (no React, no
Webpack, nothing to "compile" except an optional minification step for CSS/JS).
If you can edit a text file, you can edit this site. This guide covers two
things: how GitHub works, and how *this specific site* is put together.

---

## Part 1 — GitHub basics

### What GitHub actually is

- **Repository ("repo")**: the project folder, tracked by Git, with a full
  history of every change ever made. This site's repo lives at
  `https://github.com/IGV-Housing/igvbuild-website`.
- **Commit**: a saved snapshot of changes, with a short message explaining
  what changed and why.
- **Push**: uploads your commits from your computer to GitHub, where they
  become visible to everyone and (see Part 4) go live on the site.
- **Pull**: downloads the latest commits from GitHub down to your computer.
  Always pull before you start editing, so you're working from the latest
  version.
- **Branch**: a parallel, independent copy of the codebase you can commit to
  without affecting anything else, until it's merged back in.
- **`main` branch**: the live, production version of the site — whatever is
  on `main` is what visitors see. **Nobody pushes directly to `main`.**
- **`staging` branch**: where everyone does their day-to-day work. You pull,
  edit, commit, and push here. Sarah reviews what's on `staging` and merges
  it into `main` manually when it's ready to go live, so `main` never
  receives unreviewed changes.

### Getting set up (one-time)

1. Create a free account at [github.com](https://github.com) if you don't
   have one, and ask to be added as a collaborator on
   `IGV-Housing/igvbuild-website`.
2. Install **[GitHub Desktop](https://desktop.github.com/)** — a free app
   that handles all the Git steps below with buttons instead of commands. No
   command line needed.
3. Install **[VS Code](https://code.visualstudio.com/)** (or any text/code
   editor) to actually edit the files.
4. In GitHub Desktop: **File → Clone Repository**, search for
   `IGV-Housing/igvbuild-website`, and choose a location on your computer
   (e.g. `Desktop`). This downloads the whole site to your machine.
5. In GitHub Desktop's branch switcher (top middle of the window), switch
   from `main` to `staging`. This is the branch you'll work on from now on
   — check it any time you're not sure which branch you're on.

### The everyday workflow

Every time you sit down to make a change:

1. **Open GitHub Desktop**, confirm the branch switcher says **`staging`**
   (switch to it if it doesn't), then click **Fetch origin** and **Pull
   origin** if there are new changes. This makes sure you're editing the
   latest version, not an old copy.
2. **Open the project folder in VS Code** and make your edits (see Part 2
   for how the site is structured).
3. **Preview your change locally** before pushing (see Part 3) — never push
   a change you haven't looked at in a browser.
4. Back in **GitHub Desktop**, you'll see every changed file listed on the
   left, with a red/green diff on the right showing exactly what changed
   line by line. Review it — if something's in there you didn't mean to
   change, that's worth investigating before you commit.
5. Write a **commit message**: a short summary of what you did and why
   (e.g. "Update Contractors hero copy" not "changes" or "fix"). Click
   **Commit to staging**.
6. Click **Push origin**. Your change is now on the `staging` branch on
   GitHub. It is **not live yet** — Sarah reviews `staging` and merges it
   into `main` when it's ready, which is what actually publishes it (see
   Part 5).

### Rules of thumb

- **Never** commit or push directly to `main` — always work on `staging`.
  Double-check the branch switcher in GitHub Desktop before you commit.
- **Never** use "Discard changes" on a file unless you're certain you want
  to throw that work away permanently.
- **Never** force-push, and don't delete either branch. If GitHub Desktop
  warns you about a conflict, stop and ask for help rather than picking an
  option you're unsure about.
- If you're not sure whether a change is safe, make it, preview it locally,
  and ask someone to glance at a screenshot before you push.
- Small, frequent commits with clear messages are much easier to undo than
  one giant commit that changes twenty things at once.

---

## Part 2 — How this site is put together

```
igvbuild/
  index.html, howitworks.html, contractors.html, ...   ← one file per page
  igvhomescatalogue/
    osprey/index.html, summit/index.html, ridgeline/index.html
  css/
    style.css        ← the real, readable stylesheet — EDIT THIS ONE
    style.min.css     ← a compressed copy generated from style.css — every
                        page actually loads this one. See Part 4.
  js/
    main.js           ← the real, readable script — EDIT THIS ONE
    main.min.js        ← compressed copy generated from main.js, actually
                        loaded by every page. See Part 4.
  images/             ← every image/logo/icon used on the site
```

### The most important quirk: there's no shared template

Because this is plain HTML with no build tooling, the navigation bar, the
mega-menu dropdowns, and the footer are **copy-pasted into every single HTML
file**. There is no shared "header.html" the pages all pull from.

This means: if you need to change something in the nav or footer (add a
page, change a link, update the copyright year), **you have to make that
exact same edit in all ~14 HTML files**, not just one. Search-and-replace
across files is the way to do this reliably rather than editing each file
by hand and risking one getting missed. If you're comfortable asking Claude
Code (or another AI coding tool) to do this, that's exactly the kind of
repetitive, error-prone task it's good at — describe the change once and
ask it to apply it to every page.

### Editing text or content on a page

Just open the relevant `.html` file in a text editor and change the text
between the tags. HTML tags (`<h1>`, `<p>`, `<a>`, etc.) are the structure;
don't delete or rearrange them, just change the words inside.

### Adding or swapping an image

1. Drop the new image file into `images/`.
2. Update the `src="images/your-file.jpg"` in the relevant `<img>` tag.
3. Keep an eye on file size — see "Image guidelines" below.

### Making a style (CSS) change

All visual styling lives in `css/style.css` — colors, spacing, fonts, mobile
layout breakpoints, everything. It's a single large file organized in
sections (search for the relevant component name, e.g. `.footer`,
`.contractors-hero`, `.mega-grid`).

---

## Part 3 — Previewing your changes locally

Don't push a change you haven't seen rendered in a browser. This project has
no build step, so previewing is simple:

- **Quickest**: just double-click the `.html` file to open it directly in
  your browser. This works for most content/text edits.
- **More accurate** (needed if you're testing anything that depends on the
  page being served over `http://`, not `file://`): install
  [Node.js](https://nodejs.org/), then from the project folder run:

  ```bash
  npx serve .
  ```

  and open `http://localhost:3000` (or whatever port it prints) in your
  browser. Check both a normal desktop-width window and a narrow
  mobile-width window (browser dev tools → toggle device toolbar) — a lot of
  past bugs on this site were mobile-only layout issues invisible at desktop
  width.

---

## Part 4 — CSS/JS minification (don't skip this)

Every page's `<link>`/`<script>` tag points at `css/style.min.css` and
`js/main.min.js`, **not** the readable `style.css`/`main.js` files. Those
`.min` files are compressed copies — smaller and faster for visitors to
download, but not meant to be hand-edited (they're unreadable on purpose).

**This means: if you edit `css/style.css` or `js/main.js` and don't
regenerate the `.min` versions, your change will not show up on the live
site**, even though it looks correct in the source file. This is the single
most common way a change silently "doesn't work."

To regenerate both after any CSS/JS edit (requires
[Node.js](https://nodejs.org/) installed once):

```bash
npx clean-css-cli -O2 -o css/style.min.css css/style.css
npx terser js/main.js -o js/main.min.js -c -m --comments false
```

Run these from the project's root folder. Then re-check the site locally
(Part 3) before committing — commit **both** the source file and its
regenerated `.min` file together, in the same commit.

---

## Part 5 — Going live

Pushing to `staging` does **not** put your change on igvbuild.com. Two
things have to happen first:

1. **Sarah reviews `staging`** and merges it into `main`. This is the
   approval step — nothing reaches `main` without going through her.
2. *(Placeholder — needs to be filled in.)* It's not clear from the
   repository alone how a merge into `main` then results in igvbuild.com
   actually updating. If it's hosted on Netlify, Vercel, Cloudflare Pages, or
   similar, that service auto-deploys on push to `main` and this section
   should say which one and roughly how long it takes. If it's a manual
   FTP/upload step, that process needs to be documented here so changes
   don't sit merged-but-not-live indefinitely.

If your change doesn't appear on the live site after a while, that's the
first thing to check — has it actually been merged into `main` yet, not
just pushed to `staging`.

---

## Image guidelines

Learned the hard way during a site-wide performance pass — keep these in
mind for any new image you add:

- **Format**: use JPG for photos, PNG only when you genuinely need
  transparency (a cutout graphic, a logo with no background). A photo saved
  as PNG is often 5–10x larger than the same photo as JPG for no visual
  benefit.
- **Size**: resize the image to roughly the largest size it'll actually be
  displayed at (check the CSS or just eyeball the layout) before uploading —
  don't drop in a 5000px-wide camera photo for a 400px-wide thumbnail.
- **Don't leave unused images in `images/`** — if you replace an image,
  delete the old file (check first that nothing else references it —
  `grep -r "old-filename" *.html` from the project root will tell you).

---

## Getting help

If something goes wrong — a merge conflict, an accidental push you want to
undo, a "detached HEAD" message you don't understand — stop and ask rather
than clicking through prompts you're unsure about. Most Git mistakes are
recoverable if caught early, and much harder to fix after several more
commits pile on top.
