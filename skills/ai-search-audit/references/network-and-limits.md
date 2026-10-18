# Network, limits, and what to do when the page cannot be fetched

Read this when the user asks what the audit requests or sends, when `read.mjs` prints `REFUSED unreachable` or the fetch fails, when the shell has no network, or when the skill folder is read-only.

## What the read requests

- Before the page: 1 DNS lookup of its host, and 1 RDAP request (`https://rdap.org/ip/<the site's IP address>`) for its server's country. It sends the site's IP address and nothing of the page. A saved page (`--html`) makes neither.
- The page, `/robots.txt`, the sitemap (the robots.txt `Sitemap:` lines on the same site, else `/sitemap.xml`; at most 5 child sitemaps), `/llms.txt`, and at most 10 hreflang alternates.
- A HEAD (or bodiless GET) of at most 30 links and at most 20 images.
- 1 request each: the favicon, a path that does not exist (soft-404 check), at most 3 URL variants (http, www or not, trailing slash), a Markdown copy, `/.well-known/ai-catalog.json` (then `/ai-catalog.json`), and the IndexNow key file if the page declares one.
- An empty single-page-app shell is also rendered in a local browser.

Nothing is uploaded: no server of ours, no account. The report and the export state every cap.

## Limits

- 1 public URL per audit. The guard refuses localhost, private and link-local addresses, hostnames without a dot, non-standard ports and non-http(s), on every redirect hop (at most 5) of every request.
- No login, cookies or Accept-Language. A site that picks a language by location may answer in another language.
- No JavaScript in the reading. `--render`, or an empty app shell, runs the page in a local Chrome, Chromium or Edge (`CHROME_PATH`, else the usual install paths) with a throwaway profile. The map draws sections only the render has as dashed zones. With no browser, the report says the render was not done.
- Timeout: 12 seconds per request; 8 for a link, an image or a site check.
- Ceilings: 3,000,000 characters of HTML; 10 MB for a sitemap; 1 MB for llms.txt, the Markdown copy and ai-catalog.json.
- The brand and review readings are 1 model's knowledge at training time, not a measurement of what ChatGPT, Gemini or Perplexity answer today.
- `User-Agent: GetLoopLoop/1.0 SEO Crawler`.

## No network in the shell, or nowhere to install

Some agents have no internet in the shell (Codex in the cloud, ChatGPT), or cannot write to their skills folder.

**Read-only skill folder.** Unpack `ai-search-audit.zip` (or copy this folder) into a writable directory and use it as `$SKILL`. Copying file by file works if `dist/` comes whole, `dist/chunks/` included; no file in it is over 700 KB. If you cannot get the files, ask the user to attach `ai-search-audit.zip` from the repository's Releases, and wait.

**No network.** `read.mjs` prints `REFUSED unreachable`.

1. Ask the user for the page saved from their browser as "Web page, HTML only" (Ctrl+S, or Cmd+S on a Mac), and if they can, `<site>/robots.txt` saved as text.
2. Run `node "$SKILL/dist/read.mjs" <url> --html page.html --robots robots.txt --out reading.json`, then continue with step 2 of SKILL.md.
3. Without `--robots`, robots.txt is reported as not checked. The sitemap, llms.txt, language versions, links, images and site checks are reported as not checked. The report says it read a saved copy.

Use only files the user gives you. Browsing and fetch tools return converted text, not the page's HTML. Do not do the scripts' work by hand.

## If the page cannot be fetched

Tell the user what to change:

- **claude.ai or the Claude desktop app:** code execution reaches only what its network setting allows. Free, Pro and Max: **Allow network egress** (Settings > Capabilities). Team and Enterprise: an owner sets it in Organization settings > Capabilities (off, package managers only, package managers and specific domains, or all domains; with specific domains, the page's domain must be listed). If the setting cannot allow the site, tell the user that this page cannot be audited from claude.ai, and that the skill runs in Claude Code or another agent on their own machine. Stop.
- **Behind a proxy:** if `HTTPS_PROXY` or `HTTP_PROXY` is set, run `read.mjs` once more with `NODE_USE_ENV_PROXY=1` in front (Node 22.21 or later, or 24 or later).
- **Anywhere else:** the site may be down, the name may not resolve, or there is no internet. Tell the user which code came back, and stop.
