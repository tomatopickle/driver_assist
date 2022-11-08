<template>
  <v-app>
    <v-app-bar v-if="currentRouteName != 'trip'" app color="primary" dark>
      <div class="d-flex align-center">
        <h2>Driver Assist</h2>
      </div>

      <v-spacer></v-spacer>

      <v-btn text fab>
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
};
</script>
<style>
html,
body {
  height: 100%;
}
.v-application,
.v-application--wrap {
  height: 100%;
  min-height: 100%;
  overflow-y: auto;
}
</style>
