<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("finance.collectionPayment") }}</div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-list class="row">
            <!--Müşteri Ünvan  -->
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('firm.name')"
                  v-model="formModel.firm.commercialTitle"
                />
              </q-item-section>
            </q-item>

            <!--Evrak No  -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.documentNo')"
                  v-model="formModel.documentNo"
                />
              </q-item-section>
            </q-item>

            <!--Evrak Tarih  -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.collectionPaymentDate')"
                  v-model="formModel.updatedAt"
                />
              </q-item-section>
            </q-item>

            <!--Ödeme Yöntemi  -->
            <q-item class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.paymentType.value"
                  option-value="id"
                  option-label="value"
                  :label="$t('finance.paymentType')"
                  :options="paymentTypeFiltered"
                  @filter="filterPaymentType"
                  style="width: 100%"
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

            <!--Kasa -->
            <q-item class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.cashBox.name"
                  option-value="id"
                  option-label="name"
                  :label="$t('finance.cashBox')"
                  :options="cashBoxFiltered"
                  @filter="filterCashBox"
                  style="width: 100%"
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

            <!--Meblağ  -->
            <q-item class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.balance')"
                  v-model="formModel.balance"
                />
              </q-item-section>
            </q-item>
            <!--Para Birimi-->
            <q-item class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.currency"
                  option-value="id"
                  option-label="name"
                  :label="$t('firm.currency')"
                  :options="currenciesFiltered"
                  @filter="filterCurrency"
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
            <!--Açıklama-->
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
          </q-list>
        </q-card-section>
      </q-card>

      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("finance.checksPromissory.checksPromissories") }}</div>
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
    </div>

    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-actions>
          <q-space />
          <q-btn
            color="secondary"
            :label="$t('savedata')"
            icon-right="send"
            text-color="white"
            :style="{
              display: mode === 'details' ? 'none' : '',
              width: '150px',
            }"
            @click="save"
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <!-- Form Dialog -->

    <q-dialog
      v-model="userformVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 50vw; max-height: 90vh">
        <q-card-section class="q-pa-sm">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("finance.checksPromissory.checksPromissory")
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
          <checks-promissory-form
            class="q-pa-sm"
            v-model="currentRow"
            :mode="currentMode"
            @completed="onFormCompleted"
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
import ChecksPromissoryForm from "src/components/forms/ChecksPromissoryForm.vue";

export default defineComponent({
  name: "CollectionPaymentForm",
  components: {
    ChecksPromissoryForm,
  },
  computed: {
    columns() {
      return [
        {
          name: "finance.checksPromissory.documentNo",
          required: true,
          label: this.$t("finance.checksPromissory.documentNo"),
          align: "left",
          field: (row) => row.documentNo,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "finance.checksPromissory.documentType",
          required: true,
          label: this.$t("finance.checksPromissory.documentType"),
          align: "left",
          field: (row) => (row.documentType == "check" ? "ÇEK" : "SENET"),
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: "finance.checksPromissory.amount",
          required: true,
          label: this.$t("finance.checksPromissory.amount"),
          align: "left",
          field: (row) => row.amount,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: "finance.checksPromissory.termDay",
          required: true,
          label: this.$t("finance.checksPromissory.termDay"),
          align: "left",
          field: (row) => row.termDay,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: "finance.checksPromissory.termDate",
          required: true,
          label: this.$t("finance.checksPromissory.termDate"),
          align: "left",
          field: (row) => row.termDate,
          format: (val) => `${val}`,
          sortable: true,
        },

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
    var formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (!props.modelValue.firm) {
      formModel.value.firm.commercialTitle = "";
      formModel.value.firm.currency = { name: "Para birimi seç" };
    }
    return {
      formModel,
    };
  },
  data() {
    return {
      userformVisible: false,

      loading: true,
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

      paymentTypeFiltered: [],
      paymentTypeFull: [],

      cashBoxFiltered: [],
      cashBoxFull: [],
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
  },
  mounted() {
    if (this.mode == "add") {
      this.formModel = {};
      this.formModel.detail = "";
      this.formModel.invoiceAddress = {};
      this.formModel.invoiceAddress.country = {};
      this.formModel.invoiceAddress.country.countryName = "Türkiye";
      this.$logger.log("InitFirm/", this.formModel);
    } else {
      this.formModel.updatedAt = date.formatDate(
        this.formModel.updatedAt,
        "YYYY-MM-DD"
      );
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

      this.getCurrency();
      this.getPaymentType();
      this.getCashBox();
      this.getcheckPromissoryNotes();
    },

    onSubmit() {},

    save() {
      this.$logger.log("form submitted", this.formModel);
      if (this.mode === "add") {
        this.$logger.log("add");
        this.addFormModel();
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },
    async addFormModel() {
      const _response = this.$api
        .post("firms", JSON.stringify(this.formModel))
        .then((response) => {
          this.$logger.log(response.data);
          this.$logger.log("add completed");
          this.formModel = response.data;
          this.$logger.log(this.formModel);
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

    async editFormModel() {
      const response = this.$api
        .put("firms", JSON.stringify(this.formModel))
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

    async getcheckPromissoryNotes() {
      this.loading = true;
      this.rows = this.formModel.checkPromissoryNotes;
      this.$logger.log("checkPromissoryNotes =>", this.rows);
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

    async getPaymentType() {
      const response = this.$api.get("paymentTypes").then((data) => {
        this.$logger.log("paymentTypes =>", data.data);
        this.paymentTypeFull = data.data;
      });
    },

    filterPaymentType(val, update) {
      if (val === "") {
        update(() => {
          this.paymentTypeFiltered = this.paymentTypeFull;
        });
        return;
      }

      update(() => {
        this.paymentTypeFiltered = this.paymentTypeFull.filter(
          (v) => v.value.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },
    async getCashBox() {
      const response = this.$api.get("cashBoxes").then((data) => {
        this.$logger.log("cashBoxs =>", data.data);
        this.cashBoxFull = data.data;
      });
    },

    filterCashBox(val, update) {
      if (val === "") {
        update(() => {
          this.cashBoxFiltered = this.cashBoxFull;
        });
        return;
      }

      update(() => {
        this.cashBoxFiltered = this.cashBoxFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.userformVisible = true;
    },
    onView(user) {
      this.$logger.log(user);
      this.maximizedToggle = false;
      this.currentRow = user; /*Object.assign(
        {},
        this.rows.find((row) => row.id === id)
      );*/
      this.currentMode = "details";
      this.userformVisible = true;
    },
    onEdit(user) {
      this.maximizedToggle = false;
      this.currentRow = user; /*Object.assign(
        {},
        this.rows.find((row) => row.id === id)
      );*/
      this.currentMode = "edit";
      this.userformVisible = true;
    },
    onDeleteUser(user) {
      this.currentRow = user;
      this.deleteConfirm = true;
    },
    onFormCompleted() {
      this.userformVisible = false;
      this.$logger.log("form completed");
      getUsers();
      // await this.$api.post("Kullanici/Kaydet", model);
    },
  },
});
</script>
