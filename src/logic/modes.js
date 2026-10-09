// `id` is what gets stored in the selected modes and mapped to content packs in deck.js.
// `label` is an i18n key; `labelFallback` is shown when the key isn't translated.
export const MODES = {
    // --- Party ---
    classic: { id: 'classic', label: 'mode_sips', emoji: '🦝' },
    mostLikely: { id: 'mostLikely', label: 'mode_most_likely', emoji: '👉' },
    neverHaveIEver: { id: 'neverHaveIEver', label: 'mode_nhie', emoji: '✋' },
    wouldYouRather: { id: 'wouldYouRather', label: 'mode_wyr', emoji: '🤔' },
    taboo: { id: 'taboo', label: 'mode_taboo', emoji: '🤐' },
    paranoia: { id: 'paranoia', label: 'mode_paranoia', emoji: '🤫' },
    tenOuttaTen: { id: 'tenOuttaTen', label: 'n_1010', labelFallback: '10/10', emoji: '💅' },
    hypotheticals: { id: 'hypotheticals', label: 'n_hypo', labelFallback: 'Hypotheticals', emoji: '💭' },
    bomb: { id: 'bomb', label: 'mode_bomb', emoji: '💣' },
    charades: { id: 'charades', label: 'mode_charades', emoji: '🎭' },
    fakeArtist: { id: 'fakeArtist', label: 'mode_fake_artist', labelFallback: 'Fake Artist', emoji: '🎨' },
    spy: { id: 'spy', label: 'mode_spy', emoji: '🕵️' },
    truthOrDare: { id: 'tod', label: 'mode_tod', emoji: '😈' },
    marryKissKill: { id: 'marryKissKill', label: 'n_mkk', labelFallback: 'Kiss, Marry, Kill', emoji: '💍' },
    mindMatch: { id: 'mindMatch', label: 'n_mindmatch', labelFallback: 'Mind Match', emoji: '🧠' },
    wrongAnswers: { id: 'wrongAnswers', label: 'n_wronganswers', labelFallback: 'Wrong Answers Only', emoji: '❌' },
    betBuddy: { id: 'betBuddy', label: 'n_betbuddy', labelFallback: 'Bet Buddy', emoji: '🎰' },
    fakeOrFact: { id: 'fakeOrFact', label: 'n_fakeorfact', labelFallback: 'Fake or Fact', emoji: '🤥' },

    // --- Social / vibes ---
    newFriends: { id: 'newFriends', label: 'mode_icebreaker', emoji: '🧊' },
    hot: { id: 'closeFriends', label: 'mode_shots', emoji: '🌶️' },
    bar: { id: 'bar', label: 'mode_bar', emoji: '🍻' },
    warmUp: { id: 'warmUp', label: 'mode_pregame', emoji: '🏎️' },
    princess: { id: 'princess', label: 'n_princess', labelFallback: 'Princess Treatment', emoji: '👑' },

    // --- Seasonal ---
    christmas: { id: 'christmas', label: 'mode_christmas', emoji: '🎄' },
    newYear: { id: 'newYear', label: 'mode_newyear', emoji: '🎉' },
    beach: { id: 'beach', label: 'mode_beach', emoji: '🏖️' },
    halloween: { id: 'halloween', label: 'mode_halloween', emoji: '🎃' },
};

export const PARTY_MODES = [
    MODES.classic,
    MODES.mostLikely,
    MODES.neverHaveIEver,
    MODES.wouldYouRather,
    MODES.taboo,
    MODES.paranoia,
    MODES.tenOuttaTen,
    MODES.hypotheticals,
    MODES.bomb,
    MODES.charades,
    MODES.fakeArtist,
    MODES.spy,
    MODES.truthOrDare,
    MODES.marryKissKill,
    MODES.mindMatch,
    MODES.wrongAnswers,
    MODES.betBuddy,
    MODES.fakeOrFact
];

export const SOCIAL_MODES = [MODES.newFriends, MODES.hot, MODES.bar, MODES.warmUp, MODES.princess];
export const SEASONAL_MODES = [MODES.christmas, MODES.newYear, MODES.beach, MODES.halloween];

// All party modes are on by default.
export const DEFAULT_MODES = PARTY_MODES.map(m => m.id);
