<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>

<template>
  <div class="q-mx-auto q-mt-md" style="max-width: 80%">
    <!-- Tab Menü -->
    <q-tabs
      v-model="tab"
      inline-label
      align="justify"
      class="text-white shadow-2"
    >
      <q-tab
        name="online"
        icon="done_outline"
        label="Onlıne"
        class="bg-teal"
        @click="onlineTab"
      >
        <q-badge color="red" floating> {{ rowsOnline.length }}</q-badge>
      </q-tab>
      <q-tab
        name="offline"
        icon="flash_off"
        label="Offlıne"
        class="bg-orange-6"
        @click="offlineTab"
      >
        <q-badge color="red" floating> {{ rowsOffline.length }}</q-badge>
      </q-tab>
    </q-tabs>

    <!-- İstasyon Bilgileri -->
    <q-table
      ref="table"
      flat
      dense
      bordered
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :pagination="pagination"
      :loading-label="$t('loading')"
      :no-data-label="$t('nodatalabel')"
      :no-results-label="$t('noresultslabel')"
      row-key="id"
    >
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("reports.stationLogs") }}
          </div>
          <q-space />
          <q-input
            class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
            bottom-slots
            dense
            debounce="300"
            v-model="filter"
            :placeholder="$t('users.search')"
          >
            <template v-slot:append
              ><q-icon
                v-if="filter !== ''"
                name="close"
                @click="filter = ''"
                class="cursor-pointer"
              />
              <q-icon name="search" />
            </template>
          </q-input>
          <q-space />
          <q-btn
            flat
            round
            dense
            icon="refresh"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="getList"
          >
            <q-tooltip>
              {{ $t("refresh") }}
            </q-tooltip>
          </q-btn>
          <q-space />
          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
          >
            <q-tooltip>
              {{ $t("maximize") }}
            </q-tooltip>
          </q-btn>
          <q-space />

          <q-btn
            :label="$t('export')"
            class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
            icon="cloud_download"
            @click="exportTable"
          />
        </div>
      </template>

      <!-- İşlemler Butonları -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            dense
            size="sm"
            no-caps
            :label="$t('reports.logs')"
            color="secondary"
            class="q-pa-xs"
            @click="getStationLogs(props.row)"
          />
        </q-td>
      </template>
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        ></div>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          <span> {{ message }}... </span>
        </div>
      </template>
    </q-table>
  </div>

  <!-- Station Logs Form Dialog -->
  <q-dialog
    v-model="formVisible"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 90vw; min-height: 75vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-sm">
          <q-icon name="price_change" />

          <q-toolbar-title>
            <span class="text-weight-bold">
              {{ $t("reports.stationLogs") }} -
              {{ currentRow.stationCode }}
            </span>
          </q-toolbar-title>

          <q-btn
            dense
            flat
            icon="close_fullscreen"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          >
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">
              {{ $t("minimize") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            flat
            icon="open_in_full"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">
              {{ $t("maximize") }}
            </q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">
              {{ $t("close") }}
            </q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section class="scroll q-pa-sm">
        <StationLogsForm
          class="q-pa-sm"
          :model-value="currentRow"
          @completed="onFormCompleted"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import * as XLSX from "xlsx";
import StationLogsForm from "src/components/forms/StationLogsForm.vue";

export default defineComponent({
  components: {
    StationLogsForm,
  },
  computed: {
    columns() {
      return [
        {
          name: "stationCode",
          label: this.$t("station.stationCode"),
          align: "left",
          sortable: true,
          field: "stationCode",
        },
        {
          name: "bootNotifications",
          label: this.$t("reports.bootNotifications"),
          align: "left",
          sortable: true,
          field: (row) => this.formatDateTR(row.connectedAt),
        },
        {
          name: "heartbeat",
          label: this.$t("reports.heartbeat"),
          align: "left",
          sortable: true,
          field: (row) => this.formatDateTR(row.lastHeartbeat),
        },
        {
          name: "action",
          label: this.$t("action"),
          field: (row) => row,
          align: "center",
        },
      ];
    },
  },
  data() {
    return {
      loading: false,
      rows: [],
      filter: "",
      isGrid: false,
      pagination: {
        rowsPerPage: 20,
      },

      // Tam liste
      rowsOnline: [],
      rowsOffline: [],

      // Filtrelenmiş listeler
      filteredOnlineRows: [],
      filteredOfflineRows: [],

      // Ekranda gösterilen (aktif taba göre)
      formVisible: false,
      maximizedToggle: false,
      currentRow: {},

      tab: "online",
      searchTerm: "",
    };
  },
  mounted() {
    document.title = `${firm.name}-${this.$t("reports.stationReport")}`;
    this.init();
  },
  methods: {
    init() {
      try {
        this.getList();
      } catch (error) {}
    },

    formatDateTR(dateStr) {
      try {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");

        return `${day}.${month}.${year} ${hour}:${minute}`;
      } catch (error) {}
    },

    onlineTab() {
      // Tab değişince de filtreli listeyi kullan
      this.rows = this.filteredOnlineRows;
    },
    offlineTab() {
      this.rows = this.filteredOfflineRows;
    },

    async getList() {
      try {
        this.loading = true;
        const response = await this.$api.get("sas/getStationSessions");

        this.rowsOnline = this.filteredOnlineRows =
          response.data.data?.online || [];
        this.rowsOffline = this.filteredOfflineRows =
          response.data.data?.offline || [];

        // Başlangıçta online olanları göster
        this.rows = this.filteredOnlineRows;
        this.$logger.log("Station Sessions:", this.rows);
        this.loading = false;
      } catch (error) {
        this.$logger.error(error);
      }
    },

    getStationLogs(row) {
      try {
        this.currentRow = row;
        this.formVisible = true;
      } catch (error) {
        this.$logger.error(error);
      }
    },
    exportTable() {
      const table = this.$refs.table;
      const rows = table.filteredSortedRows; // sadece filtrelenmiş ve sıralanmışlar

      const data = rows.map((row) =>
        this.columns.map((col) =>
          typeof col.field === "function" ? col.field(row) : row[col.field],
        ),
      );

      const header = this.columns.map((col) => col.label);
      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      XLSX.writeFile(workbook, "StationLogs.xlsx");
    },
  },
});
</script>

<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s
.my-sticky-header-table
  /* height or max-height is important */
  max-height: 600px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
