require([
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "dojo/domReady!"
], function(Map, MapView, SceneView) {

    const map2D = new Map ({
        basemap: "topo"
    });

    const mapView = new MapView ({
        container: "2D",
        map: map2D,
        center: [-74, 3],
        scale: 50000000
    });

    const map3D = new Map ({
        basemap: "topo"
    });

    const mapScene = new SceneView ({
        container: "3D",
        map: map3D,
        center: [-74, 3],
        scale: 500000000
    });
});