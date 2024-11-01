var map = L.map('map').setView([39.828, -98.579], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


let heatLayer = null;
let originalData = [];

  // Calculate similarity score between point and preferences
  function calculateSimilarity(properties, preferences) {
    const tmaxDiff = Math.abs(properties.us_tmax - preferences.tmax);
    const tminDiff = Math.abs(properties.us_tmin - preferences.tmin);
    const tavgDiff = Math.abs(properties.us_tavg- preferences.avgTemp);
    const prcpDiff = Math.abs(properties.us_prcp_avg - preferences.avgprcp);

        // Normalize differences (assuming max possible difference is 100)
        //const tmaxScore = 1 - (tmaxDiff / 100);
        //const tminScore = 1 - (tminDiff / 100);
        const tavgScore = 1 - (tavgDiff / 100);
        const prcpScore = 1 - (prcpDiff / 100);
          
        // Average the scores
        return (tavgScore + prcpScore) / 3;
    }

    // Convert GeoJSON to heatmap points
  function createHeatmapPoints(geojsonData, preferences) {
    return geojsonData.features.map(feature => {
        const intensity = calculateSimilarity(feature.properties, preferences);
        return [
            feature.geometry.coordinates[1], // latitude
            feature.geometry.coordinates[0], // longitude
            intensity // weight
        ];
    }).filter(point => point[2] > 0.6); // Only include points with similarity > 0.3
}

 // Update heatmap with filtered data
 function updateHeatmap(){
  const preferences = {
       avgTemp: parseFloat(document.getElementById('tempPref').value)
      ,avgprcp: parseFloat(document.getElementById('precipPref').value)
  };
  console.log(preferences)
  // Remove existing heatmap layer
  if (heatLayer) {
      map.removeLayer(heatLayer);
  }

  // Create new heatmap points
  const points = createHeatmapPoints(originalData, preferences);

  console.log(points)

  // Create and add new heatmap layer
  heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      max: 1.0,
      gradient: {
        0.2: '#0000ff', // blue
        0.4: '#4169e1', // royal blue
        0.6: '#00ffff', // cyan
        0.8: '#00ff00', // lime
        1.0: '#ffff00'  // yellow
      }
  }).addTo(map);

  console.log('making new heatmap')
}

    fetch('output.geojson')
    .then(response => response.json())
    .then(data => {
        originalData = data;
        updateHeatmap();
    });

