<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <q-table
      ref="table"
      flat
      bordered
      class="statement-table"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :loading-label="$t('loading')"
      no-data-label="I didn't find anything for you"
      no-results-label="The filter didn't uncover any results"
      row-key="id"
    >
      <template v-slot:body-cell="props">
        <q-td :props="props">
          {{ props.value }}
        </q-td>
        <q-menu touch-position context-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section @click="clickMenu(props.row)"
                >Open...</q-item-section
              >
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>New</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("pages.paymentTransactions") }}
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

      <template #body-cell-isActive="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.isActive === true ? 'green' : 'red'"
            text-color="white"
            dense
            class="text-weight-bolder"
            square
          >
            {{
              props.row.isActive
                ? $t("cardRegistered")
                : $t("cardNotRegistered")
            }}
          </q-chip>
        </q-td>
      </template>
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="secondary"
            icon="currency_exchange"
            @click="onEdit(props.row)"
            g-btn
          />
          <q-tooltip>
            {{ $t("collect") }}
          </q-tooltip>
          <!-- <q-btn
            flat
            round
            color="negative"
            icon="delete_forever"
            @click="onDeleteUser(props.row)"
          /> -->
        </q-td>
      </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          <span> {{ message }}... </span>
        </div>
      </template>
    </q-table>

    <!-- Form Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 15vw; max-height: 50vh">
        <q-card-section class="q-pa-sm">
          <div class="column items-center">
            <div class="text-h6 q-mb-md">{{ $t("shouldWeStartPaying") }}</div>
            <div class="row q-gutter-sm">
              <q-btn color="primary" label="Evet" @click="onPaymentConfirm" />
              <q-btn
                color="secondary"
                label="İptal"
                @click="formVisible = false"
                v-close-popup
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="deleteConfirm" persistent>
      <q-card class="q-pa-md text-center">
        <q-card-section>
          <q-avatar
            size="56px"
            icon="delete_forever"
            color="negative"
            text-color="white"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6 q-mb-sm">{{ $t("reseller.deleteConfirm") }}</div>
          <div class="text-subtitle2">
            {{ $t("reseller.selectedReseller") }} : <b>{{ currentRow.name }}</b>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('delete')"
            color="negative"
            @click="deleteReseller()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import * as XLSX from "xlsx";
import { Platform } from "quasar";

export default defineComponent({
  components: {},
  data() {
    return {
      rows: [],
      filter: "",
      loading: true,
      formVisible: false,
      deleteConfirm: false,
      maximizedToggle: false,
      currentMode: "add",
      currentRow: null,
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "nameSurname",
          label: this.$t("paymentTransactions.nameAndSurname"),
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "mail",
          label: this.$t("paymentTransactions.mail"),
          field: "mail",
          align: "left",
          sortable: true,
        },
        {
          name: "telephone",
          label: this.$t("paymentTransactions.telephone"),
          field: "telephone",
          align: "left",
          sortable: false,
        },
        {
          name: "stationCode",
          label: this.$t("paymentTransactions.stationCode"),
          field: "stationCode",
          align: "left",
          sortable: false,
        },
        {
          name: "energyUsed",
          label: this.$t("paymentTransactions.energyUsed"),
          field: "energyUsed",
          align: "left",
          sortable: false,
        },
        {
          name: "total",
          label: this.$t("paymentTransactions.total"),
          field: "total",
          align: "left",
          sortable: false,
        },
        {
          name: "transactionNumber",
          label: this.$t("paymentTransactions.transactionNumber"),
          field: "transactionNumber",
          align: "left",
          sortable: false,
        },
        {
          name: "startDate",
          label: this.$t("paymentTransactions.startDate"),
          field: "startDate",
          align: "left",
          sortable: false,
        },

        {
          name: "action",
          label: this.$t("action"),
          field: (row) => row,
          align: "center",
        },

        {
          name: "isActive",
          label: this.$t("status"),
          field: "isActive",
          align: "center",
          sortable: true,
        },
      ];
    },
  },

  async mounted() {
    this.init();
  },
  methods: {
    init() {
      document.title = `${firm.name}-${this.$t("pages.paymentTransactions")}`;
      this.getList();
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onEdit(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onView(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onPaymentConfirm() {
      this.formVisible = false;
      this.$q.notify({
        type: "positive",
        message: this.$t(""),
      });
    },

    exportTable() {
      const table = this.$refs.table;
      const rows = table.filteredSortedRows; // sadece filtrelenmiş ve sıralanmışlar
      // İstenmeyen sütunlarını hariç tut
      const excludedLabels = ["İşlem"];
      const exportColumns = this.columns.filter(
        (col) => !excludedLabels.includes(col.label)
      );

      // Başlık ve Veri
      const header = exportColumns.map((col) => col.label);
      const data = rows.map((row) =>
        exportColumns.map((col) =>
          typeof col.field === "function" ? col.field(row) : row[col.field]
        )
      );

      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      worksheet["!cols"] = [
        { wch: 30 }, // 1. sütun
        { wch: 30 }, // 2. sütun
        { wch: 20 }, // 3. sütun
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      XLSX.writeFile(workbook, "PaymentTransactionsList.xlsx");
    },
    clickMenu(row) {
      this.$logger.log("Context menu clicked", row);
    },
    async getList() {
      try {
        const response = await this.$api.get("getDealers");
        this.$logger.log("DEALERS GET:", response.data);
        this.rows = response?.data || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getList error", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("error"),
        });
      }
    },
  },
});
</script>

<style lang="sass">
.my-sticky-header-table
  max-height: 600px
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    thead tr th
      position: sticky
      z-index: 1
    thead tr:first-child th
      top: 0
  &.q-table--loading thead tr:last-child th
    top: 48px
</style>
