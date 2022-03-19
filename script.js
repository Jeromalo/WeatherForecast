//queryselectors
const INPUTCITY= document.querySelector("#cityID")
const OUTPUTCITY= document.querySelector("#mavilleID")
const form= document.querySelector("#formID")
  // data meteo
const OUTPUTMETEO0= document.querySelector("#mameteoID0")
const OUTPUTMETEO1= document.querySelector("#mameteoID1")
const OUTPUTMETEO2= document.querySelector("#mameteoID2")
const OUTPUTMETEO3= document.querySelector("#mameteoID3")
const OUTPUTMETEO4= document.querySelector("#mameteoID4")
  // data date
const OUTPUTDATE0= document.querySelector("#dateID0")
const OUTPUTDATE1= document.querySelector("#dateID1")
const OUTPUTDATE2= document.querySelector("#dateID2")
const OUTPUTDATE3= document.querySelector("#dateID3")
const OUTPUTDATE4= document.querySelector("#dateID4")
  // data icones
const OUTPUTICON0= document.querySelector("#iconID0")
const OUTPUTICON1= document.querySelector("#iconID1")
const OUTPUTICON2= document.querySelector("#iconID2")
const OUTPUTICON3= document.querySelector("#iconID3")
const OUTPUTICON4= document.querySelector("#iconID4")


//weather open

const APIKEY_WEATHER="e8e1dcbb0559820ba96f6138b409eaa2"

var openweather_url = "https://api.openweathermap.org/data/2.5/onecall"
var icon_url = "http://openweathermap.org/img/wn/"

//opencage

const APIKEY_OPENCAGE="ae2305116a7b4396ad54cb2166eef2ec"

var opencage_url = "https://api.opencagedata.com/geocode/v1/json"

//events

form.addEventListener("submit", function(e){
    // questionner l api OPENCAGE pour la latitude et la longitude
    var request_url = opencage_url
    + '?'
    + 'q=' + INPUTCITY.value
    + '&key=' + APIKEY_OPENCAGE
        e.preventDefault()
        $.get(request_url, function(data){
            citydata = data["results"]["0"]["formatted"]
            lat = data["results"]["0"]["geometry"]["lat"],
            lng = data["results"]["0"]["geometry"]["lng"]
            OUTPUTCITY.innerHTML = citydata


    //questionner l'api WEATHER
    var request_url = openweather_url
    + '?'
    + 'lat=' + lat
    + '&lon=' + lng
    + '&exclude=' + ""
    + '&appid=' + APIKEY_WEATHER
        e.preventDefault()
        // questionner l api WEATHER pour la date
        $.get(request_url, function(data){
            weatherdate0 = data["daily"]["0"]["dt"]
            var DAY0 = new Date(weatherdate0*1000)
            OUTPUTDATE0.innerHTML = DAY0.toDateString()
            weatherdate1 = data["daily"]["1"]["dt"]
            var DAY1 = new Date(weatherdate1*1000)
            OUTPUTDATE1.innerHTML = DAY1.toDateString()
            weatherdate2 = data["daily"]["2"]["dt"]
            var DAY2 = new Date(weatherdate2*1000)
            OUTPUTDATE2.innerHTML = DAY2.toDateString()
            weatherdate3 = data["daily"]["3"]["dt"]
            var DAY3 = new Date(weatherdate3*1000)
            OUTPUTDATE3.innerHTML = DAY3.toDateString()
            weatherdate4 = data["daily"]["4"]["dt"]
            var DAY4 = new Date(weatherdate4*1000)
            OUTPUTDATE4.innerHTML = DAY4.toDateString()


        // questionner l api WEATHER pour la météo du jour
            weatherdata0 = data["daily"]["0"]["weather"]["0"]["description"]
            OUTPUTMETEO0.innerHTML = weatherdata0
            weatherdata1 = data["daily"]["1"]["weather"]["0"]["description"]
            OUTPUTMETEO1.innerHTML = weatherdata1
            weatherdata2 = data["daily"]["2"]["weather"]["0"]["description"]
            OUTPUTMETEO2.innerHTML = weatherdata2
            weatherdata3 = data["daily"]["3"]["weather"]["0"]["description"]
            OUTPUTMETEO3.innerHTML = weatherdata3
            weatherdata4 = data["daily"]["4"]["weather"]["0"]["description"]
            OUTPUTMETEO4.innerHTML = weatherdata4



    // icône météo J0
            weathericon0 = data["daily"]["0"]["weather"]["0"]["icon"]
            var request_url = icon_url
            + weathericon0
            + "@2x.png"
            src = OUTPUTICON0.setAttribute("src", request_url);
    // icône météo J+1
            weathericon1 = data["daily"]["1"]["weather"]["0"]["icon"]
            var request_url = icon_url
            + weathericon1
            + "@2x.png"
            src = OUTPUTICON1.setAttribute("src", request_url);
    // icône météo J+2
            weathericon2 = data["daily"]["2"]["weather"]["0"]["icon"]
            var request_url = icon_url
            + weathericon2
            + "@2x.png"
            src = OUTPUTICON2.setAttribute("src", request_url);
    // icône météo J+3
            weathericon3 = data["daily"]["3"]["weather"]["0"]["icon"]
            var request_url = icon_url
            + weathericon3
            + "@2x.png"
            src = OUTPUTICON3.setAttribute("src", request_url);
    // icône météo J+4
            weathericon4 = data["daily"]["4"]["weather"]["0"]["icon"]
            var request_url = icon_url
            + weathericon4
            + "@2x.png"
            src = OUTPUTICON4.setAttribute("src", request_url);
        })
    })
})


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
const DOTS_AMOUNT = 1000; // Amount of dots on the screen
const DOT_RADIUS = 4; // Radius of the dots
let GLOBE_RADIUS = width * 0.7; // Radius of the globe
let GLOBE_CENTER_Z = -GLOBE_RADIUS; // Z value of the globe center
let PROJECTION_CENTER_X = width / 2; // X center of the canvas HTML
let PROJECTION_CENTER_Y = height / 2; // Y center of the canvas HTML
let FIELD_OF_VIEW = width * 0.8;

class Dot {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.xProject = 0;
    this.yProject = 0;
    this.sizeProjection = 0;
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
  rotation = a * 0.0004;
  
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