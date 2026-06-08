<template>
  <div>
    <q-card>
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <q-item
            class="col-lg-3 col-md-4 col-sm-6 col-xs-12"
            v-if="pvo.variation01"
          >
            <q-item-section>
              <q-select
                outlined
                use-input
                transition-show="scale"
                transition-hide="scale"
                input-debounce="0"
                v-model="formModel.variationOption01"
                option-value="id"
                option-label="variationOptionName"
                :label="$t('products.variation') + ' - 1'"
                :options="variationOptions1Filtered"
                @filter="filterVariationOptions1"
                style="width: 350px"
                @update:model-value="updvar"
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

          <q-item
            class="col-lg-3 col-md-4 col-sm-6 col-xs-12"
            v-if="pvo.variation02"
          >
            <q-item-section>
              <q-select
                outlined
                use-input
                transition-show="scale"
                transition-hide="scale"
                input-debounce="0"
                v-model="formModel.variationOption02"
                option-value="id"
                option-label="variationOptionName"
                :label="$t('products.variation') + ' - 2'"
                :options="variationOptions2Filtered"
                @filter="filterVariationOptions2"
                style="width: 350px"
                @update:model-value="updvar"
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

          <q-item
            class="col-lg-3 col-md-4 col-sm-6 col-xs-12"
            v-if="pvo.variation03"
          >
            <q-item-section>
              <q-select
                outlined
                use-input
                transition-show="scale"
                transition-hide="scale"
                input-debounce="0"
                v-model="formModel.variationOption03"
                option-value="id"
                option-label="variationOptionName"
                :label="$t('products.variation') + ' - 3'"
                :options="variationOptions3Filtered"
                @filter="filterVariationOptions3"
                style="width: 350px"
                @update:model-value="updvar"
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
        </q-list>
        <q-list class="row">
          <q-item class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                :label="$t('products.barcode')"
                v-model="formModel.barcode"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                :label="$t('products.price')"
                v-model="formModel.price"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                :label="$t('products.stock')"
                v-model="formModel.stock"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                :label="$t('products.minsoldquantity')"
                v-model="formModel.minSoldQuantity"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                :label="$t('products.maxsoldquantity')"
                v-model="formModel.maxSoldQuantity"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-item-section>
          <q-toggle
            class="q-pa-sm col-lg-12 col-md-12 col-sm-12 col-xs-12"
            :label="$t('status')"
            v-model="formModel.isActive"
            checked-icon="done_all"
            color="green"
            unchecked-icon="visibility_off"
            :disable="mode === 'details'"
          />
        </q-item-section>
      </q-item>

      <q-card-actions align="right" class="q-pa-lg">
        <q-btn
          class="text-capitalize bg-info q-pa-lg"
          :style="{
            display: mode === 'details' ? 'none' : 'block',
          }"
          @click="onSubmit"
        >
          {{ $t("products.variation") + " " + $t("save") }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "ProductVariationForm",
  computed: {},
  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: "add",
    },
    productvo: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });
    const pvo = computed({
      // Use computed to wrap the object
      get: () => props.productvo,
      set: (value) => emit("update:productvo", value),
    });

    return {
      formModel,
      pvo,
    };
  },
  data() {
    return {
      formShow: true,
      variationOptionsFull: [],
      variationOptions1Full: [],
      variationOptions2Full: [],
      variationOptions3Full: [],
      variationOptions4Full: [],
      variationOptions5Full: [],
      variationOptionsFiltered: [],
      variationOptions1Filtered: [],
      variationOptions2Filtered: [],
      variationOptions3Filtered: [],
      variationOptions4Filtered: [],
      variationOptions5Filtered: [],
    };
  },
  emits: ["completed"],
  onBeforeCreate() {},
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.getvariationOptions();
      this.formModel.productId = this.pvo.productId;
      this.$logger.log("formModel", this.formModel);
    },
    onSubmit() {
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
      this.$logger.log("addFormModel", this.formModel);
      const response = this.$api
        .post("productVariations", JSON.stringify(this.formModel))
        .then(() => {
          this.$logger.log(response);
          this.$logger.log("add completed");

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: "Başarılı",
            caption: "success",
          });

          this.$emit("completed");
        });
    },
    async editFormModel() {
      this.$logger.log("editFormModel", this.formModel);
      const response = this.$api
        .put("productVariations", JSON.stringify(this.formModel))
        .then(() => {
          this.$logger.log(response);
          this.$logger.log("edit completed");

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            //message: this.$i18n(""),
            //caption: this.$i18n("success"),
          });

          this.$emit("completed");
        });
    },

    async getvariationOptions() {
      const response = this.$api.get("variationoptions").then((data) => {
        this.$logger.log("data.data", data.data);
        this.$logger.log("this.pvo", this.pvo);
        this.variationOptionsFull = data.data;

        this.variationOptions1Full = this.variationOptionsFull.filter((vo) => {
          return vo.variationId == this.pvo.variation01.id;
        });
        this.$logger.log(this.variationOptions1Full);

        this.variationOptions2Full = this.variationOptionsFull.filter((vo) => {
          return vo.variationId == this.pvo.variation02.id;
        });
        this.$logger.log(this.variationOptions2Full);

        this.variationOptions3Full = this.variationOptionsFull.filter((vo) => {
          return vo.variationd == this.pvo.variation03.id;
        });
        this.$logger.log(this.variationOptions3Full);

        this.variationOptions4Full = this.variationOptionsFull.filter((vo) => {
          return vo.variationId == this.pvo.variation04.id;
        });
        this.$logger.log(this.variationOptions4Full);

        this.variationOptions5Full = this.variationOptionsFull.filter((vo) => {
          return vo.variationId == this.pvo.variation05.id;
        });
        this.$logger.log(this.variationOptions5Full);
        //   if (this.formModel.variationOption01) {
        //   this.variation01 = this.rows[0].variationOption01.variation;
        //   this.variation01selectenable = false;
        //   this.variation01enable = false;
        //   this.variation01exists = true;
        // }
        // if (this.rows[0].variationOption02) {
        //   this.variation02 = this.rows[0].variationOption02.variation;
        //   this.variation02selectenable = false;
        //   this.variation02enable = false;
        //   this.variation02exists = true;
        // }
      });
    },
    updvar() {
      if (this.formModel.variationOption01)
        this.formModel.variationOption01Id =
          this.formModel.variationOption01.id;

      if (this.formModel.variationOption02)
        this.formModel.variationOption02Id =
          this.formModel.variationOption02.id;

      if (this.formModel.variationOption03)
        this.formModel.variationOption03Id =
          this.formModel.variationOption03.id;

      if (this.formModel.variationOption04)
        this.formModel.variationOption04Id =
          this.formModel.variationOption04.id;

      if (this.formModel.variationOption05)
        this.formModel.variationOption05Id =
          this.formModel.variationOption05.id;

      this.$logger.log(this.formModel);
    },
    filterVariationOptions1(val, update) {
      if (val === "") {
        update(() => {
          this.variationOptions1Filtered = this.variationOptions1Full;
        });
        return;
      }

      update(() => {
        this.variationOptions1Filtered = this.variationOptions1Full.filter(
          (v) =>
            v.variationOptionName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },
    filterVariationOptions2(val, update) {
      if (val === "") {
        update(() => {
          this.variationOptions2Filtered = this.variationOptions2Full;
        });
        return;
      }

      update(() => {
        this.variationOptions2Filtered = this.variationOptions2Full.filter(
          (v) =>
            v.variationOptionName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async selectedBrand() {
      this.$logger.log(this.brandsFull);
      this.$logger.log(this.formModel.brand.name);
      var sBrand = this.brandsFull.find((b) => {
        return b.name === this.formModel.brand.name;
      });
      this.getModels(sBrand.id);
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
      getProducts();
    },

    async Delete() {
      const response = await this.$api
        .delete("productVariations/" + this.currentRow.id)
        .then(() => {
          this.$logger.log(response);
          this.$logger.log("deleted");

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: "Başarılı",
            caption: "success",
          });

          this.$emit("completed");
        }); //ToDo:
      getList();
      this.deleteConfirm = false;
      this.$logger.log(response);
    },
  },
});
</script>
