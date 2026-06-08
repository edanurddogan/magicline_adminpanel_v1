<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
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
            {{ $t("pages.discountList") }}
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
      <template #body-cell-action="props">
        <q-td :props="props">
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

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "DealerDiscountsForm",
  props: {
    dealerId: {
      type: Number,
      default: () => null,
    },
  },
  emits: ["completed"],
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
      discountTypes: [],
      pagination: { rowsPerPage: 10 },
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "discountType",
          label: this.$t("discountList.discountType"),
          field: (row) =>
            this.discountTypes.find((t) => t.id === row.discountTypeId)?.name ||
            "",
          align: "left",
          sortable: true,
        },
        {
          name: "discountCode",
          label: this.$t("discountList.discountCode"),
          field: "code",
          align: "left",
          sortable: false,
        },
        {
          name: "discountPercentage",
          label: this.$t("discountList.discountPercentage"),
          field: "percentage",
          align: "left",
          sortable: true,
        },
        {
          name: "discountAmount",
          label: this.$t("discountList.discountAmount"),
          field: "amount",
          align: "left",
          sortable: true,
        },
        // {
        //   name: "createdDate",
        //   label: this.$t("discountList.createdDate"),
        //   field: (row) =>
        //     new Date(row.createdDate).toLocaleDateString("tr-TR", {
        //       day: "2-digit",
        //       month: "2-digit",
        //       year: "numeric",
        //     }),
        //   align: "left",
        //   sortable: true,
        // },
        {
          name: "startDate",
          label: this.$t("discountList.startDate"),
          field: (row) =>
            new Date(row.startDate).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          align: "left",
          sortable: true,
        },
        {
          name: "endDate",
          label: this.$t("discountList.endDate"),
          field: (row) =>
            new Date(row.endDate).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          align: "left",
          sortable: true,
        },
        // {
        //   name: "isActive",
        //   label: this.$t("isActive"),
        //   field: (row) => row.isActive,
        //   align: "center",
        // },
      ];
    },
  },

  async mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$setPageTitle(this.$t("pages.discountList"));
      this.getDiscountTypes();
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
    async getDiscountTypes() {
      try {
        const response = await this.$api.get("/discountTypes");

        this.discountTypes = response.data;
      } catch (error) {
        console.error("Error getDiscountTypes:", error);
      }
    },

    clickMenu(row) {
      this.$logger.log("Context menu clicked", row);
    },
    async getList() {
      try {
        this.loading = true;
        console.log("de", this.dealerId);
        const response = await this.$api.get(
          `getDiscountsByDealerId/${this.dealerId}`
        );
        this.rows = response.data.data;
      } catch (error) {
        console.error("Error fetching price list:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
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
