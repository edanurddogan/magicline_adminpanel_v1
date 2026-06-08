<template>
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
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            OCPP Out Logs
          </div>
          <q-space />
          <!-- Arama Butonu -->
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
          <!-- Yenile Butonu -->
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
          <!-- Sürekli Yenile Butonu -->
          <q-toggle
            v-model="autorenew"
            :label="$t('autoRefresh')"
            icon="autorenew"
            color="green"
            @update:model-value="onAutorenewChange"
          />
          <q-space />
          <!-- Tam Ekran Butonu -->
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
</template>

<script>
import { defineComponent } from "vue";
import * as XLSX from "xlsx";

export default defineComponent({
  name: "OcppOutLogsPage",

  computed: {
    columns() {
      return [
        {
          name: "lines",
          label: this.$t("reports.logs"),
          align: "left",
          field: "line",
        },
      ];
    },
  },
  data() {
    return {
      rows: [],
      loading: false,
      filter: "",
      intervalId: null,
      autorenew: false,
      pagination: {
        rowsPerPage: 30,
      },
    };
  },
  mounted() {
    this.$setPageTitle("OCPP Out Logs");
    this.init();
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },

  methods: {
    init() {
      try {
        this.getList();
      } catch (error) {
        this.$logger.error("OcppOutLogs init", error);
      }
    },

    async getList() {
      try {
        this.loading = true;
        const response = await this.$api.get("getServerLog/ocpp_out/500/false");
        // QTable rows: lines array’ini objeye çeviriyoruz
        this.rows = response.data.lines.map((line, index) => ({
          id: index,
          line,
        }));
        //this.$logger.log("logs row", this.rows);
        this.loading = false;
      } catch (error) {
        this.$logger.error(error);
      }
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
    intervalGetList() {
      this.intervalId = setInterval(this.getList, 10000);
    },
    onAutorenewChange() {
      if (this.autorenew) {
        this.intervalGetList();
      } else {
        clearInterval(this.intervalId);
      }
    },
  },
});
</script>
