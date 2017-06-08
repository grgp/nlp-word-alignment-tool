// George Albert - 1406569781 - Tugas 2 NLP
// Parts of code originally from:
// A2Z F16
// Daniel Shiffman
// https://github.com/shiffman/A2Z-F16
// http://shiffman.net/a2z

// Many DOM elements
var dropZone, input, button, sample, clearButton;

// An array to keep track of all the new DOM elements being added
var paragraphs = [];

var inputText = '';

// An extra element, a checkbox
var spacingCheck;


function setup() {

  noCanvas();

  // Selecting the text field and button
  input = select('#textinput');
  button = select('#submit');
  // What to do when button pressed
  button.mousePressed(handleInput);

  // Selected the div which will be the "drop zone"
  // for dragging and dropping files
  dropZone = select('#drop_zone');
  // Here are the events to handle
  dropZone.dragOver(highlight);
  dropZone.drop(gotFile, unHighlight);

  // This link allows quick testing with a file
  // that's ready to load instantly
  sample = select('#sample');
  sample.mousePressed(loadFile);

  // This button clears the new paragraph elements
  // added
  // clearButton = select('#clear');
  // clearButton.mousePressed(clearText);
  // finishbutton = select('#finish');
  // finishbutton.mousePressed(putAll);

  // Spacing checkbox
  spacingCheck = select('#keepspacing');

  // resultbox = select('#textresult');
}

// Load a file for quick testing
function loadFile() {
  loadStrings('files/validation_step.txt', fileLoaded);
}
// When the file is loaded
function fileLoaded(data) {
  var txt = data.join('\n');

  input.html(txt);
  // Note the use of a function that will "process" the text
  // This is b/c the text might come in a number of different ways
  // process(txt);
}

// Handle dropzone events
function highlight() {
  dropZone.style('background', '#AAA');
}

function unHighlight() {
  dropZone.style('background','');
}

function gotFile(file) {
  if (file.type === 'text') {
    // process(file.data);
    inputText += file.data + '\n\n';
    input.html(inputText);
  } else {
    // In case it's some weird other kind of file
    alert('this is not a text file.');
  }
}

function sentencePair(id, idr, eng) {
  this.id = id;
  this.idr = idr;
  this.eng = eng;
}

function parseToList(input) {
  lines = input.split('\n');
  sentencePairs = [];
  for (var i = 0; i < lines.length / 3; i++) {
    var id = parseInt(lines[i*3].split('#')[1]);
    // var idr = lines[i*3+1].split(/\([0-9]+\) /);
    // var eng = lines[i*3+2].split(/\({ }\) /);

    var idr = lines[i*3+1].split(' ');
    var eng = lines[i*3+2].split(/ (?![\(\}])/);
    
    sentencePairs.push(new sentencePair(id, idr, eng));
  }
  processPairs(sentencePairs);
}

// Handle the text input field
function handleInput() {
  parseToList(input.value());
  // process(input.value());
}

// Clear all the divs with remove()
function clearText() {
  input.html('');
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].remove();
  }
  paragraphs = [];
}
