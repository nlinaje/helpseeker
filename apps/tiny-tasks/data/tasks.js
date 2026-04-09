export const CATEGORIES = [
    {
        id: 'hygiene',
        name: 'Hygiene',
        emoji: '🚿',
        color: '#3b82f6',
        tasks: ['blow-nose', 'brush-teeth']
    },
    {
        id: 'dressing',
        name: 'Anziehen',
        emoji: '👕',
        color: '#10b981',
        tasks: ['put-on-pajamas']
    }
];

export const TASKS = [
    {
        id: 'blow-nose',
        categoryId: 'hygiene',
        title: 'Nase putzen',
        emoji: '🤧',
        steps: [
            {
                id: 'step-1',
                instruction: 'Nimm ein Taschentuch.',
                animationType: 'emoji-bounce',
                emoji: '🧻'
            },
            {
                id: 'step-2',
                instruction: 'Halte es an die Nase.',
                animationType: 'emoji-fade',
                emoji: '👃'
            },
            {
                id: 'step-3',
                instruction: 'Drücke mit dem Daumen und dem Zeigefinger leicht zusammen.',
                animationType: 'emoji-pinch',
                emoji: '🤏'
            },
            {
                id: 'step-4',
                instruction: 'Puste kräftig durch die Nase, damit der Schleim im Tuch bleibt!',
                animationType: 'custom-blow',
                emoji: '💨'
            }
        ]
    },
    {
        id: 'brush-teeth',
        categoryId: 'hygiene',
        title: 'Zähne putzen',
        emoji: '🦷',
        steps: [
            { id: '1', instruction: 'Zahnbürste nass machen', emoji: '🪥' },
            { id: '2', instruction: 'Zahnpasta draufgeben', emoji: '🧴' },
            { id: '3', instruction: 'Zähne putzen', emoji: '👄' }
        ]
    },
    {
        id: 'put-on-pajamas',
        categoryId: 'dressing',
        title: 'Schlafanzug anziehen',
        emoji: '🌙',
        steps: [
            { id: '1', instruction: 'Alte Kleidung ausziehen', emoji: '👕' },
            { id: '2', instruction: 'Schlafanzugoberteil anziehen', emoji: '🛌' },
            { id: '3', instruction: 'Schlafanzughose anziehen', emoji: '👖' }
        ]
    }
];
