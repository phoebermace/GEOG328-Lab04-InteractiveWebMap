mapboxgl.accessToken = 'pk.eyJ1IjoicGhvZWJlbWFjZSIsImEiOiJjbHBiajVteGYwZGx5MnFveWpqNWQ4bWl5In0.hLWt7pwDPj_plteMfRY-uQ';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 6.6, // starting zoom
        center: [-121, 47.4] // starting center
    }
);

async function geojsonFetch() { 
    // other operations
    let response = await fetch('assets/wa-covid-data-102521.geojson');
    let covidData = await response.json();

    map.on('load', function loadingData() {
        // add layer
        map.addSource('covidData', {
            type: 'geojson',
            data: covidData
        });
        
        map.addLayer({
            'id': 'covidData-layer',
            'type': 'fill',
            'source': 'covidData',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'deathPer10k'],
                    '#f7fbff',   // stop_output_0
                    1,          // stop_input_0
                    '#d0ebfe',   // stop_output_1
                    5,          // stop_input_1
                    '#a6d4fa',   // stop_output_2
                    10,          // stop_input_2
                    '#73a9f7',   // stop_output_3
                    15,         // stop_input_3
                    '#4575b4',   // stop_output_4
                    20,         // stop_input_4
                    '#313695',   // stop_output_5
                    25,         // stop_input_5
                    '#081d58',   // stop_output_6
                    30,        // stop_input_6
                    "#000033"    // stop_output_7
                ],
                'fill-outline-color': '#555555',
                'fill-opacity': 0.7,
            }
        });
        // add legend
        const layers = [
            '0',
            '1-4',
            '5-9',
            '10-14',
            '15-19',
            '20-24',
            '25-29',
            '30 and more'
        ];
        const colors = [
            '#f7fbff70',
            '#d0ebfe70',
            '#a6d4fa70',
            '#73a9f770',
            '#4575b470',
            '#31369570',
            '#081d5870',
            '#00003370'
        ];

        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Covid Death Rate<br>(deaths/10k)</b><br><br>";

        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });
    });
}

geojsonFetch();

map.on('mousemove', ({point}) => {
    const county = map.queryRenderedFeatures(point, {
        layers: ['covidData-layer']
    });
    document.getElementById('text-description').innerHTML = county.length ?
        `<h3>${county[0].properties.name}</h3><p><strong><em>${county[0].properties.deathPer10k}</strong> death per 10k people </em></p>` :
        `<p>Hover over a county!</p>`;
});
