import logo from './logo.svg';
import './App.css';
import './prefCss.css';
import './mainPageFunc.js';
import MapInit from './map.js';

function App() {
  return (
    <>
      <BackgroundLinks />
      <NavBar />
      <Home />
    </>
  );
}

function BackgroundLinks(){
  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
    </>
  );
}

function NavBar(){
  return (
    <>
      <div id="header">
        <div id="navBar">
          <button id="homeBtn" className="navBarBtn"> Home</button>
          <button id="howToBtn" className="navBarBtn"> How it Works</button>
          <h1>PlaceFindr.com</h1>
          <button id="savedBtn" className="navBarBtn"><i className="fa-regular fa-bookmark" style={{color: "black"}}></i> Saved</button>
          <button id="accountBtn" className="navBarBtn">Account</button>
        </div>
      </div>
    </>
  );
}

//<MapInit /> or something similar should go where the map div is, I think?
function Home() {
  return (
    <>
      <script type="module" src="./map.js"></script>
      <main>
        <MapInit />
        <div id="pref" className="pref active">
          <div className="tabs">
            <button id="prefTabButton" className="tabBtn on">Preferences</button>
            <button id="prefSettTabButton" className="tabBtn">Settings</button>
          </div>
          <div id="prefTab">
            <h2 id="prefHeader">Preferences</h2>
            <div className="prefRow">
              <label htmlFor="minTempPref" className="prefLabel">Average Temperature:</label>
              <div className="doubleSlider-container">
                <div className="doubleSlider-rangeBG" id="slider-rangeBackgound"></div>
                <div className="doubleSlider-range" id="slider-range"></div>
                <input type="range" id="minTempPref" className="doubleSlider" min="20" max="80" step="1" defaultValue="40" />
                <input type="range" id="maxTempPref" className="doubleSlider" min="20" max="80" step="1" defaultValue="60" />
              </div>
              <div id="tempValueRange" className="value ">
                <span id="minTempValue"></span>&nbsp;-&nbsp;<span id="maxTempValue"></span>
              </div>
            </div>

            <div className="prefRow">
              <label htmlFor="precipPref" className="prefLabel">Average Precipitation:</label>
              <div className="slider-container">
                <input type="range" id="precipPref" className="singleSlider" name="precipPref" min="10" max="60" step="1" defaultValue="35" unit=" in" />
              </div>
              <span id="precipValue" className="value"></span>
            </div>

            <div className="prefRow">
              <label htmlFor="humidPref" className="prefLabel">Average Humididty:</label>
              <div className="slider-container">
                <input type="range" id="humidPref" className="singleSlider" name="humidPref" min="40" max="75" step="1" defaultValue="60" />
              </div>
              <span id="humidValue" className="value"></span>
            </div>

            <div className="prefRow">
              <label htmlFor="newPref" className="prefLabel">preference:</label>
              <div className="slider-container">
                <input type="range" id="newPref" className="singleSlider" name="newPref" min="1" max="10" step="1" defaultValue="5" />
              </div>
              <span id="newValue" className="value"></span>
            </div>
            
            <p id="buttonRow">
              <button id="saveButton" className="prefButton"><strong>Save Preferences</strong></button>
              <button id="searchButton" className="prefButton"><strong>Search</strong></button>
            </p>
          </div>
        </div>

        <div id="prefSettings" className="tab">
          <h2 id="prefSettHeader">Preference Settings</h2>

          <fieldset>
            <legend>Units:</legend>
            <div>
              <input type="radio" id="impUnitButton" defaultValue="impUnit" name="units" defaultChecked />
              <label htmlFor="impUnitButton">Imperial</label>
            </div>
            <div>
              <input type="radio" id="metUnitButton" defaultValue="metUnit" name="units" />
              <label htmlFor="metUnitButton">Metric</label>
            </div>
          </fieldset>
          
          <button id="darkModeToggle" className="prefSettButton">Toggle Dark Mode</button>
          <button id="saveSettingButton" className="prefSettButton">Save Settings</button>
        </div>

      </main>
    </>
  );
}

export default App;
