<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <div id="divToHideFilter" class="row q-pa-md">
      <q-card>
        <q-list class="row">
          <!-- Başlangıç Tarihi Seçimi -->
          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
            <q-item-section>
              <q-input filled v-model="startDate">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="startDate" mask="YYYY-MM-DD HH:mm">
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
                        v-model="startDate"
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
          <!-- Bitiş Tarihi Seçimi -->
          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
            <q-item-section>
              <q-input filled v-model="endDate">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="endDate" mask="YYYY-MM-DD HH:mm">
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
                        v-model="endDate"
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
          <!-- İstasyon Seçimi -->
          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6 column q-space">
            <q-item-section>
              <q-select
                v-model="selectedStations"
                :options="filteredStations"
                option-value="id"
                option-label="name"
                :label="$t('station.stations')"
                :loading="loading"
                hide-selected
                map-options
                clearable
                outlined
                dense
                use-input
                transition-show="scale"
                transition-hide="scale"
                style="width: 100%"
                @filter="
                  (val, update) =>
                    filterList(val, update, 'stations', 'filteredStations')
                "
              >
                <template #prepend>
                  <q-icon name="ev_station" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Kullanıcı Seçimi -->
          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6 column q-space">
            <q-item-section>
              <q-select
                v-model="selectedCustomers"
                :options="filteredCustomers"
                option-value="id"
                :option-label="customersLabel"
                :label="$t('users.users')"
                :loading="loading"
                hide-selected
                map-options
                clearable
                outlined
                dense
                use-input
                style="width: 100%"
                transition-show="scale"
                transition-hide="scale"
                @filter="filterCustomers"
              >
                <template #prepend>
                  <q-icon name="person" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Araç Seçimi -->
          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6 column">
            <q-item-section>
              <q-select
                v-model="selectedVehicles"
                :options="filteredVehicles"
                option-value="id"
                option-label="licensePlate"
                :label="$t('vehicle.vehicles')"
                :loading="loading"
                hide-selected
                map-options
                clearable
                outlined
                dense
                use-input
                style="width: 100%"
                transition-show="scale"
                transition-hide="scale"
                @filter="filterLicensePlate"
              >
                <template #prepend>
                  <q-icon name="electric_car" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Departman Seçimi -->
          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
            <q-item-section>
              <q-select
                v-model="selectedDepartment"
                :options="departments"
                option-value="id"
                option-label="name"
                :label="$t('callCenter.selectDepartment')"
                :loading="loading"
                map-options
                hide-selected
                clearable
                outlined
                dense
                transition-show="scale"
                transition-hide="scale"
              >
                <template #prepend>
                  <q-icon name="assignment_returned" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Listele -->
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12 justify-end">
            <q-btn
              class="text-capitalize q-py-sm"
              color="primary"
              :label="$t('Listele')"
              @click="getList"
            >
              <q-tooltip>{{ $t("search") }}</q-tooltip>
            </q-btn>
          </q-item>
        </q-list>
      </q-card>
    </div>
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
              round
              color="secondary"
              icon="edit"
              @click="onEdit(props.row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
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
                      props.row.station.dealer?.name ||
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
      </q-table>
    </div>
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
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import * as XLSX from "xlsx";
import { date, Platform } from "quasar";
import ComplaintForm from "src/components/forms/ComplaintForm.vue";
import de from "src/i18n/de";

export default defineComponent({
  components: { ComplaintForm },
  data() {
    return {
      rows: [],
      filter: "",
      loading: false,
      formVisible: false,
      deleteConfirm: false,
      maximizedToggle: false,
      currentMode: "add",
      currentRow: null,
      pagination: {
        rowsPerPage: 20,
      },

      stations: [],
      customers: [],
      vehicles: [],
      departments: [],
      startDate: new Date().toISOString().slice(0, 10) + " 00:00",
      endDate: new Date().toISOString().slice(0, 10) + " 23:59",

      filteredStations: [],
      filteredCustomers: [],
      filteredVehicles: [],

      selectedStations: "",
      selectedCustomers: "",
      selectedVehicles: "",
      selectedDepartment: "",
    };
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

  async mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getCustomers();
      this.getVehicles();
      this.getStations();
      this.getDepartments();
      document.title = `${firm.name}-${this.$t(
        "callCenter.solutionManagement",
      )}`;
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
    onDeleteUser(row) {
      this.currentRow = row;
      this.deleteConfirm = true;
    },

    clickMenu(row) {
      this.$logger.log("Context menu clicked", row);
    },
    async getList() {
      try {
        this.loading = true;
        const body = {
          startDate: this.startDate,
          endDate: this.endDate,
          stationId: this.selectedStations?.id,
          customerId: this.selectedCustomers?.id,
          vehicleId: this.selectedVehicles?.id,
          assignedDepartmentId: this.selectedDepartment?.id,
        };
        this.$logger.log("Request Body:", body);
        const response = await this.$api.post("callCenter/getCalls", body);
        this.rows = response?.data.data || [];
        this.$logger.log("data", this.rows);
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
    async getCustomers() {
      try {
        this.loading = true;
        const response = await this.$api.get("getCustomers/999/1/true");
        this.customers = this.filteredCustomers = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getCustomers error", error);
      }
    },
    async getVehicles() {
      try {
        this.loading = true;
        const response = await this.$api.get("getVehicles");
        this.vehicles = this.filteredVehicles = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getVehicles error", error);
      }
    },
    async getDepartments() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "callCenter/getCallDepartments/true",
        );
        this.departments = response?.data.callDepartments;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getDepartments error", error);
      }
    },
    onFilterStation(val, update) {
      if (val === "") {
        update(() => {
          this.getStations();
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.stationOptions = this.stationOptions.filter((station) =>
          station.name?.toLowerCase().includes(needle),
        );
      });
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

      XLSX.writeFile(workbook, "SolutionManagementList.xlsx");
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
          this.filteredCustomers = this.customers;
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
    filterLicensePlate(val, update) {
      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        this.filteredVehicles =
          val === ""
            ? this.vehicles
            : this.vehicles.filter((v) =>
                this.$normalizeTurkishString(v.licensePlate || "").includes(
                  normalizedVal,
                ),
              );
      });
    },
    customersLabel(option) {
      return option.id == null
        ? "Seç"
        : `${option.name} ${option.surname} - ${option.phone}`;
    },
    async onSubmit() {
      if (!this.filterModel.startDate || !this.filterModel.endDate) return;

      this.loading = true;
      try {
        this.$logger.log("Filtre gönderildi:", this.filterModel);
      } catch (err) {
        this.$q.notify({ type: "negative", message: this.$t("errorOccurred") });
      } finally {
        this.loading = false;
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
