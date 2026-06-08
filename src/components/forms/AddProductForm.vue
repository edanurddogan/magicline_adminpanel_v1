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

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('products.piece')"
                  v-model="formModel.piece"
                  type="number"
                  @change="calcDiscount"
                  @blur="blurQuantity"
                  :rules="quantityRule"
                  min="1"
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
  name: "AddProductForm",
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

      currentMode: "add",

      maximizedToggle: false,

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

      if (this.mode == "add") {
        this.formModel.piece = 1;
        this.formModel.detail = "";
      } else {
        this.calcUnitAmount();
      }

      this.$logger.log("formModel", this.formModel);
    },

    onSubmit() {},

    save() {
      this.formModel.stockCardId = this.formModel.stockCard.id;

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

    async productSelected(val) {
      this.$logger.log("selected Product", val);
      this.formModel.stockCardId = this.formModel.stockCard.id;
    },

    async blurQuantity(val) {
      this.$logger.log("blurQuantity1", val);
      if (this.formModel.piece < 1) this.formModel.piece = 1;
      this.$logger.log("blurQuantity2", val);
      this.calcDiscount();
    },
  },
});
</script>
