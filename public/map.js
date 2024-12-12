/**
 * map.js
 * 
 * This file controls initializing and updating the map based on user inputs.
 */

var map = L.map('map').setView([39.828, -98.579], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 10,
  minZoom: 4,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.setMaxBounds(map.getBounds());

/**
 * Constructor for saving a set of input preferences to store.
 * @param {string} prefName - Name of the set of saved preference inputs.
 * @param {number} season - Season represented by a number 1-4, inclusive.
 * @param {number} tmin - Minimum temperature (must be between -30 and 50, inclusive).
 * @param {number} tmax - Maximum temperature (must be between -30 and 50, inclusive).
 * @param {number} tempavg - Average temperature (must be between -30 and 50, inclusive).
 * @param {number} avgprcp - Average precipitation (must be between 0 and 2400, inclusive).
 * @returns {savedPreferences}
 */
function savedPreferences(prefName, season, tmin, tmax, tempavg, avgprcp)
{
  this.prefName = prefName;
  this.season = season;  
  this.tmin = tmin;  
  this.tmax = tmax;
  this.tempavg = tempavg;
  this.avgprcp = avgprcp;
}

let userPrefs = null;
let heatLayer = null;
let heatmapLayer;
let savedPrefAr = [];

if(sessionStorage.getItem("prefToLoad"))
{
  setPrefToLoad();
}


if(localStorage.getItem("userPrefs") === null)
{
  savedPrefAr = [];
}
else
{
  savedPrefAr = JSON.parse(localStorage.getItem("userPrefs"));
}

/**
 * Maps the season name chosen on the home page to a number.
 * @returns {number} Number representing the season chosen, or 0 if the season is not found.
 */
function getSeasonValue() {
  const season = document.getElementById('season').value;
  
  // Map the season to its corresponding numerical value
  const seasonMap = {
    winter: 1,
    spring: 2,
    summer: 3,
    autumn: 4
  };

  return seasonMap[season] || 0; // Return 0 if season is not found
}

/**
 * Maps a number to a season name.
 * @param {number} num - Number representing a season.
 * @returns {string|undefined} Season name represented by the number entered, or undefined if the number is invalid. 
 */
function getSeasonString(num)
{
  switch(num)
  {
    case 1:
      return "winter";
    case 2:
      return "spring";
    case 3:
      return "summer";
    case 4:
      return "autumn";
  }
}

/**
 * Makes a query to the SQL database through the site's backend.
 */
export async function querryPoints() {
  // Send the data to the backend using a POST request
  try {
    //40.90.225.131
    const response = await fetch('http://localhost:5000/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loadPreferences())  // Send as JSON
    });

    if (!response.ok) {
      throw new Error('HTTP error! status: ${response.status}');
    }

    const data = await response.json();
    updateHeatmap(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Calculates how well a point matches the input preferences.
 * @param {Object} point - The point being compared.
 * @param {number} point.tmin - The minimum temperature of the point.
 * @param {number} point.tmax - The maximum temperature of the point.
 * @param {number} point.avgprcp - The average precipitation of the point.
 * @param {Object} preferences - The user input preferences being compared.
 * @param {number} preferences.tmin - The minimum temperature input by the user.
 * @param {number} preferences.tmax - The maximum temperature input by the user.
 * @param {number} preferences.avgprcp - The average precipitation input by the user.
 * @returns {number} A score representing how well the point matches the user preferences.
 */
function calculateMatchScore(point, preferences) {
  // Calculate how well the point matches the user preferences
  const tempMinMatch = 1 - Math.abs(point.tmin - preferences.tmin) / 50; // Normalize by expected temperature range
  const tempMaxMatch = 1 - Math.abs(point.tmax - preferences.tmax) / 50;
  const precpMatch = 1 - Math.abs(point.avgprcp - preferences.avgprcp) / 100; // Normalize by expected precipitation range

  // Combine scores with weights
  return (tempMinMatch * 0.3 + tempMaxMatch * 0.3 + precpMatch * 0.3) * 100;
}

/**
 * Updates the heatmap on the home page.
 * @param {JSON} responseData - Data retrieved from a SQL query to the database.
 */
function updateHeatmap(responseData) {
  if (heatmapLayer) {
    map.removeLayer(heatmapLayer);
  }
  
  const points = responseData.data.map(point => {
    return [point.lat, point.lon, 1];
  });

  heatmapLayer = L.heatLayer(points, {
    radius: 50,           // Much larger radius to ensure points blend together
    blur: 60,            // Increased blur for smoother blending
    maxZoom: 19,         // Allow maximum zoom while maintaining blur
    minOpacity: 0.35,    // Minimum opacity for visibility
    gradient: {          // Smooth gradient
      0.0: 'rgba(0, 0, 255, 0.7)',
      0.5: 'rgba(0, 255, 255, 0.7)',
      0.7: 'rgba(0, 255, 0, 0.7)',
      0.9: 'rgba(255, 255, 0, 0.7)',
      1.0: 'rgba(255, 0, 0, 0.7)'
    },
    scaleRadius: true    // Scale the radius based on zoom level
  }).addTo(map);
}

/**
 * Gets values of user input preferences.
 * @returns {Object} An Object containing the values season, tmin, tmax, tavg, avgpcrp.
 */
export function loadPreferences() {
  return {
    season: getSeasonValue(),
    tmin: parseFloat(document.getElementById("minTempPref").value),
    tmax: parseFloat(document.getElementById("maxTempPref").value),
    tavg: parseFloat(document.getElementById('avgTempPref').value),
    avgprcp: parseFloat(document.getElementById('precipPref').value)
  };
}

/**
 * Saves the values of the user input preferences to localStorage.
 */
export function savePreference() 
{
  //save all pertinent preference data
  savedPrefAr.push(new savedPreferences(
    prompt("Please enter a name for your preference set"),
    getSeasonString(getSeasonValue()),
    parseFloat(document.getElementById("minTempPref").value),
    parseFloat(document.getElementById("maxTempPref").value),
    parseFloat(document.getElementById("avgTempPref").value),
    parseFloat(document.getElementById('precipPref').value)
  ))

  if(localStorage.getItem("userPrefs") === null)
    {
      localStorage.removeItem("userPrefs")
      console.log("removed userPrefs")
    }

  userPrefs = JSON.stringify(savedPrefAr);
  localStorage.setItem("userPrefs", userPrefs);
}

/**
 * Updates the map with values loaded from an array of saved preference inputs.
 * @param {number} [i=0] - A number representing the savedPrefAr index to load preferences from.
 */
export function setPreference(i=0) {

  //update the slider locations and values
  document.getElementById("season").value = savedPrefAr[i].season
  document.getElementById("minTempPref").value = savedPrefAr[i].tmin
  document.getElementById("maxTempPref").value = savedPrefAr[i].tmax
  document.getElementById("precipPref").value = savedPrefAr[i].avgprcp
  document.getElementById("avgTempPref").value = savedPrefAr[i].tempAvg

  //calling variables from the "mainPageFunc.js" file that update the coloring on the temp min and max slider
  window.minSlide()
  window.maxSlide()

  //recalculates the saved heatmap
  querryPoints();
}

/**
 * Updates the map using the values stored in the sessionStorage item prefToLoad.
 */
function setPrefToLoad()
{
  let prefToLoad = JSON.parse(sessionStorage.getItem("prefToLoad"))

  document.getElementById("season").value = prefToLoad.season;
  document.getElementById("minTempPref").value = prefToLoad.tmin
  document.getElementById("maxTempPref").value =  prefToLoad.tmax
  document.getElementById("precipPref").value = prefToLoad.avgprcp
  document.getElementById("avgTempPref").value = prefToLoad.tempavg
  
  //calling variables from the "mainPageFunc.js" file that update the coloring on the temp min and max slider
  //window.minSlide()
  //window.maxSlide()
  
  //recalculates the saved heatmap
  querryPoints();
}

/**
 * Getter method for savedPrefAr.
 * @returns {Array} An array of saved preference inputs.
 */
function returnPref()
{
  return savedPrefAr;
}

