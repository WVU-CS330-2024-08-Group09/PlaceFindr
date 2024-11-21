var map = L.map('map').setView([39.828, -98.579], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


let savedPreferences = {
tmin: null,
tmax: null,
avgprcp: null
};

let heatLayer = null;
let heatmapLayer;

// Function to get the season value as a number
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

export async function querryPoints() {
  // Send the data to the backend using a POST request
  try {
    const response = await fetch('/api/data', {
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

function calculateMatchScore(point, preferences) {
    // Calculate how well the point matches the user preferences
    const tempMinMatch = 1 - Math.abs(point.tmin - preferences.tmin) / 50; // Normalize by expected temperature range
    const tempMaxMatch = 1 - Math.abs(point.tmax - preferences.tmax) / 50;
    const precpMatch = 1 - Math.abs(point.avgprcp - preferences.avgprcp) / 100; // Normalize by expected precipitation range
    
    // Combine scores with weights
    return (tempMinMatch * 0.3 + tempMaxMatch * 0.3 + precpMatch * 0.4) * 100;
}

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

// Load preferences function
function loadPreferences() {
  return {
    season: getSeasonValue(),
    tmin: parseFloat(document.getElementById("minTempPref").value),
    tmax: parseFloat(document.getElementById("maxTempPref").value),
    tavg: parseFloat(document.getElementById('avgTempPref').value),
    avgprcp: parseFloat(document.getElementById('precipPref').value)
  };
}


//used to save the values of the preference sliders
function savePreference() {
  savedPreferences.tmin = parseFloat(document.getElementById("minTempPref").value)
  savedPreferences.tmax = parseFloat(document.getElementById("maxTempPref").value)
  savedPreferences.avgprcp = parseFloat(document.getElementById('precipPref').value)
}

//used to update the map with the saved values of the user
function setPreference() {
  loadPreferences(savedPreferences)
  //update the slider locations and values
  document.getElementById("minTempPref").value = savedPreferences.tmin
  document.getElementById("maxTempPref").value = savedPreferences.tmax
  document.getElementById("precipPref").value = savedPreferences.avgprcp

  //calling variables from the "mainPageFunc.js" file that update the coloring on the temp min and max slider
  window.minSlide()
  window.maxSlide()
}
