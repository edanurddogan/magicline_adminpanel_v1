<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <q-card shadow-4>
      <q-card-section class="bg-primary text-white">
        <div>{{ $t("station.stationActions") }}</div>
      </q-card-section>
      <!-- Bölge ve İstasyon seçimi -->
      <q-card-section>
        <q-list class="row justify-center">
          <!-- Bölge seç -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12 q-mb-md">
            <q-item-section>
              <q-select
                v-model="selectedRegion"
                :options="filteredRegions"
                option-value="id"
                option-label="name"
                :label="$t('region.region')"
                options-dense
                emit-value
                map-options
                use-input
                outlined
                dense
                @filter="
                  (val, update) =>
                    filterList(val, update, 'regions', 'filteredRegions')
                "
                @update:model-value="onRegionChange"
              >
                <template #prepend>
                  <q-icon name="location_on" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- İstasyon seç -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                ref="stationRef"
                v-model="formModel.station"
                :options="filteredStations"
                option-value="id"
                option-label="name"
                :label="$t('station.station')"
                options-dense
                map-options
                use-input
                outlined
                dense
                @filter="
                  (val, update) =>
                    filterList(val, update, 'stations', 'filteredStations')
                "
                @update:model-value="onStationChange"
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="ev_station" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <!-- İstasyon işlemleri -->
      <q-card-section v-if="formModel.station.id">
        <q-list class="row justify-center">
          <q-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-card-section
              class="row bg-primary text-white justify-between items-center"
            >
              <div>
                {{ $t("station.stationInfo") }} : {{ formModel.station.name }}
              </div>
              <!--İstasyon İşlem Butonu -->
              <q-fab
                color="secondary"
                push
                :label="$t('station.stationActions')"
                label-position="left"
                icon="keyboard_arrow_up"
                direction="up"
                padding="sm"
              >
                <!-- FAB açılınca çıkan butonlar -->
                <q-fab-action
                  color="primary"
                  @click="onStationReset('soft')"
                  icon="restart_alt"
                >
                  <q-tooltip class="bg-white text-primary text-md">{{
                    $t("station.softReset")
                  }}</q-tooltip>
                </q-fab-action>

                <q-fab-action
                  color="accent"
                  @click="onStationReset('hard')"
                  icon="handyman"
                >
                  <q-tooltip class="bg-white text-primary">{{
                    $t("station.hardReset")
                  }}</q-tooltip>
                </q-fab-action>
              </q-fab>
            </q-card-section>
            <!-- Socket Kartları -->
            <q-card-section class="row justify-end q-pa-none q-pr-md q-pt-md">
              <q-btn
                dense
                round
                unelevated
                size="m"
                icon="refresh"
                color="primary"
                class="refresh-btn"
                :disable="loading || !formModel.station.id"
                @click="onStationChange"
              >
                <q-tooltip class="bg-white text-primary">
                  {{ $t("refresh") }}
                </q-tooltip>
              </q-btn>
            </q-card-section>

            <q-card-section class="row justify-around q-pt-none">
              <q-card
                v-for="(socket, index) in formModel.station.stationConnectors"
                :key="index"
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
                      {{ formModel.station.stationElectricType.name }}
                    </q-item>
                  </div>

                  <div>
                    <q-item dense>
                      {{ $t("station.socketStatus") }} :
                      {{ socket.connectorStatus }}
                    </q-item>
                    <q-item dense>
                      {{ $t("station.connectorCode") }} :
                      {{ socket.code }}
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
                    {{ formatDateTime(socket.activeTransaction.startTime) }}
                  </q-item>
                  <q-item dense>
                    {{ $t("status") }} :
                    {{ socket.activeTransaction.status.name }}
                  </q-item>
                </q-card-section>

                <!-- Başlat ve Durdur Butonları -->
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
          </q-card>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Form Charge Start Dialog -->
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

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("station.chargeStart")
              }}</span>
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
            <q-btn dense flat icon="close" @click="onCloseForm()" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <!-- Kullanıcı ve Plaka Seçimi -->
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
              transition-show="scale"
              transition-hide="scale"
              @filter="filterVehicles"
              @update:model-value="onChangeVehicle"
              :rules="[(val) => !!val || $t('requiredlabel')]"
              style="width: 80%"
            >
              <template #prepend>
                <q-icon name="11mp" />
              </template>

              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.licensePlate }}
                    </q-item-label>
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
        <!-- Şarj Başlat butonu -->
        <q-card-actions class="justify-center">
          <q-item>
            <q-btn
              color="secondary"
              :label="$t('station.chargeStart')"
              icon="play_circle"
              @click="onConfirmStartCharge(socket)"
            />
          </q-item>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--  Form Charge Start or Stop Dialog -->
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
            <b>{{ currentRow.code }}</b>
          </div>
          <div class="text-subtitle1">
            {{ $t("users.username") }} :
            <b
              >{{ formModel.plate.customer?.name }}
              {{ formModel.plate.customer?.surname }}</b
            >
          </div>
          <div class="text-subtitle1">
            {{ $t("vehicle.licensePlate") }} :
            <b>{{ formModel.plate?.licensePlate }}</b>
          </div>
        </q-card-section>

        <q-card-actions align="around">
          <q-btn
            :label="$t('cancel')"
            color="red"
            :disable="isStartProcessing"
            @click="onCloseForm()"
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
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";

export default defineComponent({
  components: {},
  data() {
    return {
      formModel: {
        station: { id: null, name: "Seç" },
        customer: { id: null, name: "Seç" },
      },
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

      regions: [],
      stations: [],
      customers: [],
      dealers: [],
      vehicles: [],
      filteredRegions: [],
      filteredStations: [],
      filteredDealers: [],
      filteredCustomers: [],
      filteredVehicles: [],
      selectedRegion: { name: "Seç" },
      loading: false,
      formVisible: false,
      deleteConfirm: false,
      maximizedToggle: false,
      formVisibleStart: false,
      formVisibleStartOrStop: false,
      currentRow: {},
      currentMode: "",
      activeTransactions: {},
      isStartProcessing: false,
      isStopProcessing: false,
    };
  },
  computed: {},

  async mounted() {
    this.init();
  },
  methods: {
    init() {
      document.title = `${firm.name}-${this.$t("station.stationActions")}`;
      this.getRegions();
      this.getStations();
    },

    async getRegions() {
      try {
        this.loading = true;
        const response = await this.$api.get("getRegions");
        this.regions = this.filteredRegions = response.data.data;
      } catch (error) {
        this.$logger.error("Error fetching getRegions list:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },
    async getStations() {
      try {
        const body = {
          available: null,
          stationElectricTypeId: null,
          isActive: true,
        };
        this.loading = true;
        const response = await this.$api.post("getStations", body);
        this.stations = this.filteredStations = response.data;
      } catch (error) {
        this.$logger.error("Error fetching getStations list:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },
    async getVehicles() {
      try {
        this.loading = true;
        const response = await this.$api.get("getVehicles");
        this.vehicles = this.filteredVehicles = response.data;
      } catch (error) {
        this.$logger.error("Error fetching getVehicles list:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },
    async getCustomers() {
      try {
        this.loading = true;
        const response = await this.$api.get("getCustomers/999/1/true");
        this.customers = this.filteredCustomers = response.data;
      } catch (error) {
        this.$logger.error("Error fetching getCustomers list:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },
    async getDealers() {
      try {
        this.loading = true;
        const response = await this.$api.get("getDealers");
        this.dealers = this.filteredDealers = response.data.data;
      } catch (error) {
        this.$logger.error("Error fetching getDealers list:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },
    async getCustomerVehicles() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          `getUserVehicles/${this.formModel.customer.id}`,
        );
        this.vehicles = this.filteredVehicles = response.data;
      } catch (error) {
        this.$logger.error("Error fetching getVehicles list:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },
    async getDealerVehicles() {
      try {
        this.loading = true;
        console.log("Dealer ID:", this.formModel.dealer.id);
        const response = await this.$api.get(
          `getDealerVehicles/${this.formModel.dealer.id}`,
        );
        this.vehicles = this.filteredVehicles = response.data.data;
      } catch (error) {
        this.$logger.error("Error fetching getVehicles list:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },
    async onRegionChange() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          `getStationsByRegion/${this.selectedRegion}`,
        );
        this.stations = this.filteredStations = response.data.data;
        this.formModel.station = { id: null, name: "Seç" };
      } catch (error) {}
    },
    async onStationChange() {
      try {
        // İstasyon seçilince aktif işlemleri al
        const response = await this.$api.get(
          `getActiveTransactionsByStationId/${this.formModel.station.id}`,
        );

        this.activeTransactions = response.data.activeTransactions;
        this.$logger.log(
          "Active Transactions Response",
          this.activeTransactions,
        );
        // İstasyonun soketlerine varsa aktif şarj işlemlerini konnektör nesnesine ekle
        this.formModel.station.stationConnectors =
          this.formModel.station.stationConnectors.map((connector) => {
            const match = this.activeTransactions.find(
              (tran) => tran.connectorId === connector.id,
            );
            if (match) {
              return { ...connector, activeTransaction: match };
            } else {
              return { ...connector, activeTransaction: null };
            }
          });
        this.$logger.log("Aktif İşlemler", this.activeTransactions);
        this.$logger.log("Seçilen İstasyon", this.formModel.station);
      } catch (error) {
        this.$logger.error("Error getActiveTransactionsByStation", error);
      }
    },
    async onStationReset(resetType) {
      try {
        this.$logger.log(
          "reset",
          `sas/stationReset/${this.formModel.station.code}/${resetType}`,
        );
        const response = await this.$api.post(
          `sas/stationReset/${this.formModel.station.code}/${resetType}`,
        );

        if (response.data.status === 200) {
          this.$q.notify({
            type: "positive",
            message: this.$t("operationSuccessful"),
          });
        } else {
          this.$q.notify({
            type: "negative",
            message: this.$t("operationFailed"),
          });
        }
      } catch (error) {}
    },
    async onStartCharge() {
      try {
        this.isStartProcessing = true;
        const body = {
          connectorCode: this.currentRow.code,
          customerId: this.formModel.plate.customer.id,
          vehicleId: this.formModel.plate.id,
        };

        const response = await this.$api.post("startTransaction", body);
        this.$logger.log("Remote Start Transaction:", body);
        //2 saniye beklet
        setTimeout(() => {
          this.formVisibleStartOrStop = false;
          this.isStartProcessing = false;
          this.onStationChange();
        }, 6000);
        //this.resetForm();
      } catch (error) {
        this.isStartProcessing = false;
      }
    },
    async onStopCharge() {
      try {
        this.isStopProcessing = true;
        const body = {
          transactionId: this.currentRow.activeTransaction.chargeTransactionId,
        };
        this.$logger.log("Remote Stop Transaction ID:", body);
        const response = await this.$api.post("stopTransaction", body);
        if (response?.data?.status === 200 || response?.status === 200) {
          this.$q.notify({
            type: "positive",
            message: this.$t("success"),
          });
        } else {
          this.$q.notify({
            type: "negative",
            message: this.$t("failed"),
          });
        }
        this.formVisibleStartOrStop = false;
        this.isStopProcessing = false;
        await this.onStationChange();
      } catch (error) {
        this.$logger.log("Remote Stop Transaction error:", error);

        this.$q.notify({
          type: "negative",
          message: this.$t("failed"),
        });
      } finally {
        this.isStopProcessing = false;
      }
    },
    filterList(val, update, sourceList, filterList) {
      const source = this[sourceList];
      const normalizedVal = this.$normalizeTurkishString(val);

      update(() => {
        this[filterList] =
          val === ""
            ? source
            : source.filter((item) =>
                this.$normalizeTurkishString(item.name).includes(normalizedVal),
              );
      });
    },
    filterCustomers(val, update) {
      if (val === "") {
        update(() => {
          this.filteredCustomers = [...this.customers];
        });
        return;
      }

      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        this.filteredCustomers = this.customers.filter((customer) => {
          const name = this.$normalizeTurkishString(customer.name || "");
          const surname = this.$normalizeTurkishString(customer.surname || "");
          const phone = this.$normalizeTurkishString(customer.phone || "");

          return (
            name.includes(normalizedVal) ||
            surname.includes(normalizedVal) ||
            phone.includes(normalizedVal)
          );
        });
      });
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
    onSelectCustomerOrDealer(socket) {
      this.getCustomers();
      this.getDealers();
      this.currentRow = socket;
      this.formVisibleStart = true;
    },
    onSelectVehicle(socket) {
      this.getVehicles();
      this.formModel.plate = null;
      this.currentRow = socket;
      this.formVisibleStart = true;
    },
    onFormStopCharge(socket) {
      const { customer, vehicle } = socket.activeTransaction;

      this.formModel.customer = {
        name: customer?.name,
        surname: customer?.surname,
      };

      this.formModel.plate = {
        licensePlate: vehicle?.licensePlate,
      };

      this.currentRow = socket;
      this.currentMode = "stop";
      this.formVisibleStartOrStop = true;
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
      } catch (error) {}
      if (this.formModel.dealer?.id) {
        this.formModel.customer.name = `${this.formModel.dealer.name} - ${this.formModel.vehicleFleet.name}`;
      }
      this.currentMode = "start";
      this.formVisibleStart = false;
      this.formVisibleStartOrStop = true;
    },

    onChangeCustomer() {
      try {
        this.formModel.dealer = { id: null, name: "Seç" };
        this.formModel.plate = { id: null, licensePlate: "Seç" };
        this.getCustomerVehicles();
      } catch (error) {}
    },
    onChangeDealer() {
      try {
        this.formModel.customer = { id: null, name: "Seç" };
        this.formModel.plate = { id: null, licensePlate: "Seç" };
        this.getDealerVehicles();
      } catch (error) {}
    },
    async onChangeVehicle() {
      try {
        if (!this.formModel.plate) {
          return;
        }
        this.loading = true;
        console.log("Selected Vehicle", this.formModel.plate);
        const response = await this.$api.get(
          `getVehicleOwners/${this.formModel.plate.id}`,
        );
        this.customers = this.filteredCustomers = response.data;
        this.formModel.customer = { id: null, name: "Seç" };
      } catch (error) {
        this.$logger.error("Error fetching getRegions list:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },
    async onForceStopCharge() {
      try {
        const body = {
          chargeTransactionId:
            this.currentRow.activeTransaction.chargeTransactionId,
          statusId: 2,
        };

        this.$logger.log("Force Stop Transaction Status Update:", body);

        const response = await this.$api.post(
          "chargeTransactionStatusUpdate",
          body,
        );

        if (response?.data?.status === 200 || response?.status === 200) {
          this.$q.notify({
            type: "positive",
            message: this.$t("success"),
          });

          await this.onStationChange();
          this.formVisibleStartOrStop = false;
        } else {
          this.$q.notify({
            type: "negative",
            message: this.$t("failed"),
          });
        }
      } catch (error) {
        this.$logger.error("Force Stop Error:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("failed"),
        });
      }
    },

    customersLabel(option) {
      return option.id == null
        ? "Seç"
        : `${option.name} ${option.surname} - ${option.phone}`;
    },
    onCloseForm() {
      try {
        this.formModel = {
          station: this.formModel.station,
          customer: { id: null, name: "Seç" },
          plate: { id: null, licensePlate: "Seç" },
        };
      } catch (error) {}
    },
    resetForm() {
      this.formVisibleStartOrStop = false;
      this.formModel = {
        station: { id: null, name: "Seç" },
        customer: { id: null, name: "Seç" },
        plate: { id: null, licensePlate: "Seç" },
      };
      this.selectedRegion = { name: "Seç" };
    },
    formatDateTime(val) {
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
.dialog-dark-overlay
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: rgba(0, 0, 0, 0.45)
  z-index: 10
  border-radius: 12px
</style>
