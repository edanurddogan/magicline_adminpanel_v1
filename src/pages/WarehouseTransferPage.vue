<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <q-expansion-item
      v-model="stockinfoexpanded"
      expand-separator
      icon="lightbulb"
      :label="$t('products.stockinfo')"
    >
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
                    <q-select
                      v-model="stockCard.stockName"
                      outlined
                      use-input
                      transition-show="scale"
                      transition-hide="scale"
                      input-debounce="0"
                      option-value="id"
                      option-label="stockName"
                      :label="$t('products.product')"
                      @filter="filterProduct"
                      :options="productsFiltered"
                      @update:model-value="(val) => productSelected(val)"
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
                <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input
                      dense
                      :disable="mode === 'details'"
                      :label="$t('products.stockcode')"
                      v-model="stockCard.stockCode"
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
                      option-value="id"
                      option-label="name"
                      :label="$t('products.unit')"
                      :options="units"
                      v-model="stockCard.unit"
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
                      type="number"
                      v-model="stockCard.minPiece"
                    />
                  </q-item-section>
                </q-item>
                <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  <q-item-section>
                    <q-toggle
                      dense
                      :label="$t('products.serialnumbertracking')"
                      checked-icon="qr_code"
                      color="green"
                      unchecked-icon="qr_code"
                      :disable="mode === 'details'"
                      v-model="stockCard.serialNumberTracking"
                    />
                  </q-item-section>
                </q-item>
                <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  <q-item-section>
                    <q-toggle
                      dense
                      :label="$t('status')"
                      checked-icon="check"
                      color="green"
                      unchecked-icon="cancel"
                      :disable="mode === 'details'"
                      v-model="stockCard.isActive"
                    />
                  </q-item-section>
                </q-item>
              </q-list>

              <q-table
                flat
                dense
                bordered
                :grid="isGrid"
                :hide-header="isGrid"
                class="statement-table q-ma-sm col-lg-11 col-md-11 col-sm-11 col-xs-11"
                :rows="rowsBarcode"
                :columns="columnsBarcodes"
                :loading="loadingBarcode"
                :filter="filterBarcode"
                :loading-label="$t('loading')"
                no-data-label="I didn't find anything for you"
                no-results-label="The filter didn't uncover any results"
                row-key="id"
              >
                <template v-slot:top>
                  <div class="row col-12">
                    <div
                      class="col-lg-4 col-md-4 col-sm-4 col-xs-4 q-table__title"
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
                      @click="onAddBarcode"
                    />
                    <q-btn
                      flat
                      round
                      dense
                      icon="refresh"
                      class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                      @click="getBarcodeList"
                    >
                      <q-tooltip>
                        {{ $t("refresh") }}
                      </q-tooltip>
                    </q-btn>
                    <q-input
                      class="col-lg-3 col-md-3 col-sm-3 col-xs-3"
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
                    <q-icon
                      size="2em"
                      :name="filter ? 'filter_b_and_w' : icon"
                    />
                    <span> {{ message }}... </span>
                  </div>
                </template>
              </q-table>
            </q-card-section>
            <q-inner-loading
              :showing="stockCardLoading"
              color="red"
              :dark="true"
              label="Please wait..."
            />
          </q-card>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
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
                      v-model="stockCard.currency"
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
                      v-model="stockCard.listPrice"
                      type="number"
                    />
                  </q-item-section>
                </q-item>
                <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
                  <q-item-section>
                    <q-input
                      dense
                      :disable="mode === 'details'"
                      :label="$t('products.vatrate')"
                      v-model="stockCard.vatRate"
                      type="number"
                    />
                  </q-item-section>
                </q-item>
                <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
                  <q-item-section>
                    <q-input
                      dense
                      :disable="mode === 'details'"
                      :label="$t('products.discount')"
                      v-model="stockCard.discount"
                      type="number"
                    />
                  </q-item-section>
                </q-item>
                <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
                  <q-item-section>
                    <q-input
                      dense
                      :disable="mode === 'details'"
                      :label="$t('products.discountpercent')"
                      v-model="stockCard.discountPercent"
                      type="number"
                    />
                  </q-item-section>
                </q-item>
                <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
                  <q-item-section>
                    <q-input
                      dense
                      :disable="mode === 'details'"
                      :label="$t('products.saleprice')"
                      v-model="stockCard.salePrice"
                      type="number"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-inner-loading
              :showing="stockCardLoading"
              color="red"
              :dark="true"
              label="Please wait..."
            />
          </q-card>
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
                      v-model="stockCard.stockType"
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
                      v-model="stockCard.category"
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
                      v-model="stockCard.brand"
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
                      v-model="stockCard.model"
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
            <q-inner-loading
              :showing="stockCardLoading"
              color="red"
              :dark="true"
              label="Please wait..."
            />
          </q-card>

          <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-card-section class="bg-primary text-white">
              <div>{{ $t("products.detailandnoteinfo") }}</div>
            </q-card-section>

            <q-card-section class="q-pa-none row">
              <q-list class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item>
                  <q-item-section>
                    <q-input
                      dense
                      :disable="mode === 'details'"
                      :label="$t('firm.detail')"
                      v-model="stockCard.detail"
                      type="textarea"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-inner-loading
              :showing="stockCardLoading"
              color="red"
              :dark="true"
              label="Please wait..."
            />
          </q-card>
        </div>

        <div class="q-pa-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-card class="q-pa-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-card-actions>
              <q-space />
              <q-btn
                color="secondary"
                :label="$t('updatedata')"
                icon-right="send"
                text-color="white"
                @click="save"
              >
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </q-expansion-item>

    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-card-section class="bg-primary text-white">
            <div>{{ $t("products.stockInOut") }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <q-list class="row">
              <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <q-item-section>
                  <q-select
                    v-model="stockMovement.warehouse"
                    outlined
                    use-input
                    transition-show="scale"
                    transition-hide="scale"
                    input-debounce="0"
                    option-value="id"
                    option-label="name"
                    :label="$t('products.warehouse')"
                    :options="warehouse"
                    @update:model-value="(val) => warehouseSelected(val)"
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
              <q-item class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
                <q-item-section>
                  <q-input
                    dense
                    :disable="mode === 'details'"
                    :label="$t('products.piece')"
                    v-model="stockMovement.piece"
                    type="number"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-12">
                <!-- <q-item-section> -->
                <q-btn-toggle
                  class="text-capitalize"
                  v-model="stockMovement.movement"
                  push
                  rounded
                  toggle-color="blue-grey"
                  :options="[
                    { value: 'stockIn', slot: 'one' },
                    // { value: 'stocktaking', slot: 'two' },
                    { value: 'stockOut', slot: 'three' },
                  ]"
                  @click="movementSelected()"
                >
                  <template v-slot:one>
                    <div class="row items-center no-wrap">
                      <q-icon color="green-12" left name="arrow_downward" />
                      <div class="text-center text-capitalize">
                        {{ $t("products.stockIn") }}
                      </div>
                    </div>
                  </template>

                  <!-- <template v-slot:two>
                      <div class="row items-center no-wrap">
                        <div class="text-center text-capitalize">
                          {{ $t("products.stocktaking") }}
                        </div>
                        <q-icon color="black" right name="functions" />
                      </div>
                    </template> -->

                  <template v-slot:three>
                    <div class="row items-center no-wrap">
                      <div class="text-center text-capitalize">
                        {{ $t("products.stockOut") }}
                      </div>
                      <q-icon color="yellow-10" right name="arrow_upward" />
                    </div>
                  </template>
                </q-btn-toggle>
                <!-- </q-item-section> -->
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-list class="row">
              <q-item
                v-if="!stockCard.serialNumberTracking"
                class="col-lg-3 col-md-3 col-sm-3 col-xs-3"
              >
                <q-item-section>
                  <q-btn
                    class="text-capitalize"
                    color="cyan"
                    :label="$t('products.createbarcode')"
                    @click="
                      createBarcode = !createBarcode;
                      printBarcode.quantity =
                        stockCard.piece > 0 ? stockCard.piece : 1;
                    "
                  />
                </q-item-section>
              </q-item>
              <q-item
                v-if="stockCard.serialNumberTracking"
                class="col-lg-3 col-md-3 col-sm-3 col-xs-3"
              >
                <q-item-section>
                  <q-btn
                    class="text-capitalize"
                    color="cyan"
                    :label="$t('products.createSerialNo')"
                    @click="
                      createSerialNo = !createSerialNo;
                      printSerialNo.quantity = stockCard.piece;
                    "
                  />
                </q-item-section>
              </q-item>
              <q-space />
              <q-item class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                <q-item-section>
                  <q-btn
                    class="text-capitalize"
                    :disable="!stockMovement.movement"
                    icon-right="send"
                    text-color="white"
                    color="secondary"
                    :label="$t('save')"
                    @click="stockInOutSave"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!--Create Serial No Barcode-->
    <div
      v-if="createSerialNo /*&& stockCard.serialNumberTracking*/"
      class="col-lg-6 col-md-6 col-sm-6 col-xs-6"
    >
      <q-card class="q-ma-xs col-lg-6 col-md-6 col-sm-6 col-xs-6">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("products.createSerialNo") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-list class="row">
            <q-item class="col-lg-3 col-md-3 col-sm-4 col-xs-6">
              <q-item-section>
                <q-select
                  v-model="defaultBarcode"
                  outlined
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  option-value="id"
                  option-label="barcode"
                  :label="$t('products.barcode')"
                  :options="rowsBarcode"
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
            <q-item class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  :disable="true"
                  :label="$t('products.piece')"
                  v-model="stockMovement.piece"
                  type="number"
                  @update:model-value="printSerialNo_Print = false"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  disable
                  :label="$t('products.serialNoStart')"
                  v-model="newSerialNo"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  disable
                  :label="$t('products.serialNoFinish')"
                  v-model="newSerialNoEnd"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
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
                  @click="
                    printSerialNo_Print = true;
                    printSerialNo_Control = true;
                    getLastSerialNo();
                  "
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-inner-loading
          transition-show="scale"
          transition-hide="scale"
          :showing="printSerialNo_Control"
          color="red"
          :label-style="{ color: '#ff0000' }"
          :dark="true"
          :label="$t('products.beingChecked')"
        />
      </q-card>
    </div>

    <!--Create Stock Barcode-->
    <div
      v-if="createBarcode /*&& !stockCard.serialNumberTracking*/"
      class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
    >
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("products.createbarcode") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-list class="row">
            <q-item class="col-lg-3 col-md-3 col-sm-4 col-xs-6">
              <q-item-section>
                <q-select
                  v-model="defaultBarcode"
                  outlined
                  use-input
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  option-value="id"
                  option-label="barcode"
                  :label="$t('products.barcode')"
                  :options="rowsBarcode"
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
            <q-item class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('products.piece')"
                  v-model="printBarcode.quantity"
                  type="number"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('products.piecePrinted')"
                  v-model="printBarcode.printedQuantity"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
              <q-item-section>
                <q-btn
                  class="text-capitalize"
                  icon-right="send"
                  text-color="white"
                  color="secondary"
                  :label="$t('print')"
                  @click="printLabel"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <!--Stock Movement Table-->
    <q-expansion-item
      v-model="lastStockMovementExpansion"
      expand-separator
      icon="trending_up"
      :label="$t('products.lastStockPurchase')"
    >
      <q-table
        flat
        bordered
        :grid="isGrid"
        :hide-header="isGrid"
        class="statement-table"
        :rows="lastStockMovementsRows"
        :columns="lastStockMovementsColumns"
        :loading="loading"
        :filter="filter"
        :loading-label="$t('loading')"
        :no-data-label="$t('nodatalabel')"
        :no-results-label="$t('noresultslabel')"
        row-key="id"
        ><template v-slot:body-cell="props">
          <q-td :props="props">
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:top="props">
          <div class="row col-12">
            <!-- <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
              {{ $t("products.stockMovements") }}
            </div> -->
            <!-- <q-space /> -->
            <q-input
              class="col-lg-3 col-md-3 col-sm-6 col-xs-12"
              bottom-slots
              dense
              debounce="300"
              v-model="filter"
              :placeholder="$t('search')"
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
            <q-btn
              flat
              round
              dense
              icon="refresh"
              class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
              @click="getLastStockMoments"
            >
              <q-tooltip>
                {{ $t("refresh") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            >
              <q-tooltip>
                {{ $t("fullscreen") }}
              </q-tooltip>
            </q-btn>
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

            <q-input
              class="col-lg-1 col-md-1 col-sm-12 col-xs-12"
              bottom-slots
              dense
              debounce="300"
              type="number"
              v-model="lastStockMovementPiece"
              :placeholder="$t('piece')"
            >
              <template v-slot:append
                ><q-icon
                  v-if="filter !== ''"
                  name="close"
                  @click="filter = ''"
                  class="cursor-pointer"
                />
                <q-icon name="piece" />
              </template>
            </q-input>
            <q-space />

            <q-btn
              :label="$t('export')"
              class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
              icon="cloud_download"
              @click="exportTable"
            >
              <q-tooltip>
                {{ $t("export") }}
              </q-tooltip>
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
              flat
              round
              color="primary"
              icon="import_export"
              @click="onView(props.row)"
            >
              <q-tooltip>
                {{ $t("products.stockInOut") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="primary"
              icon="info"
              @click="onView(props.row)"
            >
              <q-tooltip>
                {{ $t("view") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="secondary"
              icon="edit"
              @click="onEdit(props.row)"
            >
              <q-tooltip>
                {{ $t("edit") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete_forever"
              @click="onDelete(props.row)"
            >
              <q-tooltip>
                {{ $t("delete") }}
              </q-tooltip>
            </q-btn>
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
                      >{{ props.row.isActive ? $t("active") : $t("inactive") }}
                    </q-chip>

                    <q-item-section
                      v-else-if="col.name === 'action'"
                      class="row"
                    >
                      <div class="row">
                        <q-btn
                          flat
                          round
                          color="primary"
                          icon="info"
                          @click="onView(props.row)"
                        />
                        <q-btn
                          flat
                          round
                          color="secondary"
                          icon="edit"
                          @click="onEdit(props.row)"
                        />
                        <q-btn
                          flat
                          round
                          color="negative"
                          icon="delete_forever"
                          @click="onDeleteUser(props.row)"
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
    </q-expansion-item>

    <q-expansion-item
      v-model="stockMovementExpansion"
      expand-separator
      icon="sync_alt"
      :label="$t('products.stockMovements')"
    >
      <q-table
        flat
        bordered
        :grid="isGrid"
        :hide-header="isGrid"
        class="statement-table"
        :rows="rows"
        :columns="stockMovementsColumns"
        :loading="loading"
        :filter="filter"
        :loading-label="$t('loading')"
        :no-data-label="$t('nodatalabel')"
        :no-results-label="$t('noresultslabel')"
        row-key="id"
        ><template v-slot:body-cell="props">
          <q-td :props="props">
            {{ props.value }}
          </q-td>
          <q-menu touch-position context-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section @click="onCopy(props.row)">
                  {{ $t("copy") }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </template>
        <template v-slot:top="props">
          <div class="row col-12">
            <q-input
              class="col-lg-3 col-md-4 col-sm-6 col-xs-12"
              bottom-slots
              dense
              debounce="300"
              v-model="filter"
              :placeholder="$t('search')"
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
            <q-btn
              flat
              round
              dense
              icon="refresh"
              class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
              @click="getStockMovements"
            >
              <q-tooltip>
                {{ $t("refresh") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            >
              <q-tooltip>
                {{ $t("fullscreen") }}
              </q-tooltip>
            </q-btn>
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
            <q-space />

            <q-btn
              :label="$t('export')"
              class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
              icon="cloud_download"
              @click="exportTable"
            >
              <q-tooltip>
                {{ $t("export") }}
              </q-tooltip>
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
              flat
              round
              color="primary"
              icon="import_export"
              @click="onView(props.row)"
            >
              <q-tooltip>
                {{ $t("products.stockInOut") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="primary"
              icon="info"
              @click="onView(props.row)"
            >
              <q-tooltip>
                {{ $t("view") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="secondary"
              icon="edit"
              @click="onEdit(props.row)"
            >
              <q-tooltip>
                {{ $t("edit") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete_forever"
              @click="onDelete(props.row)"
            >
              <q-tooltip>
                {{ $t("delete") }}
              </q-tooltip>
            </q-btn>
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
                      >{{ props.row.isActive ? $t("active") : $t("inactive") }}
                    </q-chip>

                    <q-item-section
                      v-else-if="col.name === 'action'"
                      class="row"
                    >
                      <div class="row">
                        <q-btn
                          flat
                          round
                          color="primary"
                          icon="info"
                          @click="onView(props.row)"
                        />
                        <q-btn
                          flat
                          round
                          color="secondary"
                          icon="edit"
                          @click="onEdit(props.row)"
                        />
                        <q-btn
                          flat
                          round
                          color="negative"
                          icon="delete_forever"
                          @click="onDeleteUser(props.row)"
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
    </q-expansion-item>

    <!-- Form Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 40vw; max-height: 95vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("products.product")
              }}</span>
              {{ $t(currentMode) }}</q-toolbar-title
            >

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
          <product-form
            class="q-pa-sm"
            v-model="currentRow"
            :mode="currentMode"
            @completed="onFormCompleted"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="deleteConfirm" persistent>
      <q-card class="q-pa-md">
        <q-card-section class="items-center row">
          <q-avatar
            icon="view_in_ar"
            color="negative"
            text-color="white"
          />&nbsp; &nbsp; &nbsp; &nbsp;
          <h5>{{ $t("products.deleteconfirm") }}</h5>
        </q-card-section>
        <q-card-section class="items-center row">
          <p>
            "{{ currentRow.stockName }}" {{ $t("products.deleteMessage") }} :
          </p>
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
            v-on:click="Delete()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Barcode Dialog -->
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
            v-model="currentRowBarcode"
            :mode="formMode"
            @completed="getBarcodeList"
            @close="stockBarcodeFormVisibile = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--Barcode Delete Dialog -->
    <q-dialog v-model="barcodeDeleteConfirm" persistent>
      <q-card class="q-pa-md">
        <q-card-section class="items-center">
          <h5>{{ $t("products.deletebarcodeconfirm") }}</h5>
          <br />
          <p>{{ $t("products.barcode") }} : {{ currentRowBarcode.barcode }}</p>
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
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import ProductForm from "src/components/forms/ProductForm.vue";
import ProductBarcodeForm from "src/components/forms/ProductBarcodeForm.vue";
import exportFromJSON from "export-from-json";
import { Platform } from "quasar";

export default defineComponent({
  components: {
    ProductForm,
    ProductBarcodeForm,
  },
  computed: {
    // columns() {
    //   return [
    //     {
    //       name: "stocktype",
    //       label: this.$t("products.stocktype"),
    //       field: (row) => row.stockType.name,
    //       align: "left",
    //       sortable: true,
    //     },
    //     {
    //       name: "productname",
    //       label: this.$t("products.productname"),
    //       align: "left",
    //       field: (row) => row.stockName,
    //       sortable: true,
    //     },
    //     {
    //       name: "stockcode",
    //       label: this.$t("products.stockcode"),
    //       field: (row) => row.stockCode,
    //       align: "left",
    //       sortable: true,
    //     },
    //     {
    //       name: "category",
    //       label: this.$t("products.category"),
    //       align: "left",
    //       field: (row) => row.category?.name,
    //       sortable: true,
    //     },
    //     {
    //       name: "brand",
    //       label: this.$t("products.brand"),
    //       field: (row) => row.brand?.name,
    //       align: "left",
    //       sortable: true,
    //     },
    //     {
    //       name: "model",
    //       label: this.$t("products.model"),
    //       field: (row) => row.model?.name,
    //       align: "left",
    //     },

    //     {
    //       name: "status",
    //       align: "center",
    //       label: this.$t("status"),
    //       field: "isActive",
    //       sortable: true,
    //     },
    //     {
    //       name: "action",
    //       align: "center",
    //       label: this.$t("action"),
    //       field: "",
    //     },
    //   ];
    // },
    stockMovementsColumns() {
      return [
        {
          name: "productname",
          label: this.$t("products.productname"),
          field: (row) => row.stockCard.stockName,
          align: "left",
          sortable: true,
        },
        {
          name: "entranceWarehouse",
          label: this.$t("products.entranceWarehouse"),
          field: (row) => row.entranceWarehouse?.name,
          align: "left",
          sortable: true,
        },
        {
          name: "outletWarehouse",
          label: this.$t("products.outletWarehouse"),
          field: (row) => row.outletWarehouse?.name,
          align: "left",
          sortable: true,
        },
        {
          name: "InOut",
          label: this.$t("products.InOut"),
          field: (row) => (row.movement == 1 ? "Giriş" : "Çıkış"),
          align: "left",
          sortable: true,
        },
        {
          name: "piece",
          label: this.$t("products.piece"),
          align: "left",
          field: (row) => row.piece,
          sortable: true,
        },
      ];
    },
    lastStockMovementsColumns() {
      return [
        {
          name: "productname",
          label: this.$t("products.productname"),
          field: (row) => row.stockCard.stockName,
          align: "left",
          sortable: true,
        },
        {
          name: "entranceWarehouse",
          label: this.$t("products.entranceWarehouse"),
          field: (row) => row.entranceWarehouse?.name,
          align: "left",
          sortable: true,
        },
        {
          name: "Invoice",
          label: this.$t("finance.invoice"),
          field: (row) => row.invoice.invoiceNo,
          align: "left",
          sortable: true,
        },
        {
          name: "unitPrice",
          label: this.$t("products.unitPrice"),
          align: "left",
          field: (row) => row.unitPrice,
          sortable: true,
        },
        {
          name: "piece",
          label: this.$t("products.piece"),
          align: "left",
          field: (row) => row.piece,
          sortable: true,
        },
      ];
    },

    columnsBarcodes() {
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
  data() {
    return {
      stockCard: {
        stockName: "",
        stockCode: "",
        stockType: {},
        category: {},
        model: {},
        currency: {},
        serialNumberTracking: false,
        minPiece: 0,
        unit: { id: 0, name: "" },

        discount: 0,
        discountPercent: 0,
        listPrice: 0,
        salePrice: 0,
        vatRate: 0,

        isActive: true,
      },
      units: [],
      stockType: [],

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
      stockCardLoading: true,
      rows: [],
      lastStockMovementsRows: [],
      newSerialNo: null,
      newSerialNoEnd: null,
      lastStockMovementExpansion: false,
      stockMovementExpansion: false,
      lastStockMovementPiece: 5,
      lastRows: [],
      rowsBarcode: [],
      selectedId: 0,
      formVisible: false,
      stockBarcodeFormVisibile: false,
      deleteConfirm: false,
      currentMode: "add",
      currentRow: null,
      currentRowBarcode: null,
      maximizedToggle: false,
      filter: "",
      isGrid: false,
      defaultBarcode: "",
      createSerialNo: false,
      createBarcode: false,
      printSerialNo_Print: false,
      printSerialNo_Control: false,
      loadingBarcode: false,
      filterBarcode: "",
      barcodeDeleteConfirm: false,
      stockinfoexpanded: true,
      visible: true,
      showSimulatedReturnData: false,
      warehouse: [],
      stockMovement: {
        warehouse: { id: 0, name: "" },
        movement: "",
      },
      printSerialNo: {
        quantity: 0,
        serialNoStart: 0,
        serialNoFinish: 0,
      },
      printBarcode: {
        quantity: 1,
        printedQuantity: 0,
      },
    };
  },
  async mounted() {
    this.init();
    document.title = "Magicline - Products";
    this.getStockCard();
    //this.getList()
  },
  methods: {
    async init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
      this.getBrands();
      this.getCategory();
      this.getCurrency();
      this.getStockType();
      this.getUnit();
      this.getWarehouse();
    },
    async onAdd() {
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    async onView(product) {
      this.$logger.log(product);
      this.maximizedToggle = false;
      this.currentRow = product;
      this.currentMode = "details";
      this.formVisible = true;
    },
    async onEdit(product) {
      this.currentRow = product;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    async onCopy(product) {
      product.id = null;
      this.currentRow = product;
      this.currentMode = "add";
      this.formVisible = true;
    },
    async onDelete(product) {
      this.currentRow = product;
      this.deleteConfirm = true;
    },
    async onFormCompleted() {
      this.formVisible = false;
      this.getList();
    },
    async exportTable() {
      const data = this.rows;
      const fileName = "StockList";
      const exportType = exportFromJSON.types.xls;

      exportFromJSON({ data, fileName, exportType });
    },
    async Delete() {
      try {
        const response = await this.$api.delete(
          "stockCards/" + this.currentRow.id
        );
        this.getList();
        this.deleteConfirm = false;
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getStockCard() {
      try {
        const response = await this.$api.get(
          "stockCardInfo/" + this.$route.params.id
        );
        this.stockCard = response?.data;
        this.stockCardLoading = false;
        this.stockinfoexpanded = false;
        this.getBarcodeList();
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getStockMovements() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          `getStockMoments/${this.stockCard.id}`
        );
        this.rows = response?.data;
        this.$logger.log("response data.......:", this.rows);
        this.loading = false;
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getLastStockMoments() {
      try {
        this.loading = true;
        if (this.lastStockMovementPiece <= 0) this.lastStockMovementPiece = 5;
        const response = await this.$api.get(
          `getLastStockMoments/${this.stockCard.id}/${this.lastStockMovementPiece}`
        );
        this.lastStockMovementsRows = response?.data;
        this.$logger.log("response data.......:", this.rows);
        this.loading = false;
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async getLastSerialNo() {
      try {
        const response = await this.$api.get(
          `getLastSerialNo/${this.stockCard.id}`
        );
        this.newSerialNo = response?.data;

        this.printSerialNo_Control = false;
        this.newSerialNoEnd =
          response?.data.split("SN")[0] +
          "SN" +
          (Number(response?.data.split("SN")[1]) +
            Number(this.stockMovement.piece));
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async getStockType() {
      const response = this.$api.get("stockTypes").then((data) => {
        this.stockType = data.data;
        if (this.stockCard.stockType) this.selectedStockType();
      });
    },

    async selectedStockType() {
      var sType = this.stockType.find((b) => {
        return b.stockType === this.stockCard.stockType.name;
      });
    },

    async getBrands() {
      const response = this.$api.get("brands").then((data) => {
        this.brandsFull = data.data;
        if (this.stockCard.brand) this.selectedBrand();
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
        this.brandsFiltered = this.brandsFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async selectedBrand() {
      var sBrand = this.brandsFull.find((b) => {
        return b.name === this.stockCard.brand.name;
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
        this.modelsFiltered = this.modelsFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getCategory() {
      const response = this.$api.get("categories").then((data) => {
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
        this.categoriesFiltered = this.categoriesFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
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
    //TODO-get warehouse for orderds
    async getWarehouse() {
      const response = this.$api.get("warehouses").then((data) => {
        this.warehouse = data.data;
      });
    },
    async warehouseSelected(warehouse) {
      this.$logger.log("warehouse", warehouse);
    },
    async getUnit() {
      const response = this.$api.get("units").then((data) => {
        this.units = data.data;
        if (this.stockCard.unit) this.selectedUnit();
      });
    },

    async selectedUnit() {
      var sType = this.units.find((b) => {
        return b.unit === this.stockCard.unit;
      });
    },
    async getBarcodeList() {
      this.loadingBarcode = true;
      this.rowsBarcode = [];
      try {
        if (this.stockCard.id) {
          const response = await this.$api.get(
            "getStockCardBarcode/" + this.stockCard.id
          );
          this.rowsBarcode = response?.data;
          this.defaultBarcode = this.rowsBarcode.find((b) => b.default == true);
          var _stockCode = {};
          _stockCode.id = 0;
          _stockCode.barcode = this.stockCard.stockCode;
          this.rowsBarcode.push(_stockCode);
          this.loadingBarcode = false;
        }
      } catch (error) {
        this.$logger.log(error);
      }
    },

    save() {
      if (this.stockCard.stockType) {
        this.stockCard.stockTypeId = this.stockCard.stockType.id;
      } else {
        this.showNotify(
          "danger",
          "red",
          "Stok Tipi Seçilmeli",
          "Ürün Stok Tipi Seçilmedi"
        );
        return;
      }
      if (this.stockCard.category) {
        this.stockCard.categoryId = this.stockCard.category.id;
      }

      if (this.stockCard.brand) {
        this.stockCard.brandId = this.stockCard.brand.id;
      } else {
        this.showNotify(
          "danger",
          "red",
          "Marka Seçilmeli",
          "Ürün Markası Seçilmedi"
        );
        return;
      }

      if (this.stockCard.model) {
        this.stockCard.modelId = this.stockCard.model.id;
      }

      if (this.stockCard.unit) {
        this.stockCard.unitId = this.stockCard.unit.id;
      }

      if (this.stockCard.currency) {
        this.stockCard.currencyId = this.stockCard.currency.id;
      } else {
        this.showNotify(
          "error",
          "error",
          "Para Birimi Seçilmeli",
          "Ürün Para Birimi Seçilmedi"
        );
        return;
      }

      const response = this.$api
        .put("stockCards", this.stockCard)
        .then((_response) => {
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            caption: this.$t("success"),
            message: this.$t("products.updateStockCardMsg"),
          });
        });
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
    saveBarcode() {
      this.$logger.log("form submitted", this.newModel);
      if (this.formMode === "add") {
        this.$logger.log("add");
        this.addstockCard();
      } else if (this.formMode === "edit") {
        this.$logger.log("edit");
        this.editstockCard();
      }
    },
    async addBarcode() {
      const _response = this.$api
        .post("stockBarcodes", JSON.stringify(this.newModel))
        .then((response) => {
          this.resp = response.data;
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
          this.getBarcodeList();
        });
    },
    async editBarcode() {
      const response = this.$api
        .put("stockBarcodes", JSON.stringify(this.newModel))
        .then((_response) => {
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
          this.getBarcodeList();
        });
    },
    async onAddBarcode() {
      if (!this.stockCard.id) {
        this.alert();
        return;
      }
      this.maximizedToggle = false;
      this.currentRowBarcode = {};
      this.currentRowBarcode.stockCardId = this.stockCard.id;
      this.currentRowBarcode.barcode = "";
      this.formMode = "add";
      this.stockBarcodeFormVisibile = true;
    },
    async onEditBarcode(row) {
      this.currentRowBarcode = row;
      this.stockBarcodeFormVisibile = true;
      this.formMode = "edit";
    },

    async onDeleteBarcode(_row) {
      this.currentRowBarcode = _row;
      this.barcodeDeleteConfirm = true;
    },
    async onDeleteBarcodeConfirm() {
      try {
        const response = await this.$api.delete(
          "stockBarcodes/" + this.currentRowBarcode.id
        );
        this.getBarcodeList();
        this.barcodeDeleteConfirm = false;
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async movementSelected() {
      //this.$logger.log(this.stockMovement.movement);
    },
    async stockInOutSave() {
      try {
        const Stock = {
          stockIn: 1,
          stockOut: -1,
          stocktaking: 0,
        };
        this.stockMovement.stockCardId = this.stockCard.id;
        this.stockMovement.movement = Stock[this.stockMovement.movement];
        this.$logger.log("stockMovement", this.stockMovement);
        const _response = this.$api
          .post("postStockUpdate", this.stockMovement)
          .then((response) => {
            this.resp = response.data;
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: this.$t("success"),
              caption: this.$t("success"),
            });
          });
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async printLabel() {
      var labelScriptDetail = {};
      labelScriptDetail.barcodeType = "warehouseStock";
      labelScriptDetail.barcode = this.defaultBarcode.barcode;
      labelScriptDetail.stockCardName = this.stockCard.stockName;
      labelScriptDetail.piece = this.printBarcode.quantity;

      this.$logger.log("labelScriptDetail", labelScriptDetail);
      this.$logger.log(
        "this.printBarcode.quantity",
        this.printBarcode.quantity
      );
      const _response = this.$api
        .post("printLabel", labelScriptDetail)
        .then((response) => {
          this.$logger.log("printLabel", response);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("production.printedLabel"),
            caption: this.$t("success"),
          });
        });
    },
  },
});
</script>
