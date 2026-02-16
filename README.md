# Personal website (GitHub Pages)

A simple, static personal site ready to publish on **GitHub Pages**.

## What’s in this folder

- **index.html** — Main page (hero, about, work, contact)
- **styles.css** — Layout and styling
- **script.js** — Footer year, mobile menu

Edit these files to add your name, tagline, bio, projects, and links.

---

## Publish on GitHub Pages

### Option A: Your main personal page (`username.github.io`)

Your site will live at **https://YOUR_USERNAME.github.io**.

1. **Create the repo on GitHub**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: **YOUR_USERNAME.github.io** (replace with your GitHub username)
   - Public, no need to add README or .gitignore
   - Click **Create repository**

2. **Push this folder into the repo**
   ```bash
   cd "/Users/kadaireskandar/New project/personal-site"
   git init
   git add .
   git commit -m "Initial commit: personal site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
   git push -u origin main
   ```

3. **Turn on GitHub Pages**
   - On the repo page: **Settings → Pages**
   - Under **Source**, choose **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)**
   - Save

4. Wait a minute or two, then open **https://YOUR_USERNAME.github.io**.

---

### Option B: Project site (e.g. `username.github.io/my-site`)

Your site will live at **https://YOUR_USERNAME.github.io/REPO_NAME**.

1. Create a **new repository** with any name (e.g. `my-personal-site`).
2. Push the contents of this **personal-site** folder into that repo (same `git init`, `add`, `commit`, `remote`, `push` as above, but use the new repo URL).
3. **Settings → Pages**: Source = **Deploy from a branch**, branch = **main**, folder = **/ (root)**.
4. Visit **https://YOUR_USERNAME.github.io/REPO_NAME**.

---

## Customize the site

- **index.html**: Replace “Your Name”, tagline, about text, project titles/descriptions/links, and contact links (email, GitHub, LinkedIn, Twitter).
- **styles.css**: Change `:root` colors (e.g. `--accent`, `--bg`) to match your style.
- Add more sections or project cards by copying the existing HTML/CSS patterns.

No build step required — edit, commit, and push to update the live site.
