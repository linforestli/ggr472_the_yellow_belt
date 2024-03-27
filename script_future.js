function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();
  
//mapboxgl.accessToken = 'pk.eyJ1IjoibGluZm9yZXN0bGkiLCJhIjoiY2xzMjllcDBwMDh6ejJwcDBlazJxbnI1eSJ9.bdN98Gu22uwxkP8QpzvUZg'; 

// Create new map object
//const map = new mapboxgl.Map({
//    container: 'inside-map', 
//    style: 'mapbox://styles/linforestli/cltdcstsl016c01qk2pyg7f8d',
//    center: [-79.3838, 43.6504],
//    zoom: 10,
//});

//map.addControl(new mapboxgl.NavigationControl());
//map.addControl(new mapboxgl.FullscreenControl());

//map.on('load', () => {
//    // Add wards layer to the map
//    map.addSource('zoning-overlay-data', {
//        type: 'geojson',
//        data: 'https://raw.githubusercontent.com/linforestli/ggr472_the_yellow_belt/main/Data/Zoning Height Overlay.geojson' // Link to the data source
//    });

//    map.addLayer({
//        'id': 'zoning-overlay-polygon',
//        'type': 'fill',
//        'source': 'zoning-overlay-data',
//        'paint': {
//            'fill-opacity': 0.8,
//            'fill-color': '#FCF55F'
//        }
//    });
//})

