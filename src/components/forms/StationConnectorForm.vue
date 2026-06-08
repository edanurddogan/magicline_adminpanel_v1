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
      class="statement-table"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="filter"
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
            {{ $t("station.connectorList") }}
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
              {{ $t("station.addConnector") }}
            </q-tooltip>
          </q-btn>
          <q-space />
          <q-btn
            flat
            round
            dense
            icon="refresh"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="getListConnectors"
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
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            color="black"
            icon="qr_code_2"
            @click="showQr(props.row)"
          />
          <q-btn
            flat
            dense
            round
            color="primary"
            icon="info"
            @click="onView(props.row)"
          />
          <q-btn
            flat
            dense
            round
            color="secondary"
            icon="edit"
            @click="onEdit(props.row)"
          />
          <q-btn
            flat
            dense
            round
            color="negative"
            icon="delete_forever"
            @click="onDelete(props.row)"
          />
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
      <q-card style="min-width: 70vw; max-height: 120vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="settings_input_svideo" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("station.connector")
              }}</span>
              {{ $t(currentMode) }}</q-toolbar-title
            >

            <q-btn
              flat
              dense
              icon="close_fullscreen"
              @click="maximizedToggle = false"
              :disable="!maximizedToggle"
            >
              <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">{{
                $t("minimize")
              }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
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
            <q-btn flat dense icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
          <div class="row">
            <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-card-section class="bg-primary text-white">
                  <div>{{ $t("station.connectorInfo") }}</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <q-list dense class="row items-start">
                    <!-- Konnektör Kodu -->
                    <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                      <q-item-section>
                        <q-input
                          ref="connectorCodeRef"
                          v-model="formModel.code"
                          :label="$t('station.connectorCode')"
                          :disable="mode === 'details'"
                          :rules="[(val) => !!val || $t('requiredlabel')]"
                          lazy-rules
                          dense
                          outlined
                        >
                          <template v-slot:prepend>
                            <q-icon name="code" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                    <!-- Konnektör EPDK ID -->
                    <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                      <q-item-section>
                        <q-input
                          ref="connectorEpdkIdRef"
                          v-model="formModel.EPDKId"
                          :label="$t('station.connectorEpdkId')"
                          :disable="mode === 'details'"
                          lazy-rules
                          dense
                          outlined
                        >
                          <template v-slot:prepend>
                            <q-icon name="badge" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                    <!-- Konnektör Tipi -->
                    <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                      <q-item-section>
                        <q-select
                          ref="connectorTypeRef"
                          v-model="formModel.stationConnectorType"
                          :label="$t('station.connectorType')"
                          :options="stationConnectorTypes"
                          option-label="name"
                          option-value="id"
                          :disable="mode === 'details'"
                          :rules="[(val) => !!val || $t('requiredlabel')]"
                          map-options
                          dense
                          outlined
                        >
                          <template v-slot:prepend>
                            <q-icon name="settings_input_svideo" />
                          </template>
                        </q-select>
                      </q-item-section>
                    </q-item>
                    <!-- Konnektör Numarası -->
                    <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                      <q-item-section>
                        <q-select
                          ref="connectorIndexTypeRef"
                          v-model="formModel.connectorIndex"
                          :label="$t('station.connectorNumber')"
                          :options="connectorIndexTypes"
                          option-value="id"
                          option-label="name"
                          :disable="mode === 'details'"
                          :rules="[(val) => !!val || $t('requiredlabel')]"
                          emit-value
                          map-options
                          dense
                          outlined
                        >
                          <template v-slot:prepend>
                            <q-icon name="pin" />
                          </template>
                        </q-select>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-card class="q-ml-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-card-section class="bg-primary text-white">
                  <div>{{ $t("station.connectorElectricalParametres") }}</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <q-list dense class="row">
                    <!-- Voltaj Limiti -->
                    <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <q-item-section>
                        <q-input
                          ref="voltageLimitRef"
                          v-model="formModel.voltageLimit"
                          :label="$t('station.voltageLimit')"
                          :disable="mode === 'details'"
                          :rules="[(val) => !!val || $t('requiredlabel')]"
                          lazy-rules
                          dense
                          outlined
                        >
                          <template v-slot:prepend>
                            <q-icon name="flash_on" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                    <!-- Akım Limiti -->
                    <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <q-item-section>
                        <q-input
                          ref="currentLimitRef"
                          v-model="formModel.apmerageLimit"
                          :label="$t('station.currentLimit')"
                          :disable="mode === 'details'"
                          :rules="[(val) => !!val || $t('requiredlabel')]"
                          lazy-rules
                          dense
                          outlined
                        >
                          <template v-slot:prepend>
                            <q-icon name="offline_bolt" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                    <!-- Güç Limiti -->
                    <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <q-item-section>
                        <q-input
                          ref="powerLimitRef"
                          v-model="formModel.wattageLimit"
                          :label="$t('station.powerLimit')"
                          :disable="mode === 'details'"
                          :rules="[(val) => !!val || $t('requiredlabel')]"
                          lazy-rules
                          dense
                          outlined
                        >
                          <template v-slot:prepend>
                            <q-icon name="bolt" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                    <!-- Elektrik Tipi -->
                    <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <q-item-section>
                        <q-select
                          ref="electricTypeRef"
                          v-model="formModel.stationElectricType"
                          :label="$t('station.electricType')"
                          :options="stationElectricTypes"
                          option-value="id"
                          option-label="name"
                          :disable="mode === 'details'"
                          :rules="[(val) => !!val || $t('requiredlabel')]"
                          map-options
                          dense
                          outlined
                        >
                          <template v-slot:prepend>
                            <q-icon name="ev_station" />
                          </template>
                        </q-select>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <q-card-actions class="q-pa-lg justify-between">
            <q-toggle
              class="col-lg-8 col-md-8 col-sm-8 col-xs-12"
              :label="
                formModel.isActive === true ? $t('active') : $t('inactive')
              "
              color="green"
              checked-icon="check"
              unchecked-icon="cancel"
              :disable="mode === 'details'"
              v-model="formModel.isActive"
            />
            <q-btn
              class="text-capitalize bg-info q-pa-lg"
              :style="{ display: mode === 'details' ? 'none' : 'block' }"
              @click="onSubmit"
            >
              {{ currentMode === "edit" ? $t("updatedata") : $t("savedata") }}
            </q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- QR Dialog -->
    <q-dialog v-model="formModel.qrDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 280px; max-width: 90vw">
        <q-card-section class="row items-center justify-center">
          <div v-html="formModel.qrSvg" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('close')"
            color="primary"
            v-close-popup
            @click="formModel.qrDialog = false"
          />
        </q-card-actions>
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
            {{ $t("station.connector") }} {{ $t("deleteConfirm") }}
          </div>
          <div class="text-subtitle2">
            {{ $t("station.connector") }} : <b>{{ currentRow.code }}</b>
          </div>
        </q-card-section>

        <q-card-actions align="right">
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
import QRCode from "qrcode-generator";

export default defineComponent({
  components: {},
  emits: ["completed", "close"],
  props: {
    stationId: {
      type: Number,
    },
  },
  data() {
    return {
      rows: [],
      filter: "",
      loading: false,
      formVisible: false,
      deleteConfirm: false,
      maximizedToggle: false,
      currentMode: "add",
      currentRow: {},
      stationConnectorTypes: [],
      stationElectricTypes: [],
      connectorIndexTypes: [
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
      ],

      formModel: {
        apmerageLimit: null,
        connectorName: null,
        wattageLimit: null,
        code: null,
        EPDKId: null,
        stationConnectorType: { name: "Seç" },
        stationElectricType: { name: "Seç" },
        connectorIndex: "",
        isActive: true,
        // QR dialog state
        qrDialog: false,
        qrSvg: "",
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "code",
          label: this.$t("station.connectorCode"),
          field: "code",
          align: "left",
          sortable: true,
        },
        {
          name: "connectorIndex",
          label: this.$t("station.connectorNumber"),
          field: "connectorIndex",
          align: "left",
          sortable: true,
        },
        {
          name: "EPDKId",
          label: this.$t("station.epdkID"),
          field: "EPDKId",
          align: "left",
          sortable: true,
        },
        {
          name: "electricType",
          label: this.$t("station.electricType"),
          field: (row) => row.stationElectricType.name,
          align: "left",
          sortable: false,
        },
        {
          name: "voltageLimit",
          label: this.$t("station.voltage"),
          field: "voltageLimit",
          align: "left",
          sortable: false,
        },
        {
          name: "apmerageLimit",
          label: this.$t("station.current"),
          field: "apmerageLimit",
          align: "left",
          sortable: false,
        },
        {
          name: "wattageLimit",
          label: this.$t("station.power"),
          field: "wattageLimit",
          align: "left",
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
          field: "",
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
      this.getStationConnectorTypes();
      this.getStationElectricTypes();
      this.getList();
    },
    onAdd() {
      this.maximizedToggle = false;
      this.formModel = { isActive: true };
      this.currentMode = "add";
      this.formVisible = true;
    },
    onEdit(row) {
      this.maximizedToggle = false;
      this.formModel = row;
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
    onFormCompleted() {
      this.formVisible = false;
      this.getList();
    },
    exportTable() {
      const fileName = "Region Report";
      const exportType = exportFromJSON.types.xls;
      exportFromJSON({ data: this.rows, fileName, exportType });
    },
    clickMenu(row) {
      this.$logger.log("Context menu clicked", row);
    },

    showQr(row) {
      // QR kodu oluşturucu nesnesini oluştur
      const qr = QRCode(0, "M");
      qr.addData(row.code);
      qr.make();
      // create SVG and open dialog
      try {
        const svg = qr.createSvgTag(6, 2); // cell size 6, margin 2
        this.formModel.qrSvg = svg;
        this.formModel.qrDialog = true;
      } catch (e) {
        // fallback: open in new window as PNG data URL
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          // qrcode-generator provides createImgTag as well, but fallback to window.open
          const imgTag = qr.createImgTag(6, 0);
          const win = window.open("", "_blank");
          if (win) {
            win.document.write(imgTag);
            win.document.close();
          }
        } catch (err) {
          this.$logger.error("showQr error", err);
        }
      }
    },

    async onSubmit() {
      const isValid =
        (await this.$refs.connectorCodeRef?.validate?.()) &&
        (await this.$refs.connectorTypeRef?.validate?.()) &&
        (await this.$refs.connectorIndexTypeRef?.validate?.()) &&
        (await this.$refs.voltageLimitRef?.validate?.()) &&
        (await this.$refs.currentLimitRef?.validate?.()) &&
        (await this.$refs.powerLimitRef?.validate?.()) &&
        (await this.$refs.electricTypeRef?.validate?.());

      if (!isValid) {
        this.$q.notify({
          type: "negative",
          message: this.$t("station.formValidationError"),
        });
        return;
      }

      try {
        this.formModel = {
          ...this.formModel,
          stationId: this.stationId,
          stationConnectorTypeId: this.formModel.stationConnectorType.id,
          stationElectricTypeId: this.formModel.stationElectricType.id,
        };
        let response;
        if (this.currentMode === "add") {
          response = await this.$api.post(
            "createStationConnector",
            this.formModel
          );
        } else if (this.currentMode === "edit") {
          response = await this.$api.put(
            "updateStationConnector",
            this.formModel
          );
        }

        if (response.status === 200) {
          this.$q.notify({
            type: "positive",
            message: this.$t(this.currentMode === "add" ? "saved" : "updated"),
          });
        }

        this.onFormCompleted(); // tabloyu yenile ve formu kapat
      } catch (error) {
        this.$logger.error("Kaydetme hatası:", this.formModel);
        this.$q.notify({
          type: "negative",
          message: this.$t("saveFailed"),
        });
      }
    },
    async deleteRow() {
      try {
        this.currentRow.isActive = false;
        await this.$api.put("updateStationConnector", this.currentRow);

        this.$q.notify({
          type: "positive",
          message: `${this.$t("station.connector")} ${this.$t("deleted")}`,
        });

        this.deleteConfirm = false;
        this.getList(); // listeyi yenile
      } catch (error) {
        this.$logger.error("updateStationConnector:", error);
      }
    },
    async getStationElectricTypes() {
      try {
        const response = await this.$api.get("stationElectricTypes");
        this.stationElectricTypes = response?.data || [];
      } catch (error) {
        this.$logger.error("getStationElectricTypes error", error);
      }
    },

    async getStationConnectorTypes() {
      try {
        this.loading = true;
        const response = await this.$api.get("/stationConnectorTypes");
        this.stationConnectorTypes = response.data;
      } catch (error) {
        this.$logger.error("EgetConnectorTypes", error);
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
        const response = await this.$api.get(
          `getStationConnectorsByStationId/${this.stationId}`
        );
        //this.$logger.log("connectors", response.data);
        this.rows = response.data?.data || [];
      } catch (error) {
        this.$logger.error("getStationConnectors error", error);
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
