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
            {{ $t("website.contact") }}
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

      <template v-slot:body-cell-price="props">
        <q-td :props="props">
          <span v-if="props.row.discountRate > 0">
            <s>{{ props.row.price }}</s>
            <span class="q-ml-sm">{{ props.row.discountedUnitPrice }}</span>
          </span>
          <span v-else>
            {{ props.row.price }}
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
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>

<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import * as XLSX from "xlsx";

export default defineComponent({
  name: "OngoingTransactionsPage",
  computed: {
    columns() {
      return [
        {
          name: "id",
          label: "id",
          align: "left",
          field: (row) => row.id,
          sortable: true,
        },
        {
          name: "name",
          label: this.$t("region.region"),
          align: "left",
          field: (row) => row.name || "",
          sortable: true,
        },
        {
          name: "text",
          label: this.$t("text"),
          align: "left",
          field: (row) => row.text || "",
          sortable: true,
        },
        {
          name: "description",
          label: this.$t("description"),
          align: "left",
          field: (row) => row.description || "",
          sortable: true,
        },
        {
          name: "title",
          label: this.$t("title"),
          align: "left",
          sortable: true,
          field: (row) => row.title || "",
          sortable: true,
        },
        {
          name: "actions",
          label: this.$t("actions"),
          align: "left",
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
    };
  },

  mounted() {
    document.title = `${firm.name}-${this.$t("reports.ongoingTransactions")}`;
    this.init();
    this.intervalId = setInterval(this.getList, 10000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },

  methods: {
    async init() {
      this.getList();
    },

    async getList() {
      try {
        const response = await this.$api.get("getContacts");
        const payload = response?.data?.data ?? response?.data ?? [];
        this.rows = Array.isArray(payload) ? payload : [];

        this.$logger.log("contacts", this.rows);
      } catch (error) {
        this.rows = [];
        this.$logger.error("contacts", error);
      }
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

      XLSX.writeFile(workbook, "OnGoingTransactions.xlsx");
    },
  },
});
</script>

<style scoped></style>
