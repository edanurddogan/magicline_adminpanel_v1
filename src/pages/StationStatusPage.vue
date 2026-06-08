<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <!-- Heartbeat Filtreleme -->
  <div class="row q-pa-md">
    <q-card class="q-mx-auto" style="width: 1200px">
      <q-list class="flex justify-around">
        <!-- Başlangıç Tarihi Seçimi -->
        <q-item class="col-4">
          <q-input filled v-model="startDate" :label="$t('startDate')">
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

        <!-- Bitiş Tarihi Seçimi -->
        <q-item class="col-4">
          <q-input filled v-model="endDate" :label="$t('endDate')">
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

        <!-- Bölge Seçimi -->
        <q-item class="col-3">
          <q-select
            v-model="selectedRegion"
            :options="filteredRegions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            clearable
            outlined
            options-dense
            use-input
            :loading="loading"
            transition-show="scale"
            transition-hide="scale"
            :label="$t('region.regionSelect')"
            @filter="onFilterRegion"
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

        <!-- Liste Butonu -->
        <q-item class="col-1">
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
  </div>

  <!-- Heartbeat Tab -->
  <div class="q-mx-auto" style="max-width: 80%">
    <q-tabs
      v-model="tab"
      inline-label
      indicator-color="yellow"
      align="justify"
      class="bg-teal text-white shadow-2"
    >
      <q-tab
        name="online"
        icon="done_outline"
        label="Onlıne"
        @click="onlineTab"
      >
        <q-badge color="red" floating> {{ rows.length }}</q-badge>
      </q-tab>
      <q-tab
        name="offline"
        icon="flash_off"
        label="Offlıne"
        @click="offlineTab"
      />
    </q-tabs>
    <q-card class="q-mt-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div class="row q-pa-md">
        <q-card
          v-for="row in rows"
          :key="row.sessionId"
          class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-mb-md q-pr-xs"
        >
          <q-card-section
            class="bg-primary text-white text-center q-pa-none q-py-xs"
          >
            <div>{{ row.stationCode }}</div>
          </q-card-section>
          <q-card-section class="q-pa-none q-ma-none">
            <q-item class="col-12">
              {{ $t("station.connectionDate") }} : <br />
              {{ dateFormat(row.connectedAt) }}
            </q-item>
            <q-separator inset />
            <q-list class="row">
              <q-item class="column">
                <q-items-section> Heartbeat :</q-items-section>
                <q-items-section>
                  {{ dateFormat(row.lastHeartbeat) }}
                </q-items-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </q-card>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import axios from "axios";

export default defineComponent({
  components: {},
  computed: {},
  data() {
    return {
      loading: false,
      rows: [],
      filteredRows: [],
      filter: "",
      regions: [],
      filteredRegions: [],
      selectedRegion: "",

      startDate: new Date().toISOString().slice(0, 10) + " 00:00",
      endDate: new Date().toISOString().slice(0, 10) + " 23:59",
      tab: "online",
    };
  },
  async mounted() {
    document.title = `${firm.name}-Heartbeats`;
    this.init();
  },
  methods: {
    init() {
      try {
        this.getRegions();
        this.getList();
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

      //this.$logger.log(formatted);
      return formatted;
    },
    exportTable() {
      const data = this.rows;
      const fileName = "UserList";
      const exportType = exportFromJSON.types.xls;

      exportFromJSON({ data, fileName, exportType });
    },
    onlineTab() {
      console.log("onlineTab");
    },
    offlineTab() {
      console.log("offlineTab");
    },
    onFilterRegion(val, update) {
      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        this.filteredRegions = this.regions.filter((region) =>
          this.$normalizeTurkishString(region.name).includes(normalizedVal)
        );
      });
    },

    async getRegions() {
      try {
        this.loading = true;
        const response = await this.$api.get("getRegions");
        this.regions = this.filteredRegions = response?.data.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getRegions error", error);
      }
    },
    async getList() {
      try {
        this.loading = true;
        //const response = await this.$api.get("ocpp/getStationSessions");

        const response = await axios.get(
          "http://api.infaura.com:8010/ocpp/getStationSessions"
        );

        this.rows = response?.data.data;
        this.$logger.log("sessions", this.rows);
        this.loading = false;
      } catch (error) {
        this.$logger.error(error);
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
