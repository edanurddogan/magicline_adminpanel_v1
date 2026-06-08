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
            {{ $t("region.regions") }}
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
              {{ $t("region.addRegion") }}
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
            icon="mail"
            :href="'mailto:' + props.row.contactEmail"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("sendemail") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            color="secondary"
            icon="phone"
            :href="'tel:' + props.row.contactPhone"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("tocall") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            color="green"
            icon="chat"
            :href="
              'https://wa.me/' + formatPhoneForWhatsApp(props.row.contactPhone)
            "
            target="_blank"
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              >{{ $t("users.whatsapp") }}</q-tooltip
            >
          </q-btn>

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
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("edit") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            color="negative"
            icon="delete_forever"
            @click="onDeleteUser(props.row)"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("delete") }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip
                    v-if="col.name === 'status'"
                    :color="props.row.isActive === true ? 'green' : 'red'"
                    text-color="white"
                    dense
                    class="text-weight-bolder"
                    square
                    >{{ props.row.isActive ? $t("active") : $t("inactive") }}
                  </q-chip>

                  <q-item-section v-else-if="col.name === 'action'" class="row">
                    <div class="row">
                      <q-btn
                        flat
                        round
                        color="primary"
                        icon="mail"
                        :href="'mailto:' + props.row.contactMail"
                      />
                      <q-btn
                        flat
                        round
                        color="secondary"
                        icon="phone"
                        :href="'tel:' + props.row.contactPhone"
                      />&nbsp;&nbsp;&nbsp;
                      <q-btn
                        flat
                        round
                        color="primary"
                        icon="info"
                        @click="onView(props.row)"
                      />
                      <q-btn
                        flat
                        round
                        color="secondary"
                        icon="edit"
                        @click="onEdit(props.row)"
                      />
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete_forever"
                        @click="onDeleteUser(props.row)"
                      />
                    </div>
                  </q-item-section>

                  <q-item-label v-else caption
                    ><p>{{ col.value }}</p></q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
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
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("region.region") }}</span>
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
        <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
          <region-form
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
          <div class="text-h6 q-mb-sm">{{ $t("region.deleteConfirm") }}</div>
          <div class="text-subtitle2">
            {{ $t("region.selectedRegion") }} <b>{{ currentRow.name }}</b>
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
import { firm } from "../../package.json";
import RegionForm from "src/components/forms/RegionForm.vue";
import * as XLSX from "xlsx";
import { Platform } from "quasar";

export default defineComponent({
  components: {
    RegionForm,
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
          label: this.$t("region.regionName"),
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "dealer",
          label: this.$t("dealer.dealer"),
          field: (row) => row.dealer?.name,
          align: "left",
          sortable: true,
        },
        {
          name: "contactName",
          label: this.$t("region.contactName"),
          field: "contactName",
          align: "left",
          sortable: true,
        },
        {
          name: "contactPhone",
          label: this.$t("region.contactPhone"),
          field: "contactPhone",
          align: "left",
          sortable: false,
        },
        {
          name: "contactEmail",
          label: this.$t("region.contactEmail"),
          field: "contactEmail",
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
      document.title = `${firm.name}-${this.$t("region.regions")}`;
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
    onDeleteUser(row) {
      this.currentRow = row;
      this.deleteConfirm = true;
    },
    async deleteRow() {
      try {
        this.currentRow.isActive = false;
        await this.$api.put("stationRegions", this.currentRow);
        this.getList();
        this.deleteConfirm = false;
        this.$q.notify({
          type: "positive",
          message: this.$t("success"),
        });
      } catch (error) {
        this.$logger.error(error);
        this.$q.notify({
          type: "negative",
          message: this.$t("error"),
        });
      }
    },
    onFormCompleted() {
      this.formVisible = false;
      this.getList();
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

      XLSX.writeFile(workbook, "StationRegionList.xlsx");
    },
    clickMenu(row) {
      this.$logger.log("Context menu clicked", row);
    },
    async getList() {
      try {
        const response = await this.$api.get("getRegions");
        this.rows = response?.data.data || [];
        this.$logger.log("getList", this.rows);
        this.loading = false;
      } catch (error) {
        this.$logger.error("getList error", error);
      }
    },
    formatPhoneForWhatsApp(number) {
      if (!number) return "";
      number = number.trim();

      if (!number.startsWith("+")) {
        number = "+90" + number;
      }

      return number.replace(/\D/g, "");
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
