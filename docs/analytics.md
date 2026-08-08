# Analüütika (Plausible)

Leht kasutab [Plausible](https://plausible.io) — küpsiseta, isikuandmeteta veebianalüütikat
(privaatsussõbralik, GDPR-sõbralik, nõusolekubännerit ei vaja). Juhend põhineb
[plausible.io/docs](https://plausible.io/docs) (GitHubi peegel: github.com/plausible/docs).

## Aktiveerimine

1. Loo Plausible'is sait domeenile `matx.ee` (plausible.io → **Add new site**).
2. **Site Installation** jaotises lülita sisse soovitatud mõõtmised:
   - **Outbound links** (välislinkide klikid — vaikimisi sees)
   - **Form submissions** (vormi saatmised)
   - **Custom events** (kohandatud sündmused)
   - **Custom properties** (sündmuste omadused)
   - **404 error pages** (eeldab koodi — juba lisatud `app/not-found.tsx`)
3. Kopeeri oma saidi skripti URL (kujul `https://plausible.io/js/pa-XXXXX.js`) ja pane
   Netlify keskkonnamuutujana:
   `PLAUSIBLE_SCRIPT_URL=https://plausible.io/js/pa-XXXXX.js`
   Kuni muutuja puudub, on analüütika täielikult välja lülitatud (skripti ega rewrite-reegleid
   ei renderdata). Kohalikuks testimiseks pane sama muutuja ka `.env.local`-isse —
   dev-režiimis loendatakse localhost liiklust (`captureOnLocalhost`).

## Kuidas see töötab

- `next.config.js` rewrite: `/js/script.js` → Plausible'i isikupärastatud skript ja
  `/api/event` → Plausible'i API. Esimese osapoole ühendus matx.ee kaudu: ei sõltu
  adblockeritest (dokumentatsioon: muidu jääb 5–25% külastusi kahe silma vahele) ega
  nõrgenda CSP-d — `proxy.ts` `connect-src 'self'` jääb kehtima.
- `app/layout.tsx`: skript + `plausible.init()` (endpoint, outboundLinks, formSubmissions).
- `lib/analytics.ts`: tüübikindel `track()` + sündmuste nimede loend (EVENTS).

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

- `pnpm build && pnpm start`, siis `curl -s localhost:3000/js/script.js` → 200 (skript).
- Interaktsioon → brauseri Network tab: `POST /api/event` vastusega **202**.
- Vastuse päis `x-plausible-dropped: 1` = sündmus jõudis Plausible'i, aga lükati tagasi
  (localhost/staging domeen pole kontosse lisatud).

## Tähelepanek

`app/[legal]/page.tsx` privaatsuspoliitika punkt 9 väidab praegu „Veebiliikluse analüütika
puudub“ — pärast aktiveerimist tuleb see asendada Plausible'i avalikustusega (küpsiseta,
isikuandmeid ei koguta, ainult lehevaatamised ja sündmused).
