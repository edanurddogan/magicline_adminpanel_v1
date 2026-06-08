<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("technicalService.customerInformations") }}</div>
        </q-card-section>
        <Ribbon
          v-if="false"
          text="Özel Tasarım"
          color="#239ff1"
          textColor="#f5f5f5"
        />
        <q-separator />
        <q-card-section>
          <q-list class="row items-start">
            <!-- Müşteri Ad -->
            <q-item class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  ref="nameRef"
                  dense
                  outlined
                  v-model="formModel.name"
                  :label="$t('users.name')"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  clearable
                  :disable="mode === 'details'"
                />
              </q-item-section>
            </q-item>

            <!-- Müşteri Soyad -->
            <q-item class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  ref="surnameRef"
                  outlined
                  dense
                  v-model="formModel.surname"
                  :label="$t('users.surname')"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  clearable
                  :disable="mode === 'details'"
                />
              </q-item-section>
            </q-item>

            <!-- :rules="[validatePhoneNumber]" -->
            <!-- Telefon -->
            <q-item class="col-lg-3 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="phoneRef"
                  filled
                  dense
                  v-model="formModel.phone"
                  :label="$t('users.phone')"
                  mask="(+##) (###) ### ## ##"
                  clearable
                  :disable="mode === 'details'"
                >
                  <template v-slot:append>
                    <q-icon name="phone" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Email -->
            <q-item class="col-lg-3 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="emailRef"
                  dense
                  filled
                  v-model="formModel.email"
                  type="email"
                  :label="$t('login.email')"
                  placeholder="example@mail.com"
                  :rules="[validateEmail]"
                  lazy-rules
                  clearable
                  :disable="mode === 'details'"
                >
                  <template v-slot:prepend>
                    <q-icon name="mail" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Bayi -->
            <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="formModel.dealer"
                  :options="filteredDealers"
                  option-value="id"
                  option-label="name"
                  :label="$t('dealer.dealer')"
                  options-dense
                  use-input
                  filled
                  dense
                  clearable
                  :disable="mode === 'details'"
                  style="width: 100%"
                  @filter="
                    (val, update) =>
                      filterList(val, update, 'dealers', 'filteredDealers')
                  "
                >
                  <template v-slot:prepend>
                    <q-icon name="groups" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Dil -->
            <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="formModel.language"
                  :options="languages"
                  option-value="id"
                  option-label="name"
                  :label="$t('users.language')"
                  map-options
                  use-input
                  filled
                  dense
                  clearable
                  :disable="mode === 'details'"
                  @filter="filterLanguages"
                  style="width: 100%"
                >
                  <template v-slot:prepend>
                    <q-icon name="language" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Bireysel ve Kurumsal Seçimi -->
            <q-item
              class="row items-center col-lg-2 col-md-2 col-sm-12 col-xs-12"
            >
              <q-item-section>
                <div class="row q-gutter-md justify-center">
                  <q-radio
                    v-model="formModel.isCorporate"
                    :val="false"
                    :label="$t('firm.personal')"
                    :disable="mode === 'details'"
                  />
                  <q-radio
                    v-model="formModel.isCorporate"
                    :val="true"
                    :label="$t('firm.corporate')"
                    :disable="mode === 'details'"
                  />
                </div>
              </q-item-section>
            </q-item>
            <!-- İletişim -->
            <q-item class="col-lg-2 col-md-2 col-sm-12 col-xs-12">
              <q-item-section>
                <q-item-label class="text-center">{{
                  $t("technicalService.contactOptions")
                }}</q-item-label>
                <div class="row justify-center">
                  <!-- İletişim Email -->
                  <q-toggle
                    v-model="formModel.contactViaEmail"
                    color="green"
                    icon="mail"
                    :disable="mode === 'details'"
                  >
                    <q-tooltip>
                      {{ $t("technicalService.contactViaEmail") }}
                    </q-tooltip>
                  </q-toggle>
                  <!-- İletişim SMS -->
                  <q-toggle
                    v-model="formModel.contactViaSMS"
                    color="green"
                    icon="sms"
                    :disable="mode === 'details'"
                  >
                    <q-tooltip>
                      {{ $t("technicalService.contactViaSMS") }}
                    </q-tooltip>
                  </q-toggle>
                  <!-- İletişim telefon -->
                  <q-toggle
                    v-model="formModel.contactViaPhone"
                    color="green"
                    icon="phone"
                    :disable="mode === 'details'"
                  >
                    <q-tooltip>
                      {{ $t("technicalService.contactViaPhone") }}
                    </q-tooltip>
                  </q-toggle>
                </div>
              </q-item-section>
            </q-item>
            <!-- Ön Provizyon Kontrolü -->
            <q-item
              v-if="mode === 'edit' || mode === 'details'"
              class="col-lg-2 col-md-2 col-sm-12 col-xs-12"
            >
              <q-item-section>
                <q-item-label class="text-center">{{
                  $t("users.allowWithoutPreauth")
                }}</q-item-label>
                <div class="row justify-center">
                  <!-- Ön Provizyonsuz İşlem -->
                  <q-toggle
                    v-model="formModel.allowWithoutPreauth"
                    color="green"
                    icon="payments"
                    :disable="mode === 'details'"
                  >
                    <q-tooltip>
                      {{ $t("users.allowWithoutPreauth") }}
                    </q-tooltip>
                  </q-toggle>
                </div>
              </q-item-section>
            </q-item>
            <!-- Vatandaşlık ve vergi bilgileri -->
            <q-item
              class="row justify-center col-lg-12 col-md-12 col-sm-6 col-xs-6"
            >
              <q-card class="col-lg-12 col-md-12 col-sm-6 col-xs-6 shadow-4">
                <span class="q-pa-md">{{ $t("finance.invoice") }}</span>

                <q-list class="row">
                  <!-- TC Kimlik -->
                  <q-item
                    class="col-lg-3 col-md-3 col-sm-6 col-xs-6"
                    v-if="formModel.isCorporate === false"
                  >
                    <q-item-section>
                      <q-input
                        v-model="formModel.identificationNumber"
                        outlined
                        dense
                        :label="$t('users.idNumber')"
                        mask="###########"
                        unmasked-value
                        clearable
                        :disable="mode === 'details'"
                      >
                      </q-input>
                    </q-item-section>
                  </q-item>

                  <!-- Kurumsal -->
                  <template v-if="formModel.isCorporate === true">
                    <!-- Unvan -->
                    <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                      <q-item-section>
                        <q-select
                          v-model="formModel.firm"
                          :options="filteredFirms"
                          option-value="id"
                          option-label="name"
                          options-dense
                          :label="$t('firm.commercialtitle')"
                          use-input
                          filled
                          dense
                          clearable
                          :disable="mode === 'details'"
                          style="width: 100%"
                          @filter="
                            (val, update) =>
                              filterList(val, update, 'firms', 'filteredFirms')
                          "
                        >
                          <template v-slot:prepend>
                            <q-icon name="groups" />
                          </template>
                        </q-select>
                      </q-item-section>
                    </q-item>
                    <!-- VD -->
                    <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                      <q-item-section>
                        <q-input
                          v-model="formModel.firm.taxOffice"
                          outlined
                          dense
                          readonly
                          clearable
                          :label="$t('firm.taxoffice')"
                          :disable="mode === 'details'"
                        />
                      </q-item-section>
                    </q-item>
                    <!-- VKN -->
                    <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                      <q-item-section>
                        <q-input
                          v-model="formModel.firm.taxNumber"
                          outlined
                          dense
                          readonly
                          clearable
                          :label="$t('firm.taxnumber')"
                          :disable="mode === 'details'"
                        />
                      </q-item-section>
                    </q-item>
                  </template>
                </q-list>
              </q-card>
            </q-item>
            <!-- Mobil işletim sistemi -->
            <q-item
              v-if="mode !== 'add'"
              class="col-lg-3 col-md-3 col-sm-6 col-xs-6"
            >
              <q-item-section>
                <q-input
                  outlined
                  dense
                  readonly
                  v-model="formModel.mobileOs"
                  :label="$t('reports.mobileOs')"
                />
              </q-item-section>
            </q-item>
            <!-- İşletim Sistemi Versiyonu -->
            <q-item
              v-if="mode !== 'add'"
              class="col-lg-3 col-md-3 col-sm-6 col-xs-6"
            >
              <q-item-section>
                <q-input
                  outlined
                  dense
                  readonly
                  v-model="formModel.osVersion"
                  :label="$t('reports.osVersion')"
                />
              </q-item-section>
            </q-item>
            <!--Uygulama Versiyonu -->
            <q-item
              v-if="mode !== 'add'"
              class="col-lg-3 col-md-3 col-sm-6 col-xs-6"
            >
              <q-item-section>
                <q-input
                  outlined
                  dense
                  readonly
                  v-model="formModel.appVersion"
                  :label="$t('reports.appVersion')"
                />
              </q-item-section>
              <!-- Son giriş Tarihi -->
            </q-item>
            <q-item
              v-if="mode !== 'add'"
              class="col-lg-3 col-md-3 col-sm-6 col-xs-6"
            >
              <q-item-section>
                <q-input
                  outlined
                  dense
                  readonly
                  v-model="lastLoginDate"
                  :label="$t('reports.lastLogin')"
                />
              </q-item-section>
            </q-item>

            <!-- Ülke -->
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  v-model="formModel.address.country"
                  :options="countries"
                  option-value="id"
                  option-label="name"
                  :label="$t('firm.country')"
                  map-options
                  filled
                  dense
                  clearable
                  :disable="mode === 'details'"
                  @update:model-value="onCountryChange()"
                  style="width: 100%"
                >
                  <template v-slot:prepend>
                    <q-icon name="public" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Şehir -->
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  v-model="formModel.address.city"
                  option-value="id"
                  option-label="name"
                  :options="filteredCities"
                  :label="$t('firm.city')"
                  use-input
                  map-options
                  filled
                  dense
                  clearable
                  :disable="!formModel.address.country || mode === 'details'"
                  @filter="
                    (val, update) =>
                      filterList(val, update, 'cities', 'filteredCities')
                  "
                  @update:model-value="onCityChange()"
                  style="width: 100%"
                >
                  <template v-slot:prepend>
                    <q-icon name="location_city" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- İlçe -->
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  filled
                  dense
                  v-model="formModel.address.district"
                  :options="filteredDistricts"
                  :label="$t('technicalService.selectDistrict')"
                  use-input
                  clearable
                  option-value="id"
                  option-label="name"
                  filter
                  :disable="!formModel.address.city || mode === 'details'"
                  @filter="
                    (val, update) =>
                      filterList(val, update, 'districts', 'filteredDistricts')
                  "
                  style="width: 100%"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Posta Kodu -->
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  filled
                  dense
                  v-model="formModel.address.postalCode"
                  :label="$t('firm.postalcode')"
                  :mask="zipMask"
                  placeholder="Örn: 34000"
                  lazy-rules
                  clearable
                  :disable="mode === 'details'"
                >
                  <template v-slot:prepend>
                    <q-icon name="local_post_office" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <!-- Adres Detayı -->
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  filled
                  dense
                  v-model="formModel.address.addressDetail"
                  :label="$t('headquarters.address')"
                  type="textarea"
                  clearable
                  :rows="2"
                  :disable="mode === 'details'"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Müşteri Araç Bilgileri -->
            <div
              v-if="formModel.id"
              class="col-lg-12 col-md-12 col-sm-6 col-xs-6"
              :style="{
                opacity: mode === 'details' ? 0.5 : 1,
                pointerEvents: mode === 'details' ? 'none' : 'auto',
              }"
            >
              <customer-vehicles-form :modelValue="formModel" />
            </div>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <!-- Durum ve Kayıt Butonları -->
    <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
      <q-item-section>
        <q-toggle
          class="col-lg-1 col-md-1 col-sm-8 col-xs-12"
          :label="formModel.isActive === true ? $t('active') : $t('inactive')"
          color="green"
          checked-icon="check"
          unchecked-icon="cancel"
          :disable="mode === 'details'"
          v-model="formModel.isActive"
        />
        <q-btn
          dense
          color="primary"
          class="text-capitalize q-pa-sm q-ml-auto"
          :loading="saveLoading"
          :icon-right="formModel.id ? 'update' : 'person_add'"
          :style="{ display: mode === 'details' ? 'none' : 'block' }"
          @click="onSubmit"
        >
          {{ mode === "edit" ? $t("updatedata") : $t("savedata") }}
        </q-btn>
      </q-item-section>
    </q-item>
  </div>
</template>
<script>
import { defineComponent, computed } from "vue";
import CustomerVehiclesForm from "src/components/forms/CustomerVehiclesForm.vue";

export default defineComponent({
  name: "CustomerForm",
  components: {
    CustomerVehiclesForm,
  },
  setup(props, { emit }) {
    let formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode == "add") {
      Object.assign(formModel.value, {
        contactViaEmail: true,
        contactViaSMS: true,
        contactViaPhone: true,
        isCorporate: false,
        isActive: true,
        allowWithoutPreauth: false,
        firm: { name: "Seç" },
        address: {
          country: { name: "Seç" },
          city: { name: "Seç" },
          district: { name: "Seç" },
        },
      });
    } else {
      if (!formModel.value.addressId)
        formModel.value.address = { country: null, city: null, district: null };
      if (!formModel.value.firm) formModel.value.firm = { name: "Seç" };
    }

    return { formModel };
  },

  data() {
    return {
      languages: [],
      dealers: [],
      firms: [],
      countries: [],
      cities: [],
      districts: [],
      filteredCities: [],
      filteredDealers: [],
      filteredFirms: [],
      filteredDistricts: [],
    };
  },
  emits: ["completed"],

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

  computed: {
    lastLoginDate() {
      return this.formatDate(this.formModel.lastLoginDate);
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        this.getCountries();
        this.getFirmList();
        this.getDealers();
        this.getLanguages();
        if (this.formModel.addressId) {
          await this.getCities(this.formModel.address.countryId); // Ülkenin şehirlerini al
          // Şehiri bul ve ilçeleri getir
          this.districts = this.filteredDistricts =
            this.cities.find((c) => c.id === this.formModel.address.cityId)
              ?.districts || [];
        }
        this.$logger.log("form Customer", this.formModel);
      } catch (error) {
        this.$logger.error("init:", error);
      }
    },

    async onSubmit() {
      try {
        // Form doğrulama
        const isValid =
          (await this.$refs.nameRef?.validate?.()) &&
          (await this.$refs.surnameRef?.validate?.()) &&
          (await this.$refs.phoneRef?.validate?.()) &&
          (await this.$refs.emailRef?.validate?.());

        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }
        // Form model güncelleme
        const model = this.formModel;
        model.phone = "+" + model.phone.replace(/\D/g, ""); // Telefonda sadece rakam kalması
        model.dealerId = model.dealer ? model.dealer.id : null; // Bayi Id
        model.languageId = model.language ? model.language.id : null; // Dil Id
        model.firmId = model.isCorporate ? model.firm.id : null;
        model.allowWithoutPreauth = model.allowWithoutPreauth === true;

        // Form model Adres güncelleme
        if (model.addressId) {
          this.formModel.address = {
            ...model.address,
            countryId: model.address.country.id,
            cityId: model.address.city.id,
            districtId: model.address.district.id,
          };
        } else {
          delete this.formModel.address;
          delete this.formModel.addressId;
        }

        this.$logger.log("Customer formModel", this.formModel);
        if (this.mode === "add") {
          this.addFormModel();
        } else {
          this.updateFormModel();
        }
      } catch (error) {
        this.$logger.error("Hata:", error);
      }
    },
    async addFormModel() {
      try {
        const response = await this.$api.post("postCustomer", this.formModel); // Customer Kayıt
        if (response.status == 200) {
          this.formModel.id = response.data.id;
          this.$q.notify({ type: "positive", message: this.$t("saved") });
          this.$emit("completed");
        }
      } catch (error) {
        this.$logger.error("Error add Customer:", error);
      }
    },
    async updateFormModel() {
      try {
        const response = await this.$api.put("putCustomer", this.formModel); // Customer Güncelleme
        if (response.status === 200)
          this.$q.notify({ type: "positive", message: this.$t("updated") });
        this.$emit("completed");
      } catch (error) {
        this.$logger.error("Error update Customer:", error);
      }
    },

    async getDealers() {
      try {
        this.loading = true;
        const response = await this.$api.get("getDealers");
        this.dealers = this.filteredDealers = response?.data.data || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getDealers error", error);
      }
    },
    async getFirmList() {
      try {
        const response = await this.$api.get("firmDetailList");
        this.firms = this.filteredFirms = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getLanguages() {
      try {
        this.loading = true;
        const response = await this.$api.get("/languages");
        this.languages = response?.data || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getLanguages error", error);
      }
    },
    async getCountries() {
      try {
        const response = await this.$api.get("getCountries");
        this.countries = response.data;
      } catch (error) {
        this.$logger.error("getCountries:", error);
      }
    },
    async getCities(countryId) {
      try {
        const response = await this.$api.get(
          `getCitiesWithDistricts/${countryId}`,
        );
        this.cities = response.data;
      } catch (error) {
        this.$logger.error("Şehir verisi alınamadı:", error);
      }
    },

    onCountryChange() {
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
        this.districts = this.formModel.address.city?.districts;
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

    formatDate(val) {
      if (!val) return "-";
      try {
        return new Date(val).toLocaleString("tr-TR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        this.$logger.error("formatDate:", error);
      }
    },
    validatePhoneNumber(val) {
      try {
        if (!val) return this.$t("requiredlabel");
        if (!/\d{9}$/.test(val)) return this.$t("users.invalidPhoneNumber");
        return true;
      } catch (error) {
        this.$logger.error("validatePhoneNumber:", error);
      }
    },
    validateEmail(val) {
      try {
        if (!val) return this.$t("requiredlabel");
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
