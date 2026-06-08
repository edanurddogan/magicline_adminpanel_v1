<template>
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
        <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title"></div>
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
        <!-- Otomatik yenileme Butonu -->
        <q-item class="row">
          <q-input
            type="number"
            v-model.number="autoRefreshInterval"
            class="col-lg-8 col-md-8 col-sm-8 col-xs-12"
            dense
            outlined
            :label="$t('reports.autoRefreshInterval')"
            @update:model-value="getAutoRefresh"
          />

          <q-btn
            :color="autoRefreshEnable ? 'positive' : ''"
            flat
            round
            dense
            icon="auto_mode"
            class="col-lg-4 col-md-4 col-sm-4 col-xs-12"
            @click="autoRefresh"
          >
            <q-tooltip>
              {{ $t("autoRefresh") }}
            </q-tooltip>
          </q-btn>
        </q-item>
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

    <template #body-cell-source="props">
      <q-td :props="props">
        <span class="text-primary cursor-pointer">
          {{ props.row.payload?.source || "-" }}
          <q-tooltip anchor="bottom middle" self="top middle">
            <div class="column">
              <div>
                <strong>{{ $t("users.nameSurname") }}:</strong>
                {{
                  props.row.payload.requestedBy?.name ||
                  props.row.payload.requestedBy?.surname ||
                  "-"
                }}
              </div>
              <div>
                <strong>{{ $t("vehicle.licensePlate") }}:</strong>
                {{ props.row.payload.requestedBy?.licensePlate || "-" }}
              </div>
            </div>
          </q-tooltip>
        </span>
      </q-td>
    </template>

    <template v-slot:no-data="{ icon, message, filter }">
      <div class="full-width row flex-center q-gutter-sm">
        <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
        <span> {{ message }}... </span>
      </div>
    </template>
  </q-table>
</template>

<script>
import { defineComponent } from "vue";
import * as XLSX from "xlsx";

export default defineComponent({
  name: "StationTransactionsListForm",
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    columns() {
      return [
        {
          name: "logTime",
          label: this.$t("reports.logTime"),
          align: "left",
          field: (row) => this.dateFormat(row.createdAt),
          sortable: true,
        },
        {
          name: "payload",
          label: "Log",
          field: (row) => JSON.stringify(row.payload),
          align: "left",
        },

        // {
        //   name: "stopTime",
        //   label: this.$t("endDate"),
        //   align: "left",
        //   field: (row) => this.dateFormat(row.stopTime),
        //   sortable: true,
        // },
        // {
        //   name: "meterStart",
        //   label: "meterStart",
        //   align: "center",
        //   field: "meterStart",
        //   sortable: true,
        // },
        // {
        //   name: "meterStop",
        //   label: "meterStop",
        //   align: "center",
        //   field: "meterStop",
        //   sortable: true,
        // },
        // {
        //   name: "idTag",
        //   label: this.$t("rfid.rfidTag"),
        //   align: "center",
        //   field: (row) => row.payload?.idTag,
        //   sortable: true,
        // },
        // {
        //   name: "Status",
        //   label: this.$t("status"),
        //   align: "left",
        //   field: "status",
        //   sortable: true,
        // },
        // {
        //   name: "source",
        //   label: this.$t("callCenter.source"),
        //   align: "left",
        //   field: (row) => row.payload?.source,
        //   sortable: true,
        // },
      ];
    },
  },
  data() {
    return {
      rows: [],
      loading: false,
      filter: "",
      intervalId: null,
      autoRefreshInterval: 10,
      autoRefreshEnable: false,
      autoRefreshIntervalId: null,
      pagination: { rowsPerPage: 20 },
    };
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    clearInterval(this.autoRefreshIntervalId);
  },

  methods: {
    init() {
      try {
        this.getList();
      } catch (error) {
        this.$logger.error("StationTransactionsListForm init", error);
      }
    },

    async getList() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          `getStationsLogsByStationCode/${this.modelValue.stationCode}`,
        );
        this.rows = response.data.data.stationLogTransactions;
        this.$logger.log("transactions row", this.rows);
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
          typeof col.field === "function" ? col.field(row) : row[col.field],
        ),
      );

      const header = this.columns.map((col) => col.label);
      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      XLSX.writeFile(workbook, "StationLogs.xlsx");
    },
    async autoRefresh() {
      this.autoRefreshEnable = !this.autoRefreshEnable;

      this.getAutoRefresh();
    },
    async getAutoRefresh() {
      clearInterval(this.autoRefreshIntervalId);
      if (this.autoRefreshEnable) {
        this.autoRefreshIntervalId = setInterval(() => {
          this.getList();
        }, this.autoRefreshInterval * 1000);
      } else {
        clearInterval(this.autoRefreshIntervalId);
      }
    },
  },
});
</script>
