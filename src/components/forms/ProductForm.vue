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
              <q-card-section class="q-pa-none row">
                <q-btn
                  dense
                  class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                  style="width: 150px"
                  text-color="white"
                  @click="stockTypeFormVisibile = true"
                >
                  {{ $t("products.stocktype") }}
                </q-btn>

                <q-btn
                  dense
                  class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                  style="width: 150px"
                  text-color="white"
                  @click="categoryFormVisibile = true"
                >
                  {{ $t("products.category") }}
                </q-btn>

                <q-btn
                  dense
                  class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                  style="width: 150px"
                  text-color="white"
                  @click="brandFormVisibile = true"
                >
                  {{ $t("products.brand") }}
                </q-btn>

                <q-btn
                  dense
                  class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                  style="width: 150px"
                  text-color="white"
                  @click="modelFormVisibile = true"
                >
                  {{ $t("products.model") }}
                </q-btn>

                <q-btn
                  dense
                  class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                  style="width: 150px"
                  text-color="white"
                  @click="currencyFormVisibile = true"
                >
                  {{ $t("products.currency") }}
                </q-btn>

                <q-btn
                  dense
                  class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
                  style="width: 150px"
                  text-color="white"
                  @click="unitFormVisibile = true"
                >
                  {{ $t("products.unit") }}
                </q-btn>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card>
    </div>
  </div>

  <div class="row">
    <div class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-pa-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            expand-separator
            icon="collections"
            :label="$t('products.stockCardImages')"
          >
            <q-card>
              <q-card-section class="q-pa-none row">
                <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-carousel
                      animated
                      v-model="slide"
                      swipeable
                      infinite
                      arrows
                      navigation
                      class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
                      control-color="red"
                      height="400px"
                    >
                      <q-carousel-slide
                        v-for="(image, index) in productImages"
                        :key="index"
                        :name="index"
                      >
                        <div
                          class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
                        >
                          <q-img
                            class="rounded-borders col-6 full-height full-width"
                            :src="image"
                            fit="scale-down"
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
                        </div>
                      </q-carousel-slide>
                    </q-carousel>
                  </q-item-section>
                </q-item>
                <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-uploader
                      ref="uploader"
                      :label="$t('users.uploadphoto')"
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

                    <q-inner-loading
                      :showing="uploaderLoading"
                      color="red"
                      :dark="true"
                      label="Please wait..."
                    />
                  </q-item-section>
                </q-item>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("products.stockinfo") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none row">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  ref="inputStockCardName"
                  dense
                  outlined
                  use-input
                  :disable="mode === 'details'"
                  :label="$t('products.productname')"
                  v-model="formModel.stockName"
                  option-value="id"
                  option-label="stockName"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  disable
                  :label="$t('products.stockcode')"
                  v-model="formModel.stockCode"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.unit"
                  option-value="id"
                  option-label="name"
                  :label="$t('products.unit')"
                  :options="units"
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
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('products.minpiece')"
                  v-model="formModel.minPiece"
                />
              </q-item-section>
            </q-item>
            <q-item v-if="false" class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-toggle
                  dense
                  :label="$t('products.serialnumbertracking')"
                  v-model="formModel.serialNumberTracking"
                  checked-icon="qr_code"
                  color="green"
                  unchecked-icon="qr_code"
                  :disable="mode === 'details'"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <q-item-section>
                <q-toggle
                  dense
                  :label="$t('status')"
                  v-model="formModel.isActive"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="cancel"
                  :disable="mode === 'details'"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <q-table
            v-if="false"
            dense
            bordered
            :grid="isGrid"
            :hide-header="isGrid"
            class="statement-table q-ma-sm col-lg-11 col-md-11 col-sm-11 col-xs-11"
            :rows="rows"
            :columns="columns"
            :loading="loading"
            :filter="filter"
            :loading-label="$t('loading')"
            no-data-label="I didn't find anything for you"
            no-results-label="The filter didn't uncover any results"
            row-key="id"
          >
            <template v-slot:top>
              <div class="row col-12">
                <div
                  class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-table__title"
                >
                  {{ $t("products.barcodelist") }}
                </div>
                <q-space />
                <q-btn
                  flat
                  round
                  dense
                  icon="add"
                  class="col-lg-1 col-md-1 col-sm-3 col-xs-2"
                  @click="onAdd"
                />
                <q-space />
                <q-input
                  class="col-lg-4 col-md-4 col-sm-8 col-xs-9"
                  bottom-slots
                  dense
                  debounce="300"
                  v-model="filter"
                  :placeholder="$t('users.search')"
                >
                  <template v-slot:append
                    ><q-icon
                      v-if="filter !== ''"
                      name="close"
                      @click="filter = ''"
                      class="cursor-pointer"
                    />
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-space />
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
                  color="secondary"
                  icon="edit"
                  @click="onEditBarcode(props.row)"
                />
                <q-btn
                  dense
                  flat
                  round
                  color="negative"
                  icon="delete_forever"
                  @click="onDeleteBarcode(props.row)"
                />
              </q-td>
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
          <div>{{ $t("products.priceandcurrency") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none row">
          <q-list class="row">
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-select
                  dense
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.currency"
                  option-value="id"
                  option-label="name"
                  :label="$t('products.currency')"
                  :options="currenciesFiltered"
                  @filter="filterCurrency"
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
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('products.listprice')"
                  v-model="formModel.listPrice"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('products.vatrate')"
                  v-model="formModel.vatRate"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('products.discount')"
                  v-model="formModel.discount"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('products.discountpercent')"
                  v-model="formModel.discountPercent"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('products.saleprice')"
                  v-model="formModel.salePrice"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("products.categoryinfo") }}</div>
        </q-card-section>

        <q-card-section class="q-pa-none row">
          <q-list class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.stockType"
                  option-value="id"
                  option-label="name"
                  :label="$t('products.stocktype')"
                  :options="stockType"
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

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.category"
                  option-value="id"
                  option-label="name"
                  :label="$t('products.category')"
                  :options="categoriesFiltered"
                  @filter="filterCategoris"
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

            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.brand"
                  option-value="id"
                  option-label="name"
                  :label="$t('products.brand')"
                  :options="brandsFiltered"
                  @filter="filterBrands"
                  @update:model-value="selectedBrand()"
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

            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.model"
                  option-value="id"
                  option-label="name"
                  :label="$t('products.model')"
                  :options="modelsFiltered"
                  @filter="filterModels"
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
          </q-list>
        </q-card-section>
      </q-card>

      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("products.detailandnoteinfo") }}</div>
        </q-card-section>

        <q-card-section class="q-pa-none row">
          <q-list class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item>
              <q-item-section>
                <q-item-section>
                  <q-input
                    dense
                    :disable="mode === 'details'"
                    :label="$t('firm.detail')"
                    v-model="formModel.detail"
                    type="textarea"
                  />
                </q-item-section>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-pa-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
  </div>

  <q-dialog
    v-model="stockBarcodeFormVisibile"
    persistent
    dense
    :maximized="maximizedToggle"
    transition-show="flip-up"
    transition-hide="flip-up"
  >
    <q-card style="min-width: 40vw; max-height: 95vh">
      <q-card-section class="q-pa-sm">
        <q-bar class="q-pa-sm">
          <q-icon name="add_box" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{
              $t("products.stockbarcode")
            }}</span>
            {{ $t(formMode) }}</q-toolbar-title
          >

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
        <product-barcode-form
          class="q-pa-sm"
          v-model="currentRow"
          :mode="formMode"
          @completed="getBarcodeList"
          @close="stockBarcodeFormVisibile = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="stockTypeFormVisibile"
    persistent
    dense
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 90vh">
      <q-card-section class="q-pa-sm">
        <q-bar class="q-pa-sm">
          <q-icon name="add_box" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{
              $t("products.stocktype")
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
        <stock-type-form
          class="q-pa-sm"
          v-model="currentRow"
          :mode="currentMode"
          @completed="getStockType"
          @close="stockTypeFormVisibile = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="brandFormVisibile"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 90vh">
      <q-card-section class="q-pa-sm">
        <q-bar class="q-pa-sm">
          <q-icon name="add_box" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{ $t("products.brand") }}</span>
          </q-toolbar-title>

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
        <brand-form
          class="q-pa-sm"
          v-model="currentRow"
          :mode="currentMode"
          @completed="getBrands"
          @close="brandFormVisibile = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="currencyFormVisibile"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 90vh">
      <q-card-section class="q-pa-sm">
        <q-bar class="q-pa-sm">
          <q-icon name="add_box" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{ $t("products.currency") }}</span>
          </q-toolbar-title>

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
        <currency-form
          class="q-pa-sm"
          v-model="currentRow"
          :mode="currentMode"
          @completed="getBrands"
          @close="currencyFormVisibile = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="unitFormVisibile"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 90vh">
      <q-card-section class="q-pa-sm">
        <q-bar class="q-pa-sm">
          <q-icon name="add_box" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{ $t("products.unit") }}</span>
          </q-toolbar-title>

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
        <unit-form
          class="q-pa-sm"
          v-model="currentRow"
          :mode="currentMode"
          @completed="getBrands"
          @close="unitFormVisibile = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="categoryFormVisibile"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 90vh">
      <q-card-section class="q-pa-sm">
        <q-bar class="q-pa-sm">
          <q-icon name="add_box" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{ $t("products.category") }}</span>
          </q-toolbar-title>

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
        <category-form
          class="q-pa-sm"
          v-model="currentRow"
          :mode="currentMode"
          @completed="getCategory"
          @close="categoryFormVisibile = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="modelFormVisibile"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 90vh">
      <q-card-section class="q-pa-sm">
        <q-bar class="q-pa-sm">
          <q-icon name="add_box" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{ $t("products.model") }}</span>
          </q-toolbar-title>

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
        <model-form
          class="q-pa-sm"
          v-model="currentRow"
          :mode="currentMode"
          @close="modelFormVisibile = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Delete Dialog -->
  <q-dialog v-model="deleteConfirm" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="person_off" color="negative" text-color="white" />&nbsp;
        &nbsp; &nbsp; &nbsp;
        <h5>{{ $t("products.deleteconfirm") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>{{ $t("products.barcode") }} : {{ currentRow.barcode }}</p>
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
          v-on:click="rowDelete()"
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

  <!--Barcode Delete Dialog -->
  <q-dialog v-model="barcodeDeleteConfirm" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center">
        <h5>{{ $t("products.deletebarcodeconfirm") }}</h5>
        <br />
        <p>{{ $t("products.barcode") }} : {{ currentRow.barcode }}</p>
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
          v-on:click="onDeleteBarcodeConfirm()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";
import StockTypeForm from "src/components/forms/StockTypeForm.vue";
import BrandForm from "src/components/forms/BrandForm.vue";
import CurrencyForm from "src/components/forms/CurrencyForm.vue";
import UnitForm from "src/components/forms/UnitForm.vue";
import CategoryForm from "src/components/forms/CategoryForm.vue";
import ModelForm from "src/components/forms/VehicleModelForm.vue";
import ProductBarcodeForm from "src/components/forms/ProductBarcodeForm.vue";

const $q = useQuasar();
export default defineComponent({
  name: "ProductForm",
  components: {
    StockTypeForm,
    BrandForm,
    CurrencyForm,
    UnitForm,
    CategoryForm,
    ModelForm,
    ProductBarcodeForm,
  },
  computed: {
    columns() {
      return [
        {
          name: "barcode",
          label: this.$t("product.barcode"),
          align: "left",
          field: (row) => row.barcode,
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

    return {
      formModel,
    };
  },
  data() {
    return {
      units: [],
      stockType: [],

      slide: 0,
      brandsFull: [],
      brandsFiltered: [],
      modelsFull: [],
      modelsFiltered: [],
      categoriesFull: [],
      categoriesFiltered: [],
      currenciesFull: [],
      currenciesFiltered: [],
      variationsFull: [],
      variationsFiltered: [],

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

      stockBarcodeFormVisibile: false,
      barcodeDeleteConfirm: false,
      stockTypeFormVisibile: false,
      brandFormVisibile: false,
      currencyFormVisibile: false,
      unitFormVisibile: false,
      categoryFormVisibile: false,
      modelFormVisibile: false,

      uploaderLoading: false,

      productImages: [],
      deleteImageFormVisible: false,
      deleteImage: "",

      selectedStockCard: { id: 0, stockName: "" },
      serviceId: 4,
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
      if (this.mode == "add") {
        this.formModel.stockCode = "";
      }
      //if (this.mode == "edit") this.getBarcodeList();
      this.getBrands();
      this.getCategory();
      this.getCurrency();
      this.getStockType();
      this.getUnit();
      this.getStockCardPhoto();

      try {
        if (this.formModel?.id) {
          //const response = await this.$api.get(
          //  "stockCardInfo/" + this.formModel.id
          //);
          //this.$logger.log("stockCardInfo/", response?.data);
          //this.formModel = response?.data;
          //this.getStockCardPhoto();
          this.loading = false;
        }
      } catch (error) {}

      if (this.mode == "add") {
        this.formModel.detail = "";
      }
    },

    onSubmit() {},

    save() {
      if (this.formModel.stockType) {
        this.formModel.stockTypeId = this.formModel.stockType.id;
      }
      if (this.formModel.category) {
        this.formModel.categoryId = this.formModel.category.id;
      } else {
        this.showNotify(
          "danger",
          "red",
          "Kategori Seçilmeli",
          "Ürün Kategorisi Seçilmedi"
        );
        return;
      }

      if (this.formModel.brand) {
        this.formModel.brandId = this.formModel.brand.id;
      }

      if (this.formModel.model) {
        this.formModel.modelId = this.formModel.model.id;
      }
      if (this.formModel.unit) {
        this.formModel.unitId = this.formModel.unit.id;
      }

      if (this.formModel.currency) {
        this.formModel.currencyId = this.formModel.currency.id;
      } else {
        this.showNotify(
          "error",
          "error",
          "Para Birimi Seçilmeli",
          "Ürün Para Birimi Seçilmedi"
        );
        return;
      }
      this.$logger.log("form submitted", this.formModel);
      if (this.mode === "add") {
        this.$logger.log("add");
        this.addFormModel();
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },

    async showNotify(type, color, message, caption) {
      this.$q.notify({
        progress: true,
        type: type,
        color: color,
        message: message,
        caption: caption,
      });
    },

    async addFormModel() {
      const _response = this.$api
        .post("insertStockCard", JSON.stringify(this.formModel))
        .then((response) => {
          this.$logger.log(response.data);
          this.$logger.log("add completed");
          this.formModel = response.data;
          this.formModel.stockCardId = response.data.id;
          this.formModel.stockCode = response.data.stockCode;
          this.$logger.log(this.formModel);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: "Stok Kart Bilgileri Kaydedildi", //this.$t("success"),
            caption: this.$t("success"),
          });
        });
    },

    async editFormModel() {
      const response = this.$api
        .put("stockCards", JSON.stringify(this.formModel))
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
          //this.$emit("completed");
        });
    },

    async getStockType() {
      const response = this.$api.get("stockTypes").then((data) => {
        this.$logger.log(data.data);
        this.stockType = data.data;
        if (this.formModel.stockType) this.selectedStockType();
      });
    },

    async selectedStockType() {
      var sType = this.stockType.find((b) => {
        return b.stockType === this.formModel.stockType.name;
      });
    },

    async filterProduct(val, update) {
      /*if (val.length < 3) {
        return;
      }*/
      this.$logger.log("val", val);
      this.$logger.log("update", update);

      update(() => {
        var body = { letters: val };
        this.$logger.log("body", body);
        const response = this.$api
          .put("searchStockCards/", body)
          .then((data) => {
            this.productsFiltered = data.data;
            this.$logger.log("productsFiltered", this.productsFiltered);
          });
      });
    },

    async getBrands() {
      const response = this.$api.get("brands").then((data) => {
        this.$logger.log(data.data);
        this.brandsFull = data.data;
        if (this.formModel.brand) this.selectedBrand();
      });
    },

    filterBrands(val, update) {
      if (val === "") {
        update(() => {
          this.brandsFiltered = this.brandsFull;
        });
        return;
      }

      update(() => {
        this.brandsFiltered = this.brandsFull.filter((v) =>
          this.$normalizeTurkishString(v.name).includes(
            this.$normalizeTurkishString(val)
          )
        );
      });
    },

    async selectedBrand() {
      this.$logger.log(this.brandsFull);
      this.$logger.log(this.formModel.brand.name);
      var sBrand = this.brandsFull.find((b) => {
        return b.name === this.formModel.brand.name;
      });
      this.getModels(sBrand.id);
    },

    async getModels(brandId) {
      const response = this.$api
        .get("modellistbybrandid/" + brandId)
        .then((data) => {
          this.modelsFull = data.data;
        });
    },

    filterModels(val, update) {
      if (val === "") {
        update(() => {
          this.modelsFiltered = this.modelsFull;
        });
        return;
      }

      update(() => {
        this.modelsFiltered = this.modelsFull.filter((v) =>
          this.$normalizeTurkishString(v.name).includes(
            this.$normalizeTurkishString(val)
          )
        );
      });
    },

    async getCategory() {
      const response = this.$api.get("categories").then((data) => {
        this.$logger.log(data.data);
        this.categoriesFull = data.data;
      });
    },

    filterCategoris(val, update) {
      if (val === "") {
        update(() => {
          this.categoriesFiltered = this.categoriesFull;
        });
        return;
      }

      update(() => {
        this.categoriesFiltered = this.categoriesFull.filter((v) =>
          this.$normalizeTurkishString(v.name).includes(
            this.$normalizeTurkishString(val)
          )
        );
      });
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

    async getUnit() {
      const response = this.$api.get("units").then((data) => {
        this.$logger.log(data.data);
        this.units = data.data;
        if (this.formModel.unit) this.selectedUnit();
      });
    },

    async selectedUnit() {
      var sType = this.units.find((b) => {
        return b.unit === this.formModel.unit.name;
      });
    },
    async getBarcodeList() {
      this.loading = true;
      this.rows = {};
      try {
        if (this.formModel.id) {
          /*const response = await this.$api.get(
            "getStockCardBarcode/" + this.formModel.id
          );
          this.rows = response?.data;

          this.loading = false;*/
        }
      } catch (error) {
        this.$logger.log(error);
      }
    },

    saveBarcode() {
      this.$logger.log("form submitted", this.newModel);
      if (this.formMode === "add") {
        this.$logger.log("add");
        this.addFormModel();
      } else if (this.formMode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },
    async addBarcode() {
      const _response = this.$api
        .post("stockBarcodes", JSON.stringify(this.newModel))
        .then((response) => {
          this.$logger.log(response.data);
          this.resp = response.data;
          this.$logger.log(this.resp);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
          this.getList();
          //this.$emit("completed");
          //this.$emit("close");
        });
    },
    async editBarcode() {
      const response = this.$api
        .put("stockBarcodes", JSON.stringify(this.newModel))
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
          this.getList();
          //this.$emit("completed");
          //this.$emit("close");
        });
    },
    async onAdd() {
      if (!this.formModel.id) {
        this.alert();
        return;
      }
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentRow.stockCardId = this.formModel.id;
      this.currentRow.barcode = "";
      this.formMode = "add";
      this.stockBarcodeFormVisibile = true;
    },
    async onEditBarcode(row) {
      this.currentRow = row;
      this.stockBarcodeFormVisibile = true;
      this.formMode = "edit";
    },

    async onDeleteBarcode(_row) {
      this.currentRow = _row;
      this.barcodeDeleteConfirm = true;
    },
    async onDeleteBarcodeConfirm() {
      try {
        this.$logger.log(this.currentRow.id);
        const response = await this.$api.delete(
          "stockBarcodes/" + this.currentRow.id
        );
        this.getBarcodeList();
        this.barcodeDeleteConfirm = false;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async calcDiscount() {
      this.formModel.discountPercent =
        (this.formModel.discount * 100) / this.formModel.price;

      this.formModel.unitAmount =
        this.formModel.price - this.formModel.discount;
    },
    async calcDiscountPercent() {
      this.formModel.discount =
        (this.formModel.discountPercent * this.formModel.price) / 100;

      this.formModel.unitAmount =
        this.formModel.price - this.formModel.discount;
    },
    async alert() {
      this.$q.notify({
        color: "red",
        textColor: "white",
        type: "danger",
        position: "center",
        multiLine: true,
        progress: true,
        icon: "announcement",
        message: this.$t("error"),
        caption: this.$t("products.saveproductfirst"),
      });
    },

    async uploadFiles(files) {
      this.$logger.log("Uploading files: ", files);
      this.uploaderLoading = true;

      try {
        const data = new FormData();
        const fileInfo = {
          fileType: "services",
          referenceId: this.serviceId, // Blog ID'si
        };

        files.forEach((file) => {
          data.append("files", file); // Orijinal isim ile gönderiyoruz
        });

        data.append("fileInfo", JSON.stringify(fileInfo));

        const response = await this.$api.post("postUpload", data);
        this.$logger.log("Upload Success:", response);
        this.getStockCardPhoto();
        return true;
      } catch (error) {
        this.$logger.error("Upload Error:", error);
        return false;
      } finally {
        this.uploaderLoading = false;
      }
    },

    onUploadFinish() {
      this.$refs.uploader.reset();
    },

    async getStockCardPhoto() {
      try {
        //const response = await this.$api.get(`getServiceImages/${this.blogId}`);
        const response = await this.$api.get(
          `getServiceImages/${this.serviceId}`
        );
        this.productImages = response.data.map((img) => {
          return `http://infaura.com/assets/img/services/${this.serviceId}/${img}`;
        });
        this.$logger.log("productImages:", this.productImages);
      } catch (error) {
        this.$logger.error("Error get blog images:", error);
      }
    },

    imageSrc(src) {
      try {
        const imgPath = `http://mimargelsin.com.tr/assets/img/blogs/${this.blogId}/${src}`;
        this.$logger.log("Image Path:", imgPath);
        return imgPath;
      } catch (error) {
        this.$logger.error("Error get image src:", error);
      }
    },
    imageDelete(image) {
      this.$logger.log("image", image);
      var img = image.split("/");
      this.$logger.log("img", img);
      var imgName = img[img.length - 1];
      this.$logger.log("imgName", imgName);
      /*const response = this.$api
        .post(`deleteFile/stockCard/${imgName}`)
        .then((resp) => {
          this.$logger.log("imageDelete", resp);
          this.getStockCardPhoto();
          this.deleteImageFormVisible = false;
        });*/
    },
    finished() {
      this.$refs.uploader.reset();
    },
  },
});
</script>
