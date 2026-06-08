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
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  outlined
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.stockCard"
                  option-value="id"
                  option-label="stockName"
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

            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  outlined
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.warehouse"
                  option-value="id"
                  option-label="name"
                  :label="$t('products.warehouse')"
                  @filter="filterWarehouse"
                  :options="wareHouseFiltered"
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

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('products.piece')"
                  v-model="formModel.quantity"
                  type="number"
                  @change="calcDiscount"
                  @blur="blurQuantity"
                  :rules="quantityRule"
                  min="1"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
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

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
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

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('order.orderDiscount')"
                  v-model="formModel.discount"
                  type="number"
                  @change="calcDiscount"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('order.discountpercent')"
                  v-model="formModel.discountPercent"
                  type="number"
                  @change="calcDiscountPercent"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
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
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
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

  <!-- Delete Dialog -->
  <q-dialog v-model="deleteConfirm" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="person_off" color="negative" text-color="white" />&nbsp;
        &nbsp; &nbsp; &nbsp;
        <h5>{{ $t("products.deleteconfirm") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>{{ $t("products.barcode") }} : {{ currentRow.barcode }}</p>
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
          v-on:click="rowDelete()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "OrderDetailForm",
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
      productsFull: [],
      productsFiltered: [],

      warehousesFull: [],
      warehouseFiltered: [],

      currencyFull: [],
      currencyFiltered: [],

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
    this.formModel.warehouse = { name: "" };
  },
  methods: {
    async init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}

      this.getProduct();
      this.getCurrency();
      this.getWarehouse();

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
      } else {
        this.calcUnitAmount();
      }

      this.$logger.log("formModel", this.formModel);
    },

    onSubmit() {},

    save() {
      this.formModel.stockCardId = this.formModel.stockCard.id;
      this.formModel.currencyId = this.formModel.stockCard.currencyId;
      this.calcDiscount();
      this.$logger.log(this.formModel);
      this.$logger.log("form submitted", this.formModel);
      if (this.mode === "add") {
        this.$logger.log("add");
        this.addFormModel();
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },

    async addFormModel() {
      this.$emit("addcompleted");
    },

    async editFormModel() {
      this.$emit("editcompleted");
    },

    async getProduct() {
      const response = this.$api.get("stockCards").then((data) => {
        this.$logger.log(data.data);
        this.productsFull = data.data;
      });
    },

    filterProduct(val, update) {
      if (val === "") {
        update(() => {
          this.productsFiltered = this.productsFull;
        });
        return;
      }

      update(() => {
        this.productsFiltered = this.productsFull.filter(
          (v) => v.stockName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getWarehouse() {
      const response = this.$api.get("warehouses").then((data) => {
        this.$logger.log("getWarehouse", data.data);
        this.warehousesFull = data.data;
      });
    },

    filterWarehouse(val, update) {
      if (val === "") {
        update(() => {
          this.wareHouseFiltered = this.warehousesFull;
        });

        return;
      }

      update(() => {
        this.wareHouseFiltered = this.warehousesFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

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
      this.$logger.log("selected Product", val.currencyId);
      this.formModel.currency = this.currencyFull.find(
        (c) => c.id == val.currencyId
      );
      this.formModel.stockCardId = this.formModel.stockCard.id;
      this.formModel.price = this.formModel.stockCard.listPrice;
      this.formModel.discount = this.formModel.stockCard.discount;
      this.formModel.discountPercent = this.formModel.stockCard.discountPercent;
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
      this.formModel.grandtotal =
        this.formModel.unitAmount * this.formModel.quantity;
    },

    async blurQuantity(val) {
      this.$logger.log("blurQuantity1", val);
      if (this.formModel.quantity < 1) this.formModel.quantity = 1;
      this.$logger.log("blurQuantity2", val);
      this.calcDiscount();
    },
  },
});
</script>
