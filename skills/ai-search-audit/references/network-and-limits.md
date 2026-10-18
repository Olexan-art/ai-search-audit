# Network, limits, and what to do when the page cannot be fetched

Read this when the user asks what the audit requests or sends, when `read.mjs` prints `REFUSED unreachable` (or the fetch fails some other way), when the shell has no network, or when the skill folder is read-only.

## What the read requests

The read makes requests to the page, its site's `/robots.txt`, its sitemap (the robots.txt `Sitemap:` lines on the same site, else `/sitemap.xml`, and at most 5 child sitemaps of an index), `/llms.txt`, its hreflang alternates (at most 10), a HEAD (or a bodiless GET) of at most 30 of its links and at most 20 of its images, and one request each for the favicon, a path that does not exist (the soft-404 check), at most 3 URL variants (http, www or not, the trailing slash), a Markdown copy of the page, `/.well-known/ai-catalog.json` (then `/ai-catalog.json`) and, only when the page declares one, its IndexNow key file.

Before the page, one DNS lookup of its host and one RDAP request to `rdap.org` (`https://rdap.org/ip/<the site's IP address>`) for the country its server is registered in: that request sends the site's IP address to rdap.org and nothing of the page, and a saved page (`--html`) makes neither. When the page is an empty single-page-app shell, it is also rendered in a local Chrome or Chromium (see *Limits*).

Nothing is uploaded: no server of ours, no account; the only requests are the ones listed above. Every cap is reported in the report and the export.

## Limits

- One public URL per audit. The guard refuses localhost, private and link-local addresses, hostnames without a dot, non-standard ports and anything that is not http(s), on every redirect hop (5 at most) of every request.
- No login and no cookies; no Accept-Language, so a site that picks a language by location may answer in another language.
- No JavaScript in the reading. `--render`, or an empty app shell, also runs the page in a local Chrome, Chromium or Edge (`CHROME_PATH`, else the usual install paths) with a fresh throwaway profile, and draws the sections only the render has as dashed zones on the map. With no browser, the report says the render was not done.
- 12-second timeout per request (8 for a link, an image or a site check), 3,000,000-character ceiling for HTML, 10 MB for a sitemap, 1 MB for llms.txt, the Markdown copy and ai-catalog.json.
- The brand and review readings are one model's knowledge at its training time; they are not a measurement of any assistant, and they say nothing about what ChatGPT, Gemini or Perplexity answer today.
- The fetch sends `User-Agent: GetLoopLoop/1.0 SEO Crawler`.

## No network in the shell, or nowhere to install

Some agents run their shell with no internet (cloud sandboxes such as Codex in the cloud or ChatGPT), or cannot write to their skills folder.

- **The skill folder can live anywhere.** If the agent's skills folder is read-only, unpack `ai-search-audit.zip` (or copy this folder) into any directory you can write, such as the working directory, and use that folder as `$SKILL`. Nothing needs installing. Copying file by file (through a file connector, say) works too, as long as `dist/` comes whole, `dist/chunks/` included; no file in it is over 700 KB. If you cannot get the files at all (no network, downloads blocked), ask the user to attach `ai-search-audit.zip` from the repository's Releases, and wait.
- **No network in the shell:** read.mjs prints `REFUSED unreachable`. Ask the user for a saved copy: the page saved from their browser as "Web page, HTML only" (Ctrl+S, or Cmd+S on a Mac), and, if they can, the site's robots.txt (open `<site>/robots.txt` and save it as text). Then run `node "$SKILL/dist/read.mjs" <url> --html page.html --robots robots.txt --out reading.json` and go on with step 2. Without `--robots`, robots.txt is reported as not checked. Every check that needs the network (the sitemap, llms.txt, the language versions, links, images and the site checks) is then reported as not checked. The report says it read a saved copy.
- **Only files the user gives you.** Do not make the saved copy yourself with a browsing or fetch tool: those return text or Markdown converted from the page, not its HTML, and the reading would not be the page's. And do not fill in for the scripts: a check made by hand is not this tool's result.

## If the page cannot be fetched

When a request fails, read.mjs prints `REFUSED unreachable` (or another refusal code). In a sandbox, say what to change:

- **claude.ai or the Claude desktop app:** code execution reaches only what its network setting allows. On Free, Pro and Max plans the setting is **Allow network egress** (Settings > Capabilities); on Team and Enterprise plans an owner sets it in Organization settings > Capabilities (off, package managers only, package managers and specific domains, or all domains; with specific domains, the page's domain must be listed). If the plan's setting cannot allow the site, say that this page cannot be audited from claude.ai, and that the same skill runs in Claude Code or another agent on the user's own machine. Then stop.
- **Behind a proxy:** if `HTTPS_PROXY` or `HTTP_PROXY` is set and the fetch is `unreachable`, run read.mjs once more with `NODE_USE_ENV_PROXY=1` in front (Node 22.21 or later, or 24 or later).
- **Anywhere else:** the site may be down, the name may not resolve, or the machine has no internet. Say which code came back and stop.
