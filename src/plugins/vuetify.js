import Vue from "vue";
import { colors } from "vuetify/lib";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: { dark: true, themes: { dark: { primary: colors.teal } } },
});
