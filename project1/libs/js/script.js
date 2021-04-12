var mymap = L.map('geomap').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}.png?access-token=TYSKvo6e0lUYRYv5ujTkL8eta5s8dieFaH6MXVprzkPFc7X7JHZXfP5N4557o5dz', {
  minZoom: 0,
	maxZoom: 18,
	tileSize: 512,
	subdomains: 'abcd',
	zoomOffset: -1,
}).addTo(mymap);
mymap.attributionControl.addAttribution("<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors")
var marker = L.marker([51.505, -0.09]).addTo(mymap);
// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// function onMapClick(e) {
// 	marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// }

// mymap.on('click', onMapClick);
