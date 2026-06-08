<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <q-table
      flat
      dense
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
    >
      <template v-slot:body-cell="props">
        <q-td :props="props">
          {{ props.value }}
        </q-td>
        <q-menu touch-position context-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section @click="onCopy(props.row)">
                {{ $t("copy") }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("products.products") }}
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
          <q-space />

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
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.isActive === true ? 'green' : 'red'"
            text-color="white"
            dense
            class="text-weight-bolder"
            square
            >{{ props.row.isActive ? $t("active") : $t("inactive") }}
          </q-chip>
        </q-td>
      </template>
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="import_export"
            :to="'/stockinout/' + props.row.id"
            ><!--@click="onView(props.row)"-->
            <q-tooltip>
              {{ $t("products.stockInOut") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="info"
            @click="onView(props.row)"
          >
            <q-tooltip>
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
            <q-tooltip>
              {{ $t("edit") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
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
                    >{{ props.row.isActive ? $t("active") : $t("inactive") }}
                  </q-chip>

                  <q-item-section v-else-if="col.name === 'action'" class="row">
                    <div class="row">
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
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 40vw; max-height: 95vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("products.product")
              }}</span>
              {{ $t(currentMode) }}</q-toolbar-title
            >

            <!--
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
            </q-btn>-->
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
          <product-form
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
      <q-card class="q-pa-md">
        <q-card-section class="items-center row">
          <q-avatar
            icon="view_in_ar"
            color="negative"
            text-color="white"
          />&nbsp; &nbsp; &nbsp; &nbsp;
          <h5>{{ $t("products.deleteconfirm") }}</h5>
        </q-card-section>
        <q-card-section class="items-center row">
          <p>
            "{{ currentRow.stockName }}" {{ $t("products.deleteMessage") }} :
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
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import ProductForm from "src/components/forms/ProductForm.vue";
import exportFromJSON from "export-from-json";
import { Platform } from "quasar";

export default defineComponent({
  components: {
    ProductForm,
  },
  computed: {
    columns() {
      return [
        {
          name: "stockcode",
          label: this.$t("products.stockcode"),
          field: (row) => row.stockCode,
          align: "left",
          sortable: true,
        },
        {
          name: "productname",
          label: this.$t("products.productname"),
          align: "left",
          field: (row) => row.stockName,
          sortable: true,
        },
        {
          name: "stocktype",
          label: this.$t("products.stocktype"),
          field: (row) => row.stockType?.name,
          align: "left",
          sortable: true,
        },
        {
          name: "category",
          label: this.$t("products.category"),
          align: "left",
          field: (row) => row.category?.name,
          sortable: true,
        },
        {
          name: "brand",
          label: this.$t("products.brand"),
          field: (row) => row.brand?.name,
          align: "left",
          sortable: true,
        },
        {
          name: "model",
          label: this.$t("products.model"),
          field: (row) => row.model?.name,
          align: "left",
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
    this.init();
    document.title = "Magicline - Products";
    this.getList();
  },
  methods: {
    async init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
    },
    async onAdd() {
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    async onView(product) {
      this.$logger.log(product);
      this.maximizedToggle = false;
      this.currentRow = product;
      this.currentMode = "details";
      this.formVisible = true;
    },
    async onEdit(product) {
      this.currentRow = product;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    async onCopy(product) {
      var copyProduct = product;
      copyProduct.id = null;
      this.currentRow = copyProduct;
      this.currentMode = "add";
      this.formVisible = true;
    },
    async onDelete(product) {
      this.currentRow = product;
      this.deleteConfirm = true;
    },
    async onFormCompleted() {
      this.formVisible = false;
      this.$logger.log("form completed");
      this.getList();
    },
    async exportTable() {
      const data = this.rows;
      const fileName = "StockList";
      const exportType = exportFromJSON.types.xls;

      exportFromJSON({ data, fileName, exportType });
    },
    async Delete() {
      try {
        this.$logger.log(this.currentRow.id);
        const response = await this.$api.delete(
          "stockCards/" + this.currentRow.id
        );
        this.getList();
        this.deleteConfirm = false;
        stockCard;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getList() {
      try {
        const response = await this.$api.get("stockCardslist/9999/1");
        this.rows = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async clickMenu(props) {
      this.$logger.log(props);
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
