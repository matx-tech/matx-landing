import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/legal-document';
import { SITE_META } from '@/lib/content/landing-copy';
import { SecurityMeasuresSection, SubprocessorTable } from '@/lib/content/legal-content';

const LEGAL_DOCS = {
  privaatsus: {
    title: 'Privaatsuspoliitika',
    description:
      'Kuidas MATx käsitleb isikuandmeid vastavalt isikuandmete kaitse üldmäärusele (GDPR).',
    updated: 'Kehtib alates: 8. august 2024. Viimati uuendatud: 8. august 2024.',
    sections: [
      {
        heading: '1. Vastutav töötleja',
        body: 'MATX DEVELOPMENT OÜ (registrikood 17549351), Kesk 13, 10144 Tallinn, Eesti. E-post: andri@matx.ee. Telefon: +372 5820 5882. MATx on andmete vastutav töötleja isikuandmete kaitse üldmääruse (GDPR) artikli 4(7) tähenduses.',
      },
      {
        heading: '2. Töödeldavad isikuandmed ja nende allikas',
        body: 'Piloodi registreerimisel: kooli nimi ja registrikood; kontaktisiku ees- ja perekonnanimi; roll (õpetaja/koolijuht/IT-vastutav); e-posti aadress; telefoninumber; klassirühmade arv ja klass. Allikas: kontaktisik edastab andmed vabatahtlikult registreerimisvormis. Õpilase isikuandmeid (nimi, isikukood, hindeid) registreerimisleht ei kogu. Pilootfaasis andmetöötlus koosneb ainult registreerimisandmetest — õpilaste andmete töötlemine algab pärast piloodi lepingu sõlmimist ja kaetakse eraldi andmetöötluslepingus (artikkel 28 GDPR).',
      },
      {
        heading: '3. Töötlemise eesmärk ja õiguslik alus',
        body: 'Eesmärk: piloodi registreerimise menetlemine, sobivuse hindamine ja kooliga ühenduse võtmine. Õiguslik alus: nõusolek (GDPR artikkel 6(1)(a)) — registreerimisvorm sisaldab selget nõusolekuväidet. Nõusoleku saab igal ajal tagasi võtta, kirjutades andri@matx.ee. Tagasivõtmine ei mõjuta enne seda töödeldud andmete seaduslikkust.',
      },
      {
        heading: '4. Säilitusaeg',
        body: 'Registreerimisandmeid säilitatakse 12 kuud alates esitamisest. Kui kool valitakse piloodiprogrammi, säilitatakse andmeid piloodi kestuse jooksul + 6 kuud pärast lõppu (lepinguliste kohustuste täitmiseks). Kui kooli ei valita, kustutatakse andmed 12 kuu möödumisel automaatselt. Nõusoleku tagasivõtmisel kustutatakse andmed 30 päeva jooksul.',
      },
      {
        heading: '5. Andmete saajad ja edastamine',
        body: 'Töötlejad (GDPR artikkel 28): LuxVPS (Luxembourg) — veebimajutus; Cloudflare Inc. (USA) — CDN, DDoS kaitse, e-posti saatmine. Rahvusvahelised edastused (Cloudflare): Standard Contractual Clauses (SCCs, EL-i komisjoni heakskiidetud standardlepingutingimused) + EU-USA Data Privacy Framework (täiendav kaitse). Cloudflare DPA ja allatöötlejate nimekiri: cloudflare.com/cloudflare-customer-dpa ja cloudflare.com/gdpr/subprocessors. Andmeid ei müüda ega edastata turunduseesmärgil kolmandatele isikutele. Õiguslik kohustus: võime avaldada andmeid Eesti õiguskaitseasutustele kohustusliku õigusnormi alusel (GDPR artikkel 6(1)(c)).',
      },
      {
        heading: '6. Rahvusvahelised andmeedastused',
        body: 'LuxVPS: Luksemburg (EL), rahvusvahelist edastust ei toimu. Cloudflare (USA): õiguslik alus Standard Contractual Clauses (GDPR artikkel 46(2)(c)) + EU-USA Data Privacy Framework (Euroopa Komisjoni 2023. aasta piisavuse otsus täiendava kaitsena). Cloudflare on sertifitseeritud EU-U.S. DPF, UK-U.S. DPF ja Swiss-U.S. DPF raamistikes.',
      },
      {
        heading: '7. Andmesubjekti õigused',
        body: 'Teil on õigus: (a) juurdepääs — saada koopia oma isikuandmetest (artikkel 15); (b) parandamine — parandada ebatäpseid andmeid (artikkel 16); (c) kustutamine — nõuda andmete kustutamist ("õigus olla unustatud", artikkel 17); (d) töötlemise piirang — peatada töötlemine teatud juhtudel (artikkel 18); (e) andmete ülekantavus — saada andmed struktureeritud, masinloetavas vormingus (artikkel 20); (f) vastuväide — esitada vastuväide töötlemisele õigustatud huvi alusel (artikkel 21); (g) nõusoleku tagasivõtmine — kui töötlemine põhineb nõusolekul (artikkel 7(3)). Õiguste kasutamiseks kirjutage andri@matx.ee. Vastame 30 päeva jooksul.',
      },
      {
        heading: '8. Automaatne otsustamine ja profileerimine',
        body: 'Registreerimisandmete töötlemisel automaatset otsustamist (GDPR artikkel 22) ei toimu. Pilooti sobivust hindab inimene. MATx põhifunktsionaalsus (õpilase veamustrite tuvastamine ja harjutussoovitused) kasutab masinõpet, kuid need otsused ei avalda õiguslikku ega sarnaselt olulist mõju — soovitused on alati õpetaja kontrolli all ja nõuavad inimese heakskiitu.',
      },
      {
        heading: '9. Küpsised (cookies) ja jälgimistehnoloogiad',
        body: 'Matx.ee kasutab: (a) hädavajalikud küpsised — teema eelistus (tume/hele), vormi täitmise salvestamine brauseri localStorage-s (õiguslik alus: legitiimne huvi, GDPR artikkel 6(1)(f)). Salvestatud andmed: teema valik (matx-theme), registreerimisvormi mustand (matx-registration-draft). Andmed ei lahku brauserist ega ole serveri poolel kättesaadavad. Säilib ka pärast brauseri sulgemist kuni manuaalse kustutamiseni. Puhastamiseks: brauseri seaded → localStorage kustutamine või vormi "Sulge" nupp (kustutab registreerimismustand). (b) Kolmanda osapoole jälgimist (Google Analytics, Facebook Pixel, reklaamiplatvormid) ei kasuta. Veebiliikluse analüütika: praegu puudub; kui lisame tulevikus, teavitame ja uuendame poliitikat.',
      },
      {
        heading: '10. Andmete turvalisus',
        body: 'Rakendame sobivaid tehnilisi ja korralduslikke meetmeid (GDPR artikkel 32): HTTPS-krüpteerimine (TLS 1.3); juurdepääsupiirang — ainult volitatud töötajad; turvaline hosting (LuxVPS Luxembourg + Cloudflare CDN); regulaarsed varukoopiad; logide monitooring. Andmemurde korral: Cloudflare teavitab meid viivitamatult; me teatame Andmekaitse Inspektsioonile 72 tunni jooksul (artikkel 33) ja mõjutatud isikutele ilma ajalise viivituseta (artikkel 34), kui murd kujutab suurt riski õigustele ja vabadustele.',
      },
      {
        heading: '11. Laste andmed',
        body: 'Registreerimisleht ei kogu alla 16-aastaste laste andmeid. Pilootfaasis õpilaste andmete töötlemisel (pärast lepingu sõlmimist) kohaldame GDPR artiklit 8 — alla 16-aastase lapse nõusolek on kehtiv ainult vanema/hooldaja loal. Koolid on esmane vastutav töötleja õpilaste andmete osas; MATx tegutseb töötlejana (artikkel 28).',
      },
      {
        heading: '12. Järelevalveasutus',
        body: 'Teil on õigus esitada kaebus Andmekaitse Inspektsioonile (Eesti andmekaitse järelevalveasutus): Tatari 39, 10134 Tallinn; e-post: info@aki.ee; telefon: +372 627 4135; veebileht: aki.ee. Samuti võite pöörduda kohtutesse vastavalt GDPR artiklile 79.',
      },
      {
        heading: '13. Muudatused privaatsuspoliitikas',
        body: 'Võime privaatsuspoliitikat ajakohastada. Oluliste muudatuste korral teavitame registreeritud kontaktisikuid e-posti teel 30 päeva ette. Uusim versioon on alati kättesaadav aadressil matx.ee/privaatsus. Viimane uuendus: 8. august 2024.',
      },
      {
        heading: '14. Kontaktandmed andmekaitse küsimuste jaoks',
        body: 'Andmekaitse küsimused ja õiguste kasutamine: andri@matx.ee. Vastame 30 päeva jooksul (GDPR artikkel 12(3)).',
      },
      {
        heading: '15. Andmekaitsespetsialist (DPO)',
        body: 'MATX DEVELOPMENT OÜ ei ole kohustatud määrama andmekaitsespetsialisti (GDPR artikkel 37) — pilootfaasis ei toimu ulatuslikku regulaarset süstemaatilist isikuandmete töötlemist ega eriliiki andmete (terviseandmed, biomed andmed) töötlemist. Kui kohustus tekib (piloodi laiendamisel), määrame DPO ja avaldame kontakti siin.',
      },
    ],
  },
  tingimused: {
    title: 'Teenuse tingimused',
    description: 'MATx-i kasutustingimused piloodi- ja lepingufaasis.',
    updated: 'Kehtib alates: 8. august 2024. Viimati uuendatud: 8. august 2024.',
    sections: [
      {
        heading: '1. Lepingu pooled ja kohaldatavus',
        body: 'Need tingimused reguleerivad MATX DEVELOPMENT OÜ (edaspidi "MATx", registrikood 17549351, Kesk 13, 10144 Tallinn) ja MATx-i platvormi kasutava haridusasutuse (edaspidi "Kool") vahelist suhet. Tingimused kehtivad piloodi registreerimisest alates. Pilootfaasis osalemine on tasuta; kommertsleping sõlmitakse eraldi pärast piloodi lõppu.',
      },
      {
        heading: '2. Teenuse kirjeldus ja kättesaadavus',
        body: 'MATx pakub veebipõhist platvormi matemaatika õppimiseks ja õpetamiseks. Teenus sisaldab: õpilaste vastuste registreerimist; veamustrite tuvastamist masinõppe abil; sihitud harjutuste soovitamist; õpetajale nähtavat ülevaadet õpilaste edusammudest. Piloodifaasis: funktsioonid on arendusjärgus; kättesaadavus ei ole garanteeritud; andmete tagasiühiluvus tulevaste versioonidega ei ole tagatud. MATx jätab endale õiguse teenust ajutiselt peatada hoolduse, turvauuenduste või muude tehniliste põhjuste tõttu.',
      },
      {
        heading: '3. Kasutajate kohustused',
        body: 'Kool kohustub: (a) tagama, et platvormi kasutavad ainult volitatud isikud (õpetajad, õpilased); (b) mitte jagama sisselogimisandmeid kolmandatele isikutele; (c) teatama kohe kahtlustatavatest turvaintsidentidest aadressile andri@matx.ee; (d) mitte kasutama platvormi ebaseaduslikul eesmärgil ega viisil, mis kahjustab teisi kasutajaid või MATx-i infrastruktuuri; (e) järgima Eesti isikuandmete kaitse seadust ja GDPR-i õpilaste andmete töötlemisel.',
      },
      {
        heading: '4. Intellektuaalne omand',
        body: 'Õigused platvormile: MATx platvormi lähtekood, disain, kaubamärgid ja äriloogika kuuluvad MATX DEVELOPMENT OÜ-le. Koolile antakse lihtlitsents platvormi kasutamiseks piloodi kestuse jooksul; litsents ei ole ülekantav. Õigused kooli sisestatud andmetele: kool säilitab omandiõiguse kõigi platvormi sisestatud andmete suhtes (õpilaste vastused, õpetaja märkmed). MATx töötleb neid andmeid ainult teenuse osutamiseks ja ei kasuta neid muul eesmärgil ilma kooli selge nõusolekuta. Treening ja agregeeritud andmed: MATx võib kasutada anonümiseeritud, agregeeritud statistikat (ilma isikusamastusvõimaluseta) mudelite täiustamiseks ja uurimistööks. Individuaalseid õpilaste vastuseid ei kasutata teiste koolide mudelites. Koolil on õigus auditeerida anonüümimise protsessi nõudmisel (max 1× aastas, 30 päeva etteteatamisega).',
      },
      {
        heading: '5. Andmekaitse ja GDPR',
        body: 'Andmete vastutav töötleja: pilootfaasis registreerimisandmete osas on MATx vastutav töötleja (GDPR artikkel 4(7)). Õpilaste andmete töötlemisel (pärast piloodi lepingu sõlmimist) on kool vastutav töötleja, MATx tegutseb töötlejana (artikkel 28). Andmetöötlusleping (DPA): õpilaste andmete töötlemisel sõlmitakse eraldi artikkel 28 kohane DPA, mis määratleb töötlemise ulatuse, turvameetmed ja allatöötlejad. Andmesubjekti õigused: kool vastutab andmesubjekti päringute (juurdepääs, parandamine, kustutamine) vastuvõtmise ja vastamise eest. MATx abistab kooli nende päringute täitmisel 14 päeva jooksul.',
      },
      {
        heading: '6. Vastutuse piirangud',
        body: 'MATx-i soovitused on otsustugi, mitte lõplikud juhised. Õpetaja säilitab täieliku kontrolli ja vastutuse pedagoogiliste otsuste üle. AI süsteemide läbipaistvus: MATx järgib EL AI akti (Regulation 2024/1689) artikkel 13 läbipaistvusnõudeid — õpetaja näeb, millistel andmetel soovitus põhineb ja kuidas see genereeriti. Inimese järelevalve (artikkel 29): õpetaja peab heaks kiitma soovituse enne rakendamist; automaatne rakendamine puudub. MATx ei vastuta: (a) õpetaja otsuste tagajärgede eest; (b) kaudse kahju eest (kaotatud tulu, maine kahjustus); (c) kolmandate osapoolte teenuste (hosting, integratsioonid) katkestuste eest. Otsene vastutus: tahtliku või raske hooletuse korral vastutab MATx Eesti seaduste kohaselt (VÕS § 115). Vastutuse piirmäär (va tahtlus/raske hooletus): pilootfaasis piirdub tegelike otseste kuludega; pärast kommertsialiseerimist: 12 kuu teenustasu summa. Välistamatud vastutused: EL-i seadused ei luba välistada vastutust isikukahju, pettuse või tahtliku õiguserikkumise eest — need jäävad kehtima.',
      },
      {
        heading: '7. Teenuse lõpetamine',
        body: 'Piloodi lõpetamine: kumbki pool võib piloodi lõpetada 30 päeva etteteatamisega, kirjutades andri@matx.ee. Viivitamatu lõpetamine: MATx võib teenuse lõpetada viivitamatult, kui kool rikub oluliselt neid tingimusi (nt turvaintsidendi varjamine, mitte volitatud isikutele juurdepääsu andmine). Andmete käsitlemine pärast lõppu: lõpetamisel eksportib MATx kooli andmed 30 päeva jooksul CSV/JSON-vormingus. Ekspordiformaat: struktureeritud tabelina (CSV) või JSON skeemaga, mis võimaldab importimist haridussektori standardsüsteemidesse (EHIS-compatible vormindus) või kooli nõutud struktuurile. Pärast 90 päeva kustutatakse kõik kooli andmed MATx-i serverist jäädavalt (v.a. seadusest tulenevad arhiveerimiskohustused).',
      },
      {
        heading: '8. Konfidentsiaalsus',
        body: 'Mõlemad pooled kohustuvad hoidma konfidentsiaalsena teise poole ärisaladusi ja mitteavalikku infot. Konfidentsiaalsuskohustus kehtib 3 aastat pärast lepingu lõppemist. Ei loeta konfidentsiaalseks: avalikult kättesaadav info; saaja enda välja töötatud info; kolmandalt poolelt seaduslikult saadud info.',
      },
      {
        heading: '9. Muudatused tingimustes',
        body: 'MATx võib neid tingimusi muuta, teavitades kooli e-posti teel 30 päeva ette. Oluliste muudatuste (vastutuse ulatus, andmetöötluse skoop, hinnakiri) korral on koolil õigus leping lõpetada 14 päeva jooksul pärast teatist. Kui kool jätkab teenuse kasutamist pärast muudatuste jõustumist, loetakse muudatused aktsepteerituks.',
      },
      {
        heading: '10. Kohaldatav õigus ja vaidluste lahendamine',
        body: 'Neid tingimusi reguleerib Eesti Vabariigi õigus. Vaidlused lahendatakse läbirääkimiste teel. Kui kokkuleppele ei jõuta 30 päeva jooksul, on pädev Harju Maakohus (Tallinn). Tarbijatel (eraisikutest õpetajad) on õigus pöörduda oma elukohajärgse kohtu poole või Tarbijavaidluste Komisjoni (tvk.ee).',
      },
      {
        heading: '11. Force majeure (vääramatu jõud)',
        body: 'Kumbki pool ei vastuta kohustuste täitmata jätmise eest, kui see tuleneb vääramatust jõust (looduskatastroofid, sõda, terrorirünnak, riiklikud piirangud, taristu ülemaailmne katkestus). Vääramatu jõu kestmisel üle 60 päeva võib kumbki pool lepingu lõpetada.',
      },
      {
        heading: '12. Kontaktandmed',
        body: 'Lepingulised küsimused ja teatised: andri@matx.ee. MATx vastab 5 tööpäeva jooksul.',
      },
    ],
  },
  gdpr: {
    title: 'Andmetöötlusleping (DPA)',
    description:
      'GDPR artikkel 28 kohane leping koolide jaoks, kus kool on vastutav töötleja ja MATx töötleja.',
    updated: 'Kehtib alates: 8. august 2024. Viimati uuendatud: 8. august 2024.',
    sections: [
      {
        heading: '1. Lepingu eesmärk ja kohaldamine',
        body: 'See andmetöötlusleping (Data Processing Agreement, DPA) täpsustab MATX DEVELOPMENT OÜ (edaspidi "Töötleja", MATx, registrikood 17549351, Kesk 13, 10144 Tallinn) kohustusi haridusasutuse (edaspidi "Vastutav töötleja", Kool) isikuandmete töötlemisel vastavalt GDPR artiklile 28. Leping kehtib pilootlepingu allkirjastamisest alates ja katab õpilaste isikuandmete (nimi, klassirühm, vastused, edusammud) töötlemist MATx platformis.',
      },
      {
        heading: '2. Töötlemise ese, kestus ja iseloom',
        body: 'Töötlemise ese: õpilaste isikuandmed (nimi, kasutajanimi, klassirühm, vastused, veamustrite andmed, edusammude statistika). Töötlemise eesmärk: (a) õpilaste vastuste salvestamine ja analüüs; (b) veamustrite tuvastamine; (c) isikupärastatud harjutuste genereerimine; (d) õpetajale statistilise ülevaate esitamine. Töötlemise kestus: piloodi kestus + 90 päeva pärast lepingu lõppu (andmete eksportimise ja kustutamise periood). Töötlemise iseloom: automatiseeritud andmetöötlus (masinõpe, andmebaaside haldus); inimlik sekkumine ainult tehnilise toe ja veaotsingu korral (pseudonümiseeritud andmetega).',
      },
      {
        heading: '3. Töötleja kohustused',
        body: 'Töötleja töötleb isikuandmeid ainult Vastutava töötleja dokumenteeritud juhiste alusel. Töötleja: (a) ei kasuta andmeid muudel eesmärkidel peale lepingus määratletud; (b) tagab, et volitatud töötajad on võtnud konfidentsiaalsuskohustuse; (c) rakendab GDPR artikli 32 kohased turvameetmed (vt punkt 5); (d) kaasab allatöötlejaid ainult Vastutava töötleja eelneval kirjalikul nõusolekul; (e) abistab Vastutavat töötlejat andmesubjekti õiguste (juurdepääs, parandamine, kustutamine) täitmisel 14 päeva jooksul; (f) abistab Vastutavat töötlejat andmekaitse mõjuhinnangu (DPIA) läbiviimisel, kui see on nõutav; (g) kustutab või tagastab kõik isikuandmed lepingu lõppemisel Vastutava töötleja valikul; (h) esitab Vastutavale töötlejale kogu vajaliku info GDPR artikli 28 nõuete täitmise tõendamiseks.',
      },
      {
        heading: '4. Allatöötlejad (subprocessors)',
        body: <SubprocessorTable />,
      },
      {
        heading: '5. Tehnilised ja korralduslikud turvameetmed (artikkel 32)',
        body: <SecurityMeasuresSection />,
      },
      {
        heading: '6. Andmemurre (breach) teated',
        body: 'Cloudflare teavitab meid (Töötlejat) isikuandmete rikkumisest viivitamatult pärast teadasaamist. Töötleja teavitab Vastutavat töötlejat 24 tunni jooksul pärast Cloudflare teatist (e-post + telefon). Teatis sisaldab: (a) rikkumise iseloom ja ulatus; (b) mõjutatud andmete kategooriad ja andmesubjektide arv (hinnanguline); (c) tõenäolised tagajärjed; (d) võetud või kavandatud leevendusmeetmed; (e) kontaktisik (andri@matx.ee, +372 5820 5882). Vastutav töötleja otsustab, kas ja millal teavitada Andmekaitse Inspektsiooni (72h GDPR artikkel 33) ja andmesubjekte (artikkel 34). Töötleja abistab teatiste koostamisel.',
      },
      {
        heading: '7. Andmesubjekti õiguste toetamine',
        body: 'Vastutav töötleja vastutab andmesubjekti päringute (GDPR artiklid 15-22) vastuvõtmise eest. Töötleja abistab: (a) juurdepääs (artikkel 15): eksportib õpilase kõik andmed JSON-vormingus 14 päeva jooksul; (b) parandamine (artikkel 16): parandab andmed Vastutava töötleja juhise alusel 7 päeva jooksul; (c) kustutamine (artikkel 17): kustutab õpilase andmed jäädavalt 30 päeva jooksul; (d) piirang (artikkel 18): peatab õpilase andmete töötlemise (märgistab "külmutatud") 7 päeva jooksul; (e) ülekantavus (artikkel 20): ekspordib andmed masinloetavas vormingus (JSON/CSV). Töötleja ei vasta päringutele otse — kõik päringud suunatakse Vastutavale töötlejale.',
      },
      {
        heading: '8. Andmete kustutamine ja tagastamine lepingu lõppemisel',
        body: 'Lepingu lõppemisel (piloodi lõpp, lepingu lõpetamine): Vastutav töötleja valib: (a) andmete tagastamine — Töötleja eksportib kõik andmed CSV/JSON-vormingus 30 päeva jooksul; (b) kustutamine — Töötleja kustutab kõik andmed jäädavalt (sh varukoopiad) 90 päeva jooksul. Kustutamise sertifikaat: Töötleja väljastab kirjaliku kinnituse andmete kustutamise kohta. Erand: andmed, mille säilitamine on seadusega kohustuslik (nt maksude arvestus, kohtuvaidluse tõendid), säilitatakse minimaalselt vajaliku aja.',
      },
      {
        heading: '9. Auditid ja inspektsioonid',
        body: 'Vastutaval töötlejal on õigus: (a) nõuda Töötlejalt GDPR-i vastavuse tõendeid (sertifikaadid, auditiaruanded); (b) teostada audit Töötleja ruumides või süsteemides 30 päeva etteteatamisega (töötundidel, mitte rohkem kui 2× aastas); (c) määrata sõltumatu audiitor (Töötleja kinnitab audiitori — põhjendamatu keeldumine ei ole lubatud). Töötleja katab oma auditeerimise kulud; Vastutav töötleja katab enda audiitori kulud. Turvakriitilise teabe (salasõnad, võtmed) juurdepääs auditi ajal ainult pseudonümiseeritud või hägustatud kujul.',
      },
      {
        heading: '10. Andmete rahvusvaheline edastus',
        body: 'Andmed töödeldakse LuxVPS infrastruktuuris (esmane asukoht Luxembourg, täpne asukoht vastavalt LuxVPS teenustingimustele). LuxVPS kasutab allatöötlejaid, mis võivad töödelda andmeid väljaspool EL-i (USA: Stripe, PayPal, Google, Cloudflare, Tawk.to). Õiguslik alus: Standard Contractual Clauses (GDPR artikkel 46(2)(c), Komisjoni otsus 2021/914, Module 2). Cloudflare CDN võib ajutiselt vahemälustada sisu globaalses võrgus. LuxVPS DPA: luxvps.net/terms. Cloudflare DPA ja SCC-d: cloudflare.com/cloudflare-customer-dpa. Tehnilise toe kaugtöö: Töötleja töötajad pääsevad andmetele ligi ainult VPN + MFA kaudu, pseudonümiseeritud kujul. Uued kolmandad riigid: ainult Vastutava töötleja eelneval kirjalikul nõusolekul ja GDPR artikli 46 kohaste kaitsemeetmetega.',
      },
      {
        heading: '11. Lepingu kestus ja lõpetamine',
        body: 'Leping kehtib pilootlepingu kestuse jooksul. Leping lõpeb automaatselt pilootlepingu lõppemisel. Ennetähtaegne lõpetamine: Vastutav töötleja võib lepingu lõpetada viivitamatult, kui Töötleja rikub oluliselt GDPR-i nõudeid (nt andmemurre varjamine, volitamata allatöötleja kasutamine). Lepingu lõppemisel kohaldatakse punkti 8 (andmete tagastamine/kustutamine).',
      },
      {
        heading: '12. Vastutus ja hüvitised',
        body: 'Töötleja vastutab GDPR artikli 82 alusel kahju eest, mis tekib GDPR-i rikkumisest Töötleja süül. Vastutuse jaotus: kui kahju tuleneb nii Vastutavast töötlejast kui Töötlejast, vastutavad proportsionaalselt (GDPR artikkel 82(5)). Vastutuse piirmäär: tahtluse või raske hooletuse puudumisel kuni 12 kuu teenustasu (piloodis tasuta, seega piirdub tegelike otseste kuludega, max kohaldatav seaduslik piirmäär). Allatöötlejate vastutusepiirangud: LuxVPS piirmäär 12 kuu teenustasu (luxvps.net/terms § 15); Cloudflare vastavalt Cloudflare DPA tingimustele. Välistamatud vastutused: isikukahju, tahtlus ja raske hooletus — vastutus täies ulatuses.',
      },
      {
        heading: '13. Kontaktandmed',
        body: 'Töötleja kontakt DPA küsimuste jaoks: andri@matx.ee, +372 5820 5882. Andmemurde teated: sama kontakt (tööpäevadel 2h jooksul, väljaspool tööaega 24h jooksul).',
      },
    ],
  },
} as const;

type LegalSlug = keyof typeof LEGAL_DOCS;

export function generateStaticParams() {
  return Object.keys(LEGAL_DOCS).map((legal) => ({ legal }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ legal: string }>;
}): Promise<Metadata> {
  const { legal } = await params;
  const doc = LEGAL_DOCS[legal as LegalSlug];
  return {
    title: `${doc.title} — MATx`,
    description: doc.description,
    openGraph: {
      title: `${doc.title} — MATx`,
      description: doc.description,
      url: `${SITE_META.url}/${legal}`,
      siteName: SITE_META.title,
      locale: SITE_META.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${doc.title} — MATx`,
      description: doc.description,
    },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ legal: string }> }) {
  const { legal } = await params;
  const doc = LEGAL_DOCS[legal as LegalSlug];

  return <LegalDocument title={doc.title} updated={doc.updated} sections={doc.sections} />;
}
