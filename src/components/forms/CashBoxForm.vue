<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("finance.cashBox.cases") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('finance.cashBox.name')"
                  v-model="formModel.name"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('finance.cashBox.balance')"
                  v-model="formModel.balance"
                />
              </q-item-section>
            </q-item>
            <!--Para Birimi-->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.currency"
                  option-value="id"
                  option-label="name"
                  :label="$t('firm.currency')"
                  :options="currenciesFiltered"
                  @filter="filterCurrency"
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
                  rows="2"
                  :disable="mode === 'details'"
                  :label="$t('finance.checksPromissory.description')"
                  v-model="formModel.description"
                  type="textarea"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-card class="q-pa-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-card-actions>
                    <q-btn-toggle
                      v-model="formModel.documentType"
                      push
                      rounded
                      toggle-color="blue-grey"
                      :options="[
                        { value: 'Kasa', slot: 'one' },
                        { value: 'Banka', slot: 'two' },
                      ]"
                    >
                      <template v-slot:one>
                        <div class="row items-center no-wrap">
                          <q-icon color="grey-1" left name="arrow_downward" />
                          <div class="text-center">Kasa</div>
                        </div>
                      </template>

                      <template v-slot:two>
                        <div class="row items-center no-wrap">
                          <div class="text-center">Banka</div>
                          <q-icon color="grey-1" right name="arrow_upward" />
                        </div>
                      </template>
                    </q-btn-toggle>
                    <q-space></q-space>
                    <q-btn
                      color="secondary"
                      :label="$t('savedata')"
                      icon-right="send"
                      text-color="white"
                      :loading="saveLoading"
                      class="text-capitalize q-pa-xl q-mx-xl"
                      :style="{
                        display: mode === 'details' ? 'none' : '',
                      }"
                      @click="save"
                    >
                    </q-btn>
                  </q-card-actions>
                </q-card>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-separator />
      </q-card>
    </div>

    <div class="q-pa-md col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar, date, LocalStorage } from "quasar";

export default defineComponent({
  name: "CashBoxForm",
  components: {},
  setup(props, { emit }) {
    const $q = useQuasar();
    var formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    return {
      formModel,
    };
  },

  computed: {
    columns() {
      return [];
    },
    moneyFormatForDirective: {
      decimal: ".",
      thousands: ",",
      prefix: "$ ",
      suffix: " #",
      precision: 2,
      masked: false /* doesn't work with directive */,
    },
  },
  data() {
    return {
      //Forms-

      //model: {},
      //QTable
      loading: false,
      rows: [],
      selectedId: 0,
      formVisible: false,
      deleteConfirm: false,
      currentMode: this.$t("add"),
      productionCurrentMode: this.$t("new"),
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      isGrid: false,

      currenciesFull: [],
      currenciesFiltered: [],

      saveLoading: false,
      saved: false,
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
    this.$logger.log("formModel: ", this.formModel);
    this.init();
    this.$setPageTitle("Kasa Banka");

    this.formModel.termDate = date.formatDate(
      this.formModel.termDate,
      "YYYY-MM-DD"
    );
  },
  methods: {
    dateChange(data) {
      this.$logger.log(data);
      this.$logger.log(this.formModel.order.orderDate);
    },
    async init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}

      if (this.mode !== "add") this.saved = true;
    },

    paymentTermChange(data) {
      this.$logger.log("pt => ", data);
    },

    onSubmit() {},

    async getCurrency() {
      const response = this.$api.get("currencies").then((data) => {
        this.$logger.log(data.data);
        this.currenciesFull = data.data;
      });
    },
    filterCurrency(val, update) {
      if (val === "") {
        update(() => {
          this.currenciesFiltered = this.currenciesFull;
        });
        return;
      }

      update(() => {
        this.currenciesFiltered = this.currenciesFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },
    save() {
      this.saveLoading = true;
      this.$logger.log("this.formModel", this.formModel);
      this.formModel.order.isActive = true;
      this.formModel.order.addressId = this.formModel.order.address.id;
      var _userinfo = LocalStorage.getItem("userinfo");
      this.formModel.order.employeeId = _userinfo.id;
      this.formModel.order.paymentTypeId =
        this.formModel.order.firm.paymentTypeId;
      this.formModel.order.paymentTermId = this.formModel.order.paymentTerm.id;
      this.formModel.order.orderStatusId = this.formModel.order.orderStatus.id;
      this.formModel.order.currencyId = this.formModel.order.currency.id;

      if (this.mode === "add") {
        this.$logger.log("add");
        this.addFormModel();
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },
    async addFormModel() {
      const _response = this.$api
        .post("orders", JSON.stringify(this.formModel.order))
        .then((response) => {
          this.saved = true;
          this.$emit("orderListRefresh");
          this.$logger.log(this.formModel);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });

          const _responseorders = this.$api
            .get("getOrder/" + response.data.id)
            .then((response) => {
              this.$q.notify({
                progress: true,
                type: "info",
                color: "info",
                message: this.$t("success"),
                caption: this.$t("success"),
              });
              this.formModel.order = response.data.order;
              this.$logger.log("getOrder/", this.formModel);
              this.saveLoading = false;
              //this.$emit('completed');
            });
        });
    },
    async editFormModel() {
      const response = this.$api
        .put("orders", JSON.stringify(this.formModel))
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
          //this.$emit('completed');
          this.saveLoading = false;
        });
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentRow.orderId = this.formModel.order.id;
      this.currentRow.stockCard = {};
      this.currentRow.stockCard.stockName = "Ürün Seçiniz";
      this.currentRow.stockCard.currency = {};
      this.currentRow.stockCard.currency.shortName = "";

      this.$logger.log(this.currentRow);
      this.$logger.log(this.formModel);
      this.currentRow = this.currentRow;
      this.currentMode = "add";
      this.OrderDetailFormVisible = true;
    },
    onFormCompleted() {
      this.formVisible = false;
      this.$logger.log("form completed");
      this.getOrderItems();
    },
    async Delete() {
      try {
        this.$logger.log(this.currentRow.id);
        const response = await this.$api.delete(
          "orderItems/" + this.currentRow.id
        );
        this.getOrderItems();
        this.deleteConfirm = false;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },
  },
});
</script>
