<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>

<template>
  <div class="row q-pa-md">
    <q-card class="col-12">
      <div class="row q-col-gutter-md q-pa-md">
        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12">
          <q-card flat bordered>
            <q-card-section class="q-pa-sm">
              <q-list class="row">
                <!-- Başlangıç Tarihi Seçimi -->
                <q-item class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                  <q-item-section>
                    <q-input filled v-model="startDate">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="startDate" mask="YYYY-MM-DD HH:mm">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>

                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-time
                              v-model="startDate"
                              mask="YYYY-MM-DD HH:mm"
                              format24h
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>

                <!-- Bitiş Tarihi Seçimi -->
                <q-item class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                  <q-item-section>
                    <q-input filled v-model="endDate">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="endDate" mask="YYYY-MM-DD HH:mm">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>

                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-time
                              v-model="endDate"
                              mask="YYYY-MM-DD HH:mm"
                              format24h
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>

                <!-- Bayi Seçimi -->
                <q-item class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                  <q-item-section>
                    <q-select
                      v-model="selectedDealers"
                      :options="filteredDealers"
                      option-value="id"
                      option-label="name"
                      :label="$t('dealer.dealers')"
                      :loading="loading"
                      hide-selected
                      map-options
                      multiple
                      clearable
                      outlined
                      dense
                      options-dense
                      use-input
                      style="width: 100%"
                      transition-show="scale"
                      transition-hide="scale"
                      @filter="
                        (val, update) =>
                          filterList(val, update, 'dealers', 'filteredDealers')
                      "
                    >
                      <template #prepend>
                        <q-icon name="groups" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>

                <!-- Bölge Seçimi -->
                <q-item class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                  <q-item-section>
                    <q-select
                      v-model="selectedRegions"
                      :options="filteredRegions"
                      option-value="id"
                      option-label="name"
                      :label="$t('region.regions')"
                      :loading="loading"
                      hide-selected
                      multiple
                      clearable
                      outlined
                      dense
                      options-dense
                      use-input
                      style="width: 100%"
                      transition-show="scale"
                      transition-hide="scale"
                      @filter="
                        (val, update) =>
                          filterList(val, update, 'regions', 'filteredRegions')
                      "
                    >
                      <template #prepend>
                        <q-icon name="location_on" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>

                <!-- İstasyon Seçimi -->
                <q-item class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                  <q-item-section>
                    <q-select
                      v-model="selectedStations"
                      :options="filteredStations"
                      option-value="id"
                      option-label="name"
                      :label="$t('station.stations')"
                      :loading="loading"
                      hide-selected
                      map-options
                      multiple
                      clearable
                      outlined
                      dense
                      options-dense
                      use-input
                      style="width: 100%"
                      transition-show="scale"
                      transition-hide="scale"
                      @filter="
                        (val, update) =>
                          filterList(
                            val,
                            update,
                            'stations',
                            'filteredStations',
                          )
                      "
                    >
                      <template #prepend>
                        <q-icon name="ev_station" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>

                <!-- Kullanıcılar Seçimi -->
                <q-item class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                  <q-item-section>
                    <q-select
                      v-model="selectedCustomers"
                      :options="filteredCustomers"
                      option-value="id"
                      :option-label="customersLabel"
                      :label="$t('users.users')"
                      :loading="loading"
                      hide-selected
                      map-options
                      multiple
                      clearable
                      outlined
                      dense
                      options-dense
                      use-input
                      style="width: 100%"
                      transition-show="scale"
                      transition-hide="scale"
                      @filter="filterCustomers"
                    >
                      <template #prepend>
                        <q-icon name="person" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>

                <!-- Araçlar Seçimi -->
                <q-item class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                  <q-item-section>
                    <q-select
                      v-model="selectedVehicles"
                      :options="filteredVehicles"
                      option-value="id"
                      option-label="licensePlate"
                      :label="$t('vehicle.vehicles')"
                      :loading="loading"
                      hide-selected
                      map-options
                      multiple
                      clearable
                      outlined
                      dense
                      options-dense
                      use-input
                      style="width: 100%"
                      transition-show="scale"
                      transition-hide="scale"
                      @filter="filterLicensePlate"
                    >
                      <template #prepend>
                        <q-icon name="electric_car" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>

                <!-- 0 kWh  -->
                <q-item class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                  <q-item-section>
                    <div class="text-caption text-grey q-mb-xs">
                      {{ $t("reports.onlyZeroKwh") }}
                    </div>

                    <q-checkbox
                      v-model="zerokwh"
                      color="primary"
                      dense
                      :label="$t('reports.onlyZeroKwh')"
                    />
                  </q-item-section>
                </q-item>
                <q-space />
                <!-- Toplam Kwh ve Tutar Kart -->
                <div class="row q-ml-auto">
                  <q-card class="col-12">
                    <q-list class="row justify-between">
                      <q-item>
                        <q-item-section>
                          <q-item-label
                            class="text-subtitle2 text-weight-medium"
                          >
                            {{ $t("reports.totalkWh") }}:
                          </q-item-label>
                          <q-item-label class="text-h6 text-primary">
                            {{
                              rows.length
                                ? rows
                                    .reduce(
                                      (acc, r) =>
                                        acc + Number(r.totalEnergy ?? 0),
                                      0,
                                    )
                                    .toLocaleString("tr-TR", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                : "0.00"
                            }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label
                            class="text-subtitle2 text-weight-medium"
                          >
                            {{ $t("reports.totalAmount") }}:
                          </q-item-label>
                          <q-item-label class="text-h6 text-positive">
                            {{
                              rows.length
                                ? rows
                                    .reduce(
                                      (acc, r) => acc + Number(r.amount ?? 0),
                                      0,
                                    )
                                    .toLocaleString("tr-TR", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }) + " ₺"
                                : "0.00 ₺"
                            }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </div>

                <q-space />

                <!-- Listele  -->
                <q-item class="col-lg-2 col-md-4 col-sm-6 col-xs-12 q-ml-auto">
                  <q-item-section>
                    <q-btn
                      color="primary"
                      class="full-width"
                      :label="$t('Listele')"
                      @click="getList"
                    >
                      <q-tooltip>
                        {{ $t("list") }}
                      </q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12">
          <q-card flat bordered>
            <q-card-section class="q-pa-sm">
              <!-- Ödeme Durumu  -->
              <q-select
                v-model="selectedPaymentStatuses"
                :options="filteredPaymentStatuses"
                option-value="id"
                option-label="name"
                :label="$t('firm.paymentStatus')"
                :loading="loading"
                multiple
                hide-selected
                clearable
                outlined
                dense
                options-dense
                use-input
                style="width: 100%"
                transition-show="scale"
                transition-hide="scale"
                @filter="
                  (val, update) =>
                    filterList(
                      val,
                      update,
                      'paymentStatuses',
                      'filteredPaymentStatuses',
                    )
                "
                @update:model-value="onLocalFilterChanged"
              >
                <template #prepend> <q-icon name="money" /> </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label :style="{ color: scope.opt.color }">
                        {{ scope.opt.name }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template #body-cell-stationName="props">
                  <q-td :props="props">
                    <span
                      class="text-primary cursor-pointer text-weight-medium"
                    >
                      {{ props.row?.name || props.row?.station?.name || "-" }}

                      <q-tooltip anchor="bottom middle" self="top middle">
                        <div class="column q-gutter-xs">
                          <div>
                            <strong
                              >{{ $t("dealer.dealer") || "Bayi" }}:</strong
                            >
                            {{
                              props.row?.dealer?.name ||
                              props.row?.station?.dealer?.name ||
                              "-"
                            }}
                          </div>

                          <div>
                            <strong
                              >{{ $t("region.region") || "Bölge" }}:</strong
                            >
                            {{
                              props.row?.stationRegion?.name ||
                              props.row?.station?.stationRegion?.name ||
                              "-"
                            }}
                          </div>
                        </div>
                      </q-tooltip>
                    </span>
                  </q-td>
                </template>
              </q-select>
              <!-- Fatura Durumu  -->
              <div class="q-mt-md">
                <div class="text-caption text-grey q-mb-xs">
                  {{ $t("firm.invoice") || "Fatura Durumu" }}
                </div>
                <q-option-group
                  v-model="selectedInvoiceStatuses"
                  :options="invoiceStatusOptions"
                  type="checkbox"
                  color="primary"
                  dense
                  inline
                  class="option-inline-wrap"
                  @update:model-value="onLocalFilterChanged"
                />
              </div>
              <!-- Bireysel/Kurumsal  -->
              <div class="q-mt-md">
                <div class="text-caption text-grey q-mb-xs">
                  {{ $t("firm.companyType") }}
                </div>
                <q-option-group
                  v-model="selectedCorporate"
                  :options="isCorporateOptions"
                  type="checkbox"
                  color="primary"
                  dense
                  inline
                  class="option-inline-wrap"
                  @update:model-value="onLocalFilterChanged"
                />
              </div>

              <!-- İsimsiz İşlemler -->
              <div class="q-mt-md">
                <div class="text-caption text-grey q-mb-xs">
                  {{ $t("reports.onlyNoNameTransactions") }}
                </div>
                <q-checkbox
                  v-model="noNameTransactions"
                  color="primary"
                  dense
                  :label="$t('reports.onlyNoNameTransactions')"
                  @update:model-value="onLocalFilterChanged"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card>
  </div>

  <!-- TABLO -->
  <div class="q-pa-md">
    <q-table
      ref="table"
      flat
      dense
      bordered
      :rows="rows"
      :columns="
        columns.filter(
          (col) =>
            col.name !== 'startedSource' &&
            col.name !== 'personel' &&
            col.name !== 'epdkSessionId' &&
            col.name !== 'epdkStartSessionTime' &&
            col.name !== 'epdkStopSessionTime' &&
            col.name !== 'epdkConsumedEnergyInfoId' &&
            col.name !== 'epdkConsumedEnergyInfoTime',
        )
      "
      :loading="loading"
      :filter="filter"
      :pagination="pagination"
      :loading-label="$t('loading')"
      :no-data-label="$t('nodatalabel')"
      :no-results-label="$t('noresultslabel')"
      row-key="id"
    >
      <template v-slot:top="props">
        <div class="row col-12">
          <div
            class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title"
          ></div>
          <q-space />
          <q-input
            class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
            bottom-slots
            dense
            debounce="300"
            v-model="filter"
            :placeholder="$t('users.search')"
          >
            <template v-slot:append>
              <q-icon
                v-if="filter !== ''"
                name="close"
                @click="filter = ''"
                class="cursor-pointer"
              />
              <q-icon name="search" />
            </template>
          </q-input>
          <q-space />
          <!-- Yenileme Butonu -->
          <q-btn
            flat
            round
            dense
            icon="refresh"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="getList"
          >
            <q-tooltip>
              {{ $t("refresh") }}
            </q-tooltip>
          </q-btn>
          <q-space />
          <!-- Otomatik yenileme Butonu -->
          <q-item class="row">
            <q-input
              type="number"
              v-model.number="autoRefreshInterval"
              class="col-lg-8 col-md-8 col-sm-8 col-xs-12"
              dense
              outlined
              :label="$t('reports.autoRefreshInterval')"
              @update:model-value="getAutoRefresh"
            />

            <q-btn
              :color="autoRefreshEnable ? 'positive' : ''"
              flat
              round
              dense
              icon="auto_mode"
              class="col-lg-4 col-md-4 col-sm-4 col-xs-12"
              @click="autoRefresh"
            >
              <q-tooltip>
                {{ $t("autoRefresh") }}
              </q-tooltip>
            </q-btn>
          </q-item>
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
          <!-- Excel export butonu -->
          <q-btn
            :label="$t('export')"
            class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
            icon="cloud_download"
            @click="exportTable"
          />
        </div>
      </template>

      <template #body-cell-stationName="props">
        <q-td :props="props">
          <span class="text-primary cursor-pointer">
            {{ props.row?.station?.name || "-" }}
            <q-tooltip anchor="bottom middle" self="top middle">
              <div class="column">
                <div>
                  <strong>{{ $t("dealer.dealer") || "Bayi" }}:</strong>
                  {{
                    props.row?.station?.dealer?.name ||
                    props.row?.dealer?.name ||
                    "-"
                  }}
                </div>
                <div>
                  <strong>{{ $t("region.region") || "Bölge" }}:</strong>
                  {{
                    props.row?.station?.stationRegion?.name ||
                    props.row?.region?.name ||
                    "-"
                  }}
                </div>
              </div>
            </q-tooltip>
          </span>
        </q-td>
      </template>

      <template #body-cell-billingPlan="props">
        <q-td :props="props">
          <span>
            {{ $t(props.row?.billingPlan) }}
          </span>
        </q-td>
      </template>

      <template #body-cell-reportPlan="props">
        <q-td :props="props">
          <span>
            {{ $t(props.row?.reportPlan) }}
          </span>
        </q-td>
      </template>

      <template #body-cell-paymentStatus="props">
        <q-td :props="props">
          <q-icon
            v-if="props.row?.customer?.allowWithoutPreauth === true"
            name="key_off"
            color="primary"
            size="18px"
            class="q-mr-xs"
          >
            <q-tooltip>
              {{ $t("nonPreauthorizedTransaction") }}
            </q-tooltip>
          </q-icon>
          <q-icon
            name="account_balance_wallet"
            size="18px"
            class="cursor-pointer text-primary"
            @click="viewPaymentProcess(props.row)"
          >
            <q-tooltip>
              {{ $t("firm.viewPaymentDetails") }}
            </q-tooltip>
          </q-icon>
          <span
            :style="{
              fontWeight: 500,
              color:
                Array.isArray(props.row.payments) &&
                props.row.payments.length > 0
                  ? props.row.payments[0]?.paymentStatus?.color
                  : '',
            }"
          >
            {{ props.value }}

            <q-tooltip
              v-if="
                Array.isArray(props.row.payments) &&
                props.row.payments.length > 0 &&
                props.row.payments[0]?.paymentStatus?.id === 7 &&
                (props.row.payments[0]?.description || '').trim()
              "
              anchor="bottom middle"
              self="top middle"
            >
              {{ (props.row.payments[0]?.description || "").trim() }}
            </q-tooltip>

            <q-tooltip
              v-if="
                props.row.payments[0]?.paymentStatus?.id === 2 ||
                props.row.payments[0]?.paymentStatus?.id === 6
              "
              anchor="bottom middle"
              self="top middle"
            >
              Provizyon Tutarı:
              {{ props.row.payments[0]?.preauthAmount || 0 }}
              {{ props.row.payments[0]?.currency.symbol || "₺" }}
            </q-tooltip>
          </span>
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          <span> {{ message }}... </span>
        </div>
      </template>

      <template #body-cell-epdkActions="props">
        <q-td :props="props">
          <div v-if="props.row.reportPlan !== 'OUT_OF_REPORT'">
            <q-btn
              size="sm"
              flat
              icon="play_circle"
              :color="props.row.isEpdkStartSession ? 'green' : 'amber'"
            >
              <q-tooltip>
                {{ `Başlangıç Bildirimi` }}
                {{
                  props.row.isEpdkStartSession
                    ? `Gönderildi. ID = ${
                        props.row.epdkSessionId
                      } / Zaman: ${formatEpdkDate(
                        props.row.epdkStartSessionTime,
                      )}`
                    : "Gönderilmedi"
                }}
              </q-tooltip>
            </q-btn>

            <q-btn
              size="sm"
              flat
              icon="stop_circle"
              :color="props.row.isEpdkStopSession ? 'green' : 'amber'"
            >
              <q-tooltip>
                {{ `Bitiş Bildirimi` }}
                {{
                  props.row.isEpdkStopSession
                    ? `Gönderildi. Zaman: ${formatEpdkDate(
                        props.row.epdkStopSessionTime,
                      )}`
                    : "Gönderilmedi"
                }}
              </q-tooltip>
            </q-btn>

            <q-btn
              size="sm"
              flat
              icon="energy_savings_leaf"
              :color="props.row.isEpdkConsumedEnergyInfo ? 'green' : 'amber'"
            >
              <q-tooltip>
                {{ `Enerji Tüketim Bildirimi` }}
                {{
                  props.row.isEpdkConsumedEnergyInfo
                    ? `Gönderildi. ID = ${
                        props.row.epdkConsumedEnergyInfoId
                      } /  Zaman: ${formatEpdkDate(
                        props.row.epdkConsumedEnergyInfoTime,
                      )}`
                    : "Gönderilmedi"
                }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template #body-cell-EInvoiceNumber="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <span
              :class="{ 'text-negative': props.row?.isInvoiceSent === false }"
            >
              {{
                props.row.invoices?.length
                  ? props.row.invoices[0]?.invoiceNo || "-"
                  : props.row.EInvoiceNumber || "-"
              }}
            </span>

            <a
              v-if="
                (props.row.invoices?.[0]?.invoiceUrl || '').trim().length > 0
              "
              :href="props.row.invoices[0].invoiceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="q-ml-xs"
            >
              <q-icon
                name="visibility"
                size="18px"
                class="cursor-pointer text-primary"
              >
                <q-tooltip>
                  {{ $t("firm.viewInvoice") || "Faturayı Görüntüle" }}
                </q-tooltip>
              </q-icon>
            </a>
          </div>
        </q-td>
      </template>

      <template #body-cell-action="props">
        <q-td :props="props">
          <div
            v-if="
              props.row.billingPlan !== 'OUT_OF_BILLING' &&
              props.row.billingPlan !== 'WEEKLY_BILLING'
            "
          >
            <q-btn
              v-if="
                props.row.chargeTransactionStatusId !== 1 &&
                props.row.chargeTransactionStatusId !== 4 &&
                props.row.chargeTransactionStatusId !== 5 &&
                props.row.isInvoiceSent !== true
              "
              flat
              size="sm"
              :icon="'receipt'"
              :color="
                (Array.isArray(props.row.invoices) &&
                  props.row.invoices.length > 0) ||
                props.row.EInvoiceNumber
                  ? 'green'
                  : 'amber'
              "
              @click="sendInvoice(props.row)"
            >
              <q-tooltip>
                {{
                  (Array.isArray(props.row.invoices) &&
                    props.row.invoices.length > 0) ||
                  props.row.EInvoiceNumber
                    ? $t("reports.sendInvoiceSuccess")
                    : $t("sendInvoice")
                }}
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="
                (!props.row?.payments[0]?.voidPreauth &&
                  props.row.chargeTransactionStatusId !== 1 &&
                  props.row.chargeTransactionStatusId !== 4 &&
                  props.row.chargeTransactionStatusId !== 5 &&
                  props.row.payments.length == 0) ||
                props.row.payments[0]?.paymentStatusId === 7 ||
                props.row.payments[0]?.paymentStatusId === 4
              "
              size="sm"
              flat
              icon="credit_card"
              :color="
                Array.isArray(props.row.payments) &&
                props.row.payments.length > 0
                  ? props.row.payments[0]?.paymentStatus?.id === 7
                    ? 'red'
                    : 'green'
                  : 'amber'
              "
              :disabled="
                Array.isArray(props.row.payments) &&
                props.row.payments.length > 0 &&
                props.row.payments[0]?.paymentStatus?.id !== 7 &&
                props.row.payments[0]?.paymentStatus?.id !== 4
              "
              @click="confirmPayment(props.row)"
            >
              <q-tooltip>
                {{
                  Array.isArray(props.row.payments) &&
                  props.row.payments?.length > 0
                    ? props.row.payments[0]?.paymentStatus?.id === 7
                      ? $t("getPaymentError")
                      : $t("getPaymentSuccess")
                    : $t("getPayment")
                }}
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="props.row.payments[0]?.paymentStatusId === 6"
              size="sm"
              flat
              icon="replay"
              color="indigo-8"
              @click="refundPayment(props.row)"
            >
              <q-tooltip>
                {{ $t("refundPayment") }}
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="
                props.row.chargeTransactionStatusId !== 1 &&
                props.row.chargeTransactionStatusId !== 3 &&
                props.row.chargeTransactionStatusId !== 4 &&
                props.row.chargeTransactionStatusId !== 5 &&
                props.row.payments[0]?.paymentStatusId === 2
              "
              size="sm"
              flat
              icon="price_check"
              :color="
                Array.isArray(props.row.payments) &&
                props.row.payments.length > 0
                  ? props.row.payments[0]?.paymentStatus?.id === 7
                    ? 'blue'
                    : 'green'
                  : 'amber'
              "
              @click="capturePreauth(props.row)"
            >
              <q-tooltip>
                {{ $t("capturePreauth") }}
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="
                (props.row.billingPlan || '').includes('INSTANT') &&
                (props.row.payments?.[0]?.preauthAmount ?? 0) > 0
              "
              size="sm"
              flat
              icon="money_off"
              color="blue"
              @click="voidPreauth(props.row)"
            >
              <q-tooltip>
                {{ $t("voidPreauth") }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template #body-cell-customerInfo="props">
        <q-td :props="props" class="text-center">
          <q-btn flat dense round icon="more_vert" color="primary" size="sm">
            <q-menu transition-show="scale" transition-hide="scale">
              <q-list style="min-width: 220px">
                <q-item>
                  <q-item-section class="items-center text-center">
                    <div class="text-caption text-grey">
                      {{ $t("reports.phone") }}
                    </div>
                    <div class="text-weight-medium">
                      {{ props.row.customer?.phone || "-" }}
                    </div>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item>
                  <q-item-section>
                    <div class="row justify-center q-gutter-sm">
                      <q-btn
                        flat
                        dense
                        round
                        icon="chat"
                        color="green"
                        size="m"
                        :disable="!props.row.customer?.phone"
                        @click="openWhatsApp(props.row.customer?.phone)"
                      >
                        <q-tooltip>
                          {{ $t("reports.whatsapp") }}
                        </q-tooltip>
                      </q-btn>

                      <q-btn
                        flat
                        dense
                        round
                        icon="call"
                        color="green"
                        size="m"
                        :disable="!props.row.customer?.phone"
                        @click="callPhone(props.row.customer?.phone)"
                      >
                        <q-tooltip>
                          {{ $t("reports.phone") }}
                        </q-tooltip>
                      </q-btn>

                      <q-btn
                        flat
                        dense
                        round
                        icon="mail"
                        color="indigo"
                        size="m"
                        :disable="!props.row.customer?.email"
                        @click="sendMail(props.row.customer?.email)"
                      >
                        <q-tooltip>
                          {{ $t("reports.mail") }}
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>

            <q-tooltip>
              {{ $t("reports.customerInfo") }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-price="props">
        <q-td :props="props">
          <span v-if="props.row.discountRate > 0">
            <s>{{ props.row.price }}</s>
            <span class="q-ml-sm">{{ props.row.discountedUnitPrice }}</span>
          </span>
          <span v-else>
            {{ props.row.price }}
          </span>
        </q-td>
      </template>

      <template #body-cell-nameSurname="props">
        <q-td :props="props" class="text-center">
          <div class="row no-wrap q-gutter-xs">
            <q-icon
              v-if="props.row.startedSourceId === 1"
              name="smartphone"
              size="18px"
              class="cursor-pointer text-primary"
            >
              <q-tooltip>{{ props.row.startedSource?.name }}</q-tooltip>
            </q-icon>

            <q-icon
              v-else-if="props.row.startedSourceId === 2"
              name="support_agent"
              size="18px"
              class="cursor-pointer text-indigo"
            >
              <q-tooltip
                >{{ props.row.startedByEmployee?.name }}
                {{ props.row.startedByEmployee?.surname }}</q-tooltip
              >
            </q-icon>

            <q-icon
              v-else-if="props.row.startedSourceId === 3"
              name="nfc"
              size="18px"
              class="cursor-pointer text-teal"
            >
              <q-tooltip>{{ props.row.startedSource?.name }}</q-tooltip>
            </q-icon>

            <q-icon
              v-else-if="props.row.startedSourceId === 4"
              name="password"
              size="18px"
              class="cursor-pointer text-grey-8"
            >
              <q-tooltip>{{ props.row.startedSource?.name }}</q-tooltip>
            </q-icon>

            <q-icon
              v-else-if="props.row.startedSourceId === 5"
              name="ev_station"
              size="18px"
              class="cursor-pointer text-green"
            >
              <q-tooltip>{{ props.row.startedSource?.name }}</q-tooltip>
            </q-icon>

            <q-icon
              v-else-if="props.row.startedSourceId === 6"
              name="settings_ethernet"
              size="18px"
              class="cursor-pointer text-orange"
            >
              <q-tooltip>{{ props.row.startedSource?.name }}</q-tooltip>
            </q-icon>

            <q-icon
              v-else
              name="help_outline"
              size="18px"
              class="cursor-pointer text-grey"
            >
            </q-icon>
            <span>
              {{
                `${props.row.customer?.name || ""} ${
                  props.row.customer?.surname || ""
                }`.trim() || "-"
              }}
            </span>
          </div>
        </q-td>
      </template>
    </q-table>
  </div>

  <!-- Ödeme Onay Dialogu -->
  <q-dialog v-model="paymentDialogVisible" persistent>
    <q-card style="width: 90vw; max-width: 900px; min-width: 360px">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ $t("getPayment") }}</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          :disable="paymentDialogLoading"
        />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 60vh; overflow: auto">
        <div class="q-pa-md full-width">
          <div class="text-h6 full-width" style="line-height: 1.8">
            <span class="text-weight-bold text-primary">
              {{ paymentDialogData.name }}
            </span>

            <span> adına </span>

            <span class="text-weight-bold text-primary">
              {{ paymentDialogData.date }}
            </span>

            <span> tarihli </span>

            <span class="text-weight-bold text-primary">
              {{ paymentDialogData.amount }}
            </span>

            <span> tutarındaki ödeme alınacak. Onaylıyor musunuz? </span>
            <br />

            <span v-if="paymentDialogData.preauthAmount"
              >Provizyon Tutarı:
            </span>
            <span
              v-if="paymentDialogData.preauthAmount"
              class="text-weight-bold text-primary"
            >
              {{ paymentDialogData.preauthAmount }}
            </span>
          </div>
        </div>
      </q-card-section>

      <q-inner-loading :showing="paymentDialogLoading">
        <q-spinner />
      </q-inner-loading>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          v-close-popup
          :disable="paymentDialogLoading"
        />
        <q-btn
          color="primary"
          :label="$t('confirm')"
          @click="onConfirmPayment"
          :loading="paymentDialogLoading"
          :disable="paymentDialogLoading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Ödeme Süreci Dialogu -->
  <q-dialog v-model="paymentProcessDialogVisible" persistent>
    <q-card style="width: 90vw; max-width: 900px; min-width: 360px">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ $t("firm.paymentDetails") }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 70vh; overflow: auto">
        <q-list bordered class="rounded-borders">
          <q-item>
            <q-item-section avatar>
              <q-icon name="history" color="black" size="20px" />
            </q-item-section>

            <q-item-section class="col-2">
              <q-item-label class="q-mt-sm">{{ $t("preauth") }}</q-item-label>
            </q-item-section>

            <q-item-section class="col-2">
              <q-item-label>
                <span class="text-weight-medium">
                  {{
                    paymentSelectedRow?.payments?.[0]?.preauthDate
                      ? dateFormat(paymentSelectedRow.payments[0].preauthDate)
                      : "-"
                  }}
                </span>
              </q-item-label>
            </q-item-section>

            <q-item-section class="col-1">
              <q-item-label>
                <span class="text-weight-medium">{{
                  paymentSelectedRow?.payments?.[0]?.preauthAmount || "-"
                }}</span>
                <span> TL</span>
              </q-item-label>
            </q-item-section>
            <q-item-section class="col-6">
              <q-item-label>
                <span class="text-weight-medium">{{
                  paymentSelectedRow?.payments?.[0]?.preauthReferansNo || "-"
                }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item
            v-if="paymentSelectedRow?.payments?.[0]?.voidPreauth === true"
          >
            <q-item-section avatar>
              <q-icon name="cancel" color="black" size="20px" />
            </q-item-section>

            <q-item-section class="col-2">
              <q-item-label class="q-mt-sm">{{
                $t("voidPreauthReport")
              }}</q-item-label>
            </q-item-section>

            <q-item-section class="col-2">
              <q-item-label>
                <span class="text-weight-medium">
                  {{
                    paymentSelectedRow?.payments?.[0]?.voidPreauthDate
                      ? dateFormat(
                          paymentSelectedRow.payments[0].voidPreauthDate,
                        )
                      : "-"
                  }}
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item>
            <q-item-section avatar>
              <q-icon name="payment" color="black" size="20px" />
            </q-item-section>

            <q-item-section class="col-2">
              <q-item-label class="q-mt-sm">{{
                $t("callCenter.payment")
              }}</q-item-label>
            </q-item-section>

            <q-item-section class="col-2">
              <q-item-label>
                <span class="text-weight-medium">{{
                  paymentSelectedRow?.payments?.[0]?.paymentDate
                    ? dateFormat(paymentSelectedRow.payments[0].paymentDate)
                    : "-"
                }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section class="col-1">
              <q-item-label>
                <span class="text-weight-medium">{{
                  paymentSelectedRow.paymentAmount || "-"
                }}</span>
                <span> TL</span>
              </q-item-label>
            </q-item-section>
            <q-item-section class="col-6">
              <q-item-label>
                <span class="text-weight-medium">{{
                  paymentSelectedRow.payments[0]?.documentNo || "-"
                }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />

          <q-item>
            <q-item-section avatar>
              <q-icon name="replay" color="black" size="20px" />
            </q-item-section>

            <q-item-section class="col-2">
              <q-item-label class="q-mt-sm">{{ $t("refund") }}</q-item-label>
            </q-item-section>

            <q-item-section class="col-2">
              <q-item-label>
                <span class="text-weight-medium">{{
                  paymentSelectedRow.payments[0]?.refundDate || "-"
                }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section class="col-1">
              <q-item-label>
                <span class="text-weight-medium">{{
                  paymentSelectedRow.payments[0]?.refundedAmount || "-"
                }}</span>
                <span> TL</span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="refundDialogVisible" persistent>
    <q-card style="width: 90vw; max-width: 520px; min-width: 320px">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ $t("refundPayment") }}</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          :disable="refundDialogLoading"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          v-model="refundDialogData.merchantOid"
          label="Document No"
          outlined
          readonly
          class="q-mb-md"
        />

        <q-input
          v-model.number="refundDialogData.amount"
          type="number"
          :min="0"
          :step="0.01"
          :max="Number(paymentSelectedRow?.paymentAmount ?? 0)"
          :rules="[
            (val) => Number(val) > 0,
            (val) =>
              Number(val) <= Number(paymentSelectedRow?.paymentAmount ?? 0),
          ]"
          :label="$t('paymentTransactions.refundAmount')"
          outlined
        />
      </q-card-section>

      <q-inner-loading :showing="refundDialogLoading">
        <q-spinner />
      </q-inner-loading>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          v-close-popup
          :disable="refundDialogLoading"
        />
        <q-btn
          color="primary"
          :label="$t('confirm')"
          @click="confirmRefundPayment"
          :loading="refundDialogLoading"
          :disable="refundDialogLoading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>

<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import * as XLSX from "xlsx";

export default defineComponent({
  components: {},

  computed: {
    columns() {
      return [
        {
          name: "id",
          label: "id",
          align: "left",
          field: "id",
          sortable: true,
        },
        {
          name: "transactionId",
          label: this.$t("station.transactionId"),
          field: "transactionId",
          align: "left",
        },
        {
          name: "stationName",
          label: this.$t("station.stationName"),
          align: "left",
          sortable: true,
          field: (row) => row.station.name,
        },
        {
          name: "startTime",
          label: this.$t("startDate"),
          align: "left",
          sortable: true,
          field: (row) => this.dateFormat(row.startTime),
        },
        {
          name: "endTime",
          label: this.$t("endDate"),
          align: "left",
          sortable: true,
          field: (row) =>
            row.endTime == null ? "" : this.dateFormat(row.endTime),
        },
        {
          name: "startedSource",
          label: this.$t("callCenter.source"),
          align: "left",
          field: (row) => row.startedSource?.name || "",
        },
        {
          name: "personel",
          label: this.$t("users.employee"),
          align: "left",
          field: (row) =>
            `${row.startedByEmployee?.name || ""} ${
              row.startedByEmployee?.surname || ""
            }`,
        },
        {
          name: "nameSurname",
          label: this.$t("users.nameSurname"),
          align: "left",
          sortable: true,
          field: (row) =>
            `${row.customer?.name || ""} ${row.customer?.surname || ""}`,
        },
        {
          name: "customerInfo",
          label: this.$t("reports.customerInfo") || "Ek Bilgiler",
          align: "center",
          sortable: false,
        },
        {
          name: "licensePlate",
          label: this.$t("vehicle.licensePlate"),
          align: "center",
          sortable: true,
          field: (row) => row.vehicle?.licensePlate,
        },
        {
          name: "Status",
          label: this.$t("status"),
          align: "left",
          sortable: true,
          field: (row) => row.chargeTransactionStatus?.name,
        },
        {
          name: "totalEnergy",
          label: this.$t("reports.totalkWh"),
          align: "left",
          sortable: true,
          style: "padding-right: 20px;",
          field: (row) => (row.totalEnergy ?? 0).toFixed(2),
        },

        {
          name: "chargeSpeed",
          label: this.$t("reports.chargeSpeed"),
          align: "left",
          sortable: true,
          field: (row) =>
            this.calcKWh(row.startTime, row.endTime, row.totalEnergy),
        },
        {
          name: "price",
          label: this.$t("priceList.tariff"),
          align: "left",
          field: (row) => `${row.price}`,
        },
        {
          name: "UserAmount",
          label: this.$t("finance.balance"),
          align: "right",
          sortable: true,
          field: (row) => (row.amount ?? 0).toFixed(2) + " ₺",
        },
        {
          name: "DiscountRate",
          label: this.$t("discountList.discount"),
          align: "right",
          sortable: true,
          field: (row) => (row.discountRate ? `${row.discountRate} %` : ""),
        },
        {
          name: "paymentAmount",
          label: this.$t("reports.totalAmount"),
          align: "right",
          sortable: true,
          field: (row) => (row.paymentAmount ?? 0).toFixed(2) + " ₺",
        },
        {
          name: "paymentStatus",
          label: this.$t("firm.paymentStatus"),
          align: "left",
          sortable: true,
          field: (row) =>
            row.payments.length > 0
              ? row?.payments[0]?.paymentStatus.name
              : this.$t("firm.paymentNotReceived"),
        },
        {
          name: "paymentDate",
          label: this.$t("reports.paymentDate"),
          align: "left",
          sortable: true,
          field: (row) =>
            Array.isArray(row.payments) &&
            row.payments.length > 0 &&
            row.payments.find((p) => p?.paymentDate)?.paymentDate
              ? this.dateFormat(
                  row.payments.find((p) => p?.paymentDate).paymentDate,
                )
              : "-",
        },
        {
          name: "EInvoiceNumber",
          label: this.$t("firm.invoiceNo"),
          align: "center",
          sortable: true,
          field: (row) =>
            Array.isArray(row.invoices) && row.invoices.length > 0
              ? row.invoices[0].invoiceNo
              : row.EInvoiceNumber || "",
        },
        {
          name: "billingPlan",
          label: this.$t("firm.billingPlan"),
          align: "center",
          sortable: true,
          field: (row) => row.billingPlan,
        },
        {
          name: "reportPlan",
          label: this.$t("firm.reportPlan"),
          align: "center",
          sortable: true,
          field: (row) => row.reportPlan,
        },
        {
          name: "action",
          label: this.$t("action"),
          align: "center",
        },
        {
          name: "epdkActions",
          label: this.$t("EPDK Bildirimleri"),
          align: "center",
          sortable: true,
        },
        {
          name: "epdkSessionId",
          label: "EPDK Session Id",
          align: "left",
          field: (row) => row.epdkSessionId,
        },
        {
          name: "epdkStartSessionTime",
          label: "EPDK Start Session Time",
          align: "left",
          field: (row) =>
            row.epdkStartSessionTime == null
              ? ""
              : this.dateFormat(row.epdkStartSessionTime),
        },
        {
          name: "epdkStopSessionTime",
          label: "EPDK Stop Session Time",
          align: "left",
          field: (row) =>
            row.epdkStopSessionTime == null
              ? ""
              : this.dateFormat(row.epdkStopSessionTime),
        },
        {
          name: "epdkConsumedEnergyInfoId",
          label: "EPDK Consumed Energy Info Id",
          align: "left",
          field: (row) => row.epdkConsumedEnergyInfoId,
        },
        {
          name: "epdkConsumedEnergyInfoTime",
          label: "EPDK Consumed Energy InfoTime",
          align: "left",
          field: (row) =>
            row.epdkConsumedEnergyInfoTime == null
              ? ""
              : this.dateFormat(row.epdkConsumedEnergyInfoTime),
        },
      ];
    },

    corporateValue() {
      const selected = this.selectedCorporate;

      if (selected.includes("corporate") && selected.includes("personal")) {
        return null;
      } else if (selected.includes("corporate")) {
        return true;
      } else if (selected.includes("personal")) {
        return false;
      }
      return null;
    },

    invoiceStatusValue() {
      const selected = this.selectedInvoiceStatuses;

      if (selected.includes("invoiced") && selected.includes("notInvoiced")) {
        return null;
      } else if (selected.includes("invoiced")) {
        return true;
      } else if (selected.includes("notInvoiced")) {
        return false;
      }
      return null;
    },

    isCorporateOptions() {
      return [
        { label: this.$t("firm.personal"), value: "personal" },
        { label: this.$t("firm.corporate"), value: "corporate" },
      ];
    },

    invoiceStatusOptions() {
      return [
        {
          label: this.$t("firm.invoiced") || "Fatura Edildi",
          value: "invoiced",
        },
        {
          label: this.$t("firm.notInvoiced") || "Fatura Edilmedi",
          value: "notInvoiced",
        },
      ];
    },
  },

  data() {
    return {
      loading: false,
      apiRows: [],
      rows: [],
      autoRefreshInterval: 10,
      autoRefreshEnable: false,
      autoRefreshIntervalId: null,

      filter: "",
      isGrid: false,
      pagination: { rowsPerPage: 20 },

      startDate: new Date().toISOString().slice(0, 10) + " 00:00",
      endDate: new Date().toISOString().slice(0, 10) + " 23:59",

      dealers: [],
      regions: [],
      stations: [],
      customers: [],
      vehicles: [],

      filteredDealers: [],
      filteredRegions: [],
      filteredStations: [],
      filteredCustomers: [],
      filteredVehicles: [],
      filteredPaymentStatuses: [],
      filteredRows: [],

      selectedRegions: [],
      selectedDealers: [],
      selectedStations: [],
      selectedCustomers: [],
      selectedVehicles: [],

      paymentStatuses: [],
      selectedPaymentStatuses: [],
      zerokwh: false,
      noNameTransactions: false,

      selectedCorporate: ["personal", "corporate"],
      selectedInvoiceStatuses: ["invoiced", "notInvoiced"],

      paymentDialogVisible: false,
      paymentProcessDialogVisible: false,
      paymentDialogLoading: false,
      refundDialogVisible: false,
      refundDialogLoading: false,
      paymentSelectedRow: null,
      paymentDialogData: {
        name: "",
        date: "",
        amount: "",
        preauthAmount: "",
      },
      refundDialogData: {
        merchantOid: "",
        amount: 0,
      },
    };
  },

  async mounted() {
    document.title = `${firm.name}-${this.$t(
      "reports.transactionTrackingPanel",
    )}`;
    this.init();
  },
  beforeUnmount() {
    clearInterval(this.autoRefreshIntervalId);
  },

  methods: {
    async init() {
      try {
        await this.getList();
        this.getCustomers();
        this.getVehicles();
        this.getStations();
        this.getDealers();
        this.getRegions();
        this.getPaymentStatuses();
      } catch (error) {
        this.$logger.error("init error", error);
      }
    },

    async getList() {
      try {
        this.loading = true;

        const body = {
          startDate: this.startDate,
          endDate: this.endDate,
          dealers: this.selectedDealers,
          stationRegions: this.selectedRegions,
          stations: this.selectedStations,
          customers: this.selectedCustomers,
          vehicles: this.selectedVehicles,
          zerokwh: this.zerokwh,
        };

        const response = await this.$api.post("getTransactionReport", body);
        this.$logger.log("Transaction Report", response?.data);

        const data = response?.data || [];
        this.apiRows = Array.isArray(data) ? data : [];

        await this.localFilters();
      } catch (error) {
        this.$logger.error("getList error", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },

    async onLocalFilterChanged() {
      try {
        this.loading = true;
        await this.localFilters();
      } catch (error) {
        this.$logger?.error?.("onLocalFilterChanged error", error);
      } finally {
        this.loading = false;
      }
    },
    async autoRefresh() {
      this.autoRefreshEnable = !this.autoRefreshEnable;

      this.getAutoRefresh();
    },
    async getAutoRefresh() {
      clearInterval(this.autoRefreshIntervalId);
      if (this.autoRefreshEnable) {
        this.autoRefreshIntervalId = setInterval(() => {
          this.getList();
        }, this.autoRefreshInterval * 1000);
      } else {
        clearInterval(this.autoRefreshIntervalId);
      }
    },

    async localFilters() {
      let filtered = Array.isArray(this.apiRows) ? [...this.apiRows] : [];

      filtered = await this.corporateFilter(filtered);
      filtered = await this.invoiceStatusFilter(filtered);
      filtered = await this.paymentStatusFilter(filtered);
      filtered = await this.noNameTransactionsFilter(filtered);

      this.rows = filtered;
    },

    async corporateFilter(list) {
      if (!Array.isArray(list)) return [];

      if (this.corporateValue === null) return list;

      return list.filter(
        (item) => (item.customer?.isCorporate ?? false) === this.corporateValue,
      );
    },

    async invoiceStatusFilter(list) {
      if (!Array.isArray(list)) return [];

      if (this.invoiceStatusValue === null) return list;

      return list.filter((row) => {
        const hasInvoice =
          Array.isArray(row.invoices) && row.invoices.length > 0;

        return this.invoiceStatusValue ? hasInvoice : !hasInvoice;
      });
    },

    async paymentStatusFilter(list) {
      if (!Array.isArray(list)) return [];

      if (
        !Array.isArray(this.selectedPaymentStatuses) ||
        this.selectedPaymentStatuses.length === 0
      ) {
        return list;
      }

      return list.filter((row) => {
        if (!Array.isArray(row.payments) || row.payments.length === 0) {
          return false;
        }

        const rowStatusId =
          row.payments?.[0]?.paymentStatusId ||
          row.payments?.[0]?.paymentStatus?.id;

        return this.selectedPaymentStatuses.some(
          (status) => status?.id === rowStatusId,
        );
      });
    },

    async noNameTransactionsFilter(list) {
      if (!Array.isArray(list)) return [];

      if (!this.noNameTransactions) return list;

      return list.filter((item) => item?.customerId == null);
    },

    async getDealers() {
      try {
        this.loading = true;
        const response = await this.$api.get("getDealers");
        this.dealers = this.filteredDealers = response?.data.data;
      } catch (error) {
        this.$logger.error("getDealers error", error);
      } finally {
        this.loading = false;
      }
    },

    async getRegions() {
      try {
        this.loading = true;
        const response = await this.$api.get("getRegions");
        this.regions = this.filteredRegions = response?.data.data;
      } catch (error) {
        this.$logger.error("getRegions error", error);
      } finally {
        this.loading = false;
      }
    },

    async getPaymentStatuses() {
      try {
        this.loading = true;
        const response = await this.$api.get("paymentStatuses");
        this.paymentStatuses = response?.data || [];
        this.filteredPaymentStatuses = this.paymentStatuses;
      } catch (error) {
        this.$logger.error("getPaymentStatuses error", error);
      } finally {
        this.loading = false;
      }
    },

    async getStations() {
      try {
        this.loading = true;
        const body = {
          available: null,
          stationElectricTypeId: null,
          isActive: true,
        };
        const response = await this.$api.post("getStations", body);
        this.stations = this.filteredStations = response.data;
      } catch (error) {
        this.$logger.error("Error fetching getStations list:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errorFetchingData"),
        });
      } finally {
        this.loading = false;
      }
    },

    async getCustomers() {
      try {
        this.loading = true;
        const response = await this.$api.get("getCustomers/999/1/true");
        this.customers = this.filteredCustomers = response?.data;
      } catch (error) {
        this.$logger.error("getCustomers error", error);
      } finally {
        this.loading = false;
      }
    },

    async getVehicles() {
      try {
        this.loading = true;
        const response = await this.$api.get("getVehicles");
        this.vehicles = this.filteredVehicles = response?.data;
      } catch (error) {
        this.$logger.error("getVehicles error", error);
      } finally {
        this.loading = false;
      }
    },

    filterList(val, update, sourceList, filterList) {
      const source = this[sourceList];
      const normalizedVal = this.$normalizeTurkishString(val);

      update(() => {
        this[filterList] =
          val === ""
            ? source
            : source.filter((item) =>
                this.$normalizeTurkishString(item.name).includes(normalizedVal),
              );
      });
    },

    filterCustomers(val, update) {
      if (val === "") {
        update(() => {
          this.filteredCustomers = this.customers;
        });
        return;
      }

      const normalizedVal = this.$normalizeTurkishString(val);

      update(() => {
        this.filteredCustomers = this.customers.filter((customer) => {
          const name = this.$normalizeTurkishString(customer.name || "");
          const surname = this.$normalizeTurkishString(customer.surname || "");
          const phone = this.$normalizeTurkishString(customer.phone || "");
          const fullName = `${name} ${surname}`;

          return (
            name.includes(normalizedVal) ||
            surname.includes(normalizedVal) ||
            fullName.includes(normalizedVal) ||
            phone.includes(normalizedVal)
          );
        });
      });
    },
    filterLicensePlate(val, update) {
      const normalizedVal = this.$normalizeTurkishString(val);
      update(() => {
        val === ""
          ? (this.filteredVehicles = this.vehicles)
          : (this.filteredVehicles = this.vehicles.filter((vehicle) =>
              this.$normalizeTurkishString(vehicle.licensePlate).includes(
                normalizedVal,
              ),
            ));
      });
    },

    dateFormat(date) {
      date = new Date(date);

      const options = {
        timeZone: "Europe/Istanbul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formatted = date
        .toLocaleString("tr-TR", options)
        .replace(/\. /g, ".")
        .replace(",", "");

      return formatted;
    },

    customersLabel(option) {
      return option.id == null
        ? "Seç"
        : `${option.name} ${option.surname} - ${option.phone}`;
    },

    formatEpdkDate(value) {
      if (!value) {
        return "-";
      }

      const date = new Date(value);

      if (isNaN(date)) {
        return value;
      }

      const formatter = new Intl.DateTimeFormat("tr-TR", {
        timeZone: "Europe/Istanbul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const parts = formatter.formatToParts(date);
      const partValues = parts.reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
      }, {});

      const day = partValues.day;
      const month = partValues.month;
      const year = partValues.year;
      const hour = partValues.hour ?? "00";
      const minute = partValues.minute ?? "00";
      const second = partValues.second ?? "00";

      if (!day || !month || !year) {
        return value;
      }

      return `${day}.${month}.${year} - ${hour}.${minute}.${second}`;
    },

    sendInvoice(row) {
      this.showDateTimeDialog(row);
    },

    async postCreateEpdkOutboxForStop(row) {
      try {
        const body = {
          chargeTransactionId: row.id,
          eventType: "StopInUse",
        };
        await this.$api.post("postCreateEpdkOutbox", body);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await this.getList();
      } catch (error) {
        this.$logger.error("postCreateEpdkOutbox error", error);
      }
    },

    showDateTimeDialog(row) {
      this.$q
        .dialog({
          title: this.$t("reports.sendInvoice"),
          message: `
            <div class="q-pa-md">
              <div class="q-mt-md">
                <label class="text-subtitle2">${this.$t(
                  "reports.selectDateTime",
                )}:</label>
                <div class="row q-mt-sm">
                  <div class="col-6 q-pr-sm">
                    <input
                      type="date"
                      id="invoiceDate"
                      class="full-width q-pa-sm"
                      style="border: 1px solid #ccc; border-radius: 4px;"
                      value="${this.getCurrentDate()}"
                    />
                  </div>
                  <div class="col-6 q-pl-sm">
                    <input
                      type="time"
                      id="invoiceTime"
                      class="full-width q-pa-sm"
                      style="border: 1px solid #ccc; border-radius: 4px;"
                      value="${this.getCurrentTime()}"
                    />
                  </div>
                </div>
              </div>
            </div>
          `,
          html: true,
          cancel: true,
          persistent: true,
          ok: {
            label: this.$t("send"),
            color: "primary",
          },
          cancel: {
            label: this.$t("cancel"),
            flat: true,
          },
        })
        .onOk(async () => {
          const dateInput = document.getElementById("invoiceDate");
          const timeInput = document.getElementById("invoiceTime");

          const selectedDate = dateInput?.value || this.getCurrentDate();
          const selectedTime = timeInput?.value || this.getCurrentTime();
          const timeWithSeconds =
            selectedTime && selectedTime.length === 5
              ? `${selectedTime}:00`
              : selectedTime || "00:00:00";

          const selectedDateTime = `${selectedDate} ${timeWithSeconds}`;

          const invoiceData = {
            chargeTransactionId: row.id,
            selectedDateTime,
          };

          await this.submitInvoice(invoiceData, row);
        });
    },

    confirmPayment(row) {
      this.paymentSelectedRow = row;

      this.paymentDialogData = {
        name: `${row.customer?.name || ""} ${
          row.customer?.surname || ""
        }`.trim(),
        date: this.dateFormat(row.startTime),
        amount:
          (row.paymentAmount ?? row.amount ?? 0).toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) +
          " " +
          (row.payments[0]?.currency.symbol || "₺"),
        preauthAmount:
          (row.payments[0]?.preauthAmount ?? 0).toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) +
          " " +
          (row.payments[0]?.currency.symbol || "₺"),
      };

      this.paymentDialogVisible = true;
    },

    refundPayment(row) {
      this.paymentSelectedRow = row;

      const documentNo = row?.payments?.[0]?.documentNo || "";
      const rowPaymentAmount = Number(row?.paymentAmount ?? 0);

      if (!documentNo) {
        this.$q.notify({
          type: "negative",
          message: this.$t("paymentTransactions.documentNoNotFound"),
        });
        return;
      }

      this.refundDialogData = {
        merchantOid: documentNo,
        amount: Number.isFinite(rowPaymentAmount)
          ? Number(rowPaymentAmount.toFixed(2))
          : 0,
      };

      this.refundDialogVisible = true;
    },

    async confirmRefundPayment() {
      const amount = Number(this.refundDialogData.amount);
      const merchantOid = this.refundDialogData.merchantOid;
      const maxRefundAmount = Number(
        this.paymentSelectedRow?.paymentAmount ?? 0,
      );

      if (!merchantOid) {
        this.$q.notify({
          type: "negative",
          message: this.$t("paymentTransactions.documentNoRequired"),
        });
        return;
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        this.$q.notify({
          type: "negative",
          message: this.$t("paymentTransactions.invalidAmount"),
        });
        return;
      }

      if (
        Number.isFinite(maxRefundAmount) &&
        maxRefundAmount > 0 &&
        amount > maxRefundAmount
      ) {
        this.$q.notify({
          type: "negative",
          message:
            this.$t("paymentTransactions.refundAmountExceedsPayment") ||
            "İade tutarı ödeme tutarından büyük olamaz.",
        });
        return;
      }

      this.$q
        .dialog({
          title: this.$t("warning"),
          message: this.$t("paymentTransactions.confirmRefund"),
          ok: {
            label: this.$t("confirm"),
            color: "primary",
          },
          cancel: {
            label: this.$t("cancel"),
            flat: true,
          },
          persistent: true,
        })
        .onOk(async () => {
          await this.submitRefundPayment();
        });
    },

    async submitRefundPayment() {
      try {
        this.refundDialogLoading = true;

        const body = {
          merchantOid: this.refundDialogData.merchantOid,
          amount: Number(this.refundDialogData.amount),
        };

        const response = await this.$api.post(
          "http://api.magiclineapp.com/api/paytr/refundPaytr",
          body,
        );

        if (response?.status === 200) {
          this.$q.notify({
            type: "positive",
            message: this.$t("success"),
          });

          this.refundDialogVisible = false;
          await this.getList();
          return;
        }

        this.$q.notify({
          type: "negative",
          message: this.$t("error"),
        });
      } catch (error) {
        this.$logger?.error?.("refundPaytr error", error);

        const errData = error?.response?.data;
        const message =
          errData?.message ||
          errData?.error ||
          error?.message ||
          this.$t("error");

        this.$q.notify({
          type: "negative",
          message,
        });
      } finally {
        this.refundDialogLoading = false;
      }
    },

    capturePreauth(row) {
      const customerName = `${row.customer?.name || ""} ${
        row.customer?.surname || ""
      }`.trim();
      const paymentAmount = (
        row.paymentAmount ??
        row.amount ??
        0
      ).toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const preauthAmount = (row.payments[0]?.preauthAmount).toLocaleString(
        "tr-TR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      );

      this.$q
        .dialog({
          title: this.$t("warning"),
          message: `${
            this.$t("capturePreauthConfirm") ||
            "Provizyon kapatılacak Emin misiniz?"
          }<br/>${customerName || "-"}<br/>İşlem Tutarı: ${paymentAmount} ₺ ${
            preauthAmount ? `<br/> Provizyon Tutarı: ${preauthAmount} ₺` : ""
          }`,
          html: true,
          cancel: true,
          persistent: true,
          ok: {
            label: this.$t("confirm"),
            color: "primary",
          },
          cancel: {
            label: this.$t("cancel"),
            flat: true,
          },
        })
        .onOk(async () => {
          try {
            this.loading = true;

            const body = { chargeTransactionId: row.id };
            const response = await this.$api.post(
              "paytr/capturePreauthByAdmin",
              body,
            );
            const data = response?.data;

            if (data?.success === false) {
              this.$q.notify({
                type: "negative",
                message: data?.message || data?.error || this.$t("error"),
              });
              return;
            }

            this.$q.notify({
              type: "positive",
              message: this.$t("success"),
            });

            await this.getList();
          } catch (error) {
            this.$logger?.error?.("capturePreauthByAdmin error", error);

            const errData = error?.response?.data;
            const message =
              errData?.message || errData?.error || this.$t("error");

            this.$q.notify({ type: "negative", message });
          } finally {
            this.loading = false;
          }
        });
    },

    voidPreauth(row) {
      const customerName = `${row.customer?.name || ""} ${
        row.customer?.surname || ""
      }`.trim();
      const paymentAmount = (row.payments[0]?.preauthAmount).toLocaleString(
        "tr-TR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      );

      this.$q
        .dialog({
          title: this.$t("warning"),
          message: `${
            this.$t("capturePreauthConfirm") ||
            "Provizyon İptal Edilecek Emin misiniz?"
          }<br/>${customerName || "-"}<br/>${paymentAmount} ₺`,
          html: true,
          cancel: true,
          persistent: true,
          ok: {
            label: this.$t("confirm"),
            color: "primary",
          },
          cancel: {
            label: this.$t("cancel"),
            flat: true,
          },
        })
        .onOk(async () => {
          try {
            this.loading = true;

            const body = { chargeTransactionId: row.id };
            const response = await this.$api.post(
              "paytr/voidPreauthByAdmin",
              body,
            );
            const data = response?.data;

            if (data?.success === false) {
              this.$q.notify({
                type: "negative",
                message: data?.message || data?.error || this.$t("error"),
              });
              return;
            }

            this.$q.notify({
              type: "positive",
              message: this.$t("success"),
            });

            await this.getList();
          } catch (error) {
            this.$logger?.error?.("voidPreauthByAdmin error", error);

            const errData = error?.response?.data;
            const message =
              errData?.message || errData?.error || this.$t("error");

            this.$q.notify({ type: "negative", message });
          } finally {
            this.loading = false;
          }
        });
    },

    async onConfirmPayment() {
      if (!this.paymentSelectedRow) return;

      try {
        this.paymentDialogLoading = true;
        await this.getPayment(this.paymentSelectedRow);
      } catch (error) {
        this.$logger?.error?.("onConfirmPayment error", error);
      } finally {
        this.paymentDialogLoading = false;
      }
    },

    async submitInvoice(invoiceData, row) {
      try {
        this.loading = true;
        const response = await this.$api.post("sendInvoice", invoiceData);
        const data = response?.data;

        this.$logger.log("sendInvoice response", data);

        if (data?.success) {
          this.$q.notify({
            type: "positive",
            message: this.$t("reports.sendInvoiceSuccess"),
          });

          this.$logger.log(
            "sendInvoice invoiceNumber",
            data?.data?.invoiceNumber,
          );

          await this.getList();
        } else {
          this.$q.notify({
            type: "negative",
            message: data?.error || this.$t("reports.sendInvoiceError"),
          });
        }
      } catch (error) {
        this.$logger?.error?.("sendInvoice error", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("sendInvoiceError"),
        });
      } finally {
        this.loading = false;
      }
    },

    getCurrentDate() {
      const now = new Date();
      return now.toISOString().split("T")[0];
    },

    getCurrentTime() {
      const now = new Date();
      return now.toTimeString().split(" ")[0].substring(0, 5);
    },

    exportTable() {
      const table = this.$refs.table;
      this.filteredRows = table?.filteredSortedRows || [];

      const header = this.columns.map((col) => col.label);
      const colWidths = this.columns.map(() => 0);

      const data = this.filteredRows.map((row) =>
        this.columns.map((col, i) => {
          const val =
            typeof col.field === "function" ? col.field(row) : row[col.field];
          const str = val?.toString() ?? "";
          colWidths[i] = Math.max(colWidths[i] || 0, str.length);
          return val;
        }),
      );

      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);

      worksheet["!cols"] = this.columns.map((col, index) => {
        const headerLength = col.label?.toString().length || 10;
        return { wch: Math.max(headerLength, colWidths[index]) + 2 };
      });

      XLSX.writeFile(
        { Sheets: { Data: worksheet }, SheetNames: ["Data"] },
        "TransactionReport.xlsx",
      );
    },

    async getPayment(row) {
      try {
        const body = { chargeTransactionId: row.id };
        this.$logger?.log?.("getPayment payload", body);

        const response = await this.$api.post(
          "/paytr/chargePaytrForAdmin",
          body,
        );

        if (response?.status === 200) {
          this.$q.notify({
            type: "positive",
            message: this.$t("getPaymentSuccess"),
          });

          await this.getList();
        } else {
          this.$q.notify({
            type: "negative",
            message: this.$t("getPaymentError"),
          });
        }
      } catch (error) {
        this.$logger?.error?.("getPayment error", error);

        const errData = error?.response?.data;
        const message =
          errData?.message ||
          errData?.error ||
          this.$t("getPaymentError") ||
          "Ödeme alınamadı.";

        this.$q.notify({
          type: "negative",
          message,
        });
      } finally {
        this.paymentDialogVisible = false;
      }
    },

    openWhatsApp(phone) {
      if (!phone) return;

      const cleanPhone = phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    },

    callPhone(phone) {
      if (!phone) return;
      window.location.href = `tel:${phone}`;
    },

    sendMail(email) {
      if (!email) return;
      window.location.href = `mailto:${email}`;
    },
    viewPaymentProcess(row) {
      this.paymentSelectedRow = row;
      this.paymentProcessDialogVisible = true;
    },
    calcKWh(startTime, endTime, totalEnergy) {
      if (!startTime || totalEnergy == null) return "0.00";

      const start = new Date(startTime);
      const end = endTime ? new Date(endTime) : new Date();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return "0.00";

      const durationInHours = (end - start) / (1000 * 60 * 60);

      if (durationInHours <= 0) return "0.00";

      const energy = Number(totalEnergy);
      if (!Number.isFinite(energy)) return "0.00";

      const kWh = energy / durationInHours;
      return kWh.toFixed(2);
    },
  },
});
</script>

<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s

.my-sticky-header-table
  max-height: 600px

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px

.option-inline-wrap
  display: flex
  flex-wrap: wrap
  gap: 8px
</style>
