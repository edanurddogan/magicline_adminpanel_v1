<template>
  <div class="row">
    <q-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card-section class="bg-primary text-white">
        <div>{{ $t("discountList.discountInformations") }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list dense class="row">
          <!-- İndirim Kodu -->
          <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                ref="codeRef"
                v-model="formModel.code"
                :label="$t('discountList.discountCode')"
                :disable="mode === 'details'"
                outlined
                dense
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="redeem" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <!-- İndirim Tipi -->
          <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                ref="discounTypeRef"
                v-model="formModel.discountType"
                :options="discountTypes"
                option-value="id"
                option-label="name"
                :label="$t('discountList.discountType')"
                :disable="mode === 'details' || mode === 'mo'"
                map-options
                outlined
                dense
                @update:model-value="onDiscountTypeChange"
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="discount" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Başlangıç Tarihi -->
          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
            <q-item-section>
              <q-input
                ref="startDateRef"
                v-model="formModel.startDate"
                type="date"
                :label="$t('discountList.startDate')"
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
          <!-- Bitiş Tarihi -->
          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6 q-mb-md">
            <q-item-section>
              <q-input
                v-model="formModel.endDate"
                type="date"
                :label="$t('discountList.endDate')"
                :disable="mode === 'details'"
                outlined
                dense
              >
                <template #prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <!-- Elektrik Tipi -->
          <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12 q-mb-md">
            <q-item-section>
              <q-select
                ref="electricTypeRef"
                v-model="formModel.stationElectricType"
                :options="stationElectricTypes"
                option-value="id"
                :option-label="stationElectricTypesLabel"
                :label="$t('priceList.electricType')"
                map-options
                :disable="mode === 'details'"
                outlined
                dense
                @update:model-value="onStationElectricTypeChange"
              >
                <template #prepend>
                  <q-icon name="bolt" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- İndirim Türü -->
          <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                ref="amountTypeRef"
                v-model="formModel.amountType"
                :options="amountTypes"
                option-value="id"
                option-label="name"
                :label="$t('discountList.amountType')"
                :disable="mode === 'details'"
                emit-value
                map-options
                clearable
                outlined
                dense
                @update:model-value="onAmountTypeChange"
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="percent" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- İndirim Yüzdesi -->
          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6 q-mb-md">
            <q-item-section>
              <q-input
                v-model="formModel.percentage"
                :type="
                  formModel.amountType === 'percentage' ? 'number' : 'text'
                "
                :max="100"
                :min="0"
                :maxlength="3"
                clearable
                :label="$t('discountList.discountPercentage')"
                :disable="
                  mode === 'details' || formModel.amountType.id === null
                "
                :readonly="formModel.amountType === 'fixed'"
                outlined
                dense
                @update:model-value="onPercentageChange"
              >
                <template #prepend>
                  <q-icon name="percent" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <!-- İndirim Tutarı -->
          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6 q-mb-md">
            <q-item-section>
              <q-input
                v-model="formModel.amount"
                :type="formModel.amountType === 'fixed' ? 'number' : 'text'"
                :label="$t('discountList.discountAmount')"
                :disable="
                  mode === 'details' || formModel.amountType.id === null
                "
                :readonly="formModel.amountType === 'percentage'"
                clearable
                outlined
                dense
                @update:model-value="onFixedChange"
              >
                <template #prepend>
                  <q-icon name="money" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <!-- Email adres kontrol bölümü -->
          <q-item class="col-lg-2 col-md-2 col-sm-12 col-xs-12">
            <q-checkbox
              v-model="emailCheck"
              :label="$t('users.emailDomain')"
              :disable="mode === 'details'"
            ></q-checkbox>
          </q-item>
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12 column">
            <q-input
              v-model="formModel.emailDomain"
              dense
              outlined
              prefix="@"
              :disable="!emailCheck"
            ></q-input>
          </q-item>

          <!-- İndirim Açıklama -->
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                v-model="formModel.description"
                type="textarea"
                :rows="1"
                :label="$t('description')"
                :disable="mode === 'details'"
                outlined
                dense
              >
                <template #prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="col-12 justify-end">
            <q-toggle
              class="col-lg-1 col-md-1 col-sm-1 col-xs-12"
              :label="
                formModel.isActive === true ? $t('active') : $t('inactive')
              "
              color="green"
              checked-icon="check"
              unchecked-icon="cancel"
              :disable="mode === 'details'"
              v-model="formModel.isActive"
            />
          </q-item>

          <!-- İndirim Tür Seçimleri -->
          <q-bar
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pa-xs q-mt-lg"
          >
            <q-icon name="percent" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("discountList.discountFilters")
              }}</span>
            </q-toolbar-title>
          </q-bar>
          <q-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pa-sm">
            <q-list class="row items-start">
              <!-- İndirim Tipi Data Bölge Seçimi -->
              <q-item
                class="col-lg-2 col-md-2 col-sm-12 col-xs-12 column q-space"
              >
                <q-item-section>
                  <q-select
                    v-model="formModel.discountRegions"
                    style="width: 100%"
                    :options="filteredRegions"
                    option-value="id"
                    option-label="name"
                    :label="$t('region.regions')"
                    :disable="
                      mode === 'details' ||
                      formModel.discountType?.code !== 'region'
                    "
                    :loading="loading"
                    multiple
                    clearable
                    outlined
                    dense
                    use-input
                    hide-selected
                    transition-show="scale"
                    transition-hide="scale"
                    @filter="
                      (val, update) =>
                        filterList(val, update, 'regions', 'filteredRegions')
                    "
                  >
                    <template #prepend>
                      <q-icon name="location_on" />
                    </template>
                  </q-select>
                </q-item-section>
                <q-item-section>
                  <q-card
                    v-if="formModel.discountRegions?.length"
                    class="q-pa-xs overflow-auto"
                  >
                    <div class="column q-gutter-xs">
                      <q-chip
                        v-for="item in formModel?.discountRegions"
                        :key="item.id"
                        removable
                        @remove="removeFilter(item, 'discountRegions')"
                        dense
                        :disable="mode === 'details'"
                        class="full-width no-radius"
                      >
                        {{ item.name }}
                      </q-chip>
                    </div>
                  </q-card>
                </q-item-section>
              </q-item>

              <!-- İndirim Tipi Data Bayi Seçimi -->
              <q-item
                class="col-lg-2 col-md-2 col-sm-12 col-xs-12 column q-space"
              >
                <q-item-section>
                  <q-select
                    v-model="formModel.discountDealers"
                    style="width: 100%"
                    :options="filteredDealers"
                    option-value="id"
                    option-label="name"
                    :label="$t('dealer.dealers')"
                    :disable="
                      mode === 'details' ||
                      formModel.discountType?.code !== 'dealer'
                    "
                    :loading="loading"
                    map-options
                    multiple
                    hide-selected
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
                <q-item-section>
                  <q-card
                    v-if="formModel.discountDealers?.length"
                    class="q-pa-xs overflow-auto"
                  >
                    <div class="column q-gutter-xs">
                      <q-chip
                        v-for="item in formModel.discountDealers"
                        :key="item.id"
                        removable
                        @remove="removeFilter(item, 'discountDealers')"
                        dense
                        :disable="mode === 'details'"
                        class="full-width no-radius"
                      >
                        {{ item.name }}
                      </q-chip>
                    </div>
                  </q-card>
                </q-item-section>
              </q-item>

              <!-- İndirim Tipi Data İstasyon Seçimi -->
              <q-item
                class="col-lg-2 col-md-2 col-sm-12 col-xs-12 column q-space"
              >
                <q-item-section>
                  <q-select
                    v-model="formModel.discountStations"
                    style="width: 100%"
                    :options="filteredStations"
                    option-value="id"
                    option-label="name"
                    :label="$t('station.stations')"
                    :disable="
                      mode === 'details' ||
                      !['station', 'stationanduser'].includes(
                        formModel.discountType?.code,
                      )
                    "
                    :loading="loading"
                    map-options
                    multiple
                    hide-selected
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
                    v-if="formModel.discountStations?.length"
                    class="q-pa-xs overflow-auto"
                  >
                    <div class="column q-gutter-xs">
                      <q-chip
                        v-for="item in formModel.discountStations"
                        :key="item.id"
                        removable
                        @remove="removeFilter(item, 'discountStations')"
                        dense
                        :disable="mode === 'details'"
                        class="full-width no-radius"
                      >
                        {{ item.name }}
                      </q-chip>
                    </div>
                  </q-card>
                </q-item-section>
              </q-item>

              <!-- İndirim Tipi Data Kullanıcılar Seçimi -->
              <q-item
                class="col-lg-2 col-md-2 col-sm-12 col-xs-12 column q-space"
              >
                <q-item-section>
                  <q-select
                    v-model="formModel.discountUsers"
                    style="width: 100%"
                    :options="filteredUsers"
                    option-value="id"
                    :option-label="usersLabel"
                    :label="$t('users.users')"
                    :disable="
                      mode === 'details' ||
                      !['user', 'stationanduser'].includes(
                        formModel.discountType?.code,
                      )
                    "
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
                    @filter="filterUsers"
                  >
                    <template #prepend>
                      <q-icon name="person" />
                    </template>
                  </q-select>
                </q-item-section>
                <q-item-section>
                  <q-card
                    v-if="formModel.discountUsers?.length"
                    class="q-pa-xs overflow-auto"
                  >
                    <div class="column q-gutter-xs">
                      <q-chip
                        v-for="item in formModel.discountUsers"
                        :key="item.id"
                        removable
                        @remove="removeFilter(item, 'discountUsers')"
                        dense
                        :disable="mode === 'details'"
                        class="full-width no-radius"
                      >
                        {{ item.name }} {{ item.surname }} - {{ item.phone }}
                      </q-chip>
                    </div>
                  </q-card>
                </q-item-section>
              </q-item>

              <!-- İndirim Tipi Data Araçlar Seçimi -->
              <q-item
                class="col-lg-2 col-md-2 col-sm-12 col-xs-12 column q-space"
              >
                <q-item-section>
                  <q-select
                    v-model="formModel.discountVehicles"
                    style="width: 100%"
                    :options="filteredVehicles"
                    option-value="id"
                    option-label="licensePlate"
                    :label="$t('vehicle.vehicles')"
                    :disable="
                      mode === 'details' ||
                      formModel.discountType?.code !== 'vehicle'
                    "
                    :loading="loading"
                    hide-selected
                    map-options
                    multiple
                    clearable
                    outlined
                    dense
                    use-input
                    transition-show="scale"
                    transition-hide="scale"
                    @filter="filterVehicles"
                  >
                    <template #prepend>
                      <q-icon name="electric_car" />
                    </template>
                  </q-select>
                </q-item-section>
                <q-item-section>
                  <q-card
                    v-if="formModel.discountVehicles?.length"
                    class="q-pa-xs overflow-auto"
                  >
                    <div class="column q-gutter-xs">
                      <q-chip
                        v-for="item in formModel.discountVehicles"
                        :key="item.id"
                        removable
                        @remove="removeFilter(item, 'discountVehicles')"
                        dense
                        :disable="mode === 'details'"
                        class="full-width no-radius"
                      >
                        {{ item.licensePlate }}
                      </q-chip>
                    </div>
                  </q-card>
                </q-item-section>
              </q-item>

              <!-- İndirim Tipi Data İstasyon Grubu Seçimi -->
              <q-item
                class="col-lg-3 col-md-3 col-sm-12 col-xs-12 column q-mr-auto"
                v-if="false"
              >
                <q-item-section>
                  <q-select
                    v-model="formModel.discountStationGroups"
                    :options="filteredStationGroups"
                    option-value="id"
                    option-label="name"
                    :label="$t('discountList.stationGroups')"
                    :disable="
                      mode === 'details' ||
                      formModel.discountType?.code !== 'stationGroups'
                    "
                    :loading="loading"
                    hide-selected
                    map-options
                    multiple
                    clearable
                    outlined
                    dense
                    use-input
                    transition-show="scale"
                    transition-hide="scale"
                    @filter="
                      (val, update) =>
                        filterList(
                          val,
                          update,
                          'stationGroups',
                          'filteredStationGroups',
                        )
                    "
                  >
                    <template #prepend>
                      <q-icon name="ev_station" />
                    </template>
                  </q-select>
                </q-item-section>
                <q-item-section>
                  <q-card
                    v-if="formModel.discountStationGroups?.length"
                    class="q-pa-xs"
                    style="height: 10vh; overflow-y: auto"
                  >
                    <div
                      v-for="item in formModel.discountStationGroups"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </div>
                  </q-card>
                </q-item-section>
              </q-item>

              <!-- İndirim Tipi Data Kullanıcı Grubu Seçimi -->
              <q-item
                class="col-lg-3 col-md-3 col-sm-12 col-xs-12 column q-mr-auto"
                v-if="false"
              >
                <q-item-section>
                  <q-select
                    v-model="formModel.discountCustomerGroups"
                    :options="filteredCustomerGroups"
                    option-value="id"
                    option-label="name"
                    :label="$t('authorization.employeegroup')"
                    :disable="
                      mode === 'details' ||
                      formModel.discountType?.code !== 'customerGroups'
                    "
                    :loading="loading"
                    hide-selected
                    map-options
                    multiple
                    clearable
                    outlined
                    dense
                    use-input
                    transition-show="scale"
                    transition-hide="scale"
                    @filter="
                      (val, update) =>
                        filterList(
                          val,
                          update,
                          'customerGroups',
                          'filteredCustomerGroups',
                        )
                    "
                  >
                    <template #prepend>
                      <q-icon name="group" />
                    </template>
                  </q-select>
                </q-item-section>
                <q-item-section>
                  <q-card
                    v-if="formModel.discountCustomerGroups?.length"
                    class="q-pa-xs"
                    style="height: 10vh; overflow-y: auto"
                  >
                    <div
                      v-for="item in formModel.discountCustomerGroups"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </div>
                  </q-card>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-list>
      </q-card-section>
      <!-- isActive ve Kayıt bölümü -->
      <q-card-actions class="q-pr-lg justify-between">
        <!-- Kampanya Butonu -->
        <q-btn
          v-if="formModel.id && formModel.discountType?.code === 'dealer'"
          class="text-capitalize bg-secondary q-pa-lg"
          @click="onCampaign"
        >
          {{ $t("discountList.createCampaign") }}
        </q-btn>
        <!-- Kayıt Butonu -->
        <q-btn
          class="text-capitalize bg-primary q-pa-lg"
          :style="{ display: mode === 'details' ? 'none' : 'block' }"
          @click="onSubmit"
        >
          {{ mode === "edit" ? $t("updatedata") : $t("savedata") }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>

  <!-- Campaign Form Dialog -->
  <q-dialog
    v-model="formVisible"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 60vw; max-height: 55vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-sm">
          <q-icon name="price_change" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{
              $t("discountList.campaign")
            }}</span>
            {{ $t("add") }}</q-toolbar-title
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
      <q-card-section style="max-height: 60vh" class="scroll q-pa-sm">
        <campaign-form class="q-pa-sm" v-model="formModel.id" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from "vue";
import CampaignForm from "./CampaignForm.vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "DiscountForm",
  setup(props, { emit }) {
    const formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode === "add") {
      formModel.value.discountType = { id: null, name: "Seç" };
      formModel.value.amountType = { id: null, name: "Seç" };
      formModel.value.isActive = true;
    }
    return { formModel };
  },
  emits: ["completed"],
  components: {
    CampaignForm,
  },
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
      // Filtreler
      regions: [],
      dealers: [],
      stations: [],
      users: [],
      vehicles: [],
      customerGroups: [],
      stationGroups: [],
      customerStation: [],
      filteredRegions: [],
      filteredDealers: [],
      filteredStations: [],
      filteredUsers: [],
      filteredVehicles: [],
      // Diğer değişkenler
      stationElectricTypes: [],
      discountTypes: [],
      formVisible: false,
      amountTypes: [
        { id: "percentage", name: "İndirim Yüzdesi" },
        { id: "fixed", name: "Sabit Fiyat" },
      ],
      emailCheck: false,
      endpoints: {
        region: {
          endpoint: "getRegions",
          assign: (data) => {
            this.regions = this.filteredRegions = data.data;
          },
        },
        dealer: {
          endpoint: "getDealers",
          assign: (data) => {
            this.dealers = this.filteredDealers = data.data;
          },
        },
        station: {
          endpoint: "getStations",
          assign: (data) => {
            this.stations = this.filteredStations = data;
          },
        },
        user: {
          endpoint: "getCustomers/999/1/true",
          assign: (data) => {
            this.users = this.filteredUsers = data;
          },
        },
        vehicle: {
          endpoint: "getVehicles",
          assign: (data) => {
            this.vehicles = this.filteredVehicles = data;
          },
        },
        stationanduser: {
          endpoint: "getStations",
          assign: (data) => {
            this.stations = this.filteredStations = data;
          },
        },
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      try {
        this.getDiscountTypes();
        this.getStationElectricTypes();
        this.$logger.log("formModel:", this.formModel);
        if (this.mode === "add") {
          this.formModel.stationElectricType = {
            id: null,
            name: this.$t("selectAll"),
          };
        }

        if (this.mode !== "add") {
          this.onDiscountTypeChange();
          this.formModel.startDate = new Date(this.modelValue.startDate)
            .toISOString()
            .slice(0, 10); // API den gelen tarihi DD:MM:YYYY formatına dönüştür.
          this.formModel.endDate = new Date(this.modelValue.endDate)
            .toISOString()
            .slice(0, 10); // API den gelen tarihi DD:MM:YYYY formatına dönüştür.
          this.formModel.discountRegions = this.modelValue.discountRegions?.map(
            (item) => item.stationRegion,
          );
          this.formModel.discountDealers = this.modelValue.discountDealers?.map(
            (item) => item.dealer,
          );
          this.formModel.discountStations =
            this.modelValue.discountStations?.map((item) => item.station);
          this.formModel.discountUsers = this.modelValue.discountUsers?.map(
            (item) => item.customer,
          );
          this.formModel.discountVehicles =
            this.modelValue.discountVehicles?.map((item) => item.vehicle);
        }
      } catch (error) {
        this.$logger.error("Error init:", error);
      }
    },

    async onSubmit() {
      try {
        const isValid =
          this.$refs.codeRef?.validate?.() &&
          this.$refs.discounTypeRef?.validate?.() &&
          this.$refs.startDateRef?.validate?.() &&
          this.$refs.amountTypeRef?.validate?.();

        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }

        const {
          discountType,
          stationElectricType,
          amountType,
          amount,
          percentage,
          emailCheck,
          emailDomain,
        } = this.formModel;

        Object.assign(this.formModel, {
          discountTypeId: discountType.id,
          stationElectricTypeId: stationElectricType
            ? stationElectricType.id
            : null,
          amount: amountType === "fixed" ? amount : null,
          percentage: amountType === "percentage" ? percentage : null,
          emailDomain: emailCheck ? emailDomain : null,
        });

        // if (this.formModel.discountType.id === 4) {
        //   this.formModel.discountUsers = this.formModel.discountUsers?.map(
        //     (item) => item.id
        //   );
        // }

        this.$logger.log("Discount formModel:", this.formModel);
        if (this.mode === "add") {
          //this.addFormModel();
        } else {
          //this.updateFormModel();
        }
      } catch (error) {
        this.$logger.error("Error onSubmit:", error);
      }
    },

    async addFormModel() {
      try {
        const response = await this.$api.post("createDiscount", this.formModel); // İndirim Kayıt
        if (response.status === 200) {
          this.$q.notify({ type: "positive", message: this.$t("saved") });
          this.$emit("completed");
        }
      } catch (error) {
        this.$logger.error("Error add discount:", error);
      }
    },
    async updateFormModel() {
      try {
        const response = await this.$api.put("updateDiscount", this.formModel); // İndirim Güncelleme
        if (response.status === 200) {
          this.$q.notify({ type: "positive", message: this.$t("updated") });
          this.$emit("completed");
        }
      } catch (error) {
        this.$logger.error("Error update discount:", error);
      }
    },

    async getDiscountTypes() {
      try {
        const response = await this.$api.get("/discountTypes");

        this.discountTypes = response.data;
      } catch (error) {
        this.$logger.error("Error getDiscountTypes:", error);
      }
    },
    async getStationElectricTypes() {
      try {
        const response = await this.$api.get("getChargePriceLists");
        this.stationElectricTypes = [
          { id: null, name: this.$t("selectAll"), price: null },
          ...response.data.map((item) => ({
            id: item.stationElectricType.id,
            name: item.stationElectricType.name,
            price: item.price,
            amount: 0,
            percentage: 0,
          })),
        ];
      } catch (error) {
        this.$logger.error("Error getStationElectricTypes:", error);
      }
    },

    async onDiscountTypeChange() {
      try {
        const selected = this.endpoints[this.formModel.discountType.code];
        let response;
        if (selected.endpoint === "getStations") {
          const body = {
            available: null,
            stationElectricTypeId: null,
            isActive: true,
          };
          response = await this.$api.post(selected.endpoint, body);
        } else {
          response = await this.$api.get(selected.endpoint);
        }
        selected.assign(response.data);
        if (this.formModel.discountType.code === "stationanduser") {
          const response = await this.$api.get(this.endpoints.user.endpoint);
          this.users = this.filteredUsers = response.data;
        }
      } catch (error) {
        this.$logger.error("Error onDiscountTypeChange:", error);
      }
    },
    onAmountTypeChange(val) {
      this.formModel.amount = val === "fixed" ? this.formModel.amount : "";
      this.formModel.percentage =
        val === "percentage" ? this.formModel.percentage : "";
    },
    onStationElectricTypeChange(val) {
      try {
        if (this.formModel.amountType.id === null) return;
        this.formModel.percentage = val.percentage;
        this.formModel.amount = val.amount;
      } catch (error) {
        this.$logger.error("Error onStationElectricTypeChange:", error);
      }
    },
    onPercentageChange(val) {
      const percentage = parseFloat(val);
      if (isNaN(percentage)) return;

      if (percentage < 0 || percentage > 100) {
        this.$q.notify({
          type: "negative",
          message: this.$t("discountList.percentageRangeError"),
        });
        this.formModel.amount = "";
        return;
      }

      // İndirimli tutarları hesapla
      this.stationElectricTypes.forEach((item) => {
        if (!item?.id) return;

        item.percentage = percentage;
        item.amount = ((item.price * (100 - percentage)) / 100).toFixed(2);
      });

      // formModel.amount'ı ayarla
      const selectedType = this.formModel.stationElectricType;

      const ac = this.stationElectricTypes.find((i) => i.name === "AC");
      const dc = this.stationElectricTypes.find((i) => i.name === "DC");

      if (selectedType.name === "AC" || selectedType.name === "DC") {
        this.formModel.amount = selectedType.amount;
      } else if (selectedType.id === null) {
        this.formModel.amount = `AC: ${ac?.amount}   ----   DC: ${dc?.amount}`;
      }
    },
    onFixedChange(val) {
      const fixedAmount = parseFloat(val);
      if (isNaN(fixedAmount)) return;

      if (fixedAmount < 0) {
        this.$q.notify({
          type: "negative",
          message: this.$t("discountList.percentageRangeError"),
        });
        this.formModel.amount = 0;
        this.formModel.percentage = "AC: %0   ----   DC: %0";
        return;
      }

      // İndirimli yüzdeleri hesapla
      this.stationElectricTypes.forEach((item) => {
        if (!item?.id) return;

        item.amount = fixedAmount;
        item.percentage = (
          ((item.price - fixedAmount) / item.price) *
          100
        ).toFixed(2);
      });

      // formModel.percentage'ı ayarla
      const selectedType = this.formModel.stationElectricType;

      const ac = this.stationElectricTypes.find((i) => i.name === "AC");
      const dc = this.stationElectricTypes.find((i) => i.name === "DC");

      if (selectedType.name === "AC" || selectedType.name === "DC") {
        this.formModel.percentage = selectedType.percentage;
      } else if (selectedType.id === null) {
        this.formModel.percentage = `AC: %${ac?.percentage}   ----   DC: %${dc?.percentage}`;
      }
    },
    onCampaign() {
      this.maximizedToggle = false;
      this.currentRow = this.formModel;
      this.formVisible = true;
    },
    filterList(val, update, sourceList, filterList) {
      const source = this[sourceList];
      const normalizedVal = this.$normalizeTurkishString(val);

      update(() => {
        this[filterList] =
          val === ""
            ? source
            : source.filter((item) =>
                this.$normalizeTurkishString(item.name).includes(normalizedVal),
              );
      });
    },
    filterUsers(val, update) {
      const normalizedVal = this.$normalizeTurkishString(val);

      update(() => {
        val === ""
          ? (this.filteredUsers = this.users)
          : (this.filteredUsers = this.users.filter((user) => {
              const name = this.$normalizeTurkishString(user.name || "");
              const surname = this.$normalizeTurkishString(user.surname || "");
              const phone = this.$normalizeTurkishString(user.phone || "");

              return (
                name.includes(normalizedVal) ||
                surname.includes(normalizedVal) ||
                phone.includes(normalizedVal)
              );
            }));
      });
    },
    filterVehicles(val, update) {
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
    },
    removeFilter(item, sourceList) {
      const list = this.formModel[sourceList];
      const index = list.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        list.splice(index, 1);
      }
    },

    stationElectricTypesLabel(option) {
      const price = option.price != null ? `  -  ${option.price}` : " ";
      return option.name + price;
    },
    usersLabel(option) {
      return option.id == null
        ? "Seç"
        : `${option.name} ${option.surname} - ${option.phone}`;
    },

    formatDate(date) {
      return new Date(date).toISOString().slice(0, 10);
    },
  },
});
</script>
