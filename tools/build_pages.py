#!/usr/bin/env python3
"""Generates the SEO layer of the Outreach site into ../public:

  * extra pages (services, how-it-works, pricing, contact) + 404.html
  * unique <title>, meta description, canonical, Open Graph, breadcrumbs and JSON-LD on every page
  * sitemap.xml, robots.txt, llms.txt
  * the SEO <head> block + crawlable footer links on the 3D home page (between <!-- seo:* --> markers)
  * minified copies of the hand-written scripts (sources live in ../site-src)

Run after any content change:  python3 tools/build_pages.py
Switching to a custom domain = change SITE below and run it again.
"""
import json, pathlib, re, subprocess, shutil, datetime, html

SITE = "https://outreach-web.mishogorgadze.workers.dev"   # canonical origin (no trailing slash)
ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
SRC = ROOT / "site-src"
TODAY = datetime.date.today().isoformat()

BUSINESS = {
    "name": "Outreach",
    "description": "Outreach designs, builds and hosts fast, mobile-ready websites for small businesses in Georgia. "
                   "You see a working demo first, then rent the site monthly or buy it outright.",
    "locality": "Tbilisi", "country": "GE", "area": "Georgia",
    "price_range": "100–350 ₾ / month",
    # Fill these in when they exist; empty values are left out of the structured data.
    "telephone": "", "email": "", "street": "", "same_as": [],
}

PLANS = [  # same plans as the main Outreach site (WebB-Site)
    ("START", 100, 150, "A site for your business.", ["Your own .ge domain", "Hosting and SSL", "One change a month"]),
    ("CHAT", 160, 150, "A site that answers questions.", ["Everything in START", "FAQ chat for your customers", "Two changes a month"]),
    ("PRO", 250, 250, "A site that collects enquiries.", ["Everything in CHAT", "Booking and contact forms", "Google Business profile"]),
    ("PAY", 350, 450, "A site that takes payment.", ["Everything in PRO", "Online payments", "Money goes straight to your bank"]),
]
FAQ = [
    ("What happens if I stop paying?", "The domain is registered in your name from day one, so it stays yours. We hand over DNS control within five working days, and export your form data as a spreadsheet."),
    ("Can I buy the site instead of renting?", "Yes. Buying outright runs 2,000–4,200 ₾ depending on the package. After twelve paid months the buyout price drops, reaching 60% at two years."),
    ("Do I need to understand any of this?", "No. You know your business, we handle the website. We ask for your text and photos and do the rest."),
    ("How fast does it go live?", "Setup takes five working days once we have your content. Changes after that are two to three working days depending on your package."),
]
STEPS = [
    ("We build it.", "Before we ever call you. Your business, your photos, your prices: a real site, not a mockup."),
    ("You look at it.", "We send you a link. Open it on your phone. If it is not right, we change it or we stop there."),
    ("You decide.", "Rent it monthly, or buy it outright and take the code with you. No lock-in either way."),
]
SERVICES = [
    ("Design & build", "A fast, mobile-ready website shaped around your business: your texts, your photos, your prices. You see a working demo before you pay a single lari.",
     ["Custom design in your colours", "Works on every phone, tablet and laptop", "Your own .ge domain"]),
    ("Hosting & care", "Hosting, SSL, updates and fixes are part of every plan. We keep the site running, you keep running your business.",
     ["Hosting and SSL included", "Monthly changes included", "Problems fixed for you"]),
    ("Rent or own", "Start monthly with no big upfront cost. After twelve paid months you can buy the site, and the buyout price keeps going down.",
     ["From 100 ₾ a month", "Cancel with 30 days notice", "Buy outright from 2,000 ₾"]),
    ("Grow with it", "Add a FAQ chat, booking and contact forms, a Google Business profile or online payments when you need them.",
     ["FAQ chat for customers", "Booking and contact forms", "Online payments to your bank"]),
]

# ── pages ──
PAGES = {  # slug: (nav label, <title>, meta description)
    "": ("Home", "Outreach — Website design & hosting in Tbilisi",
         "Outreach designs, builds and hosts fast websites for small businesses in Georgia. See a working demo first, then rent from 100 ₾/month or buy it."),
    "services/": ("Services", "Website design, hosting & care — Services | Outreach",
                  "Design and build, hosting and care, rent or own: everything Outreach does for small businesses in Georgia, in plain words."),
    "how-it-works/": ("How it works", "How it works: demo first, pay after | Outreach",
                      "We build your website first and send you a link. You look at it on your phone, then decide to rent or buy. No lock-in."),
    "pricing/": ("Pricing", "Website pricing from 100 ₾/month — Plans | Outreach",
                 "START 100 ₾, CHAT 160 ₾, PRO 250 ₾, PAY 350 ₾ a month with hosting, SSL and changes included. Buy outright from 2,000 ₾."),
    "contact/": ("Contact", "Contact Outreach — Web studio in Tbilisi, Georgia",
                 "Talk to Outreach about a website for your business. Based in Tbilisi, working with small businesses across Georgia."),
}
NAV = ["services/", "how-it-works/", "pricing/", "contact/"]


def url(slug=""):
    return f"{SITE}/{slug}"


def esc(s):
    return html.escape(s, quote=True)


def ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "</script>"


def business_ld():
    b = BUSINESS
    o = {
        "@type": "ProfessionalService", "@id": url() + "#business", "name": b["name"], "url": url(),
        "logo": url("outreach-logo.svg"), "image": url("outreach-logo.svg"), "description": b["description"],
        "address": {"@type": "PostalAddress", "addressLocality": b["locality"], "addressCountry": b["country"]},
        "areaServed": {"@type": "Country", "name": b["area"]}, "priceRange": b["price_range"],
        "currenciesAccepted": "GEL", "knowsLanguage": ["ka", "en", "ru"],
        "makesOffer": [{"@type": "Offer", "name": f"{n} plan", "description": s, "price": p, "priceCurrency": "GEL",
                        "priceSpecification": {"@type": "UnitPriceSpecification", "price": p, "priceCurrency": "GEL",
                                               "billingDuration": "P1M", "unitText": "month"}} for n, p, _, s, _ in PLANS],
    }
    if b["street"]: o["address"]["streetAddress"] = b["street"]
    if b["telephone"]: o["telephone"] = b["telephone"]
    if b["email"]: o["email"] = b["email"]
    if b["same_as"]: o["sameAs"] = b["same_as"]
    return o


def website_ld():
    return {"@type": "WebSite", "@id": url() + "#website", "url": url(), "name": "Outreach",
            "inLanguage": ["en", "ka", "ru"], "publisher": {"@id": url() + "#business"}}


def crumbs_ld(slug):
    items = [("Home", url())] + ([(PAGES[slug][0], url(slug))] if slug else [])
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]}


def head(slug, extra_ld=(), robots="index,follow", canonical=True):
    label, title, desc = PAGES.get(slug, ("", "Page not found | Outreach", "This page does not exist. Go back to Outreach."))
    graph = [website_ld(), business_ld()] + ([crumbs_ld(slug)] if slug in PAGES else []) + list(extra_ld)
    can = f'\n    <link rel="canonical" href="{url(slug)}">' if canonical else ""
    og = (f'\n    <meta property="og:type" content="website">\n    <meta property="og:site_name" content="Outreach">'
          f'\n    <meta property="og:title" content="{esc(title)}">\n    <meta property="og:description" content="{esc(desc)}">'
          f'\n    <meta property="og:url" content="{url(slug)}">\n    <meta property="og:locale" content="en_US">'
          f'\n    <meta property="og:locale:alternate" content="ka_GE">\n    <meta property="og:locale:alternate" content="ru_RU">'
          f'\n    <meta name="twitter:card" content="summary">') if canonical else ""
    return (f'    <title>{esc(title)}</title>\n    <meta name="description" content="{esc(desc)}">\n'
            f'    <meta name="robots" content="{robots}">{can}{og}\n    <meta name="theme-color" content="#FAF7F2">\n'
            f'    {ld({"@context": "https://schema.org", "@graph": graph})}')


def page_shell(slug, body, extra_ld=(), robots="index,follow", canonical=True, depth=1):
    up = "../" * depth
    nav = "".join(f'<a href="{up}{s}"{" aria-current=\"page\"" if s == slug else ""}>{PAGES[s][0]}</a>' for s in NAV)
    crumb = ""
    if slug in PAGES and slug:
        crumb = (f'<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="{up}">Home</a></li>'
                 f'<li aria-current="page">{PAGES[slug][0]}</li></ol></nav>')
    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
{head(slug, extra_ld, robots, canonical)}
    <link rel="icon" type="image/svg+xml" href="{up}favicon.svg">
    <script src="{up}theme.js"></script>
    <link rel="stylesheet" href="{up}site.css">
  </head>
  <body>
    <header class="top">
      <a class="brand" href="{up}" aria-label="Outreach home"><img src="{up}outreach-logo.svg" alt="Outreach" width="680" height="210"></a>
      <nav class="links" aria-label="Main">{nav}</nav>
    </header>
    <main>
      {crumb}
{body}
    </main>
    <footer class="foot">
      <p><strong>Outreach</strong> · Websites, hosting and care · Tbilisi, Georgia</p>
      <nav aria-label="Footer"><a href="{up}">Home</a>{nav}</nav>
      <p class="small">© {datetime.date.today().year} Outreach</p>
    </footer>
  </body>
</html>
"""


def cta(up):
    return (f'<section class="cta"><h2>Want to see your website first?</h2><p>Tell us the name of your business. We build something and send you a link.</p>'
            f'<p class="actions"><a class="btn btn--primary" href="{up}?chat=contact">Talk to us</a><a class="btn" href="{up}pricing/">See pricing</a></p></section>')


def build_pages():
    up = "../"
    # services
    cards = "".join(f'<article class="card"><h2>{esc(t)}</h2><p>{esc(b)}</p><ul>{"".join(f"<li>{esc(x)}</li>" for x in li)}</ul></article>'
                    for t, b, li in SERVICES)
    services_ld = {"@type": "ItemList", "name": "Outreach services", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "item": {"@type": "Service", "name": t, "description": b, "serviceType": "Web design and hosting",
                                                          "provider": {"@id": url() + "#business"}, "areaServed": {"@type": "Country", "name": "Georgia"}}}
        for i, (t, b, _) in enumerate(SERVICES)]}
    write("services/index.html", page_shell("services/", f"""      <section class="intro"><p class="eyebrow">&gt; What we do</p><h1>Your website, handled.</h1>
        <p class="lede">One team for the whole thing: design, launch, hosting and care. Four parts, zero headaches.</p></section>
      <section class="grid">{cards}</section>
      {cta(up)}""", [services_ld]))

    # how it works (+ FAQ)
    steps = "".join(f'<li class="step"><span class="num">{i + 1:02d}</span><div><h2>{esc(t)}</h2><p>{esc(b)}</p></div></li>' for i, (t, b) in enumerate(STEPS))
    faq = "".join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in FAQ)
    faq_ld = {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}
    howto_ld = {"@type": "HowTo", "name": "How to get a website from Outreach", "step": [
        {"@type": "HowToStep", "position": i + 1, "name": t, "text": b} for i, (t, b) in enumerate(STEPS)]}
    write("how-it-works/index.html", page_shell("how-it-works/", f"""      <section class="intro"><p class="eyebrow">&gt; How it works</p><h1>Demo first. You decide after.</h1>
        <p class="lede">We build your website before you pay anything, so you see exactly what you get.</p></section>
      <ol class="steps">{steps}</ol>
      <section class="faq"><h2>Questions</h2>{faq}</section>
      {cta(up)}""", [howto_ld, faq_ld]))

    # pricing
    plans = "".join(
        f'<article class="card plan{" plan--lead" if n == "CHAT" else ""}"><h2>{n}</h2><p class="price"><strong>{p} ₾</strong> / month</p>'
        f'<p>{esc(s)}</p><ul>{"".join(f"<li>{esc(x)}</li>" for x in li)}</ul><p class="small">Setup {su} ₾, charged once</p></article>'
        for n, p, su, s, li in PLANS)
    catalog_ld = {"@type": "OfferCatalog", "name": "Outreach website plans", "itemListElement": [
        {"@type": "Offer", "name": f"{n} plan", "description": s + " " + ", ".join(li) + ".", "price": p, "priceCurrency": "GEL", "url": url("pricing/"),
         "priceSpecification": [{"@type": "UnitPriceSpecification", "price": p, "priceCurrency": "GEL", "billingDuration": "P1M", "unitText": "month"},
                                {"@type": "UnitPriceSpecification", "price": su, "priceCurrency": "GEL", "name": "Setup fee"}],
         "seller": {"@id": url() + "#business"}} for n, p, su, s, li in PLANS]}
    write("pricing/index.html", page_shell("pricing/", f"""      <section class="intro"><p class="eyebrow">&gt; Pricing</p><h1>Simple monthly plans.</h1>
        <p class="lede">Monthly. Cancel with 30 days notice. Setup is charged once. Hosting, SSL and changes are always included.</p></section>
      <section class="grid grid--plans">{plans}</section>
      <section class="note"><h2>Want to own it?</h2><p>{esc(FAQ[1][1])}</p></section>
      {cta(up)}""", [catalog_ld]))

    # contact
    contact_ld = {"@type": "ContactPage", "name": "Contact Outreach", "url": url("contact/"), "about": {"@id": url() + "#business"}}
    write("contact/index.html", page_shell("contact/", f"""      <section class="intro"><p class="eyebrow">&gt; Contact</p><h1>Let's build your website.</h1>
        <p class="lede">Tell us what you do and we'll come back with a plan and a price. No jargon, no surprises.</p></section>
      <section class="grid grid--two">
        <article class="card"><h2>Chat with us</h2><p>The quickest way: open the chat, leave your name and how to reach you, and our team gets back to you.</p>
          <p><a class="btn btn--primary" href="{up}?chat=contact">Open the chat</a></p></article>
        <article class="card"><h2>Where we are</h2><address>Outreach<br>Tbilisi, Georgia</address><p>We work with small businesses all over Georgia, in Georgian, English and Russian.</p></article>
      </section>""", [contact_ld]))

    # 404
    write("404.html", page_shell("404", f"""      <section class="intro intro--404"><p class="eyebrow">&gt; Error 404</p><h1>This page doesn't exist.</h1>
        <p class="lede">The link may be old or mistyped. Here is where you can go instead:</p>
        <p class="actions"><a class="btn btn--primary" href="/">Back to the home page</a><a class="btn" href="/services/">Our services</a><a class="btn" href="/pricing/">Pricing</a></p></section>""",
        robots="noindex,follow", canonical=False, depth=0).replace('href="favicon.svg"', 'href="/favicon.svg"')
        .replace('src="theme.js"', 'src="/theme.js"').replace('href="site.css"', 'href="/site.css"')
        .replace('src="outreach-logo.svg"', 'src="/outreach-logo.svg"').replace('href=""', 'href="/"')
        .replace('href="services/"', 'href="/services/"').replace('href="how-it-works/"', 'href="/how-it-works/"')
        .replace('href="pricing/"', 'href="/pricing/"').replace('href="contact/"', 'href="/contact/"'))


def build_home():
    p = PUB / "index.html"
    s = p.read_text()
    block = "    <!-- seo:start -->\n" + head("") + "\n    <!-- seo:end -->"
    s = re.sub(r"    <!-- seo:start -->.*?<!-- seo:end -->", lambda m: block, s, flags=re.S) if "<!-- seo:start -->" in s \
        else re.sub(r"    <title>.*?</title>", lambda m: block, s, count=1, flags=re.S)
    links = "".join(f'<a href="{s_}">{PAGES[s_][0]}</a>' for s_ in NAV)
    foot = (f'<!-- seo-foot:start --><footer class="ox-sitefoot"><p><strong>Outreach</strong> · Websites, hosting and care · Tbilisi, Georgia</p>'
            f'<nav aria-label="Site">{links}</nav></footer><!-- seo-foot:end -->')
    s = re.sub(r"<!-- seo-foot:start -->.*?<!-- seo-foot:end -->", lambda m: foot, s, flags=re.S) if "<!-- seo-foot:start -->" in s \
        else s.replace("</body>", foot + "</body>", 1)
    p.write_text(s)


def build_files():
    write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
        f"  <url><loc>{url(s)}</loc><lastmod>{TODAY}</lastmod><changefreq>{'weekly' if not s else 'monthly'}</changefreq><priority>{'1.0' if not s else '0.8'}</priority></url>\n"
        for s in PAGES) + "</urlset>\n")
    write("robots.txt", f"User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: {url('sitemap.xml')}\n")
    plans = "\n".join(f"- {n}: {p} ₾/month (setup {su} ₾). {s} Includes: {', '.join(li)}." for n, p, su, s, li in PLANS)
    faq = "\n".join(f"- {q} {a}" for q, a in FAQ)
    write("llms.txt", f"""# Outreach

> Outreach is a web studio in Tbilisi, Georgia. It designs, builds, hosts and maintains fast, mobile-ready websites for small businesses. Clients see a working demo before paying, then rent the site monthly or buy it outright. Languages: Georgian, English, Russian.

## Pages

- [Home]({url()}): interactive 3D overview of Outreach.
- [Services]({url('services/')}): design & build, hosting & care, rent or own, add-ons.
- [How it works]({url('how-it-works/')}): demo first, pay after; frequently asked questions.
- [Pricing]({url('pricing/')}): monthly plans, setup fees and buyout.
- [Contact]({url('contact/')}): how to reach the team.

## Plans

{plans}

Monthly billing, cancel with 30 days notice, setup charged once. Hosting, SSL and changes included.

## FAQ

{faq}
""")
    write("_headers", """/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/sitemap.xml
  Content-Type: application/xml; charset=utf-8

/llms.txt
  Content-Type: text/plain; charset=utf-8
""")


def minify_scripts():
    """site-src/*.js (readable) -> public/*.js (minified). Uses terser if available, else copies."""
    terser = shutil.which("terser") or str(pathlib.Path.home() / ".cache/outreach-min/node_modules/.bin/terser")
    for f in sorted(SRC.glob("*.js")):
        out = PUB / f.name
        try:
            subprocess.run([terser, str(f), "--compress", "--mangle", "--comments", "false", "-o", str(out)], check=True, capture_output=True)
        except Exception:
            shutil.copyfile(f, out)
        print(f"  {f.name}: {f.stat().st_size} -> {out.stat().st_size} bytes")


def write(rel, text):
    path = PUB / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    print("  wrote", rel)


if __name__ == "__main__":
    build_pages(); build_home(); build_files(); minify_scripts()
