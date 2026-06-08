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
                        :disable="!formModel.id"
                        ref="uploader"
                        :label="$t('technicalService.uploadFiles')"
                        multiple
                        batch
                        @finish="onUploadFinish"
                        :factory="uploadFiles"
                      >
                        <template v-slot:header="scope">
                          <div
                            class="row no-wrap items-center q-pa-sm q-gutter-xs"
                          >
                            <q-btn
                              :disable="!formModel.id"
                              icon="add_box"
                              @click="scope.pickFiles"
                              round
                              dense
                              flat
                            >
                              <q-uploader-add-trigger />
                              <q-tooltip>Pick Files</q-tooltip>
                            </q-btn>

                            <!-- 📷 Kamera Açma Butonu -->
                            <q-btn
                              :disable="!formModel.id"
                              icon="camera_alt"
                              @click="openCamera"
                              round
                              dense
                              flat
                            >
                              <q-tooltip>Open Camera</q-tooltip>
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
                          </div>
                        </template>
                      </q-uploader>

                      <!-- 📷 Kamera Görüntüsü -->
                    </q-item-section>
                  </q-item>

                  <q-item class="row col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <q-img
                      v-for="(image, index) in technicalServiceImages"
                      :key="index"
                      class="q-pa-xs q-ma-xs"
                      :src="image"
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
                          class="q-mr-md"
                        ></q-btn>
                        <q-btn
                          color="primary"
                          icon="zoom_in"
                          round
                          ripple
                          dense
                          @click="
                            previewImage = image;
                            imagePreviewVisible = true;
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
    <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("technicalService.customerInformations") }}</div>
        </q-card-section>
        <Ribbon
          v-if="false"
          text="Özel Tasarım"
          color="#239ff1"
          textColor="#f5f5f5"
        />
        <q-separator />
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel.deliveredBy">
                <q-input
                  dense
                  outlined
                  v-model="formModel.deliveredBy.name"
                  :label="$t('technicalService.customerName')"
                  :rules="[(val) => !!val || 'Bu alan zorunludur']"
                  clearable
                  @update:model-value="isChange_Customer = true"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-5 col-md-5 col-sm-11 col-xs-11">
              <q-item-section v-if="formModel.deliveredBy">
                <q-input
                  outlined
                  dense
                  v-model="formModel.deliveredBy.surname"
                  :label="$t('technicalService.customerSurname')"
                  :rules="[(val) => !!val || 'Bu alan zorunludur']"
                  clearable
                  @update:model-value="isChange_Customer = true"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
              <q-item-section>
                <q-btn
                  icon="search"
                  dense
                  class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                  text-color="white"
                  @click="selectCustomerFormVisibile = true"
                  square
                >
                  <q-tooltip>
                    {{ $t("technicalService.searchCustomer") }}
                  </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel.deliveredBy">
                <q-input
                  filled
                  dense
                  v-model="formModel.deliveredBy.phone1"
                  :label="$t('users.phone')"
                  mask="(###) ### ## ##"
                  unmasked-value
                  :rules="[validatePhoneNumber]"
                  lazy-rules
                  clearable
                  @update:model-value="isChange_Customer = true"
                >
                  <template v-slot:append>
                    <q-icon name="phone" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section v-if="formModel.deliveredBy">
                <q-input
                  dense
                  filled
                  v-model="formModel.deliveredBy.email"
                  type="email"
                  :label="$t('login.email')"
                  placeholder="example@mail.com"
                  :rules="[validateEmail]"
                  lazy-rules
                  clearable
                  @update:model-value="isChange_Customer = true"
                >
                  <template v-slot:prepend>
                    <q-icon name="mail" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  filled
                  dense
                  v-model="formModel.deliveredBy.address.city"
                  :label="$t('technicalService.selectCity')"
                  clearable
                  filter
                  use-input
                  option-value="id"
                  option-label="name"
                  @update:model-value="onCityChange"
                  :options="citiesFiltered"
                  @filter="filterCities"
                >
                  <template v-slot:prepend>
                    <q-icon name="location_city" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  filled
                  dense
                  v-model="formModel.deliveredBy.address.district"
                  :options="filteredDistricts"
                  :label="$t('technicalService.selectDistrict')"
                  use-input
                  clearable
                  option-value="id"
                  option-label="name"
                  filter
                  :disable="!formModel.deliveredBy.address.city"
                  @filter="filterDistricts"
                  @update:model-value="onDistrictChange"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel.deliveredBy">
                <q-input
                  filled
                  dense
                  v-model="formModel.deliveredBy.address.postalCode"
                  :label="$t('firm.postalcode')"
                  :mask="zipMask"
                  placeholder="Örn: 34000"
                  :rules="[validateZipCode]"
                  lazy-rules
                  clearable
                  @update:model-value="isChange_Customer = true"
                >
                  <template v-slot:prepend>
                    <q-icon name="local_post_office" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="row col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-item-label>{{
                  $t("technicalService.contactOptions")
                }}</q-item-label>
                <div class="row">
                  <q-toggle
                    v-model="formModel.deliveredBy.contactViaEmail"
                    color="green"
                    icon="mail"
                    @update:model-value="isChange_Customer = true"
                  >
                    <q-tooltip>
                      {{ $t("technicalService.contactViaEmail") }}
                    </q-tooltip>
                  </q-toggle>
                  <q-toggle
                    v-model="formModel.deliveredBy.contactViaSMS"
                    color="green"
                    icon="sms"
                    @update:model-value="isChange_Customer = true"
                  >
                    <q-tooltip>
                      {{ $t("technicalService.contactViaSMS") }}
                    </q-tooltip>
                  </q-toggle>
                  <q-toggle
                    v-model="formModel.deliveredBy.contactViaPhone"
                    color="green"
                    icon="phone"
                    @update:model-value="isChange_Customer = true"
                  >
                    <q-tooltip>
                      {{ $t("technicalService.contactViaPhone") }}
                    </q-tooltip>
                  </q-toggle>
                </div>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  filled
                  dense
                  v-model="formModel.deliveredBy.address.addressDetail"
                  :label="$t('headquarters.address')"
                  type="textarea"
                  :rules="[validateAddress]"
                  lazy-rules
                  clearable
                  @update:model-value="isChange_Customer = true"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-action>
          <q-list class="row">
            <q-item>
              <q-btn
                dense
                color="warning"
                :label="$t('users.clear')"
                icon-right="backspace"
                text-color="white"
                :loading="saveLoading"
                class="text-capitalize q-pa-sm q-mx-sm q-ml-auto"
                @click="newCustomer"
              >
              </q-btn
            ></q-item>
            <q-space />
            <q-item>
              <q-btn
                dense
                color="secondary"
                v-if="isChange_Customer"
                :label="formModel.deliveredBy.id ? $t('edit') : $t('save')"
                :icon-right="formModel.deliveredBy.id ? 'update' : 'person_add'"
                text-color="white"
                :loading="saveLoading"
                class="text-capitalize q-pa-sm q-mx-sm q-ml-auto"
                @click="addOrUpdateCustomer"
              >
              </q-btn>
            </q-item>
          </q-list>
        </q-card-action>
      </q-card>
    </div>
    <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>
            {{ $t("technicalService.technicalServiceInformations") }}
          </div>
        </q-card-section>
        <Ribbon
          v-if="formModel.stockSerial?.lostOrStolen"
          :text="$t('technicalService.lostOrStolen')"
          :color="lostOrStolenColor"
          textColor="#f5f5f5"
        />
        <q-separator />
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  readonly
                  v-model="formModel.serviceNumber"
                  :label="$t('technicalService.technicalServiceNo')"
                >
                  <template v-slot:prepend>
                    <q-icon name="confirmation_number" />
                  </template>
                  <q-tooltip>
                    {{ $t("technicalService.technicalServiceNoTooltip") }}
                  </q-tooltip>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="row">
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  dense
                  use-input
                  :disable="mode === 'details'"
                  outlined
                  v-model="formModel.stockSerial.stockCard.brand"
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
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  dense
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
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-10 col-xs-10">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('technicalService.serialNo')"
                  v-model="formModel.stockSerial.serialNo"
                  :rules="[(val) => !!val || 'Field is required']"
                  v-on:keyup.enter="checkSerialNo()"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
              <q-item-section>
                <q-btn
                  dense
                  class="text-capitalize"
                  :disable="formModel.id"
                  icon="done_all"
                  text-color="white"
                  color="warning"
                  @click="checkSerialNo()"
                />
                <q-tooltip>{{ $t("products.checkit") }}</q-tooltip>
              </q-item-section>
              <q-item-section>
                <q-btn
                  dense
                  class="text-capitalize"
                  :disable="formModel.id"
                  icon="add"
                  text-color="white"
                  color="secondary"
                  @click="saveSerialNo()"
                />
                <q-tooltip>{{ $t("products.checkit") }}</q-tooltip>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  type="date"
                  v-model="formModel.createdAt"
                  :label="$t('technicalService.technicalServiceAdmissionDate')"
                  @update:model-value="onDateSelected"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  type="date"
                  v-model="formModel.estimatedCompletionDate"
                  :label="$t('technicalService.estimatedCompletionDate')"
                  @update:model-value="onDateSelected"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  dense
                  :label="$t('technicalService.warrantyStatus')"
                  v-model="formModel.warrantyType"
                  :options="warrantyOptions"
                  option-label="name"
                  option-value="id"
                  :disable="mode === 'details'"
                  emit-value
                  map-options
                  color="blue"
                  @update:model-value="onWarrantyTypeChange"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  dense
                  clearable
                  :label="$t('technicalService.selectServiceType')"
                  v-model="formModel.technicalServiceType"
                  :options="technicalServiceTypes"
                  option-label="name"
                  option-value="id"
                  :disable="mode === 'details'"
                  emit-value
                  map-options
                  color="blue"
                  @update:model-value="onServiceTypesChange"
                >
                  <template v-slot:prepend>
                    <q-icon name="miscellaneous_services" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-btn-toggle
                  v-model="formModel.isCompany"
                  class="my-custom-toggle"
                  no-caps
                  rounded
                  unelevated
                  toggle-color="primary"
                  color="white"
                  text-color="primary"
                  :options="[
                    { label: 'Firma', value: true },
                    { label: 'Son Kullanıcı', value: false },
                  ]"
                />
              </q-item-section>
            </q-item>
            <q-item
              v-if="formModel.isCompany"
              class="col-lg-3 col-md-3 col-sm-12 col-xs-12"
            >
              <q-item-section>
                <q-select
                  filled
                  dense
                  v-model="formModel.firm"
                  :options="filteredCompanyOptions"
                  :label="$t('technicalService.selectCompany')"
                  option-value="id"
                  option-label="name"
                  use-input
                  clearable
                  filter
                  @filter="filterCompanies"
                  @update:model-value="(val) => companySelected(val)"
                >
                  <template v-slot:prepend>
                    <q-icon name="business" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  filled
                  v-model="formModel.userComplaint"
                  :label="$t('technicalService.userComment')"
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
          </q-list>
        </q-card-section>
        <q-separator />
        <q-card
          v-if="
            formModel.stockSerial.stockCard.brand &&
            (formModel.stockSerial.stockCard.brand.name === 'DJI' ||
              formModel.stockSerial.stockCard.brand.name === 'DJI Enterprise')
          "
          class="q-ma-none col-lg-12 col-md-12 col-sm-12 col-xs-12"
        >
          <q-card-section class="bg-primary text-white">
            <div>
              {{ $t("technicalService.dji") }}
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list class="row">
              <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <q-item-section>
                  <q-input
                    dense
                    type="date"
                    v-model="formModel.djiCrashDate"
                    :label="$t('technicalService.djiCrashDate')"
                    @update:model-value="onDateSelected"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section side>
                  <q-toggle
                    v-model="formModel.hasRemoteControl"
                    :label="$t('technicalService.hasRemoteControl')"
                    color="primary"
                    left-label
                  />
                </q-item-section>
                <q-item-section>
                  <div class="text-subtitle2">
                    {{
                      formModel.hasRemoteControl
                        ? "Kumanda Mevcut"
                        : "Kumanda Yok"
                    }}
                  </div>
                </q-item-section>
              </q-item>
              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section side>
                  <q-toggle
                    v-model="formModel.isLost"
                    :label="$t('technicalService.isLost')"
                    color="primary"
                    left-label
                  />
                </q-item-section>
                <q-item-section>
                  <div class="text-subtitle2">
                    {{ formModel.isLost ? "Kayıp" : "Kayıp Değil" }}
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
        <q-separator />

        <q-card-action>
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-btn
              color="secondary"
              :label="formModel.id ? $t('updatedata') : $t('savedata')"
              icon-right="send"
              text-color="white"
              :loading="saveLoading"
              class="text-capitalize q-pa-sm q-mx-sm q-ml-auto"
              :style="{
                display: mode === 'details' ? 'none' : '',
              }"
              @click="addOrUpdateForm"
            >
            </q-btn>
          </q-item>
        </q-card-action>
        <q-separator />
        <q-card-section class="bg-primary text-white">
          <div></div>
        </q-card-section>
        <q-card-section>
          <q-list class="row">
            <q-item class="q-ml-lg col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <q-item-section>
                <q-btn
                  :disable="!formModel.id"
                  :label="$t('technicalService.addAccessory')"
                  color="primary"
                  class="text-capitalize q-pa-xs q-ma-xs"
                  @click="openAccessoryDialog = true"
                >
                  <q-badge color="teal" floating>{{
                    formModel.serviceAccessories?.length || 0
                  }}</q-badge>
                  <q-tooltip>
                    {{
                      formModel.id
                        ? $t("technicalService.addAccessory")
                        : $t("technicalService.saveFormFirstAdd")
                    }}
                  </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <q-item-section>
                <q-btn
                  :disable="!formModel.id"
                  :label="$t('technicalService.printLabel')"
                  color="primary"
                  class="text-capitalize q-pa-xs q-ma-xs"
                  @click="printLabel"
                >
                  <q-tooltip>
                    {{
                      formModel.id
                        ? $t("technicalService.printLabel")
                        : $t("technicalService.saveFormFirstAdd")
                    }}
                  </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-11 col-md-11 col-sm-11 col-xs-11">
              <q-item-section>
                <q-select
                  :disable="!formModel.id"
                  dense
                  options-dense
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
      </q-card>
    </div>
  </div>
  <!--Image Preview Dialog-->
  <q-dialog :maximized="imageMaximizedToggle" v-model="imagePreviewVisible">
    <q-card
      ref="imagePreviewCard"
      style="
        display: flex;
        flex-direction: column;
        min-width: 60vw;
        min-height: 60vh;
      "
      class="q-pa-none"
    >
      <q-card-section style="z-index: 9999" class="q-pa-none">
        <q-bar class="q-pa-lg">
          <q-icon name="photo" />

          <q-toolbar-title
            ><span class="text-weight-bold"></span>
            {{ $t("image") }}</q-toolbar-title
          >

          <q-btn
            dense
            round
            :icon="imageZoomActive ? 'zoom_out' : 'zoom_in'"
            color="primary"
            @click="imageZoomActive = !imageZoomActive"
            clas="q-mt-md q-mr-xl"
          >
            <q-tooltip class="bg-white text-primary">
              {{ imageZoomActive ? $t("zoomPasive") : $t("zoomActive") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            round
            :icon="imageMaximizedToggle ? 'fullscreen_exit' : 'fullscreen'"
            color="primary"
            @click="imageMaximizedToggle = !imageMaximizedToggle"
            clas="q-mt-md q-mr-xl"
          >
            <q-tooltip class="bg-white text-primary">
              {{
                imageMaximizedToggle ? $t("fullscreen_exit") : $t("fullscreen")
              }}
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            round
            icon="close"
            color="negative"
            v-close-popup
            clas="q-mt-md q-mr-xs"
          >
            <q-tooltip class="bg-white text-primary">
              {{ $t("close") }}
            </q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section class="q-pa-none q-ma-none flex flex-center">
        <div
          style="
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <q-img
            :src="previewImage"
            v-if="previewImage"
            loading="lazy"
            spinner-color="white"
            fit="contain"
            class="zoom-image"
            @mousemove="handleMouseMove"
            @mouseleave="resetZoom"
            :style="zoomStyle"
            ref="zoomImage"
          >
          </q-img>
        </div>
      </q-card-section>

      <q-card-section v-if="false" class="q-gutter-md" style="width: 100%">
        <q-input
          v-model="imageDescription"
          filled
          type="textarea"
          :label="$t('description')"
          autogrow
          style="width: 100%"
        />
      </q-card-section>

      <q-card-actions v-if="false" align="center" class="q-gutter-sm q-pa-md">
        <q-btn
          :label="$t('save')"
          color="positive"
          @click="submitImageDescription"
        />
        <q-btn flat :label="$t('close')" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--Accessory Dialog-->
  <q-dialog
    v-model="openAccessoryDialog"
    persistent
    dense
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 60vw; max-height: 90vh">
      <q-card-section class="q-pa-sm">
        <q-bar class="q-pa-sm">
          <q-icon name="build" />

          <q-toolbar-title>
            <span class="text-weight-bold">
              {{ $t("technicalService.accessoryInformations") }}
            </span>
          </q-toolbar-title>

          <q-btn
            dense
            flat
            icon="close_fullscreen"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          >
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">
              {{ $t("minimize") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            flat
            icon="open_in_full"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">
              {{ $t("maximize") }}
            </q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">
              {{ $t("close") }}
            </q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>

      <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
        <q-card-section class="row q-gutter-md">
          <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
            <q-item-section>
              <q-select
                v-model="selectedAccessory.accessory"
                :options="accessoryOptions"
                option-value="id"
                option-label="name"
                :label="$t('technicalService.accessoryName')"
                filled
                clearable
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="build" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>

          <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
            <q-item-section>
              <q-input
                v-model.number="selectedAccessory.quantity"
                type="number"
                :label="$t('products.piece')"
                filled
                :min="0"
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="dialpad" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
            <q-item-section>
              <q-input
                dense
                filled
                v-model="selectedAccessory.serialNumber"
                :label="$t('technicalService.serialNo')"
                clearable
                class="q-pl-none"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-1 col-md-1 col-sm-6 col-xs-6">
            <q-item-section>
              <q-btn
                v-if="!selectedAccessory.id"
                icon="add"
                color="primary"
                @click="addAccessory"
              />
              <q-btn
                v-else
                icon="edit"
                color="secondary"
                @click="saveAccessoryEdit"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-1 col-md-1 col-sm-6 col-xs-6">
            <q-item-section>
              <q-btn
                icon="highlight_off"
                color="negative"
                @click="clearAccessory"
              >
                <q-tooltip>Temizle</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section>
          <q-table
            :rows="formModel.serviceAccessories"
            :columns="columnsAccessories"
            row-key="serialNumber"
            :pagination="pagination"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  @click="editAccessoryRow(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="openDeleteAccessoryDialog(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card-section>

      <q-card-actions class="justify-end">
        <q-btn color="primary" :label="$t('savedata')" @click="saveAccessory" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--Accessory Table Dialog-->
  <q-dialog v-model="deleteAccessoryDialogVisible">
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="delete" color="negative" text-color="white" />
        <h5>{{ $t("order.deleteconfirm") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>"Seçtiğiniz aksesuar kaldırılacak. Emin misiniz?"</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          color="primary"
          @click="deleteAccessoryDialogVisible = false"
        />
        <q-btn
          flat
          :label="$t('delete')"
          color="negative"
          @click="deleteAccessoryRowConfirmed"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--Camera Dialog-->
  <q-dialog v-model="isCameraOpen" persistent>
    <q-card style="min-width: 60vw; max-height: 95vh" class="q-pa-md column">
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

  <!-- Select Customer Form -->
  <q-dialog
    v-model="selectCustomerFormVisibile"
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
            ><span>{{ $t("users.selectCustomer") }}</span></q-toolbar-title
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
      <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
        <SelectCustomerForm
          class="q-pa-sm"
          v-model="selectedCustomer"
          @completed="CustomerSelectedComplated"
          @close="selectCustomerFormVisibile = false"
        />
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
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
        <technical-service-types-page
          @close="getTechnicalServiceTypes"
          class="q-pa-sm"
        />
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
      <q-card-section class="items-center row">
        <q-img
          class="q-pa-xs q-ma-xs"
          :src="deleteImage"
          spinner-color="primary"
          spinner-size="82px"
          style="height: 140px; max-width: 150px"
        >
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-red-1 text-black">
              {{ $t("cannotLoadImage") }}
            </div>
          </template>
        </q-img>
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
import SelectCustomerForm from "src/components/forms/SelectCustomerForm.vue";
import { useQuasar, date, LocalStorage } from "quasar";
import Ribbon from "../Ribbon.vue";

export default defineComponent({
  name: "TechnicalServiceForm",
  components: {
    TechnicalServiceStatusesPage,
    FaultCodePage,
    TechnicalServiceTypesPage,
    Ribbon,
    SelectCustomerForm,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    var formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });
    try {
      if (props.mode == "add") {
        formModel.value.deliveredBy = {
          address: {
            city: { name: "Seç" },
            district: { name: "Seç" },
          },
        };

        formModel.value.stockSerial = {
          serialNo: "",
          stockCard: { brand: { name: "Seç" }, mdoel: { name: "Seç" } },
        };

        formModel.value.technicalServiceFaultCodes = [];

        formModel.value.technicalServiceStatus = {
          process: "",
          status: "",
          color: "",
        };
        formModel.value.serviceAccessories = [];
        formModel.value.technicalServiceType = { name: "" };
        formModel.value.technicalServiceNo = "";
        formModel.value.isActive = true;

        formModel.value.firm = { id: 0, name: "Seç" };

        formModel.value.createdAt = date.formatDate(Date(), "YYYY-MM-DD");
        formModel.value.estimatedCompletionDate = date.formatDate(
          Date(),
          "YYYY-MM-DD"
        );
        formModel.value.djiCrashDate = date.formatDate(Date(), "YYYY-MM-DD");

        formModel.value.startDate = date.formatDate(Date(), "YYYY-MM-DD");
        formModel.value.finishDate = "0000.00.00";
      } else {
        formModel.value.technicalServiceAdmissionDate = date.formatDate(
          formModel.value.technicalServiceAdmissionDate,
          "YYYY-MM-DD"
        );
        formModel.value.createdAt = date.formatDate(
          formModel.value.createdAt,
          "YYYY-MM-DD"
        );
        formModel.value.estimatedCompletionDate = date.formatDate(
          formModel.value.estimatedCompletionDate,
          "YYYY-MM-DD"
        );
        formModel.value.djiCrashDate = date.formatDate(
          formModel.value.djiCrashDate,
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

        //formModel.value.technicalServiceFaultCodes =
        //  formModel.value.technicalServiceFaultCodes.map((fc) => {
        //    return {
        //      ...fc,
        //      faultCode: {
        //        value: `${fc.faultCode.code} - ${fc.faultCode.detail} - ${fc.faultCode.priority}`,
        //      },
        //    };
        //  });
      }
    } catch (error) {
      this.$logger.log("formModel error: ", error);
    }
    return {
      formModel,
    };
  },
  computed: {
    columnsAccessories() {
      return [
        {
          name: "name",
          field: (row) => row.accessory.name,
          label: "Aksesuar Adı",
          required: true,
          align: "left",
        },
        {
          name: "quantity",
          field: (row) => row.quantity,
          label: "Adet",
          required: true,
          align: "center",
        },
        {
          name: "serialNumber",
          field: (row) => row.serialNumber,
          label: "Seri No",
          required: true,
          align: "left",
        },
        { name: "actions", label: "İşlemler" },
      ];
    },
  },
  data() {
    return {
      OrderDetailFormVisible: false,
      ProductionPlanningFormVisible: false,
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
      notificationPreferences: [],
      isCompany: false,
      selectedCompany: null,
      companyOptions: [],
      filteredCompanyOptions: [],
      technicalServiceNo: [],
      technicalServiceType: null,
      technicalServiceTypeOptions: [],
      hasRemoteControl: null,
      isLost: null,
      isCondition: false,
      openAccessoryDialog: false,

      //kamera//
      isCameraOpen: false,
      videoStream: null,
      imagePreviewVisible: false,
      previewImage: null,
      imageDescription: "",
      image: "",
      description: "",

      //Q-Select
      firmFull: [],
      technicalServiceStatuses: [],
      technicalServiceStatusesFiltered: [],
      technicalServiceTypes: [],
      technicalServiceTypesFiltered: [],
      paymentTermFiltered: [],
      paymentTermFull: [],
      orderStatusFiltered: [],
      orderStatusFull: [],
      countriesFull: [],
      countriesFiltered: [],
      citiesFiltered: [],
      regionsFull: [],
      regionsFiltered: [],
      currenciesFull: [],
      currenciesFiltered: [],
      faultCodesFull: [],
      faultCodesFiltered: [],
      warrantyOptions: [],
      brandOptions: [],

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
      cities: [],
      warrantyType: null,
      brands: [],
      technicalServiceAdmissionDate: null,
      estimatedCompletionDate: null,
      djiCrashDate: null,
      serialNo: "",
      customerName: "",
      customerSurname: "",
      email: "",
      address: "",
      districts: [],
      selectedDistrict: "",
      filteredDistricts: [],
      filteredBrands: [],
      filteredModels: [],
      models: [],
      selectedErrorCode: [],
      faultCodes: [],
      text: [],
      addresstext: [],

      accessoryOptions: [],

      pagination: { rowsPerPage: 10 },
      isEditing: false,
      editingRowIndex: null,
      deleteAccessoryDialogVisible: false,
      selectedRowForDeletion: null,
      filteredParts: [],
      selectedAccessory: {
        id: 0,
        accessory: { name: "Seç" },
        quantity: 1,
        serialNumber: "",
      },

      selectCustomerFormVisibile: false,
      selectedCustomer: {},
      isChange_Customer: false,

      lostOrStolenColor: "#C71A1A",

      imageMaximizedToggle: false,
      imageZoomActive: false,
      zoomStyle: {},
      zoomActive: false,
      zoomScale: 5.5,
      saved: false,
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
    this.$logger.log("formModel: ", this.formModel);
    this.init();
    document.title = `Magicline - ${this.$t("pages.technicalService")}`;
  },
  methods: {
    async init() {
      this.getTechnicalServiceTypes();
      this.getFaultCodes();
      this.getImages();
      this.getWarrantyTypes();
      this.getBrands();
      this.getCities();
      this.getCompanies();
      this.getAccessories();
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}

      if (this.mode !== "add") this.saved = true;
    },
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
    async checkSerialNo() {
      try {
        var body = {
          stockSerial: this.formModel.stockSerial.serialNo,
        };
        const response = await this.$api.post(`stockSerialControl`, body);
        this.$logger.log("checkSerialNo", response?.data);
        var stockSerial = response?.data;

        if (response?.data?.stockCard) {
          this.formModel.stockSerial = stockSerial;
          if (stockSerial && stockSerial.deliveredBy) {
            stockSerial.deliveredBy.isCompany = false;
            this.formModel.deliveredBy = stockSerial.deliveredBy;
            this.selectedCity = stockSerial.deliveredBy.address
              ? stockSerial.deliveredBy.address.city
              : null;
          }
          this.formModel.firm = { id: 0, name: "" };
          this.selectedDistrict = stockSerial?.deliveredBy?.address?.district;

          this.isCondition = true;

          //Kayıp/Çalıntı Uyarısı
          if (this.formModel.stockSerial.lostOrStolen) {
            //notify
            var notifColor = "warning";
            var notif = this.$q.notify({
              progress: true,
              group: false,
              timeout: 0,
              type: notifColor,
              color: notifColor,
              icon: "grade",
              position: "center",
              message: this.$t("warning"),
              caption: this.$t("technicalService.productLostOrStolen"),
            });

            // we simulate some progress here...
            let repeat = 0;
            const interval = setInterval(() => {
              notifColor = notifColor == "warning" ? "negative" : "warning";

              // we update the dialog
              notif({
                type: notifColor,
                color: notifColor,
              });

              // if we are done...
              if (repeat === 6) {
                notif({
                  timeout: 1000, // we will timeout it in 2.5s
                });
                clearInterval(interval);
              }

              repeat++;
            }, 500);
          }

          this.$logger.log("formModel", this.formModel);

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("technicalService.productFound"),
          });
        } else {
          this.isCondition = false;
          this.$q.notify({
            progress: true,
            type: "warning",
            color: "warning",
            message: this.$t("unsuccessful"),
            caption: this.$t("technicalService.productNotFound"),
          });
        }
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async saveSerialNo() {
      try {
        if (this.formModel.stockSerial) {
          if (
            !this.formModel.stockSerial.serialNo ||
            this.formModel.stockSerial.serialNo == ""
          )
            return;

          this.formModel.stockSerial.serialNo =
            this.formModel.stockSerial.serialNo.trim();
          //marka ve model alanı dolu mu kontrol et doluysa kaydet değilse mesaj göster
          if (
            this.formModel.stockSerial.stockCard.brand &&
            this.formModel.stockSerial.stockCard.model
          ) {
            this.formModel.stockSerial.stockCard.brandId =
              this.formModel.stockSerial.stockCard.brand.id;
            this.formModel.stockSerial.stockCard.modelId =
              this.formModel.stockSerial.stockCard.model.id;

            const response = await this.$api.post(
              `saveStockSerialNo`,
              this.formModel.stockSerial
            );
            this.$logger.log("saveSerialNo", response?.data);
          } else {
            this.$q.notify({
              progress: true,
              type: "warning",
              color: "warning",
              message: this.$t("error"),
              caption: this.$t("technicalService.brandOrModelNotSelected"),
            });
            return;
          }
        }
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async getBrands() {
      try {
        const response = await this.$api.get("getBrands");
        this.brandsOptions = response.data;
        this.filteredBrands = response.data;
      } catch (error) {
        this.$logger.error("Error fetching brands:", error);
      }
    },
    filterBrands(val, update) {
      if (val === "") {
        update(() => {
          this.filteredBrands = this.brandsOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredBrands = this.brandsOptions.filter((brand) =>
          brand.name.toLowerCase().includes(needle)
        );
        this.$logger.log("Filtrelenmiş Markalar:", this.filteredBrands);
      });
    },
    brandSelected(selectedBrand) {
      this.$logger.log("Seçilen Marka:", selectedBrand);
      if (!this.formModel.stockSerial) this.formModel.stockSerial = {};
      if (this.formModel.stockSerial.stockCard)
        this.formModel.stockSerial.stockCard.brand = selectedBrand;
      else this.formModel.stockSerial.stockCard = { brand: selectedBrand };

      if (selectedBrand) {
        this.fullModels = selectedBrand.models;
        this.filteredModels = selectedBrand.models;
      } else {
        this.fullModels = [];
        this.filteredModels = [];
      }
    },
    filterModels(val, update) {
      if (val === "") {
        update(() => {
          this.filteredModels = this.fullModels;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredModels = this.fullModels.filter((model) =>
          model.name.toLowerCase().includes(needle)
        );
      });
    },

    modelSelected(selectedModel) {
      this.$logger.log("Seçilen Model:", selectedModel);
      this.formModel.stockSerial.stockCard.model = selectedModel;
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

    addOrUpdateForm() {
      try {
        if (this.formModel.id) {
          this.editFormModel();
        } else {
          this.addFormModel();
        }
      } catch (error) {}
    },

    async addFormModel() {
      try {
        this.$logger.log("addFormModel", this.formModel);
        const _response = this.$api
          .post("createTechnicalService", this.formModel)
          .then((response) => {
            this.formModel.id = response.data.id;
            this.formModel.serviceNumber = response.data.serviceNumber;

            this.saved = true;
            //this.$emit("technicalServiceListRefresh");
            this.$logger.log(this.formModel);
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              color: "info",
              message: this.$t("technicalService.technicalServiceFormSaved"),
              caption: this.$t("success"),
            });

            this.saveLoading = false;
          });
      } catch (error) {
        this.saveLoading = false;
        this.$logger.error("addFormModel", error);
        this.$q.notify({
          progress: true,
          type: "warning",
          color: "warning",
          message: this.$t("error"),
          caption: error,
        });
      }
    },

    async editFormModel() {
      this.$logger.log("addFormModel", this.formModel);
      /*const response = this.$api
        .put("technicalServices", this.formModel)
        .then((_response) => {
          this.$logger.log(_response);

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("technicalService.technicalServiceFormUpdated"),
            caption: this.$t("success"),
          });
          this.$emit("completed");
          this.saveLoading = false;
        });*/
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

    async onFaultCodeSelected(selectedCodes) {
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

            //this.$emit("technicalServiceListRefresh");
          });
      } catch (error) {
        this.$logger.error("Error saving fault codes:", error);
      }
    },
    async getTechnicalServiceTypes() {
      const response = this.$api
        .get("getTechnicalServiceTypes/true")
        .then((data) => {
          this.technicalServiceTypes = data.data;
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

    async getCities() {
      try {
        const response = await this.$api.get("getCities");
        this.cities = response.data;
        this.citiesFiltered = this.cities;
      } catch (error) {
        this.$logger.error("Error fetching cities:", error);
      }
    },

    filterCities(val, update) {
      if (val === "") {
        update(() => {
          this.citiesFiltered = this.cities;
        });
        return;
      }

      update(() => {
        this.citiesFiltered = this.cities.filter((v) =>
          this.$normalizeTurkishString(v.name).includes(
            this.$normalizeTurkishString(val)
          )
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
    async onCityChange(city) {
      if (city) {
        var scIndex = this.cities.findIndex((c) => c.id === city.id);
        this.filteredDistricts = this.cities[scIndex].districts; // Seçilen şehre göre ilçeleri filtrele
        this.districts = this.cities[scIndex].districts; // Seçilen şehre göre ilçeleri filtrele

        this.formModel.deliveredBy.address.cityId = city.id;
      } else {
        this.filteredDistricts = []; // Şehir seçilmediyse ilçeleri temizle
        this.formModel.deliveredBy.address.cityId = null;
        this.formModel.deliveredBy.address.districtId = null;
      }
      this.isChange_Customer = true;
    },

    async onDistrictChange(district) {
      if (district) {
        this.formModel.deliveredBy.address.districtId = district.id;
      } else {
        this.formModel.deliveredBy.address.districtId = null;
      }
      this.isChange_Customer = true;
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
        if (this.formModel.id == null) return;
        const response = await this.$api.get(
          `getImages/technicalService/${this.formModel.id}`
          //`getImages/technicalService/1`
        );
        this.technicalServiceImages = response.data.map((image) =>
          this.imageSrc(image)
        );
      } catch (error) {
        this.$logger.error("Error get technicalService images:", error);
      }
    },
    async getWarrantyTypes() {
      try {
        const response = await this.$api.get("warrantyTypes");
        this.warrantyOptions = response.data;
      } catch (error) {
        this.$logger.error("Error fetching warranty types:", error);
      }
    },

    async onWarrantyTypeChange(warrantyType) {
      if (warrantyType) {
        this.formModel.warrantyTypeId = warrantyType;
      } else {
        this.formModel.warrantyTypeId = null;
      }
    },

    async onServiceTypesChange(serviceType) {
      if (serviceType) {
        this.formModel.technicalServiceTypeId = serviceType;
      } else {
        this.formModel.technicalServiceTypeId = null;
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
      const fileInfo = {
        fileType: "technicalService",
        id: this.formModel.id,
        fileName: imgName,
      };
      const response = this.$api.post(`deleteFile`, fileInfo).then((resp) => {
        this.$logger.log("imageDelete", resp);
        this.getImages();
        this.deleteImageFormVisible = false;
      });
    },

    saveForm() {
      this.$logger.log("form model:", this.formModel);
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
    filterCompanies(val, update) {
      if (!val) {
        update(() => {
          this.filteredCompanyOptions = [...this.companyOptions];
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.filteredCompanyOptions = this.companyOptions.filter((company) =>
          company.name.toLowerCase().includes(needle)
        );
      });
    },
    async getCompanies() {
      try {
        const response = await this.$api.get("firms");
        this.companyOptions = response.data;
        this.filteredCompanyOptions = this.companyOptions;
      } catch (error) {
        this.$logger.error("Error fetching companies:", error);
      }
    },

    companySelected(company) {
      this.formModel.firmId = company.id;
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
    addAccessory() {
      if (
        !this.selectedAccessory.accessory ||
        !this.selectedAccessory.quantity
      ) {
        this.$q.notify({
          type: "negative",
          message: "Lütfen tüm alanları doldurun.",
        });
        return;
      }
      this.$api
        .post(`serviceAccessories`, {
          technicalServiceId: this.formModel.id,
          accessoryId: this.selectedAccessory.accessory.id,
          quantity: this.selectedAccessory.quantity,
          serialNumber: this.selectedAccessory.serialNumber,
        })
        .then((resp) => {
          this.$logger.log("serviceAccessories add", resp);
          this.$q.notify({
            message: "Aksesuar Kaydedildi.",
            color: "positive",
          });
          this.getServiceAccesory();
          this.clearAccessory();
          this.$emit("technicalServiceListRefresh");
        })
        .catch((error) => {
          this.$logger.error("Error adding serviceAccessories:", error);
          this.$q.notify({
            message: error.response.data || error.response || error,
            color: "negative",
          });
        });
    },

    async getServiceAccesory() {
      this.$api
        .get(`getServiceAccessories/${this.formModel.id}`)
        .then((resp) => {
          this.$logger.log("serviceAccessories", resp.data);
          this.formModel.serviceAccessories = resp.data;
        })
        .catch((error) => {
          this.$logger.error("Error fetching service accessories:", error);
        });
    },

    saveAccessoryEdit() {
      if (this.editingRowIndex === null) return;

      const editedRow = this.accessoryTableData[this.editingRowIndex];
      editedRow.id = this.selectedAccessory.id;
      editedRow.name = this.selectedAccessory.name;
      editedRow.quantity = this.selectedAccessory.quantity;
      editedRow.serialNumber = this.selectedAccessory.serialNumber;

      this.isEditing = false;
      this.editingRowIndex = null;
      this.clearAccessory();
    },

    clearAccessory() {
      this.selectedAccessory = {
        id: 0,
        accessory: { name: "Seç" },
        quantity: 1,
        serialNumber: "",
      };
      this.isEditing = false;
      this.editingRowIndex = null;
    },

    editAccessoryRow(row) {
      this.selectedAccessory = {
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        serialNumber: row.serialNumber,
      };
      this.editingRowIndex = this.accessoryTableData.indexOf(row);
      this.isEditing = true;
    },
    openDeleteAccessoryDialog(row) {
      this.deleteAccessoryDialogVisible = true;
      this.selectedRowForDeletion = row;
    },
    deleteAccessoryRowConfirmed() {
      if (this.selectedRowForDeletion) {
        const index = this.accessoryTableData.indexOf(
          this.selectedRowForDeletion
        );
        if (index !== -1) {
          this.accessoryTableData.splice(index, 1);
        }
        this.deleteAccessoryDialogVisible = false;
        this.selectedRowForDeletion = null;
      }
    },
    saveAccessory() {
      this.$logger.log("Aksesuarlar kaydedildi:", this.accessoryTableData);
      this.$q.notify({ message: "Aksesuarlar kaydedildi.", color: "positive" });
      this.openAccessoryDialog = false;
    },
    async getAccessories() {
      try {
        const response = await this.$api.get("accessories");
        this.accessoryOptions = response.data;
      } catch (error) {
        this.$logger.error("Error fetching service accessories:", error);
      }
    },
    async newCustomer() {
      this.formModel.deliveredBy = {
        id: null,
        name: "",
        surname: "",
        email: "",
        phoneNumber: "",
        address: {
          city: { name: "Seç" },
          cityId: null,
          district: { name: "Seç" },
          districtId: null,
          address: "",
        },
      };
    },
    async addOrUpdateCustomer() {
      try {
        this.$logger.log("customer body", this.formModel.deliveredBy);
        if (this.formModel.deliveredBy.id == null) {
          this.$api
            .post(`postCustomer`, this.formModel.deliveredBy)
            .then((resp) => {
              this.$logger.log("customer add", resp);
              this.formModel.deliveredBy = resp.data;
              this.formModel.deliveredById = resp.data.id;
              this.$q.notify({
                message: "Müşteri Kaydedildi.",
                color: "positive",
              });
              this.isChange_Customer = false;
            })
            .catch((error) => {
              this.$logger.error("Error adding customer:", error);
              this.$q.notify({
                message: error.response.data || error.response || error,
                color: "negative",
              });
            });
        } else {
          this.$api
            .put(`putCustomer`, this.formModel.deliveredBy)
            .then((resp) => {
              this.$q.notify({
                message: "Müşteri Bilgileri Güncellendi.",
                color: "positive",
              });
              this.isChange_Customer = false;
            })
            .catch((error) => {
              this.$logger.error("Error updating customer:", error);
              this.$q.notify({
                message: error.response.data,
                color: "negative",
              });
            });
        }
      } catch (error) {
        this.$logger.error("Error addOrUpdateCustomer:", error);
      }
    },

    async CustomerSelectedComplated(customer) {
      this.$logger.log("customer", customer);
      this.formModel.deliveredBy = customer;
      this.formModel.deliveredById = customer.id;
      this.formModel.deliveredBy.notificationPreferences =
        customer.notificationPreferences;
      this.$logger.log(
        "this.formModel.deliveredBy",
        this.formModel.deliveredBy
      );
      this.selectCustomerFormVisibile = false;
      this.isChange_Customer = false;
    },

    handleMouseMove(event) {
      if (!this.imageZoomActive) return; // Tam ekran modunda çalışmasını engelle

      const img = this.$refs.zoomImage?.$el;
      if (!img) return;

      const { left, top, width, height } = img.getBoundingClientRect();

      // Mouse pozisyonunu 0-1 aralığında normalize edin
      const x = (event.clientX - left) / width;
      const y = (event.clientY - top) / height;

      // Transform Origin'i mouse pozisyonuna göre ayarlayın
      this.zoomStyle = {
        transform: `scale(${this.zoomScale})`,
        transformOrigin: `${x * 100}% ${y * 100}%`,
        transition: "transform 0.1s ease-out",
      };

      this.zoomActive = true;
    },

    resetZoom() {
      if (!this.zoomActive) return;

      this.zoomStyle = {
        transform: "scale(1)",
        transition: "transform 0.3s ease-out",
      };

      this.zoomActive = false;
    },

    printLabel() {
      try {
        const printType = "FrontDesk";
        const labelDetail = {
          barcode: this.formModel.serviceNumber,
          stockcardname: this.formModel.stockSerial.stockCard.stockName,
          test: true,
        };
        this.$logger.log("Label Data:", { printType, labelDetail });
        this.$api
          .post("printLabel", { printType, labelDetail })
          .then((response) => {
            this.$logger.log("Label response:", response.data);
            this.$q.notify({
              message: "Etiket Yazıcıya Gönderildi",
              color: "positive",
              progress: true,
            });
          })
          .catch((error) => {
            this.$logger.error("Error printing label:", error);
            this.$q.notify({
              message: error.response.data || error.response || error | "hata",
              color: "negative",
              progress: true,
            });
          });
      } catch (error) {
        this.$logger.error("Error in printLabel:", error);
      }
    },
  },
});
</script>

<style scoped>
.ribbon-card {
  background: #f5f5f5;
  color: black;
  padding: 15px;
  border-radius: 8px;
  position: relative; /* Ribbon'un konumlandırılabilmesi için */
}

.zoom-image {
  overflow: hidden;
  cursor: zoom-in;
}

.zoom-image img {
  transition: transform 0.1s ease-out;
}
.my-custom-toggle {
  border: 1px solid #027be3;
}
</style>
