<template>
  <div class="q-pa-md">
    <q-table
      ref="table"
      dense
      :grid="isGrid"
      class="statement-table"
      :rows="rows"
      :columns="columns"
      :filter="filter"
      :loading="loading"
      :pagination="pagination"
      :loading-label="$t('loading')"
      :no-data-label="$t('nodatalabel')"
      :no-results-label="$t('noresultslabel')"
      row-key="id"
    >
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("rfid.rfidCardList") }}
          </div>
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

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.isActive ? 'green' : 'red'"
            text-color="white"
            dense
            class="text-weight-bolder"
            square
            >{{ props.row.isActive ? $t("active") : $t("inactive") }}
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

      <template v-slot:no-data="{ icon, message }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="icon" />
          <span>{{ message }}</span>
        </div>
      </template>
    </q-table>
  </div>

  <!-- Tag Add or Edit Form-->
  <q-dialog
    v-model="formVisible"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 55vw; max-height: 70vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-sm">
          <q-icon name="person" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{ $t("rfid.rfidCard") }}</span>
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
      <q-card-section class="q-pa-sm">
        <RfidCard-form
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
          {{ $t("rfid.rfidCard") }} {{ $t("deleteConfirm") }}
        </div>
        <div class="text-subtitle2">
          {{ $t("rfid.rfidCard") }}: <b>{{ currentRow.name }}</b>
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
</template>

<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import RfidCardForm from "src/components/forms/RfidCardForm.vue";
import * as XLSX from "xlsx";

export default defineComponent({
  name: "RFIDCardListPage",
  components: {
    RfidCardForm,
  },

  computed: {
    columns() {
      return [
        {
          name: "tagName",
          label: this.$t("users.name"),
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "tagNumber",
          label: this.$t("rfid.rfidTag"),
          field: "tag",
          align: "left",
          sortable: true,
        },
        {
          name: "dealer",
          label: this.$t("dealer.dealer"),
          field: (row) => row.dealer?.name || "-",
          align: "left",
          sortable: true,
        },
        {
          name: "vehicle",
          label: this.$t("vehicle.vehicle"),
          field: (row) => row.vehicle?.licensePlate || "-",
          align: "left",
          sortable: true,
        },
        {
          name: "status",
          label: this.$t("status"),
          field: "isActive",
          align: "center",
        },
        {
          name: "action",
          label: this.$t("action"),
          field: "action",
          align: "right",
        },
      ];
    },
  },
  data() {
    return {
      loading: true,
      rows: [],
      dealers: [],
      isGrid: false,
      filter: "",
      formVisible: false,
      currentRow: null,
      currentMode: "add",
      deleteConfirm: false,
      pagination: {
        rowsPerPage: 20,
      },
    };
  },
  async mounted() {
    document.title = `${firm.name}-${this.$t("rfid.rfidCardList")}`;
    this.init();
  },
  methods: {
    init() {
      try {
        this.getList();
      } catch (error) {
        this.$logger.error("init error:", error);
      }
    },
    async getList() {
      this.loading = true;
      try {
        const response = await this.$api.get("getRfidCards/false");
        //this.$logger.log("RFID Cards:", response?.data.data);
        this.rows = response?.data.data || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("Error fetching RFID cards:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("fetch_error"),
        });
        this.loading = false;
      }
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

    async deleteRow() {
      try {
        this.currentRow.isActive = false;
        await this.$api.put("updateRfidCard", this.currentRow);
        this.deleteConfirm = false;
        this.getList();
        this.$q.notify({
          type: "negative",
          message: this.$t("deleted"),
        });
      } catch (error) {
        this.$logger.error(error);
        this.$q.notify({
          type: "negative",
          message: this.$t("error"),
        });
      }
    },
    async onFormCompleted(data) {
      try {
        this.formVisible = false;
        this.getList();
      } catch (error) {
        this.$logger.error("Kaydetme hatası:", error);
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

      XLSX.writeFile(workbook, "RFIDCardList.xlsx");
    },
    clickMenu(row) {
      this.$logger.log("Context menu clicked", row);
    },
  },
});
</script>

<style scoped>
.grid-style-transition {
  transition: transform 0.28s, background-color 0.28s;
}
</style>
