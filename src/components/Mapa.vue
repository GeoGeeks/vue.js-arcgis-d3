<template>
    <div class="mapa" id="mapa">
        <div class="jumbotron py-1">
            <div class="row h-100 py-0">
                <div class="col-lg-8 col-md-7">
                    <div id="viewDiv" class="h-100"></div>
                </div>
                <div class="col-lg-4 col-md-5 d-flex flex-column justify-content-center">
                    <h3 class="mb-5 text-emph">Cobertura de energía y plantas de generación</h3>
                    <p class="text-white">
                        Actualmente Colombia cuenta con una cobertura energética del 97% y se espera que para el 2030 sea del 100%. Adicionalemente, existen 176 plantas de generación de energía, de las cuales la mayor parte (122) corresponde a proyectos hidroeléctricos y solo uno a un parque eólico.
                    </p>
                    <span><router-link to="/main"><i class="fas fa-arrow-alt-circle-left"></i> Regresar</router-link></span>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

import { loadModules } from "esri-loader";
export default {
    name: 'mapa',
    data(){
        return {showAlert: true}
    },
    methods: {
        createMap() {

            const options = {
            url: "https://js.arcgis.com/4.8/"
        };

        // Cargar modulos que se utilizan en el api de javascript
        loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/widgets/Expand",
            "esri/widgets/Legend",

            "esri/core/watchUtils",
            "dojo/query",
            "dojo/aspect",
            "dojo/domReady!"
            ], options
        ).then(([Map, MapView, FeatureLayer, Expand, Legend, watchUtils, dojoQuery, aspect]) => {

            // Acceder y declarar las diferentes capas
            const coberturaMun = new FeatureLayer({
                url: "https://services.arcgis.com/8DAUcrpQcpyLMznu/arcgis/rest/services/Energia_Municipios_WFL1/FeatureServer/4"
            });

            const coberturaDpto = new FeatureLayer({
                portalItem: {
                    id: "e83d766e082647d79a913275641a955a"
                }
            });

            const estacionesEnergia1 = new FeatureLayer({
                portalItem: {
                    id: "9e34b2529e6a4b1ab9d4af2fdec8018f"
                }
            });

            // const estacionesEnergia2 = new FeatureLayer({
            //     portalItem: {
            //         id: "9e34b2529e6a4b1ab9d4af2fdec8018f"
            //     }
            // });


            // Crear mapa
            const map = new Map({
                layers: [coberturaMun, coberturaDpto, estacionesEnergia1]
            });

            // Crear vista del mapa
            const view = new MapView({
                map: map,
                container: "viewDiv",
                ui: {
                    components: [ "attribution" ]
                }
            });

            // Desabilitar zoom y panning
            view.on("key-down", function(event){
                var prohibitedKeys = [ "+", "-", "Shift", "_", "=" ];
                var keyPressed = event.key;
                if(prohibitedKeys.indexOf(keyPressed) !== -1){
                    event.stopPropagation();
                }
            });

            view.on("mouse-wheel", function(event){
                event.stopPropagation();
            });

            view.on("double-click", function(event){
                event.stopPropagation();
            });

            view.on("double-click", ["Control"], function(event){
                event.stopPropagation();
            });

            view.on("drag", function(event){
                event.stopPropagation();
            });

            view.on("drag", ["Shift"], function(event){
                event.stopPropagation();
            });

            view.on("drag", ["Shift", "Control"], function(event){
                event.stopPropagation();
            });


            // Mostrar tooltip para hover
            view.whenLayerView(coberturaDpto).then(setupHoverTooltip);

            function setupHoverTooltip(layerview) {
                var promise;
                var highlight;
                var tooltipHTML;

                var tooltip = createTooltip();
                console.log(tooltip);

                view.on("pointer-move", function(event) {
                    if (promise) {
                        promise.cancel();
                    }

                    promise = view.hitTest(event.x, event.y)
                        .then(function(hit) {
                            promise = null;

                            if (highlight) {
                                highlight.remove();
                                highlight = null;
                            }

                            var results = hit.results.filter(function(result) {
                                return result.graphic.layer === coberturaDpto;
                            });

                            if (results.length) {
                                var graphic = results[0].graphic;
                                var screenPoint = hit.screenPoint;

                                tooltipHTML = `
                                    <p class="text-emph">${graphic.getAttribute("NOMBRE_DPT")}</p>
                                    <p>
                                        Cobertura: <span class="text-emph">${graphic.getAttribute("Cobertura")}%</span>
                                        <br>
                                        Población: <span class="text-emph">${graphic.getAttribute("Poblacion")}</span>
                                    </p>
                                `;


                                highlight = layerview.highlight(graphic);
                                tooltip.show(screenPoint, tooltipHTML);
                            } else {
                                tooltip.hide();
                            }
                        });
                    });
                }

            function createTooltip () {
                var tooltip = document.createElement("div");
                var style = tooltip.style;

                tooltip.setAttribute("role", "tooltip");
                tooltip.classList.add("tooltip");

                var textElement = document.createElement("div");
                textElement.classList.add("esri-widget");
                tooltip.appendChild(textElement);

                view.container.appendChild(tooltip);

                var x = 0;
                var y = 0;
                var targetX = 0;
                var targetY = 0;
                var visible = false;

                function move () {
                    x += (targetX - x) * 0.1;
                    y += (targetY - y) * 0.1;

                    if (Math.abs(targetX - x) < 1 && Math.abs(targetY - y) < 1) {
                        x = targetX;
                        y = targetY;
                    } else {
                        requestAnimationFrame(move);
                    }

                    style.transform = "translate3d(" + Math.round(x) + "px," + Math.round(y) + "px, 0)";
                }

                return {
                    show: function (point, text) {
                        if (!visible) {
                            x = point.x;
                            y = point.y;
                        }

                        targetX = point.x;
                        targetY = point.y;
                        style.opacity = 1;
                        visible = true;
                        textElement.innerHTML = text;

                        move();
                    },

                    hide: function () {
                        style.opacity = 0;
                        visible = false;
                    }
                };
            }

            // Añadir fuentes
            const sourceHtml = `<span class="text-white">Fuente:</span> <a href="http://arcgis.simec.gov.co:6080/arcgis/rest/services" target="_blank">UPME<a/>`;

            coberturaDpto.watch("loaded", function(){
                watchUtils.whenFalseOnce(view, "updating", function(){
                    var attribs = dojoQuery(".esri-attribution__powered-by")[0];
                    attribs.innerHTML = sourceHtml;
                });
            });

            // Añadir leyenda
            const legend = new Expand({
                content: new Legend ({
                    view: view,
                    style: "card",
                    layerInfos: [{
                        title: "Plantas de generación",
                        layer: estacionesEnergia1
                    }]
                }),
                view: view
            });

            watchUtils.when(legend, "container", function() {
                aspect.after(legend, "scheduleRender", function(response) {
                    if (dojoQuery('.esri-legend--card__layer-caption')[0]) {
                        dojoQuery('.esri-legend--card__layer-caption')[0].innerHTML= 'Tipo de planta';
                    }
                });
            });

            view.ui.add(legend, "bottom-left");





        });


        }
    },
    mounted() {
        this.createMap();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./mapa.css">

</style>
