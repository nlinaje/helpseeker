export const CATEGORIES = [
    { id: 'hygiene', name: 'Hygiene', emoji: '🚿', color: '#3b82f6', tasks: ['blow-nose', 'brush-teeth', 'wash-hands', 'hand-sanitizer', 'brush-hair', 'wash-face', 'dry-hands', 'sunscreen', 'lip-balm', 'clean-ears'] },
    { id: 'dressing', name: 'Anziehen', emoji: '👕', color: '#10b981', tasks: ['put-on-pajamas', 'put-on-socks', 'put-on-shoes', 'zip-jacket', 'button-shirt', 'put-on-hat', 'put-on-gloves', 'take-off-shoes', 'put-on-mask', 'put-on-glasses'] },
    { id: 'eating', name: 'Essen & Küche', emoji: '🍎', color: '#f59e0b', tasks: ['set-table', 'pour-water', 'use-spoon', 'use-fork', 'open-snack', 'clear-table', 'dishwasher', 'use-napkin'] },
    { id: 'bathroom', name: 'Badezimmer', emoji: '🚽', color: '#6366f1', tasks: ['use-toilet', 'flush-toilet', 'wipe-properly', 'bathroom-door', 'faucet-off'] },
    { id: 'bedroom', name: 'Schlafzimmer', emoji: '🛌', color: '#8b5cf6', tasks: ['make-bed', 'turn-off-light', 'clothes-hamper', 'pick-up-toys', 'get-into-bed'] },
    { id: 'school', name: 'Schule & Lernen', emoji: '📚', color: '#ec4899', tasks: ['pack-bag', 'sharpen-pencil', 'open-book', 'sit-at-desk', 'pencil-case'] },
    { id: 'safety', name: 'Sicherheit & Sozial', emoji: '🛑', color: '#ef4444', tasks: ['red-light', 'cross-street', 'wave-hello', 'ask-help', 'seatbelt', 'wait-line', 'share-toy'] }
];

export const TASKS = [
    // --- HYGIENE ---
    {
        id: 'blow-nose',
        categoryId: 'hygiene',
        title: 'Nase putzen',
        emoji: '🤧',
        steps: [
            { id: 's1', instruction: 'Nimm ein Taschentuch.', animationType: 'image-zoom', image: 'assets/blow-nose/step1.png' },
            { id: 's2', instruction: 'Halte es an die Nase.', animationType: 'image-zoom', image: 'assets/blow-nose/step2.png' },
            { id: 's3', instruction: 'Drücke mit dem Daumen und dem Zeigefinger leicht zusammen.', animationType: 'image-zoom', image: 'assets/blow-nose/step3.png' },
            { id: 's4', instruction: 'Puste kräftig durch die Nase, damit der Schleim im Tuch bleibt!', animationType: 'image-slide-in', image: 'assets/blow-nose/step4.png' },
            { id: 's5', instruction: 'Sieh mal! Durch das Pusten wird die Nase wieder frei und sauber.', animationType: 'image-zoom', image: 'assets/blow-nose/step5.png' }
        ]
    },
    {
        id: 'brush-teeth',
        categoryId: 'hygiene',
        title: 'Zähne putzen',
        emoji: '🦷',
        steps: [
            { id: 's1', instruction: 'Zahnbürste nass machen', animationType: 'image-zoom', image: 'assets/brush-teeth/step1.png' },
            { id: 's2', instruction: 'Zahnpasta draufgeben', animationType: 'emoji-bounce', emoji: '🧴' },
            { id: 's3', instruction: 'Zähne putzen', animationType: 'emoji-shake', emoji: '👄' }
        ]
    },
    {
        id: 'wash-hands',
        categoryId: 'hygiene',
        title: 'Hände waschen',
        emoji: '🧼',
        steps: [
            { id: '1', instruction: 'Hände nass machen', emoji: '💧', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Seife benutzen', emoji: '🧼', animationType: 'emoji-shake' },
            { id: '3', instruction: 'Hände aneinander reiben', emoji: '🤝', animationType: 'emoji-shake' },
            { id: '4', instruction: 'Abspülen', emoji: '🚿', animationType: 'emoji-bounce' }
        ]
    },
    {
        id: 'hand-sanitizer',
        categoryId: 'hygiene',
        title: 'Desinfektionsgel',
        emoji: '🧴',
        steps: [
            { id: '1', instruction: 'Einen Klecks in die Hand geben', emoji: '💧', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'In den Händen verteilen', emoji: '✨', animationType: 'emoji-shake' }
        ]
    },
    {
        id: 'brush-hair',
        categoryId: 'hygiene',
        title: 'Haare kämmen',
        emoji: '🪮',
        steps: [
            { id: '1', instruction: 'Bürste nehmen', emoji: '🪮', animationType: 'emoji-slide' },
            { id: '2', instruction: 'Vorsichtig kämmen', emoji: '🧒', animationType: 'emoji-shake' }
        ]
    },
    {
        id: 'wash-face',
        categoryId: 'hygiene',
        title: 'Gesicht waschen',
        emoji: '🧒',
        steps: [
            { id: '1', instruction: 'Wasser ins Gesicht spritzen', emoji: '💦', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Sanft abtrocknen', emoji: '🧺', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'dry-hands',
        categoryId: 'hygiene',
        title: 'Hände abtrocknen',
        emoji: '🧺',
        steps: [
            { id: '1', instruction: 'Handtuch nehmen', emoji: '🧺', animationType: 'emoji-slide' },
            { id: '2', instruction: 'Hände gut abreiben', emoji: '🙌', animationType: 'emoji-shake' }
        ]
    },
    {
        id: 'sunscreen',
        categoryId: 'hygiene',
        title: 'Sonnencreme',
        emoji: '☀️',
        steps: [
            { id: '1', instruction: 'Creme auf die Haut geben', emoji: '🧴', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Gleichmäßig verreiben', emoji: '✨', animationType: 'emoji-shake' }
        ]
    },
    {
        id: 'lip-balm',
        categoryId: 'hygiene',
        title: 'Lippenpflege',
        emoji: '💄',
        steps: [
            { id: '1', instruction: 'Stift aufdrehen', emoji: '💄', animationType: 'emoji-rotate' },
            { id: '2', instruction: 'Auf die Lippen auftragen', emoji: '👄', animationType: 'emoji-shake' }
        ]
    },
    {
        id: 'clean-ears',
        categoryId: 'hygiene',
        title: 'Ohren putzen',
        emoji: '👂',
        steps: [
            { id: '1', instruction: 'Mit dem Tuch vorsichtig reinigen', emoji: '🧺', animationType: 'emoji-shake' },
            { id: '2', instruction: 'Nur außen wischen', emoji: '👂', animationType: 'emoji-bounce' }
        ]
    },

    // --- DRESSING ---
    {
        id: 'put-on-pajamas',
        categoryId: 'dressing',
        title: 'Schlafanzug anziehen',
        emoji: '🌙',
        steps: [
            { id: '1', instruction: 'Alte Kleidung ausziehen', emoji: '👕', animationType: 'emoji-slide' },
            { id: '2', instruction: 'Schlafanzugoberteil anziehen', emoji: '🛌', animationType: 'emoji-bounce' },
            { id: '3', instruction: 'Schlafanzughose anziehen', emoji: '👖', animationType: 'emoji-bounce' }
        ]
    },
    {
        id: 'put-on-socks',
        categoryId: 'dressing',
        title: 'Socken anziehen',
        emoji: '🧦',
        steps: [
            { id: '1', instruction: 'Socke aufrollen', emoji: '🧦', animationType: 'emoji-rotate' },
            { id: '2', instruction: 'Über den Fuß ziehen', emoji: '🦶', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'put-on-shoes',
        categoryId: 'dressing',
        title: 'Schuhe anziehen',
        emoji: '👟',
        steps: [
            { id: '1', instruction: 'Fuß in den Schuh stecken', emoji: '👞', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Ferse festdrücken', emoji: '🔨', animationType: 'emoji-shake' }
        ]
    },
    {
        id: 'zip-jacket',
        categoryId: 'dressing',
        title: 'Jacke zuziehen',
        emoji: '🧥',
        steps: [
            { id: '1', instruction: 'Zipper unten einfädeln', emoji: '🔗', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Nach oben ziehen', emoji: '⬆️', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'button-shirt',
        categoryId: 'dressing',
        title: 'Knöpfe zumachen',
        emoji: '👔',
        steps: [
            { id: '1', instruction: 'Knopf durch das Loch schieben', emoji: '🔘', animationType: 'emoji-shake' },
            { id: '2', instruction: 'Nächsten Knopf suchen', emoji: '👀', animationType: 'emoji-bounce' }
        ]
    },
    {
        id: 'put-on-hat',
        categoryId: 'dressing',
        title: 'Mütze aufsetzen',
        emoji: '🧢',
        steps: [
            { id: '1', instruction: 'Mütze über den Kopf ziehen', emoji: '🧢', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Ohren verstecken', emoji: '👂', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'put-on-gloves',
        categoryId: 'dressing',
        title: 'Handschuhe anziehen',
        emoji: '🧤',
        steps: [
            { id: '1', instruction: 'Jeden Finger in sein Haus bringen', emoji: '🖐️', animationType: 'emoji-shake' },
            { id: '2', instruction: 'Festziehen', emoji: '🧤', animationType: 'emoji-bounce' }
        ]
    },
    {
        id: 'take-off-shoes',
        categoryId: 'dressing',
        title: 'Schuhe ausziehen',
        emoji: '👞',
        steps: [
            { id: '1', instruction: 'Verschluss öffnen', emoji: '🔓', animationType: 'emoji-rotate' },
            { id: '2', instruction: 'Mit der Ferse rausdrücken', emoji: '🦶', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'put-on-mask',
        categoryId: 'dressing',
        title: 'Maske aufsetzen',
        emoji: '😷',
        steps: [
            { id: '1', instruction: 'Gummis hinter die Ohren', emoji: '👂', animationType: 'emoji-shake' },
            { id: '2', instruction: 'Über die Nase ziehen', emoji: '👃', animationType: 'emoji-bounce' }
        ]
    },
    {
        id: 'put-on-glasses',
        categoryId: 'dressing',
        title: 'Brille aufsetzen',
        emoji: '👓',
        steps: [
            { id: '1', instruction: 'Bügel aufklappen', emoji: '👓', animationType: 'emoji-rotate' },
            { id: '2', instruction: 'Vorsichtig auf die Nase setzen', emoji: '👃', animationType: 'emoji-slide' }
        ]
    },

    // --- EATING ---
    {
        id: 'set-table',
        categoryId: 'eating',
        title: 'Tisch decken',
        emoji: '🍽️',
        steps: [
            { id: '1', instruction: 'Teller aufstellen', emoji: '🍽️', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Besteck daneben legen', emoji: '🍴', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'pour-water',
        categoryId: 'eating',
        title: 'Wasser einschenken',
        emoji: '🫗',
        steps: [
            { id: '1', instruction: 'Flasche gut festhalten', emoji: '🍾', animationType: 'emoji-shake' },
            { id: '2', instruction: 'Vorsichtig ins Glas gießen', emoji: '🥛', animationType: 'emoji-bounce' }
        ]
    },
    {
        id: 'use-spoon',
        categoryId: 'eating',
        title: 'Mit dem Löffel essen',
        emoji: '🥄',
        steps: [
            { id: '1', instruction: 'Suppe schöpfen', emoji: '🥣', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Vorsichtig zum Mund führen', emoji: '👄', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'use-fork',
        categoryId: 'eating',
        title: 'Mit der Gabel essen',
        emoji: '🍴',
        steps: [
            { id: '1', instruction: 'Essen aufspießen', emoji: '🥩', animationType: 'emoji-shake' },
            { id: '2', instruction: 'Zum Mund führen', emoji: '👄', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'open-snack',
        categoryId: 'eating',
        title: 'Snack öffnen',
        emoji: '🥨',
        steps: [
            { id: '1', instruction: 'Tüte an der Kerbe festhalten', emoji: '🤏', animationType: 'emoji-shake' },
            { id: '2', instruction: 'Kräftig auseinander ziehen', emoji: '💥', animationType: 'emoji-bounce' }
        ]
    },
    {
        id: 'clear-table',
        categoryId: 'eating',
        title: 'Tisch abräumen',
        emoji: '🧹',
        steps: [
            { id: '1', instruction: 'Geschirr stapeln', emoji: '🍽️', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'In die Küche tragen', emoji: '🚶', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'dishwasher',
        categoryId: 'eating',
        title: 'Spülmaschine einräumen',
        emoji: '🧼',
        steps: [
            { id: '1', instruction: 'Reste in den Müll', emoji: '🗑️', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'In das Fach einsortieren', emoji: '🍽️', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'use-napkin',
        categoryId: 'eating',
        title: 'Serviette benutzen',
        emoji: '🧻',
        steps: [
            { id: '1', instruction: 'Mund sanft abtupfen', emoji: '👄', animationType: 'emoji-shake' },
            { id: '2', instruction: 'Serviette zusammenfalten', emoji: '📄', animationType: 'emoji-rotate' }
        ]
    },

    // --- BATHROOM ---
    {
        id: 'use-toilet',
        categoryId: 'bathroom',
        title: 'Toilette benutzen',
        emoji: '🚽',
        steps: [
            { id: '1', instruction: 'Hose runterziehen', emoji: '👖', animationType: 'emoji-slide' },
            { id: '2', instruction: 'Sich hinsetzen', emoji: '🧘', animationType: 'emoji-bounce' }
        ]
    },
    {
        id: 'flush-toilet',
        categoryId: 'bathroom',
        title: 'Spülen',
        emoji: '🌊',
        steps: [
            { id: '1', instruction: 'Knopf drücken', emoji: '🔘', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Warten, bis alles weg ist', emoji: '🌊', animationType: 'emoji-rotate' }
        ]
    },
    {
        id: 'wipe-properly',
        categoryId: 'bathroom',
        title: 'Sauber wischen',
        emoji: '🧻',
        steps: [
            { id: '1', instruction: 'Toilettenpapier falten', emoji: '📄', animationType: 'emoji-rotate' },
            { id: '2', instruction: 'Vorsichtig wischen', emoji: '✨', animationType: 'emoji-shake' }
        ]
    },
    {
        id: 'bathroom-door',
        categoryId: 'bathroom',
        title: 'Tür schließen',
        emoji: '🚪',
        steps: [
            { id: '1', instruction: 'Klinke nach unten drücken', emoji: '⬇️', animationType: 'emoji-slide' },
            { id: '2', instruction: 'Leise zumachen', emoji: '🤫', animationType: 'emoji-bounce' }
        ]
    },
    {
        id: 'faucet-off',
        categoryId: 'bathroom',
        title: 'Wasser abdrehen',
        emoji: '💧',
        steps: [
            { id: '1', instruction: 'Hahn fest zudrehen', emoji: '🔧', animationType: 'emoji-rotate' },
            { id: '2', instruction: 'Kontrollieren, ob es noch tropft', emoji: '👀', animationType: 'emoji-bounce' }
        ]
    },

    // --- BEDROOM ---
    {
        id: 'make-bed',
        categoryId: 'bedroom',
        title: 'Bett machen',
        emoji: '🛌',
        steps: [
            { id: '1', instruction: 'Decke glatt ziehen', emoji: '🛌', animationType: 'emoji-slide' },
            { id: '2', instruction: 'Kissen aufschütteln', emoji: '☁️', animationType: 'emoji-shake' }
        ]
    },
    {
        id: 'turn-off-light',
        categoryId: 'bedroom',
        title: 'Licht ausschalten',
        emoji: '💡',
        steps: [
            { id: '1', instruction: 'Schalter finden', emoji: '👇', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Drücken: Es wird dunkel!', emoji: '🌙', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'clothes-hamper',
        categoryId: 'bedroom',
        title: 'Wäschekorb',
        emoji: '🧺',
        steps: [
            { id: '1', instruction: 'Dreckige Kleidung sammeln', emoji: '👕', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'In den Korb werfen', emoji: '🧺', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'pick-up-toys',
        categoryId: 'bedroom',
        title: 'Spielzeug aufräumen',
        emoji: '🧸',
        steps: [
            { id: '1', instruction: 'Alles vom Boden aufheben', emoji: '🧱', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'In die Kiste legen', emoji: '📦', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'get-into-bed',
        categoryId: 'bedroom',
        title: 'Ins Bett kuscheln',
        emoji: '😴',
        steps: [
            { id: '1', instruction: 'Unter die Decke krabbeln', emoji: '🛌', animationType: 'emoji-slide' },
            { id: '2', instruction: 'Augen zu machen', emoji: '😌', animationType: 'emoji-bounce' }
        ]
    },

    // --- SCHOOL ---
    {
        id: 'pack-bag',
        categoryId: 'school',
        title: 'Rucksack packen',
        emoji: '🎒',
        steps: [
            { id: '1', instruction: 'Bücher und Hefte rein', emoji: '📚', animationType: 'emoji-slide' },
            { id: '2', instruction: 'Reißverschluss zu', emoji: '🤐', animationType: 'emoji-shake' }
        ]
    },
    {
        id: 'sharpen-pencil',
        categoryId: 'school',
        title: 'Stift anspitzen',
        emoji: '✏️',
        steps: [
            { id: '1', instruction: 'Stift in den Spitzer stecken', emoji: '✏️', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Drehen, drehen, drehen', emoji: '🌀', animationType: 'emoji-rotate' }
        ]
    },
    {
        id: 'open-book',
        categoryId: 'school',
        title: 'Buch aufschlagen',
        emoji: '📖',
        steps: [
            { id: '1', instruction: 'Die richtige Seite suchen', emoji: '👀', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Vorsichtig aufklappen', emoji: '📖', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'sit-at-desk',
        categoryId: 'school',
        title: 'Richtig sitzen',
        emoji: '🪑',
        steps: [
            { id: '1', instruction: 'Stuhl heranziehen', emoji: '🪑', animationType: 'emoji-slide' },
            { id: '2', instruction: 'Rücken gerade machen', emoji: '🧍', animationType: 'emoji-bounce' }
        ]
    },
    {
        id: 'pencil-case',
        categoryId: 'school',
        title: 'Mäppchen aufräumen',
        emoji: '🖊️',
        steps: [
            { id: '1', instruction: 'Stifte einsammeln', emoji: '🖍️', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Alle in die Schlaufen stecken', emoji: '✨', animationType: 'emoji-slide' }
        ]
    },

    // --- SAFETY & SOCIAL ---
    {
        id: 'red-light',
        categoryId: 'safety',
        title: 'Rote Ampel',
        emoji: '🛑',
        steps: [
            { id: '1', instruction: 'Stehen bleiben!', emoji: '🛑', animationType: 'emoji-shake' },
            { id: '2', instruction: 'Warten, bis es grün wird', emoji: '🚥', animationType: 'emoji-rotate' }
        ]
    },
    {
        id: 'cross-street',
        categoryId: 'safety',
        title: 'Straße überqueren',
        emoji: '🚶',
        steps: [
            { id: '1', instruction: 'Links und Rechts schauen', emoji: '👀', animationType: 'emoji-shake' },
            { id: '2', instruction: 'Zügig rübergehen', emoji: '🚶', animationType: 'emoji-slide' }
        ]
    },
    {
        id: 'wave-hello',
        categoryId: 'safety',
        title: 'Hallo sagen',
        emoji: '👋',
        steps: [
            { id: '1', instruction: 'Hand heben', emoji: '✋', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Freundlich winken', emoji: '👋', animationType: 'emoji-shake' }
        ]
    },
    {
        id: 'ask-help',
        categoryId: 'safety',
        title: 'Um Hilfe bitten',
        emoji: '🙋',
        steps: [
            { id: '1', instruction: 'Hand heben', emoji: '🙋', animationType: 'emoji-bounce' },
            { id: '2', instruction: '„Kannst du mir helfen?“ fragen', emoji: '❓', animationType: 'emoji-shake' }
        ]
    },
    {
        id: 'seatbelt',
        categoryId: 'safety',
        title: 'Anschnallen',
        emoji: '🏎️',
        steps: [
            { id: '1', instruction: 'Gurt ziehen', emoji: '🎗️', animationType: 'emoji-slide' },
            { id: '2', instruction: '„Klick“ machen', emoji: '🔒', animationType: 'emoji-bounce' }
        ]
    },
    {
        id: 'wait-line',
        categoryId: 'safety',
        title: 'Warten in der Schlange',
        emoji: '🚶',
        steps: [
            { id: '1', instruction: 'Hinter den Anderen anstellen', emoji: '🧍', animationType: 'emoji-bounce' },
            { id: '2', instruction: 'Geduldig sein', emoji: '⏳', animationType: 'emoji-rotate' }
        ]
    },
    {
        id: 'share-toy',
        categoryId: 'safety',
        title: 'Spielzeug teilen',
        emoji: '🎁',
        steps: [
            { id: '1', instruction: 'Eins abgeben', emoji: '🧸', animationType: 'emoji-slide' },
            { id: '2', instruction: 'Zusammen spielen macht Spaß!', emoji: '😃', animationType: 'emoji-bounce' }
        ]
    }
];
