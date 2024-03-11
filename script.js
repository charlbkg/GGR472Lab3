mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxvdHRlYmtnIiwiYSI6ImNscjlvYzM1OTA1MW8ya24xbjdmNHRhaWkifQ.H2WW8WJZiHWFksxymyigTw'; //Add default public map token from your Mapbox account
const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/charlottebkg/cltadlaho00nt01qkgei36fnn', // style URL
    center: [-71.09647636158911,
        42.386864529111335], // starting position [lng, lat]
    zoom: 17, // starting zoom
});
// Add zoom and rotation controls, position controls
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
//Adding data for pop-ups
map.on('load', () => {
    map.addSource('places', {
        'type': 'geojson',
        'data': 'https://raw.githubusercontent.com/charlbkg/GGR472Lab3/main/Resume.geojson'
    }
    );
    // Add a layer showing the places.
    // I wanted to keep the symbology from my mapbox style containing a tileset of the resume geoJSON,
    //but still add the popup functionality. So I loaded the same data for the tileset at a geoJSON and 
    //made the points transparent. This way the symbology of the style shows, and the pop-up still works.
    map.addLayer({
        'id': 'places-points',
        'type': 'circle',
        'source': 'places',
        'paint': {
            'circle-color': 'transparent',
            'circle-radius': 20,
            'circle-stroke-width': 2,
            'circle-stroke-color': 'transparent'
        }
    });

});
// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});
map.on('mouseenter', 'places-points', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.Description;
    console.log(coordinates)
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }


    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
});

map.on('mouseleave', 'places-points', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
});

//Add event listener which flys to the location of different experiences in order, based on start date
// Declare array with different locations
var idx = 0;

var arrayOfCoordinates = [
    [-71.09647636158911,
        42.386864529111335],
    [-71.12045953716331,
        42.40485109652886],
    [-71.09546999999995,
        42.388181492342085],
    [-79.39512071987686,
        43.66180471069458],
    [-110.97512919151158,
        32.21924161935728],
    [-79.41101088192067,
        43.651410286301285]
    [-79.3921882711636,
    43.670059880233595],
    [-79.39688282455593,
        43.658962367110036],
    [-79.39875551979807,
        43.66277746373467],
    [-79.39815458788371,
        43.658690449249775],
    [-79.41309927116498,
        43.664730119422074],
    [-79.40070651220746,
        43.65966022937468],
    [-79.39863470124627,
        43.662382585035175]
];
//Create event listener to fly to location when the button is clicked, and function that cycles through each point
document.getElementById('exp-button').addEventListener('click', function () {
    // Back to the first coordinate.
    if (idx >= arrayOfCoordinates.length) {
        idx = 0;
    }

    map.flyTo({
        zoom: 17,
        center: arrayOfCoordinates[idx],
    });

    idx++;
});
// Add event listener which allows the sute user to zoom to the full extent at any time
document.getElementById("fullextent-button").addEventListener('click', () => {
    map.flyTo({
        center: [-93.42314489540314,
            39.25359819924685],
        zoom: 4,
        essential: true
    });
});


