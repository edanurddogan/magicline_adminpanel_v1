<template>
  <q-form ref="firmFormRef" class="row">
    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("firm.currentinfo") }}</div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  ref="nameRef"
                  dense
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.name')"
                  v-model="formModel.name"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  clearable
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  ref="commercialTitleRef"
                  dense
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.commercialtitle')"
                  v-model="formModel.commercialTitle"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  clearable
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  ref="taxNumberRef"
                  dense
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.taxnumber')"
                  v-model="formModel.taxNumber"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  clearable
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  ref="taxOfficeRef"
                  dense
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.taxoffice')"
                  v-model="formModel.taxOffice"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  clearable
                />
              </q-item-section>
            </q-item>

            <q-item class="q-pa-sm col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-toggle
                  dense
                  :label="formModel.isActive ? $t('active') : $t('inactive')"
                  v-model="formModel.isActive"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="cancel"
                  :disable="mode === 'details'"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("firm.contactinfo") }}</div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  ref="phoneRef"
                  dense
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.phone')"
                  v-model="formModel.phone"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="phone" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  ref="emailRef"
                  dense
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.email')"
                  v-model="formModel.email"
                  :rules="[validateEmail]"
                  lazy-rules
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="mail" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.website')"
                  v-model="formModel.website"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="link" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.fax')"
                  v-model="formModel.fax"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="print" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card-section class="bg-primary text-white">
        <div>{{ $t("firm.addressinfo") }}</div>
      </q-card-section>
      <q-separator />

      <q-card-section>
        <q-list class="row">
          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
            <q-item-section>
              <q-input
                dense
                outlined
                :disable="mode === 'details'"
                :label="$t('firm.addressTitle')"
                v-model="formModel.invoiceAddress.addressTitle"
                placeholder="Örn: Fatura Adresi"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="badge" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
            <q-item-section>
              <q-input
                ref="postalCodeRef"
                dense
                outlined
                :disable="mode === 'details'"
                :label="$t('firm.postalcode')"
                v-model="formModel.invoiceAddress.postalCode"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="local_post_office" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="col-lg-2 col-md-3 col-sm-6 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.invoiceAddress.country"
                :options="countries"
                option-value="id"
                option-label="name"
                :label="$t('firm.country')"
                map-options
                filled
                dense
                clearable
                :disable="mode === 'details'"
                @update:model-value="onCountryChange"
              >
                <template v-slot:prepend>
                  <q-icon name="public" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>

          <q-item class="col-lg-2 col-md-3 col-sm-6 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.invoiceAddress.city"
                :options="filteredCities"
                option-value="id"
                option-label="name"
                :label="$t('firm.city')"
                use-input
                map-options
                filled
                dense
                clearable
                :disable="
                  !formModel.invoiceAddress.country || mode === 'details'
                "
                @filter="
                  (val, update) =>
                    filterList(val, update, 'cities', 'filteredCities')
                "
                @update:model-value="onCityChange"
              >
                <template v-slot:prepend>
                  <q-icon name="location_city" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>

          <q-item class="col-lg-2 col-md-3 col-sm-6 col-xs-12">
            <q-item-section>
              <q-select
                v-model="formModel.invoiceAddress.district"
                :options="filteredDistricts"
                option-value="id"
                option-label="name"
                :label="$t('region.region')"
                use-input
                filled
                dense
                clearable
                :disable="!formModel.invoiceAddress.city || mode === 'details'"
                @filter="
                  (val, update) =>
                    filterList(val, update, 'districts', 'filteredDistricts')
                "
              >
                <template v-slot:prepend>
                  <q-icon name="place" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>

          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                ref="addressDetailRef"
                dense
                outlined
                type="textarea"
                :rows="2"
                :disable="mode === 'details'"
                :label="$t('firm.firmAddress')"
                v-model="formModel.invoiceAddress.addressDetail"
                :rules="[(val) => !!val || $t('requiredlabel')]"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="place" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-item-section>
        <q-btn
          dense
          color="primary"
          class="text-capitalize q-pa-sm q-ml-auto"
          :loading="saveLoading"
          :icon-right="formModel.id ? 'update' : 'save'"
          :style="{ display: mode === 'details' ? 'none' : 'block' }"
          @click="onSubmit"
        >
          {{ mode === "edit" ? $t("updatedata") : $t("savedata") }}
        </q-btn>
      </q-item-section>
    </q-item>
  </q-form>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "FirmForm",

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

  emits: ["completed", "update:modelValue"],

  setup(props, { emit }) {
    const formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode === "add") {
      Object.assign(formModel.value, {
        name: "",
        commercialTitle: "",
        firmCode: "",
        accountCode: "",
        taxNumber: "",
        taxOffice: "",
        phone: "",
        fax: null,
        website: null,
        email: "",
        isActive: true,
        invoiceAddressId: null,
        invoiceAddress: {
          addressTitle: "",
          addressDetail: "",
          postalCode: "",
          country: null,
          city: null,
          district: null,
          countryId: null,
          cityId: null,
          districtId: null,
        },
      });
    } else {
      if (!formModel.value.invoiceAddress) {
        formModel.value.invoiceAddress = {
          addressTitle: "",
          addressDetail: "",
          postalCode: "",
          country: null,
          city: null,
          district: null,
          countryId: null,
          cityId: null,
          districtId: null,
        };
      }
    }

    return { formModel };
  },

  data() {
    return {
      saveLoading: false,
      countries: [],
      cities: [],
      districts: [],
      filteredCities: [],
      filteredDistricts: [],
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    ensureInvoiceAddressShape() {
      if (!this.formModel.invoiceAddress) {
        this.formModel.invoiceAddress = {
          addressTitle: "",
          addressDetail: "",
          postalCode: "",
          country: null,
          city: null,
          district: null,
          countryId: null,
          cityId: null,
          districtId: null,
        };
      }
    },

    async hydrateInvoiceAddressById() {
      const invoiceAddressId = this.formModel?.invoiceAddressId;
      if (!invoiceAddressId) {
        return;
      }

      const current = this.formModel?.invoiceAddress || {};
      const hasAddressContent =
        !!current.addressDetail ||
        !!current.addressTitle ||
        !!current.postalCode ||
        !!current.countryId ||
        !!current.cityId ||
        !!current.districtId;

      if (hasAddressContent) {
        return;
      }

      try {
        const response = await this.$api.get(
          "getAddressById/" + invoiceAddressId,
        );
        const address = response?.data || {};

        this.formModel.invoiceAddress = {
          ...this.formModel.invoiceAddress,
          addressTitle: address?.addressTitle || "",
          addressDetail: address?.addressDetail || "",
          postalCode: address?.postalCode || "",
          country: address?.country || null,
          city: address?.city || null,
          district: address?.district || null,
          countryId: address?.countryId || address?.country?.id || null,
          cityId: address?.cityId || address?.city?.id || null,
          districtId: address?.districtId || address?.district?.id || null,
        };
      } catch (error) {
        this.$logger.warn("getAddressById failed:", error);
      }
    },

    buildInvoiceAddressPayload() {
      const invoiceAddress = this.formModel?.invoiceAddress || {};

      return {
        addressTitle: invoiceAddress.addressTitle || "",
        addressDetail: invoiceAddress.addressDetail || "",
        postalCode: invoiceAddress.postalCode || "",
        countryId:
          invoiceAddress.countryId || invoiceAddress.country?.id || null,
        cityId: invoiceAddress.cityId || invoiceAddress.city?.id || null,
        districtId:
          invoiceAddress.districtId || invoiceAddress.district?.id || null,
      };
    },

    async saveInvoiceAddressAndBindId() {
      const payload = this.buildInvoiceAddressPayload();
      const hasAddressInput =
        !!payload.addressTitle ||
        !!payload.addressDetail ||
        !!payload.postalCode ||
        !!payload.countryId ||
        !!payload.cityId ||
        !!payload.districtId;

      if (!hasAddressInput) {
        return;
      }

      const currentAddressId = this.formModel?.invoiceAddressId;

      if (currentAddressId) {
        try {
          await this.$api.put("addresses", {
            ...payload,
            id: currentAddressId,
          });
          this.formModel.invoiceAddressId = currentAddressId;
          return;
        } catch (error) {
          this.$logger.warn(
            "Address update failed, fallback to insert:",
            error,
          );
        }
      }

      const response = await this.$api.post("addresses", payload);
      const newAddressId =
        response?.data?.id ||
        response?.data?.addressId ||
        response?.data?.invoiceAddressId ||
        currentAddressId ||
        null;

      this.formModel.invoiceAddressId = newAddressId;
    },

    async init() {
      try {
        await this.getCountries();

        this.ensureInvoiceAddressShape();
        await this.hydrateInvoiceAddressById();

        if (this.formModel.invoiceAddress.countryId) {
          await this.getCities(this.formModel.invoiceAddress.countryId);

          if (!this.formModel.invoiceAddress.country) {
            this.formModel.invoiceAddress.country =
              this.countries.find(
                (item) => item.id === this.formModel.invoiceAddress.countryId,
              ) || null;
          }

          if (this.formModel.invoiceAddress.cityId) {
            this.formModel.invoiceAddress.city =
              this.cities.find(
                (item) => item.id === this.formModel.invoiceAddress.cityId,
              ) || null;

            this.districts = this.filteredDistricts =
              this.formModel.invoiceAddress.city?.districts || [];
          }

          if (this.formModel.invoiceAddress.districtId) {
            this.formModel.invoiceAddress.district =
              this.districts.find(
                (item) => item.id === this.formModel.invoiceAddress.districtId,
              ) || null;
          }
        }

        this.$logger.log("form Firm", this.formModel);
      } catch (error) {
        this.$logger.error("init:", error);
      }
    },

    async onSubmit() {
      try {
        const isValid =
          (await this.$refs.nameRef?.validate?.()) &&
          (await this.$refs.commercialTitleRef?.validate?.()) &&
          (await this.$refs.taxNumberRef?.validate?.()) &&
          (await this.$refs.taxOfficeRef?.validate?.()) &&
          (await this.$refs.emailRef?.validate?.()) &&
          (await this.$refs.addressDetailRef?.validate?.());

        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }

        this.saveLoading = true;

        const model = this.formModel;

        if (model.phone) {
          model.phone = model.phone.trim();
        }

        if (!model.invoiceAddress) {
          model.invoiceAddress = {
            addressTitle: "",
            addressDetail: "",
            postalCode: "",
            country: null,
            city: null,
            district: null,
            countryId: null,
            cityId: null,
            districtId: null,
          };
        }

        model.invoiceAddress.countryId = model.invoiceAddress.country
          ? model.invoiceAddress.country.id
          : null;

        model.invoiceAddress.cityId = model.invoiceAddress.city
          ? model.invoiceAddress.city.id
          : null;

        model.invoiceAddress.districtId = model.invoiceAddress.district
          ? model.invoiceAddress.district.id
          : null;

        await this.saveInvoiceAddressAndBindId();

        this.$logger.log("Firm formModel", this.formModel);

        if (this.mode === "add") {
          await this.addFormModel();
        } else {
          await this.updateFormModel();
        }
      } catch (error) {
        this.$logger.error("Hata:", error);
      } finally {
        this.saveLoading = false;
      }
    },

    async addFormModel() {
      try {
        const response = await this.$api.post("insertFirm", this.formModel);
        this.$logger.log("addFormModel response", response);

        if (response && response.status === 200) {
          this.formModel.id = response?.data?.id || this.formModel.id;
          this.formModel.firmCode =
            response?.data?.firmCode || this.formModel.firmCode;
          this.formModel.invoiceAddressId =
            response?.data?.invoiceAddressId || this.formModel.invoiceAddressId;

          if (
            !this.formModel.invoiceAddressId &&
            this.formModel.invoiceAddress?.addressDetail
          ) {
            this.$q.notify({
              type: "warning",
              message:
                "Firma kaydedildi ancak fatura adresi ilişkilendirilmedi.",
            });
          } else {
            this.$q.notify({
              type: "positive",
              message: this.$t("saved"),
            });
          }

          this.$emit("completed");
        }
      } catch (error) {
        this.$logger.error("Error addFormModel:", error);
        throw error;
      }
    },

    async updateFormModel() {
      try {
        const response = await this.$api.put("firms", this.formModel);

        if (response && response.status === 200) {
          if (
            !this.formModel.invoiceAddressId &&
            this.formModel.invoiceAddress?.addressDetail
          ) {
            this.$q.notify({
              type: "warning",
              message:
                "Firma güncellendi ancak fatura adresi ilişkilendirilmedi.",
            });
          } else {
            this.$q.notify({
              type: "positive",
              message: this.$t("updated"),
            });
          }

          this.$emit("completed");
        }
      } catch (error) {
        this.$logger.error("Error updateFormModel:", error);
        throw error;
      }
    },

    async getCountries() {
      try {
        const response = await this.$api.get("getCountries");
        this.countries = response?.data || [];
      } catch (error) {
        this.$logger.error("getCountries:", error);
      }
    },

    async getCities(countryId) {
      try {
        const response = await this.$api.get(
          `getCitiesWithDistricts/${countryId}`,
        );
        this.cities = response?.data || [];
        this.filteredCities = [...this.cities];
      } catch (error) {
        this.$logger.error("Şehir verisi alınamadı:", error);
      }
    },

    async onCountryChange() {
      try {
        this.formModel.invoiceAddress.city = null;
        this.formModel.invoiceAddress.district = null;
        this.formModel.invoiceAddress.cityId = null;
        this.formModel.invoiceAddress.districtId = null;
        this.cities = [];
        this.filteredCities = [];
        this.districts = [];
        this.filteredDistricts = [];

        if (!this.formModel.invoiceAddress.country?.id) {
          return;
        }

        this.formModel.invoiceAddress.countryId =
          this.formModel.invoiceAddress.country.id;

        await this.getCities(this.formModel.invoiceAddress.country.id);
      } catch (error) {
        this.$logger.error("Ülke verisi alınamadı:", error);
      }
    },

    onCityChange() {
      try {
        this.formModel.invoiceAddress.district = null;
        this.formModel.invoiceAddress.districtId = null;
        this.formModel.invoiceAddress.cityId =
          this.formModel.invoiceAddress.city?.id || null;

        this.districts = this.formModel.invoiceAddress.city?.districts || [];
        this.filteredDistricts = [...this.districts];
      } catch (error) {
        this.$logger.error("onCityChange:", error);
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
                this.$normalizeTurkishString(item.name).includes(normalizedVal),
              );
      });
    },

    validateEmail(val) {
      try {
        if (!val) return true;

        const emailPattern =
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$/;

        if (!emailPattern.test(val)) return this.$t("users.invalidEmail");
        return true;
      } catch (error) {
        this.$logger.error("validateEmail:", error);
      }
    },
  },
});
</script>
