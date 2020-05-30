/* eslint-disable */

export const displayMap = locations => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmVuZXdzcyIsImEiOiJjazlmeXpuZmowZ2FrM25zMHR1bGJ2YmFpIn0.R7ZOanpzWeSfJ7aB7WRiFw';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/renewss/ck9fzjwsx3y441itgrtvucvdk',
        center: [-108.113, 40.111],
        scrollZoom: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // App popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend map bounds to include all coordinates
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 100,
            bottom: 100,
            left: 100,
            right: 100
        }
    });
};
