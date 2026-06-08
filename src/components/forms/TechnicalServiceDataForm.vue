<template>
  <!-- Data Form -->
  <div class="row">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("technicalService.productInformations") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-input
                  disable
                  dense
                  outlined
                  v-model="formModel.stockSerial.stockCard.brand.name"
                  :label="$t('products.brand')"
                  :rules="[(val) => !!val || 'Bu alan zorunludur']"
                  clearable
                  @update:model-value="onCustomerNameChange"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-input
                  disable
                  dense
                  outlined
                  v-model="formModel.stockSerial.stockCard.model.name"
                  :label="$t('products.model')"
                  :rules="[(val) => !!val || 'Bu alan zorunludur']"
                  clearable
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-input
                  disable
                  dense
                  outlined
                  v-model="formModel.stockSerial.serialNo"
                  :label="$t('technicalService.serialNo')"
                  :rules="[(val) => !!val || 'Bu alan zorunludur']"
                  clearable
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <q-card class="q-ma-xs col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("technicalService.brandMessage") }}</div>
        </q-card-section>
        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  filled
                  :label="$t('technicalService.blackBoxInspectionResult')"
                  type="textarea"
                  lazy-rules
                  clearable
                  v-model="formModel.blackBoxInspectionResult"
                >
                  <template v-slot:prepend>
                    <q-icon name="info" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Garanti Durumu -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  dense
                  label="Garanti Durumu"
                  v-model="formModel.warrantyType"
                  :options="warrantyOptions"
                  option-label="name"
                  option-value="id"
                  :disable="mode === 'details'"
                  emit-value
                  map-options
                  color="blue"
                  filled
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel.warrantyType === 2">
                <q-input
                  dense
                  filled
                  :label="$t('technicalService.outOfWarrantyReason')"
                  type="textarea"
                  lazy-rules
                  clearable
                  v-model="formModel.outOfWarrantyReason"
                >
                  <template v-slot:prepend>
                    <q-icon name="info" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-item class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
            <q-item-section>
              <q-btn
                color="secondary"
                icon="save"
                @click="saveBlackBoxInspection"
              />
            </q-item-section>
          </q-item>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("technicalService.technicianInformation") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-input
                  disable
                  outlined
                  v-model="formModel.assignedTechnician.name"
                  :label="$t('technicalService.technicianName')"
                  clearable
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-input
                  disable
                  outlined
                  v-model="formModel.assignedTechnician.surname"
                  :label="$t('technicalService.technicianSurname')"
                  clearable
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <q-card class="q-pa-md">
        <div class="row q-gutter-md items-center">
          <q-list class="row">
            <q-item class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
              <q-item-section>
                <q-input
                  v-model="newCaseNumber.caseNumber"
                  :label="$t('technicalService.caseNumber')"
                  outlined
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon name="info" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
              <q-item-section>
                <q-input
                  v-model="newCaseNumber.description"
                  :label="$t('description')"
                  outlined
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon name="info" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
              <q-item-section>
                <q-btn
                  :label="$t('add')"
                  class="q-ml-md text-capitalize"
                  color="primary"
                  @click="addCaseNumbers"
                  dense
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-list bordered separator class="q-mt-md q-mb-md">
          <q-item
            v-for="(item, index) in formModel.serviceCaseNumbers"
            :key="index"
            dense
          >
            <q-item-section>
              {{ item.caseNumber }} - {{ item.description }}
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                icon="close"
                color="red"
                @click="deleteCaseNumbers(index)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>
            {{ $t("technicalService.brandMessageTranslate") }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
              <q-item-section>
                <q-input
                  filled
                  :label="
                    $t('technicalService.manufacturerBrandResponseOrginal')
                  "
                  type="textarea"
                  lazy-rules
                  clearable
                  dense
                  v-model="formModel.manufacturerBrandResponseOrginal"
                >
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
              <q-item-section>
                <q-btn color="secondary" icon="swap_horiz" @click="translate" />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  filled
                  dense
                  :label="$t('technicalService.manufacturerBrandResponse')"
                  type="textarea"
                  lazy-rules
                  clearable
                  v-model="formModel.manufacturerBrandResponse"
                >
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="secondary"
            icon-right="send"
            text-color="white"
            :label="$t('save')"
            @click="save"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { Dialog } from "quasar";

export default defineComponent({
  name: "TechnicalServiceDataForm",
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
      processesFormVisibile: false,
      serviceTypesFormVisibile: false,
      faultCodesFormVisibile: false,
      maximizedToggle: false,
      deleteImageFormVisible: false,
      boxNumber: "",
      warrantyOptions: [],
      newCaseNumber: {},
    };
  },
  mounted() {
    this.getWarrantyTypes();
    this.getCaseNumbers();
    this.$logger.log("formModel: ", this.formModel);
  },
  emits: ["completed"],
  methods: {
    init() {},
    async save() {
      try {
        this.formModel.boxNumber = this.boxNumber;
        this.formModel.serviceMaterials.forEach((item) => {
          item.placedInBox = this.selectedItems.value.includes(item.id);
        });
        this.serviceMaterialUpdate(this.formModel);
      } catch (error) {
        this.$logger.error("serviceMaterial put error", error);
      }
    },
    async saveBlackBoxInspection() {
      try {
        const response = await this.$api.post(`blackBoxInspection/`, {
          description: this.formModel.blackBoxInspectionResult,
          technicalServiceId: this.formModel.id,
          employeeId: this.formModel.assignedTechnician.id,
        });
        if (response.data) {
          formModel.warrantyTypeId = formModel.warrantyType.id;
          formModel;
        }
        this.$logger.log("saveBlackBoxInspection", response.data);
        this.$q.notify({
          progress: true,
          type: "info",
          color: "info",
          message: "Kayıt Güncellendi" /*this.$t("success")*/,
          caption: this.$t("success"),
        });
        //emit completed
        this.$emit("completed");
      } catch (error) {
        this.$logger.error("saveBlackBoxInspection error", error);
      }
    },
    async addCaseNumbers() {
      if (this.newCaseNumber.caseNumber.trim() !== "") {
        try {
          const response = await this.$api
            .post(`addCaseNumber`, {
              ...this.newCaseNumber,
              technicalServiceId: this.formModel.id,
            })
            .catch((error) => {
              this.$logger.error("Error adding case number:", error);
              if (error.response.data.message.name.includes("Unique")) {
                this.$q.notify({
                  type: "negative",
                  message: "Bu case number daha önce eklenmiş.",
                });
              } else {
                this.$q.notify({
                  type: "negative",
                  message: "Case number eklenirken hata oluştu.",
                });
              }
            });
          this.newCaseNumber = {};
          this.getCaseNumbers();
        } catch (error) {
          this.$logger.error("Error add case number:", error);
        }
      }
    },
    async getCaseNumbers() {
      try {
        const response = await this.$api.get(
          `getCaseNumbers/${this.formModel.id}`
        );
        this.$logger.log("getCaseNumbers", response.data);
        this.formModel.serviceCaseNumbers = response.data;
      } catch (error) {
        this.$logger.error("Error get case numbers:", error);
      }
    },
    deleteCaseNumbers(index) {
      //this.formModel.serviceCaseNumbers.splice(index, 1);
      Dialog.create({
        title: "Sil",
        message: `Seçtiğiniz case number silinecek. Emin misiniz?</br>Case Number: ${this.formModel.serviceCaseNumbers[index].caseNumber}`,
        html: true,
        persistent: true,
        ok: {
          color: "negative",
          label: this.$t("delete"),
        },
        cancel: {
          color: "yellow-9",
          label: this.$t("cancel"),
        },
      }).onOk(() => {
        var _caseNum = this.formModel.serviceCaseNumbers[index];
        _caseNum.isActive = false;
        this.$api.put(`serviceCaseNumbers`, _caseNum).then((resp) => {
          this.$logger.log("deleteCaseNumber", resp);
          this.getCaseNumbers();
        });
      });
    },
    async getWarrantyTypes() {
      try {
        if (this.formModel.id) {
          const response = await this.$api.get("getWarrantyTypes/null");
          this.warrantyOptions = response.data;
        }
      } catch (error) {
        this.$logger.error("Error fetching warranty types:", error);
      }
    },
    async serviceMaterialUpdate(serviceMaterial) {
      try {
        const response = this.$api
          .put("serviceMaterials", serviceMaterial)
          .then((_response) => {
            this.$logger.log("serviceMaterials", _response.data);
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: "Parça Listesi Güncellendi" /*this.$t("success")*/,
              caption: this.$t("success"),
            });
            //emit completed
            this.$emit("completed");
          });
      } catch (error) {
        this.$logger.error("serviceMaterial put error", error);
      }
    },

    async translate() {
      try {
        //translateService servisine gönder
        const response = await this.$api.post("translateService", {
          text: this.formModel.manufacturerBrandResponseOrginal,
          language: "TR",
        });
        this.$logger.log("translateService", response.data);
        this.formModel.manufacturerBrandResponse = response.data.data;
      } catch (error) {
        this.$logger.error("serviceMaterial put error", error);
      }
    },
  },
});
</script>

<style scoped>
.q-ma-xs {
  margin: 0.5rem !important;
}
</style>
