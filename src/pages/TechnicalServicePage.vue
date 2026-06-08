<template>
  <div class="q-pa-md">
    <q-card>
      <q-list class="row">
        <q-item>
          <q-select
            ref="selectProduct"
            clearable
            dense
            options-dense
            outlined
            use-input
            transition-show="scale"
            transition-hide="scale"
            input-debounce="0"
            v-model="selectedStockCard"
            option-value="id"
            option-label="value"
            :label="$t('products.product')"
            @filter="filterProduct"
            :options="productsFiltered"
            @update:model-value="(val) => listFilter()"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("noresults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item>
        <q-item>
          <q-select
            ref="selectOrderStatus"
            clearable
            dense
            options-dense
            outlined
            use-input
            transition-show="scale"
            transition-hide="scale"
            input-debounce="0"
            v-model="selectedTechnicalServiceStatuses"
            multiple
            options-cover
            option-label="name"
            :label="$t('order.status')"
            :options="technicalServiceStatuses"
            @update:model-value="(val) => listFilter()"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("noresults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item>
        <q-item>
          <q-input
            dense
            v-model="startDate"
            type="date"
            :disable="mode === 'details'"
            :label="$t('startDate')"
            @change="listFilter()"
          />
        </q-item>
        <q-item>
          <q-input
            dense
            v-model="endDate"
            type="date"
            :disable="mode === 'details'"
            :label="$t('endDate')"
            @change="listFilter()"
          />
        </q-item>
      </q-list>
    </q-card>
  </div>
  <div class="q-pa-md">
    <q-table
      flat
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
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("technicalService.technicalServiceList") }}
          </div>
          <q-space />
          <q-input
            class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
            bottom-slots
            dense
            debounce="300"
            v-model="filter"
            :placeholder="$t('search')"
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
            class="col-lg-1 col-md-1 col-sm-1 col-xs-1"
            @click="onAdd"
          >
            <q-tooltip>
              {{ $t("technicalService.newTechnicalServiceRecord") }}
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            icon="refresh"
            class="col-lg-1 col-md-1 col-sm-1 col-xs-1"
            @click="getList"
          >
            <q-tooltip>
              {{ $t("refresh") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="col-lg-1 col-md-1 col-sm-1 col-xs-1"
          >
            <q-tooltip>
              {{ $t("fullscreen") }}
            </q-tooltip>
          </q-btn>

          <q-btn
            :label="$t('export')"
            class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
            icon="cloud_download"
            @click="exportTable"
          >
            <q-tooltip>
              {{ $t("export") }}
            </q-tooltip>
          </q-btn>
        </div>
      </template>
      <template #body-cell-technicalServiceStatus="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.technicalServiceStatus.color"
            text-color="white"
            dense
            class="text-weight-bolder"
            square
            >{{ props.row.technicalServiceStatus.name }}
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-firmname="props">
        <q-td :props="props">
          {{ props.row.forwarderFirm?.name?.substring(0, 20) }}
          {{ props.row.forwarderFirm?.name?.lenght > 20 ? "..." : "" }}
          <q-tooltip
            v-if="props.row.firm"
            style="max-width: 400px"
            class="text-body2"
          >
            {{ props.row.forwarderFirm?.name }}
          </q-tooltip>
        </q-td>
      </template>

      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            v-if="false"
            flat
            round
            color="primary"
            icon="info"
            @click="onView(props.row)"
          >
            <q-tooltip style="max-width: 400px" class="text-body2">
              {{ $t("technicalService.technicalServiceRecord") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="secondary"
            icon="add_to_queue"
            @click="onEdit(props.row)"
          >
            <q-tooltip style="max-width: 400px" class="text-body2">
              {{ $t("technicalService.frontDesk") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="secondary"
            icon="engineering"
            @click="onEditTechnician(props.row)"
          >
            <q-tooltip style="max-width: 400px" class="text-body2">
              {{ $t("technicalService.technician") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="secondary"
            icon="warehouse"
            @click="onEditWarehouse(props.row)"
          >
            <q-tooltip style="max-width: 400px" class="text-body2">
              {{ $t("technicalService.warehouse") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="secondary"
            icon="backup"
            @click="onEditDataForm(props.row)"
          >
            <q-tooltip style="max-width: 400px" class="text-body2">
              {{ $t("technicalService.dataForm") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="secondary"
            icon="phone_callback"
            @click="onEditCallCenter(props.row)"
          >
            <q-tooltip style="max-width: 400px" class="text-body2">
              {{ $t("technicalService.callCenter") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="negative"
            icon="delete_forever"
            @click="onDelete(props.row)"
          >
            <q-tooltip style="max-width: 400px" class="text-body2">
              {{ $t("technicalService.technicalServiceRecordPassive") }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template #body-cell-day="props">
        <q-td :props="props">
          <q-chip
            :color="
              props.row.day > 30
                ? 'red'
                : props.row.day > 20
                ? 'orange'
                : props.row.day > 10
                ? 'green'
                : 'black'
            "
            text-color="white"
            dense
            class="text-weight-bolder"
            square
            >{{ props.value }}. {{ $t("days") }}
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-isActive="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.isActive === true ? 'green' : 'red-5'"
            text-color="white"
            dense
            class="text-weight-bolder"
            square
            :label="props.row.isActive === true ? $t('active') : $t('inactive')"
          >
          </q-chip>
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          <span> {{ message }}... </span>
        </div>
      </template>
    </q-table>
  </div>
  <!-- Front Desk Form Dialog -->
  <q-dialog
    v-model="formVisible"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 95vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-lg">
          <q-icon name="category" />

          <q-toolbar-title
            ><span class="text-weight-bold"></span>
            {{ $t(currentMode) }}</q-toolbar-title
          >

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
        <TechnicalServiceFrontDeskForm
          class="q-ma-none q-pa-none"
          v-model="currentRow"
          :mode="currentMode"
          @completed="onFormCompleted"
          @technicalServiceListRefresh="getList"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Technician Form Dialog -->
  <q-dialog
    v-model="technicianFormVisible"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 95vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-lg">
          <q-icon name="category" />

          <q-toolbar-title
            ><span class="text-weight-bold"></span>
            {{ $t(currentMode) }}</q-toolbar-title
          >

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
        <TechnicalServiceTechnicianForm
          class="q-ma-none q-pa-none"
          v-model="currentRow"
          :mode="currentMode"
          @completed="onFormCompleted"
          @technicalServiceListRefresh="getList"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Warehouse Form Dialog -->
  <q-dialog
    v-model="warehouseFormVisible"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="width: 40vw; max-height: 70vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-lg">
          <q-icon name="warehouse" />

          <q-toolbar-title
            ><span class="text-weight-bold"></span>
            {{ $t("technicalService.warehouseRequest") }}</q-toolbar-title
          >

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 65vh" class="scroll q-pa-sm">
        <TechnicalServiceWarehouseForm
          class="q-ma-none q-pa-none"
          v-model="currentRow"
          :mode="currentMode"
          @completed="onFormCompleted"
          @technicalServiceListRefresh="getList"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- Call Center Form Dialog -->
  <q-dialog
    v-model="callCenterFormVisible"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 95vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-lg">
          <q-icon name="phone_in_talk" />

          <q-toolbar-title
            ><span class="text-weight-bold"></span>
            {{ $t("technicalService.callCenter") }}</q-toolbar-title
          >

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
        <TechnicalServiceCallCenterForm
          class="q-ma-none q-pa-none"
          v-model="currentRow"
          :mode="currentMode"
          @completed="onFormCompleted"
          @technicalServiceListRefresh="getList"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Delete Dialog -->
  <q-dialog v-model="deleteConfirm" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="view_in_ar" color="negative" text-color="white" />&nbsp;
        &nbsp; &nbsp; &nbsp;
        <h5>{{ $t("order.deleteconfirm") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>
          "{{ currentRow.serviceNumber }}"
          {{ $t("messages.technicalServiceDelete") }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          color="primary"
          v-close-popup
        /><q-space />
        <q-btn
          flat
          :label="$t('delete')"
          color="negative"
          v-on:click="Delete()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Data Form Dialog -->
  <q-dialog
    v-model="dataFormVisible"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 95vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-lg">
          <q-icon name="category" />

          <q-toolbar-title
            ><span class="text-weight-bold"></span>
            {{ $t("technicalService.dataForm") }}</q-toolbar-title
          >

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
        <TechnicalServiceDataForm
          class="q-ma-none q-pa-none"
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
import TechnicalServiceFrontDeskForm from "src/components/forms/TechnicalServiceFrontDeskForm.vue";
import TechnicalServiceWarehouseForm from "src/components/forms/TechnicalServiceWarehouseForm.vue";
import TechnicalServiceTechnicianForm from "src/components/forms/TechnicalServiceTechnicianForm.vue";
import TechnicalServiceCallCenterForm from "src/components/forms/TechnicalServiceCallCenterForm.vue";
import TechnicalServiceDataForm from "src/components/forms/TechnicalServiceDataForm.vue";
import exportFromJSON from "export-from-json";
import { Platform } from "quasar";
import { date, LocalStorage } from "quasar";
import "numeral/locales/tr";
import "numeral/locales/en-au";
import "numeral/locales/de";

export default defineComponent({
  components: {
    TechnicalServiceFrontDeskForm,
    TechnicalServiceWarehouseForm,
    TechnicalServiceTechnicianForm,
    TechnicalServiceCallCenterForm,
    TechnicalServiceDataForm,
  },
  computed: {
    columns() {
      return [
        {
          name: "day",
          label: this.$t("days"),
          align: "center",
          field: (row) => {
            const now = new Date();
            const created = new Date(row.createdAt);
            const diffInMs = now - created;
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
            row.day = diffInDays;
            return row.day;
          },
          sortable: true,
        },
        //ilgili ürünün toplam servis kaydı
        {
          name: "recordCount",
          label: this.$t("technicalService.recordCount"),
          align: "center",
          field: (row) => row.stockSerial?.technicalServices?.length,
          sortable: true,
        },
        {
          name: "technicalServiceNo",
          label: this.$t("technicalService.technicalServiceNo"),
          align: "left",
          field: (row) => row.serviceNumber,
          sortable: true,
        },
        {
          name: "serialno",
          label: this.$t("products.serialNo"),
          align: "left",
          field: (row) => row.stockSerial?.serialNo,
          sortable: true,
        },
        {
          name: "firmname",
          label: this.$t("technicalService.firmname"),
          align: "left",
          field: (row) => row.firm.name,
          sortable: true,
        },
        /*{
          name: "serviceProvider",
          label: this.$t("technicalService.serviceProvider"),
          align: "left",
          field: (row) => row.serviceProvider.name,
          sortable: true,
        },
        {
          name: "createdService",
          label: this.$t("technicalService.createdService"),
          align: "left",
          field: (row) => date.formatDate(row.createdAt, "DD-MM-YYYY"),
          sortable: true,
        },*/
        {
          name: "startService",
          label: this.$t("technicalService.createdService"),
          align: "left",
          field: "createdAt",
          format: (val) => date.formatDate(val, "DD.MM.YYYY"),
          sortable: true,
        },
        {
          name: "finishService",
          label: this.$t("technicalService.finishService"),
          align: "left",
          field: "estimatedCompletionDate", // tarih alanı
          sortable: true,
          format: (val) => date.formatDate(val, "DD.MM.YYYY"), // Türkiye formatında tarihi biçimlendir
        },

        {
          name: "technicalServiceStatus",
          label: this.$t("technicalService.status"),
          align: "left",
          field: (row) => row.technicalServiceStatus.name,
          sortable: true,
        },
        ,
        {
          name: "isActive",
          label: this.$t("isActive"),
          align: "left",
          field: (row) => row.isActive,
          sortable: true,
        },
        /*
        {
          name: "technicalServiceType",
          label: this.$t("technicalService.serviceType"),
          align: "left",
          field: (row) => row.technicalServiceType.name,
          sortable: true,
        },

        {
          name: "type",
          label: this.$t("technicalService.type"),
          align: "right",
          field: (row) => row.type,
          sortable: true,
        },*/ {
          name: "action",
          align: "center",
          label: this.$t("action"),
          field: "",
        },
      ];
    },
  },
  setup() {
    return {};
  },
  data() {
    return {
      startDate: "",
      endDate: "",
      loading: true,
      technicalServiceStatuses: [],
      productsFull: [],
      productsFiltered: [],
      selectedStockCard: { id: 0, value: "Aramak İçin Yazın..." },
      selectedTechnicalServiceStatuses: [],
      warehouseFormVisible: false,
      technicianFormVisible: false,
      callCenterFormVisible: false,
      dataFormVisible: false,
      rows: [],
      technicalServices: [],
      list: [],
      filtredList: [],
      selectedId: 0,
      formVisible: false,
      deleteConfirm: false,
      currentMode: "",
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      isGrid: false,
      pagination: {
        rowsPerPage: 20,
      },
    };
  },
  async mounted() {
    this.init();
    document.title = "Magicline - Technical Service";
  },
  methods: {
    init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
      this.setStartDate();
      this.setEndDate();
      this.getList();
      this.getTechnicalServiceStatuses();
    },
    customSort(rows, sortBy, descending) {
      const data = [...rows];

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a;
          const y = descending ? a : b;

          if (sortBy !== "startService") {
            // string sort
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0;
          } else {
            // numeric sort (timestamp)
            return (
              new Date(x[sortBy]).getTime() - new Date(y[sortBy]).getTime()
            );
          }
        });
      }

      return data;
    },

    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onView(product) {
      this.$logger.log(product);
      this.maximizedToggle = false;
      this.currentRow = product;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onEdit(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onEditDataForm(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.dataFormVisible = true;
    },
    onEditWarehouse(row) {
      this.$logger.log("onEditWarehouse row", row);
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.warehouseFormVisible = true;
    },
    onEditCallCenter(row) {
      this.$logger.log("onEditCallCenter row", row);
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.callCenterFormVisible = true;
    },
    onEditTechnician(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.technicianFormVisible = true;
    },
    onDelete(product) {
      this.currentRow = product;
      this.deleteConfirm = true;
    },
    onFormCompleted() {
      this.formVisible = false;
      this.warehouseFormVisible = false;
      this.$logger.log("form completed");
      this.getList();
    },
    exportTable() {
      const data = this.rows;
      const fileName = "TechServiceList";
      const exportType = exportFromJSON.types.xls;

      exportFromJSON({ data, fileName, exportType });
    },
    async Delete() {
      try {
        this.currentRow.isActive = false;
        const response = await this.$api.put(
          "technicalServices/",
          this.currentRow
        );
        this.getList();
        this.deleteConfirm = false;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getList() {
      try {
        var user = LocalStorage.getItem("userinfo");
        var isActive = {};
        if (user) {
          if (user.employeeGroupId == 1) isActive = null;
          else isActive = true;
        } else isActive = true;

        this.loading = true;
        const response = await this.$api.get(
          `getTechnicalServices/999/1/${isActive}`
        );

        if (response?.data?.length) {
          this.rows = response.data;
          this.technicalServices = response.data;
          this.$logger.log("Güncellenen rows:", this.rows);
        } else {
          console.warn(
            "⚠️ API'den boş veri döndü veya yanlış formatta:",
            response.data
          );
        }

        this.loading = false;
      } catch (error) {
        this.$logger.error("API çağrısı sırasında hata oluştu:", error);
      }
    },

    async getTechnicalServiceStatuses() {
      const response = this.$api
        .get("getTechnicalServiceStatuses/true")
        .then((data) => {
          let result = data.data;
          result.map((item) => {
            if (item.status)
              item.process = item.process + " (" + item.status + ")";
          });
          this.technicalServiceStatuses = result;
          this.$logger.log(this.technicalServiceStatuses);
        });
    },
    listFilter(/*val*/) {
      try {
        this.filtredList = [];
        if (this.selectedStockCard && this.selectedStockCard?.id > 0) {
          this.technicalServices.forEach((item) => {
            try {
              const matchingOrderItems =
                item.stockSerial.stockCardId == this.selectedStockCard.id;
              if (matchingOrderItems) {
                this.filtredList.push(item);
              }
            } catch (error) {
              this.$logger.log("error", error, item);
            }
          });
        } else {
          this.filtredList = this.technicalServices;
        }

        if (
          this.selectedTechnicalServiceStatuses &&
          Array.isArray(this.selectedTechnicalServiceStatuses) &&
          this.selectedTechnicalServiceStatuses.length > 0
        ) {
          this.filtredList = this.filtredList.filter((fl) => {
            // Seçilen statü ID'lerinden herhangi biri ile eşleşen kayıtları filtrele
            return this.selectedTechnicalServiceStatuses.some(
              (status) => fl.technicalServiceStatusId === status.id
            );
          });
        }
        var sd = new Date(this.startDate);
        sd.setHours(0, 0, 0, 0); // Saati günün başlangıcına ayarla

        var ed = new Date(this.endDate);
        ed.setHours(23, 59, 59, 999); // Saati günün sonuna ayarla

        this.rows = this.filtredList.filter((item) => {
          var itemDate = new Date(item.createdAt);
          return itemDate >= sd && itemDate <= ed;
        });
      } catch (error) {
        this.$logger.error("productSelected", error);
      }
    },

    async getProduct() {
      const response = this.$api.get("stockCards").then((data) => {
        this.$logger.log(data.data);
        this.productsFull = data.data.map((p) => {
          p.value = `${p.stockCode} - ${p.stockName}`;
          return p;
        });
      });
    },

    async filterProduct(val, update) {
      /*if (val.length < 3) {
return;
}*/

      update(() => {
        try {
          var body = { letters: val };
          this.$logger.log("body", body);
          const response = this.$api
            .put("searchStockCards/", body)
            .then((data) => {
              var products = data.data.map((p) => {
                p.value = `${p.stockCode} - ${p.stockName}`;
                return p;
              });
              this.productsFiltered = products;
              this.$logger.log("productsFiltered", this.productsFiltered);
            })
            .catch((err) => this.$logger.log());
        } catch (error) {}
      });
    },
    formatDate(datef) {
      if (!datef) return ""; // Boş tarih ise boş bir dize döndür

      // Tarihi JavaScript Date nesnesine dönüştür
      const formattedDate = new Date(datef);

      // Gün, ay ve yılı al
      const day = formattedDate.getDate();
      const month = formattedDate.getMonth() + 1; // JavaScript'de aylar 0'dan başlar, bu yüzden 1 ekleyin
      const year = formattedDate.getFullYear();

      // Biçimlendirilmiş tarih dizesini oluştur
      const formattedDateString = `${day < 10 ? "0" : ""}${day}.${
        month < 10 ? "0" : ""
      }${month}.${year}`;

      return formattedDateString;
    },
    setStartDate() {
      const date = new Date();
      date.setMonth(date.getMonth() - 1); // Bir ay öncesinin tarihi
      this.startDate = date.toISOString().slice(0, 10); // ISO formatında tarih
    },
    setEndDate() {
      const date = new Date();
      date.setDate(date.getDate() + 1); // Yarının tarihi
      this.endDate = date.toISOString().slice(0, 10); // ISO formatında tarih
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
