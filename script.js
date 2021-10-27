
var script_tag = document.getElementById('counter');
var count = script_tag.getAttribute("data-count");
var imgsrc = script_tag.getAttribute("data-imgsrc");

script_tag.innerHTML += '<p>';
for (var i = 0; i <= count; i++) {
  script_tag.innerHTML += '<img src="' + quote.img + '"; style="height:1em;"/>';
}
script_tag.innerHTML += '</p>';
