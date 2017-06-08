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
    targetIndexes.push('');

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

  for (let wordIndexes of taggedSents[atSentence].indexes) {
    if (wordIndexes.length > 0) {
      var wordIndexesInt = wordIndexes.split(' ').map(function(item) {
        return parseInt(item, 10);
      });

      for (let wdx of wordIndexesInt) {
        if (removeFromNullIndexes[atSentence].indexOf(wdx) < 0) {
          removeFromNullIndexes[atSentence].push(wdx);
        }
      }
    }
  }

  console.log(",", removeFromNullIndexes[atSentence]);

  for (let div of idrPicked) {
    var cIdx = parseInt(div.attribute('idx'));
    var bIdx = nullIndexes.indexOf(cIdx);
    idrEventIndexes += ' ' + (parseInt(div.attribute('idx')));
    nullIndexes.splice(bIdx, 1);
  }

  var nullIndexesAll = '';

  for (let fIdx of nullIndexes) {
    if (removeFromNullIndexes[atSentence].indexOf(fIdx) == -1) {
      nullIndexesAll += fIdx + ' ';
    }
  }

  for (let div of engPicked) {
    engEventIndexes.push(parseInt(div.attribute('idx'))); }

  for (var k = 0; k < taggedSents[atSentence].indexes.length; k++) {
    taggedSents[atSentence].indexes[engEventIndexes[k]] = (idrEventIndexes.trim());
  }

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
