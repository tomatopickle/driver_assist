<template>
  <v-container style="display: grid; height: 100%; flex-flow: column">
    <v-row>
      <v-col class="mb-4">
        <h1 class="font-weight-bold mt-2 ml-2 mb-3">Sorry!</h1>
        <br />
        <v-card elevation="2">
          <v-card-title>Please Correct Your Orientation</v-card-title>
          <v-card-text
            >Please turn your phone to landscape mode to use this
            app</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn elevated>View More</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-btn @click="$router.pop()" block color="primary" style="margin-top: auto"
      >Try Again</v-btn
    >
  </v-container>
</template>

<script>
export default {
  name: "orientationError",

  components: {},
};
</script>
