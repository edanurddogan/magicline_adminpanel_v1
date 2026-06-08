<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <!--Kullanıcı Filtreleri -->
  <div class="q-ma-md">
    <q-card class="q-pa-md">
      <span class="text-subtitle2 text-blue-6">{{
        $t("bulkSmsEmail.receiverFilters")
      }}</span>
      <!-- Mobile ve diğer filteler Seçimi -->
      <q-item dense class="row q-col-gutter-md q-gutter-y-md">
        <q-item-section avatar>
          <q-radio
            v-model="selectedFilter"
            val="mobile"
            @update:model-value="onFilterChange"
          />
        </q-item-section>
        <!-- Ülke Seçimi -->
        <q-item-section class="col-lg-2 col-md-6 col-sm-12 col-xs-12">
          <q-select
            v-model="selectedCountry"
            :options="filteredCountries"
            option-value="id"
            option-label="name"
            :label="$t('firm.country')"
            :loading="loading"
            :disable="selectedFilter !== 'mobile'"
            map-options
            clearable
            outlined
            dense
            options-dense
            use-input
            transition-show="scale"
            transition-hide="scale"
            @filter="filterLicensePlate"
            @update:model-value="getCities(selectedCountry)"
            style="width: 100%"
          >
            <template #prepend>
              <q-icon name="public" />
            </template>
          </q-select>
        </q-item-section>
        <!-- Şehir Seçimi -->
        <q-item-section class="col-lg-2 col-md-6 col-sm-12 col-xs-12">
          <q-select
            v-model="selectedCities"
            :options="filteredCities"
            option-value="id"
            option-label="name"
            :label="$t('firm.city')"
            :loading="loading"
            :disable="selectedFilter !== 'mobile' || !selectedCountry"
            multiple
            map-options
            hide-selected
            clearable
            outlined
            dense
            options-dense
            use-input
            transition-show="scale"
            transition-hide="scale"
            @update:model-value="onCityChange()"
            @filter="
              (val, update) =>
                filterList(val, update, 'cities', 'filteredCities')
            "
            style="width: 100%"
          >
            <template #prepend>
              <q-icon name="location_city" />
            </template>
          </q-select>
        </q-item-section>
        <!-- mobileOs Seçimi -->
        <q-item-section class="col-lg-2 col-md-6 col-sm-12 col-xs-12">
          <q-select
            v-model="selectedMobileOs"
            :options="mobileOs"
            option-value="id"
            option-label="name"
            :label="$t('reports.mobileOs')"
            :loading="loading"
            :disable="selectedFilter !== 'mobile'"
            multiple
            map-options
            clearable
            outlined
            dense
            options-dense
            use-input
            transition-show="scale"
            transition-hide="scale"
            @filter="filterStations"
            @update:model-value="onMobileOsChange()"
            style="width: 100%"
          >
            <template #prepend>
              <q-icon name="devices" />
            </template>
          </q-select>
        </q-item-section>
        <!-- Operating system Seçimi -->
        <q-item-section class="col-lg-2 col-md-6 col-sm-12 col-xs-12">
          <q-select
            v-model="selectedOsVersions"
            :options="filteredOsVersions"
            option-value="id"
            option-label="name"
            :label="$t('reports.osVersion')"
            :disable="selectedFilter !== 'mobile'"
            multiple
            map-options
            outlined
            dense
            options-dense
            use-input
            clearable
            transition-show="scale"
            transition-hide="scale"
            @update:model-value="onOsVersionChange()"
            style="width: 100%"
          >
            <template #prepend>
              <q-icon name="devices" />
            </template>
          </q-select>
        </q-item-section>
        <!-- App Sistemi Seçimi -->
        <q-item-section class="col-lg-2 col-md-6 col-sm-12 col-xs-12">
          <q-select
            v-model="selectedAppVersions"
            :options="appVersions"
            option-value="id"
            option-label="name"
            :label="$t('reports.appVersion')"
            :disable="selectedFilter !== 'mobile'"
            multiple
            map-options
            outlined
            dense
            options-dense
            use-input
            clearable
            transition-show="scale"
            transition-hide="scale"
            @update:model-value="onAppVersionChange()"
            style="width: 100%"
          >
            <template #prepend>
              <q-icon name="devices" />
            </template>
          </q-select>
        </q-item-section>
      </q-item>
      <!-- Bölge Filtresi Seçimi -->
      <q-item dense class="row q-col-gutter-md q-gutter-y-md">
        <q-item-section avatar>
          <q-radio
            v-model="selectedFilter"
            val="region"
            @update:model-value="onFilterChange"
          />
        </q-item-section>
        <!-- Bölge Seçimi -->
        <q-item-section class="col-lg-2 col-md-6 col-sm-12 col-xs-12">
          <q-select
            v-model="selectedRegions"
            :options="filteredRegions"
            option-value="id"
            option-label="name"
            :label="$t('region.regions')"
            :loading="loading"
            :disable="selectedFilter !== 'region'"
            multiple
            map-options
            clearable
            outlined
            dense
            options-dense
            use-input
            transition-show="scale"
            transition-hide="scale"
            @filter="
              (val, update) =>
                filterList(val, update, 'regions', 'filteredRegions')
            "
            @update:model-value="getCustomersByStationRegions()"
            style="width: 100%"
          >
            <template #prepend>
              <q-icon name="location_on" />
            </template>
          </q-select>
        </q-item-section>

        <q-space></q-space>
        <!-- Listele Butonu -->
        <q-item class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
          <q-item-section>
            <q-btn
              class="full-width text-capitalize q-py-sm"
              no-caps
              color="primary"
              :label="listStatus ? $t('hide') : $t('list')"
              @click="listStatus = !listStatus"
            >
              <q-badge color="orange" floating>{{
                selectedCustomers.length
              }}</q-badge>
              <q-tooltip>{{ $t("list") }}</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-item>
    </q-card>
  </div>

  <!-- Mesaj Oluşturma Kartı -->
  <div class="q-ma-md">
    <q-card class="q-pa-md">
      <span class="text-subtitle2 text-blue-6">{{
        $t("bulkSmsEmail.sendSmsEmail")
      }}</span>
      <!-- SMS veya E-Mail Seçimi -->
      <q-item dense class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <q-item-section>
          <div class="row q-gutter-md justify-center">
            <q-radio v-model="sendType" val="SMS" label="SMS" />
          </div>
        </q-item-section>
      </q-item>
      <!-- Email eklenecek -->
      <!-- <q-radio v-model="sendType" val="Email" label="E-Mail" /> -->

      <!-- Template Seçimi -->
      <div class="row items-start q-col-gutter-md q-gutter-y-md">
        <q-item class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
          <q-item-section>
            <q-select
              v-model="selectedTemplate"
              :options="templates"
              option-value="id"
              option-label="name"
              :label="$t('bulkSmsEmail.selectTemplate')"
              :loading="loading"
              clearable
              outlined
              dense
              options-dense
              use-input
              transition-show="scale"
              transition-hide="scale"
              @filter="filterLicensePlate"
              @update:model-value="onTemplateChange()"
              style="width: 100%"
            >
              <template #prepend>
                <q-icon name="edit_document" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <!-- Editör Bölümü -->
        <q-item class="column col-lg-9 col-md-9 col-sm-12 col-xs-12">
          <q-input
            v-if="sendType == 'Email'"
            v-model="subject"
            type="text"
            :label="$t('order.title')"
            outlined
            dense
            options-dense
            class="q-mb-sm"
            style="width: 100%"
          >
          </q-input>
          <!-- Mail de q-editör kullanılacak -->
          <q-editor v-if="sendType == 'Email'" v-model="editor" :height="150" />
          <q-input
            v-if="sendType == 'SMS'"
            v-model="editor"
            type="textarea"
            outlined
            dense
          />
        </q-item>
      </div>
      <!-- Gönder Butonu -->
      <div class="row justify-end">
        <q-item class="col-lg-1 col-md-2 col-sm-4 col-xs-12">
          <q-item-section>
            <q-btn
              class="full-width text-capitalize q-py-sm"
              no-caps
              color="primary"
              :label="$t('send')"
              @click="onConfirm()"
            >
              <q-tooltip>{{ $t("bulkSmsEmail.sendSmsEmail") }}</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </div>
    </q-card>
  </div>

  <!-- List Card -->
  <div class="q-ma-md" v-show="listStatus">
    <q-card class="q-pa-md">
      <q-table
        ref="table"
        flat
        dense
        bordered
        :rows="selectedCustomers"
        :columns="columns"
        :loading="loading"
        :filter="filter"
        :pagination="pagination"
        :loading-label="$t('loading')"
        :no-data-label="$t('nodatalabel')"
        :no-results-label="$t('noresultslabel')"
        row-key="id"
      >
        <template v-slot:top="props">
          <div class="row col-12">
            <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
              {{ $t("users.users") }}
            </div>
            <q-space />
            <!-- Arama Butonu -->
            <q-input
              class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
              bottom-slots
              dense
              debounce="300"
              v-model="filter"
              :placeholder="$t('users.search')"
            >
              <template v-slot:append
                ><q-icon
                  v-if="filter !== ''"
                  name="close"
                  @click="filter = ''"
                  class="cursor-pointer"
                />
                <q-icon name="search" />
              </template>
            </q-input>
            <q-space />

            <q-space />
            <!-- Full Screen Butonu -->
            <q-btn
              flat
              round
              dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            >
              <q-tooltip>
                {{ $t("maximize") }}
              </q-tooltip>
            </q-btn>
            <q-space />
            <!-- Export Excel Butonu -->
            <q-btn
              :label="$t('export')"
              class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
              icon="cloud_download"
              @click="exportTable"
            />
          </div>
        </template>

        <template #body-cell-isActive="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.isActive === true ? 'green' : 'red'"
              text-color="white"
              dense
              class="text-weight-bolder"
              square
            >
              {{ props.row.isActive ? $t("active") : $t("inactive") }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:no-data="{ icon, message, filter }">
          <div class="full-width row flex-center q-gutter-sm">
            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
            <span> {{ message }}... </span>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>

  <!-- Send Confirm Dialog -->
  <q-dialog v-model="sendConfirm" persistent>
    <q-card class="q-pa-md text-center">
      <q-card-section>
        <q-avatar
          size="56px"
          icon="send"
          color="secondary"
          text-color="white"
        />
      </q-card-section>

      <q-card-section>
        <div class="text-h6 q-mb-sm">
          {{ selectedCustomers.length }} {{ $t("products.piece") }}
        </div>
        <div class="text-subtitle2">
          {{ `${sendType} ${$t("bulkSmsEmail.confirmSmsEmail")}` }}
        </div>
      </q-card-section>
      <q-card-actions align="between">
        <q-btn :label="$t('cancel')" color="negative" v-close-popup />
        <q-btn :label="$t('confirm')" color="primary" @click="onSubmit()" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { firm } from "../../package.json";
import * as XLSX from "xlsx";

export default defineComponent({
  components: {},
  computed: {
    columns() {
      return [
        {
          name: "nameSurname",
          label: this.$t("users.nameSurname"),
          align: "left",
          field: (row) => `${row.name} ${row.surname}`,
          sortable: true,
        },
        {
          name: "email",
          label: this.$t("email"),
          field: "email",
          align: "left",
        },
        {
          name: "phone",
          label: this.$t("phone"),
          field: (row) => row.phone,
          align: "left",
        },
        {
          name: "mobileOs",
          label: this.$t("reports.mobileOs"),
          field: (row) => row.mobileOs,
          align: "left",
        },
        {
          name: "osVersion",
          label: this.$t("reports.osVersion"),
          field: (row) => row.osVersion,
          align: "left",
        },
        {
          name: "appVersion",
          label: this.$t("reports.appVersion"),
          field: (row) => row.appVersion,
          align: "left",
        },
        {
          name: "country",
          label: this.$t("firm.country"),
          field: (row) =>
            row.address?.country ? row.address.country.name : "",
          align: "left",
          sortable: true,
        },
        {
          name: "city",
          label: this.$t("firm.city"),
          field: (row) => (row.address?.city ? row.address.city.name : ""),
          align: "left",
          sortable: true,
        },
        {
          name: "lastLogin",
          label: this.$t("reports.lastLogin"),
          field: (row) =>
            row.lastLoginDate ? this.dateFormat(row.lastLoginDate) : "",
          align: "left",
          sortable: true,
        },
        {
          name: "isActive",
          label: this.$t("status"),
          field: "isActive",
          align: "center",
          sortable: true,
        },
      ];
    },
  },
  data() {
    return {
      loading: false,
      sendType: "SMS",
      templates: [],
      customerIds: [],
      selectedTemplate: null,
      selectedFilter: "mobile",
      listStatus: false,
      editor: "",
      sendConfirm: false,
      user: LocalStorage.getItem("userinfo"),

      customers: [],
      countries: [],
      cities: [],
      regions: [],
      mobileOs: [],
      osVersions: [],
      appVersions: [],

      filteredMobileCustomers: [],
      filteredRegionCustomers: [],
      filteredCountries: [],
      filteredCities: [],
      filteredRegions: [],
      filteredMobileOs: [],
      filteredOsVersions: [],
      filteredAppVersions: [],

      selectedCountry: null,
      selectedCities: [],
      selectedRegions: [],
      selectedMobileOs: [],
      selectedOsVersions: [],
      selectedAppVersions: [],
      selectedCustomers: [],

      filter: "",
      pagination: { rowsPerPage: 20 },
    };
  },
  async mounted() {
    this.init();
    document.title = `${firm.name}-${this.$t("pages.bulkSmsMail")}`;
  },
  methods: {
    init() {
      try {
        this.getCustomers();
        this.getCountries();
        this.getRegions();
        this.getSmsTemplates();
        this.getEmailTemplates();
      } catch (error) {}
    },

    async getCustomers() {
      try {
        // Müşteri Listesini al
        this.loading = true;
        const response = await this.$api.get("getCustomers/999/1/true");
        this.customers =
          this.filteredMobileCustomers =
          this.selectedCustomers =
            response?.data;

        // Müşteri MobileOs listesini filtrele
        this.mobileOs = [
          ...new Set(
            this.customers
              .map((item) => item.mobileOs)
              .filter((os) => os != null),
          ),
        ];

        // Müşteri AppVersions listesini filtrele
        this.appVersions = [
          ...new Set(
            this.customers
              .map((item) => item.appVersion)
              .filter((version) => version != null),
          ),
        ];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getCustomers error", error);
      }
    },
    async getCountries() {
      try {
        const response = await this.$api.get("getCountries");
        this.countries = this.filteredCountries = response.data;
      } catch (error) {
        this.$logger.error("Hata", error);
      }
    },
    async getRegions() {
      try {
        const response = await this.$api.get("getRegions");
        this.regions = this.filteredRegions = response?.data.data || [];
      } catch (error) {
        this.$logger.error("Hata", error);
      }
    },
    async getCustomersByStationRegions() {
      try {
        const body = {
          stationRegionIds: this.selectedRegions.map((region) => region.id),
        };

        const response = await this.$api.post(
          "getCustomersByStationRegions",
          body,
        );
        this.filteredRegionCustomers = this.selectedCustomers =
          response?.data.data || [];
      } catch (error) {
        this.$logger.error("Hata", error);
      }
    },
    async getSmsTemplates() {
      try {
        const response = await this.$api.get("/smsTemplates");
        this.templates = response.data;
      } catch (error) {
        this.$logger.error("Hata", error);
      }
    },
    async getMailTemplates() {
      try {
        const response = await this.$api.get("/getEmailTemplates");
        this.emailTemplates = response.data;
      } catch (error) {
        this.$logger.error("Hata", error);
      }
    },
    async getCities(country) {
      try {
        const response = await this.$api.get(
          `getCitiesWithDistricts/${country.id}`,
        );
        this.cities = this.filteredCities = response.data;
        this.filterMobileCustomers();
      } catch (error) {
        this.$logger.error("Şehir verisi alınamadı:", error);
      }
    },

    exportTable() {
      const table = this.$refs.table;
      const rows = table.filteredSortedRows; // sadece filtrelenmiş ve sıralanmışlar
      // İstenmeyen sütunlarını hariç tut
      const excludedLabels = ["İşlem"];
      const exportColumns = this.columns.filter(
        (col) => !excludedLabels.includes(col.label),
      );

      // Başlık ve Veri
      const header = exportColumns.map((col) => col.label);
      const data = rows.map((row) =>
        exportColumns.map((col) =>
          typeof col.field === "function" ? col.field(row) : row[col.field],
        ),
      );

      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      worksheet["!cols"] = [
        { wch: 30 }, // 1. sütun
        { wch: 30 }, // 2. sütun
        { wch: 20 }, // 3. sütun
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      XLSX.writeFile(workbook, "BulkSmsEmailCustomers.xlsx");
    },
    filterList(val, update, sourceList, targetList) {
      try {
        const source = this[sourceList];
        const normalizedVal = this.$normalizeTurkishString(val);

        update(() => {
          this[targetList] =
            val === ""
              ? source
              : source.filter((item) =>
                  this.$normalizeTurkishString(item.name).includes(
                    normalizedVal,
                  ),
                );
        });
      } catch (error) {
        this.$logger.error("filterList:", error);
      }
    },
    filterMobileCustomers() {
      try {
        //this.filteredCustomers = this.customers;
        this.filteredMobileCustomers = this.customers.filter(
          (item) =>
            //Ülke filtresi
            (!this.selectedCountry ||
              (item.address?.countryId != null &&
                item.address.countryId === this.selectedCountry.id)) &&
            //Şehir filtresi
            (!this.selectedCities.length ||
              this.selectedCities.some(
                (city) => item.address?.cityId === city.id,
              )) &&
            //Mobil İşletim sistemi filtresi
            (!this.selectedMobileOs.length ||
              this.selectedMobileOs.includes(item.mobileOs)) &&
            //Mobil version filtresi
            (!this.selectedOsVersions.length ||
              this.selectedOsVersions.includes(item.osVersion)) &&
            //App version filtresi
            (!this.selectedAppVersions.length ||
              this.selectedAppVersions.includes(item.appVersion)),
        );
        this.selectedCustomers = this.filteredMobileCustomers;
      } catch (error) {
        this.$logger.error("filteredMobileCustomers:", error);
      }
    },
    onCityChange() {
      try {
        this.filterMobileCustomers();
      } catch (error) {
        this.$logger.error("onCityChange:", error);
      }
    },
    onMobileOsChange() {
      try {
        this.selectedOsVersions = []; // Seçilmiş osVersion listesini sıfırla
        this.selectedAppVersions = []; // Seçilmiş appVersion listesini sıfırla
        // Müşteri osVersion listesini filtrele
        this.osVersions = this.filteredOsVersions = [
          ...new Set(
            this.filteredMobileCustomers
              .filter((item) => this.selectedMobileOs.includes(item.mobileOs)) // mobileOs değeri seçilen dizide var mı?
              .map((item) => item.osVersion), // osVersion değerlerini çıkar
          ),
        ];

        this.filterMobileCustomers();
      } catch (error) {
        this.$logger.error("onMobileOsChange:", error);
      }
    },
    onOsVersionChange() {
      try {
        this.selectedAppVersions = []; // Seçilmiş appVersion listesini sıfırla
        // Müşteri osVersion listesini filtrele
        this.appVersions = [
          ...new Set(
            this.filteredMobileCustomers
              .filter((item) =>
                this.selectedOsVersions.includes(item.osVersion),
              ) // önce osVersion eşleşenleri al
              .map((item) => item.appVersion), // sonra appVersion değerlerini çıkar
          ),
        ];

        this.filterMobileCustomers();
      } catch (error) {
        this.$logger.error("onOsVersionChange:", error);
      }
    },
    onAppVersionChange() {
      try {
        this.filterMobileCustomers();
      } catch (error) {
        this.$logger.error("onAppVersionChange:", error);
      }
    },
    onTemplateChange() {
      try {
        this.editor = this.selectedTemplate?.content || "";
      } catch (error) {
        this.$logger.error("onTemplateChange:", error);
      }
    },
    onFilterChange() {
      try {
        if (this.selectedFilter === "mobile") {
          //this.filterMobileCustomers();
          this.selectedCustomers = this.filteredMobileCustomers;
        } else if (this.selectedFilter === "region") {
          //this.getCustomersByStationRegions();
          this.selectedCustomers = this.filteredRegionCustomers;
        }
      } catch (error) {
        this.$logger.error("onFilterChange:", error);
      }
    },

    async onConfirm() {
      try {
        // Müşteri sayısı kontrolü
        if (this.selectedCustomers.length === 0) {
          this.$q.notify({
            type: "warning",
            message: this.$t("bulkSmsEmail.noCustomersSelected"),
          });
          return;
        }
        // Şablon boşluk güncelleme
        if (!this.editor || this.editor.trim() === "") {
          this.$q.notify({
            type: "warning",
            html: true,
            message: `<span style="font-size:18px;">${this.$t(
              "bulkSmsEmail.templateContentEmpty",
            )}</span>`,
          });
          return;
        }
        // Gönderim onay dialogunu aç
        this.sendConfirm = true;
      } catch (error) {
        this.$logger.error("onSubmit:", error);
      }
    },

    async onSubmit() {
      try {
        this.sendConfirm = false;
        this.customerIds = this.selectedCustomers.map(
          (customer) => customer.id,
        );
        this.$logger.log(
          "getCustomersByStationRegions body:",
          this.customerIds,
        );
        if (this.sendType == "SMS") {
          this.sendSMS();
        } else if (this.sendType == "Email") {
          this.sendEmail();
        }
      } catch (error) {
        this.$logger.error("onSubmit:", error);
      }
    },
    async sendSMS() {
      try {
        // SMS gönderme işlemi
        const body = {
          employeeId: this.user.id,
          notificationType: "SMS",
          template: this.editor,
          customerIds: this.customerIds,
        };
        this.$logger.log("onSubmit SMS:", body);
        const response = await this.$api.post("bulkNotification", body);
        if (response.status === 200) {
          this.$q.notify({
            type: "positive",
            html: true,
            message: `<span style="font-size:18px;">${this.$t(
              "success",
            )}</span>`,
          });
        } else {
          this.$q.notify({
            type: "negative",
            message: response.error.message,
          });
        }
      } catch (error) {
        this.$logger.error("sendSMS:", error);
      }
    },
    async sendEmail() {
      try {
        // E-Mail gönderme işlemi
        const body = {
          employeeId: this.user.id,
          subject: "",
          html: this.editor,
          maxPerHour: 250,
          minDelayMs: 3000,
          maxDelayMs: 8000,
          dryRun: false,
          stopOnError: false,
        };

        this.$logger.log("onSubmit eMail:", body);
        const response = await this.$api.post("sendBulkMail", body);
        if (response.status === 200) {
          this.$q.notify({
            type: "positive",
            html: true,
            message: `<span style="font-size:18px;">${this.$t(
              "success",
            )}</span>`,
          });
        } else {
          this.$q.notify({
            type: "negative",
            message: response.error.message,
          });
        }
      } catch (error) {
        this.$logger.error("sendEmail:", error);
      }
    },
    dateFormat(date) {
      date = new Date(date);

      const options = {
        timeZone: "Europe/Istanbul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        //second: "2-digit",
        hour12: false,
      };

      const formatted = date
        .toLocaleString("tr-TR", options)
        .replace(/\. /g, ".") // Ay ve gün arasında nokta
        .replace(",", ""); // Virgülü kaldır

      //this.$logger.log(formatted);
      return formatted;
    },
    customersLabel(option) {
      return option.id == null
        ? ""
        : `${option.name} ${option.surname} - ${option.phone}`;
    },
  },
});
</script>
<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s
.my-sticky-header-table
  /* height or max-height is important */
  max-height: 600px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
