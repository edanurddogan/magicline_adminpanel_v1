<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>

<template>
  <div class="q-mx-auto q-mt-md" style="max-width: 80%">
    <!-- Tab Menü -->
    <q-tabs
      v-model="tab"
      inline-label
      align="justify"
      class="text-white shadow-2"
    >
      <q-tab
        name="online"
        icon="done_outline"
        label="Onlıne"
        class="bg-teal"
        @click="onlineTab"
      >
        <q-badge color="red" floating> {{ rowsOnline.length }}</q-badge>
      </q-tab>

      <q-tab
        name="offline"
        icon="flash_off"
        label="Offlıne"
        class="bg-orange-6"
        @click="offlineTab"
      >
        <q-badge color="red" floating> {{ rowsOffline.length }}</q-badge>
      </q-tab>

      <q-tab
        name="disabled"
        icon="block"
        label="Disabled"
        class="bg-grey-6"
        @click="disabledTab"
      >
        <q-badge color="red" floating> {{ rowsDisabled.length }}</q-badge>
      </q-tab>
    </q-tabs>

    <!-- İstasyon Bilgileri -->
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
            {{ $t("station.stationActions") }}
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

      <!-- stationName: primary + tooltip -->
      <template #body-cell-stationName="props">
        <q-td :props="props">
          <span class="text-primary cursor-pointer text-weight-medium">
            {{ props.row?.name || "-" }}

            <q-tooltip anchor="bottom middle" self="top middle">
              <div class="column q-gutter-xs">
                <div>
                  <strong>{{ $t("dealer.dealer") || "Bayi" }}:</strong>
                  {{ props.row?.dealer?.name || "-" }}
                </div>

                <div>
                  <strong>{{ $t("region.region") || "Bölge" }}:</strong>
                  {{ props.row?.stationRegion?.name || "-" }}
                </div>
              </div>
            </q-tooltip>
          </span>
        </q-td>
      </template>

      <!-- İşlemler Butonları -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            dense
            size="sm"
            no-caps
            :label="$t('reports.logs')"
            color="secondary"
            class="q-pa-xs"
            @click="getStationLogs(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        ></div>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          <span> {{ message }}... </span>
        </div>
      </template>
      <!-- connectors: buton kutular + renk + tooltip -->
      <template #body-cell-connectors="props">
        <q-td :props="props">
          <div class="connector-wrap">
            <q-btn
              v-for="connector in props.row.stationConnectors || []"
              :key="connector.id"
              dense
              flat
              round
              size="sm"
              class="connector-btn"
              :disable="tab === 'disabled'"
              :style="{
                background: connector.stationConnectorStatus
                  ? connector.stationConnectorStatus.color
                  : '#eee',
                color: '#fff',
              }"
              @click="onClickConnector(props.row, connector)"
            >
              {{ connector.connectorIndex }}

              <q-tooltip anchor="top middle" self="bottom middle">
                {{ connector.code }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>
  </div>

  <!-- Station Logs Form Dialog -->
  <q-dialog
    v-model="formVisible"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 90vw; min-height: 75vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-sm">
          <q-icon name="price_change" />

          <q-toolbar-title>
            <span class="text-weight-bold">
              {{ $t("reports.stationLogs") }} -
              {{ currentRow.code || "-" }}
            </span>
          </q-toolbar-title>

          <q-btn
            dense
            flat
            icon="close_fullscreen"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          >
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">
              {{ $t("minimize") }}
            </q-tooltip>
          </q-btn>

          <q-btn
            dense
            flat
            icon="open_in_full"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">
              {{ $t("maximize") }}
            </q-tooltip>
          </q-btn>

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">
              {{ $t("close") }}
            </q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>

      <q-card-section class="scroll q-pa-sm">
        <StationLogsForm
          :key="currentRowLogsKey"
          class="q-pa-sm"
          :model-value="currentRowLogsModel"
          @completed="onFormCompleted"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- Start Charge Dialog -->
  <q-dialog
    v-model="formVisibleStart"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 35vw; max-height: 70vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-md">
          <q-icon name="person" />
          <q-toolbar-title>
            <span class="text-weight-bold">{{
              $t("station.chargeStart")
            }}</span>
          </q-toolbar-title>

          <q-btn
            dense
            flat
            icon="close_fullscreen"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          />
          <q-btn
            dense
            flat
            icon="open_in_full"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          />
          <q-btn dense flat icon="close" @click="onCloseForm" v-close-popup />
        </q-bar>
      </q-card-section>

      <q-card-section>
        <q-item class="justify-center q-pb-xl">
          <q-select
            ref="plateRef"
            v-model="formModel.plate"
            :options="filteredVehicles"
            option-value="id"
            option-label="licensePlate"
            :label="$t('station.userAndVehicleInfo')"
            options-dense
            map-options
            clearable
            outlined
            dense
            use-input
            @filter="filterVehicles"
            :rules="[(val) => !!val || $t('requiredlabel')]"
            style="width: 80%"
          >
            <template #prepend>
              <q-icon name="11mp" />
            </template>

            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.licensePlate }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    {{
                      scope.opt.customer
                        ? scope.opt.customer?.name +
                          " " +
                          scope.opt.customer?.surname
                        : scope.opt.dealer?.name +
                          " - " +
                          scope.opt.vehicleFleet?.name
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <template #selected-item="scope">
              <span>
                {{ scope.opt.licensePlate }} —
                {{
                  scope.opt.customer
                    ? scope.opt.customer?.name +
                      " " +
                      scope.opt.customer?.surname
                    : scope.opt.dealer?.name +
                      " - " +
                      scope.opt.vehicleFleet?.name
                }}
              </span>
            </template>
          </q-select>
        </q-item>
      </q-card-section>

      <q-card-actions class="justify-center">
        <q-item>
          <q-btn
            color="secondary"
            :label="$t('station.chargeStart')"
            icon="play_circle"
            @click="onConfirmStartCharge"
          />
        </q-item>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Start or Stop Confirm Dialog -->
  <q-dialog v-model="formVisibleStartOrStop" persistent>
    <q-card
      class="q-pa-md position-relative"
      :class="{ 'dialog-disabled': isStartProcessing }"
    >
      <div
        v-if="isStartProcessing"
        class="dialog-dark-overlay column flex-center"
      >
        <q-spinner color="white" size="40px" />
      </div>

      <q-card-section class="text-center">
        <q-avatar
          size="56px"
          :icon="modeProps[currentMode].icon"
          :color="modeProps[currentMode].color"
          text-color="white"
        />
      </q-card-section>

      <q-card-section>
        <div
          class="text-h5 text-weight-bold q-mb-sm text-center"
          :class="modeProps[currentMode].headerColor"
        >
          {{ modeProps[currentMode].header }}
        </div>

        <div class="text-subtitle1">
          {{ $t("station.connectorCode") }} :
          <b>{{ currentRow?.code || "-" }}</b>
        </div>

        <div class="text-subtitle1">
          {{ $t("users.username") }} :
          <b>
            {{
              formModel?.plate?.customer
                ? `${formModel.plate.customer?.name || ""} ${
                    formModel.plate.customer?.surname || ""
                  }`.trim()
                : "-"
            }}
          </b>
        </div>

        <div class="text-subtitle1">
          {{ $t("vehicle.licensePlate") }} :
          <b>{{ formModel?.plate?.licensePlate || "-" }}</b>
        </div>
      </q-card-section>

      <q-card-actions align="around">
        <q-btn
          :label="$t('cancel')"
          color="red"
          :disable="isStartProcessing"
          @click="onCloseForm"
          v-close-popup
        />

        <q-btn
          :label="$t('confirm')"
          color="primary"
          :disable="isStartProcessing"
          :loading="currentMode === 'stop' && isStopProcessing"
          @click="currentMode === 'start' ? onStartCharge() : onStopCharge()"
        />

        <q-btn
          v-if="currentMode === 'stop'"
          :label="$t('station.forceStop')"
          color="warning"
          @click="onForceStopCharge()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Station Actions Dialog (İstasyon işlemleri) -->
  <q-dialog
    v-model="stationActionsVisible"
    persistent
    :maximized="stationActionsMaximized"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 90vw; min-height: 60vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-sm">
          <q-icon name="ev_station" />

          <q-toolbar-title>
            <span class="text-weight-bold">
              {{ $t("station.stationInfo") }} :
              {{ formModel.station?.name || "-" }}
            </span>
          </q-toolbar-title>

          <q-btn
            dense
            flat
            icon="close_fullscreen"
            @click="stationActionsMaximized = false"
            :disable="!stationActionsMaximized"
          >
            <q-tooltip
              v-if="stationActionsMaximized"
              class="bg-white text-primary"
            >
              {{ $t("minimize") }}
            </q-tooltip>
          </q-btn>

          <q-btn
            dense
            flat
            icon="open_in_full"
            @click="stationActionsMaximized = true"
            :disable="stationActionsMaximized"
          >
            <q-tooltip
              v-if="!stationActionsMaximized"
              class="bg-white text-primary"
            >
              {{ $t("maximize") }}
            </q-tooltip>
          </q-btn>

          <q-btn dense flat icon="close" @click="closeStationActionsDialog">
            <q-tooltip class="bg-white text-primary">
              {{ $t("close") }}
            </q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>

      <q-card-section class="scroll q-pa-md">
        <q-card class="col-12">
          <q-card-section
            class="row bg-primary text-white justify-between items-center"
          >
            <div>
              {{ $t("station.stationInfo") }} :
              {{ formModel.station?.name || "-" }}
            </div>

            <!-- İstasyon İşlem Butonu -->
            <q-fab
              color="secondary"
              push
              :label="$t('station.stationActions')"
              label-position="left"
              icon="keyboard_arrow_down"
              direction="down"
              padding="sm"
            >
              <q-fab-action
                color="primary"
                @click="onStationReset('soft')"
                icon="restart_alt"
              >
                <q-tooltip class="bg-white text-primary text-md">
                  {{ $t("station.softReset") }}
                </q-tooltip>
              </q-fab-action>

              <q-fab-action
                color="accent"
                @click="onStationReset('hard')"
                icon="handyman"
              >
                <q-tooltip class="bg-white text-primary">
                  {{ $t("station.hardReset") }}
                </q-tooltip>
              </q-fab-action>
            </q-fab>
          </q-card-section>

          <!-- Refresh -->
          <q-card-section class="row justify-end q-pa-none q-pr-md q-pt-md">
            <q-btn
              dense
              round
              unelevated
              size="m"
              icon="refresh"
              color="primary"
              class="refresh-btn"
              :disable="loading || !formModel.station?.id"
              @click="onStationChange"
            >
              <q-tooltip class="bg-white text-primary">
                {{ $t("refresh") }}
              </q-tooltip>
            </q-btn>
          </q-card-section>

          <!-- Socket Kartları -->
          <q-card-section class="row justify-around q-pt-none">
            <q-card
              v-for="(socket, index) in formModel.station?.stationConnectors ||
              []"
              :key="socket.id || index"
              dense
              bordered
              style="width: 45%"
            >
              <q-card-section class="row">
                <div>
                  <q-item dense>
                    {{ $t("station.socket") }} : {{ socket.connectorIndex }}
                  </q-item>
                  <q-item dense>
                    {{ $t("technicalService.type") }} :
                    {{ formModel.station?.stationElectricType?.name || "-" }}
                  </q-item>
                </div>

                <div>
                  <q-item dense>
                    {{ $t("station.socketStatus") }} :
                    {{
                      socket.connectorStatus ||
                      socket.stationConnectorStatus?.name ||
                      "-"
                    }}
                  </q-item>
                  <q-item dense>
                    {{ $t("station.connectorCode") }} :
                    {{ socket.code || "-" }}
                  </q-item>
                </div>
              </q-card-section>

              <q-card-section v-if="socket.activeTransaction">
                <q-separator size="0.1rem" />
                <q-item dense class="q-mt-sm text-bold">
                  {{ $t("active") }} {{ $t("action") }} :
                </q-item>
                <q-item dense>
                  {{ $t("paymentTransactions.nameAndSurname") }} :
                  {{ socket.activeTransaction.customer?.name }}
                  {{ socket.activeTransaction.customer?.surname }}
                </q-item>
                <q-item dense>
                  {{ $t("vehicle.licensePlate") }} :
                  {{ socket.activeTransaction.vehicle?.licensePlate }}
                </q-item>
                <q-item dense>
                  {{ $t("station.chargeStartTime") }} :
                  {{ formatDateTR(socket.activeTransaction.startTime) }}
                </q-item>
                <q-item dense>
                  {{ $t("status") }} :
                  {{ socket.activeTransaction.status?.name || "-" }}
                </q-item>
              </q-card-section>

              <!-- Başlat / Durdur -->
              <q-card-section>
                <q-separator size="0.2rem" />
                <q-card-actions class="justify-around">
                  <q-btn
                    no-caps
                    color="secondary"
                    :label="$t('station.chargeStart')"
                    :disable="!!socket.activeTransaction"
                    icon="play_circle"
                    @click="onSelectVehicle(socket)"
                  />
                  <q-separator vertical size="0.2rem" />
                  <q-btn
                    no-caps
                    color="negative"
                    :label="$t('station.chargeStop')"
                    :disable="!socket.activeTransaction"
                    icon="stop_circle"
                    @click="onFormStopCharge(socket)"
                  />
                </q-card-actions>
              </q-card-section>
            </q-card>
          </q-card-section>

          <!-- ✅ Socket kartlarının hemen altına StationLogsForm -->
          <q-separator class="q-mt-md q-mb-md" />

          <StationLogsForm
            :key="stationLogsRenderKey"
            :model-value="stationLogsModel"
            @completed="onFormCompleted"
          />
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, nextTick } from "vue";
import * as XLSX from "xlsx";
import StationLogsForm from "src/components/forms/StationLogsForm.vue";

export default defineComponent({
  components: {
    StationLogsForm,
  },
  computed: {
    currentRowLogsModel() {
      const row = this.currentRow || {};

      return {
        ...row,
        stationCode: row.stationCode || row.code || "",
      };
    },
    currentRowLogsKey() {
      const row = this.currentRow || {};
      return `${row.id || ""}-${row.stationCode || row.code || ""}`;
    },
    stationLogsModel() {
      const station = this.formModel?.station || {};

      return {
        ...station,
        stationCode: station.stationCode || station.code || "",
      };
    },
    stationLogsRenderKey() {
      const station = this.formModel?.station || {};
      const connectors = Array.isArray(station.stationConnectors)
        ? station.stationConnectors
        : [];

      const connectorState = connectors
        .map((connector) => {
          const tranId =
            connector?.activeTransaction?.chargeTransactionId ||
            connector?.activeTransaction?.transactionId ||
            "0";

          return `${connector?.id || "x"}:${tranId}`;
        })
        .join("|");

      return `${station?.id || ""}-${
        station?.stationCode || station?.code || ""
      }-${connectorState}`;
    },
    columns() {
      return [
        {
          name: "stationName",
          label: this.$t("station.stationName"),
          align: "left",
          sortable: true,
          field: (row) => row.name || "-",
        },
        {
          name: "stationCode",
          label: this.$t("station.stationCode"),
          align: "left",
          sortable: true,
          field: (row) => row.code || "-",
        },
        {
          name: "lastHeartbeatTime",
          label: this.$t("station.lastHeartbeat"),
          align: "left",
          sortable: true,
          field: (row) =>
            row.stationLogHeartbeats?.length
              ? this.formatDateTR(row.stationLogHeartbeats[0].lastHeartbeatTime)
              : "-",
        },
        {
          name: "lastBootTime",
          label: this.$t("station.lastBootTime"),
          align: "left",
          sortable: true,
          field: (row) =>
            row.stationLogBootNotifications?.length
              ? this.formatDateTR(
                  row.stationLogBootNotifications[0].lastBootTime,
                )
              : "-",
        },

        {
          name: "electricType",
          label: this.$t("station.electricType") || "Tip",
          align: "left",
          sortable: true,
          field: (row) => row.stationElectricType?.name || "-",
        },
        {
          name: "status",
          label: this.$t("status"),
          align: "left",
          sortable: true,
          field: (row) => row.stationStatus?.name || "-",
        },

        {
          name: "connectors",
          label: this.$t("station.connectors"),
          align: "left",
          sortable: false,
          field: (row) => {
            const list = Array.isArray(row.stationConnectors)
              ? row.stationConnectors
              : [];

            if (list.length === 0) return "-";

            return list
              .map((c) => {
                const idx = c?.connectorIndex ?? "-";
                const code = c?.code || c?.EPDKId || "-";
                const watt =
                  typeof c?.wattageLimit === "number" ? c.wattageLimit : null;
                const volt =
                  typeof c?.voltageLimit === "number" ? c.voltageLimit : null;

                const limitText =
                  watt !== null || volt !== null
                    ? ` (${watt !== null ? watt + "W" : "-"} / ${
                        volt !== null ? volt + "V" : "-"
                      })`
                    : "";

                return `#${idx} ${code}${limitText}`;
              })
              .join(", ");
          },
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
  data() {
    return {
      loading: false,
      rows: [],
      filter: "",
      isGrid: false,
      pagination: {
        rowsPerPage: 20,
      },

      // Tam liste
      rowsOnline: [],
      rowsOffline: [],
      rowsDisabled: [],

      // Filtrelenmiş listeler
      filteredOnlineRows: [],
      filteredOfflineRows: [],
      filteredDisabledRows: [],
      filteredVehicles: [],

      // Ekranda gösterilen (aktif taba göre)
      formVisible: false,
      maximizedToggle: false,
      currentRow: {},

      formVisibleStart: false,
      formVisibleStartOrStop: false,

      formModel: {
        plate: null,
        station: {},
      },

      vehicles: [],
      currentMode: "start", // "start" | "stop"
      isStartProcessing: false,
      isStopProcessing: false,

      tab: "online",
      searchTerm: "",
      currentStation: null,
      stationActionsVisible: false,
      stationActionsMaximized: false,

      modeProps: {
        start: {
          icon: "play_circle",
          color: "secondary",
          header: this.$t("station.chargeStart"),
          headerColor: "text-secondary",
        },
        stop: {
          icon: "stop_circle",
          color: "red",
          header: this.$t("station.chargeStop"),
          headerColor: "text-red-8",
        },
      },
    };
  },
  mounted() {
    document.title = `Magicline-${this.$t("station.stationActions")}`;
    this.init();
  },
  methods: {
    init() {
      try {
        this.getList();
      } catch (error) {}
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

    onlineTab() {
      this.rows = this.filteredOnlineRows;
    },
    offlineTab() {
      this.rows = this.filteredOfflineRows;
    },
    disabledTab() {
      this.rows = this.filteredDisabledRows;
    },

    async getList() {
      try {
        this.loading = true;

        const body = {
          stations: [],
        };

        const response = await this.$api.post("/getStationsReport", body);

        // RAW RESPONSE LOG
        this.$logger.log("getStationsReport RAW response =>", response);

        const payload = response?.data?.data || response?.data || {};

        // PAYLOAD LOG
        this.$logger.log("getStationsReport PAYLOAD =>", payload);

        // ONLINE / OFFLINE / DISABLED LOG
        this.$logger.log("ONLINE stations =>", payload.online || []);
        this.$logger.log("OFFLINE stations =>", payload.offline || []);
        this.$logger.log("DISABLED stations =>", payload.disabled || []);

        this.rowsOnline = this.filteredOnlineRows = payload.online || [];
        this.rowsOffline = this.filteredOfflineRows = payload.offline || [];
        this.rowsDisabled = this.filteredDisabledRows = payload.disabled || [];

        if (this.tab === "online") this.rows = this.rowsOnline;
        if (this.tab === "offline") this.rows = this.rowsOffline;
        if (this.tab === "disabled") this.rows = this.rowsDisabled;
      } catch (error) {
        this.$logger.error("getStationsReport ERROR =>", error);
      } finally {
        this.loading = false;
      }
    },

    async getStationLogs(row) {
      try {
        this.currentRow = {
          ...row,
          stationCode: row?.stationCode || row?.code || "",
        };

        this.formVisible = false;
        await nextTick();
        this.formVisible = true;
      } catch (error) {
        this.$logger.error(error);
      }
    },

    exportTable() {
      const table = this.$refs.table;
      const rows = table.filteredSortedRows;

      const data = rows.map((row) =>
        this.columns.map((col) =>
          typeof col.field === "function" ? col.field(row) : row[col.field],
        ),
      );

      const header = this.columns.map((col) => col.label);
      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      XLSX.writeFile(workbook, "StationActions.xlsx");
    },
    async onClickConnector(stationRow, connector) {
      try {
        this.formModel.station = {
          ...stationRow,
          stationConnectors: Array.isArray(stationRow.stationConnectors)
            ? stationRow.stationConnectors.map((c) => ({
                ...c,
                activeTransaction: null,
              }))
            : [],
        };

        await this.onStationChange();
        this.stationActionsVisible = true;
      } catch (e) {
        this.$logger.error("onClickConnector error:", e);
      }
    },

    async getVehicles() {
      try {
        const response = await this.$api.get("getVehicles");
        this.vehicles = Array.isArray(response.data) ? response.data : [];
        this.filteredVehicles = this.vehicles;
      } catch (error) {
        this.$logger.error("getVehicles error:", error);
        this.vehicles = [];
      }
    },
    async onStartCharge() {
      try {
        this.isStartProcessing = true;

        const connectorCode = this.currentRow?.code;
        const customerId = this.formModel?.plate?.customer?.id;
        const vehicleId = this.formModel?.plate?.id;

        if (!connectorCode || !customerId || !vehicleId) {
          this.$q.notify({
            type: "negative",
            message: "Eksik bilgi",
          });
          this.isStartProcessing = false;
          return;
        }

        const body = { connectorCode, customerId, vehicleId, getPaid: false };
        this.$logger.log("Remote Start Transaction body:", body);

        const resp = await this.$api.post("startTransaction", body);

        this.$q.notify({
          type: "positive",
          message: this.$t("success") || "Başarılı",
        });

        setTimeout(async () => {
          this.formVisibleStartOrStop = false;
          this.isStartProcessing = false;
          await this.onStationChange();
        }, 6000);
      } catch (e) {
        this.$logger.error("onStartCharge error:", e);
        this.isStartProcessing = false;
        this.$q.notify({
          type: "negative",
          message: this.$t("failed") || "Hata",
        });
      }
    },

    async onStopCharge() {
      try {
        this.isStopProcessing = true;

        const tranId =
          this.currentRow?.activeTransaction?.chargeTransactionId ||
          this.currentRow?.activeTransaction?.transactionId;

        if (!tranId) {
          this.$q.notify({
            type: "negative",
            message: "transactionId bulunamadı.",
          });
          this.isStopProcessing = false;
          return;
        }

        const body = { transactionId: tranId };
        this.$logger.log("Remote Stop Transaction body:", body);

        const resp = await this.$api.post("stopTransaction", body);

        this.$q.notify({
          type: "positive",
          message: this.$t("success"),
        });

        this.formVisibleStartOrStop = false;
        await this.onStationChange();
      } catch (e) {
        this.$logger.error("onStopCharge error:", e);
        this.$q.notify({
          type: "negative",
          message: this.$t("failed") || "Hata",
        });
      } finally {
        this.isStopProcessing = false;
      }
    },

    async onForceStopCharge() {
      try {
        const chargeTransactionId =
          this.currentRow?.activeTransaction?.chargeTransactionId;

        if (!chargeTransactionId) {
          this.$q.notify({
            type: "negative",
            message: "chargeTransactionId bulunamadı.",
          });
          return;
        }

        const body = {
          chargeTransactionId,
          statusId: 2,
          endTime:
            this.currentRow?.activeTransaction?.chargeTransaction?.updatedAt ||
            new Date().toISOString(),
        };

        this.$logger.log("Force Stop Status Update body:", body);

        const resp = await this.$api.post(
          "chargeTransactionStatusUpdate",
          body,
        );

        this.$q.notify({
          type: "positive",
          message: this.$t("success") || "Başarılı",
        });

        this.formVisibleStartOrStop = false;
        await this.onStationChange();
      } catch (e) {
        this.$logger.error("onForceStopCharge error:", e);
        this.$q.notify({
          type: "negative",
          message: this.$t("failed") || "Hata",
        });
      }
    },

    onCloseForm() {
      try {
        this.formVisibleStart = false;
        this.formVisibleStartOrStop = false;

        // sadece plate'i sıfırlayalım (tablo seçimleri bozulmasın)
        this.formModel = { ...this.formModel, plate: null };
        this.currentRow = {};
        this.currentMode = "start";

        this.isStartProcessing = false;
        this.isStopProcessing = false;
      } catch (e) {}
    },

    filterVehicles(val, update) {
      const source = this.vehicles || [];
      const normalizedVal = this.$normalizeTurkishString(val || "");

      update(() => {
        if (val === "") {
          this.filteredVehicles = source;
          return;
        }

        this.filteredVehicles = source.filter((vehicle) => {
          const plate = this.$normalizeTurkishString(
            vehicle.licensePlate || "",
          );
          const name = this.$normalizeTurkishString(
            vehicle.customer?.name || "",
          );
          const surname = this.$normalizeTurkishString(
            vehicle.customer?.surname || "",
          );
          const fullName = `${name} ${surname}`.trim();

          return (
            plate.includes(normalizedVal) ||
            name.includes(normalizedVal) ||
            surname.includes(normalizedVal) ||
            fullName.includes(normalizedVal)
          );
        });
      });
    },
    async onConfirmStartCharge() {
      try {
        const isValid = await this.$refs.plateRef?.validate?.();
        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }

        this.currentMode = "start";
        this.formVisibleStart = false;
        this.formVisibleStartOrStop = true;
      } catch (e) {}
    },
    async onFormCompleted() {
      await this.onStationChange();
    },
    async getActiveTransactionForConnector(stationId, connectorId) {
      try {
        const resp = await this.$api.get(
          `getActiveTransactionsByStationId/${stationId}`,
        );

        const list = resp?.data?.activeTransactions || [];

        return list.find((t) => t?.connectorId === connectorId) || null;
      } catch (e) {
        this.$logger.error("getActiveTransactionForConnector error:", e);
        return null;
      }
    },
    async onStationChange() {
      try {
        const stationId = this.formModel.station?.id;
        if (!stationId) return;

        const resp = await this.$api.get(
          `getActiveTransactionsByStationId/${stationId}`,
        );

        const activeList = Array.isArray(resp?.data?.activeTransactions)
          ? resp.data.activeTransactions
          : [];

        const mapByConnectorId = new Map(
          activeList.map((t) => [t.connectorId, t]),
        );

        const updatedConnectors = (
          this.formModel.station.stationConnectors || []
        ).map((sock) => {
          // aktifTransaction datasındaki connectorId == socket.id (sende böyle görünüyor)
          return {
            ...sock,
            activeTransaction: mapByConnectorId.get(sock.id) || null,
          };
        });

        this.formModel = {
          ...this.formModel,
          station: {
            ...this.formModel.station,
            stationConnectors: updatedConnectors,
          },
        };
      } catch (e) {
        this.$logger.error("onStationChange error:", e);
      }
    },
    closeStationActionsDialog() {
      this.stationActionsVisible = false;
      this.stationActionsMaximized = false;
    },
    async onSelectVehicle(socket) {
      try {
        // start dialog zaten sende var, aynı akış
        this.currentMode = "start";
        this.currentRow = socket; // connector code burada
        this.formModel.plate = null;

        this.formVisibleStart = true; // araç seçimi dialog
        await this.getVehicles();
      } catch (e) {
        this.$logger.error("onSelectVehicle error:", e);
      }
    },
    onFormStopCharge(socket) {
      try {
        if (!socket?.activeTransaction) return;

        this.currentMode = "stop";
        this.currentRow = {
          ...socket,
          activeTransaction: socket.activeTransaction,
        };

        // confirm dialogda isim/plaka görünmesi için:
        this.formModel.plate = {
          id: socket.activeTransaction?.vehicle?.id || null,
          licensePlate: socket.activeTransaction?.vehicle?.licensePlate || "-",
          customer: socket.activeTransaction?.customer || null,
        };

        this.formVisibleStartOrStop = true; // ✅ senin mevcut confirm dialog
      } catch (e) {
        this.$logger.error("onFormStopCharge error:", e);
      }
    },
  },
});
</script>

<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s
.my-sticky-header-table
  max-height: 600px

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px
.connector-wrap
  display: flex
  flex-wrap: wrap
  gap: 6px
  align-items: center

.connector-btn
  width: 30px
  height: 30px
  min-width: 30px
  border-radius: 8px
  border: 1px solid rgba(0,0,0,.15)
  color: #111 !important
</style>
