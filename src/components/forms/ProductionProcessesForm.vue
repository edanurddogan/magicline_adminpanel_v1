<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("products.product") }}</div>
        </q-card-section>
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
              <q-item-section>
                <div>
                  <b>{{ $t("products.stockcode") }}</b
                  ><br />
                  {{
                    this.productionOrderDetail.productionOrder.stockCard
                      .stockCode
                  }}
                </div>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <div>
                  <b>{{ $t("products.product") }}</b
                  ><br />
                  {{
                    this.productionOrderDetail.productionOrder.stockCard
                      .stockName
                  }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("description") }}</div>
        </q-card-section>
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
              <q-item-section>
                <div>
                  <b>{{ $t("production.productionorderstatus") }}</b
                  ><br />
                  {{ productionOrderDetail.productionOrderDetailStatus.name }}
                </div>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <div>
                  <b>{{ $t("description") }}</b
                  ><br />
                  {{ productionOrderDetail.productionOrderDetailStatus.detail }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section v-if="!productionfinished"
          ><q-list class="row">
            <q-item class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
              <q-item-section>
                <q-btn v-if="!processStarted" class="text-capitalize"
                icon-right="start" text-color="white" color="positive" loading:
                startStopProcessLoading
                :label="$t('production.startTheProcess')" @click="startProcess"
                /> <q-btn v-if="processStarted" class="text-capitalize"
                icon-right="pan_tool" text-color="white" color="warning"
                loading: startStopProcessLoading
                :label="$t('production.finishTheProcess')"
                @click="finishProcess" />
              </q-item-section>
            </q-item>
            <q-item
              class="col-lg-4 col-md-4 col-sm-6 col-xs-6"
              v-if="processStarted"
            >
              <q-item-section>
                <div>
                  <b>{{ $t("production.productionstartdate") }}</b>
                  <br />
                  {{ productionOrderDetail.productionStartDate }}
                </div>
              </q-item-section>
            </q-item>
            <q-space />

            <q-item class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
              <q-item-section>
                <q-btn
                  class="text-capitalize"
                  icon-right="start"
                  text-color="white"
                  color="positive"
                  :label="$t('production.printProductionLabel')"
                  @click="printProductionLabel"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section v-if="productionfinished">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                {{ $t("production.productionComplated") }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card
        v-if="processStarted"
        class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12"
      >
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("production.transactionsMade") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-splitter v-model="splitterModel" :limits="[20, 60]">
            <template v-slot:before>
              <div>
                <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-card-section class="bg-primary text-white">
                    <div>{{ $t("production.transactionDetails") }}</div>
                  </q-card-section>
                  <q-card-section>
                    <q-list class="row">
                      <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <q-item-section>
                          <q-select
                            dense
                            outlined
                            use-input
                            input-debounce="0"
                            transition-show="scale"
                            transition-hide="scale"
                            v-model="transactionDetail.addRemoveProcess"
                            option-value="value"
                            option-label="name"
                            :label="$t('production.addremoveprocess')"
                            :options="addRemoveProcess"
                            @update:model-value="findStockCardBySerialNo"
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
                      <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <q-item-section>
                          <q-input
                            outlined
                            :disable="mode === 'details'"
                            :label="$t('products.serialNo')"
                            v-model="transactionDetail.stockSerialNo"
                            type="text"
                            @update:model-value="findStockCardBySerialNo"
                          />
                        </q-item-section>
                      </q-item>
                      <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <q-item-section>
                          <q-select
                            dense
                            outlined
                            use-input
                            clearable
                            input-debounce="0"
                            transition-show="scale"
                            transition-hide="scale"
                            v-model="transactionDetail.stockCard"
                            option-value="id"
                            option-label="stockName"
                            :options="stockFiltered"
                            @filter="filterStock"
                            :loading="stockFullLoading"
                            :label="$t('products.product')"
                            :disable="
                              transactionDetail.stockSerialNo == ''
                                ? false
                                : true
                            "
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
                      <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <q-item-section>
                          <q-input
                            outlined
                            :disable="
                              transactionDetail.stockSerialNo == ''
                                ? false
                                : true
                            "
                            :label="$t('products.piece')"
                            v-model="transactionDetail.piece"
                            type="number"
                          />
                        </q-item-section>
                      </q-item>
                      <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <q-item-section>
                          <q-input
                            outlined
                            rows="2"
                            :disable="mode === 'details'"
                            :label="$t('firm.detail')"
                            v-model="transactionDetail.detail"
                            type="textarea"
                          />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                  <q-card-action
                    class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12"
                  >
                    <q-space />
                    <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                      <q-item-section>
                        <q-btn
                          class="text-capitalize"
                          icon-right="send"
                          text-color="white"
                          color="secondary"
                          :label="$t('save')"
                          @click="transactionDetailSave"
                        />
                      </q-item-section>
                    </q-item>
                  </q-card-action>
                  <q-inner-loading
                    :showing="transactionDetailLoading"
                    color="red"
                    :dark="true"
                    label="Please wait..."
                  />
                </q-card>
              </div>
            </template>

            <template v-slot:separator>
              <q-avatar
                color="primary"
                text-color="white"
                size="30px"
                icon="settings_ethernet"
              />
            </template>

            <template v-slot:after>
              <div class="q-pa-md">
                <q-table
                  flat
                  bordered
                  :grid="isGrid"
                  :hide-header="isGrid"
                  class="statement-table"
                  :rows="rows"
                  :columns="columns"
                  :loading="transactionDetailLoading"
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
                      >
                        {{ $t("production.transactionsMade") }}
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
                    </div>
                  </template>

                  <template #body-cell-addRemoveProcess="props">
                    <q-td :props="props">
                      <q-icon
                        v-if="props.row.addRemoveProcess"
                        :name="
                          props.row.addRemoveProcess == 'added'
                            ? 'add_circle_outline'
                            : props.row.addRemoveProcess == 'removed'
                            ? 'remove_circle_outline'
                            : props.row.addRemoveProcess == 'repaired'
                            ? 'auto_fix_high'
                            : ''
                        "
                        :style="{
                          color:
                            props.row.addRemoveProcess == 'added'
                              ? 'green'
                              : props.row.addRemoveProcess == 'removed'
                              ? 'red'
                              : props.row.addRemoveProcess == 'repaired'
                              ? 'blue'
                              : '#fff',
                        }"
                        style="font-size: 1.6em"
                      />
                      {{ $t(props.row.addRemoveProcess) }}
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
                                v-else-if="col.name === 'addRemoveProcess'"
                                class="row"
                              >
                                <div class="row">
                                  <q-icon
                                    v-if="props.row.order.buysell"
                                    :name="
                                      props.row.order.buysell == 'Satış'
                                        ? 'arrow_upward'
                                        : props.row.order.buysell == 'Alış'
                                        ? 'arrow_downward'
                                        : ''
                                    "
                                    :style="{
                                      color:
                                        props.row.order.buysell == 'Satış'
                                          ? '#24792E'
                                          : props.row.order.buysell == 'Alış'
                                          ? '#FF7100'
                                          : '#fff',
                                    }"
                                    style="font-size: 1.6em"
                                  />
                                  {{ props.row.order.buysell }}
                                </div>
                              </q-item-section>
                              <!--<q-item-section
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
                                    dense
                                    flat
                                    round
                                    color="negative"
                                    icon="delete_forever"
                                    @click="onDelete(props.row)"
                                  />
                                </div>
                              </q-item-section>-->

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
              </div>
            </template>
          </q-splitter>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed } from "vue";
import { useQuasar, date, LocalStorage } from "quasar";

export default defineComponent({
  name: "ProductionProcessesForm",
  components: {},
  computed: {},

  setup(props, { emit }) {
    const $q = useQuasar();
    const formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    return {
      formModel,
    };
  },

  computed: {
    columns() {
      return [
        {
          name: "addRemoveProcess",
          label: this.$t("production.addremoveprocess"),
          align: "left",
          field: (row) => row.addRemoveProcess,
          sortable: true,
        },
        {
          name: "productionProcess",
          label: this.$t("production.productionProcess"),
          align: "left",
          field: (row) => row.productionOrderDetailStatus.name,
          sortable: true,
        },
        {
          name: "stockcode",
          label: this.$t("products.stockcode"),
          align: "left",
          field: (row) => row.addedRemovedProduct?.stockName,
          sortable: true,
        },
        {
          name: "serialNo",
          label: this.$t("products.serialNo"),
          align: "left",
          field: (row) => row.addedRemovedProductSerialNo?.serialNo,
          sortable: true,
        },
        {
          name: "piece",
          label: this.$t("products.piece"),
          align: "center",
          field: (row) => row.piece,
          sortable: true,
        },
        {
          name: "employee",
          label: this.$t("users.employee"),
          align: "left",
          field: (row) => row.employee.name,
          sortable: true,
        },
        {
          name: "detail",
          label: this.$t("detail"),
          align: "left",
          field: (row) => row.detail,
          sortable: true,
        },
        {
          name: "transactionDate",
          label: this.$t("production.transactionDate"),
          align: "left",
          field: (row) => date.formatDate(row.createdAt, "DD.MM.YYYY HH:mm:ss"),
          sortable: true,
        },
        /*{
          name: 'status',
          name: 'status',
          align: 'center',
          label: this.$t('status'),
          field: 'isActive',
          sortable: true,
        },
        {
          name: 'action',
          align: 'center',
          label: this.$t('action'),
          field: '',
        },*/
      ];
    },
  },

  data() {
    return {
      loading: false,
      transactionDetailLoading: false,
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
      newItem: {},
      selectedinside: {},
      processStarted: false,
      processFinished: false,
      productionfinished: false,
      startStopProcessLoading: false,
      productionOrderDetail: this.formModel,
      pagination: {
        rowsPerPage: 20,
      },
      splitterModel: 30,
      //productionOrderDetail: {},
      transactionDetail: {
        productionOrderDetailId: 0,
        addRemoveProcess: { value: "islemturu", name: "İşlem Türü" },
        stockSerialNo: "",
        addedRemovedProductSerialNoId: null,
        stockCard: null,
        addedRemovedProductId: null,
        piece: 0,
        detail: "",
        employeeId: LocalStorage.getItem("userinfo").id,
      },
      addRemoveProcess: [
        { value: "added", name: this.$t("added") },
        { value: "removed", name: this.$t("removed") },
        { value: "repaired", name: this.$t("repaired") },
      ],
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
    processStatus: {
      type: Object,
      default: () => {},
    },
  },

  mounted() {
    this.newItem.insideStockId = 0;
    this.selectedinside.id = 0;
    this.$logger.log("formModel", this.productionOrderDetail);
    this.$logger.log("processStatus", this.processStatus);
    this.init();
  },

  methods: {
    async init() {
      try {
        this.transactionDetail.productionOrderDetailId = this.formModel.id;
        //this.productionOrderDetail = this.formModel;
        this.$logger.log(
          "productionOrderDetail =>",
          this.productionOrderDetail
        );
      } catch (error) {}
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}

      try {
        if (this.productionOrderDetail?.id) {
          //this.getRecipeList();
        }
      } catch (error) {
        this.$logger.log("error/", error);
      }
      try {
        var lastTiming =
          this.productionOrderDetail.productionOrderDetailTimings.length - 1;
        this.$logger.log("lastTiming =>", lastTiming);
        if (
          this.productionOrderDetail.productionOrderDetailTimings[lastTiming]
            .startDate
        ) {
          this.processStarted = true;
          this.$logger.log(
            "startDate =>",
            this.productionOrderDetail.productionOrderDetailTimings[lastTiming]
              .startDate
          );
        }
        if (
          this.productionOrderDetail.productionOrderDetailTimings[lastTiming]
            .finishDate
        ) {
          this.processStarted = false;
          this.processFinished = true;
          this.$logger.log(
            "finishDate =>",
            this.productionOrderDetail.productionOrderDetailTimings[lastTiming]
              .finishDate
          );

          if (this.productionOrderDetail.productionFinishDate)
            this.productionfinished = true;
          else this.productionfinished = false;
          //TODO: süreç tamamlandığında formu kapat
        }
        this.$logger.log("processStarted =>", this.processStarted);
        this.$logger.log("processFinished =>", this.processFinished);
      } catch (error) {
        this.$logger.log("error/", error);
      }
      this.getStockList();
      this.getList();
    },

    onSubmit() {},
    async newFormMode() {
      this.newItem = {};
      this.newItem.insideStock.name = "";
      this.currentMode = "add";
      this.$logger.log("form newItem", this.newItem);
    },
    save() {
      this.$logger.log("form submitted", this.productionOrderDetail);
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
      this.newItem.insideStockId = this.newItem.insideStock.id;

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
      this.newItem.insideStockId = this.newItem.insideStock.id;
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

    async getStockList() {
      this.stockFullLoading = true;
      const response = this.$api.get("stockCards").then((data) => {
        this.stockFull = data.data;
        this.$logger.log("stocks =>", this.stockFull);
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

    async Delete() {
      try {
        this.$logger.log(this.currentRow.id);
        const response = await this.$api.delete(
          "productionRecipes/" + this.currentRow.id
        );
        this.getRecipeList();
        this.deleteConfirm = false;
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async getList() {
      this.getproductionOrderDetailMovements();
    },

    async findStockCardBySerialNo() {
      if (this.transactionDetail.stockSerialNo.length < 3) return;
      this.stockFullLoading = true;
      this.$logger.log("deneme", this.transactionDetail.addRemoveProcess);
      const response = this.$api
        .get(
          "getStockCardBySerialNo/" +
            this.transactionDetail.stockSerialNo +
            "/" +
            this.transactionDetail.addRemoveProcess.value
        )
        .then((data) => {
          if (data.data.stockCard) {
            this.transactionDetail.stockCard = data.data.stockCard;
            this.transactionDetail.addedRemovedProductSerialNoId = data.data.id;
            this.transactionDetail.addedRemovedProductId =
              data.data.stockCard.id;
            this.transactionDetail.piece = 1;
          } else {
            this.transactionDetail.stockCard = null;
            this.transactionDetail.addedRemovedProductSerialNoId = null;
            this.transactionDetail.addedRemovedProductId = 0;
            this.transactionDetail.piece = 0;
          }
          this.stockFullLoading = false;
          this.$logger.log("transactionDetail", this.transactionDetail);
        });
    },

    async transactionDetailSave() {
      var errorMsg = "";
      try {
        try {
          this.transactionDetail.addRemoveProcess.value;
        } catch (error) {
          errorMsg += this.$t("production.transactionTypeRequired") + "<br>";
        }

        if (
          this.addRemoveProcess.findIndex(
            (x) => x.value == this.transactionDetail.addRemoveProcess.value
          ) == -1
        ) {
          errorMsg += this.$t("production.transactionTypeRequired") + "<br>";
        }

        if (this.transactionDetail.stockSerialNo.length > 0) {
          if (this.transactionDetail.addedRemovedProductSerialNoId == null)
            errorMsg += this.$t("production.serialNoRequired") + "<br>";
          if (this.transactionDetail.addedRemovedProductId == 0)
            errorMsg += this.$t("production.stockCarRequired") + "<br>";
        }

        if (this.transactionDetail.addedRemovedProductId != 0) {
          if (this.transactionDetail.piece == 0)
            errorMsg += this.$t("production.quantityRequired") + "<br>";
        }
      } catch (error) {
        this.$logger.log(error);
      }
      if (errorMsg.length > 0) {
        this.$q.notify({
          html: true,
          progress: true,
          type: "error",
          color: "red",
          message: errorMsg,
          caption: this.$t("unsuccessful"),
        });
      } else {
        this.$q.notify({
          html: true,
          progress: true,
          type: "info",
          message: this.$t("added"),
          message: this.$t("success"),
        });
        this.postproductionOrderDetailMovements();
        this.resetTransactionDetail();
      }
    },
    async postproductionOrderDetailMovements() {
      try {
        this.transactionDetail.productionOrderDetailId = this.formModel.id;
        this.transactionDetail.addedRemovedProductId =
          this.transactionDetail.stockCard.id;
        this.transactionDetailLoading = true;
        this.$logger.log("transactionDetail", this.transactionDetail);
        this.transactionDetail.addRemoveProcess =
          this.transactionDetail.addRemoveProcess.value;
        this.transactionDetail.productionOrderDetailStatusId =
          this.productionOrderDetail.productionOrderDetailStatusId;
        this.$logger.log("transactionDetail", this.transactionDetail);
        const _response = this.$api
          .post("postproductionOrderDetailMovements", this.transactionDetail)
          .then((response) => {
            this.$logger.log("productionOrderDetailMovements", response.data);
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: this.$t("saved"),
            });

            this.transactionDetailLoading = false;
            this.transactionDetail.addRemoveProcess =
              this.addRemoveProcess.find(
                (x) => x.value == this.transactionDetail.addRemoveProcess.value
              );
            this.getproductionOrderDetailMovements();
          });
      } catch (error) {
        this.$logger.log("postproductionOrderDetailMovements", error);
        this.transactionDetailLoading = false;
      }
    },

    async getproductionOrderDetailMovements() {
      this.transactionDetailLoading = true;
      const response = this.$api
        .get(
          "getproductionOrderDetailMovements/" + this.productionOrderDetail.id
        )
        .then((result) => {
          this.rows = result.data;
          this.transactionDetailLoading = false;
          this.$logger.log("getproductionOrderDetailMovements", result.data);
        });
    },
    async resetTransactionDetail() {
      this.transactionDetail = {
        productionOrderDetailId: this.formModel.id,
        addRemoveProcess: { value: "add", name: "Eklendi" },
        stockSerialNo: "",
        addedRemovedProductSerialNoId: null,
        stockCard: null,
        addedRemovedProductId: 0,
        piece: 0,
        detail: "",
        employeeId: LocalStorage.getItem("userinfo").id,
      };
    },

    async getproductionOrderDetail() {
      //processStarted = !processStarted
      const response = this.$api
        .get("getProductionOrderDetailById/" + this.productionOrderDetail.id)
        .then((result) => {
          this.productionOrderDetail = result.data;
          this.formModel = this.productionOrderDetail;
          this.$logger.log("formModel =>", this.productionOrderDetail);
          var lastTiming =
            this.productionOrderDetail.productionOrderDetailTimings.length - 1;
          this.$logger.log("lastTiming =>", lastTiming);
          if (
            this.productionOrderDetail.productionOrderDetailTimings[lastTiming]
              .startDate
          ) {
            this.processStarted = true;
            this.$logger.log(
              "startDate =>",
              this.productionOrderDetail.productionOrderDetailTimings[
                lastTiming
              ].startDate
            );
          }
          if (
            this.productionOrderDetail.productionOrderDetailTimings[lastTiming]
              .finishDate
          ) {
            this.processStarted = false;
            this.processFinished = true;
            this.$logger.log(
              "finishDate =>",
              this.productionOrderDetail.productionOrderDetailTimings[
                lastTiming
              ].finishDate
            );
            //TODO: süreç tamamlandığında formu kapat
          }
          this.$logger.log("processStarted =>", this.processStarted);
          this.$logger.log("processFinished =>", this.processFinished);

          if (this.productionOrderDetail.productionFinishDate)
            this.productionfinished = true;
          else this.productionfinished = false;

          this.$logger.log("productionfinished =>", this.productionfinished);
        });
    },
    async startProcess() {
      //processStarted = !processStarted
      const response = this.$api
        .get("putProductionOrderStartDate/" + this.productionOrderDetail.id)
        .then((result) => {
          this.getproductionOrderDetail();
        });
    },
    async finishProcess() {
      const response = this.$api
        .get("putProductionOrderFinishDate/" + this.productionOrderDetail.id)
        .then((result) => {
          //this.getproductionOrderDetail();
          this.$emit("completed");
        });
    },
    async printProductionLabel() {
      var labelScriptDetail = {};
      labelScriptDetail.barcodeType = "production";
      labelScriptDetail.barcode = this.productionOrderDetail.productionBarcode;
      labelScriptDetail.productionNo = this.productionOrderDetail.productionNo;
      labelScriptDetail.stockCardName =
        this.productionOrderDetail.productionOrder.stockCard.stockName;
      labelScriptDetail.firm =
        this.productionOrderDetail.productionOrder.order.firm.name;
      labelScriptDetail.piece = 1;
      this.$logger.log("labelScriptDetail", labelScriptDetail);
      const _response = this.$api
        .post("printLabel", labelScriptDetail)
        .then((response) => {
          this.$logger.log("printLabel", response);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("production.printedLabel"),
            caption: this.$t("success"),
          });
        });
    },
  },
}); //deneme1
</script>
