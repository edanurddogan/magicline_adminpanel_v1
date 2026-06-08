<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <q-expansion-item
    expand-separator
    icon="add"
    color="primary"
    :label="$t('callCenter.createCall')"
  >
    <!-- Ön Kayıt Belirleme -->
    <div class="row q-pa-md">
      <q-card class="q-pa-md col-6">
        <q-list class="row q-col-gutter-md q-gutter-y-md">
          <!-- Kullanıcı Seçimi -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.customer"
                :options="filteredCustomer"
                option-value="id"
                :option-label="customersLabel"
                :label="$t('users.users')"
                :loading="loading"
                map-options
                clearable
                outlined
                dense
                use-input
                transition-show="scale"
                transition-hide="scale"
                @filter="filterCustomers"
                style="width: 100%"
              >
                <template #prepend>
                  <q-icon name="person" />
                </template>
                <template #selected-item="scope">
                  {{ scope.opt.name }} {{ scope.opt.surname }}
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Araç Seçimi -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.vehicle"
                :options="filteredVehicle"
                option-value="id"
                option-label="licensePlate"
                :label="$t('vehicle.vehicles')"
                :loading="loading"
                map-options
                clearable
                outlined
                dense
                use-input
                transition-show="scale"
                transition-hide="scale"
                @filter="filterLicensePlate"
                style="width: 100%"
              >
                <template #prepend>
                  <q-icon name="electric_car" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- İstasyon Seçimi -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.station"
                :options="filteredStation"
                option-value="id"
                option-label="name"
                :label="$t('station.stations')"
                :loading="loading"
                map-options
                clearable
                outlined
                dense
                use-input
                transition-show="scale"
                transition-hide="scale"
                @filter="filterStations"
                style="width: 100%"
              >
                <template #prepend>
                  <q-icon name="ev_station" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Bayi Seçimi -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.dealer"
                :options="filteredStation"
                option-value="id"
                option-label="name"
                :label="$t('dealer.dealers')"
                :loading="loading"
                map-options
                clearable
                outlined
                dense
                use-input
                transition-show="scale"
                transition-hide="scale"
                @filter="filterStations"
                style="width: 100%"
              >
                <template #prepend>
                  <q-icon name="ev_station" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>

          <!-- İşletim Sistemi Seçimi -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.callOperatingSystem"
                :options="filteredOperatingSystem"
                option-value="id"
                option-label="name"
                :label="$t('callCenter.operatingSystem')"
                outlined
                dense
                clearable
              >
                <template #prepend>
                  <q-icon name="devices" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Tarih/Saat Seçimi -->
          <q-item class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input filled v-model="formModel.occurredAt">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="formModel.occurredAt"
                        mask="YYYY-MM-DD HH:mm"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="formModel.occurredAt"
                        mask="YYYY-MM-DD HH:mm"
                        format24h
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <!--  Anlık Tarih/Saat Seçimi -->
          <q-item class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
            <q-item-section>
              <q-btn
                class="full-width text-capitalize q-py-sm"
                color="primary"
                icon="update"
                @click="setInstantClockDate()"
              >
                <q-tooltip>{{ $t("callCenter.instantClockDate") }}</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
      <!-- Durum-Atama Seçimi -->
      <q-card class="q-pa-md col-6">
        <q-list class="row q-col-gutter-md q-gutter-y-md">
          <!-- Durum Seçimi -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.callStatus"
                :options="filteredStatus"
                option-value="id"
                option-label="name"
                :label="$t('callCenter.selectStatus')"
                :loading="loading"
                :rules="[requiredSelectRule]"
                map-options
                clearable
                outlined
                dense
                lazy-rules
                transition-show="scale"
                transition-hide="scale"
              >
                <template #prepend>
                  <q-icon name="list_alt" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Atama Seçimi -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.assignedDepartment"
                :options="filteredAssigment"
                option-value="id"
                option-label="name"
                :label="$t('callCenter.selectAssigment')"
                :loading="loading"
                :rules="[requiredSelectRule]"
                map-options
                clearable
                outlined
                dense
                lazy-rules
                transition-show="scale"
                transition-hide="scale"
              >
                <template #prepend>
                  <q-icon name="assignment_returned" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Çağrı Kategori Seçimi -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.callComplaintCategory"
                :options="filteredCallCategory"
                option-value="id"
                option-label="name"
                :label="$t('callCenter.selectCallCategory')"
                :loading="loading"
                :rules="[requiredSelectRule]"
                map-options
                clearable
                outlined
                dense
                lazy-rules
                transition-show="scale"
                transition-hide="scale"
              >
                <template #prepend>
                  <q-icon name="subject" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Öncelik Seçimi -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.callPriority"
                :options="filteredPriority"
                option-value="id"
                option-label="name"
                :label="$t('callCenter.selectPriority')"
                :loading="loading"
                :rules="[requiredSelectRule]"
                map-options
                clearable
                outlined
                dense
                lazy-rules
                transition-show="scale"
                transition-hide="scale"
              >
                <template #prepend>
                  <q-icon name="priority_high" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Kaynak -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.callSource"
                :options="filteredSource"
                option-value="id"
                option-label="name"
                :label="$t('callCenter.selectSource')"
                :loading="loading"
                :rules="[requiredSelectRule]"
                map-options
                clearable
                outlined
                dense
                lazy-rules
                transition-show="scale"
                transition-hide="scale"
              >
                <template #prepend>
                  <q-icon name="apps" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
    <!-- Şikayet ve Çözüm -->
    <div class="q-pa-md">
      <q-card class="q-pa-lg">
        <q-list class="row q-col-gutter-lg">
          <!-- Müşteri Şikayeti -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                v-model="formModel.complaintText"
                :rules="[requiredSelectRule]"
                type="textarea"
                outlined
                :label="
                  $t('callCenter.customerComplaint') || 'Müşteri Şikayeti'
                "
                autogrow
                input-style="min-height: 200px;"
              >
                <template #prepend>
                  <q-icon name="report_problem" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <!-- Çözüm -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                v-model="formModel.solution"
                type="textarea"
                outlined
                :label="$t('callCenter.solution') || 'Çözüm'"
                autogrow
                input-style="min-height: 200px;"
              >
                <template #prepend>
                  <q-icon name="lightbulb" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <!-- Kaydet Butonu -->
    <div class="row q-pa-md justify-end">
      <q-item class="col-lg-1 col-md-2 col-sm-4 col-xs-12">
        <q-item-section>
          <q-btn
            class="full-width text-capitalize q-py-sm"
            color="primary"
            :label="$t('Ekle')"
            @click="callCreate()"
          >
            <q-tooltip>{{ $t("list") }}</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </div>
  </q-expansion-item>

  <!-- Tablo -->
  <div class="q-pa-md">
    <q-table
      ref="table"
      flat
      bordered
      dense
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
          <div
            class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title"
          ></div>
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

      <template #body-cell-action="props">
        <q-td :props="props" class="text-center">
          <q-btn
            flat
            dense
            round
            color="secondary"
            icon="edit"
            @click="onEdit(props.row)"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("edit") }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          <span> {{ message }}... </span>
        </div>
      </template>
      <template #body-cell-StationName="props">
        <q-td :props="props">
          <span class="text-primary cursor-pointer">
            {{ props.row?.station?.name || "-" }}
            <q-tooltip anchor="bottom middle" self="top middle">
              <div class="column">
                <div>
                  <strong>{{ $t("dealer.dealer") }}:</strong>
                  {{
                    props.row?.station?.dealer?.name ||
                    props.row.dealer?.name ||
                    "-"
                  }}
                </div>
                <div>
                  <strong>{{ $t("region.region") }}:</strong>
                  {{
                    props.row.stationRegion?.name ||
                    props.row.region?.name ||
                    "-"
                  }}
                </div>
              </div>
            </q-tooltip>
          </span>
        </q-td>
      </template>
      <template #body-cell-Status="props">
        <q-td :props="props" class="text-center">
          <q-chip
            :style="{
              backgroundColor:
                props.row?.callStatus?.id === 1
                  ? '#16A34A'
                  : props.row?.callStatus?.id === 2
                  ? '#3B82F6'
                  : props.row?.callStatus?.id === 3
                  ? '#9CA3AF'
                  : props.row?.callStatus?.id === 4
                  ? '#DC2626'
                  : '',
            }"
            text-color="white"
            dense
            square
            class="text-weight-bolder"
          >
            {{ props.row?.callStatus?.name || "-" }}
          </q-chip>
        </q-td>
      </template>
    </q-table>
  </div>
  <!-- Form Dialog -->
  <q-dialog
    v-model="formVisible"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 70vw; max-height: 90vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-sm">
          <q-icon name="person" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{
              $t("callCenter.callLog")
            }}</span>
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
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">{{
              $t("maximize")
            }}</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 80vh" class="scroll">
        <complaint-form
          class="q-pa-sm"
          v-model="currentRow"
          :mode="currentMode"
          @completed="onFormCompleted"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import * as XLSX from "xlsx";
import { date } from "quasar";
import ComplaintForm from "src/components/forms/ComplaintForm.vue";

export default defineComponent({
  components: {
    ComplaintForm,
  },
  computed: {
    columns() {
      return [
        {
          name: "StationName",
          label: this.$t("station.stationName"),
          align: "left",
          field: (row) => row?.station?.name || "-",
        },
        {
          name: "ticketCreator",
          label: this.$t("callCenter.ticketCreator"),
          align: "center",
          field: (row) =>
            `${row?.customer?.name || ""} ${
              row?.customer?.surname || ""
            }`.trim() || "-",
          sortable: true,
        },
        {
          name: "assignedEmployee",
          label: this.$t("callCenter.assignedEmployee"),
          align: "center",
          field: (row) =>
            `${row?.assignedEmployee?.name || ""} ${
              row?.assignedEmployee?.surname || ""
            }`.trim() || "-",
        },
        {
          name: "LicensePlate",
          label: this.$t("vehicle.licensePlate"),
          align: "center",
          field: (row) => row?.vehicle?.licensePlate || "-",
          sortable: true,
        },
        {
          name: "OccurredAt",
          label: this.$t("callCenter.occurredAt"),
          align: "center",
          field: (row) =>
            row?.occurredAt ? this.dateFormat(row.occurredAt) : "-",
          sortable: true,
        },
        {
          name: "Asssigment",
          label: this.$t("callCenter.assignedDepartment"),
          align: "center",
          field: (row) => row?.assignedDepartment?.name || "-",
          sortable: true,
        },
        {
          name: "ComplaintCategory",
          label: this.$t("callCenter.callCategory"),
          align: "center",
          // Sadece isim (ilişki geldiyse)
          field: (row) => row?.callComplaintCategory?.name || "-",
          sortable: true,
        },
        {
          name: "Priority",
          label: this.$t("callCenter.priority"),
          align: "center",
          field: (row) => row?.callPriority?.name || "-",
          sortable: true,
        },
        {
          name: "Status",
          label: this.$t("status"),
          align: "center",
          field: (row) => row?.callStatus?.name || "-",
          sortable: true,
        },
        {
          name: "action",
          label: this.$t("action"),
          align: "center",
        },
      ];
    },
  },
  data() {
    return {
      loading: false,
      rows: [],
      filteredRows: [],
      maximizedToggle: false,
      filter: "",
      isGrid: false,
      formVisible: false,
      currentRow: null,
      pagination: {
        rowsPerPage: 20,
      },

      stations: [],
      customers: [],
      vehicles: [],
      operatingSystem: [],
      status: [],
      assigment: [],
      callCategory: [],
      priority: [],
      source: [],

      filteredStation: [],
      filteredCustomer: [],
      filteredVehicle: [],
      filteredStatus: [],
      filteredOperatingSystem: [],
      filteredAssigment: [],
      filteredCallCategory: [],
      filteredPriority: [],
      filteredSource: [],

      formModel: {
        customer: null,
        customerId: null,
        vehicle: null,
        vehicleId: null,
        station: null,
        stationId: null,
        dealerId: null,
        stationRegionId: null,
        regionId: null,
        callOperatingSystem: null,
        callOperatingSystemId: null,
        callStatusId: null,
        assignedDepartmentId: null,
        callComplaintCategoryId: null,
        callPriorityId: null,
        callSourceId: null,
        occurredAt: null,
        complaintText: "",
        solution: "",
      },
    };
  },
  async mounted() {
    this.init();
    document.title = `${firm.name}-Çağrı Merkezi`;
  },
  methods: {
    requiredSelectRule(value) {
      return !!value || this.$t("required");
    },
    validateRequiredCallFields() {
      const requiredFields = [
        {
          value: this.formModel.callStatus,
          label: this.$t("callCenter.selectStatus"),
        },
        {
          value: this.formModel.assignedDepartment,
          label: this.$t("callCenter.selectAssigment"),
        },
        {
          value: this.formModel.callComplaintCategory,
          label: this.$t("callCenter.selectCallCategory"),
        },
        {
          value: this.formModel.callPriority,
          label: this.$t("callCenter.selectPriority"),
        },
        {
          value: this.formModel.callSource,
          label: this.$t("callCenter.selectSource"),
        },
      ];

      const missingField = requiredFields.find((field) => !field.value);
      if (!missingField) {
        return true;
      }

      this.$q.notify({
        type: "negative",
        message: `${missingField.label} zorunludur.`,
      });
      return false;
    },
    init() {
      try {
        this.getStations();
        this.getCustomers();
        this.getVehicles();
        this.getOperatingSystem();
        this.getStatus();
        this.getAssigment();
        this.getCallCategory();
        this.getPriority();
        this.getSource();
        this.setInstantClockDate();
        this.getList();
      } catch (error) {}
    },
    onAdd(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "add";
      this.formVisible = true;
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
    async getStations() {
      try {
        const body = {
          available: null,
          stationElectricTypeId: null,
          isActive: true,
        };
        this.loading = true;
        const response = await this.$api.post("getStations", body);
        this.stations = this.filteredStation = response.data;
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
    async getCustomers() {
      try {
        this.loading = true;
        const response = await this.$api.get("getCustomers/999/1/true");
        this.customers = this.filteredCustomer = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getCustomers error", error);
      }
    },
    async getVehicles() {
      try {
        this.loading = true;
        const response = await this.$api.get("getVehicles");
        this.vehicles = this.filteredVehicle = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getVehicles error", error);
      }
    },
    async getOperatingSystem() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "callCenter/getOperatingSystem/true",
        );
        this.operatingSystem = this.filteredOperatingSystem =
          response?.data?.operatingSystems || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getOperatingSystem error", error);
      }
    },
    async getStatus() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "callCenter/getCallCenterStatuses/true",
        );
        this.status = this.filteredStatus = response?.data?.statuses || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getStatus error", error);
      }
    },
    async getAssigment() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "callCenter/getCallDepartments/true",
        );
        this.assigment = this.filteredAssigment =
          response?.data?.callDepartments || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getAssigment error", error);
      }
    },
    async getCallCategory() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "callCenter/getCallComplaintCategories/true",
        );
        this.callCategory = this.filteredCallCategory =
          response?.data?.callComplaintCategories || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getCallCategory error", error);
      }
    },
    async getPriority() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "callCenter/getCallPriorities/true",
        );
        this.priority = this.filteredPriority =
          response?.data?.callPriorities || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getPriority error", error);
      }
    },
    async getSource() {
      try {
        this.loading = true;
        const response = await this.$api.get("callCenter/getCallSources/true");
        this.source = this.filteredSource = response?.data?.callSources || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getSource error", error);
      }
    },
    async getList() {
      try {
        this.loading = true;
        const response = await this.$api.post("callCenter/getCalls");
        this.rows = response.data.data;
        this.$logger.log("getCalls rows:", this.rows);
      } catch (error) {
        this.$logger.error("getList error", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },
    exportTable() {
      const table = this.$refs.table;
      const rows = table.filteredSortedRows; // sadece filtrelenmiş ve sıralanmışlar
      // İstenmeyen sütunlarını hariç tut
      const excludedLabels = ["İşlem"];
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
      worksheet["!cols"] = [
        { wch: 30 }, // 1. sütun
        { wch: 30 }, // 2. sütun
        { wch: 20 }, // 3. sütun
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      XLSX.writeFile(workbook, "CallCenterList.xlsx");
    },

    async callCreate() {
      try {
        if (!this.validateRequiredCallFields()) {
          return;
        }

        this.loading = true;

        const body = {
          stationId: this.formModel.station?.id,
          dealerId: this.formModel.station?.dealer?.id,
          stationRegionId: this.formModel.station?.stationRegion?.id,
          regionId: this.formModel.station?.region?.id,
          customerId: this.formModel.customer?.id,
          vehicleId: this.formModel.vehicle?.id,
          callOperatingSystemId: this.formModel.callOperatingSystem?.id,
          callStatusId: this.formModel.callStatus?.id,
          assignedDepartmentId: this.formModel.assignedDepartment?.id,
          callComplaintCategoryId: this.formModel.callComplaintCategory?.id,
          callPriorityId: this.formModel.callPriority?.id,
          callSourceId: this.formModel.callSource?.id,
          occurredAt: this.formModel.occurredAt,
          complaintText: this.formModel.complaintText,
          solution: this.formModel.solution,
        };

        this.$logger.log("callCreate formModel", body);

        const res = await this.$api.post("callCenter/callCreate", body);

        if (res?.status === 200) {
          if (this.formModel.solution) {
            const response = await this.$api.post(
              "callCenter/callAddComment/" + res.data.id,
              {
                content: this.formModel.solution,
              },
            );
          }

          this.$q.notify({
            progress: true,
            type: "positive",
            color: "green",
            message: this.$t("success"),
          });
          await this.getList();
          this.$emit("completed");
        }
      } catch (error) {
        this.$logger.error("callCreate error", error);
        this.$q.notify({ type: "negative", message: this.$t("failed") });
      } finally {
        this.loading = false;
      }
    },
    setInstantClockDate() {
      this.formModel.occurredAt = date.formatDate(
        Date.now(),
        "YYYY-MM-DD HH:mm",
      );
    },
    filterCustomers(val, update) {
      if (val === "") {
        update(() => {
          this.filteredCustomer = this.customers;
        });
        return;
      }

      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        this.filteredCustomer = this.customers.filter((customer) => {
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
    filterStations(val, update) {
      if (val === "") {
        update(() => {
          this.filteredStation = this.stations;
        });
        return;
      }

      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        this.filteredStation = this.stations.filter((station) => {
          const name = this.$normalizeTurkishString(station.name || "");
          return name.includes(normalizedVal);
        });
      });
    },
    filterLicensePlate(val, update) {
      if (val === "") {
        update(() => {
          this.filteredVehicle = this.vehicles;
        });
        return;
      }

      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        this.filteredVehicle = this.vehicles.filter((vehicle) => {
          const licensePlate = this.$normalizeTurkishString(
            vehicle.licensePlate || "",
          );

          return licensePlate.includes(normalizedVal);
        });
      });
    },
    openComplaintForm() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
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
        //second: "2-digit",
        hour12: false,
      };

      const formatted = date
        .toLocaleString("tr-TR", options)
        .replace(/\. /g, ".") // Ay ve gün arasında nokta
        .replace(",", ""); // Virgülü kaldır

      //this.$logger.log(formatted);
      return formatted;
    },
    customersLabel(option) {
      return option.id == null
        ? ""
        : `${option.name} ${option.surname} - ${option.phone}`;
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
