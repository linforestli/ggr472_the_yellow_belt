mapboxgl.accessToken = 'pk.eyJ1IjoibGluZm9yZXN0bGkiLCJhIjoiY2xzMjllcDBwMDh6ejJwcDBlazJxbnI1eSJ9.bdN98Gu22uwxkP8QpzvUZg'; 

const map = new mapboxgl.Map({
    container: 'main-map', 
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-79.381, 43.67],
    zoom: 12,
    pitch: 45,
    bearing: -17.6,
    minZoom: 9,
    maxZoon: 15
});


// Add map controls 
map.addControl(new mapboxgl.NavigationControl());
// map.addControl(new mapboxgl.FullscreenControl());

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
// Add event listener for full screen on button click
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.381, 43.67],
        zoom: 12,
        pitch: 45,
        bearing: -17.6
        
    });
});


map.on('load', () => {

    /*--------------------------------------------------------------------
    Space Categories
    --------------------------------------------------------------------*/
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

    var activeCategories = {};

    function updateVisibility() {
    var filter = ['any']; // Initialize with 'any' to ensure at least one condition is true

    for (var categoryId in activeCategories) {
        if (activeCategories.hasOwnProperty(categoryId)) {
            filter.push(['==', 'GEN_ZONE', parseInt(categoryId)]);
        }
    }

    map.setFilter('zoning-polygon', filter);
    }

// Initialize checkboxes and map filter
function initialize() {
    // Check all checkboxes by default
    var categoryIdsToMonitor = ['0', '1', '2', '4', '5', '6', '101', '201', '202'];
    categoryIdsToMonitor.forEach(function (categoryId) {
        document.getElementById('gen_zone_' + categoryId).checked = true;
        activeCategories[categoryId] = true;
    });

    // Update map filter
    updateVisibility();

    // Add event listeners for all checkboxes
    categoryIdsToMonitor.forEach(function (categoryId) {
        addCheckboxListener(categoryId);
    });
}

// Event listener for checkbox change
function addCheckboxListener(categoryId) {
    document.getElementById('gen_zone_' + categoryId).addEventListener('change', function () {
        if (this.checked) {
            activeCategories[categoryId] = true;
        } else {
            delete activeCategories[categoryId];
        }
        updateVisibility();
    });
}



// Initialize the checkboxes and map filter when the page loads
initialize();
    /*--------------------------------------------------------------------
    Yellow Belt
    --------------------------------------------------------------------*/

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
        'layout': {
            // Make the layer invisible by default.
            'visibility': 'none'
        }

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
            'fill-color': '#C2B280',
            'fill-opacity': 1,
            //'fill-outline-color': 'black'
        },
        'layout': {
            // Make the layer invisible by default.
            'visibility': 'none'
        }
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
            'fill-color': '#FFDEAD',
            'fill-opacity': 1,
            //'fill-outline-color': 'black'
        },
        'layout': {
            // Make the layer invisible by default.
            'visibility': 'none'
        }
    }); 

    // Get reference to the checkbox
    const detachedCheckbox = document.getElementById('detachedCheckbox');

    // Add event listener to checkbox to toggle layer visibility
    detachedCheckbox.addEventListener('change', function () {
        if (this.checked) {
            map.setLayoutProperty('yellowbelt', 'visibility', 'visible');
        } else {
        map.setLayoutProperty('yellowbelt', 'visibility', 'none');
        }
    });

    // Get reference to the checkbox
    const mixedCheckbox = document.getElementById('mixedCheckbox');

    // Add event listener to checkbox to toggle layer visibility
    mixedCheckbox.addEventListener('change', function () {
        if (this.checked) {
            map.setLayoutProperty('mixed_use', 'visibility', 'visible');
        } else {
        map.setLayoutProperty('mixed_use', 'visibility', 'none');
        }
    });

    // Get reference to the checkbox
    const otherCheckbox = document.getElementById('otherCheckbox');

    // Add event listener to checkbox to toggle layer visibility
    otherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            map.setLayoutProperty('others', 'visibility', 'visible');
        } else {
        map.setLayoutProperty('others', 'visibility', 'none');
        }
    });


    /*--------------------------------------------------------------------
    Building Height
    --------------------------------------------------------------------*/

    // add building height by neighborhood layer 
    map.addSource('building-height_neighborhood', {
        type: 'vector',
        url: 'mapbox://linforestli.ci2evl0o'
    });

    map.addLayer({
        'id': 'building_height_fill6',
        'type': 'fill', 
        'source': 'building-height_neighborhood',
        'source-layer': 'Downloads-6kfpdy',
        'paint':{
            // Define fill color based on population
            'fill-color': [
                'step', 
                ['get', 'height'], 
                '#C1E7EA', // Colour assigned to any values < first step
                5.81, '#82c0E0', // Colours assigned to values >= each step
                8.07, '#82A4E0',
                12.33, '#82BBE0',
                22.43, '#8293E0',
                50.86, '#9A82E0'
            ],
            'fill-outline-color': 'white'
        },
        'layout': {
            // Make the layer invisible by default.
            'visibility': 'none'
        }
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
        'source': 'building-height2',
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

    

    // Get reference to the checkbox
    const height1Checkbox = document.getElementById('height1Checkbox');

    // Add event listener to checkbox to toggle layer visibility
    height1Checkbox.addEventListener('change', function () {
        if (this.checked) {
            map.setLayoutProperty('building_height_fill1', 'visibility', 'visible');
        } else {
        map.setLayoutProperty('building_height_fill1', 'visibility', 'none');
        }
    });

    // Get reference to the checkbox
    const height2Checkbox = document.getElementById('height2Checkbox');

    // Add event listener to checkbox to toggle layer visibility
    height2Checkbox.addEventListener('change', function () {
        if (this.checked) {
            map.setLayoutProperty('building_height_fill2', 'visibility', 'visible');
        } else {
        map.setLayoutProperty('building_height_fill2', 'visibility', 'none');
        }
    });

    // Get reference to the checkbox
    const height3Checkbox = document.getElementById('height3Checkbox');

    // Add event listener to checkbox to toggle layer visibility
    height3Checkbox.addEventListener('change', function () {
        if (this.checked) {
            map.setLayoutProperty('building_height_fill3', 'visibility', 'visible');
        } else {
        map.setLayoutProperty('building_height_fill3', 'visibility', 'none');
        }
    });

    // Get reference to the checkbox
    const height4Checkbox = document.getElementById('height4Checkbox');

    // Add event listener to checkbox to toggle layer visibility
    height4Checkbox.addEventListener('change', function () {
        if (this.checked) {
            map.setLayoutProperty('building_height_fill4', 'visibility', 'visible');
        } else {
        map.setLayoutProperty('building_height_fill4', 'visibility', 'none');
        }
    });

    // Get reference to the checkbox
    const height5Checkbox = document.getElementById('height5Checkbox');

    // Add event listener to checkbox to toggle layer visibility
    height5Checkbox.addEventListener('change', function () {
        if (this.checked) {
            map.setLayoutProperty('building_height_fill5', 'visibility', 'visible');
        } else {
        map.setLayoutProperty('building_height_fill5', 'visibility', 'none');
        }
    });

    // Get reference to the checkbox
    const height6Checkbox = document.getElementById('height6Checkbox');

    // Add event listener to checkbox to toggle layer visibility
    height6Checkbox.addEventListener('change', function () {
        if (this.checked) {
            map.setLayoutProperty('building_height_fill6', 'visibility', 'visible');
            // Display the legend
            legend2.style.display = 'block';
        } else {
        map.setLayoutProperty('building_height_fill6', 'visibility', 'none');
        // Hide the legend
        legend2.style.display = "none";
        }
    });

    

});

/*--------------------------------------------------------------------
CREATE pop-up window
--------------------------------------------------------------------*/
// Add event listener to the map for click events on the 'building_height_fill6' layer
// 1) Return the name of the area in the console
map.on('click', 'building_height_fill6', (e) => {
    console.log(e);   
    let neiname = e.features[0].properties.AREA_DE8; // Extract the name of the area from the clicked feature's properties
    console.log(neiname); // Log the name of the area to the console

});

// 2) Event listener for changing cursor on mouse enter
map.on('mouseenter', 'building_height_fill6', () => {
    map.getCanvas().style.cursor = 'pointer'; 
});
// 3) Event listener for changing cursor on mouse leave
map.on('mouseleave', 'building_height_fill6', () => {
    map.getCanvas().style.cursor = ''; 
});

// 4) Event listener for showing popup on click
map.on('click', 'building_height_fill6', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Neighborhood:</b> " + e.features[0].properties.AREA_DE8 + "<br>" +
            "<b>Average Building Height:</b> " + e.features[0].properties.height) //Use click event properties to write text for popup
        .addTo(map); //Show popup on map
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
    'Commercial Residential',
    '',
    'Single Detached Zones (Yellowbelt)',
    'Mixed Use Zones',
    'Other Residential Zones'
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
    '#EC7063',
    '#FFFFFF',
    '#FFFF00',
    '#C2B280',
    '#FFDEAD'

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

// additional legend
const legendlabels2 = [
    '0 - 5.81',
    '5.81 - 8.07',
    '8.07 - 12.33',
    '12.33 - 22.43',
    '22.43 - 50.86',
    '> 50.86'
];

const legendcolours2 = [
    '#C1E7EA', 
    '#82c0E0', 
    '#82A4E0',
    '#82BBE0',
    '#8293E0',
    '#9A82E0'
];

//Declare legend variable using legend div tag
const legend2 = document.getElementById('neighborhood-legend');

//For each layer create a block to put the colour and label in
legendlabels2.forEach((label, i) => {
    const color = legendcolours2[i];

    const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    const key = document.createElement('span'); //add a 'key' to the row. A key will be the color circle

    key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    key.style.backgroundColor = color; // the background color is retreived from teh layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (color cirlce) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend2.appendChild(item); //add row to the legend
});


