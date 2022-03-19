// DATA ville de l'utilisateur
const INPUTCITY= document.querySelector("#cityID")
const OUTPUTCITY= document.querySelector("#mavilleID")

// form pour l'addEventListener
const form= document.querySelector("#formID")

// Nombre de jours
const DAYSELECTOR = document.querySelector('#day-select');

//weather open

const APIKEY_WEATHER_2="e8e1dcbb0559820ba96f6138b409eaa2" // compte Jeromalo si blocage sur l'autre KEY
const APIKEY_WEATHER="1a78f3239a7008102b6a6cf133376c27" // compte bertrand.jf
const APIKEY_NASA="mSJwdJgOMfEzGHGixyMLC3uUPm4e96C8wa23nylE" // compte bertrand.jf

var openweather_url = "https://api.openweathermap.org/data/2.5/onecall"
var openweather_city_url = "https://api.openweathermap.org/data/2.5/weather"
var icon_url = "http://openweathermap.org/img/wn/"
var nasa_url = "https://api.nasa.gov/planetary/apod?api_key=mSJwdJgOMfEzGHGixyMLC3uUPm4e96C8wa23nylE"
var horoscope_url = 	"https://ohmanda.com/api/horoscope/"

//opencage

const APIKEY_OPENCAGE="ae2305116a7b4396ad54cb2166eef2ec"

var opencage_url = "https://api.opencagedata.com/geocode/v1/json"

//events

form.addEventListener("submit", function(e){
    // questionner l api OPENCAGE pour la latitude et la longitude
    e.preventDefault()*
    remove(weatherboxes)
    opencage_complete_url = (opencage_url
    + '?'
    + 'q=' + INPUTCITY.value
    + '&key=' + APIKEY_OPENCAGE)
    get_coord(opencage_complete_url)
})


//réinitialiser la base
function remove(parent){
  while (parent.firstChild){
    parent.removeChild(parent.firstChild)
  }
}


function get_coord(opencage_complete_url){
    //questionner l'api OPENCAGE
        $.get(opencage_complete_url, function(data){
            citydata = data["results"]["0"]["formatted"]
            lat = data["results"]["0"]["geometry"]["lat"],
            lng = data["results"]["0"]["geometry"]["lng"]
            OUTPUTCITY.innerHTML = citydata
            get_weather(lat, lng)
        })
}


function get_weather(lat, lng){
    //questionner l'api WEATHER
    openweather_complete_url = (openweather_url
    + '?'
    + 'lat=' + lat
    + '&lon=' + lng
    + '&exclude=' + ""
    + '&appid=' + APIKEY_WEATHER_2)
    get_datas(openweather_complete_url)
}


function get_datas(openweather_complete_url){
        for (let i = 0; i < parseInt(DAYSELECTOR.value); i++)
        $.get(openweather_complete_url, function(data){
    //création weatherbox
          var weatherbox = document.createElement('div')
          weatherbox.classList.add("weatherbox")
    // questionner l api WEATHER pour la date
            var date = document.createElement('div'); // data date
            weatherbox.appendChild(date);
            date.classList.add("reveal-text-date")
            weatherdate = data["daily"][i]["dt"]
            var DAY = new Date(weatherdate*1000)
            options = {weekday: "long"}
            date.innerText = DAY.toLocaleDateString("en-US", options)

    // questionner l api WEATHER pour la météo du jour
            var meteo = document.createElement('div'); // data meteo
            weatherbox.appendChild(meteo);
            meteo.classList.add("meteo")
            weatherdescription = data["daily"][i]["weather"]["0"]["description"]
            meteo.innerText = weatherdescription

    // questionner l api WEATHER pour icône météo
            var icon = document.createElement('img'); // data icones
            weatherbox.appendChild(icon);
            icon.classList.add("icon")
            weathericon = data["daily"][i]["weather"]["0"]["icon"]
            var request_url = icon_url
            + weathericon
            + "@2x.png"
            src = icon.setAttribute("src", request_url);

            show_datas(weatherbox)
    })
}


function show_datas(weatherbox){
  // affiche les requêtes dans les boxes
  let weatherboxes = document.getElementById("weatherboxes")
  weatherboxes.appendChild(weatherbox);
}


function get_horoscope(){
  //url de l'horoscope du jour
  var selectBox = document.getElementById("sign-select");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  complete_url = (horoscope_url
  + selectedValue)
  afficher_horoscope(complete_url)
}

// problème de CORS, allow control origin pour l'api !
function afficher_horoscope(url){
  // afficher l'horoscope
  // $.get(url, function(data){
  //   dataC = data["description"]
  //   console.log(dataC)})
  show_alert()
}

function show_alert(){
  al = "under construction ! N'hésitez pas à questionner le créateur dessus !"
  alert(al)
}


                                          // LOGO
// console.clear();

// Get the canvas element from the DOM
const canvas = document.querySelector('#scene');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
// Store the 2D context
const ctx = canvas.getContext('2d');

if (window.devicePixelRatio > 1) {
  canvas.width = canvas.clientWidth * 2;
  canvas.height = canvas.clientHeight * 2;
  ctx.scale(2, 2);
}

/* ====================== */
/* ====== VARIABLES ===== */
/* ====================== */
let width = canvas.clientWidth; // Width of the canvas
let height = canvas.clientHeight; // Height of the canvas
let rotation = 0; // Rotation of the globe
let dots = []; // Every dots in an array

/* ====================== */
/* ====== CONSTANTS ===== */
/* ====================== */
/* Some of those constants may change if the user resizes their screen but I still strongly believe they belong to the Constants part of the variables */
const DOTS_AMOUNT = 500; // Amount of dots on the screen
const DOT_RADIUS = 2.5; // Radius of the dots
let GLOBE_RADIUS = width * 0.6; // Radius of the globe
let GLOBE_CENTER_Z = -GLOBE_RADIUS; // Z value of the globe center
let PROJECTION_CENTER_X = width / 2; // X center of the canvas HTML
let PROJECTION_CENTER_Y = height / 2; // Y center of the canvas HTML
let FIELD_OF_VIEW = width * 0.8;

class Dot {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.xProject = 100;
    this.yProject = 100;
    this.sizeProjection = 100;
  }
  // Do some math to project the 3D position into the 2D canvas
  project(sin, cos) {
    const rotX = cos * this.x + sin * (this.z - GLOBE_CENTER_Z);
    const rotZ = -sin * this.x + cos * (this.z - GLOBE_CENTER_Z) + GLOBE_CENTER_Z;
    this.sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ);
    this.xProject = (rotX * this.sizeProjection) + PROJECTION_CENTER_X;
    this.yProject = (this.y * this.sizeProjection) + PROJECTION_CENTER_Y;
  }
  // Draw the dot on the canvas
  draw(sin, cos) {
    this.project(sin, cos);
    // ctx.fillRect(this.xProject - DOT_RADIUS, this.yProject - DOT_RADIUS, DOT_RADIUS * 2 * this.sizeProjection, DOT_RADIUS * 2 * this.sizeProjection);
    ctx.beginPath();
    ctx.arc(this.xProject, this.yProject, DOT_RADIUS * this.sizeProjection, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

function createDots() {
  // Empty the array of dots
  dots.length = 0;
  
  // Create a new dot based on the amount needed
  for (let i = 0; i < DOTS_AMOUNT; i++) {
    const theta = Math.random() * 2 * Math.PI; // Random value between [0, 2PI]
    const phi = Math.acos((Math.random() * 2) - 1); // Random value between [-1, 1]
    
    // Calculate the [x, y, z] coordinates of the dot along the globe
    const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
    const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
    const z = (GLOBE_RADIUS * Math.cos(phi)) + GLOBE_CENTER_Z;
    dots.push(new Dot(x, y, z));
  }
}

/* ====================== */
/* ======== RENDER ====== */
/* ====================== */
function render(a) {
  // Clear the scene
  ctx.clearRect(0, 0, width, height);
  
  // Increase the globe rotation
  rotation = a * 0.000125;
  
  const sineRotation = Math.sin(rotation); // Sine of the rotation
  const cosineRotation = Math.cos(rotation); // Cosine of the rotation
  
  // Loop through the dots array and draw every dot
  for (var i = 0; i < dots.length; i++) {
    dots[i].draw(sineRotation, cosineRotation);
  }
  
  window.requestAnimationFrame(render);
}


// Function called after the user resized its screen
function afterResize () {
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  if (window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx.scale(2, 2);
  } else {
    canvas.width = width;
    canvas.height = height;
  }
  GLOBE_RADIUS = width * 0.7;
  GLOBE_CENTER_Z = -GLOBE_RADIUS;
  PROJECTION_CENTER_X = width / 2;
  PROJECTION_CENTER_Y = height / 2;
  FIELD_OF_VIEW = width * 0.8;
  
  createDots(); // Reset all dots
}

// Variable used to store a timeout when user resized its screen
let resizeTimeout;
// Function called right after user resized its screen
function onResize () {
  // Clear the timeout variable
  resizeTimeout = window.clearTimeout(resizeTimeout);
  // Store a new timeout to avoid calling afterResize for every resize event
  resizeTimeout = window.setTimeout(afterResize, 500);
}
window.addEventListener('resize', onResize);

// Populate the dots array with random dots
createDots();

// Render the scene
window.requestAnimationFrame(render);
                                        // END LOGO