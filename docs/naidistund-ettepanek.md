# Näidistund matx.ee-l — ettepanek

Seis 03.09.2026. Alus: Slacki vestlus Tom ↔ Andri (03.09), neli näidisvestlust
(`docs/research/naidistund/matemaatika-abitund-kolm-versiooni.md`,
`docs/research/naidistund/matemaatika-abitund-versioon-4-sota.md`),
HTML-prototüüp (`docs/research/naidistund/matemaatika-abitund-vestlused.html`) ja MATx-i põhi
(`matxteacher`: `system-prompt.ts` v3, `PRODUCT.md`, `DESIGN.md`, `docs/plaan/*`).

## 0. Lähtekoht (mis Slackis kokku lepiti)

- matx.ee suunab praegu matxteacher.lovable.app-i. Pole midagi, mida live'i
  panna nii, et see testimist ja arendust ei segaks.
- Idee: kodulehele **ette kirjutatud ideaalne näidisvestlus**. Kasutaja andmeid
  ei koguta, Anthropicu API-t ei kutsuta. Mudel = neli näidisvestlust + MATx-i põhi.
- Õpilase vestlus ja õpetaja vaade eraldi. Vastused on ette antud, kasutaja
  valib paari variandi vahel. "Progressiivne story-kogemus".
- Andri: "peaksin nägema, milline see välja näeks" → **esimene tarne on
  klikitav prototüüp, mitte see dokument** (vt §6, samm 1).

Mida see lahendab: matx.ee muutub iseseisvaks maandumisleheks, millel on
midagi *päriselt proovitavat*, ilma et see sõltuks Lovable'ist, kasutajaandmetest
või pooleli olevast tootest. Suunamise saab maha võtta; app.matx.ee jääb tooteks.

## 1. Ehituskivid, mis on juba olemas

| Kivi | Kus | Mida annab |
| --- | --- | --- |
| Neli vestlust, sama õpilane (Sten, 7. kl, "ma ei tea"), sama tööleht | `docs/research/naidistund/matemaatika-abitund-*.md` | Kogu dialoogimaterjal. Teema **lineaarvõrrandid** klapib täpselt piloodi teemaga "Ühe tundmatuga võrrandid, 7.–9. klass" (`TOPIC_AREAS`). |
| HTML-prototüüp | `docs/research/naidistund/matemaatika-abitund-vestlused.html` | CVI tokenid (kriit, süvapetrool, terrakota, sammal), vestlusmullid, tabid, aria — **pool prototüüpi on valmis**. |
| MATx-i pedagoogiline põhi | `matxteacher/src/lib/matx-tutor/system-prompt.ts` (v3) | Reeglid, mida demo peab näitama: ELICIT→PROBE→DIAGNOSE→RESPOND; vihjeredel suund→vihje→näidis; "vihje ei ole vastus"; vea näitamine kohana (`\htmlClass{err}`); protsessi kiitus; ei numbreid õpilasele; max 2 AI pööret ilma õpilase panuseta; muutujatähti ei käänata. |
| Toote faktid | `matxteacher/PRODUCT.md`, `MATX_STAATUS_27_07.md` | Ülesande genereerib ja kontrollib **kood**, mitte mudel (ADR-3). Hääbumine on pausil (ADR-5) → demos ei näita. |
| Õpetaja vaade | `docs/plaan/opetaja_vaade.md` (V1 ehitatud), `brief-kolme-luli-ahel.md` (kinnitatud kuju, ehitamata) | Soojuskaart (diskreetsed olekud: korda veel / seljakotis / läbitud / proovimata), õpilase kaart sõnades, vea-klastrid + AI-ettepanek + "Võta vastu / Muuda / Eira". Õpetaja **ei näe vestluse sisu**. |
| Visuaal | `matxteacher/DESIGN.md` | "Eesti vihik": kriitpaber, 28 px joonestik, Jost + Newsreader italic (tuutori hääl), terrakota ainult vea *kohale*, ei numbreid, ei emojisid. |
| Maandumislehe leping | `lib/content/landing-copy.ts`, `landing-evidence.ts` | Staatuse sõnavara (Saadaval / Piloodis / Kavandatud), `PROHIBITED_PHRASES`, `createLazySection`, Plausible (küpsiseta), `InlineFractionalExpression` (murrud ilma KaTeXita). |

Üks lahknevus, mida teadlikult otsustada: maandumisleht kasutab teist
kujunduskeelt (Public Sans / Inter, sinine-roheline Tailwind) kui toode
(CVI). Ettepanek: **demo-aken on CVI-s** — see peab välja nägema nagu
app.matx.ee, mitte nagu maandumisleht — ja istub maandumislehe sees
"tooteaknana". Ülejäänud leht jääb praegu muutmata.

## 2. Kontseptsioon: „Sten, 20 minutit" — kaks vaatust

**Vaatus 1 — õpilase vestlus (~2 min).** Külastaja *on* Sten. 6–7
valikupunkti, igas 2–3 ette antud vastust. Kõik harud koonduvad (teemant,
mitte puu) — sisu jääb ~30 sõlme piiresse ja iga tee jõuab sama lõpuni.

**Vaatus 2 — õpetaja vaade (~30 s).** Sama tunni jälg õpetaja töölaual —
**tuletatud külastaja valikutest**. Kui ta avas sulud valesti, on Steni
lahter terrakota; kui õigesti, on Sten klastrist väljas, aga klassi probleem
on ikka olemas. See on "progressiivne story": teine vaatus ei ole staatiline
pilt, vaid esimese vaatuse tagajärg.

**Disainiprintsiip: iga valikupunkt demonstreerib täpselt ühte MATx-i
reeglit.** Mitte "AI on tark", vaid "vaata, mida see süsteem teeb, kui
õpilane ütleb X".

| Valikupunkt | Mida külastaja valib | Mida MATx näitab | Allikas |
| --- | --- | --- | --- |
| Eesmärk | "Ma ei tea" / oma sõnastus | Varuprotokoll: "ei tea" → konkreetne binaarne valik, mitte avatud küsimuse kordamine | prompt Samm 1, 3; reegel 6 |
| Diagnostika (3 küsimust) | kindel-õige / kõhklev / vale | Diagnoos enne õpetamist; kõhklus loetakse sõnastusest | Samm 5; Diagnose-rida; Aare/Maarja |
| Kaalumudel | "ka 5 ära" / "ei tea" | Explainer-müts, üks idee korraga; sammu tükeldamine | otsustustabel "takerdunud, puudub alus"; Liis |
| Ülesanne 1 (3x + 5 = 20) | õige / vale rida / "ütle vastus" | Kood kontrollib; **vea koht** terrakota joonega õpilase enda real; **vihje ei ole vastus** | §0 genereeritud ülesanne; 15b; vihjeredel |
| Kontroll | "panen tagasi" / "ei tea" | Õige vastus ilma põhjenduseta = mittemõistmine → probe | reegel 7 |
| Ülesanne 2 (2(x − 4) = 10) | avab õigesti / valesti | Valearusaam paljastatakse **kontrastiva näitega** (asenda x = 5), mitte parandusega | otsustustabel "selge valearusaam"; Maarja kohtunik |
| Ülesanne 3 (7 − 2x = 15) | "ei tea" / iseseisev käik / vale märk | Toestus taandub: tuutor küsib vähem; "ütle üks asi, mida sa tead" | Samm 6 Practice; Maarja redel |
| Reflektsioon | oma sõnastus / "vii teisele poole" | Otsetee tunnistatakse, printsiip käib enne | Samm 8; didaktika.md §1 |
| Lõpp | kordamise aeg | Perioodiline kordamine; kokkuvõte **sõnades, numbriteta** | Samm 9, 10; reegel 18 |

## 3. Stsenaarium (mustand)

Vorm: tuutori repliigid lühikesed (1–2 lauset, prompt reegel 15), lõpu poole
peamiselt küsimused (Maarja printsiip). Tuutor ei kääna muutujatähti
("muutuja x", mitte "x-i" — reegel 19a); Sten kõneleb loomulikult. Iga
ülesanne tuleb "süsteemilt" eraldi kaardina (Ülesanne · Võrrandid), mitte
tuutori jutust — see on koht, kus MATx erineb kõigist neljast inimesest.

Olekulipud, mida harud seavad ja mida vaatus 2 loeb:
`goal` (paanika | tööleht), `eq` (käsklus | ok), `neg` (ei-saa | ok),
`sulud` (vale | ok), `hintAsked` (jah | ei), `metaphor` (kaal | termomeeter).

**Avakaart.** „Näidistund · ette kirjutatud, mitte päris AI. Sten on väljamõeldud
7. klassi õpilane, kellel on tööleht võrranditest ja harjumus öelda „ma ei tea".
Sina valid, mida ta vastab." → [Alusta]

**S0 — avamine.**
MATx: *Tere, Sten. Sul on täna 20 minutit. Mille peale sa tahad, et me need kulutame?*
- „Ma ei tea. Ema tahab, et hinded paremaks läheks." → *See on ema soov, mina
  küsisin sinu oma. Kui pead valima: kas tahad, et tööleht saaks tehtud, või et
  tunnis ei tuleks paanikat, kui õpetaja küsib?* → „Et ei tuleks paanikat." /
  „Tööleht." (`goal`)
- „Et ma ei tunneks ennast tunnis lollina, kui õps küsib." (`goal=paanika`)
- „Võrrandid. Ma ei saa üldse pihta." (`goal=tööleht`)

**S1 — diagnostika (Samm 5, kolm küsimust).**
MATx: *Kirjutan selle üles, see on meie mõõdupuu — mitte hinne. Enne töölehte
kolm kiiret küsimust, hindeid pole.*
1. *Kas niimoodi tohib kirjutada: 8 = 5 + 3?*
   „Ei, vastus peaks lõpus olema." / „Vist ei tohi?" / „Tohib, mõlemal pool on
   kaheksa." (`eq`)
2. *Mis on 3 − 7?*
   „Seda ei saa, väiksemast ei saa suuremat lahutada." / „−4" / „4" (`neg`)
3. *Ava sulud: 2(x − 4).*
   „2x − 4" / „2x − 8" / „Ma ei tea" (`sulud`)

Tuutor küsimuste vahel ei paranda — ainult *Aitäh, järgmine.* (diagnoos
enne õpetamist).

**S2 — leid (Diagnostician → väida, ära küsi).** Tekst sõltub lippudest.
Näide `eq=käsklus`, `sulud=vale`:
*Sinu mõtlemisel ei ole midagi viga. Vundamendis on kaks auku — ja auk on
koht, mitte omadus. Kohta saab täita. Esimene: sa arvad, et võrdusmärk on
käsklus „arvuta". Tegelikult on ta väide: vasakul ja paremal on ühepalju.*
Kui kõik kolm õiged: *Kõik kolm paigas — ja kindlalt. Siis kohe töölehe juurde.*
(Lühike haru; näitab, et süsteem ei venita, kui alus on olemas.)

**S3 — kaal (ainult kui `eq=käsklus`).**
MATx: *Unustame korraks võrrandi. Kaal: vasakus kausis kolm ühesugust pakki
ja 5-grammine raskus, paremas 20 grammi. Tasakaalus. Võtan vasakult viie ära —
mida pead paremal tegema?*
- „Ka viis ära võtma." → *Miks just viis?* → „Sest sa võtsid vasakult viis." →
  *See lause ongi võrrandite kõige tähtsam reegel: mida teed ühel pool, teed ka
  teisel.*
- „Ma ei tea." → *Väiksem samm. Kui vasak kauss läheb kergemaks, kummale poole
  kaal kaldub?* → „Paremale." → *Ja et tasakaal tagasi tuleks?* → „Võtan
  paremalt ka ära." → koondub.

**S4 — ülesanne 1.** Kaart: **Ülesanne · Võrrandid · 3x + 5 = 20**
MATx: *Sama lugu matemaatika keeles. Pakk on muutuja x. Mis on su esimene käik?*
- „Võtan mõlemalt poolt 5 ära: 3x = 15. Jagan kolmega: x = 5." → kood: klapib.
  → *Ja kuidas sa ise teada saad, et see õige on — ilma minult küsimata?*
  (reegel 7) → „Panen viie tagasi: 3 · 5 + 5 = 20." / „Ei tea." → *Pane vastus
  algsesse võrrandisse tagasi ja vaata, kas klapib.*
- „3x = 25, x = 8,33" → **lahenduskaart**: `3x = [25]` — 25 terrakota joonega,
  allkiri Newsreader italic'us: *Vaata veel kord, mis juhtus viiega — vasakult
  võtsid ära, paremale liitsid juurde.* (suund) → „Ah, paremalt pean ka ära
  võtma: 3x = 15." / „Ma ei saa aru." → *Kaal: kui ühest kausist võtad ära,
  võtad teisest sama palju. 20 miinus 5?* (vihje)
- „3x = 15. Edasi ei tea." → *Kolm ühesugust pakki kaaluvad kokku 15. Kuidas
  ühe paki kaalu teada saad?* → „Jagan kolmega, x = 5." / „Lahutan kolm, x = 12."
  → *Kolm pakki on kolm korda pakk. Mis tehe teeb korrutamise tagasi?*
- „Ütle lihtsalt vastus." (`hintAsked=jah`) → *Vastust ma ette ei ütle — aga
  annan vihje, millega ise kohale jõuad: pakid tahad üksi jätta. Mis segab neid
  vasakul kausil?* → „See viis." → koondub.

Koondumine: x = 5, kontroll tagasi pannes. MATx: *Sa kontrollisid ise ära. Ma
ei öelnud ühtegi sammu ette — need olid sinu käigud.* (protsessi kiitus, reegel 4)

Vaikne rida vestluse all (lüliti „Näita, mida süsteem salvestab"):
„Salvestati: mõlemale poole sama tehe — õige · jagamine mõlemal pool — õige".
Sõnades, numbriteta, sõlme ID-deta (reegel 18). See on usalduse sammas
„Läbipaistev andmevoog" tegevuses.

**S5 — ülesanne 2.** Kaart: **2(x − 4) = 10**
Kui `sulud=vale`: *See on sama kuju, mille sa alguses avasid. Enne lahendamist
kontrolli: pane x asemele 5 ja vaata, kas 2(x − 4) ja sinu avatud kuju annavad
sama.* (kontrastiv näide, mitte parandus)
- „5 − 4 = 1, 2 · 1 = 2. Aga 2 · 5 − 4 = 6. Ei anna sama. Siis pean nelja ka
  kahega korrutama: 2x − 8." → *Sa ei vaielnud arvamusega — sa katsetasid.
  Lahenda lõpuni.* → „2x = 18, x = 9. Kontroll: 2 · (9 − 4) = 10. Klapib."
- „2x − 4 = 10, 2x = 14, x = 7." → lahenduskaart: `2x − [4] = 10`, allkiri:
  *Vaata veel kord, mis juhtus neljaga sulu avamisel — kahega korrutasid
  muutuja x, aga nelja mitte.* → koondub.
Kui `sulud=ok`: lahendab otse; probe *Miks korrutasid nelja ka kahega?*

**S6 — ülesanne 3.** Kaart: **7 − 2x = 15**
Kui `neg=ei-saa`, enne: *Väljas on kolm kraadi sooja, öösel läheb seitse kraadi
külmemaks. Mitu kraadi hommikul?* → „Miinus neli." → *Sa arvutasid just 3 − 7.
Sama tehe, millele sa enne ütlesid „ei saa". Numbrid ei muutunud, pilt muutus.
Kumb pilt on sinu oma — termomeeter või jalgpalli väravate vahe?* (`metaphor`,
tuutor kasutab edaspidi õpilase valitut)
MATx: *Viimane täna. Nüüd räägi ise endaga — mina kuulan.*
- „Ma ei tea." → *Ütle üks asi, mida sa selle ülesande kohta tead.* → „Et pean
  mõlemal pool sama tegema." → *Ja keda tahad üksi jätta?* → „2x. Aga tal on
  miinus ees." → *Proovi julgelt. Kui untsu läheb, näeme, kus.* → „−2x = 8,
  x = −4. Kontroll: 7 + 8 = 15. Klapib."
- „Keda tahan üksi jätta… 2x. Võtan 7 ära: −2x = 8. Jagan −2-ga: x = −4." →
  *Kas arvad või tead?* → „Tean: 7 − 2 · (−4) = 7 + 8 = 15."
- „x = 4" → kood: ei klapi. *Pane 4 tagasi: 7 − 2 · 4. Kas klapib?* → „−1. Ei
  klapi." → *Kus märk kadus?* → koondub.

**S7 — reflektsioon ja lõpp (Samm 8, 9, 10).**
MATx: *Enne kui lõpetame: seleta oma sõnadega, mis on võrrandi lahendamise kõige
tähtsam reegel.*
- „Mis ma ühel pool teen, teen teisel pool ka. Ja lõpus panen vastuse tagasi."
- „Vii teisele poole ja muuda märki." → *See on otsetee, mis peidab kaalu ära.
  Mida „vii teisele poole" päriselt tähendab?* → „Võta mõlemast kausist sama palju."
Kokkuvõte (sõnades): *Täna: mõlemale poole sama tehe — kindel. Kontroll tagasi
pannes — sinu enda harjumus. [Sulgude avamine — korda veel.] Järgmine kord
alustame sellest, mida sina mäletad. Millal sul homme kuus minutit on?* →
„Pärast trenni, seitsme ajal." → *Kirjutasin üles.*
Kui `goal=paanika`: *Alguses ütlesid, et tahad, et ei tuleks paanikat, kui
õpetaja küsib. Ma just küsisin. Kus paanika oli?* → „…Ei olnudki."

→ [Vaata, mida õpetaja sellest tunnist näeb]

**Vaatus 2 — õpetaja vaade** (kõik tuletatud lippudest; klassi ülejäänud 21
rida on fikseeritud näidisandmed sildiga „Näidisandmed"):
1. **Klassi pilt.** 7.b · 22 õpilast · 5 oskust. Diskreetsed lahtrid (korda
   veel = terrakota, seljakotis = merevaik, läbitud = sammal, proovimata = ruut).
   Steni rida esile tõstetud: võrduse omadused (`eq` järgi), kontroll asendamisega
   (läbitud), sulgude avamine (`sulud` järgi), negatiivsed arvud (`neg` järgi),
   murrud (proovimata — ausalt, sest tunnis ei tulnud).
2. **Õpilase kaart: Sten.** Sõnades: „Tugevused: mõlemale poole sama tehe.
   Takistused: sulgude avamine — sellest sõltub 6 edasist oskust (abivalemid,
   tegurdamine, …). Vihjeid: küsis ise ühe." Diskreetne rida: „Vestluse sisu
   õpetaja ei näe — ainult oskuste seis. Kuidas neid andmeid kogutakse?"
3. **Diagnostika-laud** (sildiga „Kavandatud" — vt §7 otsus 4): „Sulgude
   avamine · 6 õpilast on siin kinni" → klaster „Korrutab ainult esimest liiget"
   + õpilaste tähed (ST ainult kui `sulud=vale`) → [Koosta ettepanek] → Newsreader
   italic: *Anna neile kuuele neli ülesannet kujul a(x − b) = c ja lase igaühel
   enne lahendamist kontrollida sulgude avamist asendamisega.* → [Võta vastu]
   [Muuda] [Eira] → „Määratud · 6 õpilast · homseks". Serverit ei ole; nupp
   muudab ainult olekut.

## 4. Ausus ja piirid

- Silt demo kohal ja all: „Näidistund — ette kirjutatud. Sten on väljamõeldud.
  Päris MATx-is genereerib ülesanded kood ja vestlust juhib AI, mida piiravad
  samad reeglid." Sõna „AI vestlus" demo kohta ei kasuta.
- Õpilase vaatuses ainult võtted, mis on v3 promptis või ehitatud tootes
  (Saadaval / Piloodis). **Ei näita:** hääbumist (ADR-5 pausil), kindlusnumbreid,
  kohtuniku-mängu tahtliku veaga, worry-dump'i, kirja aineõpetajale — need on
  SoTA-vestluse võtted, mida toode ei tee. Kui Andri tahab neid sisse, siis
  sildiga „Kavandatud" (otsus §7.1).
- Õpilasele ei näidata numbreid, protsente, hindeid, ✗-märke ega „Vale!".
  Kiitus on protsessi, mitte võimekuse kohta. Emojisid ei ole.
- Andmed: puhas kliendipoolne olek. Ei võrgupäringuid, ei localStorage'it, ei
  küpsiseid. Valikuline: kolm Plausible'i sündmust (`demo_start`, `demo_end`,
  `demo_teacher_view`) — koondarvud, ilma haru sisuta.
- `PROHIBITED_PHRASES` kontroll laieneb skriptifailile (sama kontroll, mis
  `llms.txt` marsruudil on juba olemas).
- Ülejäänud lehe näide (12 % × 50, protsendid) jääb v1-s muutmata — kaks
  piloodi teemat samal lehel ei ole vastuolu.

## 5. Kuidas see lehele istub

- **Asukoht:** uus täislaiuses sektsioon `#näidistund` kohe kangelasosa
  järel. Hero teine nupp „Vaata töövoogu" → „Proovi näidistundi" (ankur).
  Navis „Näidistund". Õpetaja vaatus on sama komponendi teine samm, mitte
  eraldi sektsioon. Praegune `TeacherSection` soojuskaart jääb esialgu alles.
- **Visuaal:** „tooteaken" CVI-s — kriitpaber, 28 px joonestik, süvapetrool,
  terrakota ainult vea kohal. CSS võetakse HTML-prototüübist, skoobitud `.demo`
  alla. Fondid: **Newsreader italic** tuutori häälele (üks fail, `next/font`,
  latin-ext); Jost jätame v1-s ära, kasutame Interit.
- **Matemaatika:** KaTeXi pole vaja — lineaarvõrrandid on tavatekst,
  `x/3` katab olemasolev `InlineFractionalExpression`, terrakota joon on
  `<span>`. KaTeX lisandub alles siis, kui demo laieneb murdvõrranditeni.
- **Liikumine:** pööre-pöördelt ilmumine, kirjutamise indikaator ≤ 600 ms,
  `usePrefersReducedMotion` austatakse. GSAP-i pole vaja, CSS piisab.
- **Ligipääsetavus:** vestluslogi `role="log" aria-live="polite"`; valikud on
  päris nupud; fookus liigub uutele valikutele; „Samm tagasi" ja „Alusta
  uuesti"; iga tähendust kandev värv dubleeritakse sõnaga (terrakota joon +
  allkiri).
- **Kood:** `lib/content/demo-script.ts` (tüübitud sõlmegraaf, sama muster
  kui `landing-copy.ts`) + `components/sections/demo/` (reducer olek, vestluslogi,
  valikud, ülesande- ja lahenduskaart, õpetaja paneel). Sõlm:
  `{ id, tutor, card?, log?, choices?: { label, next, set? }[], next? }`.
  Laetakse `createLazySection`-iga — algsele laadimisele lisakulu null.
- **Üks kontroll:** selftest, mis käib kõik harud läbi: iga `next` viitab
  olemasolevale sõlmele, iga tee jõuab lõppu, ühtki keelatud fraasi pole,
  tuutori tekstis ei ole ühtki käänatud muutujatähte (`/\bx-[a-zõäöü]+/`).

## 6. Tarnesammud (~6 tööpäeva)

| # | Samm | Maht | Tulemus |
| --- | --- | --- | --- |
| 0 | Otsused §7 | 0,5 p | Roheline tuli ulatusele |
| 1 | **Klikitav prototüüp Andrile:** viies tab „MATx" olemasolevas `matemaatika-abitund-vestlused.html` failis, vanilla JS, sama CSS, skript JS-objektina | 1 p | Andri näeb ja klikib; skripti muudame odavalt HTML-is |
| 2 | Skripti lõplik tekst + keelekontroll (estonian-mcp: käänamine, kantseliit, komad) | 1 p | `demo-script.ts` sisu |
| 3 | Next.js: skriptifail, demo-sektsioon, ankur, nav, hero-nupp | 2 p | Vaatus 1 live-valmis |
| 4 | Õpetaja vaatus: rea tuletamine lippudest, õpilase kaart, diagnostika-laud | 1 p | Vaatus 2 |
| 5 | A11y, reduced motion, `pnpm lint` / `typecheck` / `build`, selftest, Playwright: kõik harud läbi | 0,5 p | Merge |
| 6 | matx.ee iseseisvaks: suunamine lovable'i maha, „Logi sisse" → app.matx.ee | 0,5 p | Live |

## 7. Otsused (Andri)

**Seis 03.09.2026: Andri ei ole veel vastanud.** Allpool on iga küsimuse
juures *eeldus*, millega ehitus algab, ja kindlus (kõrge / keskmine).
Eeldus kehtib, kuni Andri ütleb teisiti; muutmise hind on iga punkti juures.

1. **Ulatus.** Ainult v3 promptis / ehitatud tootes olevad võtted (soovitus)
   — või ka SoTA-lisad (kindlusnumbrid, kohtunik, 6-minuti tabel) sildiga
   „Kavandatud"?
   → **Eeldus: ainult v3.** Kindlus keskmine. Andri enda staatuse sõnavara
   (Saadaval / Piloodis / Kavandatud) ja ADR-5 (hääbumine pausil) ütlevad, et
   ta ei taha lehele lubadusi, mida toode ei pea. Slacki „ideaalne vestlus"
   loen kui „ideaalne v3 järgi", mitte „kõik, mida õpiteadus teab". Kui
   vastus on „ka SoTA": +0,5 p, sõlmele lisandub `status: 'Kavandatud'` väli,
   skript kasvab ~8 sõlme võrra; kontseptsioon ei muutu.
2. **Teema.** Võrrandid (soovitus: neli vestlust on valmis, teema on piloodis)
   või protsendid (praegune lehe näide)?
   → **Eeldus: võrrandid.** Kindlus kõrge. Neli valmis vestlust on kõik
   võrranditest, piloodi `TOPIC_AREAS` sisaldab „Ühe tundmatuga võrrandid",
   protsentide jaoks poleks ühtki dialoogimaterjali. Kui vastus on
   „protsendid": stsenaarium §3 tuleb nullist kirjutada (+2 p).
3. **Asukoht.** Sektsioon esilehel (soovitus) või eraldi `/demo`? Kui
   komponent on olemas, on `/demo` hiljem kümme rida — võib teha mõlemad.
   → **Eeldus: mõlemad.** Kindlus keskmine-kõrge. Esilehe sektsioon on see,
   mis suunamise asendab; `/demo` on jagatav link koolidele ja Slacki — Andri
   küsis „peaksin nägema", st ta tahab midagi, mida saata. Hind ~10 rida +
   sitemap ja llms.txt rida; teeme kolmandas sammus kaasa.
4. **Diagnostika-laud õpetaja vaatuses.** Näidata sildiga „Kavandatud"
   (soovitus — lehe tõendusloogi 4. etapp lubab seda juba) või jätta v1-st välja?
   → **Eeldus: näidata, sildiga „Kavandatud".** Kindlus kõrge. Kuju on
   `brief-kolme-luli-ahel.md`-s kinnitatud ja leht lubab seda juba
   tõendusloogis; ilma selleta on õpetaja vaatus ainult tabel. Kui vastus on
   „välja": kustutame ühe komponendi (−0,3 p).
5. **Newsreader italic** laadimine tuutori häälele (soovitus jah, ~20 KB).
   → **Eeldus: jah.** Kindlus kõrge. `DESIGN.md` kahehända reegel (tuutor
   serif italic, õpilane sans) on Andri enda; ilma selleta ei näe demo välja
   nagu toode. Font laetakse ainult demo-tükiga, avalehe algne laadimine ei
   muutu. Kui „ei": üks rida CSS-i, Inter italic.
6. **Plausible'i sündmused** demole (soovitus jah, kolm sündmust, sisuta).
   → **Eeldus: jah, kolm sündmust.** Kindlus kõrge. Küpsiseta Plausible on
   juba lehel (`docs/analytics.md`, `lib/analytics.ts`); sündmused ütlevad,
   kui paljud demo lõpuni ja õpetaja vaatuseni jõuavad — ainus viis teada, kas
   see asi töötab. Haru sisu ei saadeta. Kui „ei": kolm `track()`-kutset maha.
7. **Prototüüp enne Next.js-i** (soovitus jah — see on see, mida sa Slackis
   küsisid) või otse koodi?
   → **Eeldus: jah, prototüüp enne.** Kindlus väga kõrge. Andri sõnad
   Slackis olid „peaksin nägema, milline see välja näeks". HTML-i tab on üks
   päev ja stsenaariumi muudatused on seal kümme korda odavamad kui Reactis.

Kaks eeldust, mille vale pakkumine maksab päris aega: **1 (ulatus)** ja
**2 (teema)**. Need kaks küsime Andrilt eraldi ühe lausega enne 2. sammu
(skripti lõplik tekst); ülejäänud viis võivad muutuda ka hiljem ilma
ümbertegemiseta.
