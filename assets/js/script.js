import {savestring, save, suits, regions, houses, worldSuitDict} from './oath_parser.js';

// general utilities
function suitImagePath(suit) {
    return 'assets/images/suit-' + suit + '.png';
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


// set background image based on previous winner
if (window.innerWidth >= 1200) {
    var img_name;
    if (save.prevWinColor == 'chancellor') {
        img_name = 'full_chancellor.png';
    } else {
        img_name = 'full_' + save.exileCitizenStatus[save.prevWinColor] + '_' + save.prevWinColor + '.png';
    }
    document.body.style.backgroundImage = 'url(assets/character_art/' + img_name;
}


// Insert current oath
const oathFancyName = {
    'supremacy': '<span class="goudy-capital">S</span>upremacy',
    'people': '<span class="goudy-capital">T</span>he <span class="goudy-capital">P</span>eople',
    'devotion': '<span class="goudy-capital">D</span>evotion',
    'protection': '<span class="goudy-capital">P</span>rotection'
};
document.getElementById('oath').innerHTML = '<img src="assets/images/' + save.oath + '.png"> <span class="goudy-capital">O</span>ath <em>of</em> ' + oathFancyName[save.oath];


// Insert active players
function createPlayerProfile(color, citizenStatus, chancellorColor) {
    // color is the house color, as in prevWinColor
    // citizenStatus is "exile" or "citizen"
    const playerFig = document.createElement('figure');
    const playerImg = document.createElement('img');
    playerImg.classList.add('portrait');
    const playerCaption = document.createElement('figcaption');
    var citizenString;
    var profileName;
    var profileTitle;
    if (color == 'chancellor') {
        playerImg.src = 'assets/character_art/portrait_chancellor.png';
        citizenString = '';
        profileName = houses[chancellorColor]['player'];
        profileTitle = 'Chancellor';
    } else {
        playerImg.src = 'assets/character_art/portrait_' + citizenStatus + '_' + color + '.png';
        citizenString = ' (' + citizenStatus + ')';
        profileName = houses[color]['player'];
        profileTitle = houses[color]['name'];
    }
    playerCaption.innerHTML = '<strong>' + profileTitle + '</strong>' + '<br>' + profileName + citizenString;

    playerFig.appendChild(playerImg);
    playerFig.appendChild(playerCaption);
    return playerFig;
}
const colorList = ['red', 'blue', 'white', 'yellow', 'black'];
var chancellorColor = save.prevWinColor; // default to chancellor loss
var prevChancellorColor;
for (const color of colorList) {
    // The chancellor is the only defined player who was inactive
    // assuming all players always participate
    if (houses[color]['player'] && save.prevActiveStatus[color] == 'inactive') {
        prevChancellorColor = color;
    }
}
if (save.prevWinColor == 'chancellor') {
    chancellorColor = prevChancellorColor;
} else {
    // If chancellor loss, set winner house inactive and give chancellor their house back
    save.prevActiveStatus[save.prevWinColor] = 'inactive';
    save.prevActiveStatus[prevChancellorColor] = 'active';
}
// First chancellor, then others
document.getElementById('player-profiles').appendChild(createPlayerProfile('chancellor', null, chancellorColor));
for (const color of colorList) {
    if (save.prevActiveStatus[color] == 'active') {
        document.getElementById('player-profiles').appendChild(createPlayerProfile(color, save.exileCitizenStatus[color], chancellorColor));
    }
}


// insert site names
function cardHoverLink(string) {
    return '<a class="hover_img" href="#">' + string + '<img src="assets/cards/' + string + '.webp"></a>';
}
function createSite(site) {
    // create the site <li> ... </li> element
    const siteLI = document.createElement('li');
    var siteStr = cardHoverLink(site.name);
    if (site.index1 < 210) {
        siteStr += ': ' + cardHoverLink(site.card1);
    }
    if (site.index2 < 210) {
        siteStr += ', ' + cardHoverLink(site.card2);
    }
    if (site.index3 < 210) {
        siteStr += ', ' + cardHoverLink(site.card3);
    }
    siteLI.innerHTML = siteStr;
    return siteLI;
}
function insertSiteList(region, siteList) {
    // insert a header and a list of sites into the element with id "sites"
    const siteUL = document.createElement('ul');
    siteList.forEach(
        site => (site.name) ? siteUL.appendChild(createSite(site)) : null
    );
    const siteLabel = document.createElement('em');
    siteLabel.innerText = capitalize(region);
    document.getElementById('sites').appendChild(siteLabel);
    document.getElementById('sites').appendChild(siteUL);
}
regions.forEach(
    region => insertSiteList(region, save.sites[region])
);


// visualize the suit distribution with a bar plot
function createSuitRow(suit, count) {
    const row = document.createElement('tr');

    const suitCol = document.createElement('td');
    suitCol.innerText = capitalize(suit);

    const numberCol = document.createElement('td');
    numberCol.innerText = count;

    const barVisualizationCol = document.createElement('td');
    barVisualizationCol.classList.add('counter');
    for (let i=0; i<count; i++) {
        const suitImage = document.createElement('img');
        suitImage.src = suitImagePath(suit);
        barVisualizationCol.appendChild(suitImage);
    }

    row.appendChild(suitCol);
    row.appendChild(numberCol);
    row.appendChild(barVisualizationCol);

    return row;
}
suits.forEach(
    suit => document.getElementById('card-counts').appendChild(
        createSuitRow(suit, worldSuitDict[suit])
    )
);


// insert savestring
document.getElementById('savestring').innerHTML = savestring + '\n';


// Insert a random suit quote in the footer
(function() {
    var quotes = {
        'hearth': 'The home, a crackling fire. Calm, contentedness, and ease.',
        'arcane': 'Bright lights in the night sky. Starry-eyed discovery and esoteric tradition.',
        'discord': 'The betrayal of a sibling. The sewers, rats chewing on spare bones.',
        'order': 'Sword, stone, and burnished silver. Lockstep, willing or unwilling.',
        'beast': 'Scratching, rustling in the grass. Fur, scale, and claw.',
        'nomad': 'The sun, the moon—those traveling bodies. Care for one’s own.'
    };
    var suit = suits[Math.floor(Math.random() * suits.length)];
    document.getElementById('quote').innerHTML =
        '<p>' +
        '<img src="' + suitImagePath(suit) + '"> '+
        quotes[suit] +
        ' <img src="' + suitImagePath(suit) + '">' +
        '</p>';
})();
