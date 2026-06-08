<template>
  <div class="row">
    <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
      <q-card class="q-ma-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("station.stationInfo") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list dense class="row">
            <!-- İstasyon Adı -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="stationNameRef"
                  v-model="formModel.name"
                  :label="$t('station.stationName')"
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="business" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- İstasyon Kodu -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="stationCodeRef"
                  v-model="formModel.code"
                  :label="$t('station.stationCode')"
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="confirmation_number" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- İstasyon Bölgesi -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="regionRef"
                  v-model="formModel.stationRegion"
                  :options="filteredRegions"
                  option-label="name"
                  option-value="id"
                  options-dense
                  :label="$t('station.stationRegion')"
                  :disable="mode === 'details'"
                  use-input
                  map-options
                  lazy-rules
                  dense
                  outlined
                  filter
                  @filter="
                    (val, update) =>
                      filterList(val, update, 'regions', 'filteredRegions')
                  "
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  style="width: 100%"
                >
                  <template v-slot:prepend>
                    <q-icon name="maps_ugc" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- İstasyon Model -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="stationModelRef"
                  v-model="formModel.stationModel"
                  :options="stationModels"
                  option-label="name"
                  option-value="id"
                  :label="$t('products.model')"
                  :disable="mode === 'details'"
                  options-dense
                  map-options
                  lazy-rules
                  dense
                  outlined
                  filter
                  @filter="filterRegionOptions"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-slot:prepend>
                    <q-icon name="map" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- İstasyon Elektrik Tip -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="stationElectricTypeRef"
                  v-model="formModel.stationElectricType"
                  :options="stationElectricTypes"
                  option-label="name"
                  option-value="id"
                  :label="$t('station.electricType')"
                  :disable="mode === 'details'"
                  map-options
                  lazy-rules
                  dense
                  outlined
                  filter
                  @filter="filterRegionOptions"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-slot:prepend>
                    <q-icon name="bolt" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- İstasyon Sayaç tipi -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="stationMeterTypeRef"
                  v-model="formModel.stationMeterType"
                  :options="stationMeterTypes"
                  option-label="name"
                  option-value="id"
                  :label="$t('station.meterType')"
                  :disable="mode === 'details'"
                  map-options
                  lazy-rules
                  dense
                  outlined
                  filter
                  @filter="filterRegionOptions"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-slot:prepend>
                    <q-icon name="microwave" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- İstasyon Bayi -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="dealerRef"
                  v-model="formModel.dealer"
                  :options="filteredDealers"
                  option-label="name"
                  option-value="id"
                  options-dense
                  :label="$t('dealer.dealer')"
                  :disable="mode === 'details'"
                  map-options
                  lazy-rules
                  dense
                  outlined
                  use-input
                  filter
                  @filter="
                    (val, update) =>
                      filterList(val, update, 'dealers', 'filteredDealers')
                  "
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  style="width: 100%"
                >
                  <template v-slot:prepend>
                    <q-icon name="store" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Bağlantı Politikası -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="policyRef"
                  v-model="formModel.stationConnectionPolicy"
                  :options="connectionPolicies"
                  option-label="name"
                  option-value="id"
                  :label="$t('station.connectionPolicy')"
                  :disable="mode === 'details'"
                  map-options
                  lazy-rules
                  dense
                  outlined
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-slot:prepend>
                    <q-icon name="policy" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Bağlantı Protokol -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="protocolRef"
                  v-model="formModel.stationConnectionProtocolId"
                  :options="connectionProtocols"
                  option-label="name"
                  option-value="id"
                  :label="$t('station.connectionProtocol')"
                  :disable="mode === 'details'"
                  emit-value
                  map-options
                  lazy-rules
                  dense
                  outlined
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-slot:prepend>
                    <q-icon name="schema" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- İstasyon Durumu -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="protocolRef"
                  v-model="formModel.stationStatusId"
                  :options="statuses"
                  option-label="name"
                  option-value="id"
                  :label="$t('station.stationStatus')"
                  :disable="mode === 'details'"
                  emit-value
                  map-options
                  lazy-rules
                  dense
                  outlined
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-slot:prepend>
                    <q-icon name="offline_pin" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- imei -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-mb-md">
              <q-item-section>
                <q-input
                  ref="imeiRef"
                  v-model="formModel.imei"
                  :label="$t('station.imei')"
                  :disable="mode === 'details'"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="sim_card" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- ip adres -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-mb-md">
              <q-item-section>
                <q-input
                  ref="ipRef"
                  v-model="formModel.ipAddress"
                  :label="$t('station.ipAddress')"
                  :disable="mode === 'details'"
                  dense
                  lazy-rules
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="lan" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Seri no -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-input
                  ref="serialNumberRef"
                  v-model="formModel.serialNumber"
                  :label="$t('station.serialNumber')"
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="confirmation_number" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Enlem -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-mb-md">
              <q-item-section>
                <q-input
                  ref="latitudeRef"
                  v-model="formModel.latitude"
                  :label="$t('region.latitude')"
                  :disable="mode === 'details'"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="explore" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Boylam -->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6 q-mb-md">
              <q-item-section>
                <q-input
                  ref="longitudeRef"
                  v-model="formModel.longitude"
                  :label="$t('region.longitude')"
                  :disable="mode === 'details'"
                  lazy-rules
                  dense
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- İstasyon Fiyat Listesi-->
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <q-item-section>
                <q-select
                  ref="chargePriceRef"
                  v-model="formModel.chargePriceList"
                  :options="chargePriceList"
                  option-label="name"
                  option-value="id"
                  :label="$t('priceList.priceList')"
                  :disable="mode === 'details'"
                  options-dense
                  map-options
                  lazy-rules
                  dense
                  outlined
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lists" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
            <!-- Açıklama -->
            <q-item class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  ref="descriptionRef"
                  v-model="formModel.description"
                  type="textarea"
                  rows="2"
                  :label="$t('description')"
                  :disable="mode === 'details'"
                  dense
                  lazy-rules
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="description" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Adres -->
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-mt-xs">
              <q-item-section>
                <q-expansion-item
                  dense
                  :label="$t('firm.address')"
                  icon="place"
                  class="bg-white-4"
                  :default-opened="mode === 'add'"
                >
                  <q-card class="bg-white-2">
                    <q-card-section>
                      <q-list dense class="row">
                        <!-- Ülke Inputs -->
                        <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                          <q-item-section>
                            <q-select
                              ref="countryRef"
                              v-model="formModel.address.country"
                              :options="countries"
                              option-value="id"
                              option-label="name"
                              :label="$t('firm.country')"
                              options-dense
                              map-options
                              dense
                              outlined
                              clearable
                              :disable="mode === 'details'"
                              @update:model-value="onCountryChange"
                              :rules="[(val) => !!val || $t('requiredlabel')]"
                              style="width: 100%"
                            >
                              <template #prepend>
                                <q-icon name="public" />
                              </template>
                            </q-select>
                          </q-item-section>
                        </q-item>
                        <!-- Şehir Inputs -->
                        <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                          <q-item-section>
                            <q-select
                              ref="cityRef"
                              v-model="formModel.address.city"
                              :options="filteredCities"
                              option-value="id"
                              option-label="name"
                              :label="$t('firm.city')"
                              use-input
                              options-dense
                              map-options
                              dense
                              outlined
                              clearable
                              :disable="
                                !formModel.address.country || mode === 'details'
                              "
                              @filter="
                                (val, update) =>
                                  filterList(
                                    val,
                                    update,
                                    'cities',
                                    'filteredCities',
                                  )
                              "
                              @update:model-value="onCityChange"
                              :rules="[(val) => !!val || $t('requiredlabel')]"
                              style="width: 100%"
                            >
                              <template #prepend>
                                <q-icon name="location_city" />
                              </template>
                            </q-select>
                          </q-item-section>
                        </q-item>
                        <!-- İlçe Inputs -->
                        <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                          <q-item-section>
                            <q-select
                              ref="districtRef"
                              v-model="formModel.address.district"
                              :options="filteredDistricts"
                              option-value="id"
                              option-label="name"
                              :label="$t('firm.district')"
                              use-input
                              options-dense
                              map-options
                              dense
                              outlined
                              clearable
                              :disable="
                                !formModel.address.city || mode === 'details'
                              "
                              @filter="
                                (val, update) =>
                                  filterList(
                                    val,
                                    update,
                                    'districts',
                                    'filteredDistricts',
                                  )
                              "
                              :rules="[(val) => !!val || $t('requiredlabel')]"
                              style="width: 100%"
                            >
                              <template #prepend>
                                <q-icon name="place" />
                              </template>
                            </q-select>
                          </q-item-section>
                        </q-item>
                        <!-- Adresi -->
                        <q-item class="col-lg-12 col-md-12 col-sm-6 col-xs-6">
                          <q-item-section>
                            <q-input
                              ref="addressDetailRef"
                              v-model="formModel.address.addressDetail"
                              :label="$t('firm.address')"
                              type="textarea"
                              :disable="mode === 'details'"
                              dense
                              outlined
                              rows="2"
                              :rules="[(val) => !!val || $t('requiredlabel')]"
                            >
                              <template v-slot:prepend>
                                <q-icon name="home" />
                              </template>
                            </q-input>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <!-- İstasyon Detay ve Fotoğraf-->
    <div
      class="col-lg-3 col-md-3 col-sm-12 col-xs-12"
      :style="{
        opacity: mode === 'details' ? 0.5 : 1,
        pointerEvents: mode === 'details' ? 'none' : 'auto',
      }"
    >
      <q-card class="q-ma-md col-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("station.stationDetail") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list dense class="q-gutter-xs">
            <!-- Tahsilat Yapılacak -->
            <q-item>
              <q-item-section>
                <span class="text-subtitle2">{{
                  $t("station.collectPayment")
                }}</span>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="formModel.isPaid"
                  :disable="mode === 'details'"
                  color="primary"
                />
              </q-item-section>
            </q-item>
            <!-- Kredi Kartı Zorunlu -->
            <q-item>
              <q-item-section>
                <span class="text-subtitle2">{{
                  $t("station.creditCardRequired")
                }}</span>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="formModel.isCreditCardRequired"
                  :disable="mode === 'details'"
                  color="primary"
                />
              </q-item-section>
            </q-item>
            <!-- EPKD veri gönder -->
            <q-item>
              <q-item-section>
                <span class="text-subtitle2">{{
                  $t("station.sendToEPDK")
                }}</span>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="formModel.isSendEPDK"
                  :disable="mode === 'details'"
                  color="primary"
                />
              </q-item-section>
            </q-item>
            <!-- Özel Lokasyon -->
            <q-item>
              <q-item-section>
                <span class="text-subtitle2">{{
                  $t("station.privateArea")
                }}</span>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="formModel.isPrivateLocation"
                  :disable="mode === 'details'"
                  color="primary"
                />
              </q-item-section>
            </q-item>
            <!-- Kullanım Kısıtlama -->
            <q-item v-if="formModel.isPrivateLocation">
              <q-item-section>
                <span class="text-subtitle2">{{ $t("station.restrict") }}</span>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="formModel.isRestricted"
                  :disable="mode === 'details'"
                  color="primary"
                />
              </q-item-section>
            </q-item>
            <!-- Plaka Kısıtlama -->
            <q-item v-if="formModel.isRestricted">
              <q-item-section>
                <q-btn
                  dense
                  no-caps
                  :label="$t('vehicle.vehicleInformation')"
                  :disable="mode === 'add' || mode === 'details'"
                  color="primary"
                  @click="onStationAccessPermissions()"
                  style="width: 70%"
                >
                  <q-badge
                    size="md"
                    color="orange"
                    text-color="black"
                    class="text-bold"
                    floating
                  >
                    {{ stationAccessVehicles.length }}</q-badge
                  >
                </q-btn>
              </q-item-section>
            </q-item>
            <!-- Test İstasyonu -->
            <q-item>
              <q-item-section>
                <span class="text-subtitle2">{{
                  $t("station.testStation")
                }}</span>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="formModel.isTested"
                  :disable="mode === 'details'"
                  color="primary"
                />
              </q-item-section>
            </q-item>
            <!-- Tak Çalıştır -->
            <q-item>
              <q-item-section>
                <span class="text-subtitle2">{{
                  $t("station.plugnPlay")
                }}</span>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="formModel.isPlugnPlay"
                  :disable="mode === 'details'"
                  color="primary"
                />
              </q-item-section>
            </q-item>
            <!--isGreenEnergy -->
            <q-item>
              <q-item-section>
                <span class="text-subtitle2">{{
                  $t("station.greenEnergy")
                }}</span>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="formModel.isGreenEnergy"
                  :disable="mode === 'details'"
                  color="primary"
                />
              </q-item-section>
            </q-item>
            <!--Visible Station -->
            <q-item>
              <q-item-section>
                <span class="text-subtitle2">{{
                  $t("station.visibleOnMap")
                }}</span>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="formModel.isVisibleOnMap"
                  :disable="mode === 'details'"
                  color="primary"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <!-- Fotoğraf yükleme -->
      <q-item
        class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
        v-if="formModel.id"
      >
        <q-item-section>
          <q-uploader
            ref="imageUploader"
            label="İstasyon Görseli Ekle"
            accept="image/*"
            auto-upload="false"
            hide-upload-btn
            :max-files="1"
            style="width: 100%; max-width: 100%"
          />
        </q-item-section>
      </q-item>
    </div>
    <!-- İstasyon Konnektör Bilgileri-->
    <div
      v-if="formModel.id"
      class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
      :style="{
        opacity: mode === 'details' ? 0.5 : 1,
        pointerEvents: mode === 'details' ? 'none' : 'auto',
      }"
    >
      <station-connector-form :stationId="formModel.id" />
    </div>
  </div>

  <q-card-actions class="q-pa-lg justify-between">
    <q-toggle
      class="col-lg-8 col-md-8 col-sm-8 col-xs-12"
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

  <!-- Station Access Dialog -->
  <q-dialog
    v-model="formVisible"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 30vw; max-height: 55vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-sm">
          <q-icon name="price_change" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{ modelValue.name }} - </span>
            {{ $t("vehicle.vehicleInformation") }}</q-toolbar-title
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
        <stationAccessPermissions-form
          class="q-pa-sm"
          v-model="currentRow"
          @completed="onFormCompleted()"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from "vue";
import StationConnectorForm from "src/components/forms/StationConnectorForm.vue";
import StationAccessPermissionsForm from "src/components/forms/StationAccessPermissionsForm.vue";

export default defineComponent({
  name: "StationForm",
  components: {
    StationConnectorForm,
    StationAccessPermissionsForm,
  },
  setup(props, { emit }) {
    let formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode === "add") {
      formModel.value.isVisibleOnMap = true;
      formModel.value.stationStatusId = 1;
      formModel.value.isActive = true;
      formModel.value.address = {};
    } else {
      if (!formModel.value.address) formModel.value.address = {};
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
      countries: [],
      cities: [],
      districts: [],
      regions: [],
      dealers: [],
      statuses: [],
      chargePriceList: [],
      filteredCities: [],
      filteredDistricts: [],
      filteredRegions: [],
      filteredDealers: [],
      filteredStatuses: [],
      stationModels: [],
      stationMeterTypes: [],
      stationElectricTypes: [],
      connectionPolicies: [],
      connectionProtocols: [],
      stationAccessVehicles: [],
      formVisible: false,
      maximizedToggle: false,
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "key",
          label: this.$t("station.stationName"),
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "value",
          label: this.$t("station.stationRegion"),
          field: (row) => row.stationRegion?.name || "-",
          align: "left",
          sortable: true,
        },
        {
          name: "action",
          label: this.$t("action"),
          field: (row) => row,
          align: "center",
        },
      ];
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        this.getCountries();
        this.getRegions();
        this.getDealers();
        this.getChargePriceList();
        this.getStationModels();
        this.getStationStatuses();
        this.getStationMeterTypes();
        this.getStationElectricTypes();
        this.getConnectionPolicies();
        this.getConnectionProtocols();

        this.$logger.log("Station formModel:", this.formModel);
        if (this.formModel.address.countryId) {
          await this.getCities(this.formModel.address.countryId); // Ülkenin şehirlerini al
          // Şehiri bul ve ilçeleri getir
          this.districts = this.filteredDistricts =
            this.cities.find((c) => c.id === this.formModel.address.cityId)
              ?.districts || [];
        }

        if (this.mode !== "add") {
          // İstasyon Fiyat Listesini Ayarla
          // this.formModel.chargePriceList = this.chargePriceList.find(
          //   (c) => c.id === this.formModel.chargePriceListId,
          // );

          // İstasyon Erişim İzinlerini Getir
          this.getStationAccessPermissions();
        }
      } catch (error) {
        this.$logger.error("Hata:", error);
      }
    },

    async onSubmit() {
      try {
        // Form doğrulama
        const isValid =
          (await this.$refs.stationNameRef?.validate?.()) &&
          (await this.$refs.stationCodeRef?.validate?.()) &&
          (await this.$refs.regionRef?.validate?.()) &&
          (await this.$refs.policyRef?.validate?.()) &&
          (await this.$refs.protocolRef?.validate?.()) &&
          (await this.$refs.dealerRef?.validate?.()) &&
          (await this.$refs.chargePriceRef?.validate?.()) &&
          (await this.$refs.countryRef?.validate?.()) &&
          (await this.$refs.cityRef?.validate?.()) &&
          (await this.$refs.districtRef?.validate?.()) &&
          (await this.$refs.addressDetailRef?.validate?.());

        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }
        // FormModel id güncelleme
        [
          "dealer",
          "stationModel",
          "stationRegion",
          "chargePriceList",
          "stationMeterType",
          "stationElectricType",
          "stationConnectionPolicy",
        ].forEach((key) => {
          this.formModel[`${key}Id`] = this.formModel[key]?.id;
        });
        // FormModel Adres güncelleme
        this.formModel.address = {
          ...this.formModel.address,
          countryId: this.formModel.address.country.id,
          cityId: this.formModel.address.city.id,
          districtId: this.formModel.address.district.id,
        };

        this.$logger.log("İstasyon formModel:", this.formModel);
        if (this.mode === "add") {
          this.addFormModel();
        } else {
          this.updateFormModel();
        }
      } catch (error) {
        this.$logger.error("Hata:", error);
      }
    },
    async addFormModel() {
      try {
        const response = await this.$api.post("createStation", this.formModel); // İstasyon Kayıt
        if (response.status === 200) {
          this.$q.notify({ type: "positive", message: this.$t("saved") });
          this.$emit("completed");
        }
      } catch (error) {
        this.$logger.error("Error add station:", error);
      }
    },
    async updateFormModel() {
      try {
        const response = await this.$api.put("updateStation", this.formModel); // İstasyon Güncelleme
        if (response.status === 200) {
          this.$q.notify({ type: "positive", message: this.$t("updated") });
          //this.$emit("completed");
        }
      } catch (error) {
        this.$logger.error("Error update station:", error);
      }
    },

    async onCountryChange() {
      try {
        this.formModel.address.city = null;
        this.formModel.address.district = null;

        this.getCities(this.formModel.address.country.id);
      } catch (error) {
        this.$logger.error("Ülke verisi alınamadı:", error);
      }
    },
    onCityChange() {
      try {
        this.formModel.address.district = null;
        this.districts = this.filteredDistricts =
          this.formModel.address.city?.districts;
      } catch (error) {
        this.$logger.error("onCityChange", error);
      }
    },
    onStationAccessPermissions(row, mode) {
      this.currentRow = this.modelValue;
      this.currentMode = mode;
      this.formVisible = true;
    },
    onFormCompleted() {
      this.formVisible = false;
    },

    filterList(val, update, sourceList, targetList) {
      const source = this[sourceList];
      const normalizedVal = this.$normalizeTurkishString(val);

      update(() => {
        this[targetList] =
          val === ""
            ? source
            : source.filter((item) =>
                this.$normalizeTurkishString(item.name).includes(normalizedVal),
              );
      });
    },
    async getCountries() {
      try {
        const response = await this.$api.get("getCountries");
        this.countries = response.data;
      } catch (error) {
        this.$logger.error("Hata", error);
      }
    },
    async getCities(countryId) {
      try {
        const response = await this.$api.get(
          `getCitiesWithDistricts/${countryId}`,
        );
        this.cities = response.data;
      } catch (error) {
        this.$logger.error("Şehir verisi alınamadı:", error);
      }
    },
    async getRegions() {
      try {
        const response = await this.$api.get("getRegions");
        this.regions = this.filteredRegions = response?.data.data || [];
      } catch (error) {
        this.$logger.error("getRegions error", error);
      }
    },
    async getDealers() {
      try {
        const response = await this.$api.get("getDealers");
        this.dealers = this.filteredDealers = response?.data.data || [];
      } catch (error) {
        this.$logger.error("getDealers error", error);
      }
    },
    async getChargePriceList() {
      try {
        this.loading = true;
        const response = await this.$api.get("getChargePriceLists");
        this.chargePriceList = response.data;
      } catch (error) {
        this.$logger.error("Error fetching price list:", error);
      } finally {
        this.loading = false;
      }
    },
    async getStationModels() {
      try {
        const response = await this.$api.get("stationModels");
        this.stationModels = this.filteredStationModels = response?.data || [];
      } catch (error) {
        this.$logger.error("getStationModels error", error);
      }
    },
    async getStationStatuses() {
      try {
        const response = await this.$api.get("/stationStatuses");
        this.statuses = response?.data || [];
      } catch (error) {
        this.$logger.error("getStationStatuses error", error);
      }
    },
    async getStationElectricTypes() {
      try {
        const response = await this.$api.get("stationElectricTypes");
        this.stationElectricTypes = response?.data || [];
      } catch (error) {
        this.$logger.error("getStationElectricTypes error", error);
      }
    },
    async getStationMeterTypes() {
      try {
        const response = await this.$api.get("stationMeterTypes");
        this.stationMeterTypes = response?.data || [];
      } catch (error) {
        this.$logger.error("getStationMeterTypes error", error);
      }
    },
    async getConnectionPolicies() {
      try {
        const response = await this.$api.get("stationConnectionPolicies");
        this.connectionPolicies = response?.data || [];
      } catch (error) {
        this.$logger.error("getConnectionPolicies error", error);
      }
    },
    async getConnectionProtocols() {
      try {
        const response = await this.$api.get("stationConnectionProtocols");
        this.connectionProtocols = response?.data || [];
      } catch (error) {
        this.$logger.error("getConnectionProtocols error", error);
      }
    },
    async getStationAccessPermissions() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          `getStationAccessPermissions/${this.modelValue.id}`,
        );
        this.stationAccessVehicles = response.data.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getStationAccessPermissions", error);
      }
    },
  },
});
</script>
