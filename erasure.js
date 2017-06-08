// A2Z F16
// Daniel Shiffman
// https://github.com/shiffman/A2Z-F16
// http://shiffman.net/a2z

var idrPicked = [];
var engPicked = [];
var atSentence = 0;

var taggedSents = [];

function TaggedSentence(words, indexes) {
  this.words = words;
  this.indexes = indexes;
}

function processPairs(data) {
  for (var i = 0; i < data.length; i++) {
    showBox(data[i].idr, 'idr', i);
    showBox(data[i].eng, 'eng', i);
  }
}

function showBox(words, lang, k) {
  var par = createP('');
  par.class('text');
  par.class(lang);

  var actualWords = [];
  var targetIndexes = [];

  for (var i = 0; i < words.length; i++) {
    if (lang == 'idr') {
      var splitted = words[i].trim().split(/\((?![\([0-9]])/);
      var word = splitted[0];
      var idx = splitted[1].split(')')[0];
    } else {
      var splitted = words[i].trim().split(' ');
      var word = splitted[0];
      var idx = i;
    }
    actualWords.push(word);
    targetIndexes.push([]);

    var div = createDiv(word + ' ');
    // This keeps it looking like regular text
    div.style('display', 'inline');
    // This makes it look clickable
    div.style('cursor', 'pointer');
    
    // This tracks things
    div.attribute('lang', lang);
    div.attribute('idx', idx);

    // The div is placed inside the paragraph element
    div.parent(par);

    // Handling mouseover, mouseout, and pressed
    div.mouseOver(highlight);
    div.mouseOut(unhighlight);
    // "remove" the word when pressed
    if (lang == 'idr') {
      div.mousePressed(idrPick);
    } else {
      div.mousePressed(engPick);
    }
  }

  if (lang == 'eng') {
    var res = createP('');
    res.class('result-' + k);
    
    var displayed = "";

    for (let word of actualWords) {
      displayed += word + "({ }) ";
    }

    res.html(displayed);
    taggedSents.push(new TaggedSentence(actualWords, targetIndexes));
  }

  paragraphs.push(par);
}

function clearSelection(div) {
  div.style('background-color', '#fff');
  div.style('color', '#000');
  div.attribute('clicked', 'false');
}

function resultCalc() {
  var idrEventIndexes = '';
  var engEventIndexes = [];

  for (let div of idrPicked) {
    idrEventIndexes + ' ' + (div.attribute('idx')); }

  for (let div of engPicked) {
    engEventIndexes.push(parseInt(div.attribute('idx'))); }

  listOfIndexes = taggedSents[atSentence].indexes;

  for (var k = 0; k < engEventIndexes.length; k++) {
    listOfIndexes[k] = (idrEventIndexes);
  }

  res = select('.result-' + atSentence);
  
  var displayed = "";
  var actualWords = taggedSents[atSentence].words;

  for (var k = 0; k < actualWords.length; k++) {
    displayed += actualWords[k] + "({ " + taggedSents[atSentence].indexes[k] + "}) ";
  }

  res.html(displayed);
}

function keyPressed() {
  if (keyCode == CONTROL) {
    console.log(atSentence);
    var res = select('.result-' + atSentence);
    resultCalc();
  }
}

function idrPick() {
  if (!(idrPicked.length == 0 || keyIsDown(SHIFT))) {
    for (let div of idrPicked) {
      clearSelection(div);
    }
    idrPicked = [];
  }
  idrPicked.push(this);
  this.style('background-color', '#f58080');
  this.style('color', '#fff');
  this.attribute('clicked', 'true');
}

function engPick() {
  if (!(engPicked.length == 0 || keyIsDown(SHIFT))) {
    for (let div of engPicked) {
      clearSelection(div);
    }
    engPicked = [];
  }
  engPicked.push(this);
  this.style('background-color', '#9090f9');
  this.style('color', '#fff');
  this.attribute('clicked', 'true');
  console.log(engPicked);
}

// The function refers to "this"
// "this" is the div that the event is triggered on
// p5 very conveniently assigns the element to this so that
// the same callback can be used for many elements
// more about this in future weeks!
function eraseIt() {
  if (spacingCheck.checked()) {
  //if (spacingCheck.checked()) {
    // "removing it by changing the color to match background"
    this.style('color', '#FFF');
    this.style('background-color', '');
    console.log(this);
  } else {
    // Actually hiding the div itself
    this.hide();
    console.log(this);
  }
}

function highlight() {
  if (this.attribute('clicked') != 'true') {
    this.style('background-color', '#AAA')
  }
}

function unhighlight() {
  if (this.attribute('clicked') != 'true') {
    this.style('background-color', '');
  }
}
