import {save, worldSuitArray, dispSuitArray} from './oath-parser.js'

// Automatically insert a few things into the webpage
document.getElementById("name").innerHTML = save.name;

// Automatically visualize the suit distribution with a bar plot
var class_tags = document.getElementsByClassName('counter');
for (var j=0;j<class_tags.length;j++){
  var imgsrc = class_tags[j].getAttribute("data-imgsrc");
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
