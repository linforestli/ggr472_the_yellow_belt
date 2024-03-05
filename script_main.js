mapboxgl.accessToken = 'pk.eyJ1IjoibGluZm9yZXN0bGkiLCJhIjoiY2xzMjllcDBwMDh6ejJwcDBlazJxbnI1eSJ9.bdN98Gu22uwxkP8QpzvUZg'; 

const map = new mapboxgl.Map({
    container: 'main-map', 
    style: 'mapbox://styles/linforestli/cltdcstsl016c01qk2pyg7f8d',
    center: [-79.3838, 43.6504],
    zoom: 10,
});

map.on('load', () => {
    // Add wards layer to the map
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
                'property': 'GEN_ZONE',
                'type': 'categorical',
                'paint': {
                    'fill-color': "#0B0000"}
        }
}});
})