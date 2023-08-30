<style>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600&family=Roboto&display=swap');
@tailwind base; 
@tailwind components; 
@tailwind utilities;

@font-face {
  font-family: "Minecraft";
  src: url("assets/font/Minecraft.otf") format("opentype");
}

* {
/*  font-family: Roboto, sans-serif; */
  font-family: Minecraft, sans-serif;
}
</style>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {

  }
};
</script>
