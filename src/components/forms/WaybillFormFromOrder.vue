<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("finance.waybills") }}</div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-list class="row">
            <!--Müşteri Ünvan  -->
            <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
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
                  :label="$t('finance.firmtitle')"
                  @update:model-value="(val) => firmSelected(val)"
                />
              </q-item-section>
            </q-item>

            <!--İrsaliye No  -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillNo')"
                  v-model="formModel.waybillNo"
                />
              </q-item-section>
            </q-item>

            <!--İrsaliye Tarihi  -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillDate')"
                  v-model="formModel.waybillDate"
                  :rules="[
                    (val) =>
                      isEquale(val, formModel.dispatchDate) ||
                      'Tarihler Farklı',
                  ]"
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
                  :rules="[
                    (val) =>
                      isEquale(val, formModel.waybillDate) || 'Tarihler Farklı',
                  ]"
                />
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
                  v-model="formModel.firm.postAddress.country"
                  option-value="id"
                  option-label="countryName"
                  :options="countriesFiltered"
                  @filter="filterCountries"
                  :label="$t('firm.country')"
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
                  v-model="formModel.firm.postAddress.city"
                  option-value="id"
                  option-label="cityName"
                  :options="citiesFiltered"
                  @filter="filterCities"
                  :label="$t('finance.waybillCity')"
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
                  v-model="formModel.firm.postAddress.region"
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
                  v-model="formModel.firm.postAddress.postalCode"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  outlined
                  :disable="mode === 'details'"
                  :label="$t('firm.shippinganddispatchaddressinfo')"
                  v-model="formModel.firm.postAddress.addressDetail"
                  type="textarea"
                  rows="5"
                />
              </q-item-section>
            </q-item>
            <!--Şehir -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillCity')"
                  v-model="formModel.firm.postAddress.city.cityName"
                />
              </q-item-section>
            </q-item>

            <!--İlçe -->
            <q-item class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillRegion')"
                  v-model="formModel.firm.postAddress.region.regionName"
                />
              </q-item-section>
            </q-item>

            <!--Sevk Adresi  -->
            <q-item class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillAdres')"
                  v-model="formModel.firm.postAddress.addressDetail"
                />
              </q-item-section>
            </q-item>

            <!--Posta Kodu -->
            <q-item class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('finance.waybillPostalCode')"
                  v-model="formModel.firm.postAddress.postalCode"
                />
              </q-item-section>
            </q-item>

            <!--İrsaliye Süreci  -->
            <q-item class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
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
                  :label="$t('finance.waybillProcess')"
                  :options="invoiceTransactionTypeFiltered"
                  @filter="filterInvoiceTransaction"
                  :no-option="'Seç'"
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

            <!--Taşıyıcı Firma Kargo  -->
            <q-item class="col-lg-7 col-md-7 col-sm-7 col-xs-11">
              <q-item-section>
                <q-select
                  ref="cargoControl"
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="formModel.cargo"
                  option-value="id"
                  option-label="value"
                  :label="$t('finance.waybillTransporter')"
                  :options="waybillCargoFiltered"
                  @filter="filterWaybillCargo"
                  :rules="[(val) => val || 'Lütfen Taşıyıcı Seçin']"
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
            <q-item
              class="q-ma-none q-pa-none col-lg-1 col-md-1 col-sm-1 col-xs-1"
            >
              <q-item-section>
                <q-btn
                  flat
                  round
                  dense
                  icon="add"
                  @click="transporterFormVisible = true"
                >
                  <q-tooltip v-close-popup>{{
                    $t("finance.addTransporter")
                  }}</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

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
            :pagination="pagination"
            :loading-label="$t('loading')"
            :no-data-label="$t('nodatalabel')"
            :no-results-label="$t('noresultslabel')"
            row-key="id"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="stockcode" :props="props">
                  {{ props.row.stockCard.stockCode }}
                </q-td>
                <q-td key="stockName" :props="props">
                  {{ props.row.stockCard.stockName }}
                </q-td>
                <q-td key="serialNo" :props="props">
                  <!--{{ props.row.serialNoOnOrders[0]?.stockSerialNo.serialNo }}-->
                  <!--v-if="
                      props.row.serialNoOnOrders ||
                      props.row.serialNoOnOrders.length > 0
                    "-->
                  <q-select
                    v-if="false"
                    ref="selectOrderStatus"
                    outlined
                    use-input
                    dense
                    options-dense
                    transition-show="scale"
                    transition-hide="scale"
                    input-debounce="0"
                    v-model="props.row.selectedSerialNos"
                    multiple
                    :option-label="getOptionLabel"
                    :display-value="getDisplayValue(props)"
                    emit-value
                    map-options
                    options-cover
                    :options="props.row.serialNoOnOrders"
                    :error="getError(props) || null"
                    @update:model-value="
                      (val) => serialNoSelectChange(props.row.selectedSerialNos)
                    "
                  >
                    <template
                      v-slot:option="{ itemProps, opt, selected, toggleOption }"
                    >
                      <q-item v-bind="itemProps">
                        <q-item-section side>
                          <q-checkbox
                            :model-value="selected"
                            @update:model-value="toggleOption(opt)"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{
                            opt.stockSerialNo.serialNo
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-td>
                <q-td key="quantity" :props="props">
                  <q-input
                    v-model="props.row.quantity"
                    input-class="text-center"
                    type="number"
                    dense
                    :min="1"
                    :max="props.row.canBeSent"
                  />
                </q-td>
                <q-td key="action" :props="props">
                  <q-btn
                    dense
                    flat
                    round
                    color="negative"
                    icon="delete_forever"
                    @click="onDelete(props.row)"
                  />
                </q-td>
              </q-tr>
            </template>
            <template v-slot:top="props">
              <div class="row col-12">
                <div
                  class="col-lg-2 col-md-2 col-sm-6 col-xs-12 q-table__title"
                >
                  {{ $t("products.products") }}
                </div>
                <q-input
                  class="col-lg-2 col-md-4 col-sm-6 col-xs-12"
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
                <q-space />
                <q-btn
                  flat
                  round
                  dense
                  icon="add"
                  class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                  @click="onAdd"
                />

                <q-space />
                <q-btn
                  flat
                  round
                  dense
                  :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  @click="props.toggleFullscreen"
                  class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                />
                <q-space />
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
              <q-td :props="props">
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

    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-actions>
          <q-space />
          <q-btn
            v-if="formModel.erpWaybillId"
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
            v-if="!formModel.erpWaybillId"
            color="secondary"
            :label="$t('finance.createWaybill')"
            icon-right="send"
            text-color="white"
            class="text-capitalize q-pa-md q-mx-md"
            :style="{
              display: mode === 'details' ? 'none' : '',
            }"
            :rules="[requiredRule]"
            @click="save"
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

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
            :rows="orderItems"
            :columns="orderItemsColumns"
            :loading="loading"
            :filter="filter"
            :pagination="pagination"
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
              >
                <q-td>
                  <q-checkbox v-model="props.selected" />
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
            <!--<template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="selection" :props="props">
                    {{ props.row.selected }}
                  </q-td>
                  <q-td key="orderDate" :props="props">
                    {{ props.row.order.orderDate }}
                  </q-td>
                  <q-td key="orderNo" :props="props">
                    {{ props.row.order.orderNo }}
                  </q-td>
                  <q-td key="stockName" :props="props">
                    {{ props.row.stockCard.stockName }}
                  </q-td>
                  <q-td key="quantity" :props="props">
                    {{ props.row.quantity }}
                    <q-popup-edit v-model="props.row.quantity" v-slot="scope">
                      <q-input
                        v-model="scope.value"
                        dense
                        autofocus
                        counter
                        @keyup.enter="scope.set"
                        ref="quantityInput"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="shippedQuantity" :props="props">
                    {{ props.row.shippedQuantity }}
                  </q-td>
                  <q-td key="action" :props="props">
                    <q-btn
                      dense
                      flat
                      round
                      color="negative"
                      icon="delete_forever"
                      @click="onDelete(props.row)"
                    />
                  </q-td>
                </q-tr>
              </template>-->

            <!--<template v-slot:header-selection="props">
                <q-toggle v-model="props.selected" />
              </template>

              <template v-slot:body-selection="props">
                <q-toggle v-model="props.selected" />
              </template>-->
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
            v-if="selected.length > 0"
            color="secondary"
            :label="$t('products.addproduct')"
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

    <!-- Transporter Form Dialog -->
    <q-dialog
      v-model="transporterFormVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 70vw; max-height: 90vh">
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
          <edit-transporter-form
            class="q-pa-sm"
            v-model="currentRow"
            :mode="currentMode"
            @completed="getWaybillTransporters"
            @close="transporterFormVisible = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent, computed } from "vue";
import { useQuasar, date } from "quasar";
import EditTransporterForm from "./EditTransporterForm.vue";

export default defineComponent({
  name: "WaybillFormFromOrder",
  components: {
    EditTransporterForm,
  },
  computed: {
    orderItemsColumns() {
      return [
        {
          name: "orderDate",
          required: true,
          label: this.$t("order.orderdate"),
          align: "left",
          field: (row) => row.order.orderDate,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "orderNo",
          required: true,
          label: this.$t("order.orderno"),
          align: "left",
          field: (row) => row.order.orderNo,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "stockCode",
          required: true,
          label: this.$t("products.stockcode"),
          align: "left",
          field: (row) => row.stockCard.stockCode,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "stockName",
          required: true,
          label: this.$t("products.product"),
          align: "left",
          field: (row) => row.stockCard.stockName,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "quantity",
          required: true,
          label: this.$t("products.piece"),
          align: "left",
          field: (row) => row.quantity,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "shippedQuantity",
          required: true,
          label: this.$t("products.shippedQuantity"),
          align: "left",
          field: (row) => row.shippedQuantity,
          format: (val) => `${val}`,
          sortable: true,
        },
      ];
    },
    columns() {
      return [
        {
          name: "stockcode",
          required: true,
          label: this.$t("products.stockcode"),
          align: "left",
          field: (row) => row.stockCard.stockCode,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "stockName",
          required: true,
          label: this.$t("products.product"),
          align: "left",
          field: (row) => row.stockCard.stockName,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "serialNo",
          required: true,
          label: this.$t("products.serialNo"),
          align: "left",
          field: (row) => row.stockSerialNo.serialNo,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "quantity",
          required: true,
          label: this.$t("products.piece"),
          align: "left",
          field: (row) => row.quantity,
          format: (val) => `${val}`,
          sortable: true,
        },

        // {
        //   name: "finance.exchangeRate",
        //   required: true,
        //   label: this.$t("finance.exchangeRate"),
        //   align: "left",

        //   field: (row) => this.formModel.exchangeRate.USD,
        //   format: (val) => `${val}`,
        //   sortable: true,
        // },

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

    if (props.addwaybill == true) {
      formModel.value.id = null;
      formModel.value.invoiceTransactionType = {};
      formModel.value.firm.postAddress = formModel.value.address;
    }

    return {
      formModel,
    };
  },
  data() {
    return {
      cargoControl: null,
      formMode: "add",
      productformVisible: false,
      transporterFormVisible: false,

      loading: false,
      rows: [],
      selectedId: 0,
      selected: [],
      formVisible: false,
      deleteConfirm: false,
      currentMode: "add",
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      isGrid: false,
      orderItems: [],
      selectOrderItemFormVisible: false,

      currenciesFull: [],
      currenciesFiltered: [],

      invoiceTransactionTypeFiltered: [],
      invoiceTransactionTypeFull: [],

      waybillCargoFiltered: [],
      waybillCargoFull: [],
      firmFiltered: [],
      firmFull: [],

      requiredRule: [(v) => !!v || "Lütfen bir seçenek seçiniz"],

      pagination: {
        rowsPerPage: 20,
      },
      orderDescription: "",
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
    addwaybill: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.rows = this.formModel.waybillDetails.map((item) => {
      item.canBeSent = item.quantity - item.shippedQuantity;
      item.quantity = item.canBeSent;
      return item;
    });
    this.formModel.invoiceTransactionType = { id: 0, name: "Seç..." };
    if (this.formMode == "add") {
      this.formModel.waybillDate = date.formatDate(Date(), "YYYY-MM-DD");
      this.formModel.dispatchDate = date.formatDate(Date(), "YYYY-MM-DD");
    }

    if (this.addwaybill == true) {
      this.formModel.id = null;
      // this.$api.post("postOrderWaybill", this.formModel).then((response) => {
      //   if (response.status == 200) {
      //     let obj = this.formModel.waybillDetails.map((x) => {
      //       x.id = null;
      //       this.$logger.log("response.data.id", response.data.id);
      //       x.waybillId = response.data.id;
      //       return x;
      //     });
      //     this.$api
      //       .post("bulkCreateWayBillDetail", obj)
      //       .then((bulkcreateRes) => {
      //         let data = response.data;
      //         data.waybillDetails = bulkcreateRes.data;
      //         this.formModel.id = data.id;
      //       });
      //   }
      // });
    }

    this.orderDescription = this.formModel.description;
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

      this.getCurrency();
      this.getInvoiceTransactionType();
      this.getWaybillTransporters();
      //if (this.formMode != "add") this.getWaybilDetail();
    },
    isEquale(val, val2) {
      this.$logger.log("changes isEquale", val, val2);

      // this.$logger.log(
      //   "test",
      //   this.formModel.wayBillDate,
      //   this.formModel.dispatchDate
      // );
      return val == val2;
    },
    async serialNoSelectChange(val) {
      this.$logger.log("serialNoSelectChange", val);
      var _serialNos = [];
      this.formModel.waybillDetails.map((waybillDetail) => {
        if (waybillDetail.selectedSerialNos) {
          waybillDetail.selectedSerialNos.map((selectedSerialNo) => {
            _serialNos.push(selectedSerialNo.stockSerialNo.serialNo);
          });
        }
      });
      if (_serialNos.length > 0) {
        var serialNoOfDescripton = "";
        if (_serialNos.length == 1)
          serialNoOfDescripton = `Seri Numarası :${_serialNos[0]}`;
        else {
          serialNoOfDescripton = `Seri Numaraları : ${_serialNos[0]}`;
          for (let i = 1; i < _serialNos.length; i++) {
            const item = _serialNos[i];
            serialNoOfDescripton += ` / ${item}`;
          }
        }
        if (this.orderDescription) {
          this.formModel.description = `${this.orderDescription}\n${serialNoOfDescripton}`;
        } else {
          this.formModel.description = `${serialNoOfDescripton}`;
        }
      }
    },
    getOptionLabel(option) {
      return option.stockSerialNo.serialNo;
    },
    getError(props) {
      var hasError = true;
      try {
        /*if (props.row.selectedSerialNos?.length == props.row.quantity)
          var hasError = false;
        else hasError = true;*/
      } catch (error) {
        hasError = true;
      }

      return hasError;
    },
    getDisplayValue(props) {
      const selectedSerialNos = props.row.selectedSerialNos;
      const numSelectedSerialNos = selectedSerialNos
        ? selectedSerialNos.length
        : 0;
      return numSelectedSerialNos > 0
        ? `${numSelectedSerialNos} adet seri numarası`
        : this.$t("products.serialNos");
    },
    save() {
      if (this.formModel.cargo || this.formModel.cargo?.id >= 0) {
        if (this.formMode === "add") {
          this.$logger.log("add");
          this.postWaybillUyumSoft();
        } else if (this.formMode === "edit") {
          this.$logger.log("edit");
          this.editFormModel();
        }
      } else {
        this.$q.notify({
          progress: true,
          type: "error",
          color: "red",
          message: "Taşıyıcı Seçilmeli" /*this.$t("success")*/,
          caption: this.$t("unsuccessful"),
        });
        return;
      }
    },
    formHasError() {
      //CARGO CONTROL
      this.$refs.cargoControl.validate();
      let hasError = false;
      if (this.$refs.cargoControl.hasError) {
        hasError = true;
      }
      return hasError;
    },

    addOrderItemToWaybill() {
      this.selected = this.selected.map((item) => {
        item.canBeSent = item.quantity - item.shippedQuantity;
        item.quantity = item.canBeSent;
        return item;
      });
      this.rows.push(...this.selected);
      this.formModel.waybillDetails = this.rows;
      this.selected = [];
      this.selectOrderItemFormVisible = false;
      this.$logger.log("this.rows", this.rows);
    },

    async addFormModel() {
      this.$api.post("waybills", this.formModel).then((response) => {
        this.formModel.id = response.data.id;
        this.formModel.waybillDetails.map((wd) => {
          wd.waybillId = this.formModel.id;
          wd.stockCardId = wd.stockCard.id;
          return wd;
        });
        this.$api
          .post("bulkCreateWayBillDetail", this.formModel.waybillDetails)
          .then((response) => {
            this.orderStatusUpdate();
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: "İrsaliye Kaydedildi" /*this.$t("success")*/,
              caption: this.$t("success"),
            });
          });
      });
    },
    async postWaybillUyumSoft() {
      try {
        if (!this.formHasError()) {
          const response = this.$api
            .post("InsertWaybill/", this.formModel)
            .then((_response) => {
              //this.$logger.log(_response);
              this.$logger.log("Order Post UyumSoft", _response);

              this.formModel.invoiceTransactionType.id = 2;
              this.formModel.waybillNo = _response.data.waybillNo;
              this.formModel.ettn = _response.data.ettn;
              this.formModel.erpWaybillId = _response.data.result;
              this.formModel.ewaybill = true;
              if (_response.status == 200) {
                this.$q.notify({
                  progress: true,
                  type: "info",
                  color: "info",
                  message:
                    "İrsaliye UyumSoft'a Gönderildi\nİrsaliye Numarası : " +
                    this.formModel.waybillNo,
                  caption: this.$t("success"),
                });

                this.addFormModel();
              } else {
                this.$q.notify({
                  progress: true,
                  type: "warning",
                  color: "red",
                  message: "İrsaliye UyumSoft'a gönderilirken hata oldu.",
                  caption: this.$t("unsuccessful"),
                });
              }
            })
            .catch((error) => {
              this.$q.notify({
                progress: true,
                type: "warning",
                color: "red",
                caption: this.$t("unsuccessful"),
              });
            });
        }
      } catch (error) {
        this.$logger.log("Uyumsoft Post Order Error=>", error);
      }
    },

    async editFormModel() {
      const response = this.$api
        .put("waybills", this.formModel)
        .then((_response) => {
          this.$logger.log(_response);
          this.$logger.log("edit completed");

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message:
              "İrsaliye Numarası Alındı : " +
              this.formModel.waybillNo /*this.$t("success")*/,
            caption: this.$t("success"),
          });
        });
    },

    async orderStatusUpdate() {
      try {
        const response = this.$api
          .put("putOrderStatusUpdate/" + this.formModel.id)
          .then((_response) => {
            this.$logger.log(_response);
            this.$emit("waybillSended", this.formModel.orderId);
          });
      } catch (error) {
        this.$logger.log("orderStatusUpdate Error=>", error);
      }
    },

    async addWaybillItem() {
      for (let i = 0; i < this.formModel.waybillDetails.length; i++) {
        const item = array[i];
        item.orderId = this.formModel.orderId;
        item.waybillId = this.formModel.id;
        this.$api.post("waybillDetails", item);
      }
      this.getWaybilDetail();
    },

    async editWaybillItem() {
      //this.currentRow.orderId = this.formModel.id;
      const response = this.$api
        .put("waybillDetails", this.currentRow)
        .then((_response) => {
          this.$logger.log(response.data);
          this.$logger.log("edit completed");
          this.getWaybilDetail();
          this.productformVisible = false;

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: "İrsaliye Bilgileri Güncellendi" /*this.$t("success")*/,
            caption: this.$t("success"),
          });
        });
    },
    async getWaybilDetail() {
      this.loading = true;
      const response = this.$api
        .get(`getWaybillDetails/${this.formModel.id}`)
        .then((data) => {
          this.formModel.waybillDetails = data.data;
          this.rows = this.formModel.waybillDetails;
          this.$logger.log("waybillDetails =>", this.rows);
        });
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

    async getWaybillTransporters() {
      try {
        // Get transporter information based on firmId
        const response = await this.$api.get(
          `getTransporterInfoWithFirmId/${this.formModel.firmId}`
        );
        const transporterData = response.data;

        // Update the form model with new cargo data if transporter data is available
        if (transporterData) {
          this.formModel.cargo = {
            id: Number(transporterData.vehicleId),
            value: `${transporterData.licencePlate} - ${transporterData.driverName} ${transporterData.driverFamilyName} - ${transporterData.description}`,
          };
        }

        // Get vehicle data and map to a desired format
        const vehicleResponse = await this.$api.get("getUyumVehicle");
        const drivers = vehicleResponse.data.result.map((driver) => ({
          ...driver,
          value: `${driver.licensE_PLATE.toUpperCase() || " "} -
                    ${driver.driveR_NAME || " "} ${
            driver.driveR_FAMILY_NAME || " "
          } -
                    ${driver.description || " "}`,
        }));

        this.waybillCargoFull = drivers;

        // Set the cargo model to the corresponding vehicle ID if a matching one is found
        if (transporterData) {
          this.formModel.cargo = this.waybillCargoFull.find(
            (vehicle) =>
              vehicle.vehiclE_ID === Number(transporterData.vehicleId)
          );
        }

        // Optional console logs for debugging
        // this.$logger.log("drivers =>", this.waybillCargoFull);
        // this.$logger.log("this.formModel.cargo =>", this.formModel.cargo);
      } catch (error) {
        this.$logger.error("Error in getWaybillTransporters:", error);
      }
    },

    filterWaybillCargo(val, update) {
      if (val === "") {
        update(() => {
          this.waybillCargoFiltered = this.waybillCargoFull;
        });
        return;
      }

      update(() => {
        this.waybillCargoFiltered = this.waybillCargoFull.filter(
          (v) => v.value.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getFirm() {
      const response = this.$api.get("firms").then((data) => {
        this.firmFull = data.data;
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
        this.firmFiltered = this.firmFull.filter(
          (v) => v.commercialTitle.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
        //this.$logger.log("this.firmFiltered", this.firmFiltered);
      });
    },
    async firmSelected(val) {
      this.$logger.log(val);
      this.formModel.firmId = val.id;
      /*this.formModel.paymentTerm = this.paymentTermFull.find(
        (pt) => pt.id == val.paymentTermId
      );
      this.formModel.order.currency = this.currenciesFull.find(
        (c) => c.id == val.currencyId
      );*/
      this.getFirmPostAddress(val.postAddressId);
    },

    async getFirmPostAddress(addressId) {
      const response = this.$api
        .get("getAddressById/" + addressId)
        .then((data) => {
          this.$logger.log(data.data);
          this.formModel.firm.postAddress = data.data;
          this.$logger.log("this.formModel.address", this.formModel);
        });
    },
    getSelectedString() {
      return this.selected.length === 0
        ? ""
        : `${this.orderItems.length} üründen ${this.selected.length} adet seçildi`;
    },

    onAdd() {
      // this.maximizedToggle = false;
      // this.currentRow = {};
      // this.currentMode = "add";
      // this.productformVisible = true;
      //getOrderItemsByFirm

      this.$api
        .get("getOrderItemsByFirm/" + this.formModel.firmId)
        .then((data) => {
          this.$logger.log("getOrderItemsByFirm", data.data); //date.formatDate(Date(), "YYYY-MM-DD");
          this.orderItems = data.data
            .filter((orderItem) => {
              //item.order.id !== this.formModel.orderId
              return !this.formModel.waybillDetails.some(
                (waybillItem) => waybillItem.id === orderItem.id
              );
            })
            .map((item) => {
              item.order.orderDate = date.formatDate(
                item.order.orderDate,
                "DD.MM.YYYY"
              );
              return item;
            });
          this.selectOrderItemFormVisible = true;
          //this.rows = data.data;
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
      this.productformVisible = true;
    },
    onEdit(user) {
      this.maximizedToggle = false;
      this.currentRow = user; /*Object.assign(
        {},
        this.rows.find((row) => row.id === id)
      );*/
      this.currentMode = "edit";
      this.productformVisible = true;
    },
    onDelete(item) {
      //formmodel.waybillDetail içindeki item silinmeli

      this.formModel.waybillDetails = this.formModel.waybillDetails.filter(
        (x) => x.id != item.id
      );
      this.rows = this.formModel.waybillDetails;
    },
    onFormCompleted() {
      this.productformVisible = false;
      this.$logger.log("form completed");
      getUsers();
      // await this.$api.post("Kullanici/Kaydet", model);
    },
  },
});
</script>
