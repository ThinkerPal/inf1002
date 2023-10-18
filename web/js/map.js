let map;
let marker;
let heatmap;

function initMap() {
  // Create a map centered on Singapore
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 1.3521, lng: 103.8198 },
    zoom: 12,
  });
}

function showLocation() {
  const locationInput = document.getElementById("searchbox-home").value;

  // Use the Geocoding service to get the coordinates of the entered location
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: locationInput }, function (results, status) {
    if (status === "OK" && results[0]) {
      const location = results[0].geometry.location;

      // Remove existing marker, if any
      if (marker) {
        marker.setMap(null);
      }

      // Create a marker for the specified location
      marker = new google.maps.Marker({
        map: map,
        position: location,
        title: locationInput,
      });

      // Center the map on the specified location and zoom in
      map.setCenter(location);
      map.setZoom(15); // Adjust the zoom level as needed
    } else {
      alert("Location not found.");
    }
  });
}

function showHeatmap() {
  // points = {};
  console.log("Heatmap loading..")
  axios.get(`${API_URL}/heatmap?start=2020&end=2023`).then((res) => {
    let heatmapData = res.data?.map((row) => {
      return {
        location: new google.maps.LatLng(row.latitude, row.longitude),
        weight: row.adjusted_resale_price
      }
    });
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      options: {
        radius: 20
      }
    });
    heatmap.setMap(map)
    toggleHeatmap()
  })
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}



function displaySelectedLocations(selectedLocations) {
  // Clear all existing markers
  if (marker) {
    marker.setMap(null);
  }

  // Create a LatLngBounds object to fit all selected locations on the map
  const bounds = new google.maps.LatLngBounds();

  // Define LatLngBounds for Singapore
  const singaporeBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(1.1453, 103.6058), // Southwest coordinates
    new google.maps.LatLng(1.4721, 104.1376) // Northeast coordinates
  );

  // Iterate through the selected locations and create markers for each
  selectedLocations.forEach(function (locationInput) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: locationInput }, function (results, status) {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;

        // Check if the location is within Singapore's bounds
        if (singaporeBounds.contains(location)) {
          // Create a marker for the specified location
          marker = new google.maps.Marker({
            map: map,
            position: location,
            title: locationInput,
          });

          // Extend the bounds to include this marker
          bounds.extend(location);
          map.setZoom(15); // Adjust the zoom level as needed
        }
      } else {
        console.log("Location not found:", locationInput);
      }
    });
  });
  
  // Fit the map to the bounds containing all selected locations within Singapore
  map.fitBounds(bounds);
  

}
showHeatmap()
$(".costHeatmap").click(() => {
  toggleHeatmap();
})
window.initMap = initMap;
