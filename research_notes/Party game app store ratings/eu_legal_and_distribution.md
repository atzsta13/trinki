# EU / Austria / Germany legal framework and distribution options for a free, offline party/drinking card game

Researched 2026-10-09. This is not legal advice. Research method caveat: direct page fetches (f-droid.org, usk.de, oesterreich.gv.at, etc.) were blocked by the sandbox network policy (CONNECT 403), so findings below rely on search-engine result summaries and snippets of the cited pages, not full reads. Wording of legal texts should be re-checked in RIS / gesetze-im-internet.de before relying on it.

## 1. Austria: youth protection (Länder law), alcohol limits, media rules, and whether PEGI is binding

### Takeaway
Youth protection is a matter for the nine Bundesländer; the rules of the Land where the minor actually is apply. Alcohol: under 16 no alcohol; 16–17 beer/wine allowed, spirits (incl. mixed drinks) not. PEGI is legally binding only for the *commercial sale* of game media to minors in Vienna and Carinthia, not Austria-wide, and Austrian Länder media rules target "jugendgefährdende" media (glorified violence, discrimination, pornography); no found Land rule specifically bans media that merely reference drinking.

### Cited Findings
- Youth protection is Landessache; the law of the Bundesland where the child/young person is currently located applies, so rules differ by Land — [oesterreich.gv.at, Jugendgefährdende Medien – Regelung in Wien (and parallel pages per Land)](https://www.oesterreich.gv.at/de/themen/reisen_und_freizeit/vorschriften-fuer-jugendliche/verhaltensregeln-im-alltag-und-auf-reisen/1/Seite.1740549)
- Upper Austria (§ 8 Oö. JSchG 2001, text per 2018 amendment comparison): under 16, acquisition and consumption of tobacco and alcoholic drinks is prohibited; from 16, acquisition and consumption of distilled alcoholic drinks ("gebrannte alkoholische Getränke"), including in mixed drinks, is prohibited; also covers alcohol bound to a carrier substance — [Land OÖ, Textgegenüberstellung Jugendschutzgesetz-Novelle 2018](https://www.land-oberoesterreich.gv.at/Mediendateien/Formulare/Dokumente%20VerfD/textgeg2018_jugendschutzgesetz_novelle_2018_be_rs.pdf)
- Tobacco/vaping 18 is federal law (TNRSG § 2a, since 1 Jan 2019), not Land law — [Salzburg, Jugendschutz Österreich brochure (Nov 2018)](https://www.Salzburg.gv.at/gesellschaft_/Documents/Jugend/Jugendschutz_osterreich.pdf)
- Länder "jugendgefährdende Medien" rules: common core prohibits giving minors media that endanger development, typically glorified violence, discrimination, pornography. Upper Austria defines concrete case groups (e.g. glorifying criminal acts of inhuman brutality) and bans minors' acquisition, possession and use; Tyrol explicitly counts computer games and software as "Medien"; Styria fines adults up to EUR 15,000 — [oesterreich.gv.at Land pages: OÖ](https://www.oesterreich.gv.at/de/themen/reisen_und_freizeit/vorschriften-fuer-jugendliche/verhaltensregeln-im-alltag-und-auf-reisen/1/Seite.1740544), [Tirol](https://www.oesterreich.gv.at/de/themen/reisen_und_freizeit/vorschriften-fuer-jugendliche/verhaltensregeln-im-alltag-und-auf-reisen/1/Seite.1740547), [Steiermark](https://www.oesterreich.gv.at/de/themen/reisen_und_freizeit/vorschriften-fuer-jugendliche/verhaltensregeln-im-alltag-und-auf-reisen/1/Seite.1740546), [Kärnten](https://www.oesterreich.gv.at/de/themen/reisen_und_freizeit/vorschriften-fuer-jugendliche/verhaltensregeln-im-alltag-und-auf-reisen/1/Seite.1740542)
- Vienna § 10 Abs. 3 WrJSchG 2002 (amended 2008, in force since 1 Dec 2008): game media may be sold commercially to young people of a given age only with a clearly visible PEGI label showing suitability for that age; USK labels were accepted as fallback until 1 Jan 2013; labelled educational games are exempt — [jusline § 10 WrJSchG 2002](https://www.jusline.at/gesetz/wrjschg_2002/paragraf/10); [Wiener LGBl. 2008/23](https://www.gemeinderecht.wien.at/recht/landesrecht-wien/landesgesetzblatt/jahrgang/2008/pdf/lg2008023.pdf); [IRIS Merlin](https://merlin.obs.coe.int/article/4785)
- oesterreich.gv.at states PEGI labelling is binding for selling computer/console games in Vienna and Carinthia; otherwise PEGI is presented as an age recommendation for parents — [oesterreich.gv.at, Computer- und Online-Spiele](https://www.oesterreich.gv.at/de/themen/onlinesicherheit_internet_und_neue_medien/internet_und_handy___sicher_durch_die_digitale_welt/4/Seite.1720600); consistent with [evz.de](https://www.evz.de/einkaufen-internet/gaming/jugendschutz-fuer-videospiele.html) ("nur Wien und Kärnten")

### Inferences
- The Vienna/Carinthia PEGI rule addresses *commercial sale* of game media (Datenträger) to minors; it is unclear and arguably unlikely that it covers a free download or a free website. A free, offline app distributed through stores (which assign IARC/PEGI ratings anyway) is unlikely to face Austrian youth-protection issues.
- Austrian law addresses minors' own drinking and adults *giving* alcohol to minors; the developer of an app is not a supplier of alcohol. The Länder media prohibitions (violence, discrimination, porn) do not obviously catch a drinking-themed card game, but "entwicklungsgefährdend" is a general clause, so sexual "spicy" content at high levels is the more plausible risk area than alcohol references.
- Practical design consequence: a 16+ rating aligns with Austrian beer/wine age; content that pushes spirits/shots would map to 18.

### Gaps
- Could not read current consolidated Länder texts in RIS (blocked); did not verify Vienna and Carinthia wording as of 2026, nor whether any Land has an explicit clause on media glorifying alcohol/drug use.
- No Austrian source found on whether youth-protection media rules apply to free online/web content (vs. physical sale).

## 2. Germany: JuSchG, USK criteria for alcohol, JMStV for websites (age labels, age-de.xml, age verification)

### Takeaway
In Germany USK labels are legally binding for games (JuSchG § 14); USK treats positive or frequent depiction of alcohol as a rating-relevant "Alkohol" content descriptor but publishes no explicit drinking-game rule. A website offering a 16+ game is "entwicklungsbeeinträchtigend" content under § 5 JMStV and must use a protective measure — the simplest is a machine-readable age label (age-de.xml) readable by recognized youth-protection programs; a 18+ (not jugendgefährdend) offer can also be handled by age-label/time windows, but the Landesmedienanstalten are critical of labels alone for 18.

### Cited Findings
- USK age ratings are based on elements such as violence, drugs, horror, war, swearing, alcohol, gambling; criteria were extended from 1 Jan 2023 (new "content descriptors" incl. alcohol) — [GamesWirtschaft, neue USK-Kennzeichen 2023](https://www.gameswirtschaft.de/politik/usk-kennzeichen-games-altersfreigabe-2023-0407/); [WinFuture](https://winfuture.de/news,133526.html)
- USK content descriptor "Alkohol": alcohol or alcohol consumption is depicted positively or frequently in the game — [USK, Die USK-Alterskennzeichen](https://usk.de/die-usk-alterskennzeichen/)
- USK Leitkriterien (2022, valid for submissions from 1.1.2023) have chapters on violence, sexuality, language and drugs; no separate alcohol/drinking-game chapter found in the table of contents — [USK Leitkriterien 2022 PDF](https://usk.de/wp-content/uploads/2022/12/USK-Leitkriterien-2022-1.pdf)
- Apps on Google Play are rated via IARC, and the USK's IARC page lists "Alkoholkonsum" as a content descriptor — [USK, Games and apps in the IARC system](https://usk.de/en/home/age-classification-for-games-and-apps/games-and-apps-in-the-iarc-system/); [Google Play Help, content ratings](https://support.google.com/googleplay/answer/6209544?hl=en)
- A secondary guide claims the IARC questionnaire asks whether substances are used in an educational context or *promoted* — [capgo.app age ratings guide](https://capgo.app/blog/app-store-age-ratings-guide/) (not official; unverified)
- § 5 JMStV: providers of content that may impair development must ensure children/young people of the affected age tier (6, 12, 16, 18) usually don't perceive it; impairment is presumed where the content is not released for that age under JuSchG. Compliance options (§ 5 Abs. 3): technical or other means making access impossible/significantly harder, OR an age label readable by suitable youth-protection programs (§ 11), OR time windows (16+: 22–6 h; 18+: 23–6 h) — [JMStV 2025 consolidated, TLM](https://www.tlm.de/assets/uploads/general/DieTLM/Rechtsgrundlagen/JMStV_2025.pdf); [gesetze-bayern § 5 JMStV](https://www.gesetze-bayern.de/Content/Pdf/JMStV-5?all=False); [NLM, entwicklungsbeeinträchtigende Angebote](https://nlm.de/jugendschutz/grundbegriffe/entwicklungsbeeintraechtigende-angebote)
- No general labelling obligation for online providers, except film and game platforms, which may only offer a film/game if labelled with the § 14 JuSchG age tiers — [FSM Lexikon, Altersklassifizierung im Internet](https://www.fsm.de/de/lexikon/altersklassifizierung-und-alterskennzeichen-im-internet)
- JusProg: JMStV obliges providers of potentially development-impairing content (i.e. from age tier 16) and all larger commercial providers to label for youth-protection programs; label (age-de.xml) placed in server root, or via HTTP header / HTML meta tag; correctly labelled impairing content may be distributed in Germany — [JusProg, Hintergrund für Anbieter](https://www.jugendschutzprogramm.de/anbieter/hintergrund/)
- Since 1 June 2013 the tiers 6/12/16/18 are available in labels; KJM granted JusProg and Telekom programs the "ab 18" tier — [ComputerBase 2013](https://www.computerbase.de/2013-06/pflicht-zur-sendezeitbeschraenkung-fuer-inhalte-ab-18-jahren-entfaellt/)
- The Landesmedienanstalten (2022/2023 statements) reject that an age-de.xml label alone suffices for 18+ content and note JusProg use in private households remains low — [Stellungnahme Medienanstalten 2022](https://www.die-medienanstalten.de/fileadmin/user_upload/die_medienanstalten/Service/Positionspapiere/20220620_Stellungnahme_Medienanstalten_JMStV.pdf); [Stellungnahme 6. MÄStV 2023](https://rundfunkkommission.rlp.de/fileadmin/rundfunkkommission/Dokumente/6._MAEStV_Stellungnahmen_2022/20231206_Stellungnahme_Medienanstalten_6._MAEndStV_final.pdf)
- Overview of German online youth protection obligations — [WBS Legal, Jugendschutz im Internet](https://www.wbs.legal/medienrecht/jugendmedienschutz/jugendschutz-internet/)

### Inferences
- A free web/PWA version of a drinking game, if reachable from Germany, would likely be treated as at least 16-relevant content. The cheapest compliant measure for a small developer is an age-de.xml label (plus meta tag) declaring 16 or 18. A simple "I am 18" click-through gate is *not* a legally recognized measure under JMStV, but costs nothing as an extra signal.
- Strictly 18+ content (explicit sexual "spicy" tier) is the hard case: an age-label may not be accepted by regulators; full age verification (AVS) is only mandatory for "jugendgefährdend" content (e.g. pornography) under § 4 JMStV — a drinking game is very unlikely to fall there unless it includes pornographic content.
- JMStV jurisdiction over a provider established in Austria is limited by the EU country-of-origin principle (e-Commerce Directive / DSA); German regulators can act against foreign providers only under narrow derogation conditions. This lowers practical risk for an Austrian developer but is not a guarantee.
- Whether an "Alkohol" descriptor pushes a rating to USK 16 vs 12 depends on whether drinking is presented positively/as game mechanic; drinking-as-penalty mechanic is likely judged as "frequent/positive".

### Gaps
- Could not access the full USK Leitkriterien text on alcohol; no USK statement found that specifically addresses drinking-game mechanics or neutral substitutes.
- No current (2025–2026) KJM guidance found on age verification for 16/18 web content; JMStV 2025 amendments (e.g. OS-level parental-control duties) not verified in detail.
- Country-of-origin argument above is from general knowledge, not a sourced finding.

## 3. EU law: DSA, AVMSD, alcohol advertising rules, and developer liability

### Takeaway
A free, ad-free, non-commercial game that references drinking is not "alcohol advertising": AVMSD Art. 9(1)(e) regulates audiovisual commercial communications for alcoholic beverages, which presupposes promotion of goods/brands for remuneration. The DSA mostly regulates intermediaries hosting third-party content; an offline app with no user-generated sharing is not a hosting service, and micro/small platforms are exempt from the main platform section anyway. Liability for harm from drinking games is untested; general tort principles and players' own responsibility apply.

### Cited Findings
- AVMSD Art. 9(1)(e): audiovisual commercial communications for alcoholic beverages shall not be aimed specifically at minors and shall not encourage immoderate consumption (as amended by Directive 2018/1808) — [European Audiovisual Observatory, audiovisual commercial communications](https://www.obs.coe.int/en/web/observatoire/audiovisual-commercial-communications)
- Advocacy groups criticise this provision as a loophole and want alcohol added to video-sharing-platform rules (Art. 28b) — [Alcohol Action Ireland submission on AVMSD](https://alcoholireland.ie/aai-submission-to-the-european-commissions-public-consultation-on-the-evaluation-and-revision-of-the-audiovisual-media-services-directive-avmsd/)
- DSA Art. 19: the online-platform section (Arts. 20–28), except Art. 24(3), does not apply to providers that are micro or small enterprises (Recommendation 2003/361/EC: <50 staff and ≤ EUR 10 M turnover/balance sheet), unless designated VLOP — [springlex DSA Art. 19](https://www.springlex.eu/en/packages/dsa/dsa-regulation/article-19/); [ACT explainer](https://actonline.org/2022/08/05/dsa-explainer/)
- F-Droid itself notes DSA/OSA age-verification pressure in its 2025 policy post — [F-Droid blog, Navigating the DMA, DSA and OSA (2025-10-21)](https://f-droid.org/en/2025/10/21/navigating-the-digital-markets-act-digital-services-act-and-the-online-safety-act.html)
- Drinking-game harm cases found are about hosts/bars, not software: a UK landlord lost his licence after a drinking game left a student in a coma; a NYC judge dismissed a beer-pong injury suit, citing the plaintiff's voluntary participation — [Morning Advertiser 2004](https://morningadvertiser.co.uk/Article/2004/01/22/host-loses-licence-after-drinker-falls-into-coma); [Insurance Journal 2012](https://amp.insurancejournal.com/news/east/2012/02/08/234657.htm)

### Inferences
- "Encouraging drinking" in a game is not alcohol marketing in the legal sense: no brand, no product, no remuneration. National alcohol-advertising rules (e.g. Austrian ORF-G / AMD-G, German self-regulation) likewise target commercial communications. Risk only arises if the developer added sponsorship, affiliate links or named brands.
- DSA: an offline app without user-to-user sharing is not an intermediary service; a static PWA website with no user uploads also likely falls outside hosting obligations (beyond basic provider info). Austrian/EU e-commerce law still requires an Impressum (ECG § 5 / MedienG § 25 "Offenlegung") for a website — from general knowledge, not verified here.
- Liability: no case law found against app/game makers for drinking-game harm. Prudent mitigations: 18+ / responsible-drinking disclaimer (the app already has a disclaimer gate), "non-alcoholic drinks work too" wording, no pressure to drink spirits/large amounts, no "chug/shot" mechanics, safety skip for every card.

### Gaps
- No EU or Austrian case law on developer liability for drinking-game apps found.
- Did not verify Austrian product-liability (PHG) application to free software or the new EU Product Liability Directive (2024/2853, covers software, applies to products placed on the market from Dec 2026) — worth checking, since it extends to software; but it applies to products supplied "in the course of a commercial activity", which a free, non-commercial app may fall outside. Unverified.

## 4. Neutral penalties ("sips", points, ice cube) and app store practice

### Takeaway
No PEGI or USK guidance was found that explicitly says replacing alcohol with neutral consequences lowers a rating, but the criteria themselves are content-based: PEGI's "drugs" descriptor (which covers alcohol) triggers PEGI 16 when use of alcohol is depicted/encouraged, and USK's "Alkohol" descriptor triggers on positive/frequent depiction. So a game that genuinely doesn't reference alcohol escapes those triggers; one that says "drink" (or "sip", which implies a drink) doesn't. Apple's guideline 1.4.3 rejects apps encouraging excessive alcohol consumption, and drinking games are also hit by the 4.3 "saturated category" spam rule.

### Cited Findings
- PEGI "Drugs" descriptor: the game refers to or depicts the use of illegal drugs, alcohol or tobacco; games with this descriptor are rated PEGI 16 or 18; PEGI 18 tied to glamourisation of illegal drugs — [Wikipedia, PEGI](https://en.wikipedia.org/wiki/PEGI); [Games Denmark parents' guide](https://gamesdenmark.dk/learn/pegi) (secondary sources; official pegi.info not accessible)
- Google Play's PEGI 16 description contains "encouraging the use of tobacco or drugs" wording — [Google Play Help, content ratings](https://support.google.com/googleplay/answer/6209544?hl=en); [IARC ratings definitions](https://www.globalratings.com/ratings-definitions/)
- Apple guideline (as quoted by developers): apps that encourage consumption of tobacco/vape products, illegal drugs, or excessive amounts of alcohol are not permitted; apps that encourage minors to consume any of these will be rejected — [Apple Developer Forums, "Are drinking games forbidden?"](https://developer.apple.com/forums/thread/649488); [Apple Developer Forums, app with drinking games](https://developer.apple.com/forums/thread/688592)
- Developers report 4.3 (Spam) rejections citing that the app "facilitate[s] games that encourage users to drink", treated as a saturated category; a guideline update summary lists drinking games as saturated under 4.3 — [Apple Developer Forums 745135](https://developer.apple.com/forums/thread/745135); [Apple Developer Forums 744164](https://developer.apple.com/forums/thread/744164); [cur.at guideline update summary](https://cur.at/tol6uU?m=web)
- Many drinking games on the App Store use "sips" and are marketed as for adults (e.g. "The Card Speaks: Drinking Game", "Drinking Game (The Button)") — [App Store: The Card Speaks](https://apps.apple.com/us/app/-/id1367124138); [App Store: The Button](https://apps.apple.com/us/app/id600698759)

### Inferences
- Framing as a "party game" with neutral penalties (points, forfeit, dare) is common, and is the only coherent way under content-based criteria to obtain a lower rating; but it must be genuine across all text — any card saying "drink/sip/shot" re-triggers the alcohol/drugs descriptor in the IARC questionnaire, which is answered by the developer and audited later. Mis-answering risks rating changes or removal.
- A practical approach: two content variants — a store build with neutral penalties (points/forfeits, age 12) and an optional adult/drinking variant distributed outside stores, or one store build honestly rated 16/18 with drinking content.

### Gaps
- No official PEGI/USK/IARC statement found on substituting alcohol with neutral consequences.
- Picolo and similar apps' exact ratings not verified.

## 5. Distribution alternatives: PWA, F-Droid, sideloaded APK, itch.io

### Takeaway
A PWA on one's own website is the most flexible route (no store rules) but brings the JMStV labelling question for German visitors (age-de.xml + meta tag is cheap) and Austrian Impressum duties. F-Droid lists apps with an "NSFW" anti-feature flag that users can filter, but its inclusion policy excludes "explicit, age-restricted, or harmful apps" and it is reviewing NSFW in light of age-verification pressure — a drinking game with spicy (non-explicit) content would likely be accepted, possibly NSFW-flagged; an explicitly sexual or "18+ only" app is risky. itch.io allows adult content with self-labelling, but since July 2025 deindexed NSFW content after payment-processor pressure.

### Cited Findings
- F-Droid NSFW anti-feature: "contains content that the user may not want to be publicized or visible everywhere"; F-Droid frames it around user context and control, not censorship; the client can hide apps with selected anti-features — [F-Droid Anti-Features docs](https://f-droid.org/en/docs/Anti-Features/)
- F-Droid 2025: re-evaluating what the NSFW label means given age-verification regulation; "F-Droid does not and cannot perform age verification"; "our Inclusion Policy and Code Of Conduct exclude illegal, explicit, age-restricted, or harmful apps, such as gambling apps"; the NSFW tag's purpose is under review — [F-Droid blog 2025-10-21](https://f-droid.org/en/2025/10/21/navigating-the-digital-markets-act-digital-services-act-and-the-online-safety-act.html)
- Ongoing policy debate on NSFW definition (e.g. NSFW flag applied to Bible/Quran apps, users argue the definition is too broad) — [GitLab fdroid/admin #604](https://gitlab.com/fdroid/admin/-/issues/604); [F-Droid forum thread](https://forum.f-droid.org/t/nsfw-flag-incorrectly-added-to-bible-and-quran-apps/33401?page=2)
- itch.io (July 2025): deindexed all adult NSFW content from browse and search; suspended Stripe payments for 18+ content; deindexed pages remain accessible to owners; new rules bar some themes (non-consent, underage, incest, etc.); content classification reviews and stricter age-gating announced — [GamingOnLinux 2025](https://www.gamingonlinux.com/2025/07/game-store-itch-io-has-deindexed-adult-content-due-to-payment-processor-scrutiny/page=1/); [GamesMarket](https://www.gamesmarket.global/takedowns-itchio-delists-nsfw-games-indicates-guidelines-from-payment-processors-397b1638996482f257524f908a06a67d); [itch.io blog, new content guidelines](https://itch.io/blog/995270/itch-ios-new-content-guidelines.amp)
- itch.io maturity tags are self-selected content categories, not age ratings (community view, not official) — [itch.io forum post](https://itch.io/post/657638)
- Website age labelling: age-de.xml in server root or via HTTP header / HTML meta tag — [JusProg Hintergrund](https://www.jugendschutzprogramm.de/anbieter/hintergrund/)

### Inferences
- A drinking/spicy party game with no sexual explicitness is likely *not* "adult NSFW" in itch.io's payment-processor sense; it could be published there free (no payments involved), probably with a mature/sensitive-content flag. Discoverability may be reduced if flagged.
- F-Droid requires a fully FOSS build (open source licence, buildable from source, no proprietary deps); Capacitor + Haptics are open source, so feasible. F-Droid is not obliged to accept; maintainers may add NSFW. Third-party repo IzzyOnDroid is an alternative.
- Sideloaded APK from own website: no store rules; same website legal duties (Impressum, JMStV label). Android "unknown sources" friction and upcoming Google developer-verification requirements for sideloaded apps (announced 2025, rolling out 2026) may require registering as a developer even outside Play — not verified here; check current status.
- PWA: the existing React/Vite app already runs offline with localStorage, so a PWA is the lowest-effort adult channel; add a (non-binding) 18+ confirmation gate plus age-de.xml label "18" (or 16).

### Gaps
- F-Droid inclusion policy page text and any specific rule on alcohol content not retrieved (fetch blocked); no F-Droid example of a drinking-game app checked.
- itch.io current Creator FAQ wording on "adult content" not retrieved.
- Google's 2026 Android developer verification for sideloading: not researched/verified.

## 6. Safety: ice cubes as a party penalty

### Takeaway
Dental sources consistently warn that chewing ice can crack/chip enamel and damage fillings, crowns and braces. Ice cubes are listed as a choking hazard for young children (under ~4) in public-health/childcare guidance; no specific AAP statement on ice cubes was found, and no source addressing teens/adults was found. For a 12+/16+ party game the main risk is dental (chewing), plus holding ice on skin for long periods (cold injury, not researched).

### Cited Findings
- Chewing ice can chip or crack teeth and crack or loosen fillings/crowns; a pediatric dentist calls it bad for oral health; enamel cracks increase sensitivity; braces wearers risk dislodging wires/brackets — [Colgate (redirect host)](https://testredirects.colgate.com/chewing-ice-teeth-damage-risks-revealed); [Inverse](https://www.inverse.com/mind-body/chewing-ice-bad-for-teeth); [The Quint](https://www.thequint.com/fit/health-news/chewing-ice-cubes-bad-habit)
- Persistent urge to chew ice (pagophagia) can be associated with iron-deficiency anaemia — [MedBound Times](https://www.medboundtimes.com/dentistry/does-chewing-ice-hurt-your-teeth)
- Massachusetts child-care choking-prevention handout (citing AAP child-care standards) lists ice cubes among items to be cautious with; choking is a leading cause of unintentional injury in children under 4 — [mass.gov, Preventing choking in our children](https://www.mass.gov/doc/preventing-choking-in-our-children-0/download)
- AAP-cited: choking is a leading cause of injury/death among children, especially age 3 or younger; >50% of choking incidents involve food — [MSU Extension](https://www.canr.msu.edu/news/keeping_young_children_safe_from_choking); [St. Louis Children's](https://www.stlouischildrens.org/health-resources/pulse/young-children-and-choking)
- A UK paediatrician publicly warned that ice cubes are a choking hazard for small children — [Get Surrey](https://www.getsurrey.co.uk/news/health/doctor-urges-parents-stop-feeding-31680039)

### Inferences
- For the app's audience (12+/16+), wording like "hold an ice cube in your hand/mouth until it melts — don't chew it" or "put an ice cube down your shirt" avoids the chewing (dental) risk; "eat/chew an ice cube" should be avoided. Not a concern for choking in teens/adults according to found sources, but none addressed that age group directly.

### Gaps
- No authoritative (AAP / EAPD / Austrian Zahnärztekammer) statement on ice-cube penalties for teens; dental evidence is mostly from consumer health media citing dentists.
- Cold-contact injury risk (ice held on skin) not researched.
