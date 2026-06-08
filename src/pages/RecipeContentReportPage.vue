<template>
  <div class="q-pa-md">
    <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card-section class="bg-primary text-white">
        <div>{{ $t("products.stockinfo") }}</div>
      </q-card-section>
      <q-list class="row">
        <q-item class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
          <q-item-section>
            <q-select
              dense
              outlined
              use-input
              :label="$t('products.productname')"
              v-model="selectedProduct"
              option-value="id"
              option-label="value"
              :options="productsFiltered"
              @filter="filterProduct"
              @update:model-value="(val) => updateRecipe(val)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
  <div class="q-pa-md">
    <q-table
      dense
      bordered
      :grid="isGrid"
      :hide-header="isGrid"
      class="statement-table"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      :filter="filter"
      :loading-label="$t('loading')"
      :no-data-label="$t('nodatalabel')"
      :no-results-label="$t('noresultslabel')"
      row-key="id"
    >
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("pages.recipes") }}
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
            icon="refresh"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="getProductionOrderList"
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
            dense
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
            dense
            flat
            round
            color="primary"
            icon="info"
            @click="onView(props.row)"
          />
          <q-btn
            dense
            flat
            round
            color="secondary"
            icon="edit"
            @click="onEdit(props.row)"
          />
          <q-btn
            dense
            flat
            round
            color="negative"
            icon="delete_forever"
            @click="onDelete(props.row)"
          />
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
                        dense
                        flat
                        round
                        color="primary"
                        icon="info"
                        @click="onView(props.row)"
                      />
                      <q-btn
                        dense
                        flat
                        round
                        color="secondary"
                        icon="edit"
                        @click="onEdit(props.row)"
                      />
                      <q-btn
                        dense
                        flat
                        round
                        color="negative"
                        icon="delete_forever"
                        @click="onDeleteUser(props.row)"
                      />
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

    <!-- Form Dialog -->
    <q-dialog
      dense
      v-model="formVisible"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 40vw; max-height: 95vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="note_alt" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("recipes.recipes") }}</span>
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
          <ProductionRecipe-form
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
import ProductionRecipeForm from "src/components/forms/ProductionRecipeForm.vue";
import exportFromJSON from "export-from-json";
import { Platform } from "quasar";

export default defineComponent({
  components: {
    ProductionRecipeForm,
  },
  computed: {
    columns() {
      return [
        {
          name: "productname",
          label: this.$t("products.productname"),
          align: "left",
          field: (row) => row.stockCard.stockName,
          sortable: true,
        },
        {
          name: "stockcode",
          label: this.$t("products.stockcode"),
          align: "left",
          field: (row) => row.stockCard.stockCode,
          sortable: true,
        },
        {
          name: "stocktype",
          label: this.$t("products.stocktype"),
          align: "left",
          field: (row) => row.stockCard.stockType.name,
          sortable: true,
        },
        /*{
          name: 'category',
          label: this.$t('products.category'),
          align: 'left',
          field: (row) => row.category.name,
          sortable: true,
        },*/

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
      productsFiltered: [],
      selectedProduct: { id: 0, value: "Ürün Adını Veya Kodunu Yazın..." },
    };
  },
  async mounted() {
    this.init();
    document.title = `Magicline -  ${this.$t("pages.recipeReport")}`;
    // const response = await this.$api.get('getProductionReceipeList');
    // this.rows = response?.data;
    //this.$logger.log(this.rows);
    this.loading = false;
  },
  methods: {
    init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
      this.updateRecipe();
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onView(item) {
      this.maximizedToggle = false;
      this.currentRow = item;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onEdit(item) {
      this.$logger.log(item);
      this.maximizedToggle = false;
      this.currentRow = item;
      this.currentMode = "edit";
      this.formVisible = true;
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
      const data = this.rows;
      const fileName = "productionRecipes";
      const exportType = exportFromJSON.types.xls;
      exportFromJSON({ data, fileName, exportType });
    },

    async Delete() {
      try {
        this.$logger.log(this.currentRow.id);
        const response = await this.$api.delete(
          "productionRecipes/" + this.currentRow.id
        );
        this.getList();
        this.deleteConfirm = false;
        firm;
        this.$logger.log("productionRecipes", response);
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getList() {
      try {
        const response = await this.$api.get("productionRecipes");
        this.rows = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async filterProduct(val, update) {
      if (val.length < 3) {
        return;
      }

      update(() => {
        var body = { letters: val };
        const response = this.$api
          .put("searchStockCards/", body)
          .then((data) => {
            var products = data.data.map((p) => {
              p.value = `${p.stockCode} - ${p.stockName}`;
              return p;
            });
            this.productsFiltered = products;
          });
      });
    },
    updateRecipe(val) {
      this.$logger.log("selectedProduct", this.selectedProduct);
      const response = this.$api
        .get(
          "getProductionReceipeListWithStockCardId/" + this.selectedProduct.id
        )
        .then((data) => {
          this.rows = data.data;
          this.$logger.log("Content => ", this.rows);
        });
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
