<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <!-- Station Filtreleme -->
  <div class="row q-pa-md">
    <q-card>
      <q-list class="row">
        <q-item>
          <!-- Başlangıç Tarihi Seçimi -->
          <q-input filled v-model="startDate">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="startDate" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="startDate" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <q-item>
          <!-- Bitiş Tarihi Seçimi -->
          <q-input filled v-model="endDate">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="endDate" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="endDate" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <q-item>
          <!-- İstasyon Seçimi -->
          <q-select
            ref="stationRef"
            v-model="selectedStation"
            :options="filteredStations"
            :label="$t('station.station')"
            outlined
            use-input
            options-dense
            option-value="id"
            option-label="name"
            transition-show="scale"
            transition-hide="scale"
            @filter="filterStations"
            :rules="[(val) => !!val || $t('requiredlabel')]"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("noresults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item>
        <q-item>
          <q-btn
            class="q-ml-md"
            color="primary"
            :label="$t('Listele')"
            @click="getList"
          >
            <q-tooltip>
              {{ $t("search") }}
            </q-tooltip>
          </q-btn>
        </q-item>
      </q-list>
    </q-card>
    <q-space />
  </div>
  <div>
    <!-- BootNotification ve Heartbeat Bilgisi -->
    <q-card v-if="heartbeatData?.id" class="q-pa-md" style="width: 80%">
      <q-list class="row">
        <q-item>
          <q-item-section>
            {{ $t("reports.bootNotifications") }} :
            <strong>{{ dateFormat(bootNotifications?.lastBootTime) }}</strong>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            {{ $t("reports.heartbeat") }} :
            <strong>{{ dateFormat(heartbeatData?.lastHeartbeatTime) }}</strong>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>

  <!-- Station Tablo -->
  <div class="q-pa-md">
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
          <div
            class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title"
          ></div>
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
          />
          <q-space />

          <q-btn
            :label="$t('export')"
            class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
            icon="cloud_download"
            @click="exportTable"
          />
        </div>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          <span> {{ message }}... </span>
        </div>
      </template>
    </q-table>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import * as XLSX from "xlsx";

export default defineComponent({
  computed: {
    columns() {
      return [
        {
          name: "connectorId",
          label: this.$t("station.connectorNumber"),
          align: "left",
          field: "connectorId",
        },
        {
          name: "eventTime",
          label: this.$t("date"),
          align: "left",
          sortable: true,
          field: (row) => this.dateFormat(row.eventTime),
        },
        {
          name: "errorCode",
          label: this.$t("station.errorCode"),
          align: "left",
          sortable: true,
          field: "errorCode",
        },
        {
          name: "status",
          label: this.$t("status"),
          align: "left",
          field: "status",
          sortable: true,
        },
        {
          name: "vendorErrorCode",
          label: this.$t("reports.vendorErrorCode"),
          align: "left",
          field: (row) => row.payload.vendorErrorCode,
          sortable: true,
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

      startDate: new Date().toISOString().slice(0, 10) + " 00:00",
      endDate: new Date().toISOString().slice(0, 10) + " 23:59",
      stations: [],
      heartbeatData: {},
      bootNotifications: [],
      filteredStations: [],
      selectedStation: "",
      stationLogData: {},
    };
  },
  async mounted() {
    document.title = `${firm.name}-${this.$t("reports.stationReport")}`;
    this.init();
  },
  methods: {
    init() {
      try {
        this.getStations();
      } catch (error) {}
    },

    dateFormat(date) {
      date = new Date(date);

      const options = {
        timeZone: "Europe/Istanbul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };

      const formatted = date
        .toLocaleString("tr-TR", options)
        .replace(/\. /g, ".") // Ay ve gün arasında nokta
        .replace(",", ""); // Virgülü kaldır

      //console.log(formatted);
      return formatted;
    },
    exportTable() {
      const table = this.$refs.table;
      const rows = table.filteredSortedRows; // sadece filtrelenmiş ve sıralanmışlar

      const data = rows.map((row) =>
        this.columns.map((col) =>
          typeof col.field === "function" ? col.field(row) : row[col.field]
        )
      );

      const header = this.columns.map((col) => col.label);
      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      XLSX.writeFile(workbook, "StationLogs.xlsx");
    },
    filterStations(val, update) {
      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        val === ""
          ? (this.filteredStations = this.stations)
          : (this.filteredStations = this.stations.filter((station) =>
              this.$normalizeTurkishString(station.name).includes(normalizedVal)
            ));
      });
    },
    async getStations() {
      try {
        const body = {
          available: null,
          stationElectricTypeId: null,
          isActive: true,
        };
        this.loading = true;
        const response = await this.$api.post("getStations", body);
        this.stations = this.filteredStations = response.data;
      } catch (error) {
        this.$logger.error("Error fetching getStations list:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },
    async getList() {
      try {
        this.loading = true;
        console.log("selectedStation", this.selectedStation);
        const response = await this.$api.get(
          `getStationsLogs/${this.selectedStation.id}`
        );
        this.stationLogData = response.data.data; // istasyona ait bilgiler
        this.bootNotifications = this.stationLogData.bootNotifications[0]; // İstasyona ait boot bildirimleri
        this.heartbeatData = this.stationLogData.heartbeats[0]; // İstasyona ait heartbeat bilgisi
        this.rows = this.stationLogData.statusNotifications; // İstasyona ait loglar
        this.$logger.log("data", this.stationLogData);
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
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
