<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container">
            <a class="navbar-brand" target="_blank" href="http://desarrolladores.esri.co/"><img id="logo" src='logo.png' alt="Logo Geogeeks"></a>
            <h4 class="text-white">Vue.js, ArcGIS y D3</h4>
            </div>
        </nav>

        <div class="container">
            <router-view/>
        </div>
    </div>
</template>

<script>
    var dojoConfig = {
        has: {
            "esri-featurelayer-webgl": 1
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./App.css" scoped>

</style>
