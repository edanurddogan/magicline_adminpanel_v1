<template>
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("finance.invoices") }}</div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-list class="row">
            <!--Müşteri Ünvan  -->
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  use-input
                  :disable="mode === 'details'"
                  outlined
                  v-model="formModel.firm"
                  :options="firmFiltered"
                  @filter="filterFirm"
                  option-value="id"
                  option-label="commercialTitle"
                  :label="$t('order.orderfirm')"
                />
              </q-item-section>
            </q-item>

            <!--Fatura Tarihi  -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('finance.invoiceDate')"
                  v-model="formModel.invoiceDate"
                  @change="dateChange"
                />
              </q-item-section>
            </q-item>

            <!--Sevk Tarihi  -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('finance.shipmentDate')"
                  v-model="formModel.dispatchDate"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  v-if="false"
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.exchangeRate')"
                  v-model="formModel.fax"
                />
              </q-item-section>
            </q-item>

            <!--Fatura No  -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.invoiceNo')"
                  v-model="formModel.invoiceNo"
                />
              </q-item-section>
            </q-item>

            <!--İrsaliye No  -->
            <!-- <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillNo')"
                  v-model="formModel.waybills[0].waybillNo"
                />
              </q-item-section>
            </q-item> -->

            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('order.orderDiscount')"
                  v-model="formModel.discount"
                />
              </q-item-section>
            </q-item>

            <!--Invoice process type  -->
            <q-item class="col-lg-4 col-md-4 col-sm-3 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.invoiceProcessType"
                  option-value="id"
                  option-label="name"
                  :label="$t('finance.invoiceProcessType')"
                  :options="invoiceProcessTypeFiltered"
                  @filter="filterInvoiceProcessType"
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

            <!--Ödeme Yöntemi  -->
            <q-item class="col-lg-4 col-md-4 col-sm-3 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.paymentType"
                  option-value="id"
                  option-label="value"
                  :label="$t('finance.paymentMethod')"
                  :options="paymentTypesFiltered"
                  @filter="filterPaymentType"
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
            <!--Ödeme Vadesi  -->
            <q-item class="col-lg-4 col-md-4 col-sm-3 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.paymentTerm"
                  option-value="id"
                  option-label="value"
                  :label="$t('finance.paymentTerm')"
                  :options="paymentTermFiltered"
                  @filter="filterPaymentTerm"
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

            <!--Fatura Süreci  -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.invoiceTransactionType"
                  option-value="id"
                  option-label="name"
                  :label="$t('finance.invoiceProcess')"
                  :options="invoiceTransactionTypeFiltered"
                  @filter="filterInvoiceTransaction"
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

            <!--Fatura Senaryo  -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.invoiceScenario"
                  option-value="id"
                  option-label="description"
                  :label="$t('finance.invoiceScenario')"
                  :options="invoiceScenarioFiltered"
                  @filter="filterInvoiceScenario"
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

            <!--Fatura Tipi  -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.invoiceType"
                  option-value="id"
                  option-label="name"
                  :label="$t('finance.invoiceType')"
                  :options="invoiceTypeFiltered"
                  @filter="filterInvoiceType"
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

            <!--Tevkifat  -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.invoiceWithholding"
                  option-value="id"
                  option-label="description"
                  :label="$t('finance.withholding')"
                  :options="invoiceWithholdingFiltered"
                  @filter="filterInvoiceWithholding"
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

            <!--İstisna  -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.invoiceExceptionType"
                  option-value="id"
                  option-label="description"
                  :label="$t('finance.exceptional')"
                  :options="invoiceExceptionTypeFiltered"
                  @filter="filterInvoiceExceptionType"
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
          <div>{{ $t("firm.detailandnoteinfo") }}</div>
        </q-card-section>

        <q-card-actions>
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('firm.detail')"
                v-model="formModel.description"
                type="textarea"
              />
            </q-item-section>
          </q-item>
        </q-card-actions>
      </q-card>
    </div>
    <!-- Exchange Card -->
    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("order.exchangerate") }}</div>
        </q-card-section>

        <q-card-section>
          <q-list class="row">
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
                  :disable="mode === 'details'"
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
                  :disable="mode === 'details'"
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
                  v-if="formModel.currency"
                  :disable="mode === 'details'"
                  label="Kur"
                  v-model="formModel.exchangeRate"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section class="bg-primary text-white">
          <div>{{ $t("order.invoicepriceinfo") }}</div>
        </q-card-section>

        <q-card-section>
          <q-list class="row">
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
          <q-list class="row">
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
                  v-if="formModel.currency"
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
                  v-if="formModel.currency"
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
          <div>{{ $t("Ürün ve Hizmetler") }}</div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-table
            dense
            bordered
            :grid="isGrid"
            :hide-header="isGrid"
            class="statement-table"
            :rows="rows"
            :columns="columns"
            :loading="loading"
            :filter="filter"
            :loading-label="$t('loading')"
            :no-data-label="$t('nodatalabel')"
            :no-results-label="$t('noresultslabel')"
            row-key="id"
          >
            <template v-slot:top="props">
              <div class="row col-12">
                <q-input
                  class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
                  bottom-slots
                  dense
                  debounce="300"
                  v-model="filter"
                  :placeholder="$t('search')"
                >
                  <template v-slot:append
                    ><q-icon
                      dense
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
                  @click="onAddV2"
                />

                <q-btn
                  flat
                  round
                  dense
                  icon="refresh"
                  class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                  @click="tutarBilgileri()"
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
              <q-td :props="props" v-if="!props.row.isAdded">
                <q-btn
                  dense
                  flat
                  round
                  color="primary"
                  icon="info"
                  @click="onView(props.row)"
                />
                <q-btn
                  dense
                  flat
                  round
                  color="secondary"
                  icon="edit"
                  @click="onEdit(props.row)"
                />
                <q-btn
                  dense
                  flat
                  round
                  color="negative"
                  icon="delete_forever"
                  @click="onDelete(props.row)"
                />
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
                          >{{
                            props.row.isActive ? $t("active") : $t("inactive")
                          }}
                        </q-chip>

                        <q-item-section
                          v-else-if="col.name === 'action'"
                          class="row"
                        >
                          <div class="row">
                            <q-btn
                              dense
                              flat
                              round
                              color="primary"
                              icon="info"
                              @click="onView(props.row)"
                            />
                            <q-btn
                              dense
                              flat
                              round
                              color="secondary"
                              icon="edit"
                              @click="onEdit(props.row)"
                            />
                            <q-btn
                              dense
                              flat
                              round
                              color="negative"
                              icon="delete_forever"
                              @click="onDelete(props.row)"
                            />
                          </div>
                        </q-item-section>

                        <q-item-label v-else caption>
                          <p>{{ col.value }}</p>
                        </q-item-label>
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
        </q-card-section>
      </q-card>
    </div>

    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-actions>
          <q-space />
          <q-btn
            v-if="!formModel.invoiceNo"
            color="secondary"
            :label="$t('finance.createInvoice')"
            icon-right="send"
            text-color="white"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="save"
          >
          </q-btn>
          <q-btn
            v-if="formModel.invoiceNo && !formModel.sendPortal"
            color="amber-10"
            :label="$t('finance.sendToPortal')"
            icon-right="send"
            text-color="white"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="sendPortal()"
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <!-- Form Dialog -->

    <q-dialog
      v-model="orderItemformVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 60vw; max-height: 90vh">
        <q-card-section class="q-pa-sm">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("products.product")
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
              <q-tooltip
                v-if="!maximizedToggle"
                class="bg-white text-primary"
                >{{ $t("maximize") }}</q-tooltip
              >
            </q-btn>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
          <invoice-detail-form
            class="q-ma-none q-pa-none"
            v-model="currentRow"
            :mode="currentMode"
            @addcompleted="addInvoiceItem"
            @editcompleted="editInvoiceItem"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Product Form Dialog -->
    <q-dialog
      v-model="selectOrderItemFormVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 88vw; max-height: 90vh">
        <q-card-section class="q-pa-sm">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("products.product")
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
              <q-tooltip
                v-if="!maximizedToggle"
                class="bg-white text-primary"
                >{{ $t("maximize") }}</q-tooltip
              >
            </q-btn>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
          <q-table
            dense
            bordered
            :grid="isGrid"
            :hide-header="isGrid"
            class="statement-table"
            :rows="waybillsByFirm"
            :columns="waybillColumns"
            :loading="loading"
            :filter="filter"
            :pagination="paginationWaybill"
            :loading-label="$t('loading')"
            :no-data-label="$t('nodatalabel')"
            :no-results-label="$t('noresultslabel')"
            row-key="id"
            :selected-rows-label="getSelectedString"
            selection="multiple"
            v-model:selected="selected"
          >
            <template v-slot:body-cell-checkBox="props">
              <q-checkbox v-model="props.selected" />
            </template>
            <!--<template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>-->
            <template v-slot:body="props">
              <q-tr
                class="cursor-pointer"
                :props="props"
                @click="props.selected = !props.selected"
                v-if="
                  props.row.waybillNo &&
                  props.row.waybillDetails.length > 0 &&
                  props.row.waybillNo !== formModel.waybillNo
                "
              >
                <q-td>
                  <q-checkbox v-model="props.selected" />
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>

            <template v-slot:no-data="{ icon, message, filter }">
              <div class="full-width row flex-center q-gutter-sm">
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                <span> {{ message }}... </span>
              </div>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions>
          <q-space />
          <q-btn
            color="secondary"
            :label="$t('finance.addRemoveproduct')"
            icon-right="send"
            text-color="white"
            class="text-capitalize q-pa-md q-mx-md"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            @click="addOrderItemToWaybill"
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent, computed } from "vue";
import { useQuasar, date } from "quasar";
import InvoiceDetailForm from "src/components/forms/InvoiceDetailForm.vue";

export default defineComponent({
  name: "FirmForm",
  components: {
    InvoiceDetailForm,
  },
  computed: {
    waybillColumns() {
      return [
        {
          name: "waybillDate",
          required: true,
          label: this.$t("waybill.waybillDate"),
          align: "left",
          field: (row) => row.waybillDate,
          field: (row) => date.formatDate(row.waybillDate, "DD.MM.YYYY"),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "waybillNo",
          required: true,
          label: this.$t("waybill.waybillNo"),
          align: "left",
          field: (row) => row.waybillNo,
          format: (val) => `${val}`,
          sortable: true,
        },
      ];
    },
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
            row.orderItem.price + " " + this.formModel?.currency?.symbol,
          sortable: true,
        },
        {
          name: "discount",
          label: this.$t("order.orderDiscount"),
          align: "center",
          field: (row) =>
            row.orderItem.discount + " " + this.formModel.currency.symbol,
          sortable: true,
        },
        {
          name: "discountpercent",
          label: this.$t("order.discountpercent"),
          align: "center",
          field: (row) => row.orderItem.discountPercent + " %",
          sortable: true,
        },
        {
          name: "unitamount",
          label: this.$t("order.unitamount"),
          align: "center",
          field: (row) =>
            row.orderItem.unitAmount + " " + this.formModel.currency.symbol,
          sortable: true,
        },
        {
          name: "vatrate",
          label: this.$t("order.vatrate"),
          align: "center",
          field: (row) => row.orderItem.vatRate + " %",
          sortable: true,
        },
        {
          name: "total",
          label: this.$t("order.subtotal"),
          align: "center",
          field: (row) =>
            row.orderItem.unitAmount * row.quantity +
            " " +
            this.formModel.currency.symbol,
          sortable: true,
        },
        {
          name: "grandtotal",
          label: this.$t("order.grandtotal"),
          align: "center",
          field: (row) =>
            row.orderItem.unitsumamount + " " + this.formModel.currency.symbol,
          sortable: true,
        },
        /*{
          name: "status",
          name: "status",
          align: "center",
          label: this.$t("status"),
          field: "isActive",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: this.$t("action"),
          field: "",
        },*/
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
    this.$logger.log("formModel invoiceForm:", formModel.value);

    if (props.mode == "add" && props.addInvoice == false) {
      this.$logger.log("add çalıştı");
      formModel.value.firm = {};
      formModel.value.firm.commercialtitle = "";
      formModel.value.invoiceTransactionType = {};
      formModel.value.firm.postAddress = {};
      formModel.value.firm.postAddress.city = {};
      formModel.value.firm.postAddress.country = "İstanbul";
      formModel.value.firm.postAddress.city.name = "";
      formModel.value.firm.postAddress.region = {};
      formModel.value.firm.postAddress.region.name = "";
      formModel.value.cargo = { id: 0, name: "Seç..." };
      formModel.value.firm.currency = { name: "Para birimi seç" };
      formModel.value.detail = "";
      formModel.value.exchangeDate = date.formatDate(Date(), "YYYY-MM-DD");

      //formModel.value.order.orderDate = date.formatDate(Date(), "YYYY-MM-DD");
    }

    if (props.addInvoice) {
      formModel.value.id = null;
      formModel.value.invoiceProcessType = { id: 2, name: "Satış" };
      formModel.value.invoiceScenario = {
        id: 2,
        Scenario: "TİCARİ FATURA",
        description: "Ticari Fatura",
      };
      formModel.value.invoiceTransactionType = { id: 1, name: "Düzenleme" };
      formModel.value.invoiceType = {
        id: 1,
        description: "Satış",
        name: "Satış",
      };
      formModel.value.paymentType = { id: 1, value: "Nakit" };
    }

    formModel.value.discount = formModel.value.discount || 0;
    return {
      formModel,
    };
  },
  data() {
    return {
      currencyValue: { id: 0, name: "Kur Seç" },
      orderItemformVisible: false,
      exchanges: {},
      loading: true,
      rows: [],
      selectedId: 0,
      formVisible: false,
      deleteConfirm: false,
      currentMode: "add",
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      isGrid: false,
      selected: [],
      paginationWaybill: {
        rowsPerPage: 20,
      },

      currenciesFull: [],
      currenciesFiltered: [],

      paymentTypesFull: [],
      paymentTypesFiltered: [],

      paymentTermFull: [],
      paymentTermFiltered: [],

      invoiceScenarioFiltered: [],
      invoiceScenarioTypeFull: [],

      invoiceProcessTypeFiltered: [],
      invoiceProcessTypeFull: [],

      invoiceTypeFiltered: [],
      invoiceTypeFull: [],

      invoiceTransactionTypeFiltered: [],
      invoiceTransactionTypeFull: [],

      invoiceWithholdingFiltered: [],
      invoiceWithholdingFull: [],

      invoiceExceptionTypeFiltered: [],
      invoiceExceptionTypeFull: [],
      firmFull: [],
      firmFiltered: [],

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

      selectOrderItemFormVisible: false,
      waybillsByFirm: [],
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
    addInvoice: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.$logger.log("mode", this.mode);
    if (this.mode == "add") {
      this.formModel.invoiceDate = date.formatDate(Date(), "YYYY-MM-DD");

      this.formModel.dispatchDate = date.formatDate(Date(), "YYYY-MM-DD");
      // this.formModel.exchangeRate.exchangeDate = date.formatDate(
      //   Date(),
      //   "YYYY-MM-DD"
      // );
      let today = new Date();

      // Bugünden bir gün çıkar (dünün tarihini bulmak için)
      today.setDate(today.getDate() - 1);
      //this.formModel.exchangeDate = today;
      this.getExchange();
      //this.oncekiIkiGunHaftaSonuKontrol(this.formModel.exchangeDate);
    } else {
      this.formModel.invoiceDate = date.formatDate(
        this.formModel.invoiceDate,
        "YYYY-MM-DD"
      );

      this.formModel.dispatchDate = date.formatDate(
        this.formModel.waybillDate,
        "YYYY-MM-DD"
      );
      this.formModel.exchangeRate.exchangeDate = date.formatDate(
        this.formModel.exchangeRate.exchangeDate,
        "YYYY-MM-DD"
      );
    }

    this.$logger.log("formModel => ", this.formModel);
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
      this.getFirm();
      this.getCurrency();
      this.getPaymentType();
      this.getPaymentTerm();
      this.getInvoiceScenario();
      this.getInvoiceType();
      this.getInvoiceTransactionType();
      this.getInvoiceWithholding();
      this.getInvoiceExceptionType();
      //this.getInvoiceDetail();
      this.getInvoiceProcessType();

      this.getSerialNoToDescription();

      let waybillDate = new Date(this.formModel.waybillDate);
      waybillDate.setDate(waybillDate.getDate() - 1);
      this.oncekiIkiGunHaftaSonuKontrol(waybillDate);

      this.formModel.dispatchDate = date.formatDate(
        this.formModel.waybillDate,
        "YYYY-MM-DD"
      );
      //this.rows = this.formModel.invoiceDetails;
      this.rows = JSON.parse(JSON.stringify(this.formModel.invoiceDetails));
      this.tutarBilgileri();
      this.loading = false;
    },

    onSubmit() {},

    save() {
      this.$logger.log("form submitted", this.formModel);
      if (this.mode === "add") {
        this.$logger.log("add");
        this.addFormModel();
        //this.postInvoiceUyumSoft();
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },
    async setExchange(currency) {
      this.$logger.log("set exchange is run");
      this.formModel.exchangeRate = currency.value;
      this.tutarBilgileri();
    },

    getSelectedString() {
      return this.selected.length === 0
        ? ""
        : `${this.waybillsByFirm.length} irsaliyeden ${this.selected.length} adet seçildi`;
    },

    addOrderItemToWaybill() {
      this.$logger.log("this.rows1", this.rows);
      this.$logger.log("this.selected", this.selected);
      this.rows = JSON.parse(JSON.stringify(this.formModel.invoiceDetails));
      //getWaybilldetails from this.selected for throw this.row
      this.selected.map((item) => {
        //waybillDetails is array
        item.waybillDetails.forEach((element) => {
          element.isAdded = true;
          if (element.orderItem) this.rows.push(element);
        });
      });
      this.selectOrderItemFormVisible = false;
      this.tutarBilgileri();
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
    parseDate(date) {
      var parcalar = date.split("-");
      var day = parcalar[2]; // Gün kısmını alır ve ondalık sayıya çevirir
      var month = parcalar[1]; // Ay kısmını alır ve ondalık sayıya çevirir
      var year = parcalar[0]; // Yıl kısmını alır ve ondalık sayıya çevirir

      return { day, month, year };
    },

    async getExchangeWithCurrency(val) {
      //this.$logger.log("changedd", val, this.formModel.exchangeDate);
      this.formModel.exchangeRate = null;
      this.formModel.currencyValue = null;
      if (val && val.shortName == "TRY") {
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

    async getSerialNoToDescription() {
      try {
        this.$logger.log("invoiceDetails", this.formModel.invoiceDetails);
        var firstSerialno = 0;
        for (
          let index = 0;
          index < this.formModel.invoiceDetails.length;
          index++
        ) {
          const element = this.formModel.invoiceDetails[index];
          if (element.stockSerialNo) {
            if (firstSerialno == 0) {
              firstSerialno = 1;
              this.formModel.description
                ? "Seri No:"
                : (this.formModel.description += "\nSeri No: ");
            }
            this.formModel.description += ` /${element.stockSerialNo.serialNo}`;
          }
        }
        this.$logger.log("description", this.formModel.description);
      } catch (error) {}
    },
    async addFormModel() {
      //TODO: fatura adresi eklenecek
      try {
        this.formModel.firmId = this.formModel.firm.id;
        this.formModel.addressId =
          this.formModel.address?.id || this.formModel.firm.invoiceAddressId;
        this.formModel.invoiceTransactionTypeId =
          this.formModel.invoiceTransactionType.id;
        this.formModel.invoiceProcessTypeId =
          this.formModel.invoiceProcessType.id;
        this.formModel.invoiceScenarioId = this.formModel.invoiceScenario.id;
        this.formModel.invoiceTypeId = this.formModel.invoiceType.id;
        this.formModel.currencyId = this.formModel.firm.currency.id;
        this.formModel.exchangeRateId = this.formModel.exchangeRate.id;
        this.formModel.paymentTypeId = this.formModel.paymentType.id;
        this.formModel.paymentTermId = this.formModel.paymentTerm.id;

        this.formModel.invoiceDetails = this.rows;
        //TODO: ind.serialNo'ya ürünün seri numaraları eklenecek
        this.formModel.invoiceDetails.map((ind) => {
          ind.vatRate = ind.orderItem.vatRate;
          ind.price = ind.orderItem.price;
        });

        /*this.formModel.invoiceWithholdingId =
          this.formModel.invoiceWithholding.id;
        this.formModel.invoiceExceptionTypeId =
          this.formModel.invoiceExceptionType.id;
        this.formModel.id = null;*/
      } catch (error) {
        this.$logger.log("error", error);
      }

      //this.formModel.id = null;
      this.postInvoiceUyumSoft();
    },
    async postInvoiceUyumSoft() {
      try {
        //TODO: kur tarihi irsaliye tarihinden bir gün öncesi olacak
        const response = this.$api
          .post("insertInvoice/", this.formModel)
          .then((_response) => {
            this.$logger.log(_response);
            this.formModel.erpInvoiceId = _response.data.id;
            this.formModel.ettn = _response.data.guid;
            this.formModel.invoiceNo = _response.data.docNo;
            this.formModel.einvoice = _response.data.einvoice === "True";

            this.$logger.log("Order Post UyumSoft", _response.data);
            this.postInvoiceDB();
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: this.$t("success"),
              caption: this.$t("success"),
            });
          });
      } catch (error) {
        this.$logger.log("Uyumsoft Post Order Error=>", error);
      }
    },

    async postInvoiceDB() {
      let invoice = this.formModel;
      invoice.invoiceDetails = this.rows;
      const _response = await this.$api
        .post("postInvoice", invoice)
        .then((response) => {
          this.$logger.log(response.data);
          this.$logger.log("add completed");
          this.formModel = response.data;
          this.$logger.log(this.formModel);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message:
              "Fatura Bilgileri Girus'a Gönderildi" /*this.$t("success")*/,
            caption: this.$t("success"),
          });
          this.$emit("invoiceSended");
        });
    },

    async sendPortal() {
      const _response = await this.$api
        .post(`sendPortalUyumSoft/${this.formModel.erpInvoiceId}`)
        .then((response) => {
          this.$logger.log(response.data);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("finance.sendedPortal"),
            caption: this.$t("success"),
          });
          this.$emit("completed");
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
            parseFloat(this.rows[i].orderItem.unitAmount) *
              parseFloat(this.rows[i].quantity)
          ).toFixed(2);

          this.rows[i].orderItem.unitsumamount =
            (this.rows[i].orderItem.unitAmount +
              (this.rows[i].orderItem.unitAmount *
                this.rows[i].orderItem.vatRate) /
                100) *
            this.rows[i].quantity;

          this.kdvToplam +=
            ((this.rows[i].orderItem.unitAmount *
              this.rows[i].orderItem.vatRate) /
              100) *
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
          this.dovizliiskontoToplam += this.rows[i].orderItem.unitAmount;
        }

        this.genelToplam = (
          parseFloat(this.araToplam) +
          parseFloat(this.kdvToplam) -
          ((parseFloat(this.araToplam) + parseFloat(this.kdvToplam)) *
            parseFloat(this.formModel.discountPercent)) /
            100
        ).toFixed(2);

        this.dovizligenelToplam = (
          parseFloat(this.genelToplam) *
          parseFloat(this.formModel.currency.exchangeRate)
        ).toFixed(2);

        this.dovizlikdvToplam = parseFloat(this.dovizlikdvToplam).toFixed(2);
        this.dovizliaraToplam = parseFloat(this.dovizliaraToplam).toFixed(2);
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
    async getFirm() {
      const response = this.$api.get("firmDetailList").then((data) => {
        this.firmFull = data.data;
        //this.$logger.log("this.firmFull", this.firmFull);
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
        this.firmFiltered = this.firmFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async addInvoiceItem() {
      const response = this.$api
        .post("invoiceItem/" + this.formModel.id, this.currentRow)
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

          this.stockInOutSave();
          this.orderItemformVisible = false;
        });
    },

    async stockInOutSave() {
      try {
        const Stock = {
          stockIn: 1,
          stockOut: -1,
          stocktaking: 0,
        };
        this.$logger.log();
        this.currentRow.stockCardId = this.currentRow.stockCard.id;
        this.currentRow.movement = this.formModel.invoiceType.id == 1 ? 1 : -1;
        this.currentRow.warehouseId = this.currentRow.warehouse.id;

        this.$logger.log("stockMovement", this.currentRow);
        const _response = this.$api
          .post("postStockUpdate", this.currentRow)
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

    async editFormModel() {
      const response = this.$api
        .put("firms", JSON.stringify(this.formModel))
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
        });
    },

    async getInvoiceDetail() {
      this.loading = true;
      this.rows = JSON.parse(JSON.stringify(this.formModel.invoiceDetails));
      this.$logger.log("invoiceDetail =>", this.rows);
      this.loading = false;
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

    async getPaymentType() {
      const response = this.$api.get("paymentTypes").then((data) => {
        this.$logger.log("paymentTypes", data.data);
        this.paymentTypesFull = data.data;
      });
    },

    filterPaymentType(val, update) {
      if (val === "") {
        update(() => {
          this.paymentTypesFiltered = this.paymentTypesFull;
        });
        return;
      }

      update(() => {
        this.paymentTypesFiltered = this.paymentTypesFull.filter(
          (v) => v.value.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getInvoiceProcessType() {
      const response = this.$api.get("invoiceProcessTypes").then((data) => {
        this.$logger.log("paymentTypes", data.data);
        this.invoiceProcessTypeFull = data.data;
      });
    },

    filterInvoiceProcessType(val, update) {
      if (val === "") {
        update(() => {
          this.invoiceProcessTypeFiltered = this.invoiceProcessTypeFull;
        });
        return;
      }

      update(() => {
        this.invoiceProcessTypeFiltered = this.invoiceProcessTypeFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getPaymentTerm() {
      const response = this.$api.get("paymentTerms").then((data) => {
        this.$logger.log("paymentTerms", data.data);
        this.paymentTermFull = data.data;
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
          (v) => v.value.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getInvoiceScenario() {
      const response = this.$api.get("invoiceScenarios").then((data) => {
        this.$logger.log("invoiceScenarios =>", data.data);
        this.invoiceScenarioFull = data.data;
      });
    },

    filterInvoiceScenario(val, update) {
      if (val === "") {
        update(() => {
          this.invoiceScenarioFiltered = this.invoiceScenarioFull;
        });
        return;
      }

      update(() => {
        this.invoiceScenarioFiltered = this.invoiceScenarioFull.filter(
          (v) => v.Scenario.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getInvoiceType() {
      const response = this.$api.get("invoiceTypes").then((data) => {
        this.$logger.log("invoiceTypes =>", data.data);
        this.invoiceTypeFull = data.data;
      });
    },

    filterInvoiceType(val, update) {
      if (val === "") {
        update(() => {
          this.invoiceTypeFiltered = this.invoiceTypeFull;
        });
        return;
      }

      update(() => {
        this.invoiceTypeFiltered = this.invoiceTypeFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getInvoiceTransactionType() {
      const response = this.$api.get("invoiceTransactionTypes").then((data) => {
        this.$logger.log("invoiceTransactionType =>", data.data);
        this.invoiceTransactionTypeFull = data.data;
      });
    },

    filterInvoiceTransaction(val, update) {
      if (val === "") {
        update(() => {
          this.invoiceTransactionTypeFiltered = this.invoiceTransactionTypeFull;
        });
        return;
      }

      update(() => {
        this.invoiceTransactionTypeFiltered =
          this.invoiceTransactionTypeFull.filter(
            (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
      });
    },

    async getInvoiceWithholding() {
      const response = this.$api.get("invoiceWithholdings").then((data) => {
        this.$logger.log("invoiceWithholding =>", data.data);
        this.invoiceWithholdingFull = data.data;
      });
    },

    filterInvoiceWithholding(val, update) {
      if (val === "") {
        update(() => {
          this.invoiceWithholdingFiltered = this.invoiceWithholdingFull;
        });
        return;
      }

      update(() => {
        this.invoiceWithholdingFiltered = this.invoiceWithholdingFull.filter(
          (v) => v.description.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getInvoiceExceptionType() {
      const response = this.$api.get("invoiceExceptionTypes").then((data) => {
        this.$logger.log("invoicExceptionType =>", data.data);
        this.invoiceExceptionTypeFull = data.data;
      });
    },

    filterInvoiceExceptionType(val, update) {
      if (val === "") {
        update(() => {
          this.invoiceExceptionTypeFiltered = this.invoiceExceptionTypeFull;
        });
        return;
      }

      update(() => {
        this.invoiceExceptionTypeFiltered =
          this.invoiceExceptionTypeFull.filter(
            (v) => v.description.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
      });
    },

    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.orderItemformVisible = true;
    },

    onAddV2() {
      // this.maximizedToggle = false;
      // this.currentRow = {};
      // this.currentMode = "add";
      // this.orderItemformVisible = true;

      //api/getWaybillByFirmId/:firmId
      this.$api
        .get("getWaybillByFirmId/" + this.formModel.firm.id)
        .then((data) => {
          this.$logger.log("getWaybillByFirmId", data.data);
          this.waybillsByFirm = data.data;

          this.$logger.log("waybillsByFirm", this.waybillsByFirm);
          // this.order

          this.formVisible = true;
          this.selectOrderItemFormVisible = true;
        });
    },
    onView(user) {
      this.$logger.log(user);
      this.maximizedToggle = false;
      this.currentRow = user; /*Object.assign(
        {},
        this.rows.find((row) => row.id === id)
      );*/
      this.currentMode = "details";
      this.orderItemformVisible = true;
    },
    onEdit(user) {
      this.maximizedToggle = false;
      this.currentRow = user; /*Object.assign(
        {},
        this.rows.find((row) => row.id === id)
      );*/
      this.currentMode = "edit";
      this.orderItemformVisible = true;
    },
    onDeleteUser(user) {
      this.currentRow = user;
      this.deleteConfirm = true;
    },
    onFormCompleted() {
      this.orderItemformVisible = false;
      this.$logger.log("form completed");
      getUsers();
      // await this.$api.post("Kullanici/Kaydet", model);
    },

    async getExchange() {
      this.$logger.log("getExchange");
      const response = this.$api.get("getExchange").then((data) => {
        const currency = this.currenciesFull.find(
          ({ id }) => id === this.formModel.firm.currency.id
        );
        this.getExchangeWithCurrency(currency);
      });
    },
  },
});
</script>
