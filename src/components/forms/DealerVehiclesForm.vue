<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <q-table
      flat
      dense
      bordered
      class="statement-table q-mb-md"
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
            {{ $t("vehicle.vehicles") }}
          </div>
          <q-space />
          <!-- Search -->
          <q-input
            class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
            bottom-slots
            dense
            debounce="300"
            v-model="vehicleFilter"
            :placeholder="$t('users.search')"
          >
            <template v-slot:append>
              <q-icon
                v-if="vehicleFilter !== ''"
                name="close"
                @click="vehicleFilter = ''"
                class="cursor-pointer"
              />
              <q-icon name="search" />
            </template>
          </q-input>
          <q-space />
          <!-- Add -->
          <q-btn
            flat
            round
            dense
            icon="add"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="onAdd"
          >
            <q-tooltip>{{ $t("vehicle.vehicleAdd") }}</q-tooltip>
          </q-btn>
          <q-space />
          <!-- Refresh -->
          <q-btn
            flat
            round
            dense
            icon="refresh"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="getList"
          >
            <q-tooltip>{{ $t("refresh") }}</q-tooltip>
          </q-btn>
          <q-space />
          <!-- Fullscreen -->
          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
          >
            <q-tooltip>{{ $t("maximize") }}</q-tooltip>
          </q-btn>
          <q-space />
          <!-- Export -->
          <q-btn
            :label="$t('export')"
            class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
            icon="cloud_download"
            @click="exportVehicles"
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

    <!--Dealer Vehicle Add Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 50vw; max-height: 85vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="directions_car" />
            <q-toolbar-title>
              <span class="text-weight-bold">{{ $t("vehicle.vehicle") }}</span>
              {{ $t(mode) }}
            </q-toolbar-title>
            <q-btn dense flat icon="close" v-close-popup />
          </q-bar>
        </q-card-section>

        <q-card-section>
          <q-card>
            <q-card-section class="bg-primary text-white">
              {{ $t("vehicle.vehicleInformation") }}
            </q-card-section>
            <q-card-section>
              <q-list class="row items-start">
                <!-- Araç Plaka -->
                <q-item class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input
                      ref="licensePlateRef"
                      outlined
                      dense
                      v-model="formModel.licensePlate"
                      :label="$t('vehicle.licensePlate') || 'Plate'"
                      :disable="mode === 'details'"
                      hide-bottom-space
                      :rules="[(val) => !!val || $t('requiredlabel')]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="confirmation_number" />
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>
                <!-- Araç renk -->
                <q-item class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input
                      outlined
                      dense
                      v-model="formModel.color"
                      :label="$t('technicalService.color') || 'Color'"
                      :disable="mode === 'details'"
                      hide-bottom-space
                    >
                      <template v-slot:prepend>
                        <q-icon name="palette" />
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>
                <!-- Araç Filo -->
                <q-item class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      dense
                      outlined
                      v-model="formModel.fleet"
                      :options="filteredFleets"
                      option-value="id"
                      option-label="name"
                      use-input
                      map-options
                      :label="$t('fleet.fleet')"
                      :disable="mode === 'details'"
                      @filter="filterFleets"
                      hide-bottom-space
                    >
                      <template v-slot:prepend>
                        <q-icon name="emoji_transportation" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
                <!-- Araç Marka -->
                <q-item class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      ref="brandRef"
                      v-model="formModel.vehicleBrand"
                      dense
                      outlined
                      :options="filteredBrands"
                      option-value="id"
                      option-label="name"
                      use-input
                      map-options
                      :label="$t('vehicle.vehicleBrand')"
                      @filter="filterBrands"
                      :disable="mode === 'details'"
                      @update:model-value="onBrandChange"
                      hide-bottom-space
                      :rules="[(val) => !!val || $t('requiredlabel')]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="directions_car" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
                <!-- Araç Model -->
                <q-item class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      ref="modelRef"
                      v-model="formModel.vehicleModel"
                      dense
                      outlined
                      :options="filteredModels"
                      option-value="id"
                      option-label="name"
                      use-input
                      map-options
                      :disable="!formModel.vehicleBrand || mode === 'details'"
                      :label="$t('vehicle.vehicleModel')"
                      @filter="filterModels"
                      hide-bottom-space
                      :rules="[(val) => !!val || $t('requiredlabel')]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="directions_car_filled" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
                <!-- Araç batarya kapasitesi -->
                <q-item class="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input
                      outlined
                      dense
                      v-model.number="formModel.batteryCapacity"
                      type="number"
                      :label="$t('vehicle.battery') || 'Battery'"
                      :disable="mode === 'details'"
                      hide-bottom-space
                    >
                      <template v-slot:prepend>
                        <q-icon name="battery_charging_full" />
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>
                <!-- Araç Yıl -->
                <q-item class="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      ref="yearRef"
                      dense
                      outlined
                      v-model="formModel.year"
                      :options="yearOptions"
                      option-value="value"
                      option-label="label"
                      emit-value
                      :label="$t('vehicle.modelYear')"
                      :disable="mode === 'details'"
                      hide-bottom-space
                      :rules="[(val) => !!val || $t('requiredlabel')]"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions class="q-px-lg" align="between">
              <q-toggle
                v-model="formModel.isActive"
                :label="formModel.isActive ? $t('active') : $t('inactive')"
                color="green"
                checked-icon="check"
                unchecked-icon="cancel"
              />
              <q-space />
              <q-btn
                color="primary"
                icon="save"
                class="text-capitalize"
                :style="{ display: mode === 'details' ? 'none' : 'block' }"
                @click="onSubmit"
                >{{
                  mode === "edit" ? $t("updatedata") : $t("savedata")
                }}</q-btn
              >
            </q-card-actions>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--Dealer Vehicle Delete Dialog -->
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
            {{ $t("vehicle.vehicle") }} {{ $t("deleteConfirm") }}
          </div>
          <div class="text-subtitle2">
            {{ $t("vehicle.licensePlate") }} :
            <b>{{ currentRow.licensePlate }}</b>
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
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import exportFromJSON from "export-from-json";

export default defineComponent({
  name: "DealerVehiclesForm",
  computed: {
    columns() {
      return [
        {
          name: "plate",
          label: this.$t("vehicle.licensePlate"),
          field: (row) => row.licensePlate,
          align: "left",
          sortable: true,
        },
        {
          name: "color",
          label: this.$t("technicalService.color") || "Color",
          field: (row) => row.color,
          align: "left",
          sortable: true,
        },
        {
          name: "year",
          label: this.$t("vehicle.modelYear") || "Year",
          field: (row) => row.year,
          align: "left",
          sortable: true,
        },
        {
          name: "battery",
          label: this.$t("vehicle.battery") || "Battery",
          field: (row) => row.batteryCapacity,
          align: "left",
          sortable: true,
        },
        {
          name: "brand",
          label: this.$t("vehicle.vehicleBrand") || "Brand",
          field: (row) => row.vehicleModel.vehicleBrand?.name || "",
          align: "left",
          sortable: true,
        },
        {
          name: "model",
          label: this.$t("vehicle.vehicleModel") || "Model",
          field: (row) => row.vehicleModel.name || "",
          align: "left",
          sortable: true,
        },
        {
          name: "isActive",
          label: this.$t("status"),
          field: (row) => row.isActive,
          align: "center",
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
  props: {
    dealerId: {
      type: Number,
    },
  },
  data() {
    return {
      loading: true,
      rows: [],
      filter: "",
      fleets: [],
      brands: [],
      models: [],
      filteredBrands: [],
      filteredModels: [],
      filteredFleets: [],
      maximizedToggle: false,
      pagination: { rowsPerPage: 10 },
      mode: "add",
      formVisible: false,
      deleteConfirm: false,
      formModel: {},

      yearOptions: Array.from({ length: 15 }).map((_, i) => {
        const y = new Date().getFullYear() - i;
        return { label: String(y), value: y };
      }),
    };
  },
  async mounted() {
    document.title = `Magicline-${this.$t("vehicle.vehicles")}`;
    this.init();
  },
  methods: {
    init() {
      try {
        this.fleets = this.filteredFleets = [
          { id: 1, name: "Filo Müdür" },
          { id: 2, name: "Filo Şef" },
        ];
        this.getVehicleBrands();
        this.getList();
        console.log("dealerId", this.dealerId);
      } catch (error) {
        this.$logger.error("init", error);
      }
    },

    async getList() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          `getDealerVehicles/${this.dealerId}`
        );

        this.rows = response.data.data;
        this.$logger.log("rows", this.rows);
      } catch (error) {
        this.$logger.error("getVehicles", error);
      } finally {
        this.loading = false;
      }
    },
    async getVehicleBrands() {
      try {
        const response = await this.$api.get("getVehicleBrands");
        this.brands = this.filteredBrands = response?.data;
      } catch (error) {
        this.$logger.error("getVehicleBrands", error);
      }
    },

    onBrandChange(brand) {
      try {
        this.formModel.vehicleModel = "";
        this.models = this.filteredModels = brand.vehicleModels;
      } catch (error) {
        this.$logger.error("onBrandChange", error);
      }
    },

    onAdd() {
      try {
        this.formModel = {
          dealerId: this.dealerId,
          licensePlate: "",
          color: "",
          batteryCapacity: "",
          fleet: "",
          year: "",
          firmId: null,
          isActive: true,
        };
        this.mode = "add";
        this.formVisible = true;
      } catch (error) {
        this.$logger.error("onAdd", error);
      }
    },
    onView(row) {
      this.maximizedToggle = false;
      this.formModel = row;
      this.mode = "details";
      this.formVisible = true;
    },
    onEdit(row) {
      try {
        this.formModel = row;
        this.formModel.vehicleBrand = this.brands.find(
          (b) => b.id === row.vehicleModel.vehicleBrand.id
        );
        this.models = this.filteredModels =
          this.formModel.vehicleBrand?.vehicleModels || [];
        this.mode = "edit";
        this.formVisible = true;
      } catch (error) {
        this.$logger.error("onEdit", error);
      }
    },
    onDelete(row) {
      this.currentRow = row;
      this.deleteConfirm = true;
    },
    exportVehicles() {
      const fileName = "Vehicles";
      const exportType = exportFromJSON.types.xls;
      exportFromJSON({ data: this.rows, fileName, exportType });
    },

    filterBrands(val, update) {
      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        val === ""
          ? (this.filteredBrands = this.brands)
          : (this.filteredBrands = this.brands.filter((v) =>
              this.$normalizeTurkishString(v.name).includes(normalizedVal)
            ));
      });
    },
    async onSubmit() {
      try {
        const isValid =
          (await this.$refs.licensePlateRef?.validate?.()) &&
          (await this.$refs.brandRef?.validate?.()) &&
          (await this.$refs.modelRef?.validate?.()) &&
          (await this.$refs.yearRef?.validate?.());

        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }

        let response;
        this.formModel.vehicleModelId = this.formModel.vehicleModel.id;
        this.formModel.fleetId = this.formModel.fleet?.id ?? null;
        this.formModel.licensePlate = this.formModel.licensePlate
          .replace(/\s+/g, "")
          .toUpperCase();
        this.$logger.log("dealer vehicle FormModel", this.formModel);
        if (this.mode === "add") {
          response = await this.$api.post(
            "createDealerVehicle",
            this.formModel
          );
        } else {
          response = await this.$api.put("updateDealerVehicle", this.formModel);
        }
        if (response.status === 200)
          this.$q.notify({
            type: "positive",
            message: this.mode == "add" ? this.$t("saved") : this.$t("updated"),
          });
        this.formVisible = false;
        this.getList();
      } catch (error) {
        this.$logger.error("saveVehicle", error);
      }
    },
    async deleteRow() {
      try {
        this.currentRow.isActive = false;
        await this.$api.put("updateDealerVehicle", this.currentRow);

        this.$q.notify({
          type: "positive",
          message: this.$t("deleted"),
        });

        this.deleteConfirm = false;
        this.getList(); // listeyi yenile
      } catch (error) {
        this.$logger.error("Silme hatası:", error);
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
