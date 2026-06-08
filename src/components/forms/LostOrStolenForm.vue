<template>
  <div class="row">
    <!-- Müşteri Bilgileri -->
    <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
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
          <q-list class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  dense
                  outlined
                  v-model="formModel.customer.name"
                  :label="$t('technicalService.customerName')"
                  :rules="[(val) => !!val || 'Bu alan zorunludur']"
                  clearable
                  @update:model-value="isChange_Customer = true"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-5 col-md-5 col-sm-11 col-xs-11">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  outlined
                  dense
                  v-model="formModel.customer.surname"
                  :label="$t('technicalService.customerSurname')"
                  :rules="[(val) => !!val || 'Bu alan zorunludur']"
                  clearable
                  @update:model-value="isChange_Customer = true"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
              <q-item-section>
                <q-btn
                  :disable="mode === 'details'"
                  icon="search"
                  dense
                  class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                  text-color="white"
                  @click="selectCustomerFormVisibile = true"
                  square
                >
                  <q-tooltip>
                    {{ $t("technicalService.customerSearch") }}
                  </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <!-- Telefon -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  filled
                  dense
                  v-model="formModel.customer.phone1"
                  :label="$t('users.phone')"
                  mask="(###) ### ## ##"
                  unmasked-value
                  :rules="[validatePhoneNumber]"
                  lazy-rules
                  clearable
                  @update:model-value="isChange_Customer = true"
                >
                  <template v-slot:append>
                    <q-icon name="phone" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Email -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  dense
                  filled
                  v-model="formModel.customer.email"
                  type="email"
                  :label="$t('login.email')"
                  placeholder="example@mail.com"
                  :rules="[validateEmail]"
                  lazy-rules
                  clearable
                  @update:model-value="isChange_Customer = true"
                >
                  <template v-slot:prepend>
                    <q-icon name="mail" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Şehir -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  :disable="mode === 'details'"
                  filled
                  dense
                  v-model="formModel.customer.address.city"
                  :label="$t('technicalService.selectCity')"
                  clearable
                  filter
                  use-input
                  option-value="id"
                  option-label="name"
                  @update:model-value="onCityChange"
                  :options="filteredCities"
                  @filter="filterCities"
                >
                  <template v-slot:prepend>
                    <q-icon name="location_city" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- İlçe -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  :disable="mode === 'details'"
                  filled
                  dense
                  v-model="formModel.customer.address.district"
                  :options="filteredDistricts"
                  :label="$t('technicalService.selectDistrict')"
                  use-input
                  clearable
                  option-value="id"
                  option-label="name"
                  filter
                  @filter="filterDistricts"
                  @update:model-value="onDistrictChange"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Posta Kodu -->
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  filled
                  dense
                  v-model="formModel.customer.address.postalCode"
                  :label="$t('firm.postalcode')"
                  :mask="zipMask"
                  placeholder="Örn: 34000"
                  :rules="[validateZipCode]"
                  lazy-rules
                  clearable
                  @update:model-value="isChange_Customer = true"
                >
                  <template v-slot:prepend>
                    <q-icon name="local_post_office" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- İletişim -->
            <q-item class="row col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-item-label>{{
                  $t("technicalService.contactOptions")
                }}</q-item-label>
                <div class="row">
                  <!-- İletişim Email -->
                  <q-toggle
                    :disable="mode === 'details'"
                    v-model="formModel.customer.contactViaEmail"
                    color="green"
                    icon="mail"
                    @update:model-value="isChange_Customer = true"
                  >
                    <q-tooltip>
                      {{ $t("technicalService.contactViaEmail") }}
                    </q-tooltip>
                  </q-toggle>
                  <!-- İletişim SMS -->
                  <q-toggle
                    :disable="mode === 'details'"
                    v-model="formModel.customer.contactViaSMS"
                    color="green"
                    icon="sms"
                    @update:model-value="isChange_Customer = true"
                  >
                    <q-tooltip>
                      {{ $t("technicalService.contactViaSMS") }}
                    </q-tooltip>
                  </q-toggle>
                  <!-- İletişim telefon -->
                  <q-toggle
                    :disable="mode === 'details'"
                    v-model="formModel.customer.contactViaPhone"
                    color="green"
                    icon="phone"
                    @update:model-value="isChange_Customer = true"
                  >
                    <q-tooltip>
                      {{ $t("technicalService.contactViaPhone") }}
                    </q-tooltip>
                  </q-toggle>
                </div>
              </q-item-section>
            </q-item>
            <!-- Adres Detayı -->
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  filled
                  dense
                  v-model="formModel.customer.address.addressDetail"
                  :label="$t('headquarters.address')"
                  type="textarea"
                  :rules="[validateAddress]"
                  lazy-rules
                  clearable
                  @update:model-value="isChange_Customer = true"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-action>
          <q-list class="row">
            <!-- Temizle Butonu -->
            <q-item>
              <q-btn
                :disable="mode === 'details'"
                dense
                color="warning"
                :label="$t('users.clear')"
                icon-right="backspace"
                text-color="white"
                :loading="saveLoading"
                class="text-capitalize q-pa-sm q-mx-sm q-ml-auto"
                @click="newCustomer"
              >
              </q-btn
            ></q-item>
            <q-space />
            <!-- Kaydet / Güncelle Butonu -->
            <q-item>
              <q-btn
                v-if="isChange_Customer"
                :disable="mode === 'details'"
                dense
                color="secondary"
                :label="formModel.id ? $t('edit') : $t('save')"
                :icon-right="formModel.id ? 'update' : 'person_add'"
                text-color="white"
                :loading="saveLoading"
                class="text-capitalize q-pa-sm q-mx-sm q-ml-auto"
                @click="addOrUpdateCustomer"
              >
              </q-btn>
            </q-item>
          </q-list>
        </q-card-action>
      </q-card>
    </div>

    <!-- Ürün Bilgileri -->
    <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>
            {{ $t("technicalService.productInformations") }}
          </div>
        </q-card-section>
        <Ribbon
          v-if="formModel.stockSerial?.lostOrStolen"
          :text="$t('technicalService.lostOrStolen')"
          :color="lostOrStolenColor"
          textColor="#f5f5f5"
        />
        <q-separator />
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-4 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  dense
                  use-input
                  :disable="mode === 'details'"
                  outlined
                  v-model="formModel.stockSerial.stockCard.brand"
                  :options="filteredBrands"
                  @filter="filterBrands"
                  option-value="id"
                  option-label="name"
                  :label="$t('products.brand')"
                  clearable
                  @update:model-value="(val) => brandSelected(val)"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  dense
                  use-input
                  :disable="mode === 'details'"
                  outlined
                  v-model="formModel.stockSerial.stockCard.model"
                  :options="filteredModels"
                  @filter="filterModels"
                  option-value="id"
                  option-label="name"
                  :label="$t('products.model')"
                  clearable
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  dense
                  type="date"
                  v-model="formModel.technicalServiceAdmissionDate"
                  :label="$t('technicalService.technicalServiceAdmissionDate')"
                  @update:model-value="onDateSelected"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('technicalService.serialNo')"
                  v-model="formModel.stockSerial.serialNo"
                  :rules="[(val) => !!val || 'Field is required']"
                  v-on:keyup.enter="checkSerialNo()"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
              <q-item-section>
                <q-btn
                  :disable="mode === 'details'"
                  dense
                  class="text-capitalize"
                  icon="done_all"
                  text-color="white"
                  color="warning"
                  @click="checkSerialNo()"
                />
                <q-tooltip>{{ $t("products.checkit") }}</q-tooltip>
              </q-item-section>
              <q-item-section>
                <q-btn
                  :disable="mode === 'details'"
                  dense
                  class="text-capitalize"
                  icon="add"
                  text-color="white"
                  color="secondary"
                  @click="serinumarasınıKaydet()"
                />
                <q-tooltip>{{ $t("products.checkit") }}</q-tooltip>
              </q-item-section>
            </q-item>
            <!-- Açıklama -->
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  filled
                  dense
                  v-model="formModel.description"
                  :label="$t('description')"
                  type="textarea"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="description" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-list class="row col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-space />
              <!-- Kaydet / Güncelle Butonu -->
              <q-item>
                <q-btn
                  v-if="mode === 'details' ? false : true"
                  dense
                  color="secondary"
                  :label="formModel.id ? $t('edit') : $t('save')"
                  :icon-right="formModel.id ? 'update' : 'send'"
                  text-color="white"
                  :loading="saveLoading"
                  class="text-capitalize q-pa-sm q-mx-sm q-ml-auto"
                  @click="addOrUpdateSerial"
                >
                </q-btn>
              </q-item>
            </q-list>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <!-- Select Customer Form -->
  <q-dialog
    v-model="selectCustomerFormVisibile"
    persistent
    dense
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 60vw; max-height: 90vh">
      <q-card-section class="q-pa-sm">
        <q-bar class="q-pa-sm">
          <q-icon name="add_box" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{
              $t("technicalService.faultCodes")
            }}</span>
            {{ $t("edit") }}</q-toolbar-title
          >

          <q-btn
            dense
            flat
            icon="close_fullscreen"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          >
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">{{
              $t("minimize")
            }}</q-tooltip>
          </q-btn>
          <q-btn
            dense
            flat
            icon="open_in_full"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">{{
              $t("maximize")
            }}</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
        <SelectCustomerForm
          class="q-pa-sm"
          v-model="selectedCustomer"
          @completed="CustomerSelectedComplated"
          @close="selectCustomerFormVisibile = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";
import SelectCustomerForm from "src/components/forms/SelectCustomerForm.vue";

export default defineComponent({
  name: "LostOrStolenForm",
  setup(props, { emit }) {
    const $q = useQuasar();
    const formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode == "add") {
      formModel.value.customer = {
        id: null,
        name: "",
        surname: "",
        email: "",
        phoneNumber: "",
        address: {
          city: { name: "Seç" },
          cityId: null,
          district: { name: "Seç" },
          districtId: null,
          postalCode: "",
          addressDetail: "",
        },
      };
      formModel.value.stockSerial = {
        stockCard: {
          brand: "",
          model: "",
        },
      };
    }

    return {
      formModel,
    };
  },
  data() {
    return {
      cities: [],
      filteredCities: [],
      districts: [],
      filteredDistricts: [],
      brands: [],
      models: [],
      filteredBrands: [],
      filteredModels: [],
      selectCustomerFormVisibile: false,
      selectedCustomer: {},
      isChange_Customer: false,
    };
  },
  emits: ["completed"],
  // onBeforeCreate() {
  //   this.localModel = this.modelValue;
  // },
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

  components: {
    SelectCustomerForm,
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$logger.log("formModel", this.formModel);
      this.getCities();
      this.getBrands();
    },

    addOrUpdateCustomer() {
      this.formModel.address.cityId = this.formModel.address.city.id;
      this.formModel.address.districtId = this.formModel.address.district.id;

      let validationMessage = null;
      if (!this.formModel.name) {
        validationMessage = "Ad alanı boş olamaz";
      }
      if (!this.formModel.surname) {
        validationMessage = "Soyad alanı boş olamaz";
      }
      if (!this.formModel.email) {
        validationMessage = "Email alanı boş olamaz";
      }

      if (validationMessage) {
        this.$q.notify({
          progress: true,
          type: "warning",
          color: "warning",
          message: validationMessage,
          caption: this.$t("error"),
        });
        return;
      }

      this.$logger.log("form submitted", this.formModel);
      if (this.mode === "add") {
        this.addCustomer();
      } else if (this.mode === "edit") {
        this.editCustomer();
      }
    },

    async addCustomer() {
      try {
        const response = this.$api
          .post("postCustomer", JSON.stringify(this.formModel))
          .then(() => {
            this.$logger.log(response);

            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: "Başarılı",
              caption: "success",
            });

            this.$emit("completed");
          });
      } catch (error) {}
    },

    async editCustomer() {
      try {
        const response = this.$api
          .put("putCustomer", JSON.stringify(this.formModel))
          .then(() => {
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: this.$t("users.customer"),
              caption: this.$t("success"),
            });

            this.$emit("completed");
          });
      } catch (error) {}
    },

    async getCities() {
      try {
        const response = await this.$api.get("getCities");
        this.cities = response.data;
        this.citiesFiltered = this.cities;
      } catch (error) {
        this.$logger.error("Error fetching cities:", error);
      }
    },

    filterCities(val, update) {
      if (val === "") {
        update(() => {
          this.filteredCities = this.cities;
        });
        return;
      }

      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        this.filteredCities = this.cities.filter((v) =>
          this.$normalizeTurkishString(v.name).includes(normalizedVal)
        );
      });
    },

    filterDistricts(val, update) {
      if (val === "") {
        update(() => {
          this.filteredDistricts = this.districts; // Tüm ilçeleri göster
        });
        return;
      }

      update(() => {
        this.filteredDistricts = this.districts.filter((district) =>
          this.$normalizeTurkishString(district.name).includes(
            this.$normalizeTurkishString(val)
          )
        );
      });
    },

    async onCityChange(city) {
      this.formModel.address.district = null; // İlçeyi sıfırla
      this.districts = this.filteredDistricts = city.districts; // Şehir değişince ilçeleri ara
      this.$logger.log("city", this.filteredDistricts);
    },
    async getBrands() {
      try {
        const response = await this.$api.get("getBrands");
        this.brands = response.data;
        this.filteredBrands = this.brands;
      } catch (error) {
        this.$logger.error("Error fetching brands:", error);
      }
    },

    filterBrands(val, update) {
      if (val === "") {
        update(() => {
          this.filteredBrands = this.brands;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredBrands = this.brands.filter((brand) =>
          brand.name.toLowerCase().includes(needle)
        );
      });
    },

    filterModels(val, update) {
      if (val === "") {
        update(() => {
          this.filteredModels = this.models;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredModels = this.models.filter((model) =>
          model.name.toLowerCase().includes(needle)
        );
      });
    },

    brandSelected(selectedBrand) {
      try {
        this.formModel.stockSerial.stockCard.model = {
          id: 0,
          name: "Model seçiniz",
        };

        if (selectedBrand) {
          this.models = selectedBrand.models;
          this.filteredModels = selectedBrand.models;
        } else {
          this.models = [];
          this.filteredModels = [];
        }
      } catch (error) {
        this.$logger.error("Error brandSelected:", error);
      }
    },

    async checkSerialNo() {
      try {
        var body = {
          stockSerial: this.formModel.stockSerial.serialNo,
        };
        const response = await this.$api.post(`stockSerialControl`, body);
        var stockSerial = response?.data;

        if (stockSerial?.stockCard) {
          this.formModel.customer = stockSerial?.customer;
          this.formModel.stockSerial = stockSerial;

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("technicalService.productFound"),
          });
        } else {
          this.isCondition = false;
          this.$q.notify({
            progress: true,
            type: "warning",
            color: "warning",
            message: this.$t("unsuccessful"),
            caption: this.$t("technicalService.productNotFound"),
          });
        }
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async CustomerSelectedComplated(customer) {
      this.formModel.customer = customer;
      this.formModel.customerId = customer.id;
      this.formModel.customer.notificationPreferences =
        customer.notificationPreferences;
      this.selectCustomerFormVisibile = false;
      this.isChange_Customer = false;
    },

    addOrUpdateSerial() {
      let validationMessage = null;
      if (!this.formModel.customerId) {
        validationMessage = "Müşteri Seçiniz";
      }
      if (!this.formModel.stockSerial.stockCard.model) {
        validationMessage = "Ürün Seçiniz";
      }
      if (!this.formModel.stockSerial.serialNo) {
        validationMessage = "Seri No Giriniz";
      }

      if (validationMessage) {
        this.$q.notify({
          progress: true,
          type: "warning",
          color: "warning",
          message: validationMessage,
          caption: this.$t("warning"),
        });
        return;
      }

      if (this.mode === "add") {
        this.addSerial();
      } else if (this.mode === "edit") {
        this.editSerial();
      }
    },
    async addSerial() {
      try {
        const body = {
          stockCardId: this.formModel.stockSerial.stockCard.model.id,
          serialNo: this.formModel.stockSerial.serialNo,
          description: this.formModel.description,
          customerId: this.formModel.customer.id,
        };
        this.$logger.log("add body", body);
        const response = this.$api
          .post("createLostOrStolen", JSON.stringify(body))
          .then(() => {
            this.$logger.log(response);

            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: this.$t("messages.stokSerialNoAdd"),
              caption: "success",
            });

            this.$emit("completed");
          });
      } catch (error) {}
    },

    async editSerial() {
      try {
        const body = {
          stockCardId: this.formModel.stockSerial.stockCard.model.id,
          serialNo: this.formModel.stockSerial.serialNo,
          description: this.formModel.description,
          customerId: this.formModel.customer.id,
        };
        const response = this.$api
          .put("createLostOrStolen", JSON.stringify(body))
          .then(() => {
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: this.$t("messages.stokSerialNoAdd"),
              caption: this.$t("success"),
            });

            this.$emit("completed");
          });
      } catch (error) {}
    },

    async newCustomer() {
      this.formModel.customer = {
        id: null,
        name: "",
        surname: "",
        email: "",
        phoneNumber: "",
        address: {
          city: { name: "Seç" },
          cityId: null,
          district: { name: "Seç" },
          districtId: null,
          postalCode: "",
          addressDetail: "",
        },
      };
    },
  },
});
</script>
