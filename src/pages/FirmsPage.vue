<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>

<template>
  <div class="q-pa-md">
    <q-table
      ref="table"
      dense
      flat
      bordered
      :grid="isGrid"
      :hide-header="isGrid"
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
      @row-dblclick="onRowDoubleClick"
    >
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("firm.firms") }}
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
            <template v-slot:append>
              <q-icon
                dense
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
              {{ $t("add") }}
            </q-tooltip>
          </q-btn>
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
          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
          >
            <q-tooltip>
              {{ $t("fullscreen") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            :icon="isGrid ? 'list' : 'grid_on'"
            @click="isGrid = !isGrid"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
          >
            <q-tooltip v-close-popup>{{ isGrid ? "List" : "Grid" }}</q-tooltip>
          </q-btn>

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
            v-if="props.row.email"
            dense
            flat
            round
            color="primary"
            icon="mail"
            :href="'mailto:' + props.row.email"
          >
            <q-tooltip>
              {{ $t("email") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="props.row.phone1"
            dense
            flat
            round
            color="secondary"
            icon="phone"
            :href="'tel:' + props.row.phone1"
          >
            <q-tooltip>
              {{ $t("phone") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="props.row.website"
            dense
            flat
            round
            color="accent"
            icon="link"
            :href="props.row.website"
            target="_blank"
          >
            <q-tooltip>
              {{ $t("website") }}
            </q-tooltip>
          </q-btn>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <q-btn
            dense
            flat
            round
            color="primary"
            icon="info"
            @click="onView(props.row)"
          >
            <q-tooltip>
              {{ $t("view") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            flat
            round
            color="secondary"
            icon="edit"
            @click="onEdit(props.row)"
          >
            <q-tooltip>
              {{ $t("edit") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            flat
            round
            color="negative"
            icon="delete_forever"
            @click="onDelete(props.row)"
          >
            <q-tooltip>
              {{ $t("delete") }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
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
                  >
                    {{ props.row.isActive ? $t("active") : $t("inactive") }}
                  </q-chip>

                  <q-item-section v-else-if="col.name === 'action'" class="row">
                    <div class="row">
                      <q-btn
                        :icon="props.row.email ? 'mail' : ''"
                        :disable="props.row.email"
                        dense
                        flat
                        round
                        color="primary"
                        :href="'mailto:' + props.row.email"
                      >
                        <q-tooltip>
                          {{ $t("email") }}
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        v-show="props.row.phone1"
                        dense
                        flat
                        round
                        color="secondary"
                        :icon="props.row.phone1 ? 'phone' : ''"
                        :disable="props.row.phone1"
                        :href="'tel:' + props.row.phone1"
                      >
                        <q-tooltip>
                          {{ $t("phone") }}
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        dense
                        flat
                        round
                        color="accent"
                        :icon="props.row.website ? 'link' : ''"
                        :disable="props.row.website"
                        :href="props.row.website"
                        target="_blank"
                      >
                        <q-tooltip>
                          {{ $t("website") }}
                        </q-tooltip>
                      </q-btn>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <q-btn
                        dense
                        flat
                        round
                        color="primary"
                        icon="info"
                        @click="onView(props.row)"
                      >
                        <q-tooltip>
                          {{ $t("view") }}
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        dense
                        flat
                        round
                        color="secondary"
                        icon="edit"
                        @click="onEdit(props.row)"
                      >
                        <q-tooltip>
                          {{ $t("edit") }}
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        dense
                        flat
                        round
                        color="negative"
                        icon="delete_forever"
                        @click="onDelete(props.row)"
                      >
                        <q-tooltip>
                          {{ $t("delete") }}
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>

                  <q-item-label v-else caption>
                    <p>{{ col.value }}</p>
                  </q-item-label>
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

    <q-dialog v-model="deleteConfirm" persistent>
      <q-card style="min-width: 320px">
        <q-card-section class="text-h6">
          {{ $t("delete") }}
        </q-card-section>
        <q-card-section>
          {{ `${currentRow?.commercialTitle} silinecek, onaylıyor musunuz?` }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="primary" :label="$t('cancel')" v-close-popup />
          <q-btn flat color="negative" :label="$t('delete')" @click="Delete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="max-width: 80vw; max-height: 75vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="people" />

            <q-toolbar-title>
              <span class="text-weight-bold">{{ $t("firm.firm") }}</span>
              {{ $t(currentMode) }}
            </q-toolbar-title>

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">
                {{ $t("close") }}
              </q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>

        <q-card-section style="max-height: 89vh" class="scroll q-pa-sm">
          <firm-form
            class="q-ma-none q-pa-none"
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
import FirmForm from "src/components/forms/FirmForm.vue";
import * as XLSX from "xlsx";

export default defineComponent({
  components: {
    FirmForm,
  },

  computed: {
    columns() {
      return [
        {
          name: "firmCode",
          label: this.$t("firm.firmcode"),
          align: "left",
          field: (row) => row.firmCode,
          sortable: true,
        },
        {
          name: "accountCode",
          label: this.$t("firm.accountCode"),
          align: "left",
          field: (row) => row.accountCode,
          sortable: true,
        },
        {
          name: "commercialtitle",
          label: this.$t("firm.commercialtitle"),
          align: "left",
          field: (row) => row.commercialTitle,
          sortable: true,
        },
        {
          name: "email",
          label: this.$t("firm.email"),
          align: "left",
          field: (row) => row.email,
          sortable: true,
        },
        {
          label: this.$t("firm.phone"),
          align: "left",
          field: (row) => row.phone1,
          sortable: true,
        },
        {
          name: "status",
          align: "center",
          label: this.$t("status"),
          field: "isActive",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: this.$t("action"),
          field: "",
        },
      ];
    },
  },

  data() {
    return {
      loading: true,
      rows: [],
      selectedId: 0,
      formVisible: false,
      deleteConfirm: false,
      currentMode: "add",
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
    document.title = `${firm.name}-${this.$t("firm.firms")}`;
    this.init();
  },

  methods: {
    init() {
      try {
        this.getList();
      } catch (error) {
        this.$logger.log("Hata:", error);
      }
    },

    normalizeFirmRow(row) {
      const sourceAddress =
        row?.invoiceAddress || row?.address || row?.firmAddress || {};

      return {
        ...row,
        invoiceAddressId:
          row?.invoiceAddressId || sourceAddress?.id || row?.addressId || null,
        invoiceAddress: {
          addressTitle: sourceAddress?.addressTitle || row?.addressTitle || "",
          addressDetail:
            sourceAddress?.addressDetail || row?.addressDetail || "",
          postalCode: sourceAddress?.postalCode || row?.postalCode || "",
          country: sourceAddress?.country || row?.country || null,
          city: sourceAddress?.city || row?.city || null,
          district: sourceAddress?.district || row?.district || null,
          countryId:
            sourceAddress?.countryId ||
            sourceAddress?.country?.id ||
            row?.countryId ||
            row?.country?.id ||
            null,
          cityId:
            sourceAddress?.cityId ||
            sourceAddress?.city?.id ||
            row?.cityId ||
            row?.city?.id ||
            null,
          districtId:
            sourceAddress?.districtId ||
            sourceAddress?.district?.id ||
            row?.districtId ||
            row?.district?.id ||
            null,
        },
      };
    },

    async fetchFirmDetailOrFallback(item) {
      if (!item?.id) {
        return item;
      }

      try {
        const response = await this.$api.get("firmDetail/" + item.id);
        return response?.data || item;
      } catch (error) {
        const status = error?.response?.status;
        this.$logger.warn("firmDetail fallback used:", {
          firmId: item.id,
          status,
        });

        if (status !== 501) {
          this.$q.notify({
            type: "negative",
            message: this.$t("error"),
          });
        }

        return item;
      }
    },

    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },

    async onView(item) {
      try {
        this.maximizedToggle = false;

        const row = await this.fetchFirmDetailOrFallback(item);

        this.currentRow = this.normalizeFirmRow(row);
        this.currentMode = "details";
        this.formVisible = true;
      } catch (error) {
        this.$logger.error("onView:", error);
      }
    },

    async onEdit(item) {
      try {
        this.maximizedToggle = false;

        const row = await this.fetchFirmDetailOrFallback(item);

        this.currentRow = this.normalizeFirmRow(row);
        this.currentMode = "edit";
        this.formVisible = true;
      } catch (error) {
        this.$logger.error("onEdit:", error);
      }
    },

    async onRowDoubleClick(evt, row) {
      try {
        this.maximizedToggle = false;

        const currentRow = await this.fetchFirmDetailOrFallback(row);

        this.currentRow = this.normalizeFirmRow(currentRow);
        this.currentMode = "edit";
        this.formVisible = true;
      } catch (error) {
        this.$logger.error("onRowDoubleClick:", error);
      }
    },

    onDelete(item) {
      this.currentRow = item;
      this.deleteConfirm = true;
    },

    onFormCompleted() {
      this.formVisible = false;
      this.$logger.log("form completed");
      this.getList();
    },

    exportTable() {
      const table = this.$refs.table;
      const rows = table.filteredSortedRows;

      const excludedLabels = ["İşlem"];
      const exportColumns = this.columns.filter(
        (col) => !excludedLabels.includes(col.label),
      );

      const header = exportColumns.map((col) => col.label);
      const data = rows.map((row) =>
        exportColumns.map((col) =>
          typeof col.field === "function" ? col.field(row) : row[col.field],
        ),
      );

      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      worksheet["!cols"] = [{ wch: 30 }, { wch: 30 }, { wch: 20 }];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      XLSX.writeFile(workbook, "FirmsList.xlsx");
    },

    async Delete() {
      try {
        if (!this.currentRow?.id) {
          return;
        }

        const payload = {
          ...this.currentRow,
          isActive: false,
        };

        const response = await this.$api.put("firms", payload);

        this.getList();
        this.deleteConfirm = false;

        this.$q.notify({
          progress: true,
          type: "positive",
          color: "positive",
          message: this.$t("success"),
          caption: this.$t("success"),
        });

        this.$logger.log(response);
      } catch (error) {
        this.$q.notify({
          progress: true,
          type: "negative",
          color: "negative",
          message: this.$t("error"),
          caption: this.$t("error"),
        });
        this.$logger.log("Hata:", error);
      }
    },

    async getList() {
      try {
        const response = await this.$api.get("firmDetailList");
        this.rows = response?.data || [];
        this.loading = false;
      } catch (error) {
        this.$logger.log(error);
        this.rows = [];
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
