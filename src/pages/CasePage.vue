<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div style="max-width: 100%; max-height: 100%">
    <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-splitter
        v-model="splitterModel"
        :limits="[30, 60]"
        style="max-width: 100%; max-height: 75%"
      >
        <template v-slot:before>
          <div class="q-pa-md">
            <q-table
              dense
              flat
              bordered
              :grid="isGrid"
              :hide-header="isGrid"
              class="statement-table"
              :rows="cases"
              :columns="casesColumns"
              :loading="casesLoading"
              :filter="filtercases"
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
                    {{ $t("finance.cashBox.cases") }}
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
                  />
                  <q-btn
                    flat
                    round
                    dense
                    icon="refresh"
                    class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                    @click="getList"
                  />
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
                  <q-space />
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
                            :color="
                              props.row.isActive === true ? 'green' : 'red'
                            "
                            text-color="white"
                            dense
                            class="text-weight-bolder"
                            square
                            >{{
                              props.row.isActive ? $t("active") : $t("inactive")
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
                                icon="mail"
                                :href="'mailto:' + props.row.email"
                              />
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
              :rows="cashTransactions"
              :columns="cashTransactionsColumns"
              :loading="cashTransactionsLoading"
              :filter="v"
              :loading-label="$t('loading')"
              :no-data-label="$t('cashBox.caseMovementNoData')"
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
                    v-model="filterRecipe"
                    :placeholder="$t('search')"
                  >
                    <template v-slot:append
                      ><q-icon
                        v-if="filterRecipe !== ''"
                        name="close"
                        @click="filterRecipe = ''"
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
                    class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
                    @click="onAdd"
                  >
                    <q-tooltip>
                      {{ $t("products.addproduct") }}
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    icon="refresh"
                    class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
                    @click="getRecipeContent()"
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
                </div>
              </template>

              <template #body-cell-warehouse="props">
                <q-td :props="props">
                  {{ props.row.warehouse.name }}
                  <q-btn
                    flat
                    round
                    icon="compare_arrows"
                    color="red-5"
                    @click="
                      changeWarehouse(props.row);
                      changeWarehouseFormVisibile = true;
                    "
                  >
                    <q-tooltip>
                      {{ $t("production.ChangeWarehouse") }}
                    </q-tooltip>
                  </q-btn>
                </q-td>
              </template>

              <template #body-cell-stockName="props">
                <q-td :props="props">
                  {{ props.row.insideStock.stockName }}
                  <q-btn
                    flat
                    round
                    :loading="changeProductButstonWait"
                    icon="compare_arrows"
                    color="red-5"
                    @click="changeProduct(props.row)"
                  >
                    <q-tooltip>
                      {{ $t("production.chooseequivalentproduct") }}
                    </q-tooltip>
                  </q-btn>
                </q-td>
              </template>

              <template #body-cell-action="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    color="secondary"
                    icon="edprecision_manufacturingit"
                  >
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item
                          clickable
                          @click="addProduction(props.row)"
                          v-close-popup
                        >
                          <q-icon
                            color="secondary"
                            size="2em"
                            name="switch_access_shortcut_add"
                          />
                          {{ $t("production.addtocurrentproduction") }}
                        </q-item>
                        <q-item
                          clickable
                          @click="createProduction(props.row)"
                          v-close-popup
                        >
                          <q-icon color="primary" size="2em" name="add" />
                          {{ $t("production.createnewproduction") }}
                        </q-item>
                      </q-list>
                    </q-menu>
                    <q-tooltip>
                      {{ $t("production.addtoproduction") }}
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete_forever"
                    @click="
                      productionOrderRecipeDeleteFormVisibile = true;
                      productionOrderRecipetobedeleted = props.row;
                    "
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
                                @click="onEdit(props.row)"
                              />
                              <q-btn
                                flat
                                round
                                color="negative"
                                icon="delete_forever"
                                @click="onDelete(props.row)"
                              />
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

              <template v-slot:no-data="{ icon, message, filterRecipe }">
                <div class="full-width row flex-center q-gutter-sm">
                  <q-icon
                    size="2em"
                    :name="filterRecipe ? 'filter_b_and_w' : icon"
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

  <div class="q-pa-md">
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
            <q-icon name="people" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("finance.cashBox.cases")
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
        <q-card-section style="max-height: 89vh" class="scroll q-pa-sm">
          <cash-box-form
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
import CashBoxForm from "src/components/forms/CashBoxForm.vue";
import exportFromJSON from "export-from-json";
import { Platform } from "quasar";

export default defineComponent({
  components: {
    CashBoxForm,
  },
  computed: {
    casesColumns() {
      return [
        {
          name: "name",
          label: this.$t("finance.cashBox.name"),
          align: "left",
          field: (row) => row.name,
          sortable: true,
        },
        {
          name: "firm",
          label: this.$t("finance.cashBox.type"),
          align: "left",
          field: (row) => row.type,
          sortable: true,
        },
        {
          name: "waybillDate",
          label: this.$t("finance.cashBox.balance"),
          align: "left",
          field: (row) => row.balance,
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
    cashTransactionsColumns() {
      return [
        {
          name: "waybillNo",
          label: this.$t("finance.waybillNo"),
          align: "left",
          field: (row) => row.name,
          sortable: true,
        },
        {
          name: "firm",
          label: this.$t("firm.firm"),
          align: "left",
          field: (row) => row.firm.commercialTitle,
          sortable: true,
        },
        {
          name: "waybillDate",
          label: this.$t("finance.waybillDate"),
          align: "left",
          field: (row) => row.waybillDate,
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
      cases: [],
      filtercases: "",
      casesLoading: true,
      cashTransactions: [],
      filtercashTransactions: "",
      cashTransactionsLoading: false,
      selectedId: 0,
      formVisible: false,
      deleteConfirm: false,
      currentMode: "add",
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      isGrid: false,
      splitterModel: 30,
      rows: [],
    };
  },
  async mounted() {
    this.init();
    document.title = "Magicline - Kasa ve Bankalar";
    this.getList();
  },
  methods: {
    init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onView(item) {
      this.$logger.log(firm);
      this.maximizedToggle = false;
      this.currentRow = item;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onEdit(item) {
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
      const fileName = "firmDetailList";
      const exportType = exportFromJSON.types.xls;
      exportFromJSON({ data, fileName, exportType });
    },

    async Delete() {
      try {
        this.$logger.log(this.currentRow.id);
        const response = await this.$api.delete(
          "firmDetailList/" + this.currentRow.id
        );
        this.getList();
        this.deleteConfirm = false;
        firm;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async getList() {
      try {
        const response = await this.$api.get("cashBoxes");
        this.cases = response?.data;
        this.$logger.log("cashBoxes", this.cases);
        this.casesLoading = false;
      } catch (error) {
        this.$logger.log(error);
      }
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
