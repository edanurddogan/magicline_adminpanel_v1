<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("products.stockinfo") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list class="row">
            <q-item class="column col-lg-10 col-md-10 col-sm-10 col-xs-12">
              <q-item-section>
                <q-select
                  ref="selectProduct"
                  outlined
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.stockCard"
                  option-value="id"
                  option-label="value"
                  :label="$t('products.product')"
                  @filter="filterProduct"
                  :options="productsFiltered"
                  @update:model-value="(val) => productSelected(val)"
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

            <q-item class="col-lg-2 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('products.piece')"
                  v-model="formModel.quantity"
                  type="number"
                  @change="calcUnitAmount"
                  @blur="blurQuantity"
                  :rules="quantityRule"
                  min="1"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-2 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('products.price')"
                  v-model="formModel.price"
                  type="number"
                  @change="calcDiscount"
                />
              </q-item-section>
            </q-item>

            <q-item v-if="false" class="col-lg-2 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-select
                  outlined
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.currency"
                  option-value="id"
                  option-label="shortName"
                  :label="$t('products.currency')"
                  @filter="filterCurrency"
                  :options="currencyFiltered"
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

            <q-item class="col-lg-2 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('order.vatrate')"
                  v-model="formModel.vatRate"
                  :value="0"
                  :min="0"
                  type="number"
                  @change="calcUnitAmount"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-2 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('order.orderDiscount')"
                  v-model="formModel.discount"
                  :value="0"
                  :min="0"
                  type="number"
                  @change="calcDiscount"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-2 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('order.discountpercent')"
                  v-model="formModel.discountPercent"
                  :value="0"
                  :min="0"
                  type="number"
                  @change="calcDiscountPercent"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-2 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('order.unitamount')"
                  v-model="formModel.unitAmount"
                  type="number"
                  @change="calcUnitAmount"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-2 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('order.grandtotal')"
                  v-model="formModel.grandtotal"
                  type="number"
                  @change="calcUnitAmount"
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
                  v-model="formModel.description"
                  type="textarea"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-space />
          <q-btn
            color="secondary"
            :label="$t('savedata')"
            icon-right="send"
            text-color="white"
            :style="{
              display: mode === 'details' ? 'none' : '',
              width: '150px',
            }"
            @click="save"
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "OfferDetailForm",
  components: {},
  computed: {},
  setup(props, { emit }) {
    const $q = useQuasar();
    const formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    return {
      formModel,
    };
  },
  data() {
    return {
      productsFull: [{ id: 0, name: "Seçim yapın" }],
      productsFiltered: [],

      currencyFull: [],
      currencyFiltered: [],

      loading: true,
      rows: [],
      selectedId: 0,
      formVisible: false,
      deleteConfirm: false,
      currentMode: this.$t("add"),
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      isGrid: false,

      //Rules
      quantityRule: [
        (val) =>
          val !== null || val < 0 || val === 0 || this.$t("order.minpiece"),
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
  },
  mounted() {
    this.init();
    if (this.mode == "add") {
      this.formModel.stockCard = { id: 0, value: "Seç" };
    } else if (this.mode == "edit") {
      this.formModel.stockCard.value = `${this.formModel.stockCard.stockCode} - ${this.formModel.stockCard.stockName}`;
    }
  },
  methods: {
    async init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
      this.$refs.selectProduct.$el.focus();
      this.getProduct();
      this.getCurrency();

      /*try {
        if (this.formModel?.id) {
          const response = await this.$api.get(
            "orderItems/" + this.formModel.id
          );
          this.formModel = response?.data;
          this.$logger.log("this.formModel", this.formModel);
          this.loading = false;
        }
      } catch (error) {}*/

      if (this.mode == "add") {
        this.formModel.quantity = 1;
        this.formModel.detail = "";
        this.formModel.discount = 0;
      } else {
        this.calcUnitAmount();
      }

      this.$logger.log("formModel", this.formModel);
    },

    onSubmit() {},

    save() {
      this.formModel.stockCardId = this.formModel.stockCard.id;
      this.formModel.currencyId = this.formModel.stockCard.currencyId;
      if (!this.formModel.discountPercent) this.formModel.discountPercent = 0;
      if (!this.formModel.discount) this.formModel.discount = 0;
      this.calcDiscount();
      if (this.mode === "add") {
        this.$logger.log("add");
        this.addFormModel();
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },

    async addFormModel() {
      this.formModel.id = null;
      this.formModel.shippedQuantity = 0;
      this.$emit("addcompleted");
    },

    async editFormModel() {
      this.$emit("editcompleted");
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
      this.$logger.log("val", val);
      this.$logger.log("update", update);

      update(() => {
        var body = { letters: val };
        this.$logger.log("body", body);
        const response = this.$api
          .put("searchStockCardsByLatterApart/", body)
          .then((data) => {
            var products = data.data.map((p) => {
              p.value = `${p.stockCode} - ${p.stockName}`;
              return p;
            });
            this.productsFiltered = products;
            this.$logger.log("productsFiltered", this.productsFiltered);
          });
      });
    },

    async filterProductInput(val) {
      this.$logger.log("val", val);
      if (val.length < 3) {
        return;
      }

      try {
        var body = { letters: val };
        this.$logger.log("body", body);
        const response = this.$api
          .put("searchStockCards/", body)
          .then((data) => {
            var products = data.data.map((p) => {
              p.value = `${p.stockCode} - ${p.stockName}`;
              return p;
            });
            this.productsFiltered = products;
            this.$logger.log("productsFiltered", this.productsFiltered);
            if (this.productsFiltered.length > 0) {
              this.$refs.productFilter.showPopup();
            } else {
              this.$refs.productFilter.hidePopup();
            }

            this.$refs.inputStockCardName.$el.focus();
          });
      } catch (ex) {
        this.$logger.log("filterProductInput", ex);
      }
    },
    /*filterProduct(val, update) {
      if (val === "") {
        update(() => {
          this.productsFiltered = this.productsFull;
        });
        return;
      }

      update(() => {
        this.productsFiltered = this.productsFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },*/

    async getCurrency() {
      const response = this.$api.get("currencies").then((data) => {
        this.$logger.log(data.data);
        this.currencyFull = data.data;
      });
    },

    filterCurrency(val, update) {
      if (val === "") {
        update(() => {
          this.currencyFiltered = this.currencyFull;
        });
        return;
      }

      update(() => {
        this.currencyFiltered = this.currencyFull.filter(
          (v) => v.shortName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async productSelected(val) {
      this.$logger.log("selected Product2", val);
      this.formModel.currency = this.currencyFull.find(
        (c) => c.id == val.currencyId
      );
      this.formModel.stockCardId = this.formModel.stockCard.id;
      this.formModel.vatRate = this.formModel.stockCard.vatRate;
      this.formModel.price = this.formModel.stockCard.listPrice || 0;
      this.formModel.discount = this.formModel.stockCard.discount || 0;
      this.formModel.discountPercent =
        this.formModel.stockCard.discountPercent || 0;
      this.calcDiscount();
    },

    async calcDiscount() {
      this.formModel.discountPercent =
        (this.formModel.discount * 100) / this.formModel.price;

      this.calcUnitAmount();
    },
    async calcDiscountPercent() {
      this.formModel.discount =
        (this.formModel.discountPercent * this.formModel.price) / 100;

      this.calcUnitAmount();
    },
    async calcUnitAmount() {
      this.formModel.unitAmount =
        this.formModel.price - this.formModel.discount;
      this.formModel.grandtotal = parseFloat(
        this.formModel.unitAmount *
          this.formModel.quantity *
          (1 + this.formModel.vatRate / 100)
      ).toFixed(2);
    },

    async blurQuantity(val) {
      //this.$logger.log("blurQuantity1", val);
      if (this.formModel.quantity < 1) this.formModel.quantity = 1;
      //this.$logger.log("blurQuantity2", val);
      this.calcDiscount();
    },
  },
});
</script>
