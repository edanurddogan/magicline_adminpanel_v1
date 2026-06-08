<template>
  <div class="row">
    <!-- Bayi Bilgileri -->
    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <q-card class="q-ma-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("dealer.dealerInfo") }}</div>
        </q-card-section>

        <q-card-section>
          <q-list dense class="row">
            <!-- Bayi Adı -->
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="nameRef"
                  v-model="formModel.name"
                  :label="$t('dealer.dealerName')"
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  lazy-rules
                  dense
                  outlined
                >
                  <template #prepend>
                    <q-icon name="store" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <!-- Bayi Kodu -->
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="codeRef"
                  v-model="formModel.code"
                  :label="$t('dealer.dealerCode')"
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  lazy-rules
                  dense
                  outlined
                >
                  <template #prepend>
                    <q-icon name="confirmation_number" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <!-- Faturalama Planı -->
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="billingPlanRef"
                  v-model="formModel.dealerBillingPlan"
                  style="width: 100%"
                  :options="billingPlans"
                  option-value="id"
                  option-label="name"
                  :label="$t('firm.billingPlan')"
                  :disable="mode === 'details'"
                  :loading="loading"
                  emit-value
                  options-dense
                  map-options
                  outlined
                  dense
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template #prepend>
                    <q-icon name="receipt" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Tahsilat Toggle -->
            <q-toggle
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
              v-model="formModel.isCollectPayment"
              :label="$t('station.collectPayment')"
              color="green"
              checked-icon="check"
              unchecked-icon="cancel"
              :disable="mode === 'details'"
            />
            <!-- Tahsilat Toggle -->
            <q-toggle
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
              v-model="formModel.isIndividualPayment"
              :label="$t('dealer.isIndividualPayment')"
              color="green"
              checked-icon="check"
              unchecked-icon="cancel"
              :disable="mode === 'details'"
            />
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <!-- Adres Bilgileri -->
    <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
      <q-card class="q-ma-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("firm.addressinfo") }}</div>
        </q-card-section>

        <q-card-section dense class="row">
          <q-list dense class="row q-pa-none q-ma-none">
            <!-- Ülke Inputs -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <q-item-section>
                <q-select
                  ref="countryRef"
                  v-model="formModel.address.country"
                  :options="countries"
                  option-value="id"
                  option-label="name"
                  :label="$t('firm.country')"
                  :disable="mode === 'details'"
                  options-dense
                  map-options
                  dense
                  outlined
                  @update:model-value="onCountryChange"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  style="width: 100%"
                >
                  <template #prepend>
                    <q-icon name="public" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Şehir Inputs -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <q-item-section>
                <q-select
                  ref="cityRef"
                  v-model="formModel.address.city"
                  :options="filteredCities"
                  option-value="id"
                  option-label="name"
                  :label="$t('firm.city')"
                  :disable="mode === 'details'"
                  use-input
                  options-dense
                  map-options
                  dense
                  outlined
                  clearable
                  @filter="
                    (val, update) =>
                      filterList(val, update, 'cities', 'filteredCities')
                  "
                  @update:model-value="onCityChange"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  style="width: 100%"
                >
                  <template #prepend>
                    <q-icon name="location_city" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- İlçe Inputs -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <q-item-section>
                <q-select
                  ref="districtRef"
                  v-model="formModel.address.district"
                  :options="filteredDistricts"
                  option-value="id"
                  option-label="name"
                  :label="$t('firm.district')"
                  :disable="mode === 'details'"
                  use-input
                  options-dense
                  map-options
                  dense
                  outlined
                  clearable
                  @filter="
                    (val, update) =>
                      filterList(val, update, 'districts', 'filteredDistricts')
                  "
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  style="width: 100%"
                >
                  <template #prepend>
                    <q-icon name="place" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Bayi Adresi -->
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  v-model="formModel.address.addressDetail"
                  :label="$t('firm.address')"
                  type="textarea"
                  :disable="mode === 'details'"
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="home" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <!-- Durum Toggle -->
      <q-item
        dense
        class="row col-lg-12 col-md-12 col-sm-1 col-xs-12 justify-end"
      >
        <q-toggle
          :label="formModel.isActive === true ? $t('active') : $t('inactive')"
          color="green"
          checked-icon="check"
          unchecked-icon="cancel"
          :disable="mode === 'details'"
          v-model="formModel.isActive"
        />
      </q-item>
    </div>
  </div>

  <!-- Yetkili Kişi Bilgileri -->
  <div
    class="q-ma-sm"
    v-if="formModel.id"
    :style="{
      opacity: mode === 'details' ? 0.5 : 1,
      pointerEvents: mode === 'details' ? 'none' : 'auto',
    }"
  >
    <dealer-contact-form :dealerId="formModel.id" />
  </div>
  <!-- Durum ve Kayıt Butonları -->
  <q-card-actions class="justify-end">
    <q-btn
      class="text-capitalize bg-info q-pa-lg"
      :style="{ display: mode === 'details' ? 'none' : 'block' }"
      @click="onSubmit"
    >
      {{ mode === "edit" ? $t("updatedata") : $t("savedata") }}
    </q-btn>
  </q-card-actions>
</template>

<script>
import { defineComponent, computed } from "vue";
import DealerContactForm from "src/components/forms/DealerContactForm.vue";

export default defineComponent({
  name: "DealerForm",
  components: {
    DealerContactForm,
  },
  setup(props, { emit }) {
    let formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode == "add") {
      formModel.value.isIndividualPayment = true;
      formModel.value.isCollectPayment = true;
      formModel.value.isActive = true;
      formModel.value.address = {};
    } else {
      if (!formModel.value.address) formModel.value.address = {};
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
      billingPlans: [],
      countries: [],
      cities: [],
      filteredCities: [],
      districts: [],
      filteredDistricts: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.getCountries();
      this.getBillingPlans();

      if (this.formModel.address.countryId) {
        await this.getCities(this.formModel.address.countryId); // Ülkenin şehirlerini al
        // Şehiri bul ve ilçeleri getir
        this.districts = this.filteredDistricts =
          this.cities.find((c) => c.id === this.formModel.address.cityId)
            ?.districts || [];
      }
    },

    async getBillingPlans() {
      try {
        const response = await this.$api.get("getDealerBillingPlanValues");
        this.billingPlans = response.data.data.map((item) => {
          return {
            id: item,
            name: this.$t(`${item}`),
          };
        });
      } catch (error) {
        this.$logger.error("Hata getBillingPlans", error);
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
    async getCities(countryId) {
      try {
        const response = await this.$api.get(
          `getCitiesWithDistricts/${countryId}`,
        );
        this.cities = this.filteredCities = response.data;
      } catch (error) {
        this.$logger.error("Şehir verisi alınamadı:", error);
      }
    },
    async onCountryChange() {
      try {
        this.formModel.address.city = null;
        this.formModel.address.district = null;

        this.getCities(this.formModel.address.country.id);
      } catch (error) {
        this.$logger.error("Ülke verisi alınamadı:", error);
      }
    },

    onCityChange() {
      try {
        this.formModel.address.district = null;
        this.districts = this.filteredDistricts =
          this.formModel.address.city?.districts;
      } catch (error) {
        this.$logger.error("onCityChange", error);
      }
    },

    filterCities(val, update) {
      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        val === ""
          ? (this.filteredCities = this.cities)
          : (this.filteredCities = this.cities.filter((city) =>
              this.$normalizeTurkishString(city.name).includes(normalizedVal),
            ));
      });
    },

    filterList(val, update, sourceList, targetList) {
      const source = this[sourceList];
      const normalizedVal = this.$normalizeTurkishString(val);

      update(() => {
        this[targetList] =
          val === ""
            ? source
            : source.filter((item) =>
                this.$normalizeTurkishString(item.name).includes(normalizedVal),
              );
      });
    },
    async onSubmit() {
      try {
        const isValid =
          (await this.$refs.nameRef?.validate?.()) &&
          (await this.$refs.codeRef?.validate?.()) &&
          (await this.$refs.billingPlanRef?.validate?.()) &&
          (await this.$refs.countryRef?.validate?.()) &&
          (await this.$refs.cityRef?.validate?.()) &&
          (await this.$refs.districtRef?.validate?.());

        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }

        this.formModel.address = {
          ...this.formModel.address,
          countryId: this.formModel.address.country.id,
          cityId: this.formModel.address.city.id,
          districtId: this.formModel.address.district.id,
        };
        this.$logger.log("bayi formModel", this.formModel);
        if (this.mode === "add") {
          this.addFormModel();
        } else {
          this.updateFormModel();
        }
      } catch (error) {
        this.$logger.error("Error onSubmit:", error);
      }
    },
    async addFormModel() {
      try {
        const response = await this.$api.post("createDealer", this.formModel);
        if (response.status == 200) {
          this.formModel.id = response.data.id;
          this.$q.notify({ type: "positive", message: this.$t("saved") });
          this.$emit("completed", response.data);
        }
      } catch (error) {
        this.$logger.error("Error add Dealer:", error);
      }
    },
    async updateFormModel() {
      try {
        const response = await this.$api.put("updateDealer", this.formModel);
        if (response.status === 200)
          this.$q.notify({ type: "positive", message: this.$t("updated") });
        this.$emit("completed", response.data);
      } catch (error) {
        this.$logger.error("Error update Delaer:", error);
      }
    },
  },
});
</script>
