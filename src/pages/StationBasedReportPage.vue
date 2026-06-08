<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <!-- Filtreleme -->
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
        <!-- Bayi Seçimi -->
        <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
          <q-item-section>
            <q-select
              v-model="selectedDealers"
              :options="filteredDealers"
              option-value="id"
              option-label="name"
              :label="$t('dealer.dealers')"
              :loading="loading"
              hide-selected
              map-options
              multiple
              clearable
              outlined
              dense
              options-dense
              use-input
              style="width: 100%"
              transition-show="scale"
              transition-hide="scale"
              @filter="
                (val, update) =>
                  filterList(val, update, 'dealers', 'filteredDealers')
              "
            >
              <template #prepend>
                <q-icon name="groups" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <!-- Bölge Seçimi -->
        <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-6 q-space">
          <q-item-section>
            <q-select
              v-model="selectedRegions"
              :options="filteredRegions"
              option-value="id"
              option-label="name"
              :label="$t('region.regions')"
              :loading="loading"
              hide-selected
              map-options
              multiple
              clearable
              outlined
              dense
              options-dense
              use-input
              style="width: 100%"
              transition-show="scale"
              transition-hide="scale"
              @filter="
                (val, update) =>
                  filterList(val, update, 'regions', 'filteredRegions')
              "
            >
              <template #prepend>
                <q-icon name="place" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>

        <!-- İstasyon Seçimi -->
        <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-6 column q-space">
          <q-item-section>
            <q-select
              v-model="selectedStations"
              :options="filteredStations"
              option-value="id"
              option-label="name"
              :label="$t('station.stations')"
              :loading="loading"
              hide-selected
              map-options
              multiple
              clearable
              outlined
              dense
              options-dense
              use-input
              style="width: 100%"
              transition-show="scale"
              transition-hide="scale"
              @filter="
                (val, update) =>
                  filterList(val, update, 'stations', 'filteredStations')
              "
            >
              <template #prepend>
                <q-icon name="ev_station" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <!-- Listele Butonu -->
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
  <!-- Toplam Kwh ve Tutar Kart -->
  <div class="row q-pa-md">
    <q-card>
      <q-list class="row justify-between">
        <q-item>
          <q-item-section>
            <q-item-label class="text-subtitle2 text-weight-medium">
              {{ $t("reports.totalkWh") }}:
            </q-item-label>
            <q-item-label class="text-h6 text-primary">
              {{
                rows.length
                  ? rows
                      .reduce((acc, r) => acc + Number(r.totalKwh ?? 0), 0)
                      .toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                  : "0.00"
              }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label class="text-subtitle2 text-weight-medium">
              {{ $t("reports.totalAmount") }}:
            </q-item-label>
            <q-item-label class="text-h6 text-positive">
              {{
                rows.length
                  ? rows
                      .reduce((acc, r) => acc + Number(r.totalAmount ?? 0), 0)
                      .toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) + " ₺"
                  : "0.00 ₺"
              }}
            </q-item-label>
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
  components: {},
  computed: {
    columns() {
      return [
        {
          name: "stationName",
          label: this.$t("station.stationName"),
          align: "left",
          field: "stationName",
          sortable: true,
        },
        {
          name: "totalKwh",
          label: this.$t("reports.totalkWh"),
          align: "left",
          sortable: true,
          field: (row) => row.totalKwh.toFixed(2),
        },
        {
          name: "totalAmount",
          label: this.$t("reports.totalAmount"),
          align: "left",
          sortable: true,
          field: (row) => row.totalAmount.toFixed(2),
        },
      ];
    },
  },
  data() {
    return {
      loading: false,
      rows: [],
      maximizedToggle: false,
      filter: "",
      isGrid: false,
      pagination: {
        rowsPerPage: 20,
      },

      startDate: new Date().toISOString().slice(0, 10) + " 00:00",
      endDate: new Date().toISOString().slice(0, 10) + " 23:59",
      dealers: [],
      filteredDealers: [],
      selectedDealers: [],
      regions: [],
      filteredRegions: [],
      selectedRegions: [],
      stations: [],
      filteredStations: [],
      selectedStations: [],
    };
  },
  async mounted() {
    document.title = `${firm.name}-${this.$t("reports.stationUsageReport")}`;
    this.init();
  },
  methods: {
    async init() {
      try {
        await this.getDealers();
        await this.getRegions();
        await this.getStations();
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
      try {
        const table = this.$refs.table;
        const rows = table.filteredSortedRows; // sadece filtrelenmiş ve sıralanmışlar

        const data = rows.map((row) =>
          this.columns.map((col) =>
            typeof col.field === "function" ? col.field(row) : row[col.field],
          ),
        );

        const header = this.columns.map((col) => col.label);
        const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
        //Sütun sabit genişlik verme
        worksheet["!cols"] = [
          { wch: 30 }, // 1. sütun
          { wch: 20 }, // 2. sütun
          { wch: 20 }, // 3. sütun
        ];
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        XLSX.writeFile(workbook, "StationUsageReport.xlsx");
      } catch (error) {}
    },
    filterList(val, update, sourceList, filterList) {
      const source = this[sourceList];
      const normalizedVal = this.$normalizeTurkishString(val);

      update(() => {
        this[filterList] =
          val === ""
            ? source
            : source.filter((item) =>
                this.$normalizeTurkishString(item.name).includes(normalizedVal),
              );
      });
    },
    async getDealers() {
      try {
        if (!this.dealersLoaded) {
          this.loading = true;
          const response = await this.$api.get("getDealers");
          this.dealers = this.filteredDealers = response?.data.data;
          this.loading = false;
          this.dealersLoaded = true;
        }
      } catch (error) {
        this.$logger.error("getDealers error", error);
      }
    },
    async getRegions() {
      try {
        if (!this.regionsLoaded) {
          this.loading = true;
          const response = await this.$api.get("getRegions");
          this.regions = this.filteredRegions = response?.data.data;
          this.loading = false;
          this.regionsLoaded = true;
        }
      } catch (error) {
        this.$logger.error("getRegions error", error);
      }
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
        const body = {
          startDate: this.startDate,
          endDate: this.endDate,
          dealers: this.selectedDealers,
          stationRegions: this.selectedRegions,
          stations: this.selectedStations,
        };
        this.$logger.log("body", body);
        const response = await this.$api.post("getStationBasedReport", body);

        this.rows = response.data.data;
        this.$logger.log("data", this.rows);
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
