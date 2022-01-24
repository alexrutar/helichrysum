import {save, worldSuitArray, dispSuitArray} from './oath-parser.js'

// Automatically insert a few things into the webpage
document.getElementById("name").innerHTML = save.name;
insertSiteName("site1",save.site1);
insertSiteName("site2",save.site2);
insertSiteName("site3",save.site3);
insertSiteName("site4",save.site4);
insertSiteName("site5",save.site5);
insertSiteName("site6",save.site6);
insertSiteName("site7",save.site7);
insertSiteName("site8",save.site8);

// Automatically visualize the suit distribution with a bar plot
var number_tags = document.getElementsByClassName('number');
for (var j=0;j<number_tags.length;j++){
var script_tag = number_tags[j]
  const count = worldSuitArray[j];

    script_tag.innerHTML += count;
}

// Automatically visualize the suit distribution with a bar plot
var counter_tags = document.getElementsByClassName('counter');
for (var j=0;j<counter_tags.length;j++){
var script_tag = counter_tags[j]
  var imgsrc = script_tag.getAttribute("data-imgsrc");
  const count = worldSuitArray[j];

  script_tag.innerHTML += '<p>';
  for (var i = 1; i <= count; i++) {
    script_tag.innerHTML += '<img src="' + imgsrc + '"; style="width:1em;"/>';
  }
  script_tag.innerHTML += '</p>';
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
    '<img src="' + quote.img + '"; style="height:1em;"/>'+
    quote.text +
    '<img src="' + quote.img + '"; style="height:1em;"/>' + 
    '</p>';
})();

function insertSiteName(id,site){
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
