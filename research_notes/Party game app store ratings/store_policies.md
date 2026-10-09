# Store policies for party/drinking card game apps (Google Play + Apple App Store), as of Oct 2026

Method note: Apple's developer site (developer.apple.com) was fetched live (Oct 2026), so Apple quotes below are verbatim from the current page. support.google.com, play.google, globalratings.com, pegi.info and usk.de could NOT be fetched from this environment (DNS/proxy blocked). Google/IARC/PEGI/USK quotes therefore come from search-engine excerpts of the official pages. They match across several indexed copies of the page, but the live text was not checked.

## 1. Google Play: Inappropriate Content (sexual content, profanity) and the alcohol rules

### Takeaway
Google Play does not mention "drinking games" by name. The binding clauses forbid "encourag[ing] the illegal or inappropriate use of alcohol", the "favourable portrayal of excessive, binge or competition drinking", and depicting or encouraging alcohol use by minors. Sexual content and profanity are restricted, and the ban on "explicit text, or adult/sexual keywords in the store listing or in-app" applies to the app content as well as the listing. A drinking game whose core loop is "drink if…" is in a grey zone under the "competition drinking" clause.

### Cited Findings
- Sexual content and profanity, core rule: "We don't allow apps that contain or promote sexual content or profanity, including pornography, or any content or services intended to be sexually gratifying." — [Play Console Help: Inappropriate Content](https://support.google.com/googleplay/android-developer/answer/9878810?hl=en)
- Common violation example: "Content that is lewd or profane – including but not limited to content which may contain profanity, slurs, explicit text, or adult/sexual keywords in the store listing or in-app." — [Inappropriate Content (en-GB)](https://support.google.com/googleplay/android-developer/answer/9878810?hl=en-GB)
- Exceptions: nudity may be allowed for educational, documentary, scientific or artistic (EDSA) purposes when it is not gratuitous. Catalogue apps may carry some sexual book or video titles under conditions. Neither exception covers a party game. — [Inappropriate Content](https://support.google.com/googleplay/android-developer/answer/9878810?hl=en)
- 2021 expansion: the definition of sexual content was broadened to include sexual poses, sexual aids and fetishes, and "lewd or profane" content. Secondary source, not Google. — [MediaNama / search summary](https://www.medianama.com/2025/12/223-deepfake-apps-on-google-play/)
- Tobacco and alcohol, core rule: "We don't allow apps that facilitate the sale of tobacco or products containing nicotine (such as e‑cigarettes, vape pens and nicotine pouches) or encourage the illegal or inappropriate use of alcohol, tobacco, or nicotine." — [Inappropriate Content](https://support.google.com/googleplay/android-developer/answer/9878810)
- Violation examples in the same section:
  - Depicting or encouraging the use or sale of alcohol or tobacco to minors.
  - "Portraying excessive drinking favourably, including the favourable portrayal of excessive, binge or competition drinking."
  
  Source: [Inappropriate Content](https://support.google.com/googleplay/android-developer/answer/9878810?hl=en-GB)
- Wording change: older versions said "irresponsible use of alcohol or tobacco" (2019 coverage). The current text says "illegal or inappropriate use". — [Gummicube 2019](https://www.gummicube.com/blog/google-play-restricts-apps-for-marijuana-alcohol-and-tobacco/)
- A 2019 policy commentary cites a college-party game that shows binge drinking positively as an example of content that could be removed. This is commentary, not Google text. — [Gummicube](https://www.gummicube.com/blog/google-play-restricts-apps-for-marijuana-alcohol-and-tobacco/)
- Play has many drinking-game apps (e.g. "PARTY TRINKSPIEL" also on Microsoft Store; Picolo on both stores), which shows such apps are distributed in practice. — [Microsoft Store listing](https://apps.microsoft.com/detail/9p1vrvtgd3rr?hl=en-US&gl=US), [Apple forum thread naming Picolo/iPuke as live](https://developer.apple.com/forums/thread/688592)

### Inferences
- "Drink if…" cards are moderate consumption prompts, which are probably acceptable. Cards that reward or push heavy or competitive drinking are the most exposed: "chug", "drink the whole glass", "loser downs their drink", drinking races. Lower risk: offer non-alcoholic alternatives, use "take a sip" rather than "down it", and avoid framing drinking as winning or a contest.
- Spicy (sexual) cards: suggestive or innuendo text is common in rated-Mature party games. Explicit sexual descriptions or "adult/sexual keywords" risk an Inappropriate Content violation, whatever the age rating. The rating does not legitimise sexually explicit content on Play.

### Gaps
- Could not read the live Google page to confirm exact current wording or any 2025–2026 edits. Search snippets were consistent across copies.
- No official Google statement or example that names "drinking games" specifically was found.

## 2. Google Play: Families policy and target audience (13–15, under 13)

### Takeaway
If the declared target audience includes children (under 13), the full Families policy applies. Its common violations explicitly include apps that "glamorize the use of alcohol". A drinking game must therefore declare 18+ (or at minimum 16+/16–17 plus 18+) and must not appeal to children. Declaring 13–15 does not by itself trigger the Families policy. It does make the alcohol-and-minors clauses ("depicting or encouraging the use… of alcohol… to minors") directly applicable, and Google's guidance cautions against risky-behaviour content for that age band. "Teacher Approved" is irrelevant for this app.

### Cited Findings
- "Any apps that include children in their target audience must comply with Google Play's Families Policy Requirements." The same obligations apply to apps designed for everyone if any selected age group includes children. — [Manage target audience and app content settings](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en)
- Families policy common violations include "Apps that glamorize the use of alcohol, tobacco or controlled substances". The page also says apps must avoid adult themes and must declare their target age accurately. — [Google Play Families Policies](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en)
- For apps not aimed at children, developers must ensure the app "does not unintentionally appeal to them". Google checks marketing and imagery: including "imagery and terminology … that could be considered targeting children… may impact Google Play's assessment of your declared target audience." — [Target audience and content help](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en)
- Developers should "only select more than one age group … if you have designed your app for and ensured that your app is appropriate for users within the selected age group(s)". They should also consider whether users under 21 count as children under local law. — [Target audience help](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en)
- Age-appropriateness guidance in the search summary: avoid even minimally suggestive alcohol depictions for the youngest age groups, and avoid content that encourages risky behaviour for ages 13–15. This was an indexed summary, and the exact wording was not verified. — [Target audience help](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en)
- Play itself restricts minors in some regions. In the EEA, Australia, Brazil, Singapore, Switzerland and the UK, Play can block "the acquisition and purchase of mature content (such as 18+ rated apps or games) for users determined to be minors". — [Content rating requirements](https://support.google.com/googleplay/android-developer/answer/9859655?hl=en)

### Inferences
- For Party Penguin (alcohol plus spicy sliders): target audience 18+ is the safest declaration. A cartoon penguin mascot and bright colours could be read as "appealing to children" ("imagery and terminology"). That is a real review risk, so keep store screenshots and wording clearly adult and party-oriented.
- Including 13–15 or under-13 in the target audience is effectively incompatible with drinking cards (Families "glamorize alcohol" plus the minors clause).

### Gaps
- Teacher Approved: no policy text was retrieved. It applies only to apps targeting children, so it is not applicable here.
- Exact current Google wording on the 13–15 risky-behaviour guidance was not verified.

## 3. Content rating (IARC → PEGI / USK / ESRB): how alcohol, drinking games, crude humour and innuendo map

### Takeaway
Apps on Google Play get their rating from the IARC questionnaire, which outputs a separate rating per authority. Under PEGI, any alcohol or tobacco content that triggers the "Drugs" descriptor results in PEGI 16 or 18, never lower. Glamorisation or encouragement moves it toward 18. USK has an explicit "Alkoholkonsum" descriptor ("alcohol use is shown positively or frequently"). No source found states a hard IARC rule that "drinking game = X". The outcome depends on questionnaire answers about alcohol use and encouragement. In practice, honest answers for a drinking game land at roughly PEGI 16–18 / USK 16–18 / ESRB Mature 17+ / Google "Mature 17+" (US). That last point is an inference, not a quoted rule.

### Cited Findings
- "All apps must have a content rating from the IARC to be on Google Play. You must accurately complete the Play Console questionnaire for every app, and keep it updated if content in the app changes." — [Content rating requirements](https://support.google.com/googleplay/android-developer/answer/9859655)
- The questionnaire assigns ratings for each participating authority "reflecting their own distinct local standards". It is only accessible through a participating storefront. — [IARC FAQ](https://globalratings.com/faq/) (via search excerpt)
- The IARC Generic rating definitions mention references to cigarettes, alcohol or drugs as rating factors. — [IARC Ratings Definitions](https://www.globalratings.com/ratings-definitions/) (via search excerpt; not fetched)
- PEGI "Drugs" descriptor (covers alcohol and tobacco):
  - PEGI 16 may contain "depictions of illegal drug use or prominent use of tobacco or alcohol".
  - Glamorisation or encouragement of illegal drugs moves a game to PEGI 18.
  - The descriptor appears only on PEGI 16 or 18.
  
  Sources are secondary summaries of PEGI criteria: [PEGI – Wikipedia](https://en.wikipedia.org/wiki/PEGI), [Ask About Games](https://askaboutgames.com/need-to-know/what-are-content-descriptors), [Parent Zone](https://parentzone.org.uk/article/pegi-games-ratings). The primary pegi.info page was not reachable.
- USK: the descriptor text for Alkohol is "Alkohol oder Alkoholkonsum werden im Spiel positiv oder häufig dargestellt." USK 12 titles may already include hints for swear words, vulgar language, and depictions of tobacco, alcohol and drug use. Apps are rated via IARC per USK criteria, under the JMStV (not JuSchG) for online games and apps. — [USK Alterskennzeichen](https://usk.de/die-usk-alterskennzeichen/), [USK: Games and apps in the IARC system](https://usk.de/en/home/age-classification-for-games-and-apps/games-and-apps-in-the-iarc-system/), [Elternguide](https://www.elternguide.online/die-altersfreigaben-der-usk-bei-games-das-steckt-dahinter/) (via search excerpts)
- Recent change: since 1 January 2025 the USK Leitkriterien also account for usage risks such as chats, loot boxes and purchase functions, and gambling is now a separate rating aspect. Nothing specific to drinking games was found. — [USK press release](https://usk.de/update-der-leitkriterien-fuer-alterskennzeichen-usk-beirat-verankert-nutzungsrisiken-in-der-bewertung-digitaler-spiele/)
- Rating descriptors such as "Sexual innuendo" and "Mild swearing" are used on Play listings. — [MediaNama](https://www.medianama.com/2025/12/223-deepfake-apps-on-google-play/)
- A blog about Picolo cites a German rating of 12 for the app, with 17+ recommended for players. This is a non-official claim and shows inconsistency in practice. — [anti-hang-over.de](https://anti-hang-over.de/picolo-trinkspiel/)

### Inferences
- Answer the IARC questions on alcohol references or encouragement honestly ("Yes, the app encourages/references alcohol consumption"). The resulting rating will likely be PEGI 16 or 18 and USK 16 or 18. Crude humour and sexual innuendo add descriptors but are unlikely to push beyond what the alcohol answer already yields. Explicit sexual content would push toward 18.
- The spiciness slider does not lower the rating. The questionnaire must reflect the maximum content reachable in the app (see section 4).

### Gaps
- No primary IARC, PEGI or USK text on a "drinking game" rule; the primary sites were unreachable. The exact IARC questionnaire wording on alcohol is not public (it is only visible inside Play Console).
- No ESRB-specific source was retrieved. ESRB "Use of Alcohol" and "Alcohol Reference" descriptors exist (general knowledge, not verified here).

## 4. Rating accuracy, dynamic/downloaded content, IAP content, and consequences of misrating (Google Play)

### Takeaway
Google requires an accurate rating covering the app's content and requires re-submitting the questionnaire whenever changed content or features affect the answers. Misrepresentation leads to removal or suspension, and authorities can override ratings or refuse classification in their territory. Commentary says answers must cover the whole app, including UGC, ads and IAP. Google's own UGC page ties UGC to rating accuracy. No specific Google text on IAP-unlocked content was found.

### Cited Findings
- "Misrepresentation of your app's content may result in removal or suspension, so it is important to provide accurate responses to the content rating questionnaire." — [Content rating requirements](https://support.google.com/googleplay/android-developer/answer/9859655)
- "Apps without a content rating will be removed from the Play Store." Unrated apps "may be removed". — [Content rating requirements](https://support.google.com/googleplay/android-developer/answer/9859655), [Content Ratings](https://support.google.com/googleplay/android-developer/answer/9898843?hl=en)
- "If you make changes to your app content or features that affect the responses to the rating questionnaire, you must submit a new content rating questionnaire in the Play Console." — [Content rating requirements](https://support.google.com/googleplay/android-developer/answer/9859655)
- "Rating authorities participating in IARC may change your app's rating after a review." Also: "On a limited basis, rating authorities can refuse classification … the distribution of the app or game is not allowed in the rating authority's territory." Appeals go through the link in the certificate email. — [Content rating requirements](https://support.google.com/googleplay/android-developer/answer/9859655)
- UGC: an app must provide "accurate responses to the content rating questionnaire regarding UGC, as required by the Content Ratings policy." — [User Generated Content policy](https://support.google.com/googleplay/android-developer/answer/9876937?hl=en)
- Third-party guides advise answering "for the ENTIRE app, not just main features", including ads, UGC and in-app purchases. This is not Google text. — [Newly](https://newly.app/how-to/google-play-content-rating), [Capgo](https://capgo.app/blog/app-store-age-ratings-guide/)
- Content not globally appropriate: Google may limit availability to regions where it is deemed appropriate (2022 announcement, via search summary). — [Play Console announcements](https://support.google.com/googleplay/android-developer/announcements/13412212?hl=en)

### Inferences
- Content downloaded or unlocked later (new card packs, IAP packs, remote content) must already be reflected in the rating. Otherwise the questionnaire has to be redone before shipping that content. Party Penguin is fully offline with bundled content, which removes this risk entirely. Custom cards typed by players stay on-device and are not shared, so they are arguably not UGC in the Play sense. Answer the UGC/sharing questions "no" only if nothing is shared.

### Gaps
- No verbatim Google clause stating that IAP-unlocked content must be covered by the rating. The general accuracy and update obligations imply it.

## 5. Apple App Store Review Guidelines (1.1, 1.4.3, 2.3.x, 2.5.2, 4.3, 4.7, Kids)

### Takeaway
Apple bans apps that "encourage consumption of … excessive amounts of alcohol" and rejects any that "encourage minors" to consume alcohol (1.4.3). The bigger practical obstacle is 4.3(b). Since the June 2026 revision, Apple explicitly calls "drinking games" "mediocre, low-quality, or low-effort" apps that "do not add value", and warns that repeated submissions may lead to removal from the Developer Program. Before June 2026, drinking games were already listed as a saturated category. Metadata (icon, screenshots) must be 4+-appropriate even for an 18+ app (2.3.8). Content must be in the binary or comply with 2.5.2 and 4.7, and hidden features are banned (2.3.1).

### Cited Findings (all verbatim from [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), fetched Oct 2026)
- 1.1: "Apps should not include content that is offensive, insensitive, upsetting, intended to disgust, in exceptionally poor taste, or just plain creepy."
- 1.1.4: "Overtly sexual or pornographic material, defined as 'explicit descriptions or displays of sexual organs or activities intended to stimulate erotic rather than aesthetic or emotional feelings.' This includes 'hookup' apps…"
- 1.4.3: "Apps that encourage consumption of tobacco and vape products, illegal drugs, or excessive amounts of alcohol are not permitted. Apps that encourage minors to consume any of these substances will be rejected. …"
- 4.3(b): "Don't submit apps that are indistinguishable from what's already widely available. … Certain kinds of apps, such as dating, flashlight, sound effects, wallpaper, simple timers, and fortune telling, are well established on the App Store and we will not accept new submissions unless they offer a meaningfully different or improved experience. We may remove these apps from the App Store going forward if they are not updated, improved, or do not attract customers. Other kinds of apps, such as drinking games, Kama Sutra, fart, and burp apps, are mediocre, low-quality, or low-effort and do not add value to the App Store. Repeated submissions of this kind may lead to removal from the Apple Developer Program."
- Recent change: the 4.3(b) revision is dated 8 June 2026 (WWDC). Earlier text said Apple would reject fart, burp, flashlight, fortune telling, dating, drinking games and Kama Sutra apps "unless they provide a unique, high-quality experience". The changelog entry "4.3: Added drinking game apps as a saturated category" appeared in an earlier (2021) update. — [MacRumors, 9 Jun 2026](https://www.macrumors.com/2026/06/09/app-store-guidelines-low-quality-apps/), [MacTech, 10 Jun 2026](https://www.mactech.com/2026/06/10/revamped-apple-guidelines-warn-developers-not-to-make-low-quality-and-mediocre-apps-for-the-app-store/), [WWDC 2021 guideline history](https://www.appstorereviewguidelineshistory.com/articles/2021-06-07-wwdc-2021/) (via search excerpts)
- Developer reports of drinking-game rejections, mostly citing 4.3 spam:
  - One reviewer reasoning: the app "prominently features functionality that facilitates games that encourage users to drink, so it is classified as a drinking game app".
  - Developers note inconsistency, since Picolo and iPuke remain live.
  
  Sources: [Apple Dev Forums 688592](https://developer.apple.com/forums/thread/688592), [649488](https://developer.apple.com/forums/thread/649488), [689498 (Sep 2021)](https://developer.apple.com/forums/thread/689498)
- 2.3.1(a): "Don't include any hidden, dormant, or undocumented features in your app; your app's functionality should be clear to end users and App Review. All new features … must be described with specificity in the Notes for Review…"
- 2.3.6: "Answer the age rating questions in App Store Connect honestly so that your app aligns properly with parental controls. If your app is mis-rated, customers might be surprised by what they get, or it could trigger an inquiry from government regulators. If your app includes media that requires the display of content ratings or warnings … you are responsible for complying with local requirements in each territory…"
- 2.3.7: "Choose a unique app name, assign keywords that accurately describe your app, and don't try to pack any of your metadata with … irrelevant phrases…"
- 2.3.8: "Metadata should be appropriate for all audiences, so make sure your app and in-app purchase icons, screenshots, and previews adhere to a 4+ age rating even if your app is rated higher. … Use of terms like 'For Kids' and 'For Children' in app metadata is reserved … for the Kids Category."
- 2.5.2: apps "may not … download, install, or execute code which introduces or changes features or functionality of the app…"
- 3.1.1: unlocking "access to premium content" must use in-app purchase.
- 4.7 (HTML5/JS mini apps and games not embedded in the binary): "You are responsible for all such software offered in your app…" 4.7.5: "Your app must provide a way for users to identify software that exceeds the app's age rating, and use an age restriction mechanism based on verified or declared age to limit access by underage users." 1.2.1(a) has the same wording for creator apps.
- 1.3 Kids Category and 5.1.4: apps not in the Kids Category "cannot include any terms in app name, subtitle, icon, screenshots or description that imply the main audience for the app is children."

### Inferences
- Party Penguin is a Capacitor app. Its web code is bundled in the binary, so 2.5.2 and 4.7 do not apply as long as no remote JS or content packs are fetched. Hot-update services (live updates) would fall under 2.5.2 and 4.7.
- 4.3(b) is the main App Store risk. Positioning as a party game with optional drinking (Truth or Dare, minigames like Spy, Charades and Fake Artist, votes) rather than a "drinking game" improves the odds. The reviewer reasoning quoted above shows the classification is based on whether the app "prominently features functionality that … encourage[s] users to drink".

### Gaps
- Could not fetch the MacRumors/MacTech articles directly. The June 2026 date comes from search excerpts. The current 4.3(b) text itself was verified live on Apple's site.

## 6. Apple age ratings (2025 system: 4+, 9+, 13+, 16+, 18+) and how alcohol/sexual content map

### Takeaway
Since Apple's July 2025 overhaul (mandatory questionnaire answers by 31 Jan 2026), "Alcohol, tobacco, or drug use or references" yields 13+ when infrequent and 18+ when frequent. Sexual content or nudity likewise yields 13+ when infrequent and 18+ when frequent. "Mature or suggestive themes" yields 9+ when infrequent and 16+ when frequent. Profanity or crude humour yields 9+ when infrequent and 13+ when frequent. A drinking game with frequent alcohol references is therefore 18+ on the App Store.

### Cited Findings
- From [Apple: Age ratings values and definitions](https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions) (fetched Oct 2026):
  - 9+ includes: "Infrequent profanity and crude humor", "Infrequent mature or suggestive themes".
  - 13+ includes: "Frequent profanity and crude humor", "Infrequent alcohol, tobacco, or drug use or references", "Infrequent sexual content or nudity", "Infrequent simulated gambling".
  - 16+ includes: "Unrestricted web access", "Frequent mature or suggestive themes".
  - 18+ includes: "Frequent alcohol, tobacco, or drug use or references", "Frequent sexual content or nudity", "Gambling".
  - "Unrated" (cannot be published on the App Store): graphic sexual content and nudity.
  - Descriptor definition: alcohol, tobacco, or drug use is "References to or depictions of the consumption of alcohol, tobacco products, or other licit or illicit substances". Brazil maps it to A14 (infrequent) and A16 (frequent).
  - The page lists "Parental Controls" and "Age Assurance" ("Mechanism to confirm an individual's age meets the age requirement for accessing specific content or services") as questionnaire items. The page does not say they lower a rating.
  - Region-specific display: e.g. Australia, Brazil (official MJSP ratings take precedence), Korea.
- Timeline: announced 24 July 2025. 13+, 16+ and 18+ replace 12+ and 17+. Existing apps were auto-re-rated. Developers had to answer the new questions (in-app controls, capabilities, medical/wellness, violent themes) by 31 January 2026, or updates are blocked. Developers can set a higher rating than calculated. — [Pocket Gamer.biz](https://www.pocketgamer.biz/apple-overhauls-app-store-age-ratings-with-new-categories/), [SoCast](https://www.socastdigital.com/2025/12/15/important-ios-app-age-rating-updates-required-by-january-31-2026/), [ppc.land](https://ppc.land/apple-updates-app-store-age-ratings-system-with-granular-controls/)
- Later development (single, weaker source): age-range signals follow the Texas definitions (under 13, 13–15, 16–17, 18+), and social-media declarations are mandatory from September 2026. Unverified. — [ecorpit](https://ecorpit.com/app-store-social-media-declaration-age-assurance-readiness-2026/)

### Inferences
- If alcohol references are "infrequent" (only occasional cards), the app could rate 13+. Reviewers would almost certainly consider a drinking game "frequent", so an 18+ rating is expected. Choosing 18+ also aligns with 1.4.3's minors clause.

### Gaps
- The Apple page definitions of "Infrequent" vs "Frequent" were not found on the fetched portion.

## 7. Region-specific content and in-app age gates / "18+ mode"

### Takeaway
Neither store lets an in-app age gate lower the store rating. The rating must reflect all reachable content. Apple's guidelines mention "an age restriction mechanism based on verified or declared age" only for creator apps (1.2.1(a)) and for mini apps and games (4.7.5), where it is required in addition to the app's own rating. Google allows region-limited availability and applies per-region ratings via IARC. A self-declared in-app age gate is therefore an extra safety layer, not a way to obtain a 12+/13+ rating with an "18+ mode" inside.

### Cited Findings
- Apple 1.2.1(a) and 4.7.5: "provide a way for users to identify content that exceeds the app's age rating, and use an age restriction mechanism based on verified or declared age to limit access by underage users." — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Apple 2.3.6 requires honest age-rating answers, and the developer is responsible for local rating requirements per territory. 2.3.1 bans hidden features, so an "18+ mode" must be disclosed to App Review. — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Apple ratings "vary by country based on regional content standards". The developer can raise the rating above the calculated one. — [Apple age ratings values](https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions), [Pocket Gamer.biz](https://www.pocketgamer.biz/apple-overhauls-app-store-age-ratings-with-new-categories/)
- Google: IARC issues per-territory ratings. Authorities can refuse classification in their territory. Google may limit availability to regions where content is appropriate. — [Content rating requirements](https://support.google.com/googleplay/android-developer/answer/9859655), [Play announcements](https://support.google.com/googleplay/android-developer/announcements/13412212?hl=en)
- Google can block minors from acquiring 18+ apps in the EEA, Australia, Brazil, Singapore, Switzerland and the UK. — [Content rating requirements](https://support.google.com/googleplay/android-developer/answer/9859655?hl=en)

### Inferences
- Different content per region (e.g. no alcohol cards in a given country) is technically possible. However, the store rating is per app with per-region IARC outputs computed from one questionnaire. A region-dependent content switch would have to be disclosed to App Review (2.3.1) and still rated at the maximum level.
- The existing Disclaimer gate (17+ confirmation) in Party Penguin is consistent with the guidelines but does not replace an 18+ store rating.

### Gaps
- No Google Play policy text was found that specifically addresses in-app age gates for mature content within a general-audience app.

## 8. Calling it a "drinking game" in the store listing / metadata

### Takeaway
Neither store forbids the words "drinking game" in metadata. Google forbids profane, vulgar or sexual keywords in listings, and Apple requires 4+-appropriate icons and screenshots. On Apple, the "drinking game" label is precisely what triggers 4.3(b) ("drinking games … mediocre, low-quality … do not add value"). Prominent drinking-game positioning therefore raises rejection risk on iOS.

### Cited Findings
- Google violation: "adult/sexual keywords in the store listing or in-app". — [Inappropriate Content](https://support.google.com/googleplay/android-developer/answer/9878810?hl=en-GB)
- Google metadata examples include using "profane, vulgar, or other language that is inappropriate for a general audience in your app's Store listing". Rules apply to every translation of the listing. — [Metadata policy](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en), [Store listing best practices](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- Older (2016) Google guidance: if profanity is critical to the app, "you must censor its presentation within the Store listing". Not confirmed in the current text. — [Android Police 2016](https://www.androidpolice.com/2016/10/19/google-updates-play-store-developer-policy-examples-text-images-videos-will-get-app-taken/)
- Apple 2.3.8 (4+-appropriate metadata) and 2.3.7 (accurate keywords). Apple 4.3(b) names drinking games. — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- An Apple reviewer classified an app as a drinking game because it "prominently features functionality that facilitates games that encourage users to drink". — [Apple Dev Forums 688592](https://developer.apple.com/forums/thread/688592) (via search excerpt)

### Inferences
- Google Play: "drinking game" or "Trinkspiel" in the listing is common and appears permissible if the listing avoids glamorising binge drinking and explicit sexual keywords. Apple: describe it as a party game with optional drinking rules, and keep icon and screenshots free of alcohol-centric or sexual imagery (2.3.8).

### Gaps
- No official statement from either store addressing the phrase "drinking game" in metadata specifically.
