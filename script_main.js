mapboxgl.accessToken = 'pk.eyJ1IjoibGluZm9yZXN0bGkiLCJhIjoiY2xzMjllcDBwMDh6ejJwcDBlazJxbnI1eSJ9.bdN98Gu22uwxkP8QpzvUZg'; 

const map = new mapboxgl.Map({
    container: 'main-map', 
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-79.381, 43.67],
    zoom: 12,
    pitch: 45,
    bearing: -17.6
});

map.addControl(new mapboxgl.NavigationControl());

// Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

// Geocoder

// Create geocoder variable, only show Toronto area results
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca",
    place: "Toronto"
});
// Position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


map.on('load', () => {
    // Add sapce category layer to the map
    map.addSource('zoning-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/linforestli/ggr472_the_yellow_belt/main/Data/Zoning Area.geojson' // Link to the data source
    });

    
    map.addLayer({
        'id': 'zoning-polygon',
        'type': 'fill',
        'source': 'zoning-data',
        'paint': {
            'fill-color': {
                property: 'GEN_ZONE',
                stops: [
                  [0, '#F7DC6F'],
                  [1, '#7DCEA0'],
                  [2, '#5D6D7E'],
                  [4, '#AF7AC5'],
                  [5, '#85C1E9'],
                  [6, '#784212'],
                  [101, '#F0B27A'],
                  [201, '#FAB2E3'],
                  [202, '#EC7063']
                ]
              },
              'fill-opacity': 1
        },
    });

    // add residential zone - yellow belt layer
    map.addSource('rd_detached', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/linforestli/ggr472_the_yellow_belt/main/Data/rd_detached.geojson'
    });

    map.addLayer({
        'id': 'yellowbelt',
        'type': 'fill',
        'source': 'rd_detached',
        'paint': {
            'fill-color': '#FFFF00',
            'fill-opacity': 1,
            //'fill-outline-color': 'black'
        },
    });

    // add residential zone - mixed use layer
    map.addSource('rd_mix', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/linforestli/ggr472_the_yellow_belt/main/Data/rd_mixed_use.geojson'
    });

    map.addLayer({
        'id': 'mixed_use',
        'type': 'fill',
        'source': 'rd_mix',
        'paint': {
            'fill-color': '#9999FF',
            'fill-opacity': 1,
            //'fill-outline-color': 'black'
        },
    });

    // add residential zone - others layer
    map.addSource('rd_other', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/linforestli/ggr472_the_yellow_belt/main/Data/rd_other.geojson'
    });

    map.addLayer({
        'id': 'others',
        'type': 'fill',
        'source': 'rd_other',
        'paint': {
            'fill-color': '#99CCFF',
            'fill-opacity': 1,
            //'fill-outline-color': 'black'
        },
    }); 

    // add building layer 1
    map.addSource('building-height1', {
        type: 'vector',
        url: 'mapbox://linforestli.1mw8jet6'
    });

    map.addLayer({
        'id': 'building_height_fill1',
        'type': 'fill-extrusion', 
        'source': 'building-height1',
        'source-layer': 'building1-bnifk2',

        'paint': {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                5,
                0,
                5.05,
                ['*', ['get', 'height'], 3] // multiply the height by 3 to get a better contrast
            ],
            'fill-extrusion-opacity': 0.6
        },

    });

    // add building layer 2
    map.addSource('building-height2', {
        type: 'vector',
        url: 'mapbox://linforestli.8vwk8k4w'
    });

    map.addLayer({
        'id': 'building_height_fill2',
        'type': 'fill-extrusion', 
        'source': 'building-height1',
        'source-layer': 'building2-az3hvx',

        'paint': {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                5,
                0,
                5.05,
                ['*', ['get', 'height'], 3]
            ],
            'fill-extrusion-opacity': 0.6
        },

    });


    // add building layer 3
    map.addSource('building-height3', {
        type: 'vector',
        url: 'mapbox://linforestli.3rcxjuwq'
    });

    map.addLayer({
        'id': 'building_height_fill3',
        'type': 'fill-extrusion', 
        'source': 'building-height3',
        'source-layer': 'building3-4vstnb',

        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                5,
                0,
                5.05,
                ['*', ['get', 'height'], 3]
            ],
            'fill-extrusion-opacity': 0.6
        },
    });


    // add building layer 4
    map.addSource('building-height4', {
        type: 'vector',
        url: 'mapbox://linforestli.14mpg6aw'
    });

    map.addLayer({
        'id': 'building_height_fill4',
        'type': 'fill-extrusion', 
        'source': 'building-height4',
        'source-layer': 'building4-6d0h0r',

        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                5,
                0,
                5.05,
                ['*', ['get', 'height'], 3]
            ],
            'fill-extrusion-opacity': 0.6
        },
    });

    // add building layer 5
    map.addSource('building-height5', {
        type: 'vector',
        url: 'mapbox://linforestli.2v2b4lhc'
    });

    map.addLayer({
        'id': 'building_height_fill5',
        'type': 'fill-extrusion', 
        'source': 'building-height5',
        'source-layer': 'building5-33e248',

        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                5,
                0,
                5.05,
                ['*', ['get', 'height'], 3]
            ],
            'fill-extrusion-opacity': 0.6
        },
    });

});

map.on('click', 'height-polygon', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Permitted maximum height (in m): </b> " + e.features[0].properties.HT_LABEL).addTo(map); //Show popup on map
});



/*--------------------------------------------------------------------
CREATE LEGEND IN JAVASCRIPT
--------------------------------------------------------------------*/
//Declare array variables for labels and colours
const legendlabels = [
    'Residential',
    'Open Space',
    'Utility and Transportation',
    'Employment Industrial',
    'Institutional',
    'Commercial Residential Employment',
    'Residential Appartment',
    'Commercial',
    'Commercial Residential'
];

const legendcolours = [
    '#F7DC6F',
    '#7DCEA0',
    '#5D6D7E',
    '#AF7AC5',
    '#85C1E9',
    '#784212',
    '#F0B27A',
    '#FAB2E3',
    '#EC7063'
];

//Declare legend variable using legend div tag
const legend = document.getElementById('legend');

//For each layer create a block to put the colour and label in
legendlabels.forEach((label, i) => {
    const colour = legendcolours[i];

    const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    const key = document.createElement('span'); //add a 'key' to the row. A key will be the colour circle

    key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    key.style.backgroundColor = colour; // the background color is retreived from teh layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (colour cirlce) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend.appendChild(item); //add row to the legend
});
