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
            {{ $t("station.connectorType") }}
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

    <!-- Form Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 30vw; max-height: 60vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("station.connector")
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
        <q-card-section style="max-height: 60vh" class="scroll q-pa-sm">
          <connector-type-form
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
            {{ $t("station.connectorType") }} {{ $t("deleteConfirm") }}
          </div>
          <div class="text-subtitle2">
            {{ $t("station.connectorType") }} : <b>{{ currentRow.name }}</b>
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
import { firm } from "../../package.json";
import ConnectorTypeForm from "src/components/forms/ConnectorTypeForm.vue";
import * as XLSX from "xlsx";

export default defineComponent({
  components: {
    ConnectorTypeForm,
  },
  data() {
    return {
      rows: [],
      filter: "",
      loading: true,
      formVisible: false,
      deleteConfirm: false,
      maximizedToggle: false,
      currentMode: "add",
      currentRow: null,
      pagination: { rowsPerPage: 20 },
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "name",
          label: this.$t("station.connectorName"),
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "description",
          label: this.$t("description"),
          field: "description",
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
      document.title = `${firm.name}-${this.$t("station.connectorType")}`;
      this.getList();
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
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

    clickMenu(row) {
      this.$logger.log("Context menu clicked", row);
    },
    async getList() {
      try {
        this.loading = true;
        const response = await this.$api.get("/stationConnectorTypes");
        this.rows = response.data;
      } catch (error) {
        this.$logger.error("Error fetching connector list:", error);
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

      XLSX.writeFile(workbook, "ConnectorTypesList.xlsx");
    },

    async deleteRow() {
      try {
        this.currentRow.isActive = false;
        await this.$api.put("stationConnectorTypes", this.currentRow);

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

    onFormCompleted() {
      this.formVisible = false;
      this.getList();
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
