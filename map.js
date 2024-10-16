//map boilerplate DO NOT CHANGE

//generate your own API key from "cloud.maptiler.com" and fill in below in the key variable
//note: when pushing changes: PLEASE DO NOT LEAVE IN YOUR PERSONAL API KEY
const key = 'APIKEY';
          
const attribution = new ol.control.Attribution({
    collapsible: false,
});

const source = new ol.source.TileJSON({
    url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${key}`,
    tileSize: 512,
    crossOrigin: 'anonymous'
});

const map = new ol.Map({
    layers: [
    new ol.layer.Tile({
        source: source
    })
    ],
    controls: ol.control.defaults.defaults({attribution: false}).extend([attribution]),
    target: 'map',
    view: new ol.View({
    constrainResolution: true,
    center: ol.proj.fromLonLat([16.62662018, 49.2125578]),
    zoom: 14
    })
});