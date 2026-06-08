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
          <img class="flag" :src="'/assets/flag/' + scope.opt + '.svg'" />
        </q-item>
      </template>
      <template v-slot:selected-item="scope">
        <img
          class="flag shadow-1"
          :src="'/assets/flag/' + scope.opt + '.svg'"
        />
      </template>
    </q-select>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";

export default defineComponent({
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
