// ── Name pool ────────────────────────────────────────────────────
const NAMES = ['Anna', 'Ben', 'Clara', 'David', 'Emma', 'Felix', 'Greta', 'Hannah', 'Ivan', 'Jana',
               'Klara', 'Leon', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rosa', 'Sam', 'Tina']

// ── Division: pre-enumerate valid (a, b) pairs where a%b==0 ─────
// Both a, b in 1–9; b >= 2; a > b (so result >= 2)
function buildDivPairs() {
    const pairs = []
    for (let b = 2; b <= 9; b++) {
        for (let a = b * 2; a <= 9; a++) {
            if (a % b === 0) pairs.push([a, b])
        }
    }
    return pairs.length > 0 ? pairs : [[4, 2], [6, 2], [6, 3], [8, 2], [8, 4], [9, 3]]
}

const DIV_PAIRS = buildDivPairs()

// ── Templates ────────────────────────────────────────────────────
// Placeholders: {{name}}, {{a}}, {{b}}
// Numbers a, b and result are generated at runtime by generateExercise()
export const TEMPLATES = [

    // ══════════════════════════════════════════════════════════════
    // ADD (25 templates)
    // ══════════════════════════════════════════════════════════════
    {
        id: 'add-01',
        operation: 'add',
        emoji: '🍎',
        story: '{{name}} hat {{a}} Äpfel und bekommt {{b}} weitere geschenkt. Wie viele Äpfel hat {{name}} jetzt?',
        divPairs: null,
    },
    {
        id: 'add-02',
        operation: 'add',
        emoji: '🍬',
        story: '{{name}} hat {{a}} Bonbons in der Tasche. Oma gibt {{name}} noch {{b}} Bonbons dazu. Wie viele Bonbons hat {{name}} jetzt?',
        divPairs: null,
    },
    {
        id: 'add-03',
        operation: 'add',
        emoji: '⭐',
        story: '{{name}} hat heute {{a}} Sterne gesammelt und morgen noch {{b}} weitere. Wie viele Sterne hat {{name}} zusammen?',
        divPairs: null,
    },
    {
        id: 'add-04',
        operation: 'add',
        emoji: '📚',
        story: '{{name}} hat {{a}} Bücher gelesen. Zum Geburtstag bekommt {{name}} {{b}} neue Bücher. Wie viele Bücher hat {{name}} nun?',
        divPairs: null,
    },
    {
        id: 'add-05',
        operation: 'add',
        emoji: '🌸',
        story: '{{name}} hat im Garten {{a}} Blumen gepflückt und dann noch {{b}} weitere. Wie viele Blumen hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'add-06',
        operation: 'add',
        emoji: '🔵',
        story: '{{name}} hat {{a}} blaue Murmeln. Ein Freund gibt {{name}} noch {{b}} Murmeln dazu. Wie viele Murmeln hat {{name}} jetzt?',
        divPairs: null,
    },
    {
        id: 'add-07',
        operation: 'add',
        emoji: '🪙',
        story: '{{name}} findet auf dem Boden {{a}} Münzen und später noch {{b}} weitere. Wie viele Münzen hat {{name}} gefunden?',
        divPairs: null,
    },
    {
        id: 'add-08',
        operation: 'add',
        emoji: '🐦',
        story: 'Auf einem Ast sitzen {{a}} Vögel. Dann kommen {{b}} weitere dazu. Wie viele Vögel sitzen jetzt auf dem Ast?',
        divPairs: null,
    },
    {
        id: 'add-09',
        operation: 'add',
        emoji: '🐟',
        story: '{{name}} hat {{a}} Fische im Aquarium. Dann kauft {{name}} noch {{b}} neue Fische. Wie viele Fische sind es jetzt?',
        divPairs: null,
    },
    {
        id: 'add-10',
        operation: 'add',
        emoji: '🎨',
        story: '{{name}} hat {{a}} Buntstifte. Zum Basteln bekommt {{name}} von der Lehrerin {{b}} weitere. Wie viele Buntstifte hat {{name}} jetzt?',
        divPairs: null,
    },
    {
        id: 'add-11',
        operation: 'add',
        emoji: '🚗',
        story: '{{name}} hat {{a}} Spielzeugautos. Papa kauft {{name}} noch {{b}} weitere. Wie viele Autos hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'add-12',
        operation: 'add',
        emoji: '🍒',
        story: '{{name}} pflückt am Montag {{a}} Kirschen und am Dienstag {{b}} Kirschen. Wie viele Kirschen hat {{name}} zusammen?',
        divPairs: null,
    },
    {
        id: 'add-13',
        operation: 'add',
        emoji: '🥕',
        story: '{{name}} hat {{a}} Karotten geerntet. Dann findet {{name}} noch {{b}} weitere im Beet. Wie viele Karotten hat {{name}} jetzt?',
        divPairs: null,
    },
    {
        id: 'add-14',
        operation: 'add',
        emoji: '🦋',
        story: 'Auf der Wiese flattern {{a}} Schmetterlinge. Es kommen {{b}} weitere dazu. Wie viele Schmetterlinge sind es jetzt?',
        divPairs: null,
    },
    {
        id: 'add-15',
        operation: 'add',
        emoji: '📎',
        story: '{{name}} hat {{a}} Aufkleber im Album. Im Tausch bekommt {{name}} {{b}} neue dazu. Wie viele Aufkleber hat {{name}} jetzt?',
        divPairs: null,
    },
    {
        id: 'add-16',
        operation: 'add',
        emoji: '🥚',
        story: 'Im Nest liegen {{a}} Eier. Die Henne legt noch {{b}} weitere. Wie viele Eier liegen jetzt im Nest?',
        divPairs: null,
    },
    {
        id: 'add-17',
        operation: 'add',
        emoji: '🍩',
        story: '{{name}} backt {{a}} Donuts. Dann backt {{name}} noch {{b}} weitere. Wie viele Donuts hat {{name}} gebacken?',
        divPairs: null,
    },
    {
        id: 'add-18',
        operation: 'add',
        emoji: '🏆',
        story: '{{name}} hat beim Wettbewerb {{a}} Punkte. In der nächsten Runde holt {{name}} noch {{b}} weitere. Wie viele Punkte hat {{name}} jetzt?',
        divPairs: null,
    },
    {
        id: 'add-19',
        operation: 'add',
        emoji: '🐌',
        story: '{{name}} sieht im Garten {{a}} Schnecken. Dann entdeckt {{name}} noch {{b}} weitere unter einem Stein. Wie viele Schnecken hat {{name}} gezählt?',
        divPairs: null,
    },
    {
        id: 'add-20',
        operation: 'add',
        emoji: '🧩',
        story: '{{name}} hat {{a}} Puzzleteile gefunden. Dann findet {{name}} noch {{b}} weitere unter dem Tisch. Wie viele Teile hat {{name}} jetzt?',
        divPairs: null,
    },
    {
        id: 'add-21',
        operation: 'add',
        emoji: '🍓',
        story: '{{name}} hat {{a}} Erdbeeren gepflückt. Mama bringt noch {{b}} weitere mit. Wie viele Erdbeeren sind es insgesamt?',
        divPairs: null,
    },
    {
        id: 'add-22',
        operation: 'add',
        emoji: '🎈',
        story: '{{name}} hat {{a}} Luftballons. Auf der Party bekommt {{name}} noch {{b}} dazu. Wie viele Luftballons hat {{name}} jetzt?',
        divPairs: null,
    },
    {
        id: 'add-23',
        operation: 'add',
        emoji: '🐸',
        story: 'Im Teich sitzen {{a}} Frösche auf einem Stein. Es hüpfen {{b}} weitere dazu. Wie viele Frösche sitzen jetzt auf dem Stein?',
        divPairs: null,
    },
    {
        id: 'add-24',
        operation: 'add',
        emoji: '🌈',
        story: '{{name}} hat {{a}} Zeichnungen an der Wand. Heute macht {{name}} noch {{b}} neue. Wie viele Zeichnungen hängen jetzt an der Wand?',
        divPairs: null,
    },
    {
        id: 'add-25',
        operation: 'add',
        emoji: '🍌',
        story: '{{name}} hat {{a}} Bananen im Korb. Papa legt noch {{b}} weitere dazu. Wie viele Bananen sind im Korb?',
        divPairs: null,
    },

    // ══════════════════════════════════════════════════════════════
    // SUBTRACT (25 templates)
    // ══════════════════════════════════════════════════════════════
    {
        id: 'sub-01',
        operation: 'subtract',
        emoji: '🍬',
        story: '{{name}} hat {{a}} Bonbons und gibt {{b}} davon an einen Freund ab. Wie viele Bonbons hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-02',
        operation: 'subtract',
        emoji: '🍎',
        story: '{{name}} hat {{a}} Äpfel im Korb. {{name}} isst {{b}} davon auf. Wie viele Äpfel sind noch im Korb?',
        divPairs: null,
    },
    {
        id: 'sub-03',
        operation: 'subtract',
        emoji: '🍪',
        story: '{{name}} hat {{a}} Kekse gebacken und verschenkt {{b}} davon. Wie viele Kekse hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-04',
        operation: 'subtract',
        emoji: '🎨',
        story: '{{name}} hat {{a}} Buntstifte. {{name}} verliert {{b}} davon auf dem Schulweg. Wie viele Buntstifte hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-05',
        operation: 'subtract',
        emoji: '📚',
        story: '{{name}} hat {{a}} Bücher. {{name}} leiht {{b}} davon an einen Freund aus. Wie viele Bücher hat {{name}} noch zu Hause?',
        divPairs: null,
    },
    {
        id: 'sub-06',
        operation: 'subtract',
        emoji: '🌸',
        story: '{{name}} hat {{a}} Blumen. {{name}} schenkt Mama {{b}} davon. Wie viele Blumen hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-07',
        operation: 'subtract',
        emoji: '🔵',
        story: '{{name}} hat {{a}} Murmeln. Beim Spielen verliert {{name}} {{b}} davon. Wie viele Murmeln hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-08',
        operation: 'subtract',
        emoji: '🪙',
        story: '{{name}} hat {{a}} Münzen. {{name}} kauft sich ein Eis und gibt {{b}} Münzen aus. Wie viele Münzen hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-09',
        operation: 'subtract',
        emoji: '🥚',
        story: '{{name}} hat {{a}} Eier. {{name}} verwendet {{b}} davon zum Backen. Wie viele Eier sind noch übrig?',
        divPairs: null,
    },
    {
        id: 'sub-10',
        operation: 'subtract',
        emoji: '🐦',
        story: 'Auf einem Ast sitzen {{a}} Vögel. {{b}} davon fliegen weg. Wie viele Vögel sitzen noch auf dem Ast?',
        divPairs: null,
    },
    {
        id: 'sub-11',
        operation: 'subtract',
        emoji: '🚗',
        story: '{{name}} hat {{a}} Spielzeugautos. {{name}} verschenkt {{b}} davon. Wie viele Autos hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-12',
        operation: 'subtract',
        emoji: '🍒',
        story: '{{name}} hat {{a}} Kirschen im Schälchen. {{name}} isst {{b}} davon. Wie viele Kirschen sind noch übrig?',
        divPairs: null,
    },
    {
        id: 'sub-13',
        operation: 'subtract',
        emoji: '🦋',
        story: 'Auf der Wiese sitzen {{a}} Schmetterlinge. {{b}} davon fliegen weg. Wie viele Schmetterlinge sind noch auf der Wiese?',
        divPairs: null,
    },
    {
        id: 'sub-14',
        operation: 'subtract',
        emoji: '🎈',
        story: '{{name}} hat {{a}} Luftballons. {{b}} davon platzen. Wie viele Luftballons hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-15',
        operation: 'subtract',
        emoji: '📎',
        story: '{{name}} hat {{a}} Aufkleber. {{name}} klebt {{b}} davon ins Heft. Wie viele Aufkleber hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-16',
        operation: 'subtract',
        emoji: '🍓',
        story: '{{name}} hat {{a}} Erdbeeren gepflückt. {{name}} isst {{b}} davon sofort auf. Wie viele Erdbeeren sind noch übrig?',
        divPairs: null,
    },
    {
        id: 'sub-17',
        operation: 'subtract',
        emoji: '🧩',
        story: '{{name}} hat {{a}} Puzzleteile auf dem Tisch. {{name}} legt {{b}} davon beiseite. Wie viele Puzzleteile liegen noch auf dem Tisch?',
        divPairs: null,
    },
    {
        id: 'sub-18',
        operation: 'subtract',
        emoji: '🥕',
        story: '{{name}} hat {{a}} Karotten. {{name}} gibt {{b}} davon dem Hasen. Wie viele Karotten hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-19',
        operation: 'subtract',
        emoji: '🍩',
        story: '{{name}} hat {{a}} Donuts gebacken. Die Familie isst {{b}} davon. Wie viele Donuts sind noch übrig?',
        divPairs: null,
    },
    {
        id: 'sub-20',
        operation: 'subtract',
        emoji: '🐟',
        story: '{{name}} hat {{a}} Fische im Teich. {{b}} davon schwimmen in einen anderen Teich. Wie viele Fische sind noch übrig?',
        divPairs: null,
    },
    {
        id: 'sub-21',
        operation: 'subtract',
        emoji: '🌟',
        story: '{{name}} hat beim Spiel {{a}} Sterne gesammelt. Dann verliert {{name}} {{b}} davon wieder. Wie viele Sterne hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-22',
        operation: 'subtract',
        emoji: '🍌',
        story: '{{name}} hat {{a}} Bananen. {{name}} isst {{b}} davon zum Frühstück. Wie viele Bananen sind noch da?',
        divPairs: null,
    },
    {
        id: 'sub-23',
        operation: 'subtract',
        emoji: '🐸',
        story: '{{a}} Frösche sitzen auf einem Stein. {{b}} davon hüpfen ins Wasser. Wie viele Frösche sitzen noch auf dem Stein?',
        divPairs: null,
    },
    {
        id: 'sub-24',
        operation: 'subtract',
        emoji: '🏆',
        story: '{{name}} hat {{a}} Punkte. {{name}} macht {{b}} Fehler und verliert diese Punkte. Wie viele Punkte hat {{name}} noch?',
        divPairs: null,
    },
    {
        id: 'sub-25',
        operation: 'subtract',
        emoji: '🐌',
        story: '{{name}} zählt {{a}} Schnecken im Garten. Dann verschwinden {{b}} davon im Gras. Wie viele Schnecken sieht {{name}} noch?',
        divPairs: null,
    },

    // ══════════════════════════════════════════════════════════════
    // MULTIPLY (25 templates)
    // ══════════════════════════════════════════════════════════════
    {
        id: 'mul-01',
        operation: 'multiply',
        emoji: '🌟',
        story: '{{name}} hat {{a}} Tüten. In jeder Tüte stecken {{b}} Sterne. Wie viele Sterne hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-02',
        operation: 'multiply',
        emoji: '🍪',
        story: '{{name}} hat {{a}} Schachteln. In jeder Schachtel liegen {{b}} Kekse. Wie viele Kekse sind das insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-03',
        operation: 'multiply',
        emoji: '🍎',
        story: '{{name}} hat {{a}} Körbe. In jedem Korb liegen {{b}} Äpfel. Wie viele Äpfel sind das zusammen?',
        divPairs: null,
    },
    {
        id: 'mul-04',
        operation: 'multiply',
        emoji: '🌸',
        story: '{{name}} pflanzt {{a}} Reihen Blumen. In jede Reihe kommen {{b}} Blumen. Wie viele Blumen pflanzt {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-05',
        operation: 'multiply',
        emoji: '📚',
        story: '{{name}} hat {{a}} Regale. In jedes Regal passen {{b}} Bücher. Wie viele Bücher passen insgesamt in die Regale?',
        divPairs: null,
    },
    {
        id: 'mul-06',
        operation: 'multiply',
        emoji: '🪙',
        story: '{{name}} hat {{a}} Sparschweine. In jedem Sparschwein sind {{b}} Münzen. Wie viele Münzen hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-07',
        operation: 'multiply',
        emoji: '🥚',
        story: '{{name}} hat {{a}} Schachteln Eier. In jeder Schachtel liegen {{b}} Eier. Wie viele Eier hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-08',
        operation: 'multiply',
        emoji: '🍬',
        story: '{{name}} kauft {{a}} Pakete Bonbons. In jedem Paket sind {{b}} Bonbons. Wie viele Bonbons hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-09',
        operation: 'multiply',
        emoji: '🚗',
        story: '{{name}} hat {{a}} Kisten mit Spielzeugautos. In jeder Kiste sind {{b}} Autos. Wie viele Autos hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-10',
        operation: 'multiply',
        emoji: '🍒',
        story: '{{name}} füllt {{a}} Teller mit Kirschen. Auf jeden Teller kommen {{b}} Kirschen. Wie viele Kirschen sind das insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-11',
        operation: 'multiply',
        emoji: '🎨',
        story: '{{name}} hat {{a}} Mäppchen. In jedem Mäppchen liegen {{b}} Buntstifte. Wie viele Buntstifte hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-12',
        operation: 'multiply',
        emoji: '🔵',
        story: '{{name}} hat {{a}} Säcke mit Murmeln. In jedem Sack sind {{b}} Murmeln. Wie viele Murmeln hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-13',
        operation: 'multiply',
        emoji: '🐟',
        story: '{{name}} hat {{a}} Aquarien. In jedem Aquarium schwimmen {{b}} Fische. Wie viele Fische hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-14',
        operation: 'multiply',
        emoji: '🥕',
        story: '{{name}} hat {{a}} Körbe mit Karotten. In jedem Korb liegen {{b}} Karotten. Wie viele Karotten sind das insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-15',
        operation: 'multiply',
        emoji: '🍓',
        story: '{{name}} füllt {{a}} Schüsseln mit Erdbeeren. In jede Schüssel kommen {{b}} Erdbeeren. Wie viele Erdbeeren sind das insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-16',
        operation: 'multiply',
        emoji: '🎈',
        story: '{{name}} dekoriert {{a}} Tische mit Luftballons. An jeden Tisch kommen {{b}} Luftballons. Wie viele Luftballons braucht {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-17',
        operation: 'multiply',
        emoji: '🦋',
        story: '{{name}} zeichnet {{a}} Blumen. Auf jede Blume malt {{name}} {{b}} Schmetterlinge. Wie viele Schmetterlinge hat {{name}} insgesamt gemalt?',
        divPairs: null,
    },
    {
        id: 'mul-18',
        operation: 'multiply',
        emoji: '🍩',
        story: '{{name}} backt {{a}} Bleche Donuts. Auf jedes Blech passen {{b}} Donuts. Wie viele Donuts backt {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-19',
        operation: 'multiply',
        emoji: '📎',
        story: '{{name}} hat {{a}} Seiten im Heft. Auf jede Seite klebt {{name}} {{b}} Aufkleber. Wie viele Aufkleber braucht {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-20',
        operation: 'multiply',
        emoji: '🍌',
        story: '{{name}} kauft {{a}} Hände Bananen. An jeder Staude hängen {{b}} Bananen. Wie viele Bananen kauft {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-21',
        operation: 'multiply',
        emoji: '🧩',
        story: '{{name}} hat {{a}} Puzzles. Jedes Puzzle besteht aus {{b}} großen Teilen. Wie viele Teile hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-22',
        operation: 'multiply',
        emoji: '🐌',
        story: '{{name}} zählt {{a}} Blätter. Auf jedem Blatt sitzen {{b}} Schnecken. Wie viele Schnecken findet {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-23',
        operation: 'multiply',
        emoji: '🏆',
        story: '{{name}} gewinnt in {{a}} Runden jeweils {{b}} Punkte. Wie viele Punkte hat {{name}} insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-24',
        operation: 'multiply',
        emoji: '🐸',
        story: '{{name}} hat {{a}} Teiche. In jedem Teich leben {{b}} Frösche. Wie viele Frösche sind das insgesamt?',
        divPairs: null,
    },
    {
        id: 'mul-25',
        operation: 'multiply',
        emoji: '🌈',
        story: '{{name}} malt {{a}} Bilder. Jedes Bild hat {{b}} verschiedene Farben. Wie viele Farben benutzt {{name}} insgesamt?',
        divPairs: null,
    },

    // ══════════════════════════════════════════════════════════════
    // DIVIDE (25 templates)
    // groupLabel:       shown in animation box headers (e.g. "Freund 1")
    // groupResultPrefix: used in result sentence "X bekommt N emoji"
    // ══════════════════════════════════════════════════════════════
    {
        id: 'div-01',
        operation: 'divide',
        emoji: '🍪',
        story: '{{name}} hat {{a}} Kekse und möchte sie gleichmäßig auf {{b}} Freunde verteilen. Wie viele Kekse bekommt jeder Freund?',
        groupLabel: 'Freund',
        groupResultPrefix: 'Jeder Freund',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-02',
        operation: 'divide',
        emoji: '🍎',
        story: '{{name}} hat {{a}} Äpfel und legt sie gleichmäßig in {{b}} Körbe. Wie viele Äpfel liegen in jedem Korb?',
        groupLabel: 'Korb',
        groupResultPrefix: 'Jeder Korb',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-03',
        operation: 'divide',
        emoji: '🍬',
        story: '{{name}} hat {{a}} Bonbons und teilt sie gerecht unter {{b}} Geschwister auf. Wie viele Bonbons bekommt jedes Geschwisterkind?',
        groupLabel: 'Kind',
        groupResultPrefix: 'Jedes Kind',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-04',
        operation: 'divide',
        emoji: '🎨',
        story: '{{name}} verteilt {{a}} Buntstifte gleichmäßig auf {{b}} Kinder. Wie viele Buntstifte bekommt jedes Kind?',
        groupLabel: 'Kind',
        groupResultPrefix: 'Jedes Kind',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-05',
        operation: 'divide',
        emoji: '📚',
        story: '{{name}} sortiert {{a}} Bücher gleichmäßig in {{b}} Regale. Wie viele Bücher stehen in jedem Regal?',
        groupLabel: 'Regal',
        groupResultPrefix: 'Jedes Regal',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-06',
        operation: 'divide',
        emoji: '🌸',
        story: '{{name}} hat {{a}} Blumen und stellt sie gleichmäßig in {{b}} Vasen. Wie viele Blumen sind in jeder Vase?',
        groupLabel: 'Vase',
        groupResultPrefix: 'Jede Vase',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-07',
        operation: 'divide',
        emoji: '🪙',
        story: '{{name}} hat {{a}} Münzen und legt sie gleichmäßig in {{b}} Dosen. Wie viele Münzen sind in jeder Dose?',
        groupLabel: 'Dose',
        groupResultPrefix: 'Jede Dose',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-08',
        operation: 'divide',
        emoji: '🥚',
        story: '{{name}} legt {{a}} Eier gleichmäßig in {{b}} Körbe. Wie viele Eier liegen in jedem Korb?',
        groupLabel: 'Korb',
        groupResultPrefix: 'Jeder Korb',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-09',
        operation: 'divide',
        emoji: '🚗',
        story: '{{name}} verteilt {{a}} Spielzeugautos gleichmäßig in {{b}} Kisten. Wie viele Autos kommen in jede Kiste?',
        groupLabel: 'Kiste',
        groupResultPrefix: 'Jede Kiste',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-10',
        operation: 'divide',
        emoji: '🍒',
        story: '{{name}} hat {{a}} Kirschen und verteilt sie gleichmäßig auf {{b}} Schüsseln. Wie viele Kirschen sind in jeder Schüssel?',
        groupLabel: 'Schüssel',
        groupResultPrefix: 'Jede Schüssel',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-11',
        operation: 'divide',
        emoji: '🔵',
        story: '{{name}} hat {{a}} Murmeln und steckt sie gleichmäßig in {{b}} Säcke. Wie viele Murmeln sind in jedem Sack?',
        groupLabel: 'Sack',
        groupResultPrefix: 'Jeder Sack',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-12',
        operation: 'divide',
        emoji: '📎',
        story: '{{name}} hat {{a}} Aufkleber und klebt sie gleichmäßig auf {{b}} Seiten. Wie viele Aufkleber sind auf jeder Seite?',
        groupLabel: 'Seite',
        groupResultPrefix: 'Jede Seite',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-13',
        operation: 'divide',
        emoji: '🥕',
        story: '{{name}} hat {{a}} Karotten und legt sie gleichmäßig vor {{b}} Hasen. Wie viele Karotten bekommt jeder Hase?',
        groupLabel: 'Hase',
        groupResultPrefix: 'Jeder Hase',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-14',
        operation: 'divide',
        emoji: '🍓',
        story: '{{name}} hat {{a}} Erdbeeren und verteilt sie gleichmäßig auf {{b}} Kinder. Wie viele Erdbeeren bekommt jedes Kind?',
        groupLabel: 'Kind',
        groupResultPrefix: 'Jedes Kind',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-15',
        operation: 'divide',
        emoji: '🎈',
        story: '{{name}} hat {{a}} Luftballons und bindet sie gleichmäßig an {{b}} Stühle. Wie viele Luftballons hängen an jedem Stuhl?',
        groupLabel: 'Stuhl',
        groupResultPrefix: 'Jeder Stuhl',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-16',
        operation: 'divide',
        emoji: '🍩',
        story: '{{name}} hat {{a}} Donuts und legt sie gleichmäßig auf {{b}} Teller. Wie viele Donuts sind auf jedem Teller?',
        groupLabel: 'Teller',
        groupResultPrefix: 'Jeder Teller',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-17',
        operation: 'divide',
        emoji: '🌟',
        story: '{{name}} hat {{a}} Sterne gesammelt und klebt sie gleichmäßig auf {{b}} Bilder. Wie viele Sterne sind auf jedem Bild?',
        groupLabel: 'Bild',
        groupResultPrefix: 'Jedes Bild',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-18',
        operation: 'divide',
        emoji: '🍌',
        story: '{{name}} hat {{a}} Bananen und legt sie gleichmäßig in {{b}} Körbe. Wie viele Bananen sind in jedem Korb?',
        groupLabel: 'Korb',
        groupResultPrefix: 'Jeder Korb',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-19',
        operation: 'divide',
        emoji: '🧩',
        story: '{{name}} hat {{a}} Puzzleteile und verteilt sie gleichmäßig auf {{b}} Stapel. Wie viele Teile liegen auf jedem Stapel?',
        groupLabel: 'Stapel',
        groupResultPrefix: 'Jeder Stapel',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-20',
        operation: 'divide',
        emoji: '🐟',
        story: '{{name}} hat {{a}} Fische und setzt sie gleichmäßig in {{b}} Aquarien. Wie viele Fische sind in jedem Aquarium?',
        groupLabel: 'Aquarium',
        groupResultPrefix: 'Jedes Aquarium',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-21',
        operation: 'divide',
        emoji: '🏆',
        story: '{{name}} verteilt {{a}} Punkte gleichmäßig auf {{b}} Runden. Wie viele Punkte gibt es pro Runde?',
        groupLabel: 'Runde',
        groupResultPrefix: 'Jede Runde',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-22',
        operation: 'divide',
        emoji: '🍡',
        story: '{{name}} hat {{a}} Gummibärchen und verteilt sie gleichmäßig auf {{b}} Kinder. Wie viele Gummibärchen bekommt jedes Kind?',
        groupLabel: 'Kind',
        groupResultPrefix: 'Jedes Kind',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-23',
        operation: 'divide',
        emoji: '📚',
        story: '{{name}} sortiert {{a}} Hefte gleichmäßig in {{b}} Fächer. Wie viele Hefte kommen in jedes Fach?',
        groupLabel: 'Fach',
        groupResultPrefix: 'Jedes Fach',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-24',
        operation: 'divide',
        emoji: '🌸',
        story: '{{name}} pflückt {{a}} Blumen und bindet sie zu {{b}} gleich großen Sträußen. Wie viele Blumen hat jeder Strauß?',
        groupLabel: 'Strauß',
        groupResultPrefix: 'Jeder Strauß',
        divPairs: DIV_PAIRS,
    },
    {
        id: 'div-25',
        operation: 'divide',
        emoji: '🍎',
        story: '{{name}} hat {{a}} Äpfel und verteilt sie gleichmäßig auf {{b}} Freunde. Wie viele Äpfel bekommt jeder Freund?',
        groupLabel: 'Freund',
        groupResultPrefix: 'Jeder Freund',
        divPairs: DIV_PAIRS,
    },
]

// ── Helpers ──────────────────────────────────────────────────────
function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1))
}

function pickName() {
    return NAMES[Math.floor(Math.random() * NAMES.length)]
}

// ── Generate one exercise from a template ────────────────────────
export function generateExercise(template) {
    let a, b, result

    if (template.operation === 'add') {
        a = rand(1, 9)
        b = rand(1, 9)
        result = a + b
    } else if (template.operation === 'subtract') {
        a = rand(2, 9)
        b = rand(1, a - 1)
        result = a - b
    } else if (template.operation === 'multiply') {
        a = rand(2, 9)
        b = rand(2, 9)
        result = a * b
    } else {
        // divide — pick from valid integer pairs
        const pair = template.divPairs[Math.floor(Math.random() * template.divPairs.length)]
        a = pair[0]
        b = pair[1]
        result = a / b
    }

    const name = pickName()
    const story = template.story
        .replace(/{{name}}/g, name)
        .replace(/{{a}}/g, a)
        .replace(/{{b}}/g, b)
        .replace(/{{result}}/g, result)

    return { template, a, b, result, name, story }
}

// ── Build a shuffled queue cycling through all 100 templates ─────
export function buildExerciseQueue() {
    const shuffled = [...TEMPLATES].sort(() => Math.random() - 0.5)
    return shuffled.map(t => generateExercise(t))
}
