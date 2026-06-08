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
      class="my-sticky-header-table"
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
    >
      <!--<template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="green"
                round
                dense
                @click="
                  (props.row.expand = !props.row.expand),
                    getDetails(props.row.expand, props.row.order.id)
                "
                :icon="props.row.expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.row.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                Sipariş Detayı ({{ props.row.order.orderNo }} -
                {{ props.row.order.firm.name }})
                <q-table
                  flat
                  bordered
                  :grid="isGrid"
                  :hide-header="isGrid"
                  class="statement-table"
                  :rows="props.row.orderItems"
                  :columns="columnsDetails"
                  :loading="loading"
                  :filter="filter"
                  :pagination="pagination"
                  :rows-per-page-options="[50]"
                  :virtual-scroll-sticky-size-start="48"
                  :loading-label="$t('loading')"
                  :no-data-label="$t('nodatalabel')"
                  :no-results-label="$t('noresultslabel')"
                  row-key="id"
                >
                </q-table>
              </div>
            </q-td>
          </q-tr>
        </template>-->

      <template v-slot:top="props">
        <div class="row col-12">
          <div
            class="col-lg-9 col-md-9 col-sm-12 col-xs-12 q-table__title"
            v-if="rows[0]"
          >
            {{ rows[0].UNVANI }}
          </div>
          <q-space />
          <!--<q-input
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
            </q-btn>-->
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
          <!--<q-space />
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
            </q-btn>-->
        </div>
      </template>

      <template #body-cell-orderstatus="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.order.orderStatus.color"
            text-color="white"
            dense
            class="text-weight-bolder"
            square
            >{{ props.row.order.orderStatus.status }}
          </q-chip>
        </q-td>
      </template>

      <!--<template #body-cell-grandtotal="props">
        {{ currency(props.row.order.grandTotal) }}
      </template>-->

      <template #body-cell-buysell="props">
        <q-td :props="props">
          <q-icon
            v-if="orderType"
            :name="
              orderType == 1
                ? 'arrow_upward'
                : orderType == '0'
                ? 'arrow_downward'
                : ''
            "
            :style="{
              color:
                orderType == 1
                  ? '#24792E'
                  : orderType == '0'
                  ? '#FF7100'
                  : '#fff',
            }"
            style="font-size: 1.6em"
          />
          {{ orderType == 1 ? $t("pages.sales") : $t("pages.purchase") }}
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <!--<q-chip
              :color="props.row.order.isActive === true ? 'green' : 'red'"
              text-color="white"
              dense
              class="text-weight-bolder"
              square
              >{{ props.row.order.isActive ? $t("active") : $t("inactive") }}
            </q-chip>-->
        </q-td>
      </template>

      <template #body-cell-invoiceWaybill="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="teal-14"
            icon="local_shipping"
            :disable="props.row.email"
            @click="onView(props.row)"
          >
            <!--:icon="props.row.email ? 'local_shipping' : ''"-->
            <q-tooltip>İrsaliye No</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="teal-14"
            icon="text_snippet"
            :disable="props.row.email"
            @click="onEdit(props.row)"
          >
            <q-tooltip>Fatura No</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template #body-cell-action="props">
        <q-td :props="props">
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
                    :color="props.row.order.isActive === true ? 'green' : 'red'"
                    text-color="white"
                    dense
                    class="text-weight-bolder"
                    square
                    >{{
                      props.row.order.isActive ? $t("active") : $t("inactive")
                    }}
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

                  <q-item-section
                    v-else-if="col.name === 'buysell'"
                    class="row"
                  >
                    <div class="row">
                      <q-icon
                        v-if="orderType"
                        :name="
                          orderType == 1
                            ? 'arrow_upward'
                            : orderType == '0'
                            ? 'arrow_downward'
                            : ''
                        "
                        :style="{
                          color:
                            orderType == 1
                              ? '#24792E'
                              : orderType == '0'
                              ? '#FF7100'
                              : '#fff',
                        }"
                        style="font-size: 1.6em"
                      />
                      {{
                        orderType == 1
                          ? $t("pages.sales")
                          : $t("pages.purchase")
                      }}
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
      <q-card style="min-width: 80vw; max-height: 95vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("order.order") }}</span>
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
          <order-form
            class="q-ma-none q-pa-none"
            v-model="currentRow"
            :mode="currentMode"
            @completed="onFormCompleted"
            @orderListRefresh="getList"
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
            "{{ currentRow.orderNo }} - {{ currentRow.order.firm.name }} -
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
import OrderForm from "src/components/forms/OrderForm.vue";
import exportFromJSON from "export-from-json";
import { Platform } from "quasar";
import { date } from "quasar";
import numeral from "numeral";
import "numeral/locales/tr";
import "numeral/locales/en-au";
import "numeral/locales/de";

export default defineComponent({
  components: {
    OrderForm,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
  },
  created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        this.orderType = toParams.orderType;
        if (this.orderType == 1 || this.orderType == 0) this.getList();
      }
    );
  },
  computed: {
    columns() {
      return [
        {
          name: "type",
          label: this.$t("firm.paymenttype"),
          align: "left",
          field: (row) => row.HAREKETTIPI,
          sortable: true,
        },
        {
          name: "orderdate",
          label: this.$t("date"),
          align: "left",
          field: (row) => date.formatDate(row.TARIH, "DD.MM.YYYY"),
          sortable: true,
        },
        {
          name: "cuurencyRate",
          label: this.$t("order.exchangerate"),
          align: "right",
          field: (row) => row.currencyRate /*this.getCurrency(row.TARIH) */,
          sortable: true,
        },
        {
          name: "debit",
          label: this.$t("finance.debit") + " (₺)",
          align: "right",
          field: (row) => row.BA_TOPLAM_TL, //this.priceCalc(row.BA_TOPLAM_TL),
          sortable: true,
        },
        {
          name: "debit",
          label: this.$t("finance.debit") + " ($)",
          align: "right",
          field: (row) => row.BA_TOPLAM, //this.priceCalc(row.BA_TOPLAM),
          sortable: true,
        },
        {
          name: "credit",
          label: this.$t("finance.credit") + " (₺)",
          align: "right",
          field: (row) => row.BS_TOPLAM_TL, //this.priceCalc(row.BS_TOPLAM_TL),
          sortable: true,
        },
        {
          name: "credit",
          label: this.$t("finance.credit") + " ($)",
          align: "right",
          field: (row) => row.BS_TOPLAM, //this.priceCalc(row.BS_TOPLAM),
          sortable: true,
        },
        {
          name: "credit",
          label: this.$t("finance.cashBox.balance") + " (₺)",
          align: "right",
          field: (row) => row.balance_TL, //this.priceCalc(row.balance_TL),
          sortable: true,
        },
        {
          name: "credit",
          label: this.$t("finance.cashBox.balance") + " ($)",
          align: "right",
          field: (row) => row.balance, //this.priceCalc(row.balance),
          sortable: true,
        },

        /*{
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
        },*/
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
        },
        {
          name: "productname",
          label: this.$t("products.productname"),
          align: "left",
          field: (row) => row.stockCard.stockName,
          sortable: true,
        },
        {
          name: "piece",
          label: this.$t("products.piece"),
          align: "center",
          field: (row) => row.quantity,
          sortable: true,
        },
        /*{
          name: "price",
          label: this.$t("products.price"),
          align: "center",
          field: (row) => row.price + " " + row.stockCard.currency.symbol,
          sortable: true,
        },
        {
          name: "discount",
          label: this.$t("order.orderDiscount"),
          align: "center",
          field: (row) => row.discount + " " + row.stockCard.currency.symbol,
          sortable: true,
        },
        {
          name: "discountpercent",
          label: this.$t("order.discountpercent"),
          align: "center",
          field: (row) => row.discountPercent + " %",
          sortable: true,
        },
        {
          name: "unitamount",
          label: this.$t("order.unitamount"),
          align: "center",
          field: (row) => row.unitAmount + " " + row.stockCard.currency.symbol,
          sortable: true,
        },
        {
          name: "vatrate",
          label: this.$t("order.vatrate"),
          align: "center",
          field: (row) => row.stockCard.vatRate + " %",
          sortable: true,
        },
        {
          name: "total",
          label: this.$t("order.subtotal"),
          align: "center",
          field: (row) =>
            row.unitAmount * row.quantity + " " + row.stockCard.currency.symbol,
          sortable: true,
        },*/
      ];
    },
  },
  data() {
    return {
      orderType: null,
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
        rowsPerPage: 50,
      },
    };
  },
  async mounted() {
    this.orderType = this.$route.params.orderType;
    this.init();
    this.$q.loading.hide();
  },
  methods: {
    init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
      this.getList();
    },
    async getDetails(expand, id) {
      //this.$logger.log("this.rows => ", this.rows.length);
      //this.$logger.log("getDetails => ", id);
      if (!expand) return;
      if (id) {
        this.loading = true;
        var _orderItems = await this.$api
          .get("getOrderItems/" + id)
          .then((resp) => {
            //this.detailsRows = resp?.data;
            /*var orderIndex = this.rows.findIndex((item) => {
              return item.order.id === id;
            });*/
            //this.$logger.log("orderIndex => ", orderIndex);
            //this.rows[orderIndex].orderItems = resp?.data;
            this.loading = false;
            //this.$logger.log("detailsRows : ", this.rows[orderIndex]);
          });
      }
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onView(product) {
      this.$logger.log(product);
      this.maximizedToggle = false;
      this.currentRow = product;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onEdit(product) {
      this.maximizedToggle = false;
      this.currentRow = product;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onDelete(product) {
      this.currentRow = product;
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
    async refresh(done) {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "getOrderList/" + this.orderType + "/99/1"
        );
        this.rows = response?.data;

        this.$logger.log("getOrderList", this.rows);
        this.loading = false;
        done();
      } catch (error) {
        this.$logger.log(error);
      }
    },
    parseDate(date) {
      //this.$logger.log("date", date);
      var parcalar = date.split(".");
      var day = parcalar[0]; // Gün kısmını alır ve ondalık sayıya çevirir
      var month = parcalar[1]; // Ay kısmını alır ve ondalık sayıya çevirir
      var year = parcalar[2]; // Yıl kısmını alır ve ondalık sayıya çevirir

      return { day, month, year };
    },

    async getList() {
      try {
        this.$logger.log("getList =>");
        this.loading = true;
        const response = await this.$api.get("getAccountStatement/");
        var _rows = response?.data; /*.slice(0, 50)*/
        this.rows = _rows.map((x) => ({
          ...x,
          currencyRate: 0,
          BA_TOPLAM_TL: 0,
          BS_TOPLAM_TL: 0,
          balance: 0,
          balance_TL: 0,
          //BA_TOPLAM: 0, // x.PARAKODU === 1 ? 10 : 20, // Bu kısmı anlamadım, düzeltmek isterseniz
        }));

        // Kur hesaplamalarını eşzamanlı olarak yap
        this.$logger.log("getCurrency =>");
        await Promise.all(
          this.rows.map((x) => this.getCurrency(x.SRN, x.TARIH))
        );

        // Balance değerlerini hesapla
        this.$logger.log("calculateBalances =>");
        this.calculateBalances();

        this.loading = false;
      } catch (error) {
        this.$logger.error(error);
      }
    },

    async getCurrency(id, currDate) {
      try {
        var curr = { shortName: "USD" };
        const data = this.parseDate(date.formatDate(currDate, "DD.MM.YYYY"));
        const body = { ...data, exchangeRate: curr };
        const result = await this.$api.post("getExchangeWithCurrency", body);
        if (result?.data?.BanknoteSelling) {
          var rowIndex = this.rows.findIndex((x) => x.SRN === id);
          var exRate = result?.data?.BanknoteSelling;
          this.rows[rowIndex].currencyRate = exRate;
          this.rows[rowIndex].BA_TOPLAM_TL =
            this.rows[rowIndex].BA_TOPLAM / exRate;
          this.rows[rowIndex].BS_TOPLAM_TL =
            this.rows[rowIndex].BS_TOPLAM / exRate;
        }
      } catch (error) {
        this.$logger.error("date error =>", currDate, error);
        this.getCurrency(id, currDate.setDate(currDate.getDate() - 1));
        var rowIndex = this.rows.findIndex((x) => x.SRN === id);
        this.rows[rowIndex].currencyRate = 0;
      }
    },

    calculateBalances() {
      for (let i = 0; i < this.rows.length; i++) {
        var prevBalance = 0;
        if (i > 0) {
          prevBalance = this.rows[i - 1].balance_TL;
        }

        if (this.rows[i].BA_TOPLAM_TL > 0) {
          this.rows[i].balance_TL = prevBalance + this.rows[i].BA_TOPLAM_TL;
        } else if (this.rows[i].BS_TOPLAM_TL > 0) {
          this.rows[i].balance_TL = prevBalance - this.rows[i].BS_TOPLAM_TL;
        } else {
          this.rows[i].balance_TL = prevBalance;
        }

        this.rows[i].balance =
          this.rows[i].balance_TL * this.rows[i].currencyRate;
        this.rows[i].BA_TOPLAM =
          this.rows[i].BA_TOPLAM_TL * this.rows[i].currencyRate;
        this.rows[i].BS_TOPLAM =
          this.rows[i].BS_TOPLAM_TL * this.rows[i].currencyRate;
      }

      this.$logger.log(
        "this.rows[i].balance",
        this.formatNumber(this.rows[10].balance)
      );
      /*for (let i = 0; i < this.rows.length; i++) {
        this.rows[i].balance = this.formatNumber(this.rows[i].balance_TL);
        this.rows[i].balance = this.formatNumber(this.rows[i].balance);
        this.rows[i].BA_TOPLAM = this.formatNumber(this.rows[i].BA_TOPLAM_TL);
        this.rows[i].BA_TOPLAM = this.formatNumber(this.rows[i].BA_TOPLAM);
        this.rows[i].BS_TOPLAM = this.formatNumber(this.rows[i].BS_TOPLAM_TL);
        this.rows[i].BS_TOPLAM = this.formatNumber(this.rows[i].BS_TOPLAM);
      }*/
    },

    valueFormat() {
      Promise.all(
        this.rows.map((x) => {
          x.balance = formatNumber(x.balance);
          return x;
        })
      );
    },

    formatNumber(value) {
      try {
        return Number(value.toFixed(4)).toLocaleString("tr-TR", {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        });
      } catch (error) {}
    },

    priceCalc(val) {
      try {
        //this.$logger.log("val", val);
        return val == null ? 0 : parseFloat(val).toFixed(4);
      } catch (error) {
        return 0;
      }
    },
  },
});
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 90vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #ffffff

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
