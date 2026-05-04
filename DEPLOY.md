# Deploying VAVADIA to Shared Hosting (cPanel / FTP)

This site is a static Vite + React SPA. Any cPanel / Plesk / FTP shared host (Hostinger, Bluehost, GoDaddy, Namecheap, A2, SiteGround, etc.) can serve it — you do **not** need Node.js on the server. The Express dependency in `package.json` is only used by the AI Studio sandbox and is not part of the production deploy.

## 1. Build locally

```bash
npm install
npm run build
```

Output lands in `dist/`. Inspect it — you should see:

- `dist/index.html`
- `dist/assets/` (fingerprinted JS/CSS bundles)
- `dist/logo.png`
- `dist/.htaccess`  ← critical for React Router

If `dist/.htaccess` is missing, your FTP client is probably hiding dotfiles. See step 3.

## 2. Decide where the site lives

| Where on the server                     | Result                |
| --------------------------------------- | --------------------- |
| `public_html/`                          | `https://example.com` |
| `public_html/vavadia/`                  | `https://example.com/vavadia` |
| `public_html/` of an addon/sub-domain   | `https://sub.example.com` |

`vite.config.ts` uses `base: './'`, so the build works in **any** of those locations without rebuilding.

## 3. Upload the contents of `dist/`

### Option A — cPanel File Manager (easiest)

1. Log in to cPanel → **File Manager**.
2. Navigate to the target folder (e.g. `public_html/`).
3. **Settings** (top right) → check **Show Hidden Files (dotfiles)**. Without this, `.htaccess` will not upload.
4. Delete any old `index.html` / `assets/` from a previous deploy.
5. **Upload** every file from your local `dist/` folder. Make sure `.htaccess` is included.

### Option B — FTP client (FileZilla, WinSCP, Cyberduck)

1. Connect with the FTP credentials from your hosting provider.
2. In the FTP client preferences, enable **Show hidden files** (FileZilla: *Server → Force showing hidden files*).
3. Open your local `dist/` directory and the remote `public_html/` directory.
4. Upload **all** files including `.htaccess`. Overwrite existing files.

### Option C — SSH / rsync (if your host supports it)

```bash
rsync -avz --delete dist/ user@your-host:~/public_html/
```

`--delete` removes stale files from previous builds. Drop it if you want to preserve other files in `public_html/`.

## 4. Verify

After upload, open the site:

- **Home page loads with the new logo** in the navbar.
- **Hero background animates** (gradient mesh drifts, geometric shapes float).
- **Direct URL works** — visit `https://example.com/about` directly (don't navigate from the home page). It should load, not 404. If you get a 404, the `.htaccess` did not upload — go back to step 3 and enable hidden-file visibility.
- **Browser DevTools → Network tab** — refresh and confirm asset URLs use relative paths (e.g. `./assets/index-abc123.js`).

## 5. Known limitations & follow-ups

- **`GEMINI_API_KEY` is bundled into the client JS** if it's set at build time. This is fine for local dev but a security exposure for any public Gemini-using feature. Move Gemini calls to a small server-side proxy before launching anything that depends on the key.
- **No HTTPS auto-config.** Most cPanel hosts give you a free Let's Encrypt cert via the cPanel **SSL/TLS Status** page — turn on "AutoSSL" once your DNS points at the host.
- **No CI/CD.** Every deploy is manual today. If you want push-to-deploy, the easiest path is to switch to Netlify/Vercel/Cloudflare Pages instead of shared hosting.
