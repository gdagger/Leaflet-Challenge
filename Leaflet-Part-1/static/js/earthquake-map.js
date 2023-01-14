// geojson URL for all earthquakes in the past 7 days
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


function chooseColor(earthquake) {
    if (earthquake >= 90) return "rgb(182,244,76)"
    else if (earthquake  >= 70) return "rgb(239,176,106)"
    else if (earthquake >= 50) return "rgb(243,186,76)"
    else if (earthquake >= 30) return "rgb(242,220,76)"
    else if (earthquake >= 10) return "rgb(225,243,79)"
    else return "rgb(182,244,76)";
}

///// Create Map
function createMap(earthquakes) {

// Add the street and topo tile layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let baseMaps = {
    "Street": street,
    "Topographic Map": topo
  }

  let overlayMaps = {
    Earthquakes: earthquakes
  }

  // Creating the map object
  let myMap = L.map("map", {
    center: [40.2659, -96.7467],
    zoom: 4.4,
    layers: [street, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

///// Create Markers
function createMarkers(response) {

  let features = response.features;

  let earthquakeMarkers = [];

  for (let i=0; i<features.length; i++) {
    //   console.log([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]]);
    let currentFeature = features[i]
      earthquakeMarkers.push(
        L.circleMarker([currentFeature.geometry.coordinates[1], features[i].geometry.coordinates[0]], {
            stroke: true,
            fillOpacity: 0.75,
            color: "black",
            fillColor: chooseColor(currentFeature.geometry.coordinates[2]),
            weight: 1,
            radius: (features[i].properties.mag) * 4
          }).bindPopup(`<h2>${features[i].properties.place}</h3><hr>
                        <p>Time: ${Date(currentFeature.properties.time)}</p<hr>`)
        );
  }

  console.log("earthquakeMarkers:", features);

  let earthquakeLayer = L.layerGroup(earthquakeMarkers);

    createMap(earthquakeLayer);

}

///// API Call
    d3.json(url).then(response => {
      createMarkers(response)
  });

  
  // // Define a function that we want to run once for each feature in the features array.
  // // Give each feature a popup that describes the place and time of the earthquake.
  // function onEachFeature(feature, layer) {
  //   layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  // }

  // // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // // Run the onEachFeature function once for each piece of data in the array.
  // let geojsonMarkerOptions = {
  //   radius: 8,
  //   fillColor: "#ff7800",
  //   color: "#000",
  //   weight: 1,
  //   opacity: 1,
  //   fillOpacity: 0.8
  // };
  
  // let earthquakes = L.geoJSON(response, {
  //   onEachFeature: onEachFeature,
  //   pointToLayer: function(feature, latlng) {
  //     return L.circleMarker(latlng, geojsonMarkerOptions)
  //   }
  // }).addTo(map);

  // Send our earthquakes layer to the createMap function/
  // createMap(earthquakes);



