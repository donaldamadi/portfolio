# Pointing donaldamadi.dev at this site

Registrar: **Namecheap**. Host: **Vercel**, project `portfolio`
(`prj_eDqhfBiDLklLihqwNSEGZJFzJmiD`, team `donaldamadis-projects`).

The code side is already done: `SITE_URL` in `src/content/profile.ts` is now `https://donaldamadi.dev`,
which is the single source for `metadataBase`, canonical URLs, the sitemap, `robots.txt`, the OG image
URLs and the JSON-LD `Person` schema. Everything below is dashboard and DNS work.

Do it in this order. Adding the domain in Vercel first is what gives you the exact DNS values to type
into Namecheap, and those values are now project-specific rather than the generic ones you'll find in
old blog posts.

---

## 1. Vercel: claim the domain

1. Vercel → project **portfolio** → **Settings → Domains**.
2. Add `donaldamadi.dev`. Choose **"I'll add DNS records myself"**, not the nameserver option, unless
   you want Vercel running your whole zone (see the note at the bottom).
3. Add `www.donaldamadi.dev` as well, and set it to **redirect to `donaldamadi.dev`** (308).
   Pick one canonical host and make the other bounce to it. Two hosts serving identical content splits
   your search ranking and makes analytics lie to you.
4. Vercel now shows you the exact records to create. **Use the values on that screen**, not the ones
   below, if they differ.

## 2. Namecheap: the DNS records

Namecheap → **Domain List → Manage (donaldamadi.dev) → Advanced DNS**.

**First, delete what Namecheap put there by default.** A fresh domain ships with a parking page, and
those records will fight yours:

- `CNAME` · Host `www` · Value `parkingpage.namecheap.com.` → delete
- `URL Redirect Record` · Host `@` → delete

**Then add:**

| Type            | Host  | Value                        | TTL       |
| --------------- | ----- | ---------------------------- | --------- |
| `A Record`      | `@`   | `76.76.21.21`                | Automatic |
| `CNAME Record`  | `www` | `cname.vercel-dns.com.`      | Automatic |

Vercel may instead show you a project-scoped CNAME target that looks like
`cname.vercel-dns-0xx.com`. If it does, use that one. Namecheap appends the trailing dot itself, so
don't worry if it disappears after saving.

**Check the nameservers while you're on that page.** Under **Domain → Nameservers**, it must say
**Namecheap BasicDNS**. If it says *Namecheap Web Hosting DNS* or *Custom DNS*, the Advanced DNS tab
you just edited is being ignored, and nothing will work.

## 3. Wait, then verify

Namecheap usually propagates in 5 to 30 minutes. Vercel polls, and once it sees the records it issues a
Let's Encrypt certificate automatically, so you do nothing for TLS.

```bash
dig +short donaldamadi.dev            # expect 76.76.21.21
dig +short www.donaldamadi.dev        # expect a cname.vercel-dns…  target
curl -sI https://donaldamadi.dev | head -1   # expect HTTP/2 200
```

**`.dev` is on the HSTS preload list.** Browsers refuse plain HTTP for the entire TLD, permanently. So
until Vercel finishes issuing the certificate you'll get a scary TLS warning rather than a normal
"can't connect". That's expected, and it clears itself. There is no `http://` fallback to test with,
which is also why the app now sends a `Strict-Transport-Security` header of its own.

## 4. Make it the production domain

Back in **Settings → Domains**, make sure `donaldamadi.dev` is marked as the **production domain**, so
Vercel's own links, deployment notifications and the `VERCEL_PROJECT_PRODUCTION_URL` env var all point
at it rather than at `portfolio-theta-ivory-….vercel.app`.

## 5. Last checks, five minutes

- Open **https://donaldamadi.dev/sitemap.xml**, where every URL should start with `https://donaldamadi.dev`.
  If they still say `.vercel.app`, the deploy predates the `SITE_URL` change; push and redeploy.
- Paste the URL into **LinkedIn's Post Inspector** (`linkedin.com/post-inspector`) and into a Slack or
  WhatsApp message. You should get the dark card with the headline on it. LinkedIn caches link previews
  hard, so do this *before* you start putting the link on applications, not after.
- `https://donaldamadi.dev/cv` and `/resume` now both redirect to the PDF. Easier to say out loud than
  a filename, and worth knowing you have.

---

### The alternative: give Vercel the whole zone

Instead of the two records above you can set Namecheap's nameservers to `ns1.vercel-dns.com` and
`ns2.vercel-dns.com`. Vercel then manages the zone, and apex handling gets slightly more robust.

I wouldn't. It also means every future DNS record, whether an email provider or a domain-verification TXT for
Google Workspace, has to be created in Vercel rather than at your registrar, and if you ever
move off Vercel you're re-creating the whole zone under time pressure. Two records at the registrar is
the smaller blast radius, and this is a static site: you gain nothing from the fancier setup.
