<template>
  <div class="row">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-card class="q-ma-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("region.regionInfo") }}</div>
        </q-card-section>

        <q-card-section>
          <q-list dense class="row">
            <!-- Bölge adı -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="nameRef"
                  v-model="formModel.name"
                  :label="$t('region.regionName')"
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <!-- Bölge Kodu -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="codeRef"
                  v-model="formModel.code"
                  :label="$t('region.regionCode')"
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="qr_code" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <!-- Bölge Enlem -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="latitudeRef"
                  v-model="formModel.latitude"
                  :label="$t('region.latitude')"
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="explore" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <!-- Bölge Boylam -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="longitudeRef"
                  v-model="formModel.longitude"
                  :label="$t('region.longitude')"
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <!-- Bölge Bayi -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  v-model="formModel.dealer"
                  :options="filteredDealers"
                  option-value="id"
                  option-label="name"
                  :label="$t('dealer.dealer')"
                  :loading="loading"
                  map-options
                  clearable
                  outlined
                  dense
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  @filter="
                    (val, update) =>
                      filterList(val, update, 'dealers', 'filteredDealers')
                  "
                >
                  <template #prepend>
                    <q-icon name="groups" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-card class="q-ma-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("region.contactInfo") }}</div>
        </q-card-section>

        <q-card-section>
          <q-list dense class="row">
            <!-- Yetkili Adı Soyadı -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="contactNameRef"
                  v-model="formModel.contactName"
                  :label="$t('paymentTransactions.nameAndSurname')"
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <!-- Yetkili email -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="contactEmailRef"
                  v-model="formModel.contactEmail"
                  :label="$t('region.contactEmail')"
                  :disable="mode === 'details'"
                  :rules="[validateEmail]"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Telefon ülke kodu -->
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <div class="row q-col-gutter-sm">
                  <q-select
                    :options="countryCodes"
                    v-model="countryCode"
                    emit-value
                    map-options
                    dense
                    outlined
                    class="col-4"
                    :disable="mode === 'details'"
                    :label="$t('users.countrycode')"
                  >
                    <template v-slot:prepend>
                      <q-icon name="flag" />
                    </template>
                  </q-select>

                  <!-- Yetkili Telefon -->
                  <q-input
                    ref="contactPhoneRef"
                    v-model="formModel.contactPhone"
                    dense
                    outlined
                    class="col-8"
                    :disable="mode === 'details'"
                    :label="$t('region.contactPhone')"
                    mask="### ### ## ##"
                    fill-mask
                    unmasked-value
                    :rules="[(val) => !!val || $t('requiredlabel')]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="phone" />
                    </template>
                  </q-input>
                </div>
              </q-item-section>
            </q-item>

            <!-- Yetkili Açıklama -->
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  v-model="formModel.description"
                  :label="$t('description')"
                  type="text"
                  :disable="mode === 'details'"
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon name="description" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-if="false" class="col-12 row justify-end q-mt-md">
            <q-btn
              color="primary"
              icon="add"
              :label="$t('region.addContact')"
              @click="addContactToTable"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("firm.addressinfo") }}</div>
        </q-card-section>

        <q-card-section>
          <q-list dense class="row">
            <!-- Bölge Ülke -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="countryRef"
                  v-model="formModel.address.country"
                  :options="countries"
                  option-value="id"
                  option-label="name"
                  :label="$t('firm.country')"
                  map-options
                  dense
                  outlined
                  clearable
                  :disable="mode === 'details'"
                  @update:model-value="(val) => onCountryChange()"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-slot:prepend>
                    <q-icon name="public" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Bölge Şehir -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="cityRef"
                  v-model="formModel.address.city"
                  :options="filteredCities"
                  option-value="id"
                  option-label="name"
                  :label="$t('firm.city')"
                  use-input
                  map-options
                  dense
                  outlined
                  clearable
                  :disable="mode === 'details'"
                  @filter="
                    (val, update) =>
                      filterList(val, update, 'cities', 'filteredCities')
                  "
                  @update:model-value="(val) => onCityChange()"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-slot:prepend>
                    <q-icon name="location_city" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Bölge İlçe -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="districtRef"
                  v-model="formModel.address.district"
                  :options="filteredDistricts"
                  option-value="id"
                  option-label="name"
                  :label="$t('firm.district')"
                  use-input
                  map-options
                  dense
                  outlined
                  clearable
                  :disable="mode === 'details'"
                  @filter="
                    (val, update) =>
                      filterList(val, update, 'districts', 'filteredDistricts')
                  "
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Bölge Adresi -->
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  v-model="formModel.address.addressDetail"
                  :label="$t('firm.address')"
                  type="textarea"
                  rows="3"
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
    </div>
  </div>
  <!-- Kaydet / Güncelle Butonu -->
  <q-card-actions class="q-pr-lg justify-between">
    <q-toggle
      class="col-lg-8 col-md-8 col-sm-8 col-xs-12"
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
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "RegionForm",
  setup(props, { emit }) {
    let formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode == "add") {
      formModel.value.isActive = true;
      formModel.value.address = {
        country: { name: "Seç" },
        city: { name: "Seç" },
        district: { name: "Seç" },
      };
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
  components: {},
  data() {
    return {
      countries: [],
      cities: [],
      filteredCities: [],
      districts: [],
      filteredDistricts: [],
      dealers: [],
      filteredDealers: [],
      deleteConfirm: false,
      editContactVisible: false,
      editingContact: null,

      countryCodes: [
        { label: "+90 (TR)", value: "+90" },
        { label: "+1 (US)", value: "+1" },
        { label: "+49 (DE)", value: "+49" },
        { label: "+44 (UK)", value: "+44" },
      ],

      countryCode: "+90",
      rows: [],
      filter: "",
      loading: false,
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "contactName",
          label: this.$t("region.contactName"),
          field: "contactName",
          align: "left",
          sortable: true,
        },
        {
          name: "contactPhone",
          label: this.$t("region.contactPhone"),
          field: "contactPhone",
          align: "left",
          sortable: false,
        },
        {
          name: "contactEmail",
          label: this.$t("region.contactEmail"),
          field: "contactEmail",
          align: "left",
          sortable: false,
        },
        {
          name: "isActive",
          label: this.$t("status"),
          field: "isActive",
          align: "center",
          sortable: true,
        },
        {
          name: "action",
          label: this.$t("action"),
          field: "",
          align: "center",
        },
      ];
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.getDealers();
      this.getCountries();
      if (this.formModel.address.countryId) {
        await this.getCities(this.formModel.address.countryId); // Ülkenin şehirlerini al
        // Şehiri bul ve ilçeleri getir
        this.districts = this.filteredDistricts =
          this.cities.find((c) => c.id === this.formModel.address.cityId)
            ?.districts || [];
      }
    },

    async onSubmit() {
      const isValid =
        this.$refs.nameRef?.validate?.() &&
        this.$refs.codeRef?.validate?.() &&
        this.$refs.latitudeRef?.validate?.() &&
        this.$refs.longitudeRef?.validate?.() &&
        this.$refs.contactNameRef?.validate?.() &&
        this.$refs.contactPhoneRef?.validate?.() &&
        this.$refs.contactEmailRef?.validate?.() &&
        this.$refs.countryRef?.validate?.() &&
        this.$refs.cityRef?.validate?.() &&
        this.$refs.districtRef?.validate?.();

      if (!isValid) {
        this.$q.notify({
          type: "negative",
          color: "red",
          message: this.$t("region.formValidationError"),
        });
        return;
      }

      this.formModel.dealerId = this.formModel.dealer?.id ?? null;
      const address = this.formModel.address;
      this.formModel.address = {
        countryId: address.country.id,
        cityId: address.city.id,
        districtId: address.district.id,
        addressDetail: address.addressDetail,
      };

      if (this.mode === "add") {
        this.addRegion();
      } else if (this.mode === "edit") {
        this.editRegion();
      }
    },
    async addRegion() {
      try {
        const response = await this.$api.post("createRegion", this.formModel);
        if (response.status === 200)
          this.$q.notify({
            progress: true,
            type: "positive",
            color: "green",
            message: this.$t("success"),
          });
        this.$emit("completed");
      } catch (error) {
        this.$logger.error(error);
        this.$q.notify({
          type: "negative",
          message: this.$t("failed"),
        });
      }
    },

    async editRegion() {
      try {
        if (!this.formModel.id) {
          throw new Error("ID bilgisi eksik.");
        }

        this.$logger.log("Form Model edit:", this.formModel);
        const response = await this.$api.put("updateRegion", this.formModel);
        if (response.status === 200)
          this.$q.notify({
            progress: true,
            type: "positive",
            color: "green",
            message: this.$t("success"),
          });
        this.$emit("completed");
      } catch (error) {
        this.$logger.error(error);
        this.$q.notify({
          type: "negative",
          message: this.$t("failed"),
        });
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
    async getCities(countryid) {
      try {
        const response = await this.$api.get(
          `getCitiesWithDistricts/${countryid}`
        );
        this.cities = this.filteredCities = response.data;
      } catch (error) {
        this.$logger.error("Şehir verisi alınamadı:", error);
      }
    },
    async getDealers() {
      try {
        const response = await this.$api.get("getDealers");
        this.dealers = this.filteredDealers = response?.data.data;
      } catch (error) {
        this.$logger.error("getDealers", error);
      }
    },

    filterList(val, update, sourceList, targetList) {
      const source = this[sourceList];
      const normalizedVal = this.$normalizeTurkishString(val);

      update(() => {
        this[targetList] =
          val === ""
            ? source
            : source.filter((item) =>
                this.$normalizeTurkishString(item.name).includes(normalizedVal)
              );
      });
    },
    validatePhoneNumber(val) {
      if (!val) return this.$t("requiredlabel");
      if (!/^5\d{9}$/.test(val)) return this.$t("users.invalidPhoneNumber");
      return true;
    },
    validateEmail(val) {
      if (!val) return this.$t("requiredlabel");
      const emailPattern =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$/;
      if (!emailPattern.test(val)) return this.$t("users.invalidEmail");
      return true;
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
    async onCityChange() {
      this.formModel.address.district = null;

      try {
        this.districts = this.filteredDistricts =
          this.formModel.address.city?.districts;
      } catch (error) {
        this.$logger.error("Şehir verisi alınamadı:", error);
      }
    },
  },
});
</script>
