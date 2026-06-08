<template>
  <!-- Call Center Form -->
  <div class="row">
    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <q-card dense class="q-ma-xs">
        <q-card-section class="bg-primary text-white text-center q-pa-xs">
          <div>{{ $t("technicalService.productInformations") }}</div>
        </q-card-section>
        <q-card-section class="q-pa-none q-ma-none">
          <q-list dense class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section class="q-pa-none q-ma-none">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="formModel.stockSerial.stockCard.brand.name"
                  :label="$t('products.brand')"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section class="q-pa-none q-ma-none">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="formModel.stockSerial.stockCard.model.name"
                  :label="$t('products.model')"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section class="q-pa-none q-ma-none">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="formModel.stockSerial.serialNo"
                  :label="$t('technicalService.serialNo')"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <q-card dense class="q-ma-xs q-mt-md">
        <q-card-section class="bg-primary text-white text-center q-pa-xs">
          <div>{{ $t("technicalService.customerInformations") }}</div>
        </q-card-section>
        <q-card-section class="q-pa-none q-ma-none">
          <q-list dense class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section class="q-pa-none q-ma-none">
                <q-input
                  class="q-pa-none q-ma-none"
                  readonly
                  dense
                  outlined
                  v-model="formModel.deliveredBy.name"
                  :label="$t('users.name')"
                  :rules="[(val) => !!val || 'Bu alan zorunludur']"
                  clearable
                  @update:model-value="onCustomerNameChange"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section class="q-pa-none q-ma-none">
                <q-input
                  class="q-pa-none q-ma-none"
                  readonly
                  dense
                  outlined
                  v-model="formModel.deliveredBy.surname"
                  :label="$t('users.surname')"
                  :rules="[(val) => !!val || 'Bu alan zorunludur']"
                  clearable
                  @update:model-value="onCustomerSurnameChange"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section class="q-pa-none q-ma-none">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="formModel.deliveredBy.phone1"
                  label="Telefon Numarası"
                  mask="(###) ### ## ##"
                  unmasked-value
                >
                  <template v-slot:prepend>
                    <q-icon name="phone" color="green" @click="toCall" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section class="q-pa-none q-ma-none">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="formModel.deliveredBy.email"
                  type="email"
                  :label="$t('login.email')"
                >
                  <template v-slot:prepend>
                    <q-icon name="mail" color="amber" @click="toMail" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <q-item-section class="q-pa-none q-ma-none">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="formModel.contactCustomer.address.city.name"
                  :label="$t('firm.city')"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <q-item-section class="q-px-none q-mx-none">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="formModel.contactCustomer.address.district.name"
                  :label="$t('firm.region')"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <q-item-section class="q-pa-none q-ma-none">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="formModel.deliveredBy.address.postalCode"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section class="q-pa-none q-ma-none">
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="formModel.deliveredBy.address.addressDetail"
                  :label="$t('headquarters.address')"
                  type="textarea"
                  rows="2"
                  autogrow
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
      <q-card class="q-ma-xs q-mt-md">
        <q-card-section class="bg-primary text-white text-center q-pa-xs">
          <div>{{ $t("technicalService.brandMessage") }}</div>
        </q-card-section>
        <q-card-section class="q-pa-none q-ma-none">
          <q-list dense class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  outlined
                  dense
                  :label="$t('technicalService.blackBoxInspectionResult')"
                  class="q-mt-xs"
                  type="textarea"
                  readonly
                  v-model="formModel.issueDescription"
                  autogrow
                >
                  <template v-slot:prepend>
                    <q-icon name="info" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="formModel.assignedTechnician.name"
                  :label="$t('technicalService.technicianName')"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  readonly
                  dense
                  outlined
                  v-model="formModel.assignedTechnician.surname"
                  :label="$t('technicalService.technicianSurname')"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
      <q-card dense class="q-ma-xs">
        <q-card-section class="bg-primary text-white text-center q-pa-xs">
          <div>
            {{ $t("technicalService.faultInformations") }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  disable
                  filled
                  v-model="formModel.userComplaint"
                  :label="$t('technicalService.userComment')"
                  type="textarea"
                  lazy-rules
                  clearable
                  autogrow
                >
                  <template v-slot:prepend>
                    <q-icon name="info" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />
      </q-card>
      <q-card class="q-ma-xs q-mt-md col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>
            {{ $t("technicalService.partsListToChange") }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-table
            :rows="formModel.serviceMaterials"
            :columns="columns"
            row-key="stockCode"
            :pagination="pagination"
            dense
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :label="props.row.serviceMaterialStatus.name"
                  :color="props.row.serviceMaterialStatus.color"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar, date, LocalStorage } from "quasar";

export default defineComponent({
  name: "TechnicalServiceCallCenterForm",
  components: {},
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
  setup(props, { emit }) {
    var formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    // Initialize selectedItems based on placedInBox value
    const selectedItems = computed(() =>
      formModel.value.serviceMaterials
        .filter((item) => item.placedInBox)
        .map((item) => item.id)
    );

    return {
      formModel,
      selectedItems,
    };
  },
  data() {
    return {
      maximizedToggle: false,

      tableData: [],
      columns: [
        {
          name: "stockCode",
          label: "Stock Code",
          align: "left",
          field: (row) => row.material.stockCode,
        },
        {
          name: "stockName",
          label: "Stock Name",
          align: "left",
          field: (row) => row.material.stockName,
        },

        {
          name: "quantity",
          label: "Quantity",
          align: "center",
          field: "quantity",
        },
        {
          name: "salePrice",
          label: "Sale Price",
          align: "left",
          field: (row) => row.material.salePrice,
        },
        { name: "status", label: "Status", align: "center", field: "status" },
      ],
    };
  },
  mounted() {
    this.$logger.log("mode: ", this.mode);
    this.$logger.log("formModel: ", this.formModel);
  },
  emits: ["completed"],
  methods: {
    init() {},
    toCall() {
      this.$logger.log("onCall: ", this.formModel.deliveredBy.phone1);
    },
    toMail() {
      this.$logger.log("onMail: ", this.formModel.deliveredBy.email);
    },
    getLabel(row) {
      this.$logger.log("getLabel: ", row);
    },
  },
});
</script>
