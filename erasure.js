// George Albert - 1406569781 - Tugas 2 NLP
// Parts of code originally from:
// A2Z F16
// Daniel Shiffman
// https://github.com/shiffman/A2Z-F16
// http://shiffman.net/a2z

var idrPicked = [];
var engPicked = [];
var resultBoxes = [];
var atSentence = 0;
var idrSentenceLength = -1;
var taggedSents = [];
var removeFromNullIndexes = [];

function TaggedSentence(words, indexes, idrSentenceLength) {
  this.words = words;
  this.indexes = indexes;
  this.idrSentenceLength = idrSentenceLength;
}

function processPairs(data) {
  for (var i = 0; i < data.length; i++) {
    showBox(data[i].idr, 'idr', i);
    showBox(data[i].eng, 'eng', i);
    removeFromNullIndexes.push([]);
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
    div.attribute('atSentence', k);

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

  if (lang == 'idr') {
    idrSentenceLength = actualWords.length;
  }

  if (lang == 'eng') {
    var res = createP('');
    res.class('result result-' + k);
    resultBoxes.push(res);
    
    var displayed = "";

    for (let word of actualWords) {
      displayed += word + "({ }) ";
    }

    res.html(displayed);
    taggedSents.push(new TaggedSentence(actualWords, targetIndexes, idrSentenceLength));
    idrSentenceLength = -1;
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

  var nullIndexes = [];

  for (var i = 1; i < taggedSents[atSentence].idrSentenceLength; i++) {
    nullIndexes.push(i);
  }

  for (let wordIdx of taggedSents[atSentence].indexes) {
    for (let idx of wordIdx) {
      console.log("im an idx", idx);
      if (removeFromNullIndexes[atSentence].indexOf(idx) == -1) {
        console.log("yeaa");
        removeFromNullIndexes[atSentence].push(idx);
        console.log("removeFromNul", removeFromNullIndexes[atSentence]);        
      }
    }
  }

  for (let idx of removeFromNullIndexes[atSentence]) {
    if (nullIndexes.indexOf(idx) > -1) {
      nullIndexes.splice(nullIndexes.indexOf(idx), 1);
    }
  }

  console.log("removeFromNull, ", removeFromNullIndexes[atSentence]);

  for (let div of idrPicked) {
    var cIdx = parseInt(div.attribute('idx'));
    var bIdx = nullIndexes.indexOf(cIdx);
    idrEventIndexes += ' ' + (parseInt(div.attribute('idx')));
    nullIndexes.splice(bIdx, 1);
  }

  var nullIndexesAll = '';

  for (let fIdx of nullIndexes) {
    nullIndexesAll += fIdx + ' ';
  }

  for (let div of engPicked) {
    engEventIndexes.push(parseInt(div.attribute('idx'))); }

  listOfIndexes = taggedSents[atSentence].indexes;

  for (var k = 0; k < engEventIndexes.length; k++) {
    listOfIndexes[engEventIndexes[k]] = (idrEventIndexes.trim());
  }

  console.log(idrEventIndexes);
  console.log(engEventIndexes);

  res = select('.result-' + atSentence);
  
  var displayed = "";
  var actualWords = taggedSents[atSentence].words;

  displayed += 'NULL({ ' + nullIndexesAll + '}) ';

  for (var k = 1; k < actualWords.length; k++) {
    displayed += actualWords[k] + "({ " + taggedSents[atSentence].indexes[k] + " }) ";
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
  if (atSentence != this.attribute('atSentence')) {
    atSentence = this.attribute('atSentence');
  }
  if (atSentence != this.attribute('atSentence') || !(idrPicked.length == 0 || keyIsDown(SHIFT))) {
    for (let div of idrPicked) {
      clearSelection(div);
    }
    idrPicked = [];
  }
  idrPicked.push(this);
  this.style('background-color', '#f58080');
  this.style('color', '#fff');
  this.attribute('clicked', 'true');
  console.log(idrPicked);
}

function engPick() {
  if (atSentence != this.attribute('atSentence')) {
    atSentence = this.attribute('atSentence');
  }
  if (atSentence != this.attribute('atSentence') || !(engPicked.length == 0 || keyIsDown(SHIFT))) {
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
