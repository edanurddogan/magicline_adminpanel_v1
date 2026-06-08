<template>
  <div class="row">
    <q-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card-section class="bg-primary text-white">
        {{ $t("priceList.pricesInformation") }}
      </q-card-section>
      <q-card-section>
        <q-list class="row">
          <!-- Fiyat Adı -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                ref="nameRef"
                v-model="formModel.name"
                type="text"
                :label="$t('priceList.priceName')"
                :disable="mode === 'details'"
                outlined
                dense
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="lists" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <!-- Ülke -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                ref="countryRef"
                v-model="formModel.countryId"
                :options="countries"
                option-value="id"
                option-label="name"
                :label="$t('firm.country')"
                emit-value
                map-options
                :disable="mode === 'details'"
                outlined
                dense
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="public" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Başlangıç Tarihi -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                ref="startDateRef"
                v-model="formModel.startDate"
                type="date"
                :label="$t('priceList.startDate')"
                :disable="mode === 'details'"
                outlined
                dense
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <!-- Elektrik Tipi -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                ref="electricTypeRef"
                v-model="formModel.stationElectricTypeId"
                :options="stationElectricTypes"
                option-value="id"
                option-label="name"
                :label="$t('priceList.electricType')"
                emit-value
                map-options
                :disable="mode === 'details'"
                outlined
                dense
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="bolt" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>

          <!-- Fiyat -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                ref="priceRef"
                v-model="formModel.price"
                type="number"
                :label="$t('priceList.unitPrice')"
                :disable="mode === 'details'"
                outlined
                dense
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="price_change" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <!-- Para Birimi -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                ref="currencyRef"
                v-model="formModel.currencyId"
                :options="currencies"
                option-value="id"
                option-label="name"
                :label="$t('finance.currency')"
                emit-value
                map-options
                :disable="mode === 'details'"
                outlined
                dense
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="request_quote" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions class="q-pr-lg justify-between">
        <q-toggle
          class="col-lg-1 col-md-1 col-sm-1 col-xs-12"
          :label="formModel.isActive === true ? $t('active') : $t('inactive')"
          color="green"
          checked-icon="check"
          unchecked-icon="cancel"
          :disable="mode === 'details'"
          v-model="formModel.isActive"
        />
        <q-btn
          class="text-capitalize bg-info q-pa-lg"
          :style="{ display: mode === 'details' ? 'none' : 'block' }"
          @click="onSubmit"
        >
          {{ mode === "edit" ? $t("updatedata") : $t("savedata") }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PriceForm",
  setup(props, { emit }) {
    let formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode == "add") {
      formModel.value.isActive = true;
    }

    return { formModel };
  },
  emits: ["completed"],
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    mode: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      countries: [],
      currencies: [],
      stationElectricTypes: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      try {
        if (this.mode !== "add") {
          this.formModel.startDate = new Date(this.modelValue.startDate)
            .toISOString()
            .slice(0, 10); // API den gelen tarihi DD:MM:YYYY formatına dönüştür.
        }

        this.$logger.log("price formModel", this.formModel);
        this.getCountries();
        this.getCurrencies();
        this.getStationElectricTypes();
      } catch (error) {
        this.$logger.error("PriceForm init", error);
      }
    },

    async getCountries() {
      try {
        const response = await this.$api.get("getCountries");
        this.countries = response.data;
      } catch (error) {
        this.$logger.error("Hata", error);
      }
    },

    async getCurrencies() {
      try {
        const response = await this.$api.get("/currencies");
        this.currencies = response.data;
      } catch (error) {
        this.$logger.error("Error fetching currencies list:", error);
      }
    },

    async getStationElectricTypes() {
      try {
        const response = await this.$api.get("stationElectricTypes");
        this.stationElectricTypes = response.data;
      } catch (error) {
        this.$logger.error("Error getStationElectricTypes:", error);
      }
    },

    async onSubmit() {
      try {
        const isValid =
          (await this.$refs.nameRef?.validate?.()) &&
          (await this.$refs.countryRef?.validate?.()) &&
          (await this.$refs.electricTypeRef?.validate?.()) &&
          (await this.$refs.priceRef?.validate?.()) &&
          (await this.$refs.currencyRef?.validate?.()) &&
          (await this.$refs.startDateRef?.validate?.());

        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }
        if (this.mode === "add") {
          this.addFormModel();
        } else {
          this.editFormModel();
        }
      } catch (error) {
        this.$logger.error("Hata:", error);
      }
    },

    async addFormModel() {
      try {
        const response = await this.$api.post(
          "createChargePriceList",
          this.formModel,
        );
        if (response.status == 200) {
          this.$q.notify({
            type: "positive",
            message: `${this.$t("priceList.price")} ${this.$t("added")}`,
          });
          this.$emit("completed");
        } else
          this.$q.notify({ type: "negative", message: this.$t("apierror") });
      } catch (error) {
        this.$logger.error("Fiyat eklenirken hata:", error);
      }
    },
    async editFormModel() {
      try {
        const response = await this.$api.put(
          "updateChargePriceList",
          this.formModel,
        );
        if (response.status == 200) {
          this.$q.notify({
            type: "positive",
            message: `${this.$t("priceList.price")} ${this.$t("updated")}`,
          });
          this.$emit("completed");
        } else
          this.$q.notify({ type: "negative", message: this.$t("apierror") });
      } catch (error) {
        this.$logger.error("Fiyat düzenlenirken hata:", error);
      }
    },
  },
});
</script>
