import {CardName, CardNameIndexes, CardSuits} from './cards.js'
import {SiteName, SiteNameIndexes} from './sites.js'
import * as other from './other.js'

let worldDeckSize, dispossessedDeckSize, relicDeckSize;
const format = []
const worldSuitArray = [0,0,0,0,0,0]
const dispSuitArray = [0,0,0,0,0,0]

// Input savestring
export const savestring = '030303000219The Helichrysum Chronicle2B010101234505FFFFFF20FFFFFF14FFFFDE1BFFFFFF29FFFFFF16FFFFE01EFFFFFF1FFFFFFF3B0624182B0E2629D61ED31D15D51309522F201C3521001FD2D42819C30B1632AD0F342233C125089810010D112C121A0507042314270AB717312D30062A1B2E0C030212E9DBDCEAE8E7E4DFDADDEDE2E6ECE3E5E1EB000105ARman'

// --------------- Initialize and specify
constructFormat()
const offset = worldDeckSize + dispossessedDeckSize + relicDeckSize

// --------------- Extract numbers

//const curSiteSaveIDs =

// --------------- Assign to object
const save = {
    // ---------------- Base
    majorVersion: hexParser(0),
    minorVersion: hexParser(1),
    patch: hexParser(2),
    gameCount: hexParser(3),
    nameLength: hexParser(4),
    name: strParser(5),
    prevActiveStatus: hexParser(6),
    exileCitizenStatus: citizenParser(7),
    oath: other.oathArray[hexParser(8)],
    // Skip suit order (???), 9-15.
    // ---------------- Map
    sites: [parseSite(15), parseSite(19), parseSite(23), parseSite(27), parseSite(31), parseSite(35), parseSite(39), parseSite(43)],
    worldDeck: parseSuitDeck(47, worldSuitArray, worldDeckSize),
    dispDeck: parseSuitDeck(48+worldDeckSize, dispSuitArray, dispossessedDeckSize),
    relicDeck: parseRelicDeck(49+worldDeckSize+dispossessedDeckSize, relicDeckSize),
    prevCitizenStatus: hexParser(50+offset),
    prevWinColor: other.winCases[hexParser(51+offset)],
    prevWinNameLength: hexParser(52+offset),
    prevWinName: strParser(53+offset)
}

export {save, worldSuitArray, dispSuitArray}

// --------------- Functions

function parseRelicDeck(n,size){
    // Keep track of suit numbers
    const deck = []
    for (let i = 0; i < size; i++ ){
        const cardName = CardNameIndexes[hexParser(n+i+1)]
        deck.push(cardName)
    }
    return deck
}

function parseSuitDeck(n,array,size){
    // Keep track of suit numbers
    const deck = []
    for (let i = 0; i < size; i++ ){
        const cardName = CardNameIndexes[hexParser(n+i+1)]
        deck.push(cardName)
        if ( CardSuits[cardName] != undefined ){
            // Avoid errors from visions
            array[CardSuits[cardName]] += 1
        }
    }
    return deck
}


function parseSite(n){
    const site = {
        name: SiteNameIndexes[hexParser(n)],
        index1: hexParser(n+1),
        card1: CardNameIndexes[hexParser(n+1)],
        index2:hexParser(n+2),
        card2: CardNameIndexes[hexParser(n+2)],
        index3: hexParser(n+3),
        card3: CardNameIndexes[hexParser(n+3)]
    }
    return site
}

function constructFormat(){
    format.push(...[2,2,2,4,2,0,2,2,2,1,1,1,1,1,1]) // Base
    format[5] = hexParser(4) // Add chronicle name length

    const sitef = [2,2,2,2] // Site
    format.push(...sitef.concat(sitef, sitef, sitef, sitef, sitef, sitef, sitef)) // 8 sites on map

    // World
    format.push(2)
    worldDeckSize = hexParser(format.length-1)
    addCardsFormat(worldDeckSize)

    // Dispossessed
    format.push(2)
    dispossessedDeckSize = hexParser(format.length-1)
    addCardsFormat(dispossessedDeckSize)

    // Relics
    format.push(2)
    relicDeckSize = hexParser(format.length-1)
    addCardsFormat(relicDeckSize)

    // Previous game
    format.push(...[2,2,2])
    format.push(hexParser(format.length-1))
}

function addCardsFormat(deckSize){
    for (let i = 0; i < deckSize; i++){
        format.push(2);
    }
}

function citizenParser(n){
    var m = getPos(n)
    const byte = parseInt(savestring.substr(m,format[n]))
    // Order of colors in byte: [] [] [] [Black] [Yellow] [White] [Blue] [Red]
    const citizenStatus = {
        red: byte & 1 ? "citizen" : "exile", // Bitwise magic and ternary operators!
        blue: byte & 2 ? "citizen" : "exile",
        white: byte & 4 ? "citizen" : "exile",
        yellow: byte & 8 ? "citizen" : "exile",
        black: byte & 16 ? "citizen" : "exile"
    }
    return citizenStatus
}

function strParser(n){
    var m = getPos(n)
    return savestring.substr(m,format[n])
}

function hexParser(n){
    assert(n<format.length,'Index beyond savestring length.')
    var m = getPos(n)
    return parseInt(savestring.substr(m,format[n]),16)
}

function getPos(n){
    var m = 0;
    for (let i=0; i<n; i++){
        m = m + format[i];
    }
    return m
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}
