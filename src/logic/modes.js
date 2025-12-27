export const MODES = {
    // --- Featured / Party ---
    classic: {
        id: 'classic',
        label: 'mode_sips',
        emoji: '🦝',
        color: '#00FFFF', // Cyan
        category: 'party',
        description: 'The ultimate mix.'
    },
    truthOrDare: {
        id: 'tod',
        label: 'mode_tod',
        emoji: '😈',
        color: '#ff0055',
        category: 'party',
        description: 'Classic Truth or Dare.'
    },
    charades: {
        id: 'charades',
        label: 'mode_charades',
        emoji: '🎭',
        color: '#FFD700',
        category: 'action',
        description: 'Heads Up! Guess the word.'
    },
    paranoia: {
        id: 'paranoia',
        label: 'mode_paranoia',
        emoji: '🤫',
        color: '#6600cc',
        category: 'social',
        description: 'Whisper questions. Flip to reveal.'
    },

    // --- Vibes (Quick) ---
    hot: {
        id: 'closeFriends',
        label: 'mode_shots',
        emoji: '🌶️',
        color: '#FF0099', // Pink
        category: 'vibe'
    },
    taboo: {
        id: 'taboo',
        label: 'mode_taboo',
        emoji: '🤐',
        color: '#FFD60A', // Yellow
        category: 'vibe'
    },
    warmUp: {
        id: 'warmUp',
        label: 'mode_pregame',
        emoji: '🏎️',
        color: '#30D158', // Green
        category: 'vibe'
    },
    newFriends: {
        id: 'newFriends',
        label: 'mode_icebreaker',
        emoji: '🧊',
        color: '#5AC8FA', // Light Blue
        category: 'vibe'
    },

    // --- Others (Grid in Setup) ---
    mostLikely: {
        id: 'mostLikely',
        label: 'mode_most_likely',
        emoji: '👉',
        color: '#FF9500',
        category: 'party'
    },
    neverHaveIEver: {
        id: 'neverHaveIEver',
        label: 'mode_nhie',
        emoji: '✋',
        color: '#AF52DE',
        category: 'party'
    },
    wouldYouRather: {
        id: 'wouldYouRather',
        label: 'mode_wyr',
        emoji: '🤔',
        color: '#FF2D55',
        category: 'party'
    },
    tenOuttaTen: {
        id: 'tenOuttaTen',
        label: 'n_1010',
        labelFallback: '10/10',
        emoji: '💅',
        color: '#FF9900',
        category: 'extra'
    },
    hypotheticals: {
        id: 'hypotheticals',
        label: 'n_hypo',
        labelFallback: 'Hypotheticals',
        emoji: '🤔',
        color: '#AF52DE',
        category: 'extra'
    },
    bar: {
        id: 'bar',
        label: 'mode_bar',
        emoji: '🍻',
        color: '#FFA500',
        category: 'social'
    },
    // --- Seasonal ---
    christmas: { id: 'christmas', label: 'mode_christmas', emoji: '🎄', color: '#FF3B30', category: 'seasonal' },
    newYear: { id: 'newYear', label: 'mode_newyear', emoji: '🎉', color: '#FFD700', category: 'seasonal' },
    beach: { id: 'beach', label: 'mode_beach', emoji: '🏖️', color: '#5AC8FA', category: 'seasonal' },
    halloween: { id: 'halloween', label: 'mode_halloween', emoji: '🎃', color: '#FF9500', category: 'seasonal' },

    // --- New Modules ---
    spy: {
        id: 'spy',
        label: 'mode_spy',
        emoji: '🕵️',
        color: '#000000',
        category: 'deduction'
    },
    bomb: {
        id: 'bomb',
        label: 'mode_bomb',
        emoji: '💣',
        color: '#FF3B30',
        category: 'action'
    },
    fakeArtist: {
        id: 'fakeArtist',
        label: 'mode_fake_artist',
        emoji: '🎨',
        color: '#ff9900',
        category: 'deduction',
        description: 'Draw 1 line. Find the fake.'
    },
    // Fix duplicate ID for truthOrDare removed
    chooser: {
        id: 'chooser',
        title: 'Finger Chooser',
        label: 'Finger Chooser',
        emoji: '👆',
        color: '#7000FF',
        category: 'tool'
    },
    marryKissKill: {
        id: 'marryKissKill',
        label: 'n_mkk',
        labelFallback: 'Kiss, Marry, Kill',
        emoji: '💍',
        color: '#ff66c4',
        category: 'party'
    },
    mindMatch: {
        id: 'mindMatch',
        label: 'n_mindmatch',
        labelFallback: 'Mind Match',
        emoji: '🧠',
        color: '#FF2D55',
        category: 'party'
    },
    wrongAnswers: {
        id: 'wrongAnswers',
        label: 'n_wronganswers',
        labelFallback: 'Wrong Answers Only',
        emoji: '❌',
        color: '#FF9500',
        category: 'party'
    },
    princess: {
        id: 'princess',
        label: 'n_princess',
        labelFallback: 'Princess Treatment',
        emoji: '👑',
        color: '#FFD700',
        category: 'vibe'
    },
    betBuddy: {
        id: 'betBuddy',
        label: 'n_betbuddy',
        labelFallback: 'Bet Buddy',
        emoji: '🎰',
        color: '#30D158',
        category: 'party'
    },
    fakeOrFact: {
        id: 'fakeOrFact',
        label: 'n_fakeorfact',
        labelFallback: 'Fake or Fact',
        emoji: '🤥',
        color: '#5AC8FA',
        category: 'party'
    }
};

// Helper lists for UI generation
// Helper lists for UI generation
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
export const VIBE_MODES = [MODES.hot, MODES.warmUp, MODES.newFriends];

// Detailed lists for PlayerSetup Grid
export const SOCIAL_MODES = [MODES.newFriends, MODES.hot, MODES.bar, MODES.warmUp, MODES.princess];
export const SEASONAL_MODES = [MODES.christmas, MODES.newYear, MODES.beach, MODES.halloween];

// New Interactive Games (Modules B & C & D)
export const ACTION_MODES = [MODES.spy, MODES.bomb, MODES.truthOrDare, MODES.charades, MODES.fakeArtist];

export const TOOLS = [
    MODES.chooser
];
