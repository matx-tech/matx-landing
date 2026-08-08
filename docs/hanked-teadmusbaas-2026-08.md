# Eesti riigihanked — teadmusbaas MATx-i hankeinfo jaoks

Koostatud: 07.08.2026
Eesmärk: varustada MATx-i avalehe „Hankeinfo“ kaart ja /tehniline lehe „Hanked“ osa
tõenduspõhise andmestikuga: ostuteed ja piirmäärad, hinnaklassid (mediaan/keskmine),
tehnilised nõuded ja lepingupraktika. Kõik väited allikapõhised; arvutusmetoodika kirjas.

---

## 1. Ostuteed ja piirmäärad (asjad ja teenused, ilma käibemaksuta)

### Kehtiv õigus kuni 31.10.2026 — RHS § 14–15 (RT I, 01.07.2017, 1; konsolideeritud seis)

| Maksumus | Menetlus | Pakkumuste tähtaeg (min) |
|---|---|---|
| < 30 000 € | RHS ei kohaldu — ost hankekorra järgi | — |
| 30 000–59 999 € | Lihthange | 10 päeva |
| 60 000–139 999 € (riik) / 215 999 € (KOV) | Avatud hankemenetlus | 15 päeva |
| ≥ 140 000 € (riik) / 216 000 € (KOV) | Rahvusvaheline (EL) menetlus | 30 päeva |

Allikad:
- Riigihangete seadus § 14 lg 1 p 1 (lihthanke piirmäär 30 000 €), § 14 lg 2 p 1
  (riigihanke piirmäär 60 000 €), § 15 lg 1–2 — https://riigiteataja.ee/akt/112072025026.
- Tähtajad: RTK KKK tabel (Lihthange 10 päeva A/T; Avatud menetlus 15 päeva A/T;
  Rahvusvaheline 30 päeva A/T; ooteaeg 5/14 tööpäeva; vaidlustustähtajad 3/10 tööpäeva) —
  https://rtk.ee/korduma-kippuvad-kusimused-riigihangete-teemal.

### Alates 01.11.2026 — Riigihangete seaduse ja teiste seaduste muutmise seadus (RT I, 03.07.2026, 3)

- Asjade ja teenuste lihthanke piirmäär tõuseb 30 000 € → **50 000 €** (§ 14 lg 1 p 1).
- Ehitustööde jt lihthanke piirmäär 60 000 € → 100 000 €; kaitse/julgeoleku ehitustööd
  300 000 € → 500 000 €; uued: eriteenused/ideekonkurss 100 000 €, sotsiaalteenused 500 000 €.
- **Riigihanke piirmäär (§ 14 lg 2) kaob** — siseriiklik süsteem on kahetasandiline:
  lihthange ↔ rahvusvaheline hange. Lihthange hõlmab seega 50 000 € kuni EL piirmäärani
  (riik 140 000 €, KOV 216 000 €). ERR: „koolid ja lasteaiad ca 200 000 euro suuruseid
  hankeid … lihthanke korras“.
- Lihthanke pakkumuste tähtaeg: 10 → 15 päeva (asjad/teenused), ehitustööd 25 päeva.
- Pakkumus siduv vaikimisi 3 kuud; ooteaeg 5 → 7 tööpäeva.
- **Uus § 77 lg 6²**: hankija võib määrata intellektuaalomandi õiguste korra alusdokumentides.
- Erandina: enne 01.11.2026 alustatud menetlused viiakse lõpuni vana korra järgi (§ 219³).

Allikad:
- https://riigiteataja.ee/et/akt/103072026003 (muutmisseadus, jõust. 01.11.2026).
- https://koda.ee „Mida arvad riigihangete seaduse lihtsustamise eelnõust?“ (24.09.2025).
- https://valitsus.ee/uudised/riik-lihtsustab-riigihangete-reegleid; https://err.ee/1609904110.

### EL piirmäärad 2026–2027 (kehtivad alates 01.01.2026)

- Keskvalitsus (riigiasutused): asjad/teenused **140 000 €**; KOV (sub-central): **216 000 €**;
  ehitustööd 5 404 000 €; sotsiaal- ja eriteenused 750 000 €.
- Allikas: komisjoni delegeeritud määrus (EL) 2025/2152 (22.10.2025); kokkuvõte nt
  https://nohrcon.com „New threshold values 2026–2027“.

## 2. Hinnaklassid — registri lepinguteadete arvutatud mediaanid/keskmised

Arvutatud riigihangete registri avaandmetest (lepinguteated, eForms
ContractAwardNotice), periood 2026. a veebruar–juuli (kuud 2–7), seisuga 07.08.2026.
Kirjeldus: iga teate <cbc:TotalAmount currencyID="EUR"> (teatepõhine summa, osadeks
jagatud teadete puhul osade summa). Kaasa arvatud ainult maksumusega teated.

| Kategooria | n | Mediaan | Keskmine | P25 | P75 |
|---|---|---|---|---|---|
| Kõik lepingud | 3 975 | 66 688 € | 400 649 € | 25 075 € | 198 483 € |
| Tarkvara (CPV 48*) | 134 | 67 727 € | 245 838 € | 36 981 € | 150 000 € |
| IT-teenused (CPV 72*) | 181 | 120 869 € | 348 671 € | 55 000 € | 250 000 € |
| Haridus- ja koolitusteenused (CPV 80*) | 105 | 46 296 € | 97 970 € | 12 000 € | 110 240 € |
| Tarkvarapaketid (CPV 48900000) | 70 | 59 452 € | 278 564 € | 29 919 € | 154 815 € |

Tõlgendus hankija jaoks:
- Kogu registri mediaan ~67 000 €; keskmist (~400 000 €) moonutavad suured ehitus- ja
  energiaprojektid (max 49,9 mln €). Mediaan on esinduslikum.
- Haridussektori (CPV 80*) mediaan ~46 000 € — hinnapõhine otsus on Eestis norm
  (2025: 87% hankest madalaima hinna alusel, 74% mahust — RaM 2025 statistika).
- **Registriandmed ei võimalda hinnata, kui suur osa ühe kooli tarkvaraostudest jääb
  alla 30 000 €** — RHS ei kohaldu nendele ostudele ja need ei kajastu registris
  (registris on 29% teadetest < 30 000 €, mis on vabatahtlikud väikehanked). Seega
  „koolitarkvara hanke mediaan“ kui selline ei ole registrist arvutatav — see on
  oluline ausust mõjutav piirang.

Metoodika (taasesitatav): alla laetud registri avaandmete API-st iga kuu partii
(2026-02 … 2026-07), lepinguteated (eForms ContractAwardNotice). Summa: iga teate
<cbc:TotalAmount> (osadeks jagatud teadetel osade summa); kaasa arvatud ainult
maksumusega teated. Mediaan/keskmine/P25/P75 arvutatud neist. Päringud tehtud
07.08.2026:
- https://riigihanked.riik.ee/rhr/api/public/v1/opendata/notice_award/2026/month/2/xml
- sama kuju kuudele 3–7.

### Õpikeskkondade hinnaankur (avalikud hinnakirjad)

- **Opiq koolipakett 2026/27** (kõik õppeained, 444 õppekomplekti): 5,10 €/õpilane/kuu;
  soodushind 4,10 €/kuu (≥50% kooli õpilastest, ≥9 kuud); algklassid 3,10 €/kuu.
  Aastas ≈ 31–51 €/õpilane (10 arvelduskuu põhjal). Allikas: https://opiq.ee/Packages/Details?packageKey=StudentPackage2025ForSchool.
- eKool: avalikku koolihinnakirja ei avaldata (vanema premium-tasud kuni ~3,45 €/kuu
  funktsiooni kohta — https://lounapostimees.postimees.ee/4016835).
- Stuudium: tasuta põhifunktsioonid, premium-tasuline; avalikku hinnakirja ei avaldata.
- Järeldus: õpilasepõhine kuu-/aastatasu on Eesti õpikeskkondade standardmudel.

### Reaalsed haridusvaldkonna hangete väärtused (registrist, TenderGlass koond)

- Eksamite Infosüsteemi (EIS) tehniline audit — 50 000 € (HTM, 01/2026).
- „Aasta õpetaja gala“ korraldamine 2026 — 120 000 € (HTM, 02/2026).
- Atlassian toodete konsultatsioon ja arendus — 350 000 € (HTM, 02/2026).
- Täienduskoolituste infosüsteemi „Juhan“ hooldus- ja arendustööd — 48 kuud (HTM, 03/2026).
- Eesti keele iseseisva õppe e-teenuste raamleping — 1 500 000 € (HTM, 01/2025, lõpetatud).
- Kirjastamis- ja trükiteenuse raamleping (Haridus- ja Noorteamet) — 300 000 € (08/2026).
- Digitahvlid ja ribakõlarid (Kiviõli Riigikool) — 350 000 € (05/2025).

Konkreetsete teadete ID-d on kontrollitavad riigihangete registri otsingust (hankija:
Haridus- ja Teadusministeerium / Haridus- ja Noorteamet / Kiviõli Riigikool).

## 3. Tehnilised nõuded — mida hankijad haridustarkvarale tavapäraselt esitavad

1. **Juurdepääsetavus**: EN 301 549 V3.2.1 / WCAG 2.1 AA. Avaliku sektori veebidele
   kohustuslik alates 23.09.2019, mobiilirakendustele alates 23.06.2021 (direktiiv
   2016/2102, üle võetud avaliku teabe seadusesse). Kohustus laieneb ka eraõiguslikele
   isikutele, kes täidavad lepingu alusel avalikke ülesandeid (sh osutavad avalikke
   teenuseid). Järelevalve: TTJA.
   Allikad: https://ttja.ee/avaliku-sektori-digiligipaasetavus; W3C WAI riigileht.
2. **Andmekaitse**: GDPR (2016/679) — rollid sõltuvad konkreetsest andmetöötlustoimingust:
   kool/omavalitsus on vastutav töötleja; tarnija on volitatud töötleja vaid siis, kui ta
   töötleb andmeid dokumenteeritud juhiste alusel (andmetöötlusleping), muidu võib ta olla
   sõltumatu või kaasvastutav töötleja. Art 8 alaealiste erikaitse (Eestis 13+) kehtib
   vaid nõusolekupõhise infoühiskonna teenuse puhul, mida pakutakse otse lapsele; IKS.
   Andmete majutuskoht Eesti/EL on hankija eelistus, mille saab seada hanketingimustes;
   edastus kolmandatesse riikidesse peab vastama GDPR V peatükile.
3. **Identiteet ja koostalitlus**: HarID/TAAT OIDC (koolide identiteediföderatsioon),
   EHIS, eKool/Stuudiumi liidestused — MATx-i staatused /tehniline lehel.
4. **AI-komponent**: EU AI Act (2024/1689) III lisa § 3 — kõrge riski klass hõlmab
   kindlaksmääratud hariduslikke kasutusjuhte (ligipääs/õppele vastuvõtt, õpitulemuste
   hindamine õpiteed mõjutavalt, õppetaseme hindamine, õpilase käitumise jälgimine testide
   ajal), mitte igasugust haridus-AI-d. Art 6(3) erand võib liigitada III lisa süsteemi
   mittekõrge riskiga klassiks, kui see ei mõjuta oluliselt otsuseid ega profileeri isikuid;
   riskijuhtimine, läbipaistvus, inimese järelevalve. MATx-i BKT enesehindamine on pooleli —
   tulemus dokumenteeritakse enne piloodi laiendamist.
5. **Turve**: E-ITS/ISKE baastase (ühilduv ISO 27001), NIS2 hea tava, CSP/HSTS, pseudonüümimine.
6. **Hankedokumentide formaat**: tehniline kirjeldus RHS § 87–88 järgi; kvalifitseerimine
   majandusliku ja kutsealase suutlikkuse põhjal (käibekapital, sarnased litsentsiprojektid).

## 4. Lepingupraktika (üldtingimused Eesti avalikus sektoris)

- **Kestus**: tavapärase hankelepingu kestus on lepinguvabadus (RaM KKK) —
  tarkvaralitsentside lepingud tavaliselt 12–36 kuud; raamlepingud üldjuhul kuni 4 aastat
  (RHS § 29 lg 2; direktiiv 2014/24/EL art 33), pikem tähtaeg vajab põhjendust (näide:
  „Juhan“ hooldus-arendus 48 kuud).
- **Maksetähtaeg**: tavaliselt kuni 30 kalendripäeva (direktiiv 2011/7/EL hilinenud maksete
  vastu); kuni 60 kalendripäeva vaid erandina, kui see on lepingus sõnaselgelt kokku lepitud
  ja objektiivselt põhjendatud.
- **Garantii ja leppetrahv**: leppetrahv, hinna alandamine ja kahju hüvitamine tulenevad
  võlaõigusseadusest (VÕS) ja lepingutingimustest; hankelepingu ülesütlemine ja taganemine
  RHS § 124 alusel. Määrad on lepinguvabadus, seatakse alusdokumentides; RaM juhend rõhutab
  mõistlikke määrasid. (Õiguslik kontroll enne avalikustamist.)
- **IP**: alates 01.11.2026 hankija võib IP-korra määrata alusdokumentides (uus § 77 lg 6²);
  eelnõu eesmärk: jätta loodud IP vaikimisi ettevõtjale, hankijale ainult vältimatult vajalik.
- **Andmete väljaviimine**: lepingu lõppedes eksport/kustutamine; DSR-reeglid.
- **Hindamiskriteeriumid**: 87% hangetest madalaim hind (2025); kvaliteedikriteeriumite
  osakaal 13,4% arvult / 26% mahult (2025) — hinnapõhine otsus domineerib.

## 5. Soovitused MATx-i hankepaketile

1. **Hind**: õpilasepõhine aastatasu (Eesti standard); avalda hinnakiri — hind on otsustav
   kriteerium 87% hangetes. Väikekoolidele/algklassidele diferentseeritud tase nagu Opiq-il.
2. **Ostutee**: näitena — alla piirmäära (< 30 000 €; alates 01.11.2026 < 50 000 €) võib ost
   olla otsetellimus, kuid see peab järgima organisatsiooni sisemist hankekorda ja
   riigihangete üldpõhimõtteid (RHS § 3); hankeväärtuse hinnangusse tuleb arvata ka
   ettenähtavad lisanõuded ja pikendused. Omavalitsustele soovita lihthanget — mitte
   „avatud hankemenetlust“.
3. **Leping**: 12–36 kuud, maksetähtaeg 30 päeva, mõistlik leppetrahv, IP jääb MATx-ile,
   andmete eksport lepingu lõppedes.
4. **Tehniline dokumentatsioon**: valmista juurdepääsetavuse seisukoht (EN 301 549) —
   hankijad küsivad seda haridustarkvaralt üha enam ja see on MATx-i puhul sihtseis.
5. **AI**: BKT riskianalüüs (EU AI Act III lisa § 3) — juba /tehniline lehel kajastatud.

## 6. Allikad (täisloend)

1. Riigihangete seadus (konsolideeritud) — https://riigiteataja.ee/akt/112072025026
2. Riigihangete seaduse ja teiste seaduste muutmise seadus — https://riigiteataja.ee/et/akt/103072026003
3. Eelnõu seletuskiri (79 lk) — https://cms.advokatuur.ee/app/uploads/2025/09/RHS-SK.pdf
4. Kaubanduskoja ülevaade eelnõust — https://koda.ee (24.09.2025)
5. Valitsuse teade — https://valitsus.ee/uudised/riik-lihtsustab-riigihangete-reegleid; https://err.ee/1609904110
6. RTK KKK (menetluste tähtajad) — https://rtk.ee/korduma-kippuvad-kusimused-riigihangete-teemal
7. Rahandusministeerium: Riigihangete valdkonna statistika ja kokkuvõte 2025 (08.05.2026) —
   https://fin.ee; sama 2024 (05.06.2025)
8. Riigihangete registri avaandmed (lepinguteated 2026 veebruar–juuli) —
   https://riigihanked.riik.ee/rhr/api/public/v1/opendata/notice_award/2026/month/2/xml (kuud 2–7)
9. TenderGlass: HTM hankijaprofiil — https://tenderglass.com (registri koondandmed)
10. Opiq koolipakett 2026/27 hinnad — https://opiq.ee
11. TTJA digiligipääsetavus — https://ttja.ee/avaliku-sektori-digiligipaasetavus
12. EN 301 549 V3.2.1 — https://etsi.org; EU Web Accessibility Directive 2016/2102
13. Komisjoni delegeeritud määrus (EL) 2025/2152 (piirmäärad 2026–2027) — https://eur-lex.europa.eu
14. Direktiiv 2011/7/EL (hilinenud maksete direktiiv)
15. RaM juhend: hankelepingute muutmine kriisiolukorras (04/2026) — https://fin.ee (leppetrahvi praktika)
