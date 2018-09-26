<template>
    <div class="integracion" id="integracion">
        <div class="jumbotron py-1">
            <div class="row container h-100">
                <div class="col-lg-8 col-md-7">
                    <div id="viewDiv" class="h-100"></div>
                </div>
                <div class="col-lg-4 col-md-5 d-flex flex-column justify-content-center">
                    <h3 class="mb-3 text-emph">Potencial de radiación solar</h3>
                    <svg width="300" height="200"></svg>
                    <!--<p class="text-white">-->
                        <!--Esta sera una frase.-->
                    <!--</p>-->
                    <span><router-link to="/main"><i class="fas fa-arrow-alt-circle-left"></i> Regresar</router-link></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import { loadModules } from "esri-loader";//importar el esri loader
export default {
    name: 'integracion',
    data(){
        return{
        showAlert: true
        }
    },

    mounted: function() {

        let data = [
            { name: 'Cobertura (97%)', value: 97, color:"red" },
            { name: '', value: 3, color:"#2F3241" },
        ];

        var svg = d3.select("svg");
        var width = +svg.attr('width');
        var height = +svg.attr('height');
        var margin = { top:20, left:0, bottom:30, right:0 };
        var chartWidth = width - (margin.left + margin.right);
        var chartHeight = height - (margin.top + margin.bottom);

        this.chartLayer = svg
            .append('g')
            .attr(
                "transform",
                `translate(${margin.left}, ${margin.top})`
            );

        this.arc = d3.arc()
            .outerRadius(chartHeight / 2)
            .innerRadius(chartHeight / 4)
            .padAngle(0.03)
            .cornerRadius(8);

        this.pieG = this.chartLayer
            .append("g")
            .attr(
                "transform",
                `translate(${chartWidth / 2}, ${chartHeight / 2})`
            );
        this.drawChart(data);
        this.createMap();
    },

    props: ['data'],
    watch: {
        data: function(newData) {
            this.drawChart(newData);
        }
    },

  //se declaran los metodos que se van a usar en la aplicacion
    methods: {
        createMap() {
            const options = {
                url: "https://js.arcgis.com/4.8/"
            };
            //se cargan los modulos que se usan del api de javascript
            loadModules(
                [
                    "esri/views/MapView",
                    //"esri/WebMap",
                    "esri/Map",
                    "esri/layers/FeatureLayer"
                ],
                options
            ).then(([MapView, /*WebMap,*/ Map, FeatureLayer]) => {

                const radiacionSolar = new FeatureLayer({
                    url: "http://arcgis.simec.gov.co:6080/arcgis/rest/services/UPME_EN/UPME_EN_Radiacion_Solar/MapServer/1"
                });

                const coberturaDpto = new FeatureLayer({
                    portalItem: {
                        id: "e83d766e082647d79a913275641a955a"
                    }
                });


                const map = new Map({
                    layers: [radiacionSolar, coberturaDpto]
                });

                const view = new MapView({
                    map: map,
                    container: "viewDiv",
                    ui: {
                        components: ["attribution"]
                    },
                });


                // Desabilitar zoom y panning
                view.on("key-down", function (event) {
                    var prohibitedKeys = ["+", "-", "Shift", "_", "="];
                    var keyPressed = event.key;
                    if (prohibitedKeys.indexOf(keyPressed) !== -1) {
                        event.stopPropagation();
                    }
                });

                view.on("mouse-wheel", function (event) {
                    event.stopPropagation();
                });

                view.on("double-click", function (event) {
                    event.stopPropagation();
                });

                view.on("double-click", ["Control"], function (event) {
                    event.stopPropagation();
                });

                view.on("drag", function (event) {
                    event.stopPropagation();
                });

                view.on("drag", ["Shift"], function (event) {
                    event.stopPropagation();
                });

                view.on("drag", ["Shift", "Control"], function (event) {
                    event.stopPropagation();
                });


                });

        },
        drawChart: function (data) {
            console.log("rendering this shit");

            var arcs = d3.pie()
                .sort(null)
                .value(function (d) {
                    return d.value;
                })
                (data);

            var block = this.pieG.selectAll(".arc")
                .data(arcs);

            block.select('path').attr('d', this.arc);

            var newBlock = block
                .enter()
                .append("g")
                .classed("arc", true);

            newBlock.append("path")
                .attr("d", this.arc)
                .attr("id", function (d, i) {
                    return "arc-" + i
                })
                .attr("stroke", "black")
                .attr("fill", "#9FEAF9");

            newBlock.append("text")
                .attr("dx", 10)
                .attr("dy", -5)
                .append("textPath")
                .attr("xlink:href", function (d, i) {
                    return "#arc-" + i;
                })
                .attr("fill", "white")
                .text(function (d) {
                    return d.data.name
                })
            }
    },
}
</script>

<style src="./styles.css" scoped>

</style>