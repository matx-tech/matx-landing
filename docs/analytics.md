# Analüütika (Plausible)

Leht kasutab [Plausible](https://plausible.io) — küpsiseta veebianalüütikat, mis töötleb
ainult IP-aadressist tuletatud liiklus- ja asukohaandmeid (isikuid ei tuvastata; nõusolekubännerit
ei vaja). Juhend põhineb [plausible.io/docs](https://plausible.io/docs) (GitHubi peegel:
github.com/plausible/docs).

## Aktiveerimine

1. Loo Plausible'is sait domeenile `matx.ee` (plausible.io → **Add new site**).
2. **Site Installation** jaotises lülita sisse soovitatud mõõtmised:
   - **Outbound links** (välislinkide klikid — vaikimisi sees)
   - **Form submissions** (vormi saatmised)
   - **Custom events** (kohandatud sündmused)
   - **Custom properties** (sündmuste omadused)
   - **404 error pages** (eeldab koodi — juba lisatud `app/not-found.tsx`)
3. Kopeeri oma saidi skripti URL (kujul `https://plausible.io/js/pa-XXXXX.js`) ja pane see
   VPS-i keskkonnamuutujana: `PLAUSIBLE_SCRIPT_URL=https://plausible.io/js/pa-XXXXX.js`
   (systemd: `Environment=`; muidu `next start` loeb `.env.local`).
   Kuni muutuja puudub, on analüütika täielikult välja lülitatud (trackerit ei initsialiseerita
   ega proxy'd ei käivitata). Kohalikuks testimiseks pane sama muutuja `.env.local`-isse —
   dev-režiimis loendatakse localhost liiklust (`captureOnLocalhost`).

## Kuidas see töötab

- `proxy.ts` proksib `/js/script.js` → Plausible'i isikupärastatud skript ja
  `/api/event` → Plausible'i API. Esimese osapoole ühendus matx.ee kaudu: ei sõltu
  adblockeritest (dokumentatsioon: muidu jääb 5–25% külastusi kahe silma vahele) ega
  nõrgenda CSP-d — `script-src 'self'` ja `connect-src 'self'` jäävad kehtima.
- Proks edastab Plausible'ile ainult vajalikud päised: `User-Agent` (unikaalse külastaja
  arvestus), `Content-Type` ja `X-Forwarded-For` (külastaja IP). Ilma viimaseta lükkab
  Plausible'i botifilter sündmuse vaikselt tagasi (docs/events-api). VPS-il on päis
  garanteeritud: Next täidab selle ise socketi aadressist, kui keegi ees seda ei sea —
  nginx/Caddy/Cloudflare ees ei vaja seega eraldi konfiguratsiooni.
- `components/providers/analytics-provider.tsx`: trackeri initsialiseerimine NPM-teegiga
  `@plausible-analytics/tracker` (dokumentatsiooni soovitatud NPM-lahendus) — endpoint,
  outboundLinks, formSubmissions; devis ka captureOnLocalhost. Eraldi skripti ei laeta —
  teek ise on tracker (lehevaatamised, sh SPA-navigatsioon, automaatsed kuularid).
- `lib/analytics.ts`: tüübikindel `track()` (puhverdab sündmused enne init'i — vajalik
  404-sündmuse jaoks) + sündmuste nimede loend (EVENTS).

## Sündmused ja eesmärgid (Goals)

| Sündmus | Kust | Props | Eesmärk dashboardis |
| --- | --- | --- | --- |
| `404` | `app/not-found.tsx` | — | Custom event `404` |
| `Outbound Link: Click` | automaatne (outboundLinks) | — | automaatne |
| `Form: Submission` | automaatne (formSubmissions) | — | automaatne |
| `Dialog Open` | registreerimisdialoogi avamine | — | Custom event |
| `Pilot Signup` | registreerimisvormi edukas saatmine | `role` | Custom event |
| `Section Reveal` | gated sektsiooni laadimine | `section` | Custom event |
| `Theme Toggle` | teema vahetamine | `theme` | Custom event |

Eesmärgid lisa dashboardis (Goals → **Add goal** → Custom event); nimi peab täpselt
ühtima (suur- ja väiketähed loevad). Sündmus loendub eesmärgina alles pärast eesmärgi
loomist.

## Kontroll

- `pnpm build && pnpm start`, siis `curl -X POST -H 'Content-Type: application/json' --data '{}' localhost:3000/api/event` → **202** (Plausible vastab) või **502** (ülesvoolu võrku ei pääse — proxy ise töötab).
- Interaktsioon → brauseri Network tab: `POST /api/event` vastusega **202**.
- Vastuse päis `x-plausible-dropped: 1` = sündmus jõudis Plausible'i, aga lükati tagasi
  (localhost/staging domeen pole kontosse lisatud).
- Automatiseeritud brauserid (navigator.webdriver) lükkab teek vaikselt tagasi — testi
  päris brauseriga või eemalda webdriver-lipp.

## Tähelepanek

`app/[legal]/page.tsx` privaatsuspoliitika punkt 9 väidab praegu „Veebiliikluse analüütika
puudub“ — pärast aktiveerimist tuleb see asendada Plausible'i avalikustusega (küpsiseta,
isikuandmeid ei koguta, ainult lehevaatamised ja sündmused).
