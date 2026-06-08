<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
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
      :no-data-label="$t('nodatalabel')"
      :no-results-label="$t('noresultslabel')"
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
            {{ $t("priceList.priceList") }}
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
            icon="add"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="onAdd"
          >
            <q-tooltip>
              {{ $t("priceList.addPriceInformation") }}
            </q-tooltip>
          </q-btn>
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
            {{ props.row.isActive ? $t("active") : $t("inactive") }}
          </q-chip>
        </q-td>
      </template>
      <!-- İşlemler Butonları -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="info"
            icon="history"
            @click="onHistory(props.row)"
          >
            <q-tooltip>{{ $t("production.transactionHistory") }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="primary"
            icon="info"
            @click="onView(props.row)"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("view") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="secondary"
            icon="edit"
            @click="onEdit(props.row)"
          >
            <q-tooltip>{{ $t("edit") }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="negative"
            icon="delete_forever"
            @click="onDelete(props.row)"
          >
            <q-tooltip>{{ $t("delete") }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          <span> {{ message }}... </span>
        </div>
      </template>
    </q-table>

    <!-- Price Form Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 60vw; max-height: 55vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="price_change" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("priceList.price") }}</span>
              {{ $t(currentMode) }}</q-toolbar-title
            >

            <q-btn
              dense
              flat
              icon="close_fullscreen"
              @click="maximizedToggle = false"
              :disable="!maximizedToggle"
            >
              <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">{{
                $t("minimize")
              }}</q-tooltip>
            </q-btn>
            <q-btn
              dense
              flat
              icon="open_in_full"
              @click="maximizedToggle = true"
              :disable="maximizedToggle"
            >
              <q-tooltip
                v-if="!maximizedToggle"
                class="bg-white text-primary"
                >{{ $t("maximize") }}</q-tooltip
              >
            </q-btn>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 60vh" class="scroll q-pa-sm">
          <price-form
            class="q-pa-sm"
            v-model="currentRow"
            :mode="currentMode"
            @completed="onFormCompleted"
          />
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
          <div class="text-h6 q-mb-sm">
            {{ $t("priceList.deletedConfirm") }}
          </div>
          <div class="text-subtitle2">
            {{ $t("priceList.priceName") }} : <b>{{ currentRow.name }}</b>
          </div>
        </q-card-section>

        <q-card-actions align="between">
          <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('delete')"
            color="negative"
            @click="deleteRow()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Price History Dialog -->
    <q-dialog
      v-model="formVisibleHistory"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 60vw; max-height: 55vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="price_change" />

            <q-toolbar-title
              ><span class="text-weight-bold">
                {{ $t("production.transactionHistory") }}</span
              >
            </q-toolbar-title>

            <q-btn
              dense
              flat
              icon="close_fullscreen"
              @click="maximizedToggle = false"
              :disable="!maximizedToggle"
            >
              <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">{{
                $t("minimize")
              }}</q-tooltip>
            </q-btn>
            <q-btn
              dense
              flat
              icon="open_in_full"
              @click="maximizedToggle = true"
              :disable="maximizedToggle"
            >
              <q-tooltip
                v-if="!maximizedToggle"
                class="bg-white text-primary"
                >{{ $t("maximize") }}</q-tooltip
              >
            </q-btn>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 60vh" class="scroll q-pa-sm">
          <q-table
            flat
            bordered
            class="statement-table"
            :rows="currentRow.chargePriceListHistories"
            :columns="columnsHistory"
            :loading="loading"
            :filter="filter"
            :loading-label="$t('loading')"
            :no-data-label="$t('nodatalabel')"
            :no-results-label="$t('noresultslabel')"
            row-key="id"
          >
            <template v-slot:top="props">
              <div class="row col-12">
                <q-space />
                <q-input
                  class="col-lg-3 col-md-3 col-sm-12 col-xs-12"
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
            <template v-slot:no-data="{ icon, message, filter }">
              <div class="full-width row flex-center q-gutter-sm">
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                <span> {{ message }}... </span>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import PriceForm from "src/components/forms/PriceForm.vue";
import * as XLSX from "xlsx";

export default defineComponent({
  name: "PriceListPage",
  components: {
    PriceForm,
  },
  data() {
    return {
      rows: [],
      filter: "",
      loading: true,
      formVisible: false,
      formVisibleHistory: false,
      deleteConfirm: false,
      maximizedToggle: false,
      currentMode: "add",
      currentRow: null,
      stationElectricTypes: [],
      pagination: { rowsPerPage: 20 },
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "name",
          label: this.$t("priceList.priceName"),
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "country",
          label: this.$t("firm.country"),
          field: (row) => row.country?.name,
          align: "left",
          sortable: true,
        },
        {
          name: "electricType",
          label: this.$t("priceList.electricType"),
          field: (row) =>
            this.stationElectricTypes.find(
              (c) => c.id === row.stationElectricTypeId
            )?.name || this.$t("unknown"),
          align: "left",
          sortable: true,
        },
        {
          name: "price",
          label: this.$t("priceList.unitPrice"),
          field: "price",
          align: "left",
          sortable: false,
        },
        {
          name: "currency",
          label: this.$t("finance.currency"),
          field: (row) => row.currency?.code,
          align: "left",
          sortable: true,
        },
        {
          name: "startDate",
          label: this.$t("production.transactionDate"),
          field: (row) => this.dateFormat(row.startDate),
          align: "left",
          sortable: true,
        },
        {
          name: "isActive",
          label: this.$t("status"),
          field: "isActive",
          align: "center",
          sortable: true,
        },
        {
          name: "action",
          label: this.$t("action"),
          field: (row) => row,
          align: "center",
        },
      ];
    },
    columnsHistory() {
      return [
        {
          name: "actionType",
          label: this.$t("action"),
          field: "actionType",
          align: "left",
          sortable: true,
        },
        {
          name: "name",
          label: this.$t("priceList.priceName"),
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "country",
          label: this.$t("firm.country"),
          field: (row) => (row.country ? row.country.name : this.$t("unknown")),
          align: "left",
          sortable: true,
        },
        {
          name: "electricType",
          label: this.$t("priceList.electricType"),
          field: (row) =>
            this.stationElectricTypes.find(
              (c) => c.id === row.stationElectricTypeId
            )?.name || this.$t("unknown"),
          align: "left",
          sortable: true,
        },
        {
          name: "price",
          label: this.$t("priceList.unitPrice"),
          field: "price",
          align: "left",
          sortable: false,
        },
        {
          name: "currency",
          label: this.$t("finance.currency"),
          field: "currency",
          align: "left",
          sortable: true,
        },
        {
          name: "startDate",
          label: this.$t("production.transactionDate"),
          field: (row) => this.dateFormat(row.startDate),
          align: "left",
          sortable: true,
        },
        {
          name: "employee",
          label: this.$t("firm.contactPerson"),
          field: (row) =>
            `${row.createdByUser?.name} ${row.createdByUser?.surname}`,
          align: "left",
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
      try {
        document.title = `${firm.name}-${this.$t("priceList.priceList")}`;
        this.getStationElectricTypes();
        this.getList();
      } catch (error) {
        this.$logger.error("Error initializing PricesListPage:", error);
      }
    },

    async getList() {
      try {
        this.loading = true;
        const response = await this.$api.get("getChargePriceLists");
        this.rows = response.data;
      } catch (error) {
        this.$logger.error("Error fetching price list:", error);
      } finally {
        this.loading = false;
      }
    },

    async getStationElectricTypes() {
      try {
        const response = await this.$api.get("/stationElectricTypes");
        this.stationElectricTypes = response.data;
      } catch (error) {
        this.$logger.error("Error getStationElectricTypes:", error);
      }
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onHistory(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.formVisibleHistory = true;
    },
    onView(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onEdit(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onDelete(row) {
      this.currentRow = row;
      this.deleteConfirm = true;
    },

    onFormCompleted() {
      this.formVisible = false;
      this.getList();
    },
    async deleteRow() {
      try {
        this.currentRow.isActive = false;
        await this.$api.put("/updateChargePriceList", this.currentRow);

        this.$q.notify({
          type: "positive",
          message: this.$t("priceList.priceDeleted"),
        });

        this.deleteConfirm = false;
        this.getList(); // listeyi yenile
      } catch (error) {
        this.$logger.error("Silme hatası:", error);
      }
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
      //Sütun sabit genişlik verme
      worksheet["!cols"] = [
        { wch: 30 }, // 1. sütun
        { wch: 30 }, // 2. sütun
        { wch: 20 }, // 3. sütun
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      XLSX.writeFile(workbook, "PriceList.xlsx");
    },

    clickMenu(row) {
      this.$logger.log("Context menu clicked", row);
    },

    dateFormat(date) {
      date = new Date(date);

      const options = {
        timeZone: "Europe/Istanbul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        //hour: "2-digit",
        //minute: "2-digit",
        //second: "2-digit",
        //hour12: false,
      };

      const formatted = date
        .toLocaleString("tr-TR", options)
        .replace(/\. /g, ".") // Ay ve gün arasında nokta
        .replace(",", ""); // Virgülü kaldır

      //this.$logger.log(formatted);
      return formatted;
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
