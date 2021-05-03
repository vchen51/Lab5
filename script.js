// script.js

let canvas = document.getElementById('user-image');                 // canvas
let ctx = canvas.getContext('2d'); 
let imageInput = document.getElementById('image-input');            
const clear = document.querySelector('button[type=reset]');
const submit = document.querySelector('button[type=submit]');       // buttons
const reset = document.querySelector('button[type=reset]');
const readText = document.querySelector('button[type=button]');
let form = document.getElementById("generate-meme");
let synth = window.speechSynthesis;                                 // voice
let volumeSelect = document.getElementById('volume-group');
var voiceSelect = document.getElementById('voice-selection');
let voices = [];
let volumeLevel = 1;
const volume = document.querySelector("[type='range']");

const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  ctx.clearRect(0,0,canvas.width, canvas.height);                   // clear canvas

  submit.disabled = false;                                          // toggling buttons
  reset.disabled = true;
  readText.disabled = false;

  ctx.fillStyle = 'black';                                          // fill canvas with black
  ctx.fillRect(0, 0, canvas.width, canvas.height); 

  const dimensions = getDimmensions(canvas.width, canvas.height,    // drawing images
    img.width, img.height); 
  console.log(dimensions);
  ctx.drawImage(img, dimensions.startX, dimensions.startY, 
    dimensions.width, dimensions.height);
});

// load in image on input change
imageInput.addEventListener('change', () => {
  const imageURL = URL.createObjectURL(imageInput.files[0]);       // load in image
  img.src = URL.createObjectURL(imageInput.files[0]);              // file path of image
  img.alt = imageInput.files[0].name;                              // setting image alt to file path
});

// generate meme when submitted
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const topText = document.getElementById("text-top").value;       // top text values
  const bottomText = document.getElementById('text-bottom').value; // bottom text value

  ctx.fillStyle = 'white';                                       // styling text
  ctx.font = '50px Comic Sans MS';
  ctx.textAlign = 'center';
  ctx.fillText(topText, canvas.width/2, 50);
  ctx.fillText(bottomText, canvas.width/2, canvas.height-40);

  submit.disabled = true;                                          // button toggling
  reset.disabled = false;
  readText.disabled = false;                                       
});
                                                                  
// clearing canvas                                               
clear.addEventListener('click', () => {
  ctx.clearRect(0,0,canvas.width, canvas.height);                  // canvas clear

  submit.disabled = false;                                         // button toggling
  reset.disabled = true;
  readText.disabled = true;  
});

// retrieving list of voices
function populateVoiceList() {
  voices = synth.getVoices();                                       // 
  voiceSelect.disabled = false;
  voiceSelect.remove(0);
  
  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
    option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

// populating voice list
populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// browser speaking two inputs with the selected voice type
readText.addEventListener('click', (e) => {
  e.preventDefault();    

  let topText = document.getElementById("text-top").value;
  let bottomText = document.getElementById("text-bottom").value;

  let tbutterance = new SpeechSynthesisUtterance(topText + ' ' + bottomText);

  var selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(var i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedVoice) {
        tbutterance.voice = voices[i];
    }
  }

  // volumeLevel = document.querySelector("input[type=range]");
  tbutterance.volume = volumeLevel/100.0;
  synth.speak(tbutterance);
});

// volume slider icons
volumeSelect.addEventListener('input', (e) => {
  let volumeRange = document.querySelector('input[type=range]').value;
  volumeLevel = volumeRange;
  if (volumeRange == 0){
    document.querySelector('#volume-group img').src = 'icons/volume-level-0.svg';
  }
  else if (volumeRange <= 33){
    document.querySelector('#volume-group img').src = 'icons/volume-level-1.svg';
  }
  else if (volumeRange <= 66){
    document.querySelector('#volume-group img').src = 'icons/volume-level-2.svg';
  }
  else {
    document.querySelector('#volume-group img').src = 'icons/volume-level-3.svg';
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
