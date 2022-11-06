<template>
  <v-container style="display: grid; height: 100%; flex-flow: column">
    <v-row>
      <v-col class="mb-4">
        <h1 class="font-weight-bold mt-2 ml-2 mb-3">Good Evening</h1>
        <br />
        <v-card elevation="2">
          <v-card-title>Stats</v-card-title>
          <v-card-text>Your driving statics show up here</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn elevated>View More</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <router-link to="./Trip" style="margin-top: auto">
      <v-btn block color="primary">Start Trip</v-btn>
    </router-link>
  </v-container>
</template>

<script>
export default {
  name: "Home",

  components: {},
};
</script>
