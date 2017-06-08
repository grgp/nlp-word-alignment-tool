// A2Z F16
// Daniel Shiffman
// https://github.com/shiffman/A2Z-F16
// http://shiffman.net/a2z

var divs = [];
var slider;
var checkbox;
var dropdown;
var input;


function setup() {
  noCanvas();

  var divButton = createButton('make a div');
  divButton.mousePressed(makeDiv);

  slider = createSlider(1, 48, 12);

  checkbox = createCheckbox('red');
  dropdown = createSelect();
  dropdown.option('date');
  dropdown.option('random number');

  input = createInput('your name');

  var clearButton = createButton('clear');
  clearButton.mousePressed(function() {
    for (var i = 0; i < divs.length; i++) {
      divs[i].remove();
    }
  });
}

function makeDiv() {
  var div;

  if (dropdown.selected() === 'date') {
    div = createDiv(input.value() + ', this div was made at ' + Date());
  } else {
    div = createDiv(input.value() + ', here\'s a random number: ' + floor(random(100)));
  }
  div.style('font-size', slider.value() + 'pt');

  if (checkbox.checked()) {
    div.style('background-color', '#D00');
  }

  divs.push(div);
}

// function changeSize() {
//   for (var i = 0; i < divs.length; i++) {
//     divs[i].style('font-size', slider.value() + 'pt');
//   }
// }


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
  clearButton = select('#clear');
  clearButton.mousePressed(clearText);

  // Spacing checkbox
  spacingCheck = select('#keepspacing');

}

// Load a file for quick testing
function loadFile() {
  loadStrings('files/spam.txt', fileLoaded);
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

// Handle the text input field
function handleInput() {
  process(input.value());
}

// Clear all the divs with remove()
function clearText() {
  input.html('');
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].remove();
  }
  paragraphs = [];
}


var words = ["It", "was", "a", "dark", "and", "stormy", "night"];

function hoverWord() {
  var word = this.html();
  if (word.length > 3) {
    this.html(word + "bah")
    this.style('background-color', '#F0F');
  } else {
    this.style('background-color', '#FF0');
  }
  // this.html('rainbow');

}

function setup() {
  console.log(this);

  noCanvas();

  var wordP = select("#words");

  for (var i = 0; i < words.length; i++) {
    var word = createSpan(words[i]);
    //word.style("margin-left", "10px");
    word.parent(wordP);
    word.mouseOver(hoverWord);

    var space = createSpan(" ");
    space.parent(wordP);
  }
}
