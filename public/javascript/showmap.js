
mapboxgl.accessToken = MapToken;
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/light-v11', // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 9, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl(),'bottom-left');

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
	new mapboxgl.Popup({offset:25})//this will add a pop up
	.setHTML(
		`<h4>${campground.title }</h4>
		<p>${campground.location}</p>`
	)
)
.addTo(map);