<template>
  <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12 q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">{{ $t("headquarters.headquarters") }}</div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <q-list class="row" dense>
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section side>
              <img
                src="/assets/logo/logo.png"
                style="width: auto; height: 75px"
              />
            </q-item-section>
            <q-item-section>
              <q-btn
                :style="{
                  display: admin ? 'block' : 'none',
                }"
                :label="$t('headquarters.addlogo')"
                class="text-capitalize q-pa-sm"
                rounded
                color="info"
                style="max-width: 120px"
              ></q-btn>
            </q-item-section>
          </q-item>
          <!-- Ünvan -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                class="q-pa-xs"
                :label="$t('headquarters.firmtitle')"
                v-model="headquarters.title"
                :readonly="!admin"
              />
            </q-item-section>
          </q-item>
          <!-- Ticari ünvan -->
          <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                class="q-pa-xs"
                :label="$t('headquarters.commercialTitle')"
                v-model="headquarters.commercialTitle"
                :readonly="!admin"
              />
            </q-item-section>
          </q-item>
          <!-- Email -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                :label="$t('headquarters.email')"
                v-model="headquarters.email"
              />
            </q-item-section>
          </q-item>
          <!-- Telefon -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                :label="$t('headquarters.phone')"
                v-model="headquarters.phone1"
              />
            </q-item-section>
          </q-item>
          <!-- Web Site -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                :label="$t('headquarters.website')"
                v-model="headquarters.website"
              />
            </q-item-section>
          </q-item>
          <!-- Adres -->
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                autogrow
                v-model="headquarters.address.addressDetail"
                :label="$t('headquarters.address')"
              />
            </q-item-section>
          </q-item>
          <!-- Şehir -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                outlined
                dense
                v-model="headquarters.address.city"
                :label="$t('technicalService.selectCity')"
                clearable
                filter
                use-input
                option-value="id"
                option-label="name"
                @update:model-value="onCityChange(headquarters, $event)"
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
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                outlined
                dense
                v-model="headquarters.address.district"
                :options="headquarters.districts"
                :label="$t('technicalService.selectDistrict')"
                use-input
                clearable
                option-value="id"
                option-label="name"
                filter
                :disable="!headquarters.address.city"
                @filter="filterDistricts"
                @update:model-value="onDistrictChange(headquarters, $event)"
              >
                <template v-slot:prepend>
                  <q-icon name="place" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!--Posta Codu -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                v-model="headquarters.address.postalCode"
                :label="$t('headquarters.postalcode')"
              />
            </q-item-section>
          </q-item>
          <!--Vergi Dairesi -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                :label="$t('headquarters.taxoffice')"
                v-model="headquarters.taxOffice"
              />
            </q-item-section>
          </q-item>
          <!--Vergi Numarası -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                :label="$t('headquarters.taxnumber')"
                v-model="headquarters.taxNumber"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-lg">
        <q-btn
          dense
          class="text-capitalize bg-info q-pa-lg"
          :style="{
            display: admin ? 'block' : 'none',
          }"
          @click="addBranch"
        >
          {{ $t("firm.addBranch") }}
        </q-btn>
        <q-btn
          dense
          class="text-capitalize bg-info q-pa-lg"
          :style="{
            display: admin ? 'block' : 'none',
          }"
          @click="updateHeadquarters"
        >
          {{ $t("headquarters.editdata") }}
        </q-btn>
      </q-card-actions>
      <q-card-actions v-if="false" align="right" class="q-pa-lg">
        <q-btn
          class="text-capitalize bg-info q-pa-lg"
          href="C:\\appverifUI.dll"
          download
        >
          {{ $t("headquarters.savedata") }}
        </q-btn>
        <a
          :href="item.url"
          v-text="item.label"
          @click.prevent="downloadItem(item)"
        />
      </q-card-actions>
    </q-card>

    <!-- Şubeler -->
    <q-card
      class="q-mt-md"
      v-for="branch in headquartersBranches"
      :key="branch.id"
    >
      <q-card-section class="q-pa-xs">
        <q-list class="row" dense>
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                class="q-pa-xs"
                :label="$t('headquarters.firmtitle')"
                v-model="branch.title"
                :readonly="!admin"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                class="q-pa-xs"
                :label="$t('headquarters.commercialTitle')"
                v-model="branch.commercialTitle"
                :readonly="!admin"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                :label="$t('headquarters.email')"
                v-model="branch.email"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                :label="$t('headquarters.phone')"
                v-model="branch.phone1"
              />
            </q-item-section>
          </q-item>
          <!--Şube Web Site -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                :label="$t('headquarters.website')"
                v-model="branch.website"
              />
            </q-item-section>
          </q-item>
          <!--Şube Adres -->
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                autogrow
                v-model="branch.address.addressDetail"
                :label="$t('headquarters.address')"
              />
            </q-item-section>
          </q-item>
          <!--Şube Şehir -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                outlined
                dense
                v-model="branch.address.city"
                :label="$t('technicalService.selectCity')"
                clearable
                filter
                use-input
                option-value="id"
                option-label="name"
                @update:model-value="onCityChange(branch, $event)"
                :options="cities"
                @filter="filterCities"
              >
                <template v-slot:prepend>
                  <q-icon name="location_city" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!--Şube İlçe -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                outlined
                dense
                v-model="branch.address.district"
                :options="branch.districts"
                :label="$t('technicalService.selectDistrict')"
                use-input
                clearable
                option-value="id"
                option-label="name"
                filter
                :disable="!headquarters.address.city"
                @filter="filterDistricts"
              >
                <template v-slot:prepend>
                  <q-icon name="place" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!--Şube Postakodu -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                v-model="branch.address.postalCode"
                :label="$t('headquarters.postalcode')"
              />
            </q-item-section>
          </q-item>
          <!-- Vergi Dairesi -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                :label="$t('headquarters.taxoffice')"
                v-model="branch.taxOffice"
              />
            </q-item-section>
          </q-item>
          <!-- Vergi numarası -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :readonly="!admin"
                class="q-pa-xs"
                :label="$t('headquarters.taxnumber')"
                v-model="branch.taxNumber"
              />
            </q-item-section>
          </q-item>
          <!-- İlgili Kişi -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                outlined
                dense
                v-model="branch.contactEmployee"
                :label="$t('firm.contactPerson')"
                clearable
                filter
                use-input
                option-value="id"
                :option-label="(item) => `${item.name} ${item.surname}`"
                :options="filteredEmployees"
                @filter="filterEmployees"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-lg">
        <q-btn
          dense
          class="text-capitalize bg-info q-pa-lg"
          :style="{
            display: admin ? 'block' : 'none',
          }"
          @click="deleteBranch(branch)"
        >
          {{ $t("firm.deleteBranch") }}
        </q-btn>
        <q-btn
          dense
          class="text-capitalize bg-info q-pa-lg"
          :style="{
            display: admin ? 'block' : 'none',
          }"
          @click="updateBranch(branch)"
        >
          {{
            branch.id
              ? $t("headquarters.editdata")
              : $t("headquarters.savedata")
          }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>

<script>
import { ref, defineComponent } from "vue";
import { useUserStore } from "src/stores/user";

export default defineComponent({
  name: "HeadquartersProfile",
  setup() {},
  data() {
    return {
      headquarters: { address: {} },
      headquartersBranches: [
        { address: {}, contactEmployee: { fullName: "Seç" } },
      ],
      user: useUserStore(),
      admin: true,
      cities: [],
      filteredCities: [],
      districts: [],
      filteredDistricts: [],
      employees: [],
      filteredEmployees: [],
      item: {
        url: "src/assets/files/test.png",
        label: "deneme",
      },
    };
  },
  async mounted() {
    this.$setPageTitle("Headquarters");
    this.$logger.log("user", this.user);
    this.init();
  },
  methods: {
    init() {
      try {
        this.getCities();
        this.getEmployees();
        this.getHeadquarters();
      } catch (error) {
        this.$logger.error(error);
      }
    },

    async getHeadquarters() {
      try {
        await this.$api.get("getHeadquarters").then((data) => {
          this.headquarters = data?.data;
          this.headquartersBranches = this.headquarters.headquartersBranches;
          this.$logger.log("head", data.data);
          this.$logger.log("branch", this.headquartersBranches);
        });
      } catch (error) {
        this.$logger.error(error);
      }
    },

    updateHeadquarters() {
      try {
        this.$api
          .put("putHeadquarters", JSON.stringify(this.headquarters))
          .then(() => {
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: this.$t("success"),
              caption: this.$t("success"),
            });
          });
      } catch (error) {
        this.$logger.error(error);
      }
    },

    async addBranch() {
      try {
        this.headquartersBranches.unshift({
          title: "",
          commercialTitle: "",
          email: "",
          phone1: "",
          website: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
          taxOffice: "",
          taxNumber: "",
        });
        // const response = this.$api
        //   .post("headquartersBranches", JSON.stringify(this.branchs))
        //   .then(() => {
        //     this.$logger.log(response.data);
        //     this.$logger.log("add completed");
        //     Notify.create({
        //       type: "negative",
        //       message: i18n.global.t("apierror"),
        //       caption: error.response.data.error?.errors
        //         ? error.response.data.error?.errors[0]
        //         : error.response?.statusText ?? error.message,
        //     });
        //   });
      } catch (error) {
        this.$logger.error(error);
      }
    },

    async updateBranch(branch) {
      try {
        this.$logger.log("updateBranch body", branch);
        branch.address.districtId = branch.address.district.id;
        branch.contactEmployeeId = branch.contactEmployee.id;
        this.$api
          .put("putHeadquartersBranch", JSON.stringify(branch))
          .then(() => {
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: this.$t("success"),
              caption: this.$t("success"),
            });
          });
      } catch (error) {
        this.$logger.error(error);
      }
    },

    async getEmployees() {
      try {
        const response = await this.$api.get("getEmployees");
        this.employees = response?.data;
        this.employees = this.employees.map((employee) => ({
          ...employee,
          fullName: `${employee.name} ${employee.surname}`,
        }));
      } catch (error) {
        this.$logger.error(error);
      }
    },

    async getCities() {
      try {
        const response = await this.$api.get("getCities");
        this.cities = response.data;
      } catch (error) {
        this.$logger.error(error);
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

    filterEmployees(val, update) {
      if (val === "") {
        update(() => {
          this.filteredEmployees = this.employees; // Tüm çalışanları göster
        });
        return;
      }

      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        this.filteredEmployees = this.employees.filter((v) =>
          this.$normalizeTurkishString(v.name).includes(normalizedVal)
        );
      });
    },

    onCityChange(office, $event) {
      try {
        office.address.city = $event || null;
        office.districts = null;

        if ($event) {
          office.address.cityId = $event.id;
          office.districts = $event.districts;
        }
      } catch (error) {
        this.$logger.error(error);
      }
    },
  },
});
</script>
