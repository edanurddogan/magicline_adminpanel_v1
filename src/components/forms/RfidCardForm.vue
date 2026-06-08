<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("rfid.rfidCardInfo") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section dense>
          <q-list class="row items-start">
            <!-- Tag Adı -->
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  ref="nameRef"
                  v-model="formModel.name"
                  type="text"
                  :label="$t('users.name')"
                  :disable="mode === 'details'"
                  outlined
                  dense
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template #prepend>
                    <q-icon name="credit_card" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Tag Kodu -->
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  ref="tagRef"
                  v-model="formModel.tag"
                  type="text"
                  :label="$t('rfid.rfidTag')"
                  :disable="mode === 'details'"
                  outlined
                  dense
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template #prepend>
                    <q-icon name="add_card" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Araç Seçimi-->
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  ref="vehicleRef"
                  v-model="formModel.vehicleId"
                  :options="filteredVehicles"
                  option-value="id"
                  option-label="licensePlate"
                  options-dense
                  :label="$t('vehicle.vehicle')"
                  :disable="mode === 'details'"
                  :loading="loading"
                  emit-value
                  map-options
                  clearable
                  outlined
                  dense
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  @filter="filterVehicles"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template #prepend>
                    <q-icon name="electric_car" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Kullanıcı Tipi Seçimi -->
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <div class="row q-gutter-xl justify-center">
                  <q-radio
                    v-model="formModel.userType"
                    val="personal"
                    :label="$t('firm.personal')"
                    :disable="mode === 'details'"
                  />
                  <q-radio
                    v-model="formModel.userType"
                    val="corporate"
                    :label="$t('firm.corporate')"
                    :disable="mode === 'details'"
                  />
                </div>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <!-- Kullanıcı Seçimi -->
                <q-select
                  v-if="formModel.userType === 'invidual'"
                  v-model="formModel.user"
                  :options="filteredUsers"
                  option-value="id"
                  :option-label="usersLabel"
                  :label="$t('users.user')"
                  :disable="mode === 'details'"
                  :loading="loading"
                  map-options
                  clearable
                  outlined
                  dense
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  @filter="filterUsers"
                >
                  <template #prepend>
                    <q-icon name="person" />
                  </template>
                </q-select>
                <!-- Bayi Seçimi -->
                <q-select
                  v-if="formModel.userType === 'corporate'"
                  v-model="formModel.dealerId"
                  :options="filteredDealers"
                  option-value="id"
                  option-label="name"
                  :label="$t('dealer.dealer')"
                  :disable="mode === 'details'"
                  :loading="loading"
                  emit-value
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
            <!-- İstasyon Seçimi -->
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12 column">
              <q-item-section>
                <q-select
                  v-model="formModel.stations"
                  :options="filteredStations"
                  option-value="id"
                  option-label="name"
                  options-dense
                  :label="$t('station.stations')"
                  :disable="mode === 'details'"
                  :loading="loading"
                  map-options
                  hide-selected
                  multiple
                  clearable
                  outlined
                  dense
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  @filter="
                    (val, update) =>
                      filterList(val, update, 'stations', 'filteredStations')
                  "
                >
                  <template #prepend>
                    <q-icon name="ev_station" />
                  </template>
                </q-select>
              </q-item-section>
              <q-item-section>
                <q-card
                  v-if="formModel.stations?.length"
                  class="q-pa-xs overflow-auto"
                >
                  <div class="column q-gutter-xs">
                    <q-chip
                      v-for="item in formModel.stations"
                      :key="item.id"
                      :disable="mode === 'details'"
                      removable
                      @remove="removeFilter(item)"
                      dense
                      class="full-width no-radius"
                    >
                      {{ item.name }}
                    </q-chip>
                  </div>
                </q-card>
              </q-item-section>
            </q-item>
            <!-- Açıklama -->
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-mt-md">
              <q-item-section>
                <q-input
                  v-model="formModel.notes"
                  :label="$t('description')"
                  type="textarea"
                  :disable="mode === 'details'"
                  rows="2"
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="description" />
                  </template>
                </q-input>
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
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

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
      vehicles: [],
      dealers: [],
      users: [],
      stations: [],
      filteredVehicles: [],
      filteredDealers: [],
      filteredUsers: [],
      filteredStations: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      try {
        this.getVehicles();
        this.getDealers();
        this.getUsers();
        this.getStations();

        this.formModel.userType = this.formModel.dealerId
          ? "corporate"
          : "personal";
      } catch (error) {
        this.$logger.error("PriceForm init", error);
      }
    },

    async getVehicles() {
      try {
        this.loading = true;
        const response = await this.$api.get("getVehicles");
        this.vehicles = this.filteredVehicles = response.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getVehicles error", error);
      }
    },
    async getDealers() {
      try {
        this.loading = true;
        const response = await this.$api.get("getDealers");
        this.dealers = this.filteredDealers = response.data.data || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getDealers error", error);
      }
    },
    async getUsers() {
      try {
        this.loading = true;
        const response = await this.$api.get("getCustomers/999/1/true");
        this.users = this.filteredUsers = response.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getCustomers error", error);
      }
    },
    async getStations() {
      try {
        const body = {
          available: null,
          stationElectricTypeId: null,
          isActive: true,
        };
        this.loading = true;
        const response = await this.$api.post("getStations", body);
        this.stations = this.filteredStations = response.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getStations error", error);
      }
    },

    filterVehicles(val, update) {
      try {
        const normalizedVal = this.$normalizeTurkishString(val);
        update(() => {
          val === ""
            ? (this.filteredVehicles = this.vehicles)
            : (this.filteredVehicles = this.vehicles.filter((vehicle) =>
                this.$normalizeTurkishString(vehicle.licensePlate).includes(
                  normalizedVal,
                ),
              ));
        });
      } catch (error) {
        this.$logger.error("filterVehicles error", error);
      }
    },
    filterUsers(val, update) {
      try {
        if (val === "") {
          update(() => {
            this.filteredUsers = this.users;
          });
          return;
        }

        const normalizedVal = this.$normalizeTurkishString(val);
        update(() => {
          this.filteredUsers = this.users.filter((user) => {
            const name = this.$normalizeTurkishString(user.name || "");
            const surname = this.$normalizeTurkishString(user.surname || "");
            const phone = this.$normalizeTurkishString(user.phone || "");

            return (
              name.includes(normalizedVal) ||
              surname.includes(normalizedVal) ||
              phone.includes(normalizedVal)
            );
          });
        });
      } catch (error) {
        this.$logger.error("filterUsers error", error);
      }
    },
    filterList(val, update, sourceList, filterList) {
      try {
        const source = this[sourceList];
        const normalizedVal = this.$normalizeTurkishString(val);

        update(() => {
          this[filterList] =
            val === ""
              ? source
              : source.filter((item) =>
                  this.$normalizeTurkishString(item.name).includes(
                    normalizedVal,
                  ),
                );
        });
      } catch (error) {
        this.$logger.error("filterList error", error);
      }
    },
    removeFilter(item) {
      try {
        const list = this.formModel.stations;
        const index = list.findIndex((i) => i.id === item.id);
        if (index !== -1) {
          list.splice(index, 1);
        }
      } catch (error) {
        this.$logger.error("removeFilter error", error);
      }
    },

    async onSubmit() {
      try {
        const isValid =
          (await this.$refs.nameRef?.validate?.()) &&
          (await this.$refs.tagRef?.validate?.()) &&
          (await this.$refs.vehicleRef?.validate?.());

        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }

        if (this.formModel.userType === "individual")
          this.formModel.dealerId = null;
        if (this.formModel.userType === "corporate")
          this.formModel.userId = null;

        this.$logger.log("Rfid formModel:", this.formModel);
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
        const response = await this.$api.post("createRfidCard", this.formModel); // Rfid Kayıt
        if (response.status == 200) {
          this.formModel.id = response.data.id;
          this.$q.notify({ type: "positive", message: this.$t("saved") });
          this.$emit("completed");
        }
      } catch (error) {
        this.$logger.error("Error add RfidCard:", error);
      }
    },
    async updateFormModel() {
      try {
        const response = await this.$api.put("updateRfidCard", this.formModel); // Rfid Güncelleme
        if (response.status === 200)
          this.$q.notify({ type: "positive", message: this.$t("updated") });
        this.$emit("completed");
      } catch (error) {
        this.$logger.error("Error update RfidCard:", error);
      }
    },

    usersLabel(option) {
      return option.id == null
        ? "Seç"
        : `${option.name} ${option.surname} - ${option.phone}`;
    },
  },
});
</script>
