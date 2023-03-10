// URL for GeoJSON of all earthquakes in the past 7 days
const earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// URL for tectonic plates
const platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Create dictionary to match depth ranges with colors
let depthColors = {
    '-10-10':"rgb(182,244,76)",
    '10-30':"rgb(225,243,79)",
    '30-50':"rgb(242,220,76)",
    '50-70':"rgb(243,186,76)",
    '70-90':"rgb(239,176,106)",
    '90+':"rgb(237,106,106)"
}

// Create function that returns color string for each depth range
function chooseColor(earthquake) {
    if (earthquake >= 90) return "rgb(237,106,106)"
    else if (earthquake  >= 70) return "rgb(239,176,106)"
    else if (earthquake >= 50) return "rgb(243,186,76)"
    else if (earthquake >= 30) return "rgb(242,220,76)"
    else if (earthquake >= 10) return "rgb(225,243,79)"
    else return "rgb(182,244,76)";
}


// Define the street and topo tile layers
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


// Use D3 to pull data from GeoJSON and create markers/maps
d3.json(earthquakesURL).then(response => {

    // Store features data
    let features = response.features;

    // Initialize empty array to store markers
    let earthquakeMarkers = [];

    // Loop through features and create circle markers from feature location
    for (let i=0; i<features.length; i++) {
    let currentFeature = features[i]
        earthquakeMarkers.push(
        L.circleMarker([currentFeature.geometry.coordinates[1], features[i].geometry.coordinates[0]], {
            stroke: true,
            fillOpacity: 0.75,
            color: "black",
            fillColor: chooseColor(currentFeature.geometry.coordinates[2]),
            weight: 1,
            radius: (features[i].properties.mag) * 4
            }).on({
                mouseover: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity:1
                    })
                },
                mouseout:function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity:.6
                    })
                }
            }).bindPopup(`<h3>${currentFeature.properties.place}</h3><hr>
                        <h4>Magnitude: ${currentFeature.properties.mag}</h4>
                        <h4>Depth: ${currentFeature.geometry.coordinates[2]}</h4>
                        <p>${Date(currentFeature.properties.time)}</p<hr>`)
        );
    }

    // Create layer group of all earthquake markers
    let earthquakeLayer = L.layerGroup(earthquakeMarkers);

    // TECTONIC PLATES
    d3.json(platesURL).then(response => {
        let plateLayer = L.geoJSON(response);

        // Create base and overlay maps
        let baseMaps = {
        "Street": street,
        "Topographic Map": topo
        }

        let overlayMaps = {
        Earthquakes: earthquakeLayer,
        "Tectonic Plates": plateLayer
        }

        // Create the map object
        let myMap = L.map("map", {
        center: [40.2659, -96.7467],
        zoom: 3,
        layers: [street, earthquakeLayer]
        });

        // Add layer control
        L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

    // Create legend in bottom right portion of screen 
    let legend = L.control({position: 'bottomright'});

    // Code found on StackExchange and adapted to add depth ranges/color-coded circles to legend
    legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'legend');
        let labels = ['<strong>Depth (km)</strong>'];
        let categories = ['-10-10','10-30','30-50','50-70','70-90','90+'];
            for (let i = 0; i < categories.length; i++) {
            div.innerHTML += 
            labels.push(
                `<i class="circle" style="background: ${depthColors[categories[i]]} "></i> ${categories[i]}`
            );
            }
            console.log("labels", labels);
            div.innerHTML = labels.join('<br>');
            return div;
    };

    // Add legend to map object (function input)
    legend.addTo(myMap);

    });

});

