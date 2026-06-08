<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-table
        ref="table"
        flat
        dense
        bordered
        class="statement-table"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :filter="filter"
        :pagination="pagination"
        :loading-label="$t('loading')"
        no-data-label="I didn't find anything for you"
        no-results-label="The filter didn't uncover any results"
        row-key="id"
      >
        <template v-slot:top="props">
          <div class="row col-12">
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 q-table__title">
              {{ $t("reports.lastLogins") }}
            </div>

            <q-space />

            <q-input
              class="col-lg-4 col-md-6 col-sm-12 col-xs-12"
              bottom-slots
              dense
              debounce="300"
              v-model="filter"
              :placeholder="$t('users.search')"
            >
              <template v-slot:append>
                <q-icon
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
              class="q-ml-md"
              @click="getList"
            >
              <q-tooltip>{{ $t("refresh") }}</q-tooltip>
            </q-btn>

            <q-space />

            <q-btn
              flat
              round
              dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              class="q-ml-md"
            >
              <q-tooltip>{{ $t("maximize") }}</q-tooltip>
            </q-btn>
          </div>
        </template>

        <template v-slot:no-data="{ icon, message, filter }">
          <div class="full-width row flex-center q-gutter-sm">
            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
            <span>{{ message }}...</span>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import { formatDate } from "@vueuse/core";

export default defineComponent({
  name: "LastLogins",
  data() {
    return {
      rows: [],
      loading: false,
      filter: "",
      columns: [
        {
          name: "customer",
          required: true,
          label: this.$t("users.nameSurname"),
          align: "left",
          field: (row) => `${row.name || ""} ${row.surname || ""}`.trim(),
          sortable: true,
        },
        {
          name: "phone",
          required: true,
          label: this.$t("users.phone"),
          align: "left",
          field: (row) => row.phone || "-",
          sortable: true,
        },
        {
          name: "mobileOs",
          required: false,
          label: this.$t("reports.mobileOs"),
          align: "left",
          field: (row) => row.mobileOs || "-",
          sortable: true,
        },
        {
          name: "osVersion",
          required: false,
          label: this.$t("reports.osVersion"),
          align: "left",
          field: (row) => row.osVersion || "-",
          sortable: true,
        },
        {
          name: "appVersion",
          required: false,
          label: this.$t("reports.appVersion"),
          align: "left",
          field: (row) => row.appVersion || "-",
          sortable: true,
        },
        {
          name: "lastLoginDate",
          required: true,
          label: this.$t("reports.lastLogin"),
          align: "left",
          field: (row) => this.formatDate(row.lastLoginDate) || null,
          sortable: true,
        },
      ],
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: 10,
      },
    };
  },

  mounted() {
    this.getList();
    document.title = `${firm.name} - ${this.$t("reports.lastLogins")}`;
  },

  methods: {
    async getList() {
      try {
        this.loading = true;

        const body = { limit: 50 };

        const response = await this.$api.post("/getRecentLoginCustomer", body);

        this.rows = response?.data.data || [];

        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.rows = [];
        this.$logger?.error?.("Error getList:", error);
      }
    },

    formatDate(val) {
      if (!val) return "-";
      try {
        return new Date(val).toLocaleString("tr-TR");
      } catch (e) {
        return val;
      }
    },
  },
});
</script>
