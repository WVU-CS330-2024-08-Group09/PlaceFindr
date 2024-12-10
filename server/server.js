const express = require('express');
const { queryDatabase } = require('./database');
const app = express();
const cors = require('cors');
const port = 5000;

app.use(express.json()); // Parse incoming JSON requests
app.use(cors());

//-------------------------------------------

// Input validation middleware
const validateInputs = (req, res, next) => {
  const { season, tmax, tmin, tavg, avgprcp } = req.body;
  
  // Check if all required fields are present
  if (!season || tmax == null || tmin == null || tavg == null || avgprcp == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate season
  const allowedSeasons = [1, 2, 3, 4];
  if (!allowedSeasons.includes(Number(season))) {
    return res.status(400).json({ error: 'Invalid season value' });
  }

  // Validate temperature ranges
  const tempMin = -30;
  const tempMax = 50;
  if ([tmax, tmin, tavg].some(temp => 
    isNaN(temp) || temp < tempMin || temp > tempMax
  )) {
    return res.status(400).json({ 
      error: `Temperature values must be between ${tempMin}°C and ${tempMax}°C` 
    });
  }

  // Validate precipitation
  if (isNaN(avgprcp) || avgprcp < 0 || avgprcp > 2400) {
    return res.status(400).json({ 
      error: 'Precipitation must be between 0mm and 500mm' 
    });
  }

  next();
};

//----------------------------------------------
// Route to handle custom data queries based on user input
app.post('/api/data', validateInputs, async (req, res) => {
  const { season, tmax, tmin, tavg, avgprcp } = req.body;

  // Define the tolerance range for proximity (e.g., ±5 for temperatures, ±2 for precipitation)
  const tolerance = {
      temperature: 3, // ±5 degrees for temperature
      precipitation: 250 // ±2 mm for precipitation
  };

  try {
    // Build the query
    const query = `
        SELECT lat, lon
        FROM weather_grid_data
        WHERE season = @season
        AND precipitation_mm BETWEEN @precipMin AND @precipMax
        AND min_temp_c >= @minTempMin
        AND max_temp_c <= @maxTempMax
        AND avg_temp_c BETWEEN @avgTempMin AND @avgTempMax;
    `;

    const params = [
        { name: 'season', value: season },
        { name: 'precipMin', value: avgprcp - 250 },
        { name: 'precipMax', value: avgprcp + 250 },
        { name: 'minTempMin', value: tmin - tolerance.temperature },
        { name: 'minTempMax', value: tmin + tolerance.temperature },
        { name: 'maxTempMin', value: tmax - tolerance.temperature },
        { name: 'maxTempMax', value: tmax + tolerance.temperature },
        { name: 'avgTempMin', value: tavg - tolerance.temperature },
        { name: 'avgTempMax', value: tavg + tolerance.temperature }
      ];

    // Query the database with parameterized input to prevent SQL injection
    const result = await queryDatabase(query, params);
    // Send the query result as JSON
    if (result.length === 0) {
      return res.json({ 
        message: 'No locations found matching these criteria',
        data: [] 
      });
    }

    res.json({ 
      message: `Found ${result.length} matching locations`,
      data: result 
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request' 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
