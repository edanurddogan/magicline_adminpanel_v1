<template>
  <div class="row">
    <div class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-pa-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            expand-separator
            icon="add_link"
            :label="$t('products.definitionsinfo')"
          >
            <q-card>
              <q-card-section>
                <q-list class="row">
                  <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <q-item-section class="col-lg-3 col-md-3 col-sm-4 col-xs-4">
                      <q-btn
                        dense
                        class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                        text-color="white"
                        @click="faultCodesFormVisibile = true"
                      >
                        {{ $t("technicalService.faultCodes") }}
                      </q-btn>
                    </q-item-section>

                    <q-item-section class="col-lg-3 col-md-3 col-sm-4 col-xs-4">
                      <q-btn
                        dense
                        class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                        text-color="white"
                        @click="serviceTypesFormVisibile = true"
                      >
                        {{ $t("technicalService.serviceTypes") }}
                      </q-btn>
                    </q-item-section>

                    <q-item-section class="col-lg-3 col-md-3 col-sm-4 col-xs-4">
                      <q-btn
                        dense
                        class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                        text-color="white"
                        @click="processesFormVisibile = true"
                      >
                        {{ $t("technicalService.processes") }}
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            icon="add_link"
            :label="$t('products.images')"
          >
            <q-card>
              <q-card-section>
                <q-list bordered class="row">
                  <q-item class="q-pa-xs col-lg-4 col-md-4 col-sm-4 col-xs-6">
                    <q-item-section>
                      <q-uploader
                        ref="uploader"
                        label="Upload Files"
                        multiple
                        batch
                        @finish="onUploadFinish"
                        :factory="uploadFiles"
                        :disable="uploderDisable"
                      >
                        <template v-slot:header="scope">
                          <div
                            class="row no-wrap items-center q-pa-sm q-gutter-xs"
                          >
                            <q-btn
                              v-if="scope.queuedFiles.length > 0"
                              icon="clear_all"
                              @click="scope.removeQueuedFiles"
                              round
                              dense
                              flat
                            >
                              <q-tooltip>Clear All</q-tooltip>
                            </q-btn>
                            <q-btn
                              v-if="scope.uploadedFiles.length > 0"
                              icon="done_all"
                              @click="scope.removeUploadedFiles"
                              round
                              dense
                              flat
                            >
                              <q-tooltip>Remove Uploaded Files</q-tooltip>
                            </q-btn>
                            <q-spinner
                              v-if="scope.isUploading"
                              class="q-uploader__spinner"
                            />
                            <div class="col">
                              <div class="q-uploader__title">
                                Upload your files
                              </div>
                              <div class="q-uploader__subtitle">
                                {{ scope.uploadSizeLabel }} /
                                {{ scope.uploadProgressLabel }}
                              </div>
                            </div>
                            <q-btn
                              v-if="scope.canAddFiles"
                              :disable="uploderDisable"
                              icon="add_box"
                              @click="scope.pickFiles"
                              round
                              dense
                              flat
                            >
                              <q-uploader-add-trigger />
                              <q-tooltip>Pick Files</q-tooltip>
                            </q-btn>
                            <q-btn
                              v-if="scope.canUpload"
                              icon="cloud_upload"
                              @click="scope.upload"
                              round
                              dense
                              flat
                            >
                              <q-tooltip>Upload Files</q-tooltip>
                            </q-btn>
                            <q-btn
                              v-if="scope.isUploading"
                              icon="clear"
                              @click="scope.abort"
                              round
                              dense
                              flat
                            >
                              <q-tooltip>Abort Upload</q-tooltip>
                            </q-btn>
                          </div>
                        </template>
                      </q-uploader>
                    </q-item-section>
                  </q-item>
                  <q-item class="row col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <q-img
                      v-for="(image, index) in technicalServiceImages"
                      :key="index"
                      class="q-pa-xs q-ma-xs"
                      :src="imageSrc(image)"
                      spinner-color="primary"
                      spinner-size="82px"
                      style="height: 140px; max-width: 150px"
                    >
                      <div class="absolute-top-right">
                        <q-btn
                          color="red"
                          icon="delete"
                          round
                          ripple
                          dense
                          @click="
                            deleteImageFormVisible = true;
                            deleteImage = image;
                          "
                        ></q-btn>
                      </div>
                      <template v-slot:error>
                        <div
                          class="absolute-full flex flex-center bg-red-1 text-black"
                        >
                          {{ $t("cannotLoadImage") }}
                        </div>
                      </template>
                    </q-img>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("technicalService.customerInformations") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-input
                  outlined
                  v-model="formModel.customerName"
                  :label="$t('technicalService.customerName')"
                  :rules="[(val) => !!val || 'Bu alan zorunludur']"
                  clearable
                  @update:model-value="onCustomerNameChange"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel">
                <q-input
                  outlined
                  v-model="formModel.customerSurname"
                  :label="$t('technicalService.customerSurname')"
                  :rules="[(val) => !!val || 'Bu alan zorunludur']"
                  clearable
                  @update:model-value="onCustomerSurnameChange"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel">
                <q-input
                  filled
                  v-model="phoneNumber"
                  label="Telefon Numarası"
                  mask="(###) ### ## ##"
                  unmasked-value
                  :rules="[validatePhoneNumber]"
                  lazy-rules
                  clearable
                >
                  <template v-slot:append>
                    <q-icon name="phone" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel">
                <q-input
                  filled
                  v-model="email"
                  type="email"
                  label="E-posta Adresi"
                  placeholder="example@mail.com"
                  :rules="[validateEmail]"
                  lazy-rules
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="mail" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel">
                <q-select
                  filled
                  v-model="selectedCity"
                  :options="cities"
                  label="İl Seçiniz"
                  use-input
                  input-debounce="300"
                  clearable
                  map-options
                  emit-value
                  filter
                >
                  <template v-slot:prepend>
                    <q-icon name="location_city" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel">
                <q-select
                  filled
                  v-model="selectedDistrict"
                  :options="filteredDistricts"
                  label="İlçe Seçiniz"
                  use-input
                  input-debounce="300"
                  clearable
                  map-options
                  emit-value
                  filter
                  :disable="!selectedCity"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel">
                <q-input
                  filled
                  v-model="zipCode"
                  :label="
                    selectedCountry
                      ? `${selectedCountry} Posta Kodu`
                      : 'Posta Kodu'
                  "
                  :mask="zipMask"
                  placeholder="Örn: 34000"
                  :rules="[validateZipCode]"
                  lazy-rules
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="local_post_office" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  filled
                  v-model="addresstext"
                  label="Adres"
                  type="textarea"
                  :rules="[validateAddress]"
                  lazy-rules
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />
      </q-card>
    </div>
    <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>
            {{ $t("technicalService.technicalServiceProductRegistiration") }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel">
                <q-select
                  use-input
                  :disable="mode === 'details'"
                  outlined
                  v-model="formModel.selectedBrand"
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

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel">
                <q-select
                  use-input
                  :disable="mode === 'details'"
                  outlined
                  v-model="formModel.selectedModel"
                  :options="filteredModels"
                  @filter="filterModels"
                  option-value="id"
                  option-label="name"
                  :label="$t('products.model')"
                  clearable
                  @update:model-value="(val) => modelSelected(val)"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel">
                <q-input
                  type="date"
                  v-model="formModel.technicalServiceAdmissionDate"
                  :label="$t('technicalService.technicalServiceAdmissionDate')"
                  @update:model-value="onDateSelected"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('technicalService.serialNo')"
                  v-model="formModel.serialNo"
                  :rules="[(val) => !!val || 'Field is required']"
                  v-on:keyup.enter="checkSerialNo()"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-btn
                  class="text-capitalize"
                  v-show="printSerialNo_Print"
                  icon-right="send"
                  text-color="white"
                  color="secondary"
                  :label="$t('print')"
                />
                <q-btn
                  class="text-capitalize"
                  v-show="!printSerialNo_Print"
                  icon-right="done_all"
                  text-color="white"
                  color="warning"
                  :label="$t('products.checkit')"
                  @click="checkSerialNo()"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />
      </q-card>
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>
            {{ $t("technicalService.faultInformations") }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  filled
                  v-model="text"
                  label="Kullanıcı Yorumu"
                  type="textarea"
                  lazy-rules
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="info" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel">
                <q-select
                  filled
                  v-model="formModel.faultCodes"
                  :options="faultCodesFiltered"
                  label="Arıza Kodu Seçiniz"
                  option-value="id"
                  option-label="code"
                  clearable
                  multiple
                  use-input
                  @filter="filterFaultCodes"
                >
                  <template v-slot:prepend>
                    <q-icon name="warning" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <q-btn
                  icon="add"
                  dense
                  class="bg-secondary q-pa-xs q-ma-xs"
                  text-color="white"
                  @click="faultCodesFormVisibile = true"
                  square
                >
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="q-pa-md" style="max-width: 350px">
            <q-list bordered separator>
              <q-item
                class="row"
                v-for="(fc, index) in formModel.faultCodes"
                :key="index"
              >
                <q-item-section>{{ fc.code }}</q-item-section>
                <q-item-section>{{ fc.description }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-btn
              color="secondary"
              :label="$t('savedata')"
              icon-right="send"
              text-color="white"
              :loading="saveLoading"
              class="text-capitalize q-pa-sm q-mx-sm q-ml-auto"
              :style="{
                display: mode === 'details' ? 'none' : '',
              }"
              @click="saveForm"
            >
            </q-btn>
          </q-item>
        </q-card-section>

        <q-separator />
      </q-card>
    </div>
  </div>

  <!-- Processes Form -->
  <q-dialog
    v-model="processesFormVisibile"
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
              $t("technicalService.processes")
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
          <q-btn
            dense
            flat
            icon="close"
            v-close-popup
            @click="this.getTechnicalServiceStatuses()"
          >
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
        <technical-service-statuses-page class="q-pa-sm" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Fault Code Form -->
  <q-dialog
    v-model="faultCodesFormVisibile"
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
          <q-btn
            dense
            flat
            icon="close"
            v-close-popup
            @click="this.getFaultCodes()"
          >
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
        <fault-code-page class="q-pa-sm" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Technical Service Types Form -->
  <q-dialog
    v-model="serviceTypesFormVisibile"
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
              $t("technicalService.processes")
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
          <q-btn
            dense
            flat
            icon="close"
            v-close-popup
            @click="this.getTechnicalServiceTypes()"
          >
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
        <technical-service-types-page class="q-pa-sm" />
      </q-card-section>
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
</template>

<script>
import { defineComponent, computed } from "vue";
import FaultCodePage from "src/pages/FaultCodePage.vue";
import TechnicalServiceStatusesPage from "src/pages/TechnicalServiceStatusesPage.vue";
import TechnicalServiceTypesPage from "src/pages/TechnicalServiceTypesPage.vue";
import { useQuasar, date, LocalStorage } from "quasar";

export default defineComponent({
  name: "TechnicalServiceForm",
  components: {
    TechnicalServiceStatusesPage,
    FaultCodePage,
    TechnicalServiceTypesPage,
  },
  setup(props, { emit }) {
    var formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    this.$logger.log("props.modelValue", props.modelValue);
    this.$logger.log("props.mode", props.mode);
    this.$logger.log("formModel", formModel);

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

        formModel.value.technicalServiceAdmissionDate = date.formatDate(
          Date(),
          "YYYY-MM-DD"
        );

        formModel.value.startDate = date.formatDate(Date(), "YYYY-MM-DD");
        formModel.value.finishDate = "0000.00.00";
      } else {
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
        formModel.value.serialNo = formModel.value.stockSerialNo.serialNo;

        formModel.value.stockName =
          formModel.value.stockSerialNo.stockCard.stockName;

        formModel.value.stockCode =
          formModel.value.stockSerialNo.stockCard.stockCode;
      }
    } catch (error) {
      this.$logger.log("formModel error: ", error);
    }
    return {
      formModel,
    };
  },

  computed: {},
  data() {
    return {
      //Forms-
      OrderDetailFormVisible: false,
      ProductionPlanningFormVisible: false,
      //model: {},
      //QTable
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

      //Q-Select
      firmFiltered: [],
      serviceProviderFiltered: [],
      firmFull: [],
      technicalServiceStatuses: [],
      technicalServiceStatusesFiltered: [],
      technicalServiceTypes: [],
      technicalServiceTypesFiltered: [],
      serviceProviderFull: [],
      paymentTermFiltered: [],
      paymentTermFull: [],
      orderStatusFiltered: [],
      orderStatusFull: [],
      countriesFull: [],
      countriesFiltered: [],
      citiesFull: [],
      citiesFiltered: [],
      regionsFull: [],
      regionsFiltered: [],
      currenciesFull: [],
      currenciesFiltered: [],
      faultCodesFull: [],
      faultCodesFiltered: [],

      //Price
      kdvToplam: 0.0,
      araToplam: 0.0,
      genelToplam: 0.0,
      iskontoToplam: 0.0,
      dovizlikdvToplam: 0.0,
      dovizliaraToplam: 0.0,
      dovizligenelToplam: 0.0,
      dovizliiskontoToplam: 0.0,
      faturaIskonto: 0.0,
      faturaIskontoYuzde: 0.0,

      //Rules
      orderpaymentTermRule: [
        (val) => (val !== null && val.value !== "Seç") || "Ödeme Vadesi Seç",
      ],

      //Exchange
      exchangeDate: date.formatDate(Date(), "YYYY-MM-DD"),
      exchangeRate_TRY: 0.0,
      exchangeRate_USD: 0.0,
      exchangeRate_EUR: 0.0,

      saveLoading: false,
      saved: false,

      printSerialNo_Print: false,
      printSerialNo_Control: false,

      productRelatedFirm: {},
      technicalServiceClosed: false,
      processesFormVisibile: false,
      serviceTypesFormVisibile: false,
      faultCodesFormVisibile: false,

      images: [],
      deleteImageFormVisible: false,
      phoneNumber: "",
      selectedCity: "",
      cities: ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya"],
      selectedBrand: null,
      selectedModel: null,
      technicalServiceAdmissionDate: null,
      serialNo: "",
      customerName: "",
      customerSurname: "",
      email: "",
      address: "",
      selectedDistrict: "",
      filteredBrands: [],
      filteredModels: [],
      brands: [
        { id: 1, name: "DJI" },
        { id: 2, name: "Nikon" },
      ],
      models: [
        { id: 1, name: "a" },
        { id: 2, name: "b" },
        { id: 2, name: "c" },
        { id: 2, name: "d" },
      ],
      selectedErrorCode: [],
      faultCodes: [],
      text: [],
      addresstext: [],
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
    this.formModel.id = 1;
    this.formMode = "edit";
    this.init();
    this.$setPageTitle(this.$t("pages.technicalService"));
    this.filteredBrands = this.brands;
    this.filteredModels = this.models;
  },
  methods: {
    validatePhoneNumber(value) {
      const regex = /^[0-9]{10}$/; // 10 haneli telefon numarası bekleniyor
      return (
        regex.test(value.replace(/\D/g, "")) ||
        "Geçerli bir telefon numarası girin!"
      );
    },
    dateChange(data) {
      this.$logger.log(data);
      this.$logger.log(this.formModel.orderDate);
    },
    async init() {
      this.getFirm();
      this.getTechnicalServiceStatuses();
      //this.getTechnicalServiceTypes();
      this.getFaultCodes();
      this.getImages();
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}

      try {
        if (this.formModel.finishDate != "0000.00.00")
          this.technicalServiceClosed = true;
      } catch (error) {}
      /*this.formModel.startDate = date.formatDate(
        this.formModel.startDate,
        "YYYY-MM-DD"
      );
      this.formModel.finishDate = date.formatDate(
        this.formModel.finishDate,
        "YYYY-MM-DD"
      );*/

      if (this.mode !== "add") this.saved = true;
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

    paymentTermChange(data) {
      this.$logger.log("pt => ", data);
    },
    onSubmit() {},

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

    async getOrderItems() {
      this.$logger.log("getOrderItems", this.formModel.id);
      if (this.formModel.id) {
        this.loading = true;
        const _orderItems = await this.$api
          .get("getOrderItems/" + this.formModel.id)
          .then((resp) => {
            this.formModelItems = resp?.data;
            this.rows = this.formModelItems;
            this.loading = false;
            this.$logger.log("rows : ", this.rows);
          });
      }
      try {
        if (this.formModel?.order.id) {
          this.formModel.orderDate = date.formatDate(
            this.formModel.orderDate,
            "YYYY-MM-DD"
          );
          this.formModel.dispatchDate = date.formatDate(
            this.formModel.dispatchDate,
            "YYYY-MM-DD"
          );

          this.loading = false;
          this.tutarBilgileri();
        }
      } catch (error) {
        this.loading = false;
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

    async getExchange() {
      const response = this.$api.get("exchangeRates").then((data) => {
        this.$logger.log("exchangeRates", data.data);

        this.exchangeRate_TRY = data.data[0].TRY;
        this.exchangeRate_USD = data.data[0].USD;
        this.exchangeRate_EUR = data.data[0].EUR;
      });
    },

    async getFirm() {
      const response = this.$api.get("firms").then((data) => {
        this.firmFull = data.data;
        this.serviceProviderFull = data.data;
      });
    },

    async technicalServiceClose() {
      if (this.technicalServiceClosed == true)
        this.formModel.finishDate = date.formatDate(Date(), "YYYY-MM-DD");
      else this.formModel.finishDate = "0000.00.00";
    },

    filterFirm(val, update) {
      if (val === "") {
        update(() => {
          this.firmFiltered = this.firmFull;
        });
        return;
      }

      update(() => {
        this.firmFiltered = this.firmFull.filter((v) =>
          this.$normalizeTurkishString(v.commercialTitle).includes(
            this.$normalizeTurkishString(val)
          )
        );
        this.$logger.log("this.firmFiltered", this.firmFiltered);
      });
    },

    filterServiceProvider(val, update) {
      if (val === "") {
        update(() => {
          this.serviceProviderFiltered = this.serviceProviderFull;
        });
        return;
      }

      update(() => {
        this.serviceProviderFiltered = this.serviceProviderFull.filter((v) =>
          this.$normalizeTurkishString(v.commercialTitle).includes(
            this.$normalizeTurkishString(val)
          )
        );
        this.$logger.log(
          "this.serviceProviderFiltered",
          this.serviceProviderFiltered
        );
      });
    },

    async getFirmPostAddress(addressId) {
      const response = this.$api
        .get("getAddressById/" + addressId)
        .then((data) => {
          this.$logger.log(data.data);
          this.formModel.address = data.data;
          this.$logger.log("this.formModel.address", this.formModel.address);
        });
    },

    async getPaymentTerm() {
      const response = this.$api.get("paymentTerms").then((data) => {
        this.paymentTermFull = data.data;
        this.$logger.log("getPaymentTerm", this.paymentTermFull);

        if (!this.formModel.paymentTerm.id)
          this.formModel.paymentTerm = { id: 0, value: "Seç" };
      });
    },

    filterPaymentTerm(val, update) {
      if (val === "") {
        update(() => {
          this.paymentTermFiltered = this.paymentTermFull;
        });
        return;
      }

      update(() => {
        this.paymentTermFiltered = this.paymentTermFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
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
      } catch (error) {
        this.$logger.error("Hata oluştu:", error);
      }
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
    async getTechnicalServiceTypes() {
      const response = this.$api
        .get("getTechnicalServiceTypes")
        .then((data) => {
          this.$logger.log("data", data.data);
          let result = data.data;

          this.technicalServiceTypes = result;
        });
    },
    filterTechnicalServiceTypes(val, update) {
      if (val === "") {
        update(() => {
          this.technicalServiceTypesFiltered = this.technicalServiceTypes;
        });
        return;
      }

      update(() => {
        this.technicalServiceTypesFiltered = this.technicalServiceTypes.filter(
          (v) => v.process.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
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

    async getOrderStatus() {
      const response = this.$api.get("orderStatuses").then((data) => {
        this.orderStatusFull = data.data;
        this.$logger.log("this.orderStatusFull", this.orderStatusFull);
        if (!this.formModel.orderStatus.id)
          this.formModel.orderStatus = this.orderStatusFull[0];
      });
    },

    filterOrderStatus(val, update) {
      if (val === "") {
        update(() => {
          this.orderStatusFiltered = this.orderStatusFull;
        });
        return;
      }

      update(() => {
        this.orderStatusFiltered = this.orderStatusFull.filter(
          (v) => v.status.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getCountries() {
      const response = this.$api.get("countries").then((data) => {
        this.countriesFull = data.data;
      });
    },

    filterCountries(val, update) {
      if (val === "") {
        update(() => {
          this.countriesFiltered = this.countriesFull;
        });
        return;
      }

      update(() => {
        this.countriesFiltered = this.countriesFull.filter((v) =>
          this.$normalizeTurkishString(v.countryName).includes(
            this.$normalizeTurkishString(val)
          )
        );
      });
    },

    async getCities() {
      const response = this.$api.get("cities").then((data) => {
        this.citiesFull = data.data;
      });
    },

    filterCities(val, update) {
      if (val === "") {
        update(() => {
          this.citiesFiltered = this.citiesFull;
        });
        return;
      }

      update(() => {
        this.citiesFiltered = this.citiesFull.filter((v) =>
          this.$normalizeTurkishString(v.cityName).includes(
            this.$normalizeTurkishString(val)
          )
        );
      });
    },

    async getRegions() {
      const response = this.$api.get("regions").then((data) => {
        this.regionsFull = data.data;
      });
    },

    filterRegions(val, update) {
      if (val === "") {
        update(() => {
          this.regionsFiltered = this.regionsFull;
        });
        return;
      }

      update(() => {
        this.regionsFiltered = this.regionsFull.filter((v) =>
          this.$normalizeTurkishString(v.regionName).includes(
            this.$normalizeTurkishString(val)
          )
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

    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentRow.orderId = this.formModel.id;
      this.currentRow.stockCard = {};
      this.currentRow.stockCard.stockName = "Ürün Seçiniz";
      this.currentRow.stockCard.currency = {};
      this.currentRow.stockCard.currency.shortName = "";

      this.currentRow = this.currentRow;
      this.currentMode = "add";
      this.OrderDetailFormVisible = true;
    },
    onView(product) {
      this.maximizedToggle = false;
      this.currentRow = product;
      this.currentMode = "details";
      this.OrderDetailFormVisible = true;
    },
    onEdit(product) {
      this.maximizedToggle = false;
      this.currentRow = product;
      this.currentMode = "edit";
      this.OrderDetailFormVisible = true;
    },
    onDelete(product) {
      this.currentRow = product;
      this.deleteConfirm = true;
    },
    onFormCompleted() {
      this.formVisible = false;
      this.$logger.log("form completed");
      this.getOrderItems();
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

    async addOrderItem() {
      this.$logger.log(this.currentRow);
      const _response = this.$api
        .post("orderItems", JSON.stringify(this.currentRow))
        .then((response) => {
          this.$logger.log(response.data);
          this.$logger.log("add completed");
          this.getOrderItems();
          this.OrderDetailFormVisible = false;

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
        });
    },

    async editOrderItem() {
      this.currentRow.orderId = this.formModel.id;
      const response = this.$api
        .put("orderItems", JSON.stringify(this.currentRow))
        .then((_response) => {
          this.$logger.log(response.data);
          this.$logger.log("edit completed");
          this.getOrderItems();
          this.OrderDetailFormVisible = false;

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
        });
    },

    async tutarBilgileri() {
      this.kdvToplam = 0.0;
      this.araToplam = 0.0;
      this.genelToplam = 0.0;
      this.iskontoToplam = 0.0;
      this.dovizlikdvToplam = 0.0;
      this.dovizliaraToplam = 0.0;
      this.dovizligenelToplam = 0.0;
      this.dovizliiskontoToplam = 0.0;

      try {
        for (let i = 0; i < this.rows.length; i++) {
          this.araToplam = (
            parseFloat(this.araToplam) +
            parseFloat(this.rows[i].unitAmount) *
              parseFloat(this.rows[i].quantity)
          ).toFixed(2);

          this.rows[i].unitsumamount =
            (this.rows[i].unitAmount +
              (this.rows[i].unitAmount * this.rows[i].stockCard.vatRate) /
                100) *
            this.rows[i].quantity;

          this.kdvToplam +=
            ((this.rows[i].unitAmount * this.rows[i].stockCard.vatRate) / 100) *
            this.rows[i].quantity;

          this.iskontoToplam += (
            parseFloat(this.rows[i].discount) *
            parseFloat(this.rows[i].quantity)
          ).toFixed(2);

          this.dovizlikdvToplam += parseFloat(
            parseFloat(this.kdvToplam).toFixed(2) *
              parseFloat(this.exchangeRate_EUR).toFixed(2)
          ).toFixed(2);
          this.dovizliaraToplam += parseFloat(
            parseFloat(this.araToplam).toFixed(2) *
              parseFloat(this.exchangeRate_EUR).toFixed(2)
          ).toFixed(2);
          this.dovizliiskontoToplam += this.rows[i].unitAmount;

          /**this.araToplam += parseFloat(
            this.rows[i].unitAmount -
              (this.rows[i].unitAmount * this.formModel.discountPercent) /
                100
          ).toFixed(2);*/
          this.$logger.log("this.araToplam", this.araToplam);
          this.$logger.log("this.kdvToplam", this.kdvToplam);
          this.$logger.log("this.genelToplam", this.genelToplam);
        }
        this.genelToplam = (
          parseFloat(this.araToplam) + parseFloat(this.kdvToplam)
        ).toFixed(2);
        this.dovizligenelToplam += parseFloat(
          parseFloat(this.genelToplam).toFixed(2) *
            parseFloat(this.exchangeRate_EUR).toFixed(2)
        ).toFixed(2);

        this.dovizlikdvToplam = parseFloat(this.dovizlikdvToplam).toFixed(2);
        this.dovizliaraToplam = parseFloat(this.dovizliaraToplam).toFixed(2);
        this.dovizligenelToplam = parseFloat(this.dovizligenelToplam).toFixed(
          2
        );
        this.$logger.log("this.araToplam", this.dovizliaraToplam);
        this.$logger.log("this.kdvToplam", this.dovizlikdvToplam);
        this.$logger.log("this.genelToplam", this.dovizligenelToplam);
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async calcFaturaIskontoYuzde() {
      this.formModel.discountPercent =
        (this.formModel.discount * 100) / this.araToplam;
      this.tutarBilgileri();
    },

    async calcFaturaIskonto() {
      this.formModel.discount =
        (this.formModel.discountPercent * this.araToplam) / 100;
      this.tutarBilgileri();
    },

    async calcFaturaIskontoTopTutar() {
      this.formModel.discount =
        (this.genelToplam - this.araToplam - this.kdvToplam) / 100;
      this.tutarBilgileri();
    },

    async ordertoproduction() {
      /* TODO Sipraişten Üretim oluşturma modülü eklenecek
       ** rows array ile her satır için ayrı bir üretim oluştur.
       */
      this.$logger.log("order Item => ", this.rows);
      this.ProductionPlanningFormVisible = true;
    },

    async firmSelected(val) {
      this.$logger.log(val);
      this.formModel.firmId = val.id;
      this.formModel.paymentTerm = this.paymentTermFull.find(
        (pt) => pt.id == val.paymentTermId
      );
      this.formModel.currency = this.currenciesFull.find(
        (c) => c.id == val.currencyId
      );
      this.getFirmPostAddress(val.postAddressId);
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

    onUploadFinish(files) {
      this.$refs.uploader.reset();
    },

    async getImages() {
      try {
        //if (this.formModel.id == null) return;
        const response = await this.$api.get(
          //`getImages/technicalService/${this.formModel.id}`
          `getImages/technicalService/1`
        );
        this.technicalServiceImages = response.data.map((image) =>
          this.imageSrc(image)
        );
      } catch (error) {
        this.$logger.error("Error get technicalService images:", error);
      }
    },

    imageSrc(src) {
      try {
        //const imgPath = `http://fixaura.infaura.com/assets/img/technicalService/${this.formModel.id}/${src}`;
        const imgPath = `http://fixaura.infaura.com/assets/img/technicalService/1/${src}`;
        this.$logger.log("Image Path:", imgPath);
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
  },
});
</script>
<style scoped>
.shadow-2 {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.rounded-borders {
  border-radius: 12px;
}
</style>
