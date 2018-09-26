import Vue from 'vue'
import Router from 'vue-router'
import Main from './components/Main.vue'
import Mapa from './components/Mapa.vue'
import Grafica from './components/Grafica.vue'
import Integracion from './components/Integracion.vue'

Vue.use(Router);

export default new Router({
  routes:[
    {
      path: '/main',
      name: 'main',
      component: Main
    },
    {
      path:'/mapa',
      name: 'mapa',
      component: Mapa
    },
    {
      path:'/grafica',
      name: 'grafica',
      component: Grafica
    },
    {
      path:'/integracion',
      name: 'integracion',
      component: Integracion
    }
  ]
})
