import {gameData} from '../../game_data.js';
import {CardNameIndexes, CardSuits} from './cards.js';
import {SiteNameIndexes} from './sites.js';
import * as other from './other.js';

let worldDeckSize, dispossessedDeckSize, relicDeckSize;
const format = [];
const suits = ['discord', 'arcane', 'order', 'hearth', 'beast', 'nomad'];
const regions = ['cradle', 'provinces', 'hinterland'];
const worldSuitDict = {'discord': 0, 'hearth': 0, 'nomad': 0, 'arcane': 0, 'order': 0, 'beast': 0};
const dispSuitDict = {'discord': 0, 'hearth': 0, 'nomad': 0, 'arcane': 0, 'order': 0, 'beast': 0};

// Input savestring
export const savestring = gameData['savestrings'][0];
export const houses = gameData['houses'];

// --------------- Initialize and specify
constructFormat();
const offset = worldDeckSize + dispossessedDeckSize + relicDeckSize;

// --------------- Assign to object
const save = {
    // ---------------- Base
    majorVersion: hexParser(0),
    minorVersion: hexParser(1),
    patch: hexParser(2),
    gameCount: hexParser(3),
    nameLength: hexParser(4),
    name: strParser(5),
    prevActiveStatus: byteParser(6,'active','inactive'),
    exileCitizenStatus: byteParser(7,'citizen','exile'),
    oath: other.oathArray[hexParser(8)],
    // Skip suit order (???), 9-15.
    // ---------------- Map
    sites: {
        'cradle': [parseSite(15), parseSite(19)],
        'provinces': [parseSite(23), parseSite(27), parseSite(31)],
        'hinterland': [parseSite(35), parseSite(39), parseSite(43)]
    },
    worldDeck: parseSuitDeck(47, worldSuitDict, worldDeckSize),
    dispDeck: parseSuitDeck(48+worldDeckSize, dispSuitDict, dispossessedDeckSize),
    relicDeck: parseRelicDeck(49+worldDeckSize+dispossessedDeckSize, relicDeckSize),
    prevCitizenStatus: hexParser(50+offset),
    prevWinColor: other.winCases[hexParser(51+offset)],
    prevWinNameLength: hexParser(52+offset),
    prevWinName: strParser(53+offset)
};

export {save, suits, regions, worldSuitDict, dispSuitDict};

// --------------- Functions

function parseRelicDeck(n, size) {
    // Keep track of suit numbers
    const deck = [];
    for (let i = 0; i < size; i++ ) {
        const cardName = CardNameIndexes[hexParser(n+i+1)];
        deck.push(cardName);
    }
    return deck;
}

function parseSuitDeck(n, dict, size) {
    // Keep track of suit numbers
    const deck = [];
    for (let i = 0; i < size; i++ ) {
        const cardName = CardNameIndexes[hexParser(n+i+1)];
        deck.push(cardName);
        if ( CardSuits[cardName] != undefined ) {
            // Avoid errors from visions
            dict[CardSuits[cardName]] += 1;
        }
    }
    return deck;
}


function parseSite(n) {
    const site = {
        name: SiteNameIndexes[hexParser(n)],
        index1: hexParser(n+1),
        card1: CardNameIndexes[hexParser(n+1)],
        index2:hexParser(n+2),
        card2: CardNameIndexes[hexParser(n+2)],
        index3: hexParser(n+3),
        card3: CardNameIndexes[hexParser(n+3)]
    };
    return site;
}

function constructFormat() {
    format.push(...[2,2,2,4,2,0,2,2,2,1,1,1,1,1,1]); // Base
    format[5] = hexParser(4); // Add chronicle name length

    const sitef = [2,2,2,2]; // Site
    format.push(...sitef.concat(sitef, sitef, sitef, sitef, sitef, sitef, sitef)); // 8 sites on map

    // World
    format.push(2);
    worldDeckSize = hexParser(format.length-1);
    addCardsFormat(worldDeckSize);

    // Dispossessed
    format.push(2);
    dispossessedDeckSize = hexParser(format.length-1);
    addCardsFormat(dispossessedDeckSize);

    // Relics
    format.push(2);
    relicDeckSize = hexParser(format.length-1);
    addCardsFormat(relicDeckSize);

    // Previous game
    format.push(...[2,2,2]);
    format.push(hexParser(format.length-1));
}

function addCardsFormat(deckSize) {
    for (let i = 0; i < deckSize; i++) {
        format.push(2);
    }
}

function byteParser(n, A, B) {
    const byte = hexParser(n);
    // Order of colors in byte: [] [] [Chancellor (ignored)] [Black] [Yellow] [White] [Blue] [Red]
    const status = {
        red: byte & 1 ? A : B, // Bitwise magic and ternary operators!
        blue: byte & 2 ? A : B,
        white: byte & 4 ? A : B,
        yellow: byte & 8 ? A : B,
        black: byte & 16 ? A : B,
        chancellor: byte & 32 ? A : B,
    };
    return status;
}

function strParser(n) {
    var m = getPos(n);
    return savestring.substr(m,format[n]);
}

function hexParser(n) {
    assert(n<format.length,'Index beyond savestring length.');
    var m = getPos(n);
    return parseInt(savestring.substr(m,format[n]),16);
}

function getPos(n) {
    var m = 0;
    for (let i=0; i<n; i++) {
        m = m + format[i];
    }
    return m;
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}
