<template>
  <div id="app">
    <nav>
      <router-link to="/">Home&nbsp;</router-link>
      <router-link to="/about">&nbsp;About&nbsp;</router-link>
      <router-link to="/chart1">&nbsp;Grafica1&nbsp;</router-link>
      <router-link to="/chart2">&nbsp;Grafica2&nbsp;</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
/* Estilos globales */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
