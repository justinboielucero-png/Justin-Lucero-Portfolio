# Sylvon James Gonzaga — JRU E-Portfolio

A responsive frontend-only e-portfolio inspired by the structure and feel of [brittanychiang.com](https://brittanychiang.com/), with a distinct original layout implementation and styling.

## Run locally

No installation or build tools required. Open `index.html` in a browser, or run:

```bash
python -m http.server 5500
```

Then visit `http://localhost:5500`.

## Deploy using GitHub Pages

1. Create a new GitHub repository (e.g. `e-portfolio`).
2. Upload **all files and folders from this folder** to the repository root. Commit to `main`.
3. Open **Settings → Pages → Build and deployment**.
4. Under **Source**, select **Deploy from a branch**.
5. Choose **main** and **/(root)**, then **Save**.
6. Your live URL will be `https://YOUR_USERNAME.github.io/e-portfolio/` (if your repo name is `e-portfolio`).

All asset paths are relative, so the site also works under a repository subpath. No API keys, environment variables, or backend required.

## What to customize before submitting

- **Identity, about, school, experience, and projects**: edit `index.html`.
- **Three term reflections**: edit the `reflections` object at the top of `script.js`. The supplied wording is a prompt, **not a reflection to submit**.
- **Compiled activities PDF**: put it in `documents/`, e.g. `documents/programming-activities.pdf`, and change the first archive card in `index.html` to link to it.
- **Project documentation**: place PDF files in `documents/` and add links to the corresponding archive cards.
- **Video presentation**: upload your video to YouTube/Drive and insert a real URL into the archive card (or add an MP4 file if size permits).
- **Seminars, trainings, organizations, awards and internships**: replace the explicitly marked placeholder entries with real details and proofs.
- **GitHub / email links**: replace `https://github.com/` and `YOUR_EMAIL@example.com` with your own links. The current email is intentionally nonfunctional.

### Example of linking a document

```html
<a href="documents/programming-activities.pdf" target="_blank" rel="noopener noreferrer">View compiled activities PDF ↗</a>
```

Only enable a link after you've added the matching file. Avoid claiming placeholder content as completed work.

## Assignment coverage

- Welcome page
- About Me
- Academics & Relevant Works (compiled PTs, documentation, presentation)
- Work/Immersion, Seminars/Training, Organizations/Community Involvement, Awards/Recognition
- Separate Prelim, Midterm and Final term reflections

## Files

- `index.html` — page content and structure
- `styles.css` — design and responsive layout
- `script.js` — reflection switching, scroll navigation and glow effect
- `assets/favicon.svg` — original monogram icon
- `documents/` — put your PDFs here
- `.nojekyll` — GitHub Pages compatibility