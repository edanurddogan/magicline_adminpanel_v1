<template>
  <div class="row">
    <div class="row col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-pa-xs col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>
            {{ $t("technicalService.faultInformations") }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  filled
                  :label="$t('technicalService.userComment')"
                  type="textarea"
                  lazy-rules
                  readonly
                  v-model="formModel.issueDescription"
                >
                  <template v-slot:prepend>
                    <q-icon name="info" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-11 col-md-11 col-sm-11 col-xs-11">
              <q-item-section>
                <q-select
                  :disable="!formModel.id"
                  dense
                  filled
                  v-model="selectedServiceFaultCodes"
                  :options="faultCodesFiltered"
                  :label="$t('technicalService.selectFaultCode')"
                  option-value="id"
                  :option-label="
                    (item) => `${item.code} - ${item.detail} - ${item.priority}`
                  "
                  multiple
                  use-input
                  @filter="filterFaultCodes"
                  @update:model-value="(val) => onFaultCodeSelected(val)"
                >
                  <template v-slot:prepend>
                    <q-icon name="warning" />
                  </template>
                  <q-tooltip v-if="!formModel.id">
                    {{
                      formModel.id
                        ? ""
                        : $t("technicalService.saveFormFirstAdd")
                    }}
                  </q-tooltip>
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
              <q-item-section>
                <q-btn
                  icon="add"
                  dense
                  class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                  text-color="white"
                  @click="faultCodesFormVisibile = true"
                  square
                >
                  <q-tooltip>
                    {{ $t("technicalService.addNewFaultCode") }}
                  </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="row q-pa-md" style="max-width: 100%; width: 100%">
            <!-- Ana container için row ve position: relative kullanıyorum -->
            <div style="position: relative; width: 100%">
              <!-- Liste tam genişlik kullanıyor -->
              <q-list
                bordered
                separator
                style="width: 90%; margin-bottom: 16px"
              >
                <q-item
                  class="row"
                  v-for="(fc, index) in formModel.technicalServiceFaultCodes"
                  :key="index"
                >
                  <q-item-section
                    >{{ fc.faultCode?.code }} - {{ fc.faultCode?.detail }} -
                    {{ fc.faultCode?.priority }}</q-item-section
                  >
                  <q-item-section side>
                    <q-btn
                      dense
                      flat
                      round
                      icon="close"
                      color="red"
                      @click="removeFaultCode(fc)"
                      class="q-ml-xs"
                    />
                  </q-item-section>
                </q-item>
              </q-list>

              <!-- Buton sağ altta konumlandırılıyor -->
              <q-btn
                :disable="!formModel.id"
                color="primary"
                icon="save"
                class="text-capitalize q-pa-xs q-ma-xs"
                style="
                  position: absolute;
                  top: 0;
                  right: 0;
                  max-width: 50px;
                  max-height: 50px;
                "
                @click="faultCodeSave"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="bg-primary text-white">
          <div>
            {{ $t("technicalService.caseNumbers") }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-ma-none q-pa-none">
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
        </q-card-section>
      </q-card>
      <q-card class="q-pa-xs col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>
            {{ $t("technicalService.productInformations") }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  dense
                  option-dense
                  use-input
                  :disable="mode === 'details'"
                  outlined
                  v-model="formModel.stockSerial.stockCard.brand.name"
                  :options="filteredBrands"
                  @filter="filterBrands"
                  option-value="id"
                  option-label="name"
                  :label="$t('products.brand')"
                  clearable
                  @update:model-value="(val) => brandSelected(val)"
                  readonly
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  dense
                  option-dense
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
                  @update:model-value="(val) => modelSelected(val)"
                  readonly
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('technicalService.serialNo')"
                  v-model="formModel.stockSerial.serialNo"
                  :rules="[(val) => !!val || 'Field is required']"
                  readonly
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-separator />
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div>
              {{ $t("technicalService.partsReplacementList") }}
            </div>
          </q-card-section>

          <q-card-section>
            <q-list class="row">
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-select
                    :disable="isEditing"
                    dense
                    option-dense
                    v-model="selectedPart.material"
                    :options="filteredParts"
                    option-value="id"
                    :option-label="
                      (item) => `${item.stockCode} - ${item.stockName}`
                    "
                    :label="$t('technicalService.selectPart')"
                    use-input
                    input-debounce="300"
                    @filter="filterParts"
                    behavior="menu"
                    filled
                    clearable
                  >
                    <template v-slot:prepend>
                      <q-icon name="build" />
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>

              <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                <q-item-section>
                  <q-input
                    v-model.number="selectedPart.quantity"
                    type="number"
                    :label="$t('products.piece')"
                    filled
                    clearable
                    :min="0"
                    dense
                  >
                    <template v-slot:prepend>
                      <q-icon name="dialpad" />
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                <q-item-section>
                  <q-btn
                    v-if="!isEditing"
                    icon="add"
                    color="primary"
                    @click="addData"
                    dense
                  />
                  <q-btn
                    v-else
                    icon="edit"
                    color="secondary"
                    @click="saveEdit"
                    dense
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                <q-item-section>
                  <q-btn
                    icon="highlight_off"
                    color="negative"
                    @click="clearData"
                    ><q-tooltip>Temizle</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section>
            <q-table
              :rows="formModel.serviceMaterials"
              :columns="serviceMaterialsColumns"
              row-key="stockCode"
              :pagination="pagination"
              dense
            >
              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :label="props.row.serviceMaterialStatus.name"
                    :color="props.row.serviceMaterialStatus.color"
                    text-color="white"
                  />
                </q-td>
              </template>

              <template #body-cell-pickup="props">
                <q-td :props="props" class="q-pa-xs"> </q-td>
              </template>

              <template #body-cell-serialNo="props">
                <q-td key="serialNo" :props="props" class="q-pa-xs">
                  <q-input
                    v-if="props.row.addedRemovedMaterialSerialNo"
                    v-model="props.row.addedRemovedMaterialSerialNo.serialNo"
                    :disable="props.row.serviceMaterialStatusId !== 4"
                    dense
                    autofocus
                    @update:model-value="props.row.saveSerial = true"
                    @keyup.enter="setSerialNoOnMaterials(props.row)"
                  />
                </q-td>
              </template>

              <template #body-cell-action="props">
                <q-td :props="props">
                  <!--v-show="props.row.saveSerial"-->
                  <q-btn
                    :disable="props.row.saveSerial !== true"
                    flat
                    dense
                    round
                    :icon="props.row.saveSerial ? 'save' : ''"
                    color="green"
                    @click="setSerialNoOnMaterials(props.row)"
                  >
                    <q-tooltip v-if="props.row.saveSerial">
                      {{ $t("technicalService.saveSerialNo") }}
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    :disable="props.row.serviceMaterialStatusId !== 3"
                    flat
                    dense
                    round
                    :icon="
                      props.row.serviceMaterialStatusId === 3 ? 'soap' : ''
                    "
                    color="green"
                    @click="pickupMaterials(props.row)"
                  >
                    <q-tooltip v-if="props.row.serviceMaterialStatusId === 3">
                      {{ $t("technicalService.pickup") }}
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    :disable="props.row.serviceMaterialStatusId !== 4"
                    flat
                    dense
                    round
                    :icon="
                      props.row.serviceMaterialStatusId === 4
                        ? 'play_for_work'
                        : ''
                    "
                    color="green"
                    @click="assemblyMaterials(props.row)"
                  >
                    <q-tooltip v-if="props.row.serviceMaterialStatusId === 4">
                      {{ $t("technicalService.assembly") }}
                    </q-tooltip>
                  </q-btn>
                  &nbsp;&nbsp;&nbsp;
                  <q-btn
                    flat
                    round
                    dense
                    icon="edit"
                    color="primary"
                    @click="editRow(props.row)"
                  />
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    color="negative"
                    @click="openDeleteDialog(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
          <q-card-actions class="justify-end">
            <q-btn
              color="primary"
              :label="$t('technicalService.sendWarehouseRequest')"
              class="text-capitalize"
              @click="requestWarehouse"
            />
          </q-card-actions>
        </q-card>
      </q-card>
    </div>
  </div>
  <!--Camera Dialog-->
  <q-dialog v-model="isCameraOpen" persistent>
    <q-card style="min-width: 60vw; max-height: 95vh" class="q-pa-md column">
      <!-- Kamera ikonu ve yazısını ortalama -->
      <q-card-section class="q-pa-none q-ma-none flex flex-center column">
        <q-avatar icon="camera_alt" color="blue" text-color="white" />
        <h5 class="q-mt-sm">{{ $t("users.camera") }}</h5>
      </q-card-section>

      <!-- Kamera görüntüsü -->
      <q-card-section class="q-pa-none q-ma-none flex flex-center">
        <div>
          <video
            ref="videoElement"
            autoplay
            style="width: 100%; max-height: 70vh"
          ></video>
          <canvas ref="canvasElement" style="display: none"></canvas>
        </div>
      </q-card-section>

      <!-- Butonlar kameranın altına alındı -->
      <q-card-actions class="q-mt-auto q-pa-md justify-center">
        <q-btn @click="capturePhoto" label="Capture" color="primary" />
        <q-btn
          @click="closeCamera"
          label="Close"
          color="negative"
          class="q-ml-md"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Delete Image Dialog -->
  <q-dialog v-model="deleteImageFormVisible" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="delete" color="negative" text-color="white" />&nbsp;
        &nbsp; &nbsp; &nbsp;
        <h5>{{ $t("deleteConfirm") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>{{ $t("products.deleteImageMessage") }}</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          color="primary"
          v-close-popup
        /><q-space />
        <q-btn
          flat
          :label="$t('delete')"
          color="negative"
          v-on:click="imageDelete(deleteImage)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="deleteDialogVisible">
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="delete" color="negative" text-color="white" />&nbsp;
        &nbsp; &nbsp; &nbsp;
        <h5>{{ $t("order.deleteconfirm") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>"Seçtiğiniz parça kaldırılacak. Emin misiniz?"</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          color="primary"
          @click="deleteDialogVisible = false"
        /><q-space />
        <q-btn
          flat
          :label="$t('delete')"
          color="negative"
          v-on:click="deleteRowConfirmed"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar, date, LocalStorage, Dialog } from "quasar";

export default defineComponent({
  name: "TechnicalServiceTechnicianForm",
  components: {},
  setup(props, { emit }) {
    const $q = useQuasar();
    var formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });
    this.$logger.log("formModel", formModel.value);

    try {
      if (props.mode == "add") {
        formModel.value.serialNo = "";

        formModel.value.stockName = "";

        formModel.value.stockCode = "";

        formModel.value.faultCode = { code: "" };

        formModel.value.technicalServiceStatus = {
          process: "",
          status: "",
          color: "",
        };
        formModel.value.technicalServiceType = { name: "" };
        formModel.value.technicalServiceNo = "";
        formModel.value.detail = "";
        formModel.value.isActive = true;

        formModel.value.firm = { id: 0, commercialTitle: "Seç" };
        formModel.value.serviceProvider = {
          id: 0,
          commercialTitle: "Seç",
        };

        formModel.value.technicalServiceFaultCodes = [];
        formModel.value.technicalServiceAdmissionDate = date.formatDate(
          Date(),
          "YYYY-MM-DD"
        );

        formModel.value.startDate = date.formatDate(Date(), "YYYY-MM-DD");
        formModel.value.finishDate = "0000.00.00";
      } else {
        if (!formModel.value.firm) {
          formModel.value.firm = { id: 0, commercialTitle: "Seç" };
        }
        formModel.value.technicalServiceAdmissionDate = date.formatDate(
          formModel.value.technicalServiceAdmissionDate,
          "YYYY-MM-DD"
        );

        formModel.value.startDate = date.formatDate(
          formModel.value.startDate,
          "YYYY-MM-DD"
        );
        formModel.value.finishDate =
          formModel.value.finishDate == undefined
            ? "0000.00.00"
            : date.formatDate(formModel.value.finishDate, "YYYY-MM-DD");
        //formModel.value.serialNo = formModel.value.stockSerialNo.serialNo;

        //formModel.value.stockName =
        //  formModel.value.stockSerialNo.stockCard.stockName;
        //
        //formModel.value.stockCode =
        //  formModel.value.stockSerialNo.stockCard.stockCode;
      }
    } catch (error) {
      this.$logger.log("formModel error: ", error);
    }
    return {
      formModel,
    };
  },

  computed: {
    serviceMaterialsColumns() {
      return [
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
          field: (row) => row.quantity,
        },
        {
          name: "status",
          label: "Status",
          align: "center",
          field: "status",
        },
        {
          name: "serialNo",
          label: "Serial No",
          align: "center",
          field: (row) => row.serial,
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
  data() {
    return {
      //QTable
      isEditing: false,
      loading: false,
      rows: [],
      selectedId: 0,
      formVisible: false,
      deleteConfirm: false,
      currentMode: this.$t("add"),
      productionCurrentMode: this.$t("new"),
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      isGrid: false,
      technicalServiceImages: [],
      deleteImageFormVisible: false,
      previewImage: null,
      imagePreviewVisible: false,
      imageDescription: "",
      newCaseNumber: {},
      items: JSON.parse(localStorage.getItem("items")) || [],
      isCameraOpen: false,
      videoStream: null,
      image: "",
      description: "",

      //Q-Select
      technicalServiceStatuses: [],
      technicalServiceStatusesFiltered: [],
      technicalServiceTypes: [],
      technicalServiceTypesFiltered: [],
      faultCodesFull: [],
      faultCodesFiltered: [],

      saveLoading: false,
      saved: false,
      faultCodesFormVisibile: false,

      selectedBrand: {},
      selectedModel: {},
      //technicalServiceAdmissionDate: null,
      //serialNo: "",

      filteredBrands: [],
      filteredModels: [],
      brands: [],
      models: [],
      selectedErrorCode: [],
      faultCodes: [],
      text: [],
      addresstext: [],
      selectedPart: {
        material: { id: 0, stockCode: "Seç", stockName: "" },
        quantity: 1,
      },
      parts: [],
      materials: [],
      filteredParts: [],
      pagination: { rowsPerPage: 10 },
      deleteDialogVisible: false,
      rowToDelete: false,
      selectedServiceFaultCodes: [],
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
    this.$logger.log("mode: ", this.mode);
    this.$logger.log("formModel: ", this.formModel);

    this.formMode = "edit";
    this.init();
    document.title = `Magicline - ${this.$t("pages.technicalService")}`;
    this.filteredBrands = this.brands;
    this.filteredModels = this.models;
    this.getMaterials();
  },
  methods: {
    async init() {
      this.getImages();
      this.getFaultCodes();
      this.getCaseNumbers();
      try {
        this.formModel.technicalServiceFaultCodes =
          this.formModel.technicalServiceFaultCodes.map((item) => ({
            ...item,
            value: `${item.faultCode.code} - ${item.faultCode.detail} - ${item.faultCode.priority}`,
          }));
      } catch (error) {
        this.$logger.log(error);
      }
    },

    requestWarehouse() {
      try {
        const requestData = {
          technicalServiceId: this.formModel.id,
          serviceMaterials: this.formModel.serviceMaterials.map((item) => ({
            ...item,
            assignedTechnicianId: this.formModel.assignedTechnicianId,
            requested: true,
            requestDate: new Date(),
          })),
        };
        this.$logger.log("requestData", requestData);
        this.$api.post("postServiceMaterials", requestData).then((response) => {
          this.$logger.log("postServiceMaterials response", response);
          this.getServiceMaterials();
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("technicalService.warehouseRequestSent"),
          });
        });
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async checkSerialNo() {
      try {
        const response = await this.$api.get(
          `checkSerialNo/${this.formModel.serialNo}`
        );
        this.$logger.log("checkSerialNo", response?.data);

        if (response?.data?.stockCard) {
          this.formModel.stockCardId = response?.data?.stockCardId;
          this.formModel.stockName = response?.data?.stockCard.stockName;
          this.formModel.stockCode = response?.data?.stockCard.stockCode;
          this.formModel.stockSerialNoId = response?.data?.id;
          this.$logger.log("this.formModel.stockSerialNo2", this.formModel);

          this.printSerialNo_Print = true;
          this.printSerialNo_Control = true;

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("technicalService.productFound"),
          });
        } else {
          this.formModel.serialNo = "";
          this.formModel.stockCardId = "";
          this.formModel.stockName = "";
          this.formModel.stockCode = "";

          this.printSerialNo_Print = false;
          this.printSerialNo_Control = false;

          this.$q.notify({
            progress: true,
            type: "negative",
            color: "negative",
            message: this.$t("unsuccessful"),
            caption: this.$t("technicalService.productNotFound"),
          });
        }
      } catch (error) {
        this.$logger.log(error);
      }
    },
    save() {
      try {
        if (!this.formModel.firm.id) {
          this.$q.notify({
            progress: true,
            type: "warning",
            color: "warning",
            message: this.$t("error"),
            caption: this.$t("technicalService.firmNotSelected"),
          });
          return;
        }
        if (!this.formModel.serviceProvider.id) {
          this.$q.notify({
            progress: true,
            type: "warning",
            color: "warning",
            message: this.$t("error"),
            caption: this.$t("technicalService.serviceProviderNotSelected"),
          });
          return;
        }
        if (!this.formModel.technicalServiceType.id) {
          this.$q.notify({
            progress: true,
            type: "warning",
            color: "warning",
            message: this.$t("error"),
            caption: this.$t(
              "technicalService.technicalServiceTypeNotSelected"
            ),
          });
          return;
        }
        if (!this.formModel.technicalServiceStatus.id) {
          this.$q.notify({
            progress: true,
            type: "warning",
            color: "warning",
            message: this.$t("error"),
            caption: this.$t(
              "technicalService.technicalServiceStatusNotSelected"
            ),
          });
          return;
        }
        if (!this.formModel.faultCode.id) {
          this.$q.notify({
            progress: true,
            type: "warning",
            color: "warning",
            message: this.$t("error"),
            caption: this.$t("technicalService.faultCodeNotSelected"),
          });
          return;
        }

        this.saveLoading = true;
        this.$logger.log("this.formModel", this.formModel);
        this.formModel.isActive = true;

        this.formModel.technicalServiceStatusId =
          this.formModel.technicalServiceStatus.id;

        this.formModel.firmId = this.formModel.firm.id;

        this.formModel.serviceProviderId = this.formModel.serviceProvider.id;

        this.formModel.technicalServiceTypeId =
          this.formModel.technicalServiceType.id;

        this.formModel.faultCodeId = this.formModel.faultCode.id;
        this.formModel.finishDate =
          this.formModel.finishDate == "0000.00.00"
            ? null
            : this.formModel.finishDate;

        this.$logger.log("formModel", this.formModel);
        if (this.mode === "add") {
          this.$logger.log("add");
          this.formModel.technicalServiceNo = "TS" + new Date().valueOf();
          this.addFormModel();
        } else if (this.mode === "edit") {
          this.$logger.log("edit");
          this.editFormModel();
        }
      } catch (error) {
        this.saveLoading = false;
        this.$q.notify({
          progress: true,
          type: "warning",
          color: "warning",
          message: this.$t("error"),
          caption: error,
        });
      }
    },
    addCaseNumbers() {
      if (this.newCaseNumber.caseNumber.trim() !== "") {
        try {
          const response = this.$api.post(`addCaseNumber`, {
            ...this.newCaseNumber,
            technicalServiceId: this.formModel.id,
          });
          this.newCaseNumber = {};
          this.getCaseNumbers();
        } catch (error) {
          this.$logger.error("Error add case number:", error);
        }
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

    async addFormModel() {
      this.formModel.faultCodeId = this.formModel.faultCode.id;
      const _response = this.$api
        .post("technicalServices", this.formModel)
        .then((response) => {
          this.saved = true;
          this.$emit("technicalServiceListRefresh");
          this.$logger.log(this.formModel);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });

          this.saveLoading = false;
          this.$emit("completed");
        });
    },

    async editFormModel() {
      const response = this.$api
        .put("technicalServices", this.formModel)
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
          this.saveLoading = false;
        });
    },
    onUploadFinish(files) {
      this.$refs.uploader.reset();
    },
    async uploadFiles(files) {
      this.$logger.log("Uploading files: ", files);
      this.uploaderLoading = true;

      try {
        const data = new FormData();
        const fileInfo = {
          fileType: "technicalService",
          id: this.formModel.id,
        };

        files.forEach((file) => {
          data.append("files", file); // Orijinal isim ile gönderiyoruz
        });

        data.append("fileInfo", JSON.stringify(fileInfo));

        const response = await this.$api.post("postUpload", data);
        this.$logger.log("Upload Success:", response);
        this.getImages();
        return true;
      } catch (error) {
        this.$logger.error("Upload Error:", error);
        return false;
      } finally {
        this.uploaderLoading = false;
      }
    },
    async openCamera() {
      try {
        this.isCameraOpen = true;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.videoStream = stream;
        this.$refs.videoElement.srcObject = stream;
      } catch (err) {
        this.$logger.error("Kamera erişim hatası:", err);
      }
    },
    onImageError() {
      this.previewImage = "";
    },
    submitImageDescription() {
      this.formModel.image = this.previewImage;
      this.formModel.imageDescription = this.imageDescription;
      this.$q.notify({
        color: "positive",
        message: this.$t("technicalService.descriptionSaved"),
        icon: "check_circle",
      });
    },
    async getImages() {
      try {
        //if (this.formModel.id == null) return;
        const response = await this.$api.get(
          `getImages/technicalService/${this.formModel.id}`
          //`getImages/technicalService/1`
        );
        this.technicalServiceImages = response.data.map((image) =>
          this.imageSrc(image)
        );
        //this.$logger.log("Images:", this.technicalServiceImages);
      } catch (error) {
        this.$logger.error("Error get technicalService images:", error);
      }
    },
    imageSrc(src) {
      try {
        const imgPath = `http://fixaura.infaura.com/assets/img/technicalService/${this.formModel.id}/${src}`;
        //const imgPath = `http://fixaura.infaura.com/assets/img/technicalService/1/${src}`;
        //this.$logger.log("Image Path:", imgPath);
        return imgPath;
      } catch (error) {
        this.$logger.error("Error get image src:", error);
      }
    },
    imageDelete(image) {
      var img = image.split("/");
      var imgName = img[img.length - 1];
      const response = this.$api.post(`deleteFile`, image).then((resp) => {
        this.$logger.log("imageDelete", resp);
        this.Images();
        this.deleteImageFormVisible = false;
      });
    },
    capturePhoto() {
      const video = this.$refs.videoElement;
      const canvas = this.$refs.canvasElement;
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "captured_image.jpg", {
          type: "image/jpeg",
        });

        // 📌 q-uploader'a dosyayı ekle
        this.$refs.uploader.addFiles([file]);

        this.closeCamera();
      }, "image/jpeg");
    },
    closeCamera() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach((track) => track.stop());
      }
      this.isCameraOpen = false;
    },

    async getFaultCodes() {
      try {
        const response = await this.$api.get("faultCodes");
        this.$logger.log("faultCodes", response.data);
        this.faultCodesFull = response.data.map((item) => ({
          ...item,
          code: `${item.code} - ${item.detail} - ${item.priority}`,
        }));
        this.faultCodesFiltered = this.faultCodesFull;

        this.formModel.technicalServiceFaultCodes.map((fc) => {
          this.selectedServiceFaultCodes.push(fc.faultCode);
        });
        this.$logger.log(
          "selectedServiceFaultCodes",
          this.selectedServiceFaultCodes
        );
      } catch (error) {
        this.$logger.error("Hata oluştu:", error);
      }
    },

    updateFaultCodes(val) {
      this.$logger.log("val", val);
      this.$logger.log(
        "this.formModel.technicalServiceFaultCodes",
        this.formModel.technicalServiceFaultCodes
      );
    },

    filterFaultCodes(val, update) {
      if (!val) {
        update(() => {
          this.faultCodesFiltered = this.faultCodesFull;
        });
        return;
      }

      update(() => {
        this.faultCodesFiltered = this.faultCodesFull.filter((v) =>
          v.code.toLowerCase().includes(val.toLowerCase())
        );
      });
    },
    removeFaultCodeold(selectedCode) {
      this.formModel.technicalServiceFaultCodes =
        this.formModel.technicalServiceFaultCodes.filter(
          (item) => item.id !== selectedCode.id
        );
    },

    async onFaultCodeSelected(selectedCodes) {
      try {
        // Eğer selectedCodes undefined veya null ise boş dizi olarak kabul et
        if (!selectedCodes) selectedCodes = [];

        // 1. Silinmiş kodları tespit et ve kaldır
        // (selectedCodes'ta olmayan ama technicalServiceFaultCodes'ta olan)
        const toRemove = this.formModel.technicalServiceFaultCodes.filter(
          (existingItem) =>
            !selectedCodes.some(
              (selectedItem) => selectedItem.id === existingItem.faultCode.id
            )
        );

        // Silinecek öğeleri kaldır
        for (const itemToRemove of toRemove) {
          const index = this.formModel.technicalServiceFaultCodes.findIndex(
            (item) => item.faultCode.id === itemToRemove.faultCode.id
          );
          if (index !== -1) {
            this.formModel.technicalServiceFaultCodes.splice(index, 1);
          }
        }

        // 2. Yeni kodları ekle
        // (selectedCodes'ta olan ama technicalServiceFaultCodes'ta olmayan)
        for (const selectedCode of selectedCodes) {
          const exists = this.formModel.technicalServiceFaultCodes.some(
            (item) => item.faultCode.id === selectedCode.id
          );

          if (!exists) {
            // Yeni kod ekle
            this.formModel.technicalServiceFaultCodes.push({
              faultCode: { ...selectedCode },
            });
          }
        }

        this.$logger.log(
          "Güncellenmiş hata kodları:",
          this.formModel.technicalServiceFaultCodes
        );
      } catch (error) {
        this.$logger.error("Hata kodu seçerken hata:", error);
      }
    },

    removeFaultCode(selectedCode) {
      // 1. formModel.technicalServiceFaultCodes dizisinden öğeyi sil
      const tsfcIndex = this.formModel.technicalServiceFaultCodes.findIndex(
        (item) => item.faultCode.id === selectedCode.faultCode.id
      );
      if (tsfcIndex !== -1) {
        this.formModel.technicalServiceFaultCodes.splice(tsfcIndex, 1);
      }

      // 2. selectedServiceFaultCodes dizisinden öğeyi sil
      const ssfcIndex = this.selectedServiceFaultCodes.findIndex(
        (item) => item.id === selectedCode.faultCode.id
      );
      if (ssfcIndex !== -1) {
        this.selectedServiceFaultCodes.splice(ssfcIndex, 1);
      }
    },
    faultCodeSave() {
      try {
        this.$api
          .post("postServiceFaultCodes", {
            serviceId: this.formModel.id,
            faultCodes: this.formModel.technicalServiceFaultCodes,
          })
          .then((response) => {
            this.$logger.log("Fault codes saved successfully:", response.data);
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: this.$t("technicalService.faultCodeSaved"),
              caption: this.$t("success"),
            });
          });
      } catch (error) {
        this.$logger.error("Error saving fault codes:", error);
      }
    },
    async getTechnicalServiceTypes() {
      const response = this.$api
        .get("getTechnicalServiceTypes")
        .then((data) => {
          this.$logger.log("data", data.data);
          let result = data.data;

          this.technicalServiceTypes = result;
        });
    },

    async getMaterials() {
      try {
        const response = await this.$api.get("materials");
        this.$logger.log("data", response.data);
        this.materials = response.data.map((item) => ({
          ...item,
          value: `${item.stockCode} - ${item.stockName}`,
        }));
        this.filteredParts = response.data; // İlk başta tüm malzemeleri göster
      } catch (error) {
        this.$logger.error("Malzemeler yüklenirken hata oluştu:", error);
      }
    },
    async getTechnicalServiceStatuses() {
      const response = this.$api
        .get("getTechnicalServiceStatuses")
        .then((data) => {
          this.$logger.log("data", data.data);
          let result = data.data;
          result.map((item) => {
            if (item.status)
              item.process = item.process + " (" + item.status + ")";
          });
          this.technicalServiceStatuses = result;
        });
    },

    filterTechnicalServiceStatuses(val, update) {
      if (val === "") {
        update(() => {
          this.technicalServiceStatusesFiltered = this.technicalServiceStatuses;
        });
        return;
      }

      update(() => {
        this.technicalServiceStatusesFiltered =
          this.technicalServiceStatuses.filter(
            (v) => v.process.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
      });
    },

    async getCurrency() {
      const response = this.$api.get("currencies").then((data) => {
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

    async Delete() {
      try {
        this.$logger.log(this.currentRow.id);
        const response = await this.$api.delete(
          "orderItems/" + this.currentRow.id
        );
        this.getOrderItems();
        this.deleteConfirm = false;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getList() {
      try {
        this.$logger.log("this.formModel", this.formModel);
        this.loading = true;
        const response = await this.$api.get("getOrder/" + this.formModel.id);
        this.formModel = response?.data;

        this.formModel.orderDate = date.formatDate(
          this.formModel.orderDate,
          "YYYY-MM-DD"
        );
        this.formModel.dispatchDate = date.formatDate(
          this.formModel.dispatchDate,
          "YYYY-MM-DD"
        );

        this.$logger.log("formModel 1: ", this.formModel);
        this.formModel = this.formModel;
        this.rows = this.formModelItems;
        this.$logger.log("this.rows: ", this.rows);
        this.loading = false;
      } catch (error) {
        this.$logger.log(error);
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
        this.$logger.log("Filtrelenmiş Markalar:", this.filteredBrands);
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
    saveForm() {
      this.$logger.log("form model:", this.formModel);
    },
    saveEdit() {
      const index = this.formModel.serviceMaterials.findIndex(
        (row) => row.material.id === this.selectedPart.material.id
      );
      if (index !== -1) {
        this.formModel.serviceMaterials[index].quantity =
          this.selectedPart.quantity;
      }
      (this.selectedPart = { material: { id: 0, value: "Seç" }, quantity: 1 }),
        (this.isEditing = false);
      this.$q.notify({
        message: "Güncelleme kaydedildi!",
        color: "positive",
        timeout: 2000,
      });
    },
    addData() {
      if (this.selectedPart.material.id > 0 && this.selectedPart.quantity > 0) {
        this.$logger.log("selectedPart", this.selectedPart);
        const index = this.formModel.serviceMaterials.findIndex(
          (row) => row.material.id === this.selectedPart.material.id
        );
        if (index !== -1) {
          this.formModel.serviceMaterials[index].quantity +=
            this.selectedPart.quantity;
        } else {
          this.formModel.serviceMaterials.push({
            ...this.selectedPart,
            serviceMaterialStatus: {
              id: 1,
              name: "Listeye Eklendi",
              color: "green-4",
            },
            serviceMaterialStatusId: 1,
          });
        }

        this.selectedPart = { id: 0, value: "Seç", quantity: 1 };
      } else {
        this.$q.notify({
          type: "negative",
          message: "Lütfen geçerli bir parça ve adet girin!",
        });
      }
    },
    async setSerialNoOnMaterials(row) {
      try {
        const response = await this.$api.post(`findServiceMaterialSerial`, {
          serialNumber: row.addedRemovedMaterialSerialNo.serialNo,
          materialId: row.material.id,
        });
        if (response.data) {
          row.addedRemovedMaterialSerialNoId = response.data.id;
          this.updateMaterials(row);
        } else {
          Dialog.create({
            title: "Hata",
            message: `Seri Numarası Bulunamadı.<br/>
            Yeni Seri Numarası Olarak Kaydedilsin mi?<br/>
            Seri Numarası: ${row.addedRemovedMaterialSerialNo.serialNo}`,
            persistent: true,
            html: true,
            persistent: true,

            ok: {
              color: "primary",
              label: this.$t("savedata"),
            },
            cancel: {
              color: "yellow-9",
              label: this.$t("cancel"),
            },
          }).onOk(() => {
            this.$api
              .post("materialSerials", {
                serialNo: row.addedRemovedMaterialSerialNo.serialNo,
                materialId: row.material.id,
              })
              .then((response) => {
                this.$logger.log("addServiceMaterialSerial", response.data);
                row.addedRemovedMaterialSerialNoId = response.data.id;
                this.updateMaterials(row);
              });
          });
        }
      } catch (error) {
        this.$logger.error("Error finding service material serial:", error);
      }
    },
    async pickupMaterials(row) {
      row.serviceMaterialStatusId = 4;
      row.received = true;
      row.receivedDate = new Date();
      this.updateMaterials(row);
    },

    async assemblyMaterials(row) {
      row.assembly = true;
      row.assemblyDate = new Date();
      row.serviceMaterialStatusId = 5;
      this.updateMaterials(row);
    },
    async updateMaterials(row) {
      try {
        const response = await this.$api.put("serviceMaterials", row);
        this.$logger.log("updateMaterials", response.data);
        this.$q.notify({
          progress: true,
          type: "info",
          color: "info",
          message: this.$t("success"),
          caption: this.$t("technicalService.materialsUpdated"),
        });
        this.getServiceMaterials();
      } catch (error) {
        this.$logger.error("Error updating materials:", error);
        this.$q.notify({
          progress: true,
          type: "negative",
          color: "negative",
          message: this.$t("error"),
          caption: this.$t("technicalService.materialsUpdateFailed"),
        });
      }
    },

    async getServiceMaterials() {
      try {
        const response = await this.$api.get(
          `getServiceMaterials/${this.formModel.id}`
        );
        this.$logger.log("getServiceMaterials", response.data);
        this.formModel.serviceMaterials = response.data.map((item) => ({
          ...item,
          material: item.material,
          serviceMaterialStatus: item.serviceMaterialStatus,
          serialNo: item.addedRemovedMaterialSerialNo?.serialNo,
          addedRemovedMaterialSerialNo: item.addedRemovedMaterialSerialNo
            ? item.addedRemovedMaterialSerialNo
            : {},
        }));
      } catch (error) {
        this.$logger.error("Error getting service materials:", error);
      }
    },
    filterParts(val, update) {
      update(() => {
        if (val === "") {
          this.filteredParts = this.materials;
        } else {
          const searchTerm = val.toLowerCase();
          this.filteredParts = this.materials.filter((item) =>
            item.name.toLowerCase().includes(searchTerm)
          );
        }
      });
    },

    editRow(row) {
      this.selectedPart = row;
      //this.selectedPart.quantity = row.quantity;
      this.isEditing = true; // Edit butonuna basılınca "edit mode" açılır
    },
    openDeleteDialog(row) {
      this.rowToDelete = row;
      this.deleteDialogVisible = true;
    },
    deleteRowConfirmed() {
      const index = this.formModel.serviceMaterials.indexOf(this.rowToDelete);
      if (index > -1) {
        this.formModel.serviceMaterials.splice(index, 1);
      }
      this.deleteDialogVisible = false;
      this.rowToDelete = null;
    },

    deleteRow(row) {
      const index = this.formModel.serviceMaterials.indexOf(row);
      if (index > -1) {
        this.formModel.serviceMaterials.splice(index, 1);
      }
    },
    clearData() {
      this.selectedPart = {
        material: { id: 0, stockCode: "Seç", stockName: "" },
        quantity: 1,
      };
      this.quantity = 1;
      this.isEditing = false;
    },
  },
});
</script>
<style scoped></style>
