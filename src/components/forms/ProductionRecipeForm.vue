<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("products.product") }}</div>
        </q-card-section>
        <q-separator />

        <q-card-actions>
          <q-list class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item>
              <q-item-section>
                <div class="row">
                  <div class="col col-lg-3 col-md-3 col-sm-3 col-xs-3">
                    <b>{{ $t("products.product") }}</b
                    ><br />
                    {{
                      this.formModel?.stockName ||
                      this.formModel?.stockCard?.stockName
                    }}
                  </div>
                  <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                    <b>{{ $t("products.stockcode") }}</b
                    ><br />
                    {{
                      this.formModel?.stockCode ||
                      this.formModel?.stockCard?.stockCode
                    }}
                  </div>
                  <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                    <b>{{ $t("products.stocktype") }}</b
                    ><br />
                    {{
                      this.formModel?.stockType?.name ||
                      this.formModel?.stockCard?.stockType?.name
                    }}
                  </div>
                  <!--<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                    <b>{{ $t('products.category') }}</b
                    ><br />
                    {{ this.formModel.category.name }}
                  </div>-->
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-actions>
      </q-card>

      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("recipes.recipecontent") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-list class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item>
              <q-item-section>
                <q-table
                  flat
                  bordered
                  :grid="isGrid"
                  :hide-header="isGrid"
                  class="statement-table"
                  :rows="rows"
                  :columns="columns"
                  :loading="loading"
                  :filter="filter"
                  :loading-label="$t('loading')"
                  :no-data-label="$t('nodatalabel')"
                  :no-results-label="$t('noresultslabel')"
                  row-key="id"
                >
                  <template v-slot:top="props">
                    <div class="row col-12">
                      <div
                        class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title"
                      >
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
                      />
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
                        :icon="
                          props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                        "
                        @click="props.toggleFullscreen"
                        class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                      />
                      <q-btn
                        flat
                        round
                        dense
                        :icon="isGrid ? 'list' : 'grid_on'"
                        @click="isGrid = !isGrid"
                        class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                      >
                        <q-tooltip v-close-popup>{{
                          isGrid ? "List" : "Grid"
                        }}</q-tooltip>
                      </q-btn>
                      <q-btn
                        dense
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
                        >{{
                          props.row.isActive ? $t("active") : $t("inactive")
                        }}
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
                        v-if="false"
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
                                :color="
                                  props.row.isActive === true ? 'green' : 'red'
                                "
                                text-color="white"
                                dense
                                class="text-weight-bolder"
                                square
                                >{{
                                  props.row.isActive
                                    ? $t("active")
                                    : $t("inactive")
                                }}
                              </q-chip>

                              <q-item-section
                                v-else-if="col.name === 'action'"
                                class="row"
                              >
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
                                    v-if="false"
                                    dense
                                    flat
                                    round
                                    color="negative"
                                    icon="delete_forever"
                                    @click="onDelete(props.row)"
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
                      <q-icon
                        size="2em"
                        :name="filter ? 'filter_b_and_w' : icon"
                      />
                      <span> {{ message }}... </span>
                    </div>
                  </template>
                </q-table>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-actions>
      </q-card>
    </div>

    <!-- Add Product Form Dialog -->
    <q-dialog
      dense
      v-model="formVisible"
      persistent
      :maximized="false"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 50vw; max-height: 90vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("products.product")
              }}</span>
              {{ $t(currentMode) }}</q-toolbar-title
            >

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  clearable
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="newItem.stockCard"
                  option-value="id"
                  option-label="stockName"
                  :loading="stockFullLoading"
                  :label="$t('products.product')"
                  :options="stockFiltered"
                  @filter="filterStock"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{ $t("noresults") }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('products.piece')"
                  v-model="newItem.piece"
                  type="number"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-if="newItem.piece" v-slot:append>
                    <q-icon
                      dense
                      name="cancel"
                      @click.stop.prevent="newFormMode"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-btn
                  color="secondary"
                  :label="$t('savedata')"
                  icon-right="send"
                  text-color="white"
                  size="lg"
                  :style="{
                    display: mode === 'details' ? 'none' : '',
                  }"
                  @click="save"
                  :disable="newItem.piece ? false : true"
                >
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Delete Form Dialog -->
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
            "{{ currentRow.stockCard?.stockName }}"
            {{ $t("products.deleteMessage") }}
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
</template>
<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "ProductionRecipeFrom",
  components: {},
  computed: {},

  setup(props, { emit }) {
    const $q = useQuasar();
    var formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (!props.modelValue.id) {
      formModel.value.stockType = {};
      formModel.value.stockType.name = "";
      formModel.value.stockCard = { stockName: "", stockCode: "" };
      /*formModel.value.order.address = {};
      formModel.value.order.address.city = { id: 0, name: 'Seç' };
      formModel.value.order.address.country = { id: 0, name: 'Seç' };
      formModel.value.order.address.region = { id: 0, name: 'Seç' };
      formModel.value.order.employee = {};
      formModel.value.order.exchangeRate = {};
      formModel.value.order.firm = { id: 0, commercialTitle: 'Seç' };
      formModel.value.order.firm.paymentTerm = {};
      formModel.value.order.orderStatus = {};
      formModel.value.order.paymentTerm = {};
      formModel.value.orderItems = [];
      formModel.value.order.dispatchDate = date.formatDate(
        Date(),
        'YYYY-MM-DD'
      );
      formModel.value.order.orderDate = date.formatDate(Date(), 'YYYY-MM-DD');*/
    }

    return {
      formModel,
    };
  },

  computed: {
    columns() {
      return [
        {
          name: "productname",
          label: this.$t("products.productname"),
          align: "left",
          field: (row) => row.stockCard?.stockName,
          sortable: true,
        },
        {
          name: "stockcode",
          label: this.$t("products.stockcode"),
          align: "left",
          field: (row) => row.stockCard?.stockCode,
          sortable: true,
        },
        {
          name: "piece",
          label: this.$t("products.piece"),
          align: "left",
          field: (row) => row.piece,
          sortable: true,
        },
        {
          name: "status",
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
      stockFull: [],
      stockFullLoading: false,
      stockFiltered: [],
      newItem: { stockCard: { stockName: "Test", stockCode: "" } },
      selectedinside: {},
    };
  },

  emits: ["completed"],

  onBeforeCreate() {},

  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: "add",
    },
  },

  mounted() {
    this.newItem.stockCardId = 0;
    this.selectedinside.id = 0;

    this.init();
  },

  methods: {
    async init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}

      try {
        if (this.formModel?.id) {
          this.getRecipeList();
        }
      } catch (error) {
        this.$logger.log("error/", error);
      }
    },

    onSubmit() {},
    async newFormMode() {
      this.newItem = {};
      this.newItem.stockCard.stockName = "Test";
      this.currentMode = "add";
      this.$logger.log("form newItem", this.newItem);
    },
    save() {
      this.$logger.log("form submitted", this.formModel);
      this.$logger.log("mode", this.mode);
      if (this.currentMode === "add") {
        this.addFormModel();
      } else if (this.currentMode === "edit") {
        this.editFormModel();
      }
    },
    onAdd() {
      this.getStockList();
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
      this.currentMode = "edit";
      this.newItem = item;
      this.formVisible = true;
    },
    onDelete(item) {
      this.currentRow = item;
      this.deleteConfirm = true;
    },
    async addFormModel() {
      this.newItem.productionStockId = this.formModel.id;
      this.newItem.stockCardId = this.newItem.stockCard.id;

      this.$logger.log(this.newItem);
      const _response = this.$api
        .post("productionRecipes", JSON.stringify(this.newItem))
        .then((response) => {
          this.$logger.log(response.data);
          this.$logger.log("add completed");
          this.$logger.log(this.formModel);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
          this.formVisible = false;
          this.getRecipeList();
        });
    },

    async editFormModel() {
      this.newItem.productionStockId = this.formModel.id;
      this.newItem.stockCardId = this.newItem.stockCard.id;
      const response = this.$api
        .put("productionRecipes", JSON.stringify(this.newItem))
        .then((_response) => {
          this.$logger.log(_response);
          this.$logger.log("edit completed");

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
          this.formVisible = false;
          this.getRecipeList();
        });
    },

    async getRecipeList() {
      this.$logger.log("get recipe.....:");
      const response = await this.$api.get(
        "getProductionReceipe/" + this.formModel.id
      );
      this.$logger.log("getProductionReceipe/", response?.data);
      this.rows = response?.data;
      this.loading = false;
    },

    async getStockList() {
      this.stockFullLoading = true;
      const response = this.$api.get("stockCards").then((data) => {
        this.$logger.log(data.data);
        this.stockFull = data.data;
        this.stockFullLoading = false;
      });
    },

    filterStock(val, update) {
      if (val === "") {
        update(() => {
          this.stockFiltered = this.stockFull;
        });
        return;
      }

      update(() => {
        this.stockFiltered = this.stockFull.filter(
          (v) => v.stockName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    // async Delete() {
    //   try {
    //     this.$logger.log(this.currentRow.id);
    //     const response = await this.$api.delete(
    //       "productionRecipes/" + this.currentRow.id
    //     );
    //     this.getRecipeList();
    //     this.deleteConfirm = false;
    //   } catch (error) {
    //     this.$logger.log(error);
    //   }
    // },
  },
});
</script>
