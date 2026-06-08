<template>
  <!-- Tab Menü -->
  <q-tabs
    v-model="tab"
    inline-label
    align="justify"
    class="text-white shadow-3"
  >
    <!-- İstasyon Logs Tab -->
    <q-tab
      name="logs"
      icon="article"
      :label="$t('reports.stationLogs')"
      class="bg-indigo-6"
      @click="onLogsTab"
    >
    </q-tab>
    <!-- İstasyon Transactions Tab -->
    <q-tab
      name="transactions"
      icon="list"
      :label="$t('station.stationActions')"
      class="bg-cyan-8"
      @click="onTransactionsTab"
    >
    </q-tab>
  </q-tabs>
  <!-- Tablo İçerik -->
  <component :is="currentComponent" :modelValue="modelValue" class="q-mt-sm" />
</template>

<script>
import { defineComponent } from "vue";
import StationLogsListForm from "./StationLogsListForm.vue";
import StationTransactionsListForm from "./StationTransactionsListForm.vue";

export default defineComponent({
  name: "StationLogsForm",
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    StationLogsListForm,
    StationTransactionsListForm,
  },
  computed: {},
  data() {
    return {
      tab: "logs",
      currentComponent: "StationLogsListForm",
    };
  },
  mounted() {},

  methods: {
    onLogsTab() {
      this.currentComponent = "StationLogsListForm";
    },
    onTransactionsTab() {
      this.currentComponent = "StationTransactionsListForm";
    },
  },
});
</script>
