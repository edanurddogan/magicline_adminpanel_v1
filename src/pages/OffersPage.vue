<script setup></script>
<template>
  <div id="divToHideFilter" v-show="!isPrinting" class="q-pa-md">
    <q-card>
      <q-list class="row">
        <q-item>
          <q-toggle
            size="lg"
            v-model="showAllValue"
            val="lg"
            label="Tüm Sipariş Detaylarını Göster"
            @update:model-value="showAll"
          />
        </q-item>
        <q-item>
          <q-select
            ref="selectProduct"
            dense
            options-dense
            outlined
            use-input
            transition-show="scale"
            transition-hide="scale"
            input-debounce="0"
            v-model="selectedStockCard"
            option-value="id"
            option-label="value"
            :label="$t('products.product')"
            @filter="filterProduct"
            :options="productsFiltered"
            @update:model-value="(val) => offersFilter()"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("noresults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item>
        <q-item>
          <q-select
            ref="selectOrderStatus"
            outlined
            use-input
            dense
            options-dense
            transition-show="scale"
            transition-hide="scale"
            input-debounce="0"
            v-model="selectedOfferStatus"
            multiple
            option-label="name"
            :display-value="$t('order.status')"
            emit-value
            map-options
            options-cover
            :options="offerStatusFull"
            @update:model-value="(val) => offersFilter()"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("noresults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item>
        <q-item>
          <q-select
            ref="selectOrderColumn"
            v-model="visibleOrderColumns"
            multiple
            outlined
            dense
            options-dense
            :display-value="$t('order.orderColumn')"
            emit-value
            map-options
            :options="authColumns"
            option-value="name"
            options-cover
            @update:model-value="(val) => visibleOrderColumnsUpdate()"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("noresults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item>
        <q-item>
          <q-select
            ref="selectOrderColumn"
            v-model="visibleOrderDetailColumns"
            multiple
            outlined
            dense
            options-dense
            :display-value="$t('order.orderDetailColumn')"
            emit-value
            map-options
            :options="authColumnsDetail"
            option-value="name"
            options-cover
            @update:model-value="(val) => visibleOrderDetailColumnsUpdate()"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("noresults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item>
        <q-item>
          <q-toggle v-model="tableDense" label="Tabloyu Daralt" />
        </q-item>
      </q-list>
    </q-card>
  </div>
  <div class="q-pa-md">
    <q-pull-to-refresh @refresh="getList" bg-color="black" icon="autorenew">
      <q-table
        class="my-sticky-column-table statement-table"
        flat
        :dense="tableDense"
        bordered
        :grid="isGrid"
        :hide-header="isGrid"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :filter="filter"
        :pagination="pagination"
        :virtual-scroll-sticky-size-start="48"
        :loading-label="$t('loading')"
        :no-data-label="$t('nodatalabel')"
        :no-results-label="$t('noresultslabel')"
        row-key="id"
        :visible-columns="visibleOrderColumns"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-if="false" auto-width> Detay </q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:top="props">
          <div id="divToHide" v-if="!isPrinting" class="col-12">
            <q-list class="row">
              <div class="col-lg-2 col-md-6 col-sm-6 col-xs-6 q-table__title">
                {{
                  offerType == 0
                    ? $t("pages.purchaseOffers")
                    : offerType == 1
                    ? $t("pages.sellOffers")
                    : ""
                }}
              </div>
              <q-input
                class="col-lg-2 col-md-4 col-sm-6 col-xs-6"
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
                <q-tooltip v-close-popup>{{
                  isGrid ? "List" : "Grid"
                }}</q-tooltip>
              </q-btn>
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

              <q-btn
                :label="$t('print')"
                class="q-ml-md float-right text-capitalize text-indigo-8 shadow-2 col-lg-1 col-md-1 col-sm-3 col-xs-3"
                icon="print"
                @click="printTable"
              >
                <q-tooltip>
                  {{ $t("print") }}
                </q-tooltip>
              </q-btn>
            </q-list>
          </div>
        </template>

        <template v-slot:body="props">
          <q-tr
            :props="props"
            @click="props.row.expand = !props.row.expand"
            @dblclick="onRowDoubleClick(props.row)"
          >
            <q-td v-if="false" auto-width>
              <q-btn
                size="sm"
                color="green"
                round
                dense
                @click="onRowClick"
                :icon="props.row.expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name == 'buysell'">
                <q-icon
                  v-if="offerType"
                  :name="
                    offerType == 1
                      ? 'arrow_upward'
                      : offerType == '0'
                      ? 'arrow_downward'
                      : ''
                  "
                  :style="{
                    color:
                      offerType == 1
                        ? '#24792E'
                        : offerType == '0'
                        ? '#FF7100'
                        : '#fff',
                  }"
                  style="font-size: 1.6em"
                />
                {{ offerType == 1 ? $t("pages.sales") : $t("pages.purchase") }}
              </div>
              <div v-else-if="col.name == 'status'">
                <q-badge :color="props.row.isActive ? 'green' : 'red'">
                  {{ props.row.isActive ? $t("active") : $t("inactive") }}
                </q-badge>
              </div>
              <div v-else-if="col.name == 'title'">
                {{
                  props.row.title
                    ? props.row.title.length > 15
                      ? props.row.title.substring(0, 15) + "..."
                      : props.row.title
                    : ""
                }}
                <q-tooltip style="max-width: 400px" class="text-body2">
                  {{ props.row.title }}
                </q-tooltip>
              </div>
              <div v-else-if="col.name == 'firm'">
                {{
                  props.row.firm.name
                    ? props.row.firm.name.length > 20
                      ? props.row.firm.name.substring(0, 20) + "..."
                      : props.row.firm.name
                    : ""
                }}
                <q-tooltip style="max-width: 400px" class="text-body2">
                  {{ props.row.firm.name }}
                </q-tooltip>
              </div>
              <div v-else-if="col.name == 'offerstatuscolumn'">
                <q-badge
                  :color="props.row.offerStatus.color"
                  dense
                  class="text-weight-bolder"
                  square
                >
                  <span class="text-white">
                    {{ props.row.offerStatus.status }}</span
                  >
                </q-badge>
              </div>
              <div v-else-if="col.name == 'action'">
                <!--<q-btn
                  flat
                  round
                  color="primary"
                  icon="info"
                  @click="onView(props.row)"
                />-->
                <q-btn
                  flat
                  round
                  color="secondary"
                  icon="edit"
                  :size="tableDense ? 'xs' : 'md'"
                  @click="onEdit(props.row)"
                />
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete_forever"
                  :size="tableDense ? 'xs' : 'md'"
                  @click="onDelete(props.row)"
                />
              </div>

              <div v-else>
                {{ col.value }}
              </div>
              <!--{{ col.value }}-->
            </q-td>
          </q-tr>
          <q-tr v-show="props.row.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <!--{{ props.row.order.firm.name }} -
                {{ props.row.order.orderNo }} Siparişi detayları-->
                <q-table
                  flat
                  :dense="tableDense"
                  hide-bottom
                  bordered
                  :grid="isGrid"
                  :hide-header="isGrid"
                  class="statement-table"
                  :rows="props.row.offerItems"
                  :columns="columnsDetails"
                  :loading="loading"
                  :pagination="pagination"
                  :virtual-scroll-sticky-size-start="48"
                  :loading-label="$t('loading')"
                  :no-data-label="$t('nodatalabel')"
                  :no-results-label="$t('noresultslabel')"
                  row-key="id"
                  @row-click="onRowDetailClick"
                  :visible-columns="visibleOrderDetailColumns"
                >
                </q-table>
              </div>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:no-data="{ icon, message, filter }">
          <div class="full-width row flex-center q-gutter-sm">
            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
            <span> {{ message }}... </span>
          </div>
        </template>
      </q-table>
    </q-pull-to-refresh>

    <!-- Offer Form Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 80vw; max-height: 95vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("offer.offer") }}</span>
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
          <offer-form
            class="q-ma-none q-pa-none"
            v-model="currentRow"
            :mode="currentMode"
            @completed="onFormCompleted"
            @offerListRefresh="getList"
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
          <h5>{{ $t("order.deleteconfirm") }}</h5>
        </q-card-section>
        <q-card-section class="items-center row">
          <p>
            "{{ currentRow.offerNo }} - {{ currentRow.firm.name }} -
            {{ currentRow.title }}"
            {{ $t("order.deleteMessage") }}
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
import OfferForm from "src/components/forms/OfferForm.vue";
import exportFromJSON from "export-from-json";
import { Platform, date, LocalStorage } from "quasar";
import numeral from "numeral";
import QRCode from "qrcode-generator";
import "numeral/locales/tr";
import "numeral/locales/en-au";
import "numeral/locales/de";
import { useLayoutStore } from "src/stores/layout";
const layoutStore = useLayoutStore();

export default defineComponent({
  components: {
    OfferForm,
  },
  setup(props, { emit }) {},
  created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        this.offerType = toParams.offerType;
        if (
          this.offerType == 0 ||
          this.offerType == 1 ||
          this.offerType == 2 ||
          this.offerType == 3
        ) {
          this.getList();
        }
      }
    );
  },
  computed: {
    columns() {
      return [
        {
          name: "firm",
          label: this.$t("firm.firm"),
          align: "left",
          field: (row) => row.firm.name,
          sortable: true,
          auth: false,
        },
        {
          name: "title",
          label: this.$t("order.title"),
          align: "left",
          field: (row) => row.title,
          sortable: true,
          auth: false,
        },
        {
          name: "employee",
          label: this.$t("users.employee"),
          align: "left",
          field: (row) => row.employee.name,
          sortable: true,
          auth: false,
        },
        {
          name: "offerNo",
          label: this.$t("offer.offerNo"),
          align: "left",
          field: (row) => row.offerNo,
          sortable: true,
          auth: false,
        },
        /*{
          name: "buysell",
          label: this.$t("order.buysell"),
          align: "left",
          field: (row) => row.order.offerType,
          sortable: true,
        },*/
        {
          name: "offerDate",
          label: this.$t("offer.offerDate"),
          align: "left",
          format: (val) => date.formatDate(val, "DD.MM.YYYY"),
          field: (row) => row.offerDate,
          sortable: true,
          auth: false,
        },
        {
          name: "expiryDate",
          label: this.$t("offer.expiryDate"),
          align: "left",
          format: (val) => date.formatDate(val, "DD.MM.YYYY"),
          field: (row) => row.expiryDate,
          sortable: true,
          auth: false,
        },
        {
          name: "deadline",
          label: this.$t("offer.deadline"),
          align: "left",
          format: (val) => date.formatDate(val, "DD.MM.YYYY"),
          field: (row) => row.dispatchDate,
          sortable: true,
          auth: false,
        },
        {
          name: "subtotal",
          label: this.$t("order.subtotal"),
          align: "right",
          field: (row) => `${numeral(row.subTotal).format("0,0[.]00 ")} 
          ${row.currency.symbol}`,
          sortable: true,
          auth: true,
        },
        {
          name: "grandtotal",
          label: this.$t("order.grandtotal"),
          align: "right",
          field: (row) => `${numeral(row.grandTotal).format("0,0[.]00 ")} 
          ${row.currency.symbol}`,
          sortable: true,
          auth: true,
        },
        {
          name: "description",
          label: this.$t("description"),
          align: "left",
          field: (row) => row.description,
          sortable: true,
          auth: false,
        },
        {
          name: "offerstatuscolumn",
          label: this.$t("order.status"),
          align: "left",
          field: (row) => row.offerStatus.status,
          sortable: true,
          auth: false,
        },
        {
          name: "action",
          align: "center",
          label: this.$t("action"),
          field: "",
          auth: false,
        },
      ];
    },
    columnsDetails() {
      return [
        {
          name: "stockcode",
          label: this.$t("products.stockcode"),
          align: "left",
          field: (row) => row.stockCard.stockCode,
          sortable: true,
          auth: false,
        },
        {
          name: "productname",
          label: this.$t("products.productname"),
          align: "left",
          field: (row) => row.stockCard.stockName,
          sortable: true,
          auth: false,
        },
        {
          name: "serialNos",
          label: this.$t("products.serialNo"),
          align: "left",
          field: (row) => row.stockSerialNo?.serialNo,
          sortable: true,
          auth: false,
        },
        {
          name: "piece",
          label: this.$t("products.piece"),
          align: "center",
          field: (row) => row.quantity,
          sortable: true,
          auth: false,
        },
        {
          name: "shippedQuantity",
          label: this.$t("products.shippedQuantity"),
          align: "center",
          field: (row) => row.shippedQuantity,
          sortable: true,
          auth: false,
        },
        {
          name: "price",
          label: this.$t("products.price"),
          align: "center",
          field: (row) => numeral(row.price).format("0,0[.]00 $"), // + " " + row.stockCard.currency.symbol,
          sortable: true,
          auth: true,
        },
        {
          name: "discount",
          label: this.$t("order.orderDiscount"),
          align: "center",
          field: (row) => row.discount, // + " " + row.stockCard.currency.symbol,
          sortable: true,
          auth: true,
        },
        {
          name: "discountpercent",
          label: this.$t("order.discountpercent"),
          align: "center",
          field: (row) => row.discountPercent + " %",
          sortable: true,
          auth: true,
        },
        {
          name: "unitamount",
          label: this.$t("order.unitamount"),
          align: "center",
          field: (row) => numeral(row.unitAmount).format("0,0[.]00 $"), // + " " + row.stockCard.currency.symbol,
          sortable: true,
          auth: true,
        },
        {
          name: "vatrate",
          label: this.$t("order.vatrate"),
          align: "center",
          field: (row) => row.vatRate + " %",
          sortable: true,
          auth: true,
        },
        {
          name: "total",
          label: this.$t("order.subtotal"),
          align: "center",
          field: (row) =>
            numeral(row.unitAmount * row.quantity).format("0,0[.]00 $"),
          sortable: true,
          auth: true,
        },
        {
          name: "description",
          label: this.$t("description"),
          align: "left",
          field: (row) => row.description,
          sortable: true,
          auth: false,
        },
      ];
    },
  },
  data() {
    return {
      //onRowClick: (row) => alert(`${row.order.orderNo} clicked`),
      productsFull: [],
      productsFiltered: [],
      offerStatusFull: [],
      filteredOffers: [],
      selectedStockCard: { id: 0, value: "Seçim yapın" },
      selectedOfferStatus: [{ id: 0, status: "Seçim yapın" }],
      offerType: null,
      loading: true,
      rows: [],
      offers: [],
      selectedId: 0,
      formVisible: false,
      deleteConfirm: false,
      currentMode: "add",
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      filterItem: "",
      isGrid: false,
      showAllValue: false,
      pagination: {
        rowsPerPage: 20,
      },

      waybillForm: false,
      waybillSelectForm: false,
      eDocumentShowForm: false,
      selectedRow: {},
      decodedData: "",
      dynamicIframe: "",
      AddSerialNoFormVisible: false,

      isPrinting: false,
      tableDense: false,
      visibleOrderColumns: [], // this.columns.map((c) => c.name),
      visibleOrderDetailColumns: [], // this.columnsDetails.map((c) => c.name),

      userinfo: {},
      authColumns: [],
      authColumnsDetail: [],
    };
  },
  async beforeUnmount() {
    // Olay dinleyicileri temizle
    window.removeEventListener("beforeprint", this.beforePrint);
    window.removeEventListener("afterprint", this.afterPrint);
  },
  emits: ["leftMenuClose", "leftMenuOpen"],
  async mounted() {
    this.offerType = this.$route.params.offerType;
    this.init();
    document.title = `Magicline - ${this.$t("pages.orders")}`;
    this.$q.loading.hide();
    window.addEventListener("beforeprint", this.beforePrint);
    window.addEventListener("afterprint", this.afterPrint);
  },
  methods: {
    init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
      try {
        var sos = LocalStorage.getItem("selectedOfferStatus");
        this.$logger.log("selectedOfferStatus ls", sos);
        if (sos) this.selectedOfferStatus = sos;
      } catch (error) {}

      //this.getList();
      this.getOfferStatus();
      //this.getVisibleColumn();
    },

    async getVisibleColumn() {
      this.userinfo = LocalStorage.getItem("userinfo");
      this.$logger.log("user info", this.userinfo);

      try {
        if (
          this.userinfo.employeeGroup.id == 5 ||
          this.userinfo.employeeGroup.id == 9
        ) {
          this.columns.map((c) => {
            if (c.auth == false) this.authColumns.push(c);
          });
          this.columnsDetails.map((c) => {
            if (c.auth == false) this.authColumnsDetail.push(c);
          });

          this.visibleOrderColumns = this.authColumns.map((vc) => {
            var authColumn = this.columns.find((c) => c.name == vc.name);
            if (authColumn) return vc;
          });

          this.visibleOrderDetailColumns = this.authColumnsDetail.map((vc) => {
            var authColumn = this.columnsDetails.find((c) => c.name == vc.name);
            if (authColumn) return vc;
          });
          //visibleOrderDetailColumns;
        } else {
          this.authColumns = this.columns;
          this.authColumnsDetail = this.columnsDetails;

          this.visibleOrderColumns = this.authColumn.map((vc) => vc.name);

          this.visibleOrderDetailColumns = this.authColumnsDetail.map(
            (vc) => vc.name
          );
        }
      } catch (error) {}

      try {
        this.visibleOrderColumns = LocalStorage.getItem("visibleOrderColumns");
        if (!this.visibleOrderColumns)
          this.visibleOrderColumns = this.authColumns.map((c) => c.name);
      } catch (error) {
        this.visibleOrderColumns = this.authColumns.map((c) => c.name);
      }
      try {
        this.visibleOrderDetailColumns = LocalStorage.getItem(
          "visibleOrderDetailColumns"
        );
        if (!this.visibleOrderDetailColumns)
          this.visibleOrderDetailColumns = this.authColumnsDetail.map(
            (c) => c.name
          );
      } catch (error) {
        this.visibleOrderDetailColumns = this.authColumnsDetail.map(
          (c) => c.name
        );
      }
    },

    onRowDoubleClick(row) {
      //this.$logger.log("onRowDoubleClick", row);

      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onRowClick(row) {
      //this.$logger.log("onRowClick", row);
    },
    onRowDetailClick(evt, row) {
      //this.$logger.log("onRowClick", row);
    },
    valueSelected(details) {
      //this.$logger.log("valueSelected", details);
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onView(row) {
      this.$logger.log(row);
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onEdit(row) {
      this.$logger.log("onEdit", row);
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onDelete(row) {
      this.currentRow = row;
      this.deleteConfirm = true;
    },
    onFormCompleted() {
      this.formVisible = false;
      this.$logger.log("form completed");
      this.getList();
    },
    exportTable() {
      const data = this.rows;
      const fileName = "OrderList";
      const exportType = exportFromJSON.types.xls;

      exportFromJSON({ data, fileName, exportType });
    },
    async printTable() {
      this.isPrinting = true;
      this.tableDense = true;
      layoutStore.showHeader().then(() => {
        layoutStore.closeLeftDrawer().then(() => {
          layoutStore.hideFooter().then(() => {
            window.print();
          });
        });
      });
    },

    async beforePrint() {},
    async afterPrint() {
      this.isPrinting = false;
      this.tableDense = false;
      layoutStore.showHeader().then(() => {
        layoutStore.openLeftDrawer().then(() => {});
      });
    },

    async Delete() {
      try {
        this.currentRow.isActive = false;
        const response = await this.$api.put("offers/", this.currentRow);

        this.getList();
        this.deleteConfirm = false;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getOfferStatus() {
      const response = this.$api.get("offerStatuses").then((data) => {
        this.offerStatusFull = data.data.sort(
          (a, b) => a.sequence - b.sequence
        );
        this.$logger.log("offerStatusFull", this.offerStatusFull);
      });
    },
    async getList() {
      //try {
      //  this.loading = true;
      //  const response = await this.$api.get(
      //    "getOfferList/" + this.offerType + "/999/1"
      //  );
      //  this.rows = response?.data;
      //  this.offers = response?.data;
      //  this.$logger.log("getOfferList", response?.data.slice(0, 10));
      //  //this.offersFilter();
      //  this.loading = false;
      //} catch (error) {
      //  this.$logger.error("getList", error);
      //  this.loading = false;
      //}
    },

    showAll(value, evt) {
      this.rows.map((r) => {
        r.expand = value;
        return r;
      });
    },
    offersFilter() {
      try {
        this.filteredOffers = [];
        if (this.selectedStockCard && this.selectedStockCard?.id > 0) {
          this.orders.forEach((order) => {
            const matchingOrderItems = order.orderItems.filter(
              (orderItem) => orderItem.stockCardId === this.selectedStockCard.id
            );
            if (matchingOrderItems.length > 0) {
              // Sadece val.id ile eşleşen bir orderItem varsa, order'ı filtrelenmiş order listesine ekleyin
              this.filteredOrders.push(order);
            }
          });
        } else {
          this.filteredOffers = this.offers;
        }
        var _selectedOfferStatus = this.selectedOfferStatus.filter(
          (sos) => sos.id != 0
        );
        if (_selectedOfferStatus.length > 0) {
          this.filteredOffers = this.filteredOffers.filter((offer) => {
            return _selectedOfferStatus.some(
              (sos) => sos.id === offer.offerStatusId
            );
          });
        }

        LocalStorage.set("selectedOfferStatus", _selectedOfferStatus);
        //this.$logger.error("selectedOrderStatus", _selectedOrderStatus);

        this.rows = this.filteredOffers;
        //this.$logger.error("this.rows", this.rows);
        //this.$logger.error("filteredOrders", this.filteredOrders);
      } catch (error) {
        this.$logger.error("ordersFilter", error);
      }
    },
    async visibleOrderColumnsUpdate() {
      LocalStorage.set("visibleOrderColumns", this.visibleOrderColumns);
    },
    async visibleOrderDetailColumnsUpdate() {
      LocalStorage.set(
        "visibleOrderDetailColumns",
        this.visibleOrderDetailColumns
      );
    },
    async getProduct() {
      const response = this.$api.get("stockCards").then((data) => {
        this.$logger.log(data.data);
        this.productsFull = data.data.map((p) => {
          p.value = `${p.stockCode} - ${p.stockName}`;
          return p;
        });
      });
    },

    async filterProduct(val, update) {
      /*if (val.length < 3) {
    return;
  }*/

      update(() => {
        try {
          var body = { letters: val };
          //this.$logger.log("body", body);
          const response = this.$api
            .put("searchStockCards/", body)
            .then((data) => {
              var products = data.data.map((p) => {
                p.value = `${p.stockCode} - ${p.stockName}`;
                return p;
              });
              this.productsFiltered = products;
              this.$logger.log("productsFiltered", this.productsFiltered);
            })
            .catch((err) => this.$logger.log());
        } catch (error) {}
      });
    },
    showEDocument(row, documentType) {
      if (row[documentType].length > 1) {
        this.maximizedToggle = false;
        this.currentRow = row;
        this.waybillSelectForm = true;
      } else if (row[documentType].length == 1) {
        this.eDocumentShowForm = true;
        if (documentType == "invoices") {
          this.getInvoiceHtml(row.invoices[0].erpInvoiceId);
        } else {
          this.getWaybillHtml(row.waybills[0].erpWaybillId);
        }
      }
    },

    async getWaybillHtml(erpWaybillId) {
      this.eDocumentShowForm = true;
      const response = this.$api
        .get(`getWaybillHtml/${erpWaybillId}`)
        .then((response) => {
          this.decodedData = response.data;
          //this.$logger.log("dynamicIframe", this.decodedData);
          this.$refs.dynamicIframe.contentDocument.body.innerHTML =
            this.decodedData;

          const qrValueDiv =
            this.$refs.dynamicIframe.contentDocument.getElementById("qrvalue");
          //this.$logger.log("qrValueDiv", qrValueDiv.textContent);
          this.generateQRCode(qrValueDiv.textContent);
        })
        .catch((error) => {
          this.$logger.log("getWaybillHtml Error");
        });
    },

    async getInvoiceHtml(erpInvoiceId) {
      this.eDocumentShowForm = true;
      const response = this.$api
        .get(`getInvoiceHtml/${erpInvoiceId}`)
        .then((response) => {
          this.decodedData = response.data;
          //this.$logger.log("dynamicIframe", this.decodedData);
          this.$refs.dynamicIframe.contentDocument.body.innerHTML =
            this.decodedData;

          const qrValueDiv =
            this.$refs.dynamicIframe.contentDocument.getElementById("qrvalue");
          //this.$logger.log("qrValueDiv", qrValueDiv.textContent);
          this.generateQRCode(qrValueDiv.textContent);
        })
        .catch((error) => {
          this.$logger.log("getWaybillHtml Error");
        });
    },
    generateQRCode(text) {
      // QR kodu oluşturucu nesnesini oluştur
      const qr = QRCode(0, "M");
      qr.addData(text);
      qr.make();

      // Oluşturulan QR kodunu bir img elementine yerleştir
      var qrCodeElement = qr.createImgTag(2); // Boyut: 4
      this.$refs.dynamicIframe.contentDocument.getElementById(
        "qrcode"
      ).innerHTML = qrCodeElement;
    },
  },
});
</script>
<style lang="sass">
.my-sticky-column-table
  /* specifying max-width so the example can
   highlight the sticky column on any browser window */
  //max-width: 600px

  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>
