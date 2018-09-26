<template>
  <div class="main">
  <body>
      <div class="container">

        <div class="row mt-5">
          <div class="col-lg-4 col-md-6">
            <div class="card mx-auto">
              <img class="card-img-top img-responsive" src="/thumb2.jpg" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">Gráfica</h5>
                <p class="card-text">Cobertura de energía en el país por departamento y municipio para el año 2015.</p>
                <router-link to="/grafica"><a href="#" class="btn btn-outline-primary float-right">Ver más</a></router-link>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-md-6">
            <div class="card mx-auto">
              <img class="card-img-top img-responsive" src="/thumb3.jpg" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">Mapa</h5>
                  <p class="card-text">Cobertura de energía y población en el país por departamento para el año 2015; plantas de generación de energía.</p>
                <router-link to="/mapa"><a href="#" class="btn btn-outline-primary float-right">Ver más</a></router-link>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-md-6">
            <div class="card mx-auto">
              <img class="card-img-top img-responsive" src="/thumb1.jpg" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">Integración</h5>
                <p class="card-text">Potencial de radiación solar en el país y generación de energía por combustible por departamento.</p>
                <router-link to="/integracion"><a href="#" class="btn btn-outline-primary float-right">Ver más</a></router-link>
              </div>
            </div>
          </div>

        </div>
        <router-view/>
      </div>
    </body>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";//importar el esri loader
export default {
  name: 'main',
  data(){
    return{
      showAlert: true
    }
  }
}
</script>
<style src="./styles.css" scoped>

</style>