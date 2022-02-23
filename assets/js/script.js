import {savestring, save, worldSuitArray, dispSuitArray} from './oath-parser.js'


// set background image based on previous winner
if (window.innerWidth >= 1200) {
    if (save.prevWinColor == "chancellor") {
        var img_name = "full_chancellor.png";
    } else {
        var img_name = "full_" + save.exileCitizenStatus[save.prevWinColor] + "_" + save.prevWinColor + ".png"
    }
    document.body.style.backgroundImage = "url(assets/character_art/" + img_name;
}


// insert savestring
document.getElementById("savestring").innerHTML = savestring + "\n";


// insert site names
function insertSiteName(id, site){
    if (site.name != undefined){
        var string = '</br>- ' + site.name;
        if (site.index1 < 210){
            string += ': '+ site.card1;}
        if (site.index2 < 210){
            string += ', '+ site.card2;}
        if (site.index3 < 210){
            string += ', '+ site.card3;}
        document.getElementById(id).innerHTML = string
    }
}
document.getElementById("name").innerHTML = save.name;
for (let i=1; i<9; i++) {
    insertSiteName("site" + i, save.sites[i-1]);
}


// Insert current oath
const oathFancyName = {
    "supremacy": '<span class="goudy-capital">S</span>upremacy',
    "people": '<span class="goudy-capital">T</span>he <span class="goudy-capital">P</span>eople',
    "devotion": '<span class="goudy-capital">D</span>evotion',
    "protection": '<span class="goudy-capital">P</span>rotection',
    "conspiracy": '<span class="goudy-capital">C</span>onspiracy'
}
document.getElementById("oath").innerHTML = '<img src="assets/images/' + save.oath + '.png"> <span class="goudy-capital">O</span>ath <em>of</em> ' + oathFancyName[save.oath];


// insert suit numbers
var number_tags = document.getElementsByClassName('number');
// TODO: this is pretty fragile since it depends on the table order not
// changing, which feels like a bad idea
for (var j=0;j<number_tags.length;j++){
    var script_tag = number_tags[j];
    const count = worldSuitArray[j];
    script_tag.innerHTML = count;
}

// visualize the suit distribution with a bar plot
var counter_tags = document.getElementsByClassName('counter');
for (var j=0;j<counter_tags.length;j++){
    var script_tag = counter_tags[j];
    var imgsrc = script_tag.getAttribute("data-imgsrc");
    const count = worldSuitArray[j];

    for (var i = 1; i <= count; i++) {
        script_tag.innerHTML += '<img src="' + imgsrc + '">';
    }
}

// Insert a random suit quote in the footer
(function() {
    var quotes = [
        {
            text: " The home, a crackling fire. Calm, contentedness, and ease. ",
            img: "assets/images/suit-hearth.png"
        },
        {
            text: " Bright lights in the night sky. Starry-eyed discovery and esoteric tradition. ",
            img: "assets/images/suit-arcane.png"
        },
        {
            text: " The betrayal of a sibling. The sewers, rats chewing on spare bones. ",
            img: "assets/images/suit-discord.png"
        },
        {
            text: " Sword, stone, and burnished silver. Lockstep, willing or unwilling. ",
            img: "assets/images/suit-order.png"
        },
        {
            text: " Scratching, rustling in the grass. Fur, scale, and claw. ",
            img: "assets/images/suit-beast.png"
        },
        {
            text: " The sun, the moon—those traveling bodies. Care for one’s own. ",
            img: "assets/images/suit-nomad.png"
        }
    ];
    var quote = quotes[Math.floor(Math.random() * quotes.length)];
    // Get the Quote element from the footer and insert the HTML
    document.getElementById("quote").innerHTML =
        '<p>' +
        '<img src="' + quote.img + '">'+
        quote.text +
        '<img src="' + quote.img + '">' +
        '</p>';
})();
