<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("finance.waybills") }}</div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-list class="row">
            <!--Müşteri Ünvan  -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  use-input
                  :disable="mode === 'details'"
                  outlined
                  v-model="formModel.firm"
                  :options="firmFiltered"
                  @filter="filterFirm"
                  option-value="id"
                  option-label="commercialTitle"
                  :label="$t('finance.firmtitle')"
                  @update:model-value="(val) => firmSelected(val)"
                />
              </q-item-section>
            </q-item>

            <!--İrsaliye No  -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillNo')"
                  v-model="formModel.waybillNo"
                />
              </q-item-section>
            </q-item>

            <!--İrsaliye Tarihi  -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillDate')"
                  v-model="formModel.waybillDate"
                  :rules="[
                    (val) =>
                      isEquale(val, formModel.dispatchDate) ||
                      'Tarihler Farklı',
                  ]"
                />
              </q-item-section>
            </q-item>

            <!--Sevk Tarihi  -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('finance.shipmentDate')"
                  v-model="formModel.dispatchDate"
                  :rules="[
                    (val) =>
                      isEquale(val, formModel.waybillDate) || 'Tarihler Farklı',
                  ]"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.firm.postAddress.country"
                  option-value="id"
                  option-label="countryName"
                  :options="countriesFiltered"
                  @filter="filterCountries"
                  :label="$t('firm.country')"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{ $t("noresults") }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.firm.postAddress.city"
                  option-value="id"
                  option-label="cityName"
                  :options="citiesFiltered"
                  @filter="filterCities"
                  :label="$t('finance.waybillCity')"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{ $t("noresults") }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.firm.postAddress.region"
                  option-value="id"
                  option-label="regionName"
                  :options="regionsFiltered"
                  @filter="filterRegions"
                  :label="$t('firm.region')"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{ $t("noresults") }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('firm.postalcode')"
                  v-model="formModel.firm.postAddress.postalCode"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.shippinganddispatchaddressinfo')"
                  v-model="formModel.firm.postAddress.addressDetail"
                  type="textarea"
                  rows="5"
                />
              </q-item-section>
            </q-item>
            <!--Şehir -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillCity')"
                  v-model="formModel.firm.postAddress.city.cityName"
                />
              </q-item-section>
            </q-item>

            <!--İlçe -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillRegion')"
                  v-model="formModel.firm.postAddress.region.regionName"
                />
              </q-item-section>
            </q-item>

            <!--Sevk Adresi  -->
            <q-item class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillAdres')"
                  v-model="formModel.firm.postAddress.addressDetail"
                />
              </q-item-section>
            </q-item>

            <!--Posta Kodu -->
            <q-item class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillPostalCode')"
                  v-model="formModel.firm.postAddress.postalCode"
                />
              </q-item-section>
            </q-item>

            <!--İrsaliye Süreci  -->
            <q-item class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.invoiceTransactionType"
                  option-value="id"
                  option-label="name"
                  :label="$t('finance.waybillProcess')"
                  :options="invoiceTransactionTypeFiltered"
                  @filter="filterInvoiceTransaction"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{ $t("noresults") }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item-section>
            </q-item>

            <!--Taşıyıcı Firma Kargo  -->
            <q-item class="col-lg-7 col-md-7 col-sm-7 col-xs-11">
              <q-item-section>
                <q-select
                  ref="cargoControl"
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.cargo"
                  option-value="id"
                  option-label="value"
                  :label="$t('finance.waybillTransporter')"
                  :options="waybillCargoFiltered"
                  @filter="filterWaybillCargo"
                  :rules="[(val) => val || 'Lütfen Taşıyıcı Seçin']"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{ $t("noresults") }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <q-item
              class="q-ma-none q-pa-none col-lg-1 col-md-1 col-sm-1 col-xs-1"
            >
              <q-item-section>
                <q-btn
                  flat
                  round
                  dense
                  icon="add"
                  @click="transporterFormVisible = true"
                >
                  <q-tooltip v-close-popup>{{
                    $t("finance.addTransporter")
                  }}</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("Ürün ve Hizmetler") }}</div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-table
            dense
            bordered
            :grid="isGrid"
            :hide-header="isGrid"
            class="statement-table"
            :rows="rows"
            :columns="columns"
            :loading="loading"
            :filter="filter"
            :loading-label="$t('loading')"
            :no-data-label="$t('nodatalabel')"
            :no-results-label="$t('noresultslabel')"
            row-key="id"
          >
            <template v-slot:top="props">
              <div class="row col-12">
                <div
                  class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title"
                >
                  {{ $t("") }}
                </div>
                <q-space />
                <q-input
                  class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
                  bottom-slots
                  dense
                  debounce="300"
                  v-model="filter"
                  :placeholder="$t('search')"
                >
                  <template v-slot:append
                    ><q-icon
                      dense
                      v-if="filter !== ''"
                      name="close"
                      @click="filter = ''"
                      class="cursor-pointer"
                    />
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-space />
                <q-btn
                  flat
                  round
                  dense
                  icon="add"
                  class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                  @click="onAdd"
                />

                <q-space />
                <q-btn
                  flat
                  round
                  dense
                  :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  @click="props.toggleFullscreen"
                  class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                />
                <q-space />
                <q-btn
                  flat
                  round
                  dense
                  :icon="isGrid ? 'list' : 'grid_on'"
                  @click="isGrid = !isGrid"
                  class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                >
                  <q-tooltip v-close-popup>{{
                    isGrid ? "List" : "Grid"
                  }}</q-tooltip>
                </q-btn>
              </div>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="props.row.isActive === true ? 'green' : 'red'"
                  text-color="white"
                  dense
                  class="text-weight-bolder"
                  square
                  >{{ props.row.isActive ? $t("active") : $t("inactive") }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  dense
                  flat
                  round
                  color="primary"
                  icon="info"
                  @click="onView(props.row)"
                />
                <q-btn
                  dense
                  flat
                  round
                  color="secondary"
                  icon="edit"
                  @click="onEdit(props.row)"
                />
                <q-btn
                  dense
                  flat
                  round
                  color="negative"
                  icon="delete_forever"
                  @click="onDelete(props.row)"
                />
              </q-td>
            </template>

            <template v-slot:item="props">
              <div
                class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                :style="props.selected ? 'transform: scale(0.95);' : ''"
              >
                <q-card :class="props.selected ? 'bg-grey-2' : ''">
                  <q-list dense>
                    <q-item v-for="col in props.cols" :key="col.name">
                      <q-item-section>
                        <q-item-label>{{ col.label }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-chip
                          v-if="col.name === 'status'"
                          :color="props.row.isActive === true ? 'green' : 'red'"
                          text-color="white"
                          dense
                          class="text-weight-bolder"
                          square
                          >{{
                            props.row.isActive ? $t("active") : $t("inactive")
                          }}
                        </q-chip>

                        <q-item-section
                          v-else-if="col.name === 'action'"
                          class="row"
                        >
                          <div class="row">
                            <q-btn
                              dense
                              flat
                              round
                              color="primary"
                              icon="info"
                              @click="onView(props.row)"
                            />
                            <q-btn
                              dense
                              flat
                              round
                              color="secondary"
                              icon="edit"
                              @click="onEdit(props.row)"
                            />
                            <q-btn
                              dense
                              flat
                              round
                              color="negative"
                              icon="delete_forever"
                              @click="onDelete(props.row)"
                            />
                          </div>
                        </q-item-section>

                        <q-item-label v-else caption
                          ><p>{{ col.value }}</p></q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
            </template>

            <template v-slot:no-data="{ icon, message, filter }">
              <div class="full-width row flex-center q-gutter-sm">
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                <span> {{ message }}... </span>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("firm.detailandnoteinfo") }}</div>
        </q-card-section>

        <q-card-actions>
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('firm.detail')"
                v-model="formModel.description"
                type="textarea"
              />
            </q-item-section>
          </q-item>
        </q-card-actions>
      </q-card>
    </div>

    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-actions>
          <q-space />
          <q-btn
            v-if="formModel.erpWaybillId"
            color="secondary"
            :label="$t('finance.showWaybill')"
            icon-right="visibility"
            text-color="white"
            class="text-capitalize q-pa-md q-mx-md"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="showWaybill"
          >
          </q-btn>
          <q-btn
            v-if="!formModel.erpWaybillId"
            color="secondary"
            :label="$t('finance.createWaybill')"
            icon-right="send"
            text-color="white"
            class="text-capitalize q-pa-md q-mx-md"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="save"
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <!-- Product Form Dialog -->
    <q-dialog
      v-model="productformVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 40vw; max-height: 90vh">
        <q-card-section class="q-pa-sm">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("products.product")
              }}</span>
              {{ $t(currentMode) }}</q-toolbar-title
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
              <q-tooltip
                v-if="!maximizedToggle"
                class="bg-white text-primary"
                >{{ $t("maximize") }}</q-tooltip
              >
            </q-btn>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
          <add-product-form
            class="q-pa-sm"
            v-model="currentRow"
            :mode="currentMode"
            @completed="onFormCompleted"
            @addcompleted="addWaybillItem"
            @editcompleted="editWaybillItem"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Transporter Form Dialog -->
    <q-dialog
      v-model="transporterFormVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 70vw; max-height: 90vh">
        <q-card-section class="q-pa-sm">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("products.product")
              }}</span>
              {{ $t(currentMode) }}</q-toolbar-title
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
              <q-tooltip
                v-if="!maximizedToggle"
                class="bg-white text-primary"
                >{{ $t("maximize") }}</q-tooltip
              >
            </q-btn>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
          <edit-transporter-form
            class="q-pa-sm"
            v-model="currentRow"
            :mode="currentMode"
            @completed="getWaybillTransporters"
            @close="transporterFormVisible = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent, computed } from "vue";
import { useQuasar, date } from "quasar";
import AddProductForm from "src/components/forms/AddProductForm.vue";
import EditTransporterForm from "./EditTransporterForm.vue";

export default defineComponent({
  name: "WaybillForm",
  components: {
    AddProductForm,
    EditTransporterForm,
  },
  computed: {
    columns() {
      return [
        {
          name: "products.product",
          required: true,
          label: this.$t("products.product"),
          align: "left",
          field: (row) => row.stockCard.stockName,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "products.piece",
          required: true,
          label: this.$t("products.piece"),
          align: "left",
          field: (row) => row.quantity,
          format: (val) => `${val}`,
          sortable: true,
        },

        // {
        //   name: "finance.exchangeRate",
        //   required: true,
        //   label: this.$t("finance.exchangeRate"),
        //   align: "left",

        //   field: (row) => this.formModel.exchangeRate.USD,
        //   format: (val) => `${val}`,
        //   sortable: true,
        // },

        {
          name: "status",
          align: "center",
          label: this.$t("status"),
          field: "isActive",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: this.$t("action"),
          field: "",
        },
      ];
    },
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });
    this.$logger.log("waybill setup....:", props);
    if (props.mode == "add" && props.addwaybill == false) {
      this.$logger.log("add çalıştı");
      formModel.value.firm = {};
      formModel.value.firm.commercialtitle = "";
      formModel.value.invoiceTransactionType = {};
      formModel.value.firm.postAddress = {};
      formModel.value.firm.postAddress.city = {};
      formModel.value.firm.postAddress.country = "İstanbul";
      formModel.value.firm.postAddress.city.name = "";
      formModel.value.firm.postAddress.region = {};
      formModel.value.firm.postAddress.region.name = "";
      formModel.value.cargo = { id: 0, name: "Seç..." };
      formModel.value.detail = "";
      //formModel.value.order.orderDate = date.formatDate(Date(), "YYYY-MM-DD");
    }

    if (props.addwaybill == true) {
      formModel.value.id = null;
      formModel.value.invoiceTransactionType = {};
      formModel.value.firm.postAddress = formModel.value.address;
    }

    return {
      formModel,
    };
  },
  data() {
    return {
      cargoControl: null,
      formMode: "add",
      productformVisible: false,
      transporterFormVisible: false,

      loading: false,
      rows: [],
      selectedId: 0,
      formVisible: false,
      deleteConfirm: false,
      currentMode: "add",
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      isGrid: false,

      currenciesFull: [],
      currenciesFiltered: [],

      invoiceTransactionTypeFiltered: [],
      invoiceTransactionTypeFull: [],

      waybillCargoFiltered: [],
      waybillCargoFull: [],
      firmFiltered: [],
      firmFull: [],
    };
  },
  emits: ["completed"],
  onBeforeCreate() {},
  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: "add",
    },
    addwaybill: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.$logger.log("add waybill", this.formModel.waybillDetails);
    this.rows = this.formModel.waybillDetails;
    if (this.formMode == "add") {
      this.$logger.log(
        "this.formModel.waybillDate",
        this.formModel.waybillDate
      );
      this.formModel.waybillDate = date.formatDate(
        this.formModel.waybillDate || Date(),
        "YYYY-MM-DD"
      );

      this.formModel.dispatchDate = date.formatDate(
        this.formModel.dispatchDate,
        "YYYY-MM-DD"
      );
    }

    if (this.addwaybill == true) {
      this.formModel.id = null;
      this.$api.post("postOrderWaybill", this.formModel).then((response) => {
        if (response.status == 200) {
          let obj = this.formModel.waybillDetails.map((x) => {
            x.id = null;
            this.$logger.log("response.data.id", response.data.id);
            x.waybillId = response.data.id;
            return x;
          });
          this.$api
            .post("bulkCreateWayBillDetail", obj)
            .then((bulkcreateRes) => {
              let data = response.data;
              data.waybillDetails = bulkcreateRes.data;
              this.formModel.id = data.id;
            });
        }
      });
    }

    this.$logger.log("formModel => ", this.formModel);
    this.init();
  },

  methods: {
    async init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}

      this.getFirm();
      this.getCurrency();
      this.getInvoiceTransactionType();
      this.getWaybillTransporters();
      if (this.formMode != "add") this.getWaybilDetail();
    },
    isEquale(val, val2) {
      this.$logger.log("changes isEquale", val, val2);

      // this.$logger.log(
      //   "test",
      //   this.formModel.wayBillDate,
      //   this.formModel.dispatchDate
      // );
      return val == val2;
    },
    onSubmit() {},

    save() {
      if (this.formMode === "add") {
        this.$logger.log("add");
        this.addFormModel();
      } else if (this.formMode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },
    formHasError() {
      //CARGO CONTROL
      this.$refs.cargoControl.validate();
      let hasError = false;
      if (this.$refs.cargoControl.hasError) {
        hasError = true;
      }
      return hasError;
    },

    async addFormModel() {
      //this.formModel.id = null;
      if (!this.formHasError()) {
        this.$logger.log("IT'S DONE", this.formModel.orderId);
        this.postWaybillToUyumSoft();
      }
    },
    async postWaybillToUyumSoft() {
      try {
        const response = await this.postWaybillToServer();
        this.handleWaybillPostResponse(response);
      } catch (error) {
        this.$logger.log("Uyumsoft Post Waybill Error:", error);
      }
    },

    async postWaybillToServer() {
      return this.$api.post("InsertWaybill/", this.formModel);
    },

    handleWaybillPostResponse(response) {
      this.$logger.log("Order Post UyumSoft", response);
      this.$q.notify({
        progress: true,
        type: "info",
        color: "info",
        message: "İrsaliye UyumSoft'a Gönderildi",
        caption: this.$t("success"),
      });
      this.updateFormModelAfterWaybillPost(response);
    },

    updateFormModelAfterWaybillPost(response) {
      this.formModel.invoiceTransactionType.id = 2;
      this.formModel.waybillNo = response.data.waybillNo;
      this.formModel.erpWaybillId = response.data.result;
      this.updateWaybillOnServer();
    },

    async updateWaybillOnServer() {
      try {
        const response = await this.$api.put("waybills", this.formModel);
        this.handleWaybillUpdateResponse(response);
      } catch (error) {
        this.$logger.log("Uyumsoft Update Waybill Error:", error);
      }
    },

    handleWaybillUpdateResponse(response) {
      this.formModel.id = response.id;
      this.notifyWaybillUpdateSuccess();
      this.emitWaybillSendedEvent();
      this.emitCompletedEventIfNeeded();
    },

    notifyWaybillUpdateSuccess() {
      this.$q.notify({
        progress: true,
        type: "info",
        color: "info",
        message: "İrsaliye Numarası Alındı",
        caption: this.$t("success"),
      });
    },

    emitWaybillSendedEvent() {
      this.$emit("waybillSended");
    },

    emitCompletedEventIfNeeded() {
      if (this.formMode !== "add") {
        this.$emit("completed");
        this.formMode = "edit";
      }
    },

    async editFormModel() {
      const response = this.$api
        .put("waybills", this.formModel)
        .then((_response) => {
          this.$logger.log(_response);
          this.$logger.log("edit completed");

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
          this.$emit("completed");
        });
    },

    async addWaybillItem() {
      this.$logger.log(this.currentRow);
      this.currentRow.orderId = this.formModel.orderId;
      this.currentRow.waybillId = this.formModel.id;
      const _response = this.$api
        .post("waybillDetails", this.currentRow)
        .then((response) => {
          this.$logger.log(response.data);
          this.$logger.log("add completed");
          this.getWaybilDetail();
          this.productformVisible = false;

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: "İrsaliye Bilgileri Kaydedildi" /*this.$t("success")*/,
            caption: this.$t("success"),
          });
        });
    },

    async editWaybillItem() {
      //this.currentRow.orderId = this.formModel.id;
      const response = this.$api
        .put("waybillDetails", this.currentRow)
        .then((_response) => {
          this.$logger.log(response.data);
          this.$logger.log("edit completed");
          this.getWaybilDetail();
          this.productformVisible = false;

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: "İrsaliye Bilgileri Güncellendi" /*this.$t("success")*/,
            caption: this.$t("success"),
          });
        });
    },
    async getWaybilDetail() {
      this.loading = true;
      const response = this.$api
        .get(`getWaybillDetails/${this.formModel.id}`)
        .then((data) => {
          this.$logger.log(data.data);
          this.formModel.waybillDetails = data.data;
          this.rows = this.formModel.waybillDetails;
          this.$logger.log("waybillDetails =>", this.rows);
        });
      this.loading = false;
    },

    async getCurrency() {
      const response = this.$api.get("currencies").then((data) => {
        this.$logger.log(data.data);
        this.currenciesFull = data.data;
      });
    },

    filterCurrency(val, update) {
      if (val === "") {
        update(() => {
          this.currenciesFiltered = this.currenciesFull;
        });
        return;
      }

      update(() => {
        this.currenciesFiltered = this.currenciesFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getInvoiceTransactionType() {
      const response = this.$api.get("invoiceTransactionTypes").then((data) => {
        this.$logger.log("invoiceTransactionType =>", data.data);
        this.invoiceTransactionTypeFull = data.data;
      });
    },

    filterInvoiceTransaction(val, update) {
      if (val === "") {
        update(() => {
          this.invoiceTransactionTypeFiltered = this.invoiceTransactionTypeFull;
        });
        return;
      }

      update(() => {
        this.invoiceTransactionTypeFiltered =
          this.invoiceTransactionTypeFull.filter(
            (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
      });
    },

    async getWaybillTransporters() {
      const response = this.$api.get("getUyumVehicle").then((data) => {
        this.$logger.log("WaybillTransporters =>", data.data);
        var drivers = data.data.result.map((d) => {
          d.value = `${d.licensE_PLATE.toUpperCase() || " "} -
          ${d.driveR_NAME == null ? " " : d.driveR_NAME}
          ${d.driveR_FAMILY_NAME == null ? " " : d.driveR_FAMILY_NAME} -
          ${d.description == null ? " " : d.description}`;
          return d;
        });
        this.waybillCargoFull = drivers;
        this.$logger.log("drivers =>", this.waybillCargoFull);
      });
    },

    filterWaybillCargo(val, update) {
      if (val === "") {
        update(() => {
          this.waybillCargoFiltered = this.waybillCargoFull;
        });
        return;
      }

      update(() => {
        this.waybillCargoFiltered = this.waybillCargoFull.filter(
          (v) => v.value.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getFirm() {
      const response = this.$api.get("firms").then((data) => {
        this.firmFull = data.data;
        //this.$logger.log("firms", this.firmFull);
      });
    },

    filterFirm(val, update) {
      if (val === "") {
        update(() => {
          this.firmFiltered = this.firmFull;
        });
        return;
      }

      update(() => {
        this.firmFiltered = this.firmFull.filter(
          (v) => v.commercialTitle.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
        //this.$logger.log("this.firmFiltered", this.firmFiltered);
      });
    },
    async firmSelected(val) {
      this.$logger.log(val);
      this.formModel.firmId = val.id;
      /*this.formModel.paymentTerm = this.paymentTermFull.find(
        (pt) => pt.id == val.paymentTermId
      );
      this.formModel.order.currency = this.currenciesFull.find(
        (c) => c.id == val.currencyId
      );*/
      this.getFirmPostAddress(val.postAddressId);
    },

    async getFirmPostAddress(addressId) {
      const response = this.$api
        .get("getAddressById/" + addressId)
        .then((data) => {
          this.$logger.log(data.data);
          this.formModel.firm.postAddress = data.data;
          this.$logger.log("this.formModel.address", this.formModel);
        });
    },

    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.productformVisible = true;
    },
    onView(user) {
      this.$logger.log(user);
      this.maximizedToggle = false;
      this.currentRow = user; /*Object.assign(
        {},
        this.rows.find((row) => row.id === id)
      );*/
      this.currentMode = "details";
      this.productformVisible = true;
    },
    onEdit(user) {
      this.maximizedToggle = false;
      this.currentRow = user; /*Object.assign(
        {},
        this.rows.find((row) => row.id === id)
      );*/
      this.currentMode = "edit";
      this.productformVisible = true;
    },
    onDeleteUser(user) {
      this.currentRow = user;
      this.deleteConfirm = true;
    },
    onFormCompleted() {
      this.productformVisible = false;
      this.$logger.log("form completed");
      getUsers();
      // await this.$api.post("Kullanici/Kaydet", model);
    },
  },
});
</script>
