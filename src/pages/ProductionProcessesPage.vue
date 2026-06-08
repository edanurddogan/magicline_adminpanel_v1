<template>
  <!--<div>
    <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <q-item>
            <q-item-section>
              <q-input dense disable :label="$t('order.orderno')" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input dense disable :label="$t('production.firmname')" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input dense disable :label="$t('production.productionno')" />
            </q-item-section>
          </q-item>
          <q-space />
          <q-item>
            <q-item-section>
              <q-btn
                :disable="selectedEmployeeGroup == null"
                dense
                icon="save"
                class="text-capitalize bg-primary q-px-md q-ma-xs"
                text-color="white"
                @click="updateFormVisibile = true"
              >
                {{ $t("authorization.savechanges") }}
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>-->
  <div style="max-width: 100%; max-height: 100%">
    <!--v-show="preparingProductionContent"-->
    <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-splitter
        v-model="splitterModel"
        :limits="[15, 60]"
        style="max-width: 100%; max-height: 75%"
      >
        <template v-slot:before>
          <div class="q-pa-md">
            <div class="row text-h6 q-mb-md">
              {{ $t("production.stagesToDisplay") }}
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
            </div>
            <q-input
              ref="filterRef"
              dense
              filled
              v-model="filter"
              :label="$t('search')"
            >
              <template v-slot:append>
                <q-icon
                  v-if="filter !== ''"
                  name="clear"
                  class="cursor-pointer"
                  @click="resetFilter"
                ></q-icon>
              </template>
            </q-input>
            <q-checkbox
              v-model="selectAll"
              :label="$t('selectAll')"
              @update:model-value="selectAllProcess($event)"
            />
            <q-tree
              ref="producttree"
              :nodes="productionOrderDetailStatusesTree"
              node-key="id"
              label-key="name"
              tick-strategy="leaf-filtered"
              v-model:ticked="ticked"
              @update:ticked="tickedNode"
              v-bind:ticked="ticked"
              default-expand-all
              :filter="filter"
              :filter-method="myFilterMethod"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
            </q-tree>
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
            <div class="text-h6 q-mb-md">
              {{ $t("production.productions") }}
            </div>

            <q-table
              flat
              bordered
              :grid="isGrid"
              :hide-header="isGrid"
              class="statement-table"
              :rows="rows"
              :columns="productionOrderColumns"
              :loading="loading"
              :pagination="pagination"
              :filter="filterTable"
              :loading-label="$t('loading')"
              :no-data-label="$t('production.nodatalabel')"
              :no-results-label="$t('noresultslabel')"
              row-key="id"
              @row-click="onRowClick"
            >
              <template v-slot:top="props">
                <div class="row col-12">
                  <q-input
                    class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
                    bottom-slots
                    dense
                    debounce="300"
                    v-model="filterTable"
                    :placeholder="$t('search')"
                  >
                    <template v-slot:append
                      ><q-icon
                        v-if="filterTable !== ''"
                        name="close"
                        @click="filterTable = ''"
                        class="cursor-pointer"
                      />
                      <q-icon name="search" />
                    </template>
                  </q-input>

                  <q-btn
                    flat
                    round
                    dense
                    icon="refresh"
                    class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
                    @click="getProductionOrderDetail()"
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
                    class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
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
                    class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
                  >
                    <q-tooltip v-close-popup>{{
                      isGrid ? "List" : "Grid"
                    }}</q-tooltip>
                  </q-btn>
                  <q-space />

                  <q-btn
                    :label="$t('print')"
                    class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
                    icon="print"
                    @click="printTable"
                  />

                  <q-btn
                    :label="$t('export')"
                    class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
                    icon="cloud_download"
                    @click="exportTable"
                  />
                </div>
              </template>

              <template #body-cell-action="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    color="secondary"
                    icon="edprecision_manufacturingit"
                    @click="takeAction(props.row)"
                  >
                    <q-tooltip>
                      {{ $t("production.takeAction") }}
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
                          <q-item-section
                            v-if="col.name === 'action'"
                            class="row"
                          >
                            <div class="row">
                              <q-btn
                                flat
                                round
                                color="secondary"
                                icon="precision_manufacturing"
                                @click="takeAction(props.row)"
                              >
                                <q-tooltip>
                                  {{ $t("production.takeAction") }}
                                </q-tooltip>
                              </q-btn>
                            </div>
                          </q-item-section>

                          <q-item-section
                            v-else-if="col.name === 'buysell'"
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

                          <q-item-label v-else caption
                            ><p>{{ col.value }}</p></q-item-label
                          >
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </div>
              </template>

              <template v-slot:no-data="{ icon, message, filterTable }">
                <div class="full-width row flex-center q-gutter-sm">
                  <q-icon
                    size="2em"
                    :name="filterTable ? 'filter_b_and_w' : icon"
                  />
                  <span> {{ message }}... </span>
                </div>
              </template>
            </q-table>
          </div>
        </template>
      </q-splitter>
    </q-card>
  </div>

  <!-- Update Dialog -->
  <q-dialog v-model="updateFormVisibile" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="person_off" color="primary" text-color="white" />&nbsp;
        &nbsp; &nbsp; &nbsp;
        <h5>{{ $t("authorization.updateEmployeeGroupAuthority") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>
          {{
            $t("authorization.updateEmployeeGroupAuthorityMessage").replace(
              "_groupName_",
              selectedEmployeeGroup.name
            )
          }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          color="negative"
          v-close-popup
        /><q-space />
        <q-btn
          flat
          :label="$t('updatedata')"
          color="positive"
          v-on:click="saveChanges"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Form Dialog -->
  <q-dialog
    dense
    v-model="ProductionProcessesFormVisible"
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
            {{ $t("production.takeAction") }}</q-toolbar-title
          >

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
        <production-processes-form
          class="q-ma-none q-pa-none"
          v-model="currentRow"
          :mode="currentMode"
          :processStatus="processStatus"
          @completed="onFormCompleted"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from "vue";
import { LocalStorage, date } from "quasar";
import _ from "lodash";
import ProductionProcessesForm from "src/components/forms/ProductionProcessesForm.vue";
//var _ = typeof require == 'function' ? require('..') : window._;
export default defineComponent({
  components: {
    ProductionProcessesForm,
  },
  emits: ["completed"],
  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: "new",
    },
    orderItems: {
      default: [],
    },
  },
  data() {
    return {
      filter: "",
      filterTable: "",
      filterRef: null,
      selected: "",
      selectedProduction: "",
      ticked: [],
      tickedList: [],
      expanded: [""],
      define: "",

      orderProductList: [],

      splitterModel: 15,

      maximizedToggle: false,
      isGrid: false,
      rows: [],

      //productionProcces
      loading: false,
      selectAll: false,
      productionOrderDetailStatuses: [],
      productionOrderDetailStatusesTree: [],
      productionOrderDetailStatusesLoading: true,
      ProductionProcessesFormVisible: false,
      processStatus: {},
      pagination: {
        rowsPerPage: 25,
      },
    };
  },

  computed: {
    productionOrderColumns() {
      return [
        {
          name: "action",
          align: "center",
          label: this.$t("action"),
          field: "",
        },
        {
          name: "barcode",
          label: this.$t("products.barcode"),
          align: "left",
          field: (row) => row.productionBarcode,
          sortable: true,
        },
        {
          name: "productionstartdate",
          label: this.$t("production.productionstartdate"),
          align: "left",
          field: (row) =>
            date.formatDate(
              row.productionOrderDetailTimings[0]?.startDate,
              "YYYY-MM-DD HH:mm:ss"
            ),
          sortable: true,
        },
        {
          name: "productionstartdate",
          label: this.$t("production.productionstartdate"),
          align: "left",
          field: (row) =>
            date.formatDate(row.productionStartDate, "YYYY-MM-DD HH:mm:ss"),
          sortable: true,
        },
        {
          name: "productionFinishDate",
          label: this.$t("production.productionFinishDate"),
          align: "center",
          field: (row) =>
            date.formatDate(row.productionFinishDate, "YYYY-MM-DD HH:mm:ss"),
          sortable: true,
        },
        {
          name: "productionstatus",
          label: this.$t("production.productionstatus"),
          align: "center",
          field: (row) => row.productionOrderDetailStatus.name,
          sortable: true,
        },
        {
          name: "productiondetail",
          label: this.$t("production.productiondetail"),
          align: "center",
          field: (row) => row.detail,
          sortable: true,
        },
      ];
    },
  },
  async mounted() {
    document.title = "İş Emirleri - GTC";
    this.init();
  },
  methods: {
    async init() {
      this.getAuth();
      this.getProductionOrderDetailStatus();
    },

    async getAuth() {
      //TODO: listeyi yenilediğinde auth listesini sunucudan güncelle
      this.productionOrderDetailStatusesTree = [];
      this.$logger.log("getAuth => ");
      try {
        var auth = LocalStorage.getItem("authority");
        this.$logger.log("auth => ", auth);
        var authList = auth.authList.filter(
          (a) => a.authority.authorityId == 21
        );
        authList.forEach((a) => {
          this.productionOrderDetailStatusesTree.push(a.authority);
        });
        this.productionOrderDetailStatusesTree = _.sortBy(
          this.productionOrderDetailStatusesTree,
          ["id"]
        );
        setTimeout(() => this.$refs.producttree.expandAll(), 200);
        this.$logger.log(
          "productionOrderDetailStatuses => ",
          this.productionOrderDetailStatusesTree
        );
      } catch (error) {
        this.$logger.log("error => ", error);
      }
    },
    selectAllProcess(event) {
      if (event) {
        this.productionOrderDetailStatusesTree.forEach((p) => {
          this.ticked.push(p.id);
        });
        this.tickedNode();
      } else {
        this.ticked = [];
        this.tickedNode();
      }
      this.$logger.log("tickedList => ", this.tickedList);
    },
    async getProductionOrderDetail() {
      this.loading = true;
      try {
        this.rows = [];
        var idList = [];
        this.tickedList.forEach((tl) => {
          idList.push(tl.id);
        });
        this.$logger.log("idList", idList);
        const response = await this.$api.post(
          "getProductionOrderDetailListByProccesID",
          idList
        );
        this.rows = response?.data;

        this.$logger.log("rows: ", this.rows);
        this.loading = false;
      } catch (error) {
        this.$logger.log(error);
        this.loading = false;
      }
      this.loading = false;
    },

    onFormCompleted() {
      this.ProductionProcessesFormVisible = false;
      this.$logger.log("form completed");
      this.getProductionOrderDetail();
    },
    myFilterMethod(node, filter) {
      //this.$logger.log('node', node);
      //this.$logger.log('filter', filter);
      const filt = filter.toLowerCase();

      return node.name && node.name.toLowerCase().indexOf(filt) > -1;
    },

    async exportTable() {},
    onRowClick(evt, row) {
      //this.$logger.log('evt on', evt);
      //this.$logger.log("clicked on", row);
    },

    resetFilter() {
      this.filterTable = "";
      this.filterRef.focus();
    },
    tickedNode() {
      this.tickedList = [];
      this.$logger.log("node => ", this.ticked);
      this.$logger.log(
        "productionOrderDetailStatuses => ",
        this.productionOrderDetailStatuses
      );

      this.ticked.forEach((n) => {
        this.productionOrderDetailStatusesTree.forEach((pods) => {
          if (pods.authorityId == n) {
            if (
              this.tickedList.filter((tl) => {
                tl.id == pods.authorityId;
              }).length == 0
            ) {
              this.tickedList.push(
                this.productionOrderDetailStatuses.find(
                  (p) => p.name == pods.name
                )
              );
            }
          }
        });
      });

      this.tickedList = _.sortBy(this.tickedList, ["id"]);
      this.getProductionOrderDetail();

      this.$logger.log("tickedList => ", this.tickedList);
    },

    async getProductionOrderDetailStatus() {
      try {
        const response = await this.$api.get("productionOrderDetailStatuses");
        this.$logger.log("productionOrderDetailStatus => ", response?.data);
        this.productionOrderDetailStatuses = response?.data;
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async takeAction(productionOrder) {
      this.$logger.log(productionOrder);
      this.currentRow = productionOrder;
      this.processStatus = this.productionOrderDetailStatusesTree.find(
        (p) => (p.id = productionOrder.productionOrderDetailStatusId)
      );
      this.ProductionProcessesFormVisible = true;
    },
    async onAdd() {},

    async printTable() {},

    saveChanges() {},
  },
});
</script>
