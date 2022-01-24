import {CardName, CardNameIndexes, CardSuits} from './cards.js'
import {SiteName, SiteNameIndexes} from './sites.js'
import * as other from './other.js'

let worldDeckSize, dispossessedDeckSize, relicDeckSize;
const format = []
const worldSuitArray = [0,0,0,0,0,0]
const dispSuitArray = [0,0,0,0,0,0]

// Input savestring
export const savestring = '030303000613The First Chronicle3A0200012345133111E910CE2AE3000AE5FF07FFFFDD12FFFFFF0CD0DCFF23FFFFFF08C770FF36847714AF870828D4D66E047C8FD2D3059B09AAD5248CC00C1C335D32302BA4181E590B0E131D3D2D9C379DC517AB2C349E011B167F201E252758121F290D0F350015075E220203061A212319882E267D2F901067B80FEBDFE8EDE7E1DBECE2EAE6DEE0DAE4002004Bock'

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
  // 6 is unused
  exileCitizenStatus: hexParser(7),
  oath: other.oathArray[hexParser(8)],
  // Skip suit order (???), 9-15.
  // ---------------- Map
  site1: parseSite(15),
  site2: parseSite(19),
  site3: parseSite(23),
  site4: parseSite(27),
  site5: parseSite(31),
  site6: parseSite(35),
  site7: parseSite(39),
  site8: parseSite(43),
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
