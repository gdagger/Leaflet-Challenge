// geojson URL for all earthquakes in the past 7 days
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//
function createMap(earthquakes) {

// Add the street and topo tile layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let baseMaps = {
    Street: street,
    Topography: topo
  }

  let overlayMaps = {
    Earthquakes: earthquakes
  }

  // Creating the map object
  let myMap = L.map("map", {
    center: [40.2659, -96.7467],
    zoom: 4.4
  });

  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}


function createMarkers(response) {
  let features = response.features;
  earthquakeMarkers = [];

  for (i=0; i<features.length; i++) {
      // console.log([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]]);
      earthquakeMarkers.push(L.markers([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]]));
  };

  console.log("earthquakeMarkers:", earthquakeMarkers);

  // createMap(earthquakeMarkers);
}




d3.json(url).then(response => {
  // Define variables for our tile layers.
 createMarkers(response);
  
});