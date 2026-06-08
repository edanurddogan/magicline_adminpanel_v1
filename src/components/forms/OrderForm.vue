<template>
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("order.orderinfo") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list v-if="formModel.order" class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel.order">
                <q-select
                  autofocus
                  use-input
                  ref="selectFirm"
                  :disable="mode === 'details' || !authorityToChange"
                  outlined
                  v-model="formModel.order.firm"
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
              <q-item-section v-if="formModel.order">
                <q-input
                  :disable="mode === 'details' || !authorityToChange"
                  :label="$t('order.title')"
                  v-model="formModel.order.title"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-3 col-md-3 col-sm-10 col-xs-10">
              <q-item-section v-if="formModel.order">
                <q-input
                  ref="orderNo"
                  disable
                  :label="$t('order.orderno')"
                  v-model="formModel.order.orderNo"
                  :rules="[(val) => !!val || 'Field is required']"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-1 col-md-1 col-sm-2 col-xs-2">
              <q-item-section v-if="formModel.order.orderNo">
                <q-btn
                  flat
                  round
                  color="black"
                  icon="copy_all"
                  @click="copyClipBoard(formModel.order.orderNo)"
                >
                  <q-tooltip> {{ $t("copy") }}</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel.order">
                <q-input
                  v-model="formModel.order.orderDate"
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('order.orderdate')"
                  @change="dateChange"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel.order">
                <q-input
                  v-model="formModel.order.dispatchDate"
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('order.dispatchdate')"
                  @change="dateChange"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <q-item-section v-if="formModel.order">
                <q-select
                  use-input
                  outlined
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.order.paymentTerm"
                  option-value="id"
                  option-label="value"
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
              <q-item-section v-if="formModel.order">
                <q-select
                  use-input
                  outlined
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.order.paymentType"
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

            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel.order">
                <q-select
                  use-input
                  outlined
                  transition-show="scale"
                  transition-hide="scale"
                  input-debounce="0"
                  v-model="formModel.order.orderStatus"
                  option-value="id"
                  option-label="status"
                  :label="$t('order.status')"
                  :options="orderStatusFiltered"
                  @filter="filterOrderStatus"
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
                  v-model="formModel.order.description"
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
          <q-list v-if="formModel.order" class="row">
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.order.address.country.countryName"
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
                  v-model="formModel.order.address.city.cityName"
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
                  v-model="formModel.order.address.region.regionName"
                  option-value="id"
                  option-label="regionName"
                  :options="regionsFiltered"
                  @filter="filterRegions"
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
                  v-model="formModel.order.address.postalCode"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.shippinganddispatchaddressinfo')"
                  v-model="formModel.order.address.addressDetail"
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
          <q-list v-if="formModel.order" class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  v-model="formModel.order.exchangeDate"
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('order.exchangeDate')"
                  @change="
                    oncekiIkiGunHaftaSonuKontrol(formModel.order.exchangeDate),
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
                  v-model="formModel.order.currency"
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
                  :options="formModel.order.currencyValue"
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
                  v-model="formModel.order.exchangeRate"
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
          <q-list v-if="formModel.order" class="row">
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
          <q-list v-if="formModel.order" class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section v-if="formModel.order.currency">
                <q-input
                  disable
                  :label="$t('order.subtotal')"
                  v-model="araToplam"
                  :prefix="formModel.order.currency.symbol"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section v-if="formModel.order.currency">
                <q-input
                  disable
                  :label="$t('order.taxtotal')"
                  v-model="kdvToplam"
                  :prefix="formModel.order.currency.symbol"
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
                  v-model="formModel.order.discount"
                  :value="0"
                  :min="0"
                  v-on:keyup="calcFaturaIskontoYuzde"
                  @change="calcFaturaIskontoYuzde"
                  :prefix="formModel.order.currency.symbol"
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
                  v-model="formModel.order.discountPercent"
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
                  :prefix="formModel.order.currency.symbol"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section v-if="formModel.order.currency">
                <q-input
                  disable
                  type="number"
                  decimal=","
                  thousands="."
                  :prefix="formModel.order.currency.symbol"
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
                        :disable="!formModel.order.id || !authorityToChange"
                        @click="onAdd"
                      >
                        <q-tooltip>
                          {{
                            !formModel.orderId
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
                        @click="getOrderItems()"
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
                          editOrderItemDispacheDate(props.row)
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
          <q-btn
            v-if="rows.length > 0 && formModel.order.buysell == 'Satış'"
            color="secondary"
            :label="$t('order.ordertoproduction')"
            icon-right="precision_manufacturing"
            text-color="white"
            class="text-capitalize q-pa-md q-mx-md col-lg-2 col-md-2 col-sm-2 col-xs-4"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="ordertoproduction"
          >
          </q-btn>
          <q-space />
          <!--v-if="formModel.order.orderStatus.name == 'Üretim Tamamlandı'"-->
          <!--v-if="!saved"-->
          <q-btn-toggle
            class="q-mr-xl"
            v-model="formModel.order.buysell"
            push
            rounded
            toggle-color="blue-grey"
            :options="[
              { value: 'Alış', slot: 'purchase' },
              { value: 'Satış', slot: 'sell' },
              { value: 'Fason', slot: 'outsource' },
              { value: 'Teknik Servis', slot: 'technicalService' },
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

            <template v-slot:outsource>
              <div class="row items-center no-wrap">
                <div class="text-center">
                  {{ $t("pages.outsource") }}
                </div>
                <q-icon color="grey-1" right name="u_turn_left" />
              </div>
            </template>

            <template v-slot:technicalService>
              <div class="row items-center no-wrap">
                <div class="text-center">
                  {{ $t("pages.technicalService") }}
                </div>
                <q-icon color="grey-1" right name="sync_alt" />
              </div>
            </template>
          </q-btn-toggle>
          <q-btn
            v-if="false"
            color="cyan"
            :label="$t('finance.createWaybill')"
            icon-right="local_shipping"
            text-color="white"
            class="text-capitalize q-pa-md q-mx-md"
            @click="openWaybillForm"
          >
          </q-btn>
          <q-fab
            v-if="formModel.order.orderType != 0"
            :label="$t('finance.waybillInvoice')"
            vertical-actions-align="center"
            color="primary"
            icon="keyboard_arrow_up"
            direction="up"
          >
            <q-fab-action
              v-if="formModel.orderItems.length > 0"
              color="indigo"
              @click="createManuelInvoice()"
              icon="create_new_folder"
              :label="$t('finance.createInvoice')"
            >
              <q-tooltip>
                {{ $t("finance.createManuelInvoice") }}
              </q-tooltip>
            </q-fab-action>
            <div v-if="selected && selected.length > 0">
              <q-fab-action
                color="warning"
                @click="openWaybillForm"
                icon="create_new_folder"
                :label="$t('finance.createWaybill')"
              />
            </div>
            <div
              v-if="formModel.waybills && formModel.waybills[0]?.erpWaybillId"
            >
              <q-fab
                v-for="w in formModel.waybills"
                :key="w.id"
                color="primary"
                :icon="w.invoiceCreated ? 'done_all' : 'visibility'"
                :label="w.waybillNo"
                direction="left"
              >
                <q-fab-action
                  color="primary"
                  @click="showWaybill(w)"
                  icon="visibility"
                  :label="$t('finance.showWaybill')"
                />
                <q-fab-action
                  v-if="w.invoiceCreated"
                  color="primary"
                  @click="showInvoice(w)"
                  icon="visibility"
                  :label="$t('finance.showInvoice')"
                />
                <q-fab-action
                  v-else
                  color="warning"
                  @click="createInvoice(w)"
                  icon="create_new_folder"
                  :label="$t('finance.createInvoice')"
                />
              </q-fab>
            </div>
          </q-fab>
          <q-btn
            v-if="false"
            color="secondary"
            :label="$t('finance.showWaybill')"
            icon-right="visibility"
            text-color="white"
            class="text-capitalize q-pa-md q-mx-md"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="showWaybill"
          >
          </q-btn>
          <q-btn
            v-if="false"
            color="cyan"
            :label="$t('finance.createInvoice')"
            icon-right="text_snippet"
            text-color="white"
            class="text-capitalize q-pa-md q-mx-md q-mr-xl"
            @click="createManuelInvoice()"
          >
          </q-btn>
          <q-btn
            v-if="false"
            color="secondary"
            :label="$t('finance.showInvoice')"
            icon-right="visibility"
            text-color="white"
            class="text-capitalize q-pa-md q-mx-md"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="showInvoice"
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
            :disable="!formModel.order.buysell"
            @click="save"
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <!-- Add Serial No Dialog -->
    <q-dialog
      v-model="AddSerialNoFormVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 40vw; max-height: 30vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("products.serialNo")
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
        <q-card-section style="max-height: 25vh" class="scroll q-pa-none">
          <add-serial-no-form
            class="q-ma-none q-pa-none"
            v-model="currentOrderDetail"
            :mode="currentMode"
            @addcompleted="addOrderItem"
            @editcompleted="editOrderItem"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Order Detail Dialog -->
    <q-dialog
      v-model="OrderDetailFormVisible"
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
          <order-detail-form
            class="q-ma-none q-pa-none"
            v-model="currentRow"
            :mode="currentMode"
            @addcompleted="addOrderItem"
            @editcompleted="editOrderItem"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Waybill Form -->
    <q-dialog
      v-model="WaybillFormVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 90vw; max-height: 90vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />
            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("finance.waybill") }}</span>
              {{ $t(currentMode) }}</q-toolbar-title
            >
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 80vh" class="scroll q-pa-none">
          <waybill-form
            class="q-ma-none q-pa-none"
            v-model="waybillModel"
            mode="add"
            :addwaybill="true"
            @waybillSended="waybillSended"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--Invoice Form-->
    <q-dialog
      v-model="InvoiceFormVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 90vw; max-height: 90vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />
            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("finance.invoice") }}</span>
              {{ $t(currentMode) }}</q-toolbar-title
            >
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 80vw" class="scroll q-pa-none">
          <invoice-form
            class="q-ma-none q-pa-none"
            v-model="invoiceModel"
            mode="add"
            :addInvoice="true"
            @invoiceSended="invoiceSended"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--Manuel Invoice Form-->
    <q-dialog
      v-model="ManuelInvoiceFormVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 90vw; max-height: 90vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />
            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("finance.invoice") }}</span>
              {{ $t(currentMode) }}</q-toolbar-title
            >
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 80vw" class="scroll q-pa-none">
          <invoice-form-manuel
            class="q-ma-none q-pa-none"
            v-model="invoiceModel"
            mode="add"
            :addInvoice="true"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Production Planning Dialog -->
    <q-dialog
      v-model="ProductionPlanningFormVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 99vw; height: 95vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("productionplanning")
              }}</span>
              {{ $t(productionCurrentMode) }}</q-toolbar-title
            >

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 88vh" class="scroll q-pa-none">
          <production-planning-form
            class="q-ma-none q-pa-none"
            v-model="formModel"
            :mode="productionCurrentMode"
            :orderItems="rows"
            @addcompleted="addOrderItem"
            @editcompleted="editOrderItem"
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
import OrderDetailForm from "src/components/forms/OrderDetailForm.vue";
import ProductionPlanningForm from "src/components/forms/ProductionPlanningForm.vue";
import { useQuasar, date, LocalStorage } from "quasar";
import WaybillForm from "./WaybillFormFromOrder.vue";
import InvoiceForm from "./InvoiceFormFromWaybill.vue";
import InvoiceFormManuel from "./InvoiceForm.vue";
import AddSerialNoForm from "./AddSerialNoForm.vue";
import numeral from "numeral";
import "numeral/locales/tr";
import "numeral/locales/en-au";
import "numeral/locales/de";

export default defineComponent({
  name: "OrderForm",
  components: {
    OrderDetailForm,
    ProductionPlanningForm,
    WaybillForm,
    InvoiceForm,
    AddSerialNoForm,
    InvoiceFormManuel,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    var formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode == "add") {
      formModel.value.order = {};
      formModel.value.order.address = {};
      formModel.value.order.address.city = { id: 0, cityName: "Seç" };
      formModel.value.order.address.country = { id: 0, counryName: "Seç" };
      formModel.value.order.address.region = { id: 0, regionName: "Seç" };
      formModel.value.order.employee = {};
      formModel.value.order.exchangeRate = ""; //this.formModel.order.currency.symbol
      formModel.value.order.currency = {};
      formModel.value.order.discount = 0;
      formModel.value.order.discountPercent = 0;

      formModel.value.order.firm = { id: 0, value: "Seç" };
      formModel.value.order.firm.paymentTerm = { id: 0, value: "Seç" };
      formModel.value.order.orderStatus = {};
      formModel.value.order.paymentTerm = { id: 0, value: "Seç" };
      formModel.value.order.currency = { id: 0, name: "Dolar" };
      formModel.value.orderItems = [];
      formModel.value.order.dispatchDate = date.formatDate(
        Date(),
        "YYYY-MM-DD"
      );
      formModel.value.order.orderDate = date.formatDate(Date(), "YYYY-MM-DD");

      // Bugünkü tarihi al
      var today = new Date();
      // Bir gün çıkararak dünün tarihini al
      var yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      formModel.value.order.exchangeDate = date.formatDate(
        yesterday,
        "YYYY-MM-DD"
      );
    } else {
      formModel.value.order.firm.value = `${formModel.value.order.firm.firmCode} - ${formModel.value.order.firm.commercialTitle}`;
      formModel.value.order.exchangeDate = date.formatDate(
        formModel.value.order.exchangeDate,
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
          name: "shippedQuantity",
          label: this.$t("products.shippedQuantity"),
          align: "center",
          field: (row) => row.shippedQuantity || 0,
          sortable: true,
        },
        {
          name: "price",
          label: this.$t("products.price"),
          align: "center",
          field: (row) =>
            numeral(row.price).format("0,0[.]00 ") +
            " " +
            this.formModel.order.currency.symbol,
          sortable: true,
        },
        {
          name: "discount",
          label: this.$t("order.orderDiscount"),
          align: "center",
          field: (row) =>
            row.discount + " " + this.formModel.order.currency.symbol,
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
            this.formModel.order.currency.symbol,
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
            this.formModel.order.currency.symbol,
          sortable: true,
        },
        {
          name: "grandtotal",
          label: this.$t("order.grandtotal"),
          align: "center",
          field: (row) =>
            numeral(
              row.unitAmount * row.quantity * (1 + row.vatRate * 0.01)
            ).format("0,0[.]00 ") + this.formModel.order.currency.symbol, //TODO: kendi para birimine çevirilecek
        },
        {
          name: "dispatchDate",
          label: this.$t("order.dispatchdate"),
          align: "center",
          field: "dispatchDate",
          sortable: true,
        },
        /*{
          name: "status",
          name: "status",
          align: "center",
          label: this.$t("status"),
          field: "isActive",
          sortable: true,
        },*/
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
      OrderDetailFormVisible: false,
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
      orderpaymentTermRule: [
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
      orderId: 0,
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
    this.orderId = this.formModel.order.id;
    this.init();
    document.title = "Magicline - Orders";
  },
  methods: {
    dateChange(data) {
      this.$logger.log(data);
      this.$logger.log(this.formModel.order.orderDate);
    },
    async init() {
      //this.$logger.log("__form model__", this.formModel);
      this.userinfo = LocalStorage.getItem("userinfo");
      this.$logger.log("user info", this.userinfo);
      this.getFirm();
      this.getPaymentTerm();
      this.getOrderStatus();
      this.getCountries();
      this.getCities();
      this.getRegions();
      this.getCurrency();
      this.getPaymentType();
      this.employeeControl();

      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}

      if (this.formModel.order.id) this.rows = this.formModel.order.orderItems; //this.getOrderItems();

      if (this.currentMode !== "add") {
        this.getExchangeWithCurrency({ shortName: "USD" });
        this.formModel.order.orderType = this.$route.params.orderType;
        this.formModel.order.buysell = this.buysellType(
          parseInt(this.$route.params.orderType)
        );
        this.$logger.log("orderType", this.formModel.order.orderType);
        this.$logger.log("buysell", this.formModel.order.buysell);

        this.formModel.order.orderDate = date.formatDate(
          this.formModel.order.orderDate,
          "YYYY-MM-DD"
        );
        this.formModel.order.dispatchDate = date.formatDate(
          this.formModel.order.dispatchDate,
          "YYYY-MM-DD"
        );
        this.formModel.order.exchangeDate = date.formatDate(
          this.formModel.order.exchangeDate || Date(),
          "YYYY-MM-DD"
        );
      }
      if (this.mode !== "add") this.saved = true;

      //selectFirm inputa focus
      this.$nextTick(() => {
        this.$refs.selectFirm.focus();
      });
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

    buysellType(orderType) {
      switch (orderType) {
        case 0:
          return "Alış";
        case 1:
          return "Satış";
        case 3:
          return "Fason";
        case 2:
          return "Teknik Servis";
        default:
          return "Belirtilmemiş";
      }
    },
    async save() {
      this.saveLoading = true;
      this.formModel.order.isActive = true;
      this.formModel.order.addressId = this.formModel.order.address.id;
      //this.formModel.order.employeeId = userinfo.id;
      this.formModel.order.paymentTypeId =
        this.formModel.order.firm.paymentTypeId;
      this.formModel.order.paymentTermId = this.formModel.order.paymentTerm.id;
      this.formModel.order.orderStatusId = this.formModel.order.orderStatus.id;
      this.formModel.order.currencyId = this.formModel.order.currency.id;
      this.formModel.order.orderType =
        this.formModel.order.buysell === "Alış"
          ? 0
          : this.formModel.order.buysell === "Satış"
          ? 1
          : this.formModel.order.buysell === "Teknik Servis"
          ? 2
          : this.formModel.order.buysell === "Fason"
          ? 3
          : -1;
      this.formModel.order.discount == "" ? 0 : this.formModel.order.discount;
      this.formModel.order.discountPercent == ""
        ? 0
        : this.formModel.order.discountPercent;
      this.formModel.order.subTotal = this.araToplam;
      this.formModel.order.vatTotal = this.kdvToplam;

      this.formModel.order.grandTotal = this.genelToplam;
      if (this.mode === "add") {
        this.formModel.order.employeeId = this.userinfo.id;
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
    async invoiceSended() {
      this.InvoiceFormVisible = false;
      this.formOrderRefresh();
    },
    async waybillSended() {
      this.WaybillFormVisible = false;
      this.formOrderRefresh();
    },
    async formOrderRefresh() {
      this.loading = true;
      const orderUpdate = await this.$api
        .get("getOrderById/" + this.formModel.order.id)
        .then((resp) => {
          this.formModel.order = resp?.data.order;
          this.formModel.orderItems = resp?.data.order.orderItems;
          this.formModel.invoices = resp?.data.invoices;
          this.formModel.waybills = resp?.data.waybills;
          this.rows = this.formModel.orderItems;
          this.selected = this.rows.filter((oi) => {
            return oi.quantity > (oi.shippedQuantity || 0);
          });
          this.loading = false;
          this.$emit("orderListRefresh");
          //this.$logger.log("rows : ", this.rows);
        });
      /*this.formModel.order.orderStatusId = 4;
      this.editFormModel();
      this.$logger.log("waybillSended", this.formModel.order);*/
    },
    async copyClipBoard(_copyText) {
      try {
        //TODO: çalışmıyor
        this.$refs.orderNo.focus();
        var copyed = document.execCommand("copy");
      } catch (err) {
        this.$logger.error("Panoya kopyalama başarısız:", err);
      }
    },

    async addSerialNo(orderItem) {
      this.$logger.log("addSerialNo", orderItem);

      //this.currentOrderDetail = orderItem;
      //this.AddSerialNoFormVisible = true;
    },
    //${this.rows.length}
    //this.selected.length}

    async showWaybill(waybill) {
      waybill.postAddressId = this.formModel.order.address.id;
      waybill.postAddress = this.formModel.order.address;
      waybill.firmId = this.formModel.order.firm.id;
      waybill.firm = this.formModel.order.firm;
      this.$logger.log("waybillId", waybill);
    },
    getSelectedString() {
      return this.selected.length === 0
        ? ""
        : `${this.rows.length} üründen ${this.selected.length} adet seçildi`;
    },
    async getOrderItems() {
      this.loading = true;
      const _orderItems = await this.$api
        .get("getOrderItems/" + this.orderId)
        .then((resp) => {
          this.formModel.orderItems = resp?.data;
          this.rows = this.formModel.orderItems;
          this.selected = this.rows.filter((oi) => {
            return oi.quantity > (oi.shippedQuantity || 0);
          });
          this.loading = false;
          //this.$logger.log("rows : ", this.rows);
        });
      try {
        if (this.orderId) {
          this.formModel.order.orderDate = date.formatDate(
            this.formModel.order.orderDate,
            "DD-MM-YYYY"
          );
          this.formModel.order.dispatchDate = date.formatDate(
            this.formModel.order.dispatchDate,
            "YYYY-MM-DD"
          );
          this.formModel.order.exchangeDate = date.formatDate(
            this.formModel.order.exchangeDate || Date(),
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
      this.postOrderToDb();

      this.saveLoading = false;
    },
    async postOrderToDb() {
      try {
        const response = this.$api
          .post("postOrder/", this.formModel.order)
          .then((_response) => {
            this.saved = true;
            this.$logger.log("postOrder/", _response);
            // this.$logger.log("Order Post");
            //this.postOrderUyumSoft();
            this.formModel.order.id = _response.data.id;
            this.formModel.orderId = _response.data.id;
            this.formModel.order.orderNo = _response.data.orderNo;
            this.orderId = _response.data.id;

            this.formOrderRefresh();
            this.$emit("orderListRefresh");
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: "Sipariş Oluşturuldu" /*this.$t("success")*/,
              caption: this.$t("success"),
            });
          });
      } catch (error) {
        this.$logger.log("Post Order Error=>", error);
      }
    },
    async postOrderUyumSoft() {
      try {
        const response = this.$api
          .post("insertOrder/", this.formModel)
          .then((_response) => {
            this.$logger.log(_response);
            this.$logger.log("Order Post UyumSoft");

            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message:
                "Sipariş Bilgileri Girus'a Gönderildi" /*this.$t("success")*/,
              caption: this.$t("success"),
            });
          });
      } catch (error) {
        this.$logger.log("Uyumsoft Post Order Error=>", error);
      }
    },
    async openWaybillForm() {
      //WaybillForm
      /*if (
        this.formModel.order.waybills[0] &&
        this.formModel.order.waybills[0].ewaybill
      ) {
      } else {*/
      this.WaybillFormVisible = true;
      this.waybillModel = {};
      //this.formModel.order.orderItems = this.selected;
      this.waybillModel = this.formModel.order;
      this.waybillModel.orderId = this.formModel.orderId;
      this.waybillModel.waybillDetails = this.selected;
      /*this.formModel.orderItems.filter(
          (item) => {
            return this.selected.some(
              (s) => s.stockCardId === item.stockCardId
            );
          }
        );*/
      //}
    },
    async createInvoice(w) {
      //InvoiceForm
      //seçilen waybill'daki waybillDetails'daki ürünlerin orderItemsId'sini alıp orderItems dizisindeki id'lerle eşleştirip orderItems'ı bulup invoiceModel'e atıyoruz.
      /*const invoiceSelected = this.formModel.orderItems.filter((item) => {
        return w.waybillDetails.some((s) => s.orderItemId === item.id);
      });*/

      try {
        this.$logger.log("Selected Waybill => ", w);
        const response = this.$api
          .get(`getInvoiceItemFromWaybil/${w.id}`)
          .then((_response) => {
            this.$logger.log("getInvoiceItemFromWaybil", _response);
            this.invoiceModel = {};
            this.invoiceModel = JSON.parse(
              JSON.stringify(this.formModel.order)
            );
            this.invoiceModel.invoiceDetails = _response.data;
            this.invoiceModel.currency.exchangeRate =
              this.formModel.order.exchangeRate;
            this.invoiceModel.exchangeRate = this.formModel.order.currency;
            this.invoiceModel.orderItems = w.waybillDetails;
            let exhangeDate = new Date(w.waybillDate);
            exhangeDate.setDate(exhangeDate.getDate() - 1);

            this.invoiceModel.exchangeDate = exhangeDate;
            this.invoiceModel.waybillDate = w.waybillDate;
            this.InvoiceFormVisible = true;
          });
      } catch (error) {
        this.$logger.log("Post Order Error=>", error);
      }
      //this.invoiceModel.exchangeDate = this.exchangeDate;
    },
    async createManuelInvoice() {
      //InvoiceForm
      this.ManuelInvoiceFormVisible = true;
      this.invoiceModel = {};
      this.invoiceModel = JSON.parse(JSON.stringify(this.formModel.order));
      this.invoiceModel.invoiceDetails = this.selected;
      this.invoiceModel.currency.exchangeRate =
        this.formModel.order.exchangeRate;
      this.invoiceModel.exchangeRate = this.formModel.order.currency;

      //this.invoiceModel.exchangeDate = this.exchangeDate;
    },
    async editFormModel() {
      //this.formModel.order.exchangeRate = this.exchangeRate;
      this.$logger.log("editFormModel", this.formModel);
      //this.formModel.order.id = this.waybillModel.orderId;
      const response = this.$api
        .put("orders", this.formModel.order)
        .then((_response) => {
          this.$logger.log("orders", _response.data);
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
          this.formOrderRefresh();
          this.$emit("orderListRefresh");
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
      this.formModel.order.exchangeDate = date.formatDate(
        oncekiGun,
        "YYYY-MM-DD"
      );
      this.$logger.log("exchange date....:", this.formModel.order.exchangeDate);
      this.currencyValue = {
        id: 0,
        name: "Kur Seçin",
      };
      this.getExchangeWithCurrency(this.formModel.order.currency);
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
      this.formModel.order.exchangeRate = currency.value;
      this.tutarBilgileri();
    },
    async getExchangeWithCurrency(val) {
      //this.$logger.log("changedd", val, this.formModel.order.exchangeDate);
      this.formModel.order.exchangeRate = null;
      this.formModel.order.currencyValue = null;
      if (val.shortName == "TRY") {
        this.currencyValue = {
          id: 5,
          name: "Lütfen para birimini döviz cinsinden seçin",
        };
        return;
      }
      if (
        this.formModel.order.exchangeDate &&
        !this.sameDateControl(this.formModel.order.exchangeDate)
      ) {
        const data = this.parseDate(this.formModel.order.exchangeDate);
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

              this.formModel.order.exchangeRate = result?.data?.BanknoteSelling;

              this.formModel.order.currencyValue = [
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
              this.formModel.order.exchangeRate = null;
              this.formModel.order.currencyValue = null;
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
          this.formModel.order.address = data.data;
          this.$logger.log(
            "this.formModel.address",
            this.formModel.order.address
          );
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

    async getOrderStatus() {
      const response = this.$api.get("orderStatuses").then((data) => {
        this.orderStatusFull = data.data.sort(
          (a, b) => a.sequence - b.sequence
        );
        // this.$logger.log('this.orderStatusFull', this.orderStatusFull);
        if (!this.formModel.order.orderStatus.id)
          this.formModel.order.orderStatus = this.orderStatusFull[0];
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
      this.currentRow.orderId = this.formModel.order.id;
      this.currentRow.stockCard = {};
      this.currentRow.stockCard.stockName = "Ürün Seçiniz";
      this.currentRow.stockCard.currency = {};
      this.currentRow.stockCard.currency.shortName = "";

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

    onRowDoubleClick(evt, row) {
      this.$logger.log("onRowDoubleClick", row);

      this.maximizedToggle = false;
      this.currentRow = row;
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
        const response = await this.$api.get(
          "getOrder/" + this.formModel.orderId
        );
        //this.formModel = response?.data;

        this.formModel.order.orderDate = date.formatDate(
          this.formModel.order.orderDate,
          "YYYY-MM-DD"
        );
        this.formModel.order.dispatchDate = date.formatDate(
          this.formModel.order.dispatchDate,
          "YYYY-MM-DD"
        );

        this.$logger.log("formModel 1: ", this.formModel);
        //this.formModel = this.formModel;
        this.rows = this.formModel.orderItems;
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

    async addOrderItem() {
      this.currentRow.orderId = this.formModel.order.id;
      this.$logger.log(this.currentRow);
      const _response = this.$api
        .post("postOrderItem", JSON.stringify(this.currentRow))
        .then((response) => {
          this.$logger.log(response.data);
          this.$logger.log("add completed");
          this.OrderDetailFormVisible = false;

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

    async editOrderItemDispacheDate(orderItem) {
      const response = this.$api
        .put("orderItems", JSON.stringify(orderItem))
        .then((_response) => {
          this.$logger.log(_response.data);
          this.$logger.log("edit completed");
          this.OrderDetailFormVisible = false;
        });
    },
    async editOrderItem() {
      this.currentRow.orderId = this.formModel.order.id;
      const response = this.$api
        .put("orderItems", JSON.stringify(this.currentRow))
        .then((_response) => {
          this.$logger.log(_response.data);
          this.$logger.log("edit completed");
          this.OrderDetailFormVisible = false;

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
      this.formModel.order.discount =
        this.formModel.order.discount == null
          ? this.formModel.order.discount
          : 0;
      this.formModel.order.discountPercent =
        this.formModel.order.discountPercent == null
          ? 0
          : this.formModel.order.discountPercent;

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
            parseFloat(this.kdvToplam) *
              parseFloat(this.formModel.order.exchangeRate)
          ).toFixed(2);

          this.dovizliaraToplam += parseFloat(
            parseFloat(this.araToplam) *
              parseFloat(this.formModel.order.exchangeRate)
          ).toFixed(2);
          this.dovizliiskontoToplam += this.rows[i].unitAmount;
        }

        this.genelToplam = (
          parseFloat(this.araToplam) +
          parseFloat(this.kdvToplam) -
          ((parseFloat(this.araToplam) + parseFloat(this.kdvToplam)) *
            parseFloat(this.formModel.order.discountPercent)) /
            100
        ).toFixed(2);

        this.dovizligenelToplam = (
          parseFloat(this.genelToplam) *
          parseFloat(this.formModel.order.exchangeRate)
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
      this.formModel.order.discountPercent =
        (this.formModel.order.discount * 100) / this.araToplam;
      this.tutarBilgileri();
    },

    async calcFaturaIskonto() {
      this.$logger.log("change2");
      this.formModel.order.discount =
        (this.formModel.order.discountPercent * this.araToplam) / 100;
      this.tutarBilgileri();
    },

    async calcFaturaIskontoTopTutar() {
      this.formModel.order.discount =
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
      this.formModel.order.firmId = val.id;
      this.formModel.order.paymentTerm = this.paymentTermFull.find(
        (pt) => pt.id == val.paymentTermId
      );
      try {
        if (!this.formModel.order.paymentTerm.id) {
          this.formModel.order.paymentTerm = this.paymentTermFull[0];
        }
      } catch (error) {
        this.formModel.order.paymentTerm = this.paymentTermFull[0];
      }

      this.formModel.order.paymentType = this.paymentTypes.find(
        (pt) => pt.id == val.paymentTypeId
      );
      if (!this.formModel.order.paymentType.id) {
        this.formModel.order.paymentType = this.paymentTypes[0];
      }

      this.formModel.order.currency = this.currenciesFull.find(
        (c) => c.id == val.currencyId
      );
      if (!this.formModel.order.currency.id) {
        this.formModel.order.currency = this.currenciesFull[1];
      }

      this.$logger.log("formModel", this.formModel);
      this.getFirmPostAddress(val.postAddressId);
    },
    countrySelected(val) {
      this.$logger.log("Country", val);
    },

    async employeeControl() {
      if (this.mode != "add") {
        if (this.formModel.order.employeeId == this.userinfo.id) {
          this.authorityToChange = true;
        } else {
          this.authorityToChange = false;
        }
        this.$logger.log("authorityToChange", this.authorityToChange);
      } else {
        this.authorityToChange = true;
      }
    },
  },
});
</script>
