<template>
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("offer.offerInfo") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-select
                  autofocus
                  use-input
                  ref="selectFirm"
                  :disable="mode === 'details' || !authorityToChange"
                  outlined
                  v-model="formModel.firm"
                  option-value="id"
                  option-label="value"
                  :options="firmFiltered"
                  @filter="filterFirm"
                  :label="$t('order.orderfirm')"
                  @update:model-value="(val) => firmSelected(val)"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-input
                  :disable="mode === 'details' || !authorityToChange"
                  :label="$t('order.title')"
                  v-model="formModel.title"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-3 col-md-3 col-sm-10 col-xs-10">
              <q-item-section v-if="formModel">
                <q-input
                  ref="orderNo"
                  disable
                  :label="$t('offer.offerNo')"
                  v-model="formModel.offerNo"
                  :rules="[(val) => !!val || 'Field is required']"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-1 col-md-1 col-sm-2 col-xs-2">
              <q-item-section v-if="formModel.offerNo">
                <q-btn
                  flat
                  round
                  color="black"
                  icon="copy_all"
                  @click="copyClipBoard(formModel.offerNo)"
                >
                  <q-tooltip> {{ $t("copy") }}</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <q-item-section v-if="formModel">
                <q-select
                  use-input
                  outlined
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.paymentTerm"
                  option-value="id"
                  option-label="name"
                  :label="$t('order.paymentterm')"
                  :options="paymentTermFiltered"
                  @filter="filterPaymentTerm"
                  @update:model-value="(val) => paymentTermChange(val)"
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
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <q-item-section v-if="formModel">
                <q-select
                  use-input
                  outlined
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.paymentType"
                  option-value="id"
                  option-label="value"
                  :options="paymentTypes"
                  :label="$t('order.paymenttype')"
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
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-input
                  v-model="formModel.offerDate"
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('offer.offerDate')"
                  @change="dateChange"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-input
                  v-model="formModel.expiryDate"
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('offer.expiryDate')"
                  @change="dateChange"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-input
                  v-model="formModel.dispatchDate"
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('offer.deadline')"
                  @change="dateChange"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel">
                <q-select
                  use-input
                  outlined
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.offerStatus"
                  option-value="id"
                  option-label="status"
                  :label="$t('order.status')"
                  :options="offerStatusFiltered"
                  @filter="filterOfferStatus"
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

            <q-separator />
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  outlined
                  rows="2"
                  :disable="mode === 'details'"
                  :label="$t('firm.detail')"
                  v-model="formModel.description"
                  type="textarea"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-separator />
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("firm.addressinfo") }}</div>
        </q-card-section>
        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.address.country.name"
                  option-value="id"
                  option-label="countryName"
                  :options="countriesFiltered"
                  @filter="filterCountries"
                  :label="$t('firm.country')"
                  @update:model-value="(val) => countrySelected(val)"
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
                  v-model="formModel.address.city.name"
                  option-value="id"
                  option-label="cityName"
                  :options="citiesFiltered"
                  @filter="filterCities"
                  :label="$t('firm.city')"
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
                  v-model="formModel.address.district.name"
                  option-value="id"
                  option-label="name"
                  :options="districtsFiltered"
                  @filter="filterDistricts"
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
                  v-model="formModel.address.postalCode"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.shippinganddispatchaddressinfo')"
                  v-model="formModel.address.addressDetail"
                  type="textarea"
                  rows="5"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("order.exchangerate") }}</div>
        </q-card-section>

        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  v-model="formModel.exchangeDate"
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('order.exchangeDate')"
                  @change="
                    oncekiIkiGunHaftaSonuKontrol(formModel.exchangeDate),
                      tutarBilgileri()
                  "
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
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
                  @update:model-value="(val) => getExchangeWithCurrency(val)"
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
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  option-value="id"
                  option-label="name"
                  v-model="currencyValue"
                  :options="formModel.currencyValue"
                  :label="$t('firm.currencyValue')"
                  @update:model-value="(val) => setExchange(val)"
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
            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="exchanges.code"
                  v-model="formModel.exchangeRate"
                  @change="tutarBilgileri()"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section class="bg-primary text-white">
          <div>{{ $t("order.invoicepriceinfo") }}</div>
        </q-card-section>

        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  disable
                  :label="$t('order.subtotal')"
                  v-model="dovizliaraToplam"
                  prefix="₺ "
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  disable
                  :label="$t('order.taxtotal')"
                  v-model="dovizlikdvToplam"
                  prefix="₺ "
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  disable
                  :label="$t('order.grandtotal')"
                  v-model="dovizligenelToplam"
                  prefix="₺ "
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("order.priceinfo") }}</div>
        </q-card-section>

        <q-card-section>
          <q-list v-if="formModel" class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section v-if="formModel.currency">
                <q-input
                  disable
                  :label="$t('order.subtotal')"
                  v-model="araToplam"
                  :prefix="formModel.currency.symbol"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section v-if="formModel.currency">
                <q-input
                  disable
                  :label="$t('order.taxtotal')"
                  v-model="kdvToplam"
                  :prefix="formModel.currency.symbol"
                />
              </q-item-section>
            </q-item>

            <!-- Fatura İskonto -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('order.orderDiscount')"
                  type="number"
                  v-model="formModel.discount"
                  :value="0"
                  :min="0"
                  v-on:keyup="calcFaturaIskontoYuzde"
                  @change="calcFaturaIskontoYuzde"
                  :prefix="formModel.currency.symbol"
                />
              </q-item-section>
            </q-item>

            <!-- Fatura İskonto %-->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  type="number"
                  :label="$t('order.discountpercent')"
                  v-model="formModel.discountPercent"
                  :value="0"
                  :min="0"
                  v-on:keyup="calcFaturaIskonto"
                  @change="calcFaturaIskonto"
                />
              </q-item-section>
            </q-item>

            <!-- Toplam Ürün İskonto -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  disable
                  :label="$t('order.productTotalDiscount')"
                  type="number"
                  v-model="iskontoToplam"
                  :value="0"
                  v-on:keyup="calcFaturaIskontoYuzde"
                  @change="calcFaturaIskontoYuzde"
                  :prefix="formModel.currency.symbol"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section v-if="formModel.currency">
                <q-input
                  disable
                  type="number"
                  decimal=","
                  thousands="."
                  :prefix="formModel.currency.symbol"
                  precision="2"
                  :label="$t('order.grandtotal')"
                  v-model="genelToplam"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("products.products") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-list class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item>
              <q-item-section>
                <q-table
                  dense
                  flat
                  bordered
                  :grid="isGrid"
                  :hide-header="isGrid"
                  class="statement-table"
                  :rows="rows"
                  :columns="columns"
                  :loading="loading"
                  :filter="filter"
                  :pagination="pagination"
                  :loading-label="$t('loading')"
                  :no-data-label="$t('nodatalabel')"
                  :no-results-label="$t('noresultslabel')"
                  row-key="id"
                  @row-dblclick="onRowDoubleClick"
                  :selected-rows-label="getSelectedString"
                  selection="multiple"
                  v-model:selected="selected"
                >
                  <!--<template v-slot:body-cell="props">
                    <q-td :props="props">
                      {{ props.value }}
                    </q-td>
                    <q-menu touch-position context-menu>
                      <q-list dense style="min-width: 100px">
                        <q-item clickable v-close-popup>
                          <q-item-section @click="addSerialNo(props.row)">
                            {{ $t("order.serialNoAdd") }}
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </template>-->
                  <template v-slot:top="props">
                    <div class="row col-12">
                      <div
                        class="col-lg-2 col-md-3 col-sm-12 col-xs-12 q-table__title"
                      >
                        {{ $t("pages.products") }}
                      </div>
                      <q-input
                        class="col-lg-2 col-md-3 col-sm-12 col-xs-12"
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
                        icon="add"
                        class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                        :disable="!formModel.id || !authorityToChange"
                        @click="onAdd"
                      >
                        <q-tooltip>
                          {{
                            !formModel.id
                              ? $t("order.firstSaveTheOrder")
                              : $t("add")
                          }}
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        dense
                        icon="refresh"
                        class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                        @click="getOfferItems()"
                      >
                        <q-tooltip>
                          {{ $t("refresh") }}
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        dense
                        :icon="
                          props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                        "
                        @click="props.toggleFullscreen"
                        class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                      />
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

                  <template v-slot:body-cell-dispatchDate="props">
                    <q-td :props="props">
                      <q-input
                        dense
                        v-model="props.row.dispatchDate"
                        type="date"
                        @update:model-value="
                          editOfferItemDispacheDate(props.row)
                        "
                      />
                    </q-td>
                  </template>
                  <template #body-cell-status="props">
                    <q-td :props="props">
                      <q-chip
                        :color="props.row.isActive === true ? 'green' : 'red'"
                        text-color="white"
                        dense
                        class="text-weight-bolder"
                        square
                        >{{
                          props.row.isActive ? $t("active") : $t("inactive")
                        }}
                      </q-chip>
                    </q-td>
                  </template>

                  <template #body-cell-action="props">
                    <q-td :props="props">
                      <!--<q-btn
                        flat
                        round
                        color="primary"
                        icon="info"
                        @click="onView(props.row)"
                      />-->
                      <q-btn
                        :disable="!authorityToChange"
                        flat
                        round
                        color="secondary"
                        icon="edit"
                        @click="onEdit(props.row)"
                      />
                      <q-btn
                        :disable="!authorityToChange"
                        flat
                        round
                        color="negative"
                        icon="delete_forever"
                        @click="onDelete(props.row)"
                      />
                    </q-td>
                  </template>

                  <template v-slot:body-selection="props">
                    <!--TODO: Fatura süreci tamamlandığında aşağıdaki özellik eklenecek,-->
                    <!--:disable="props.row.quantity == props.row.shippedQuantity"-->
                    <q-checkbox v-model="props.selected" />
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
                                :color="
                                  props.row.isActive === true ? 'green' : 'red'
                                "
                                text-color="white"
                                dense
                                class="text-weight-bolder"
                                square
                                >{{
                                  props.row.isActive
                                    ? $t("active")
                                    : $t("inactive")
                                }}
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
                                    @click="onDelete(props.row)"
                                  />
                                </div>
                              </q-item-section>

                              <q-item-section
                                v-else-if="col.name === 'selected'"
                                class="row"
                              >
                                <q-toggle v-model="props.selected" />
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
                      <q-icon
                        size="2em"
                        :name="filter ? 'filter_b_and_w' : icon"
                      />
                      <span> {{ message }}... </span>
                    </div>
                  </template>
                </q-table>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-actions>
      </q-card>
    </div>

    <div class="q-pa-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-pa-md">
        <q-card-actions>
          <q-space />
          <q-btn-toggle
            class="q-mr-xl"
            v-model="formModel.offerType"
            push
            rounded
            toggle-color="blue-grey"
            :options="[
              { value: 0, slot: 'purchase' },
              { value: 1, slot: 'sell' },
            ]"
          >
            <template v-slot:purchase>
              <div class="row items-center no-wrap">
                <q-icon color="grey-1" left name="arrow_downward" />
                <div class="text-center">{{ $t("pages.purchase") }}</div>
              </div>
            </template>

            <template v-slot:sell>
              <div class="row items-center no-wrap">
                <div class="text-center">{{ $t("pages.sell") }}</div>
                <q-icon color="grey-1" right name="arrow_upward" />
              </div>
            </template>
          </q-btn-toggle>
          <q-btn
            v-if="formModel.offerType == 1"
            color="secondary"
            :label="$t('offer.createPurchaseOffer')"
            icon-right="add_circle_outline"
            text-color="white"
            :loading="saveLoading"
            class="text-capitalize q-pa-md q-mx-xl"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="createPurchaseOffer"
          >
          </q-btn>
          <q-btn
            color="primary"
            :label="$t('offer.createSellOfferForm')"
            icon-right="email"
            text-color="white"
            class="text-capitalize q-pa-md q-mx-xl"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="createOfferFormDocument"
          >
          </q-btn>
          <q-btn
            color="primary"
            :label="$t('order.createSellOrderForm')"
            icon-right="email"
            text-color="white"
            class="text-capitalize q-pa-md q-mx-xl"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="createOrderFormDocument"
          >
          </q-btn>
          <q-btn
            color="secondary"
            :label="saved ? $t('updatedata') : $t('savedata')"
            icon-right="send"
            text-color="white"
            :loading="saveLoading"
            class="text-capitalize q-pa-md q-mx-xl"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="save"
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <!-- Offer Detail Dialog -->
    <q-dialog
      v-model="OfferDetailFormVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 80vw; max-height: 90vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("order.order") }}</span>
              {{ $t(currentMode) }}</q-toolbar-title
            >

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 84vh" class="scroll q-pa-none">
          <offer-detail-form
            class="q-ma-none q-pa-none"
            v-model="currentRow"
            :mode="currentMode"
            @addcompleted="addOfferItem"
            @editcompleted="editOfferItem"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Offer Form Dialog -->
    <q-dialog
      v-model="newOfferFormVisible"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 80vw; max-height: 95vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("offer.offer") }}</span>
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
          <offer-to-offer-form
            class="q-ma-none q-pa-none"
            v-model="newOffer"
            mode="add"
            @completed="onFormCompleted"
            @offerListRefresh="getOfferItems"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Delete Dialog -->
    <q-dialog v-model="deleteConfirm" persistent>
      <q-card class="q-pa-md">
        <q-card-section class="items-center row">
          <q-avatar
            icon="person_off"
            color="negative"
            text-color="white"
          />&nbsp; &nbsp; &nbsp; &nbsp;
          <h5>{{ $t("products.deleteconfirm") }}</h5>
        </q-card-section>
        <q-card-section class="items-center row">
          <p>{{ currentRow.stockCard.stockName }}</p>
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
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar, date, LocalStorage } from "quasar";
import OfferDetailForm from "src/components/forms/OfferDetailForm.vue";
import OfferToOfferForm from "src/components/forms/OfferToOfferForm.vue";
import numeral from "numeral";
import "numeral/locales/tr";
import "numeral/locales/en-au";
import "numeral/locales/de";

export default defineComponent({
  name: "OfferForm",
  components: {
    OfferDetailForm,
    OfferToOfferForm,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    var formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode == "add") {
      formModel.value.address = {};
      formModel.value.address.city = { id: 0, name: "Seç" };
      formModel.value.address.country = { id: 0, name: "Seç" };
      formModel.value.address.district = { id: 0, name: "Seç" };
      formModel.value.employee = {};
      formModel.value.exchangeRate = ""; //this.formModel.order.currency.symbol
      formModel.value.currency = {};
      formModel.value.discount = 0;
      formModel.value.discountPercent = 0;

      formModel.value.firm = { id: 0, value: "Seç" };
      formModel.value.firm.paymentTerm = { id: 0, value: "Seç" };
      formModel.value.offerStatus = {};
      formModel.value.paymentTerm = { id: 0, value: "Seç" };
      formModel.value.currency = { id: 0, name: "Dolar" };
      formModel.value.offerItems = [];
      formModel.value.dispatchDate = date.formatDate(Date(), "YYYY-MM-DD");
      formModel.value.offerDate = date.formatDate(Date(), "YYYY-MM-DD");
      formModel.value.expiryDate = date.formatDate(Date(), "YYYY-MM-DD");

      // Bugünkü tarihi al
      var today = new Date();
      // Bir gün çıkararak dünün tarihini al
      var yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      formModel.value.exchangeDate = date.formatDate(yesterday, "YYYY-MM-DD");
    } else {
      formModel.value.firm.value = `${formModel.value.firm.firmCode} - ${formModel.value.firm.commercialTitle}`;
      formModel.value.exchangeDate = date.formatDate(
        formModel.value.exchangeDate,
        "YYYY-MM-DD"
      );
    }
    return {
      formModel,
    };
  },

  computed: {
    columns() {
      return [
        {
          name: "stockcode",
          label: this.$t("products.stockcode"),
          align: "left",
          field: (row) => row.stockCard.stockCode,
          sortable: true,
        },
        {
          name: "productname",
          label: this.$t("products.productname"),
          align: "left",
          field: (row) => row.stockCard.stockName,
          sortable: true,
        },
        {
          name: "piece",
          label: this.$t("products.piece"),
          align: "center",
          field: (row) => row.quantity,
          sortable: true,
        },
        {
          name: "price",
          label: this.$t("products.price"),
          align: "center",
          field: (row) =>
            numeral(row.price).format("0,0[.]00 ") +
            " " +
            this.formModel.currency.symbol,
          sortable: true,
        },
        {
          name: "discount",
          label: this.$t("order.orderDiscount"),
          align: "center",
          field: (row) => row.discount + " " + this.formModel.currency.symbol,
          sortable: true,
        },
        {
          name: "discountpercent",
          label: this.$t("order.discountpercent"),
          align: "center",
          field: (row) => row.discountPercent + " %",
          sortable: true,
        },
        {
          name: "unitamount",
          label: this.$t("order.unitamount"),
          align: "center",
          field: (row) =>
            numeral(row.unitAmount).format("0,0[.]00 ") +
            " " +
            this.formModel.currency.symbol,
          sortable: true,
        },
        {
          name: "vatrate",
          label: this.$t("order.vatrate"),
          align: "center",
          field: (row) => row.vatRate + " %",
          sortable: true,
        },
        {
          name: "total",
          label: this.$t("order.subtotal"),
          align: "center",
          field: (row) =>
            numeral(row.unitAmount * row.quantity).format("0,0[.]00 ") +
            " " +
            this.formModel.currency.symbol,
          sortable: true,
        },
        {
          name: "grandtotal",
          label: this.$t("order.grandtotal"),
          align: "center",
          field: (row) =>
            numeral(
              row.unitAmount * row.quantity * (1 + row.vatRate * 0.01)
            ).format("0,0[.]00 ") + this.formModel.currency.symbol, //TODO: kendi para birimine çevirilecek
        },
        {
          name: "dispatchDate",
          label: this.$t("order.dispatchdate"),
          align: "center",
          format: (val) => date.formatDate(val, "DD.MM.YYYY"),
          field: (row) => date.formatDate(row.dispatchDate, "DD.MM.YYYY"),
          field: "dispatchDate",
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
    moneyFormatForDirective: {
      decimal: ".",
      thousands: ",",
      prefix: "$ ",
      suffix: " #",
      precision: 2,
      masked: false /* doesn't work with directive */,
    },
  },
  data() {
    return {
      newOffer: {},
      newOfferFormVisible: false,
      OfferDetailFormVisible: false,
      ProductionPlanningFormVisible: false,
      WaybillFormVisible: false,
      InvoiceFormVisible: false,
      ManuelInvoiceFormVisible: false,
      waybillModel: {},
      invoiceModel: {},

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

      //Q-Select
      firmFiltered: [],
      firmFull: [],
      paymentTermFiltered: [],
      paymentTermFull: [],
      offerStatusFiltered: [],
      offerStatusFull: [],
      countriesFull: [],
      countriesFiltered: [],
      citiesFull: [],
      citiesFiltered: [],
      districtsFull: [],
      districtFiltered: [],
      currenciesFull: [],
      currenciesFiltered: [],
      currencyValue: { id: 0, name: "Kur Seç" },
      currencyValueFiltered: [],
      currencyValueFull: [],

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
      offerpaymentTermRule: [
        (val) => (val !== null && val.value !== "Seç") || "Ödeme Vadesi Seç",
      ],

      //Exchange
      exchangeDate: date.formatDate(Date(), "YYYY-MM-DD"),
      exchanges: {},
      paymentTypes: [],

      saveLoading: false,
      saved: false,

      AddSerialNoFormVisible: false,
      selected: [],
      pagination: {
        rowsPerPage: 20,
      },

      fabWaybill: false,
      offerId: 0,
      userinfo: {},
      authorityToChange: false,
    };
  },
  emits: ["completed"],
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
    this.$logger.log("mode: ", this.formMode);
    this.offerId = this.formModel.id;
    this.init();
    document.title = "Magicline - Offers";
  },
  methods: {
    dateChange(data) {
      this.$logger.log(data);
      this.$logger.log(this.formModel.offerDate);
    },
    async init() {
      //this.$logger.log("__form model__", this.formModel);
      this.userinfo = LocalStorage.getItem("userinfo");
      this.$logger.log("user info", this.userinfo);
      this.getFirm();
      this.getPaymentTerm();
      this.getOfferStatus();
      this.getCountries();
      this.getCities();
      this.getDistricts();
      this.getCurrency();
      this.getPaymentType();
      this.employeeControl();

      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}

      if (this.formModel.id)
        this.rows = this.formModel.offerItems.map((oi) => {
          oi.dispatchDate = date.formatDate(oi.dispatchDate, "YYYY-MM-DD");
          return oi;
        }); //this.getOrderItems();

      this.$logger.log("rows", this.rows);
      if (this.currentMode !== "add") {
        this.getExchangeWithCurrency({ shortName: "USD" });
        this.formModel.offerType = parseInt(this.$route.params.offerType);
        this.$logger.log("offerType", this.formModel.offerType);

        this.formModel.offerDate = date.formatDate(
          Date(this.formModel.offerDate) || Date(),
          "YYYY-MM-DD"
        );
        this.formModel.dispatchDate = date.formatDate(
          Date(this.formModel.dispatchDate) || Date(),
          "YYYY-MM-DD"
        );
        this.formModel.exchangeDate = date.formatDate(
          Date(this.formModel.exchangeDate) || Date(),
          "YYYY-MM-DD"
        );
        this.formModel.expiryDate = date.formatDate(
          Date(this.formModel.expiryDate) || Date(),
          "YYYY-MM-DD"
        );
      }
      if (this.mode !== "add") this.saved = true;

      //selectFirm inputa focus
      this.$nextTick(() => {
        this.$refs.selectFirm.focus();
      });
    },

    async createOfferFormDocument() {
      try {
        this.$api
          .put("createOfferDocument", this.formModel, { responseType: "blob" })
          .then((resp) => {
            this.$logger.log("createOfferFormDocument", resp);
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              `Purchase_Offer_${this.formModel.offerNo}.docx`
            ); // İndirilecek dosyanın adı
            document.body.appendChild(link);
            link.click();
            this.$q.notify({
              color: "positive",
              icon: "check",
              message: this.$t("offer.offerFormCreated"),
            });
          });
      } catch (error) {
        this.$logger.log("createOfferFormDocument", error);
      }
    },

    async createOrderFormDocument() {
      try {
        this.$api
          .put("createOrderDocument", this.formModel, { responseType: "blob" })
          .then((resp) => {
            this.$logger.log("createOrderFormDocument", resp);
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              `Purchase_Order_${this.formModel.offerNo}.docx`
            ); // İndirilecek dosyanın adı
            document.body.appendChild(link);
            link.click();
            this.$q.notify({
              color: "positive",
              icon: "check",
              message: this.$t("order.orderFormCreated"),
            });
          });
      } catch (error) {
        this.$logger.log("createOrderFormDocument", error);
      }
    },
    updateDispatchDate(row) {
      try {
        this.$logger.log("updateDispatchDate", row);
        //this.formModel.order.dispatchDate = row.dispatchDate;
      } catch (error) {
        this.$logger.log("updateDispatchDate", error);
      }
    },

    paymentTermChange(data) {
      this.$logger.log("pt => ", data);
    },
    onSubmit() {},

    buysellType(offerType) {
      switch (offerType) {
        case 0:
          return "Alış";
        case 1:
          return "Satış";
        default:
          return "Belirtilmemiş";
      }
    },
    async save() {
      this.saveLoading = true;
      this.formModel.isActive = true;
      this.formModel.addressId = this.formModel.address.id;
      //this.formModel.order.employeeId = userinfo.id;
      this.formModel.paymentTypeId = this.formModel.firm.paymentTypeId;
      this.formModel.paymentTermId = this.formModel.paymentTerm.id;
      this.formModel.offerStatusId = this.formModel.offerStatus.id;
      this.formModel.currencyId = this.formModel.currency.id;
      this.formModel.discount == "" ? 0 : this.formModel.discount;
      this.formModel.discountPercent == "" ? 0 : this.formModel.discountPercent;
      this.formModel.subTotal = this.araToplam;
      this.formModel.vatTotal = this.kdvToplam;

      this.formModel.grandTotal = this.genelToplam;
      if (this.mode === "add") {
        this.formModel.employeeId = this.userinfo.id;
        this.$logger.log("add");
        if (this.saved === true) {
          this.$logger.log("update");
          this.editFormModel();
        } else {
          this.addFormModel();
        }
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },
    async formOfferRefresh() {
      this.loading = true;
      const offerUpdate = await this.$api
        .get("getOfferById/" + this.formModel.id)
        .then((resp) => {
          //this.formModel = resp?.data;
          this.formModel.offerItems = resp?.data.offerItems;
          //this.formModel.firm.value = `${this.formModel.firm.firmCode} - ${this.formModel.firm.commercialTitle}`;
          /*this.formModel.offerDate = date.formatDate(
            Date(this.formModel.offerDate),
            "DD-MM-YYYY"
          );
          this.formModel.dispatchDate = date.formatDate(
            Date(this.formModel.dispatchDate),
            "YYYY-MM-DD"
          );
          this.formModel.exchangeDate = date.formatDate(
            Date(this.formModel.exchangeDate) || Date(),
            "YYYY-MM-DD"
          );
          this.formModel.expiryDate = date.formatDate(
            Date(this.formModel.expiryDate) || Date(),
            "YYYY-MM-DD"
          );*/
          this.rows = this.formModel.offerItems.map((oi) => {
            oi.dispatchDate = date.formatDate(oi.dispatchDate, "YYYY-MM-DD");
            return oi;
          });
          this.selected = this.rows.filter((oi) => {
            return oi.quantity > (oi.shippedQuantity || 0);
          });
          this.loading = false;
        });
    },
    async copyClipBoard(_copyText) {
      try {
        //TODO: çalışmıyor
        this.$refs.offerNo.focus();
        var copyed = document.execCommand("copy");
      } catch (err) {
        this.$logger.error("Panoya kopyalama başarısız:", err);
      }
    },

    async dateFormatYYYY(date) {
      return date.formatDate(Date(date) || Date(), "YYYY-MM-DD");
    },

    getSelectedString() {
      return this.selected.length === 0
        ? ""
        : `${this.rows.length} üründen ${this.selected.length} adet seçildi`;
    },
    async getOfferItems() {
      this.loading = true;
      const _orderItems = await this.$api
        .get("getOfferItems/" + this.offerId)
        .then((resp) => {
          this.formModel.offerItems = resp?.data;
          this.rows = this.formModel.offerItems.map((oi) => {
            oi.dispatchDate = date.formatDate(oi.dispatchDate, "YYYY-MM-DD");
            return oi;
          });
          this.selected = this.rows.filter((oi) => {
            return oi.quantity > (oi.shippedQuantity || 0);
          });
          this.loading = false;
          //this.$logger.log("rows : ", this.rows);
        });
      try {
        if (this.offerId) {
          this.formModel.offerDate = date.formatDate(
            this.formModel.offerDate,
            "DD-MM-YYYY"
          );
          this.formModel.dispatchDate = date.formatDate(
            this.formModel.dispatchDate,
            "YYYY-MM-DD"
          );
          this.formModel.exchangeDate = date.formatDate(
            this.formModel.exchangeDate || Date(),
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
      this.$logger.log("Form Model", this.formModel);
      this.postOfferToDb();

      this.saveLoading = false;
    },
    async postOfferToDb() {
      try {
        const response = this.$api
          .post("postOffer/", this.formModel)
          .then((_response) => {
            this.saved = true;
            this.$logger.log("postOffer/", _response);
            this.formModel.id = _response.data.id;
            this.formModel.offerNo = _response.data.offerNo;
            this.offerId = _response.data.id;

            this.formOfferRefresh();
            this.$emit("offerListRefresh");
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: "Sipariş Oluşturuldu" /*this.$t("success")*/,
              caption: this.$t("success"),
            });
          });
      } catch (error) {
        this.$logger.log("Post Offer Error=>", error);
      }
    },

    async editFormModel() {
      //this.formModel.order.exchangeRate = this.exchangeRate;
      this.$logger.log("editFormModel", this.formModel);
      //this.formModel.order.id = this.waybillModel.orderId;
      const response = this.$api
        .put("offers", this.formModel)
        .then((_response) => {
          this.$logger.log("offers", _response.data);
          //this.$logger.log("edit completed");

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: "Sipariş Güncellendi" /*this.$t("success")*/,
            caption: this.$t("success"),
          });
          //this.$emit('completed');
          this.saveLoading = false;
          this.formOfferRefresh();
          //this.$emit("offerListRefresh");
        });
    },
    parseDate(date) {
      var parcalar = date.split("-");
      var day = parcalar[2]; // Gün kısmını alır ve ondalık sayıya çevirir
      var month = parcalar[1]; // Ay kısmını alır ve ondalık sayıya çevirir
      var year = parcalar[0]; // Yıl kısmını alır ve ondalık sayıya çevirir

      return { day, month, year };
    },
    oncekiIkiGunHaftaSonuKontrol(tarihStr) {
      var tarih = new Date(tarihStr);
      var oncekiGun = new Date(tarih);
      var haftaGunu = oncekiGun.getDay(); // Haftanın gününü alır (0: Pazar, 1: Pazartesi, ..., 6: Cumartesi)

      if (haftaGunu === 0) {
        // Eğer tarih Pazar ise
        oncekiGun.setDate(oncekiGun.getDate() - 2); // 2 gün öncesini seç
      } else if (haftaGunu === 6) {
        // Eğer tarih Cumartesi ise
        oncekiGun.setDate(oncekiGun.getDate() - 1); // 1 gün öncesini seç
      }
      this.formModel.exchangeDate = date.formatDate(oncekiGun, "YYYY-MM-DD");
      this.$logger.log("exchange date....:", this.formModel.exchangeDate);
      this.currencyValue = {
        id: 0,
        name: "Kur Seçin",
      };
      this.getExchangeWithCurrency(this.formModel.currency);
      //this.tutarBilgileri();
    },
    sameDateControl(val) {
      // Get today's date
      var today = new Date();

      // Create the date to compare
      var compareDate = new Date(val);

      // Compare the dates
      if (
        today.getFullYear() === compareDate.getFullYear() &&
        today.getMonth() === compareDate.getMonth() &&
        today.getDate() === compareDate.getDate()
      ) {
        return true;
      } else {
        return false;
      }
    },
    async setExchange(currency) {
      this.formModel.exchangeRate = currency.value;
      this.tutarBilgileri();
    },
    async getExchangeWithCurrency(val) {
      //this.$logger.log("changedd", val, this.formModel.order.exchangeDate);
      this.formModel.exchangeRate = null;
      this.formModel.currencyValue = null;
      if (val.shortName == "TRY") {
        this.currencyValue = {
          id: 5,
          name: "Lütfen para birimini döviz cinsinden seçin",
        };
        return;
      }
      if (
        this.formModel.exchangeDate &&
        !this.sameDateControl(this.formModel.exchangeDate)
      ) {
        const data = this.parseDate(this.formModel.exchangeDate);
        const body = { ...data, exchangeRate: val };
        const response = this.$api
          .post("getExchangeWithCurrency", body)
          .then((result) => {
            //this.$logger.log("result getExchangeWithCurrency", result);
            const currencyType = {
              BanknoteBuying: "Efektif Alış",
              BanknoteSelling: "Efektif Satış",
              ForexBuying: "Alış",
              ForexSelling: "Satış",
            };
            var currency = result?.data?.kod?.shortName;
            if (result?.data?.BanknoteBuying) {
              if (this.currencyValue.id == 5) {
                this.currencyValue = {
                  id: 0,
                  name: "Kur Seç",
                };
              }

              this.formModel.exchangeRate = result?.data?.BanknoteSelling;

              this.formModel.currencyValue = [
                {
                  id: 1,
                  name:
                    currencyType.ForexBuying + " " + result?.data?.ForexBuying,
                  value: result?.data?.ForexBuying,
                },
                {
                  id: 2,
                  name:
                    currencyType.ForexSelling +
                    " " +
                    result?.data?.ForexSelling,
                  value: result?.data?.ForexSelling,
                },
                {
                  id: 3,
                  name:
                    currencyType.BanknoteBuying +
                    " " +
                    result?.data?.BanknoteBuying,
                  value: result?.data?.BanknoteBuying,
                },
                {
                  id: 4,
                  name:
                    currencyType.BanknoteSelling +
                    " " +
                    result?.data?.BanknoteSelling,
                  value: result?.data?.BanknoteSelling,
                },
              ];

              this.tutarBilgileri();
            } else {
              this.formModel.exchangeRate = null;
              this.formModel.currencyValue = null;
              this.currencyValue = {
                id: 5,
                name: "Lütfen tatil günü dışınında ve geçmiş tarihli bir gün seçin",
              };
            }
          });
      } else {
        this.currencyValue = {
          id: 5,
          name: "Lütfen bugün dışında bir gün seçin",
        };
      }
    },
    async getPaymentType() {
      //this.$logger.log("paymentType init");
      this.$api.get("paymentTypes").then((data) => {
        //this.$logger.log("paymentType", data);
        this.paymentTypes = data.data;
        //if (!this.formModel.order.paymentTypes)
        //this.formModel.order.paymentTypes = this.paymentTypes[0];
      });
    },

    async getExchange(firm) {
      const response = this.$api.get("getExchange").then((data) => {
        const currency = this.currenciesFull.find(
          ({ id }) => id === firm.currencyId
        );
        this.getExchangeWithCurrency(currency);
      });
    },

    async getFirm() {
      const response = this.$api.get("firms").then((data) => {
        this.firmFull = data.data;
        this.firmFull = this.firmFull.map((f) => {
          f.value = `${f.firmCode} - ${f.commercialTitle}`;
          return f;
        });

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
        this.firmFiltered = this.firmFull.filter((v) =>
          this.$normalizeTurkishString(v.commercialTitle).includes(
            this.$normalizeTurkishString(val)
          )
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
        // this.$logger.log('getPaymentTerm', this.paymentTermFull);

        //if (!this.formModel.order.paymentTerm)
        //this.formModel.order.paymentTerm = this.paymentTermFull[0];
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

    async getOfferStatus() {
      const response = this.$api.get("offerStatuses").then((data) => {
        this.offerStatusFull = data.data.sort(
          (a, b) => a.sequence - b.sequence
        );
        // this.$logger.log('this.orderStatusFull', this.orderStatusFull);
        if (!this.formModel.offerStatus.id)
          this.formModel.offerStatus = this.offerStatusFull[0];
      });
    },

    filterOfferStatus(val, update) {
      if (val === "") {
        update(() => {
          this.offerStatusFiltered = this.offerStatusFull;
        });
        return;
      }

      update(() => {
        this.offerStatusFiltered = this.offerStatusFull.filter(
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
          this.$normalizeTurkishString(v.name).includes(
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

    async getDistricts() {
      const response = this.$api.get("districts").then((data) => {
        this.districtsFull = data.data;
      });
    },

    filterDistricts(val, update) {
      if (val === "") {
        update(() => {
          this.districtsFiltered = this.districtsFull;
        });
        return;
      }

      update(() => {
        this.districtsFiltered = this.districtsFull.filter((v) =>
          this.$normalizeTurkishString(v.name).includes(
            this.$normalizeTurkishString(val)
          )
        );
      });
    },

    async getCurrency() {
      const response = this.$api.get("currencies").then((data) => {
        //this.$logger.log("currencies", data);
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
          this.$normalizeTurkishString(v.name).includes(
            this.$normalizeTurkishString(val)
          )
        );
      });
    },

    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentRow.id = this.formModel.id;
      this.currentRow.stockCard = {};
      this.currentRow.stockCard.stockName = "Ürün Seçiniz";
      this.currentRow.stockCard.currency = {};
      this.currentRow.stockCard.currency.shortName = "";

      this.currentMode = "add";
      this.OfferDetailFormVisible = true;
    },
    onView(product) {
      this.maximizedToggle = false;
      this.currentRow = product;
      this.currentMode = "details";
      this.OfferDetailFormVisible = true;
    },
    onEdit(product) {
      this.maximizedToggle = false;
      this.currentRow = product;
      this.currentMode = "edit";
      this.OfferDetailFormVisible = true;
    },

    onRowDoubleClick(evt, row) {
      this.$logger.log("onRowDoubleClick", row);

      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.OfferDetailFormVisible = true;
    },
    onDelete(product) {
      this.currentRow = product;
      this.deleteConfirm = true;
    },
    onFormCompleted() {
      this.formVisible = false;
      this.$logger.log("form completed");
      this.getOfferItems();
    },

    async Delete() {
      try {
        this.$logger.log(this.currentRow.id);
        const response = await this.$api.delete(
          "offerItems/" + this.currentRow.id
        );
        this.getOfferItems();
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
        const response = await this.$api.get("getOffer/" + this.formModel.id);
        //this.formModel = response?.data;

        this.formModel.offerDate = date.formatDate(
          this.formModel.offerDate,
          "YYYY-MM-DD"
        );
        this.formModel.dispatchDate = date.formatDate(
          this.formModel.dispatchDate,
          "YYYY-MM-DD"
        );

        this.$logger.log("formModel 1: ", this.formModel);
        //this.formModel = this.formModel;
        this.rows = this.formModel.offerItems.map((oi) => {
          oi.dispatchDate = date.formatDate(oi.dispatchDate, "YYYY-MM-DD");
          return oi;
        });
        this.selected = this.rows.filter((oi) => {
          oi.quantity < (oi.shippedQuantity || 0);
        });
        this.$logger.log("this.rows: ", this.rows);
        this.loading = false;
        this.tutarBilgileri();
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async addOfferItem() {
      this.currentRow.dispatchDate = this.formModel.dispatchDate;
      this.currentRow.offerId = this.formModel.id;
      this.$logger.log(this.currentRow);
      const _response = this.$api
        .post("postOfferItem", JSON.stringify(this.currentRow))
        .then((response) => {
          this.$logger.log(response.data);
          this.$logger.log("add completed");
          this.OfferDetailFormVisible = false;

          this.tutarBilgileri();
          this.editFormModel();
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
        });
    },

    async editOfferItemDispacheDate(offerItem) {
      this.$logger.log("editOfferItemDispacheDate", offerItem);
      const response = this.$api
        .put("offerItems", JSON.stringify(offerItem))
        .then((_response) => {
          this.$logger.log(_response.data);
          this.$logger.log("edit completed");
          this.OfferDetailFormVisible = false;
        });
    },
    async editOfferItem() {
      this.currentRow.id = this.formModel.id;
      const response = this.$api
        .put("offerItems", JSON.stringify(this.currentRow))
        .then((_response) => {
          this.$logger.log(_response.data);
          this.$logger.log("edit completed");
          this.OfferDetailFormVisible = false;

          this.tutarBilgileri();
          this.save();
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
      /*this.$logger.log(
        "this.formModel.order.discountPercent",
        this.formModel.order.discountPercent
      );*/
      this.formModel.discount =
        this.formModel.discount == null ? this.formModel.discount : 0;
      this.formModel.discountPercent =
        this.formModel.discountPercent == null
          ? 0
          : this.formModel.discountPercent;

      /*this.$logger.log(
        "this.formModel.order.discountPercent2",
        this.formModel.order.discountPercent
      );*/

      try {
        for (let i = 0; i < this.rows.length; i++) {
          this.araToplam = (
            parseFloat(this.araToplam) +
            parseFloat(this.rows[i].unitAmount) *
              parseFloat(this.rows[i].quantity)
          ).toFixed(2);

          this.rows[i].unitsumamount =
            (this.rows[i].unitAmount +
              (this.rows[i].unitAmount * this.rows[i].vatRate) / 100) *
            this.rows[i].quantity;

          this.kdvToplam +=
            ((this.rows[i].unitAmount * this.rows[i].vatRate) / 100) *
            this.rows[i].quantity;

          this.iskontoToplam += (
            parseFloat(this.rows[i].discount) *
            parseFloat(this.rows[i].quantity)
          ).toFixed(2);

          this.dovizlikdvToplam += parseFloat(
            parseFloat(this.kdvToplam) * parseFloat(this.formModel.exchangeRate)
          ).toFixed(2);

          this.dovizliaraToplam += parseFloat(
            parseFloat(this.araToplam) * parseFloat(this.formModel.exchangeRate)
          ).toFixed(2);
          this.dovizliiskontoToplam += this.rows[i].unitAmount;
        }

        this.genelToplam = (
          parseFloat(this.araToplam) +
          parseFloat(this.kdvToplam) -
          ((parseFloat(this.araToplam) + parseFloat(this.kdvToplam)) *
            parseFloat(this.formModel.discountPercent)) /
            100
        ).toFixed(2);

        this.dovizligenelToplam = (
          parseFloat(this.genelToplam) * parseFloat(this.formModel.exchangeRate)
        ).toFixed(2);

        //TODO: para birimleri noktalı ve ondalık olarak görüntülenecek
        //this.formModel.order.discount = this.iskontoToplam;
        this.dovizlikdvToplam = parseFloat(this.dovizlikdvToplam).toFixed(2);
        this.dovizliaraToplam = parseFloat(this.dovizliaraToplam)
          .toFixed(2)
          .format("0,0[.]00 ");
        //this.dovizligenelToplam = parseFloat(this.dovizligenelToplam).toFixed(2);
        // this.$logger.log('this.araToplam', this.dovizliaraToplam);
        // this.$logger.log('this.kdvToplam', this.dovizlikdvToplam);
        // this.$logger.log('this.genelToplam', this.dovizligenelToplam);
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async calcFaturaIskontoYuzde() {
      this.$logger.log("change1");
      this.formModel.discountPercent =
        (this.formModel.discount * 100) / this.araToplam;
      this.tutarBilgileri();
    },

    async calcFaturaIskonto() {
      this.$logger.log("change2");
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
      /* TODO Siparişten Üretim oluşturma modülü eklenecek
       ** rows array ile her satır için ayrı bir üretim oluştur.
       */
      this.$logger.log("order Item => ", this.rows);
      this.ProductionPlanningFormVisible = true;
    },

    async firmSelected(val) {
      this.$logger.log(val);
      this.getExchange(val);
      this.formModel.firmId = val.id;
      this.formModel.paymentTerm = this.paymentTermFull.find(
        (pt) => pt.id == val.paymentTermId
      );
      try {
        if (!this.formModel.paymentTerm.id) {
          this.formModel.paymentTerm = this.paymentTermFull[0];
        }
      } catch (error) {
        this.formModel.paymentTerm = this.paymentTermFull[0];
      }

      this.formModel.paymentType = this.paymentTypes.find(
        (pt) => pt.id == val.paymentTypeId
      );
      if (!this.formModel.paymentType.id) {
        this.formModel.paymentType = this.paymentTypes[0];
      }

      this.formModel.currency = this.currenciesFull.find(
        (c) => c.id == val.currencyId
      );
      if (!this.formModel.currency.id) {
        this.formModel.currency = this.currenciesFull[1];
      }

      this.$logger.log("formModel", this.formModel);
      this.getFirmPostAddress(val.postAddressId);
    },
    countrySelected(val) {
      this.$logger.log("Country", val);
    },

    async employeeControl() {
      if (this.mode != "add") {
        if (this.formModel.employeeId == this.userinfo.id) {
          this.authorityToChange = true;
        } else {
          this.authorityToChange = false;
        }
        this.$logger.log("authorityToChange", this.authorityToChange);
      } else {
        this.authorityToChange = true;
      }
    },

    async createPurchaseOffer() {
      if (this.selected.length == 0) {
        this.$q.notify({
          progress: true,
          type: "warning",
          color: "warning",
          message: "Lütfen en az bir ürün seçiniz",
          caption: "Uyarı",
        });
        return;
      }
      var purchaseOfferItems = this.selected;

      this.newOffer = {
        offerType: 0,
        offerStatusId: 1,
        currencyId: this.formModel.currency.id,
        exchangeRate: this.formModel.exchangeRate,
        employeeId: this.userinfo.id,
        offerItems: purchaseOfferItems.map((oi) => {
          delete oi.id;
          return oi;
        }),
      };

      //offerItem formuu göster
      this.newOfferFormVisible = true;
    },
  },
});
</script>
