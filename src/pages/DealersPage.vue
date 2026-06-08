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
            {{ $t("dealer.dealers") }}
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
          <!-- Ekleme Butonu -->
          <q-btn
            flat
            round
            dense
            icon="add"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="onAdd"
          >
            <q-tooltip>
              {{ $t("dealer.dealerAdd") }}
            </q-tooltip>
          </q-btn>
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
          <!-- Full Screen Butonu -->
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
          <!-- Export Excel Butonu -->
          <q-btn
            :label="$t('export')"
            class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
            icon="cloud_download"
            @click="exportTable"
          />
        </div>
      </template>
      <!-- Menu Butonu -->
      <template #body-cell-additionalInfo="props">
        <q-td :props="props">
          <q-btn flat dense color="primary" icon="more_vert">
            <q-menu transition-show="scale" transition-hide="scale">
              <q-list style="min-width: 100px">
                <!-- Bölgeler -->
                <q-item
                  clickable
                  @click="onMenu(props.row, 'DealerRegionsForm')"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      size="sm"
                      color="primary"
                      name="location_on"
                      class="q-mr-sm"
                    />
                    {{ $t("region.regions") }}
                  </div>
                </q-item>
                <q-separator />

                <!-- İstasyonlar -->
                <q-item
                  clickable
                  @click="onMenu(props.row, 'DealerStationsForm')"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      size="sm"
                      color="primary"
                      name="ev_station"
                      class="q-mr-sm"
                    />
                    {{ $t("station.stations") }}
                  </div>
                </q-item>
                <q-separator />

                <!-- Yetkili Kişi -->
                <q-item
                  clickable
                  @click="onMenu(props.row, 'DealerContactForm')"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      size="sm"
                      color="primary"
                      name="person"
                      class="q-mr-sm"
                    />
                    {{ $t("dealer.contactName") }}
                  </div>
                </q-item>
                <q-separator />
                <!-- Araçlar -->
                <q-item
                  clickable
                  @click="onMenu(props.row, 'DealerVehiclesForm')"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      size="sm"
                      color="primary"
                      name="electric_car"
                      class="q-mr-sm"
                    />
                    {{ $t("vehicle.vehicles") }}
                  </div>
                </q-item>
                <q-separator />
                <!-- İndirimler -->
                <q-item
                  clickable
                  @click="onMenu(props.row, 'DealerDiscountsForm')"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      size="sm"
                      color="primary"
                      name="percent"
                      class="q-mr-sm"
                    />
                    <span>{{ $t("discountList.discount") }}</span>
                  </div>
                </q-item>
                <q-separator />
                <!-- RFID -->
                <q-item
                  clickable
                  @click="onMenu(props.row, 'DealerRfidForm')"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      size="sm"
                      color="primary"
                      name="contactless"
                      class="q-mr-sm"
                    />
                    {{ $t("rfid.rfidCard") }}
                  </div>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
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
            dense
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
            dense
            round
            color="secondary"
            icon="edit"
            @click="onEdit(props.row)"
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              >{{ $t("edit") }}</q-tooltip
            >
          </q-btn>
          <q-btn
            flat
            dense
            round
            color="negative"
            icon="delete_forever"
            @click="onDelete(props.row)"
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              >{{ $t("delete") }}</q-tooltip
            >
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

    <!-- Form Dialog Dealer Add or Edit -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 75vw; max-height: 75vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("dealer.dealer") }}</span>
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
        <q-card-section class="q-pa-sm">
          <dealer-form
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
          <div class="text-h6 q-mb-sm">{{ $t("dealer.deleteConfirm") }}</div>
          <div class="text-subtitle2">
            {{ $t("dealer.selecteddealer") }} : <b>{{ currentRow.name }}</b>
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

    <!-- Form Dialog Menu-->
    <q-dialog
      v-model="formVisibleMenu"
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 75vw; max-height: 60vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="groups" />

            <q-toolbar-title
              ><span class="text-weight-bold"
                >{{ $t("dealer.dealer") }} {{ $t("additionalInfo") }} -
                {{ currentRow.name }}</span
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
        <q-card-section class="q-pa-sm">
          <component :is="currentComponent" :dealerId="currentRow.id" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import DealerForm from "src/components/forms/DealerForm.vue";
import DealerRfidForm from "src/components/forms/DealerRfidForm.vue";
import DealerContactForm from "src/components/forms/DealerContactForm.vue";
import DealerRegionsForm from "src/components/forms/DealerRegionsForm.vue";
import DealerVehiclesForm from "src/components/forms/DealerVehiclesForm.vue";
import DealerStationsForm from "src/components/forms/DealerStationsForm.vue";
import DealerDiscountsForm from "src/components/forms/DealerDiscountsForm.vue";
import * as XLSX from "xlsx";

export default defineComponent({
  name: "DealersPage",
  components: {
    DealerForm,
    DealerRfidForm,
    DealerContactForm,
    DealerRegionsForm,
    DealerVehiclesForm,
    DealerStationsForm,
    DealerDiscountsForm,
  },
  data() {
    return {
      rows: [],
      filter: "",
      loading: true,
      formVisible: false,
      formVisibleMenu: false,
      deleteConfirm: false,
      maximizedToggle: false,
      currentComponent: "",
      currentMode: "add",
      currentRow: {},
      pagination: { rowsPerPage: 20 },
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "name",
          label: this.$t("dealer.dealerName"),
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "country",
          label: this.$t("firm.country"),
          field: (row) => row.address.country?.name,
          align: "left",
          sortable: true,
        },
        {
          name: "city",
          label: this.$t("firm.city"),
          field: (row) => row.address.city?.name,
          align: "left",
          sortable: true,
        },
        {
          name: "dealerBillingPlan",
          label: this.$t("firm.billingPlan"),
          field: (row) => this.$t(row.dealerBillingPlan),
          align: "left",
          sortable: true,
        },
        {
          name: "additionalInfo",
          label: this.$t("additionalInfo"),
          field: (row) => row,
          align: "center",
          sortable: false,
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
  },

  async mounted() {
    this.init();
  },
  methods: {
    init() {
      document.title = `${firm.name}-${this.$t("dealer.dealers")}`;
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
    onDelete(row) {
      this.currentRow = row;
      this.deleteConfirm = true;
    },
    onMenu(row, componentName) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentComponent = componentName;
      this.formVisibleMenu = true;
    },

    async getList() {
      try {
        this.loading = true;
        const response = await this.$api.get("getDealers");
        //this.$logger.log("DEALERS GET:", response.data.data);
        this.rows = response?.data.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getList error", error);
      }
    },
    async deleteRow() {
      try {
        this.currentRow.isActive = false;
        await this.$api.put("/updateDealer", this.currentRow);

        this.$q.notify({
          type: "positive",
          message: this.$t("dealer.deletedDealer"),
        });

        this.deleteConfirm = false;
        this.getList(); // listeyi yenile
      } catch (error) {
        this.$logger.error("Silme hatası:", error);
      }
    },
    onFormCompleted() {
      try {
        this.formVisible = false;
        this.getList();
      } catch (error) {
        this.$logger.error("Bayi kaydetme hatası:", error);
      }
    },
    exportTable() {
      const table = this.$refs.table;
      const rows = table.filteredSortedRows; // sadece filtrelenmiş ve sıralanmışlar
      // İstenmeyen sütunlarını hariç tut
      const excludedLabels = ["Ek Bilgiler", "İşlem"];
      const exportColumns = this.columns.filter(
        (col) => !excludedLabels.includes(col.label),
      );

      // Başlık ve Veri
      const header = exportColumns.map((col) => col.label);
      const data = rows.map((row) =>
        exportColumns.map((col) =>
          typeof col.field === "function" ? col.field(row) : row[col.field],
        ),
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

      XLSX.writeFile(workbook, "DealersList.xlsx");
    },
    clickMenu(row) {
      this.$logger.log("Context menu clicked", row);
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
