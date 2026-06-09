<template>
  <div class="row">
    <q-select
      class="locale-switcher"
      v-model="locale"
      :options="$i18n.availableLocales"
      dense
      borderless
      emit-value
      map-options
      options-dense
    >
      <template v-slot:option="scope">
        <q-item dense v-if="!scope.opt.group" v-bind="scope.itemProps">
          <img class="flag" :src="flagMap[scope.opt]" />
        </q-item>
      </template>
      <template v-slot:selected-item="scope">
        <img class="flag shadow-1" :src="flagMap[scope.opt]" />
      </template>
    </q-select>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import deFlag from "src/assets/flag/de.svg";
import enFlag from "src/assets/flag/en.svg";
import trFlag from "src/assets/flag/tr.svg";

export default defineComponent({
  data() {
    return {
      flagMap: {
        de: deFlag,
        en: enFlag,
        tr: trFlag,
      },
    };
  },
  computed: {
    locale: {
      get() {
        return this.$i18n.locale;
      },
      set(val) {
        val = val.split("-")[0];
        this.$i18n.locale = val;
        this.$q.lang.set(val);
        LocalStorage.set("language", val);
      },
    },
  },
});
</script>

<style>
.locale-switcher {
  max-width: 46pt;
  display: inline-block;
}
.flag {
  max-width: 32pt;
}
</style>
