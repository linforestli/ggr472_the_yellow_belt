mapboxgl.accessToken = 'pk.eyJ1IjoibGluZm9yZXN0bGkiLCJhIjoiY2xzMjllcDBwMDh6ejJwcDBlazJxbnI1eSJ9.bdN98Gu22uwxkP8QpzvUZg'; 

const map = new mapboxgl.Map({
    container: 'main-map', 
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-79.3838, 43.72],
    zoom: 10,
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
    // Add wards layer to the map
    map.addSource('zoning-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/linforestli/ggr472_the_yellow_belt/main/Data/Zoning Area.geojson' // Link to the data source
    });

    map.addSource('zoning-height', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/linforestli/ggr472_the_yellow_belt/main/Data/Zoning Height Overlay.geojson'
    })

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

    map.addLayer({
        'id': 'height-polygon',
        'type': 'fill',
        'source': 'zoning-height',
        'paint': {
            'fill-color': '#DEDEDE',
            'fill-opacity': 0.4,
            'fill-outline-color': 'black'
            
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



})

map.on('click', 'height-polygon', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Permitted maximum height (in m): </b> " + e.features[0].properties.HT_LABEL).addTo(map); //Show popup on map
});
