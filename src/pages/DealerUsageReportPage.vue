<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <!-- Filtre -->
  <div class="row q-pa-md">
    <q-card>
      <q-list class="row">
        <!-- Başlangıç Tarihi Seçimi -->
        <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
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
        <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
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
                    <q-time v-model="endDate" mask="YYYY-MM-DD HH:mm" format24h>
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
        <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
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
        <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
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
        <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
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
                  filterList(val, update, 'stations', 'filteredStations')
              "
            >
              <template #prepend>
                <q-icon name="ev_station" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>

        <q-space />

        <!-- TOGGLE BUTON -->
        <q-item class="col-lg-2 col-md-4 col-sm-12 col-xs-12">
          <q-item-section>
            <q-btn-toggle
              v-model="grouppingOption"
              spread
              class="my-custom-toggle full-width"
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              color="white"
              text-color="primary"
              :options="[
                { label: 'İstasyon Grupla', value: 'station' },
                { label: 'Plaka Grupla', value: 'plate' },
              ]"
            />
          </q-item-section>
        </q-item>
        <!-- Sadece bayi kullanıcıları  CheckBox-->
        <q-item class="col-lg-2 col-md-3 col-sm-6 col-xs-12">
          <q-item-section>
            <div class="text-caption text-grey q-mb-xs">
              {{ $t("reports.onlyDealerUser") }}
            </div>

            <q-checkbox
              v-model="dealerUsersOnly"
              color="primary"
              dense
              :label="$t('reports.onlyDealerUser')"
              v-on:update:model-value="usedDealersFilter"
            />
          </q-item-section>
        </q-item>

        <!-- Bayi Seçimi -->
        <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
          <q-item-section>
            <q-select
              v-model="selectedUsedDealers"
              :options="filteredUsedDealers"
              option-value="id"
              option-label="name"
              :label="$t('dealer.usedDealers')"
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
                  filterList(val, update, 'usedDealers', 'filteredUsedDealers')
              "
            >
              <template #prepend>
                <q-icon name="groups" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>

        <!-- Listele Butonu -->
        <q-item class="col-lg-1 col-md-3 col-sm-6 col-xs-12 q-ml-auto">
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
    </q-card>
    <!-- Toplam Kwh ve Tutar Kart -->
    <div class="row q-pa-md">
      <q-card>
        <q-list class="row justify-between">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-weight-medium">
                {{ $t("reports.totalkWh") }}:
              </q-item-label>
              <q-item-label class="text-h6 text-primary">
                {{
                  rows.length
                    ? rows
                        .reduce((acc, r) => acc + Number(r.totalEnergy ?? 0), 0)
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
              <q-item-label class="text-subtitle2 text-weight-medium">
                {{ $t("reports.totalAmount") }}:
              </q-item-label>
              <q-item-label class="text-h6 text-positive">
                {{
                  rows.length
                    ? rows
                        .reduce((acc, r) => acc + Number(r.amount ?? 0), 0)
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
  </div>

  <!-- Tablo -->
  <div class="q-pa-md">
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        v-model="listExpanded"
        expand-separator
        icon="list"
        label="Şarj İşlemleri"
      >
        <q-table
          ref="table"
          flat
          dense
          bordered
          :rows="rows"
          :columns="
            columns.filter(
              (col) =>
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
                :label="$t('export')"
                class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
                icon="cloud_download"
                @click="exportTable"
              />
              <!-- Toplu Fatura Gönder Butonu -->
              <q-item class="col-lg-1 col-md-3 col-sm-6 col-xs-12">
                <q-item-section>
                  <q-btn
                    color="primary"
                    class="full-width"
                    icon="receipt_long"
                    @click="sendBulkInvoice"
                  >
                    <q-tooltip>
                      {{ $t("reports.sendBulkInvoice") }}
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
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
          <template #body-cell-paymentStatus="props">
            <q-td :props="props">
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
              </span>
            </q-td>
          </template>

          <template v-slot:no-data="{ icon, message, filter }">
            <div class="full-width row flex-center q-gutter-sm">
              <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
              <span> {{ message }}... </span>
            </div>
          </template>

          <template #body-cell-customerInfo="props">
            <q-td :props="props" class="text-center">
              <!-- MORE VERT BUTONU -->
              <q-btn
                flat
                dense
                round
                icon="more_vert"
                color="primary"
                size="sm"
              >
                <q-menu transition-show="scale" transition-hide="scale">
                  <q-list style="min-width: 220px">
                    <!-- TELEFON BİLGİSİ -->
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
        </q-table>
      </q-expansion-item>
      <q-expansion-item
        v-model="grouppingExpanded"
        expand-separator
        icon="list"
        label="Gruplanmış Şarj İşlemleri"
      >
        <q-table
          ref="tableGroupped"
          flat
          dense
          bordered
          :rows="groupedRows"
          :columns="columnsGroupping"
          :loading="loading"
          :filter="filterGroupped"
          :pagination="pagination"
          :loading-label="$t('loading')"
          :no-data-label="$t('nodatalabel')"
          :no-results-label="$t('noresultslabel')"
          row-key="key"
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
                v-model="filterGroupped"
                :placeholder="$t('users.search')"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="filterGroupped !== ''"
                    name="close"
                    @click="filterGroupped = ''"
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
                icon="refresh"
                class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                @click="getList"
              >
                <q-tooltip>
                  {{ $t("refresh") }}
                </q-tooltip>
              </q-btn>

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
                :label="$t('export')"
                class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
                icon="cloud_download"
                @click="exportGrouppedTable"
              />
            </div>
          </template>
        </q-table>
      </q-expansion-item>
    </q-list>
  </div>
  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import * as XLSX from "xlsx";
import { select } from "underscore";

export default defineComponent({
  components: {},
  computed: {
    filterLabel() {
      return this.grouppingOption === "station"
        ? this.$t("station.stationName")
        : this.$t("vehicle.licensePlate");
    },
    groupedRows() {
      const groupingType = this.grouppingOption || "station";
      const transactionRows = Array.isArray(this.rows) ? this.rows : [];

      const groupedTransactionMap = new Map();

      transactionRows.forEach((transaction) => {
        let groupKey = "";
        let groupLabel = "";

        // PLAKA GRUPLAMA
        if (groupingType === "plate") {
          const licensePlate =
            transaction?.vehicle?.licensePlate?.toString().trim() || "-";

          groupKey = `plate:${licensePlate.toUpperCase()}`;
          groupLabel = licensePlate;
        }

        // İSTASYON GRUPLAMA
        else {
          const stationId =
            transaction?.station?.id ?? transaction?.stationId ?? "-";
          const stationName = transaction?.station?.name || "-";

          groupKey = `station:${stationId}`;
          groupLabel = stationName;
        }

        // Grup daha önce oluşturulmamışsa
        if (!groupedTransactionMap.has(groupKey)) {
          groupedTransactionMap.set(groupKey, {
            key: groupKey,
            filterValue: groupLabel,
            transactionCount: 0,
            totalEnergy: 0,
            totalAmount: 0,
            invoiceNumbers: new Set(),
          });
        }

        const groupedTransaction = groupedTransactionMap.get(groupKey);

        groupedTransaction.transactionCount += 1;
        groupedTransaction.totalEnergy += Number(transaction?.totalEnergy ?? 0);

        groupedTransaction.totalAmount += Number(
          transaction?.paymentAmount ?? transaction?.amount ?? 0,
        );
      });

      return Array.from(groupedTransactionMap.values()).map(
        (groupedTransaction) => ({
          key: groupedTransaction.key,
          filterValue: groupedTransaction.filterValue,
          transactionCount: groupedTransaction.transactionCount,
          totalEnergy: Number(groupedTransaction.totalEnergy.toFixed(2)),
          totalAmount: Number(groupedTransaction.totalAmount.toFixed(2)),
        }),
      );
    },

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
          name: "nameSurname",
          label: this.$t("users.nameSurname"),
          align: "center",
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
          name: "isCorporate",
          label: this.$t("firm.companyType"),
          align: "left",
          sortable: true,
          field: (row) =>
            row.customer?.isCorporate
              ? this.$t("firm.corporate")
              : this.$t("firm.personal"),
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
          label: this.$t("reports.kWh"),
          align: "left",
          sortable: true,
          style: "padding-right: 20px;",
          field: (row) => (row.totalEnergy ?? 0).toFixed(2),
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
          align: "right",
          sortable: true,
          field: (row) =>
            Array.isArray(row.invoices) && row.invoices.length > 0
              ? row.invoices[0].invoiceNo
              : row.EInvoiceNumber || "",
        },
      ];
    },
    columnsGroupping() {
      return [
        {
          name: "filterValue",
          label: this.filterLabel,
          align: "left",
          sortable: true,
          field: (row) => row.filterValue,
        },
        {
          name: "transactionCount",
          label: this.$t("reports.transactionCount"),
          align: "left",
          sortable: true,
          field: (row) => row.transactionCount,
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
          name: "totalAmount",
          label: this.$t("reports.totalAmount"),
          align: "right",
          sortable: true,
          field: (row) => (row.totalAmount ?? 0).toFixed(2) + " ₺",
        },
      ];
    },

    // Bireysel / Kurumsal seçimine göre gönderilecek değer
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
  },

  data() {
    return {
      loading: false,
      rows: [],
      fullRows: [],
      filter: "",
      isGrid: false,
      pagination: {
        rowsPerPage: 20,
      },

      startDate: new Date().toISOString().slice(0, 10) + " 00:00",
      endDate: new Date().toISOString().slice(0, 10) + " 23:59",

      // Filtre verileri
      dealers: [],
      regions: [],
      stations: [],
      customers: [],
      vehicles: [],

      // Filtrelenmiş veriler
      filteredDealers: [],
      filteredUsedDealers: [],
      filteredRegions: [],
      filteredStations: [],
      filteredCustomers: [],
      filteredVehicles: [],
      filterGroupped: "",

      // Seçilen filtre değerleri
      selectedRegions: [],
      selectedDealers: [],
      selectedUsedDealers: [],
      selectedStations: [],
      selectedCustomers: [],
      selectedVehicles: [],
      dealerUsersOnly: false,

      paymentStatuses: [],
      paymentStatusesLoaded: false,
      selectedPaymentStatuses: "",
      zerokwh: false,
      grouppingOption: "station",
      listExpanded: true,
      grouppingExpanded: false,

      isCorporateOptions: [
        { label: this.$t("firm.personal"), value: "personal" },
        { label: this.$t("firm.corporate"), value: "corporate" },
      ],
      selectedCorporate: ["personal", "corporate"],
      invoiceStatusOptions: [
        {
          label: this.$t("firm.invoiced") || "Fatura Edildi",
          value: "invoiced",
        },
        {
          label: this.$t("firm.notInvoiced") || "Fatura Edilmedi",
          value: "notInvoiced",
        },
      ],
      selectedInvoiceStatuses: ["invoiced", "notInvoiced"],

      // Ödeme dialogu
      paymentDialogVisible: false,
      paymentDialogLoading: false,
      paymentDialogHtml: "",
      paymentSelectedRow: null,
      paymentDialogData: {
        name: "",
        date: "",
        amount: "",
      },
    };
  },

  async mounted() {
    document.title = `${firm.name}-${this.$t("reports.transactionReport")}`;
    this.init();
  },

  methods: {
    async init() {
      try {
        //this.getList();
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

    // removed async filterValue method; use computed `filterLabel` instead
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
          isCorporate: this.corporateValue,
          //paymentStatuses: this.selectedPaymentStatuses,
        };
        this.$logger.log("Report", body);

        const response = await this.$api.post("getTransactionReport", body);
        this.$logger.log("Transaction Report", response?.data);

        // Bireysel / Kurumsal filtreleme
        let data = response?.data || [];
        this.fullRows = data;
        this.rows =
          this.corporateValue === null
            ? data
            : data.filter(
                (item) =>
                  (item.customer?.isCorporate ?? false) === this.corporateValue,
              );
        // Fatura durumu filtreleme (invoices array length'e göre)
        if (this.invoiceStatusValue !== null) {
          this.rows = this.rows.filter((row) => {
            const hasInvoice =
              Array.isArray(row.invoices) && row.invoices.length > 0;

            return this.invoiceStatusValue ? hasInvoice : !hasInvoice;
          });
        }

        // Ödeme durumu filtreleme
        if (this.selectedPaymentStatuses && this.selectedPaymentStatuses.id) {
          this.rows = this.rows.filter(
            (row) =>
              row.payments.length > 0 &&
              row.payments[0].paymentStatusId ===
                this.selectedPaymentStatuses.id,
          );
        }

        this.$logger.log("rows", this.rows);
        this.$logger.log("fullRows", this.fullRows);
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

    async getDealers() {
      try {
        this.loading = true;
        const response = await this.$api.get("getDealers");
        this.dealers = this.filteredDealers = response?.data.data;
        this.usedDealers = this.filteredUsedDealers = response?.data.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getDealers error", error);
      }
    },

    async getRegions() {
      try {
        this.loading = true;
        const response = await this.$api.get("getRegions");
        this.regions = this.filteredRegions = response?.data.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getRegions error", error);
      }
    },

    async getPaymentStatuses() {
      try {
        this.loading = true;
        const response = await this.$api.get("paymentStatuses");
        this.paymentStatuses = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getPaymentStatuses error", error);
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
        this.loading = false;
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
        this.loading = false;
      } catch (error) {
        this.$logger.error("getCustomers error", error);
      }
    },

    async getVehicles() {
      try {
        this.loading = true;
        const response = await this.$api.get("getVehicles");
        this.vehicles = this.filteredVehicles = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getVehicles error", error);
      }
    },

    sendBulkInvoice() {
      this.showBulkDateTimeDialog();
    },

    showBulkDateTimeDialog() {
      this.$q
        .dialog({
          title: this.$t("reports.sendBulkInvoice"),
          message: `
        <div class="q-pa-md">

          <div class="q-mb-md">
            <label class="text-subtitle2">
              ${this.$t("reports.selectDateTime")}:
            </label>
          </div>

          <div class="row q-mt-sm">
            <div class="col-6 q-pr-sm">
              <input
                type="date"
                id="bulkInvoiceDate"
                class="full-width q-pa-sm"
                style="border: 1px solid #ccc; border-radius: 4px;"
                value="${this.getCurrentDate()}"
              />
            </div>

            <div class="col-6 q-pl-sm">
              <input
                type="time"
                id="bulkInvoiceTime"
                class="full-width q-pa-sm"
                style="border: 1px solid #ccc; border-radius: 4px;"
                value="${this.getCurrentTime()}"
              />
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
          const sourceRows = Array.isArray(this.rows) ? this.rows : [];
          const ids = sourceRows
            .map((row) => row?.id)
            .filter((id) => id !== null && id !== undefined);

          if (!ids.length) {
            this.$q.notify({
              type: "warning",
              message:
                this.$t("nodatalabel") || "Gönderilecek kayıt bulunamadı.",
            });
            return;
          }

          const dateInput = document.getElementById("bulkInvoiceDate");
          const timeInput = document.getElementById("bulkInvoiceTime");

          const selectedDate = dateInput?.value || this.getCurrentDate();
          const selectedTime = timeInput?.value || this.getCurrentTime();

          const timeWithSeconds =
            selectedTime && selectedTime.length === 5
              ? `${selectedTime}:00`
              : selectedTime || "00:00:00";

          const selectedDateTime = `${selectedDate} ${timeWithSeconds}`;

          const payload = {
            chargeTransactionIds: ids,
            selectedDateTime: selectedDateTime,
          };

          this.$logger.log("sendBulkInvoice payload", payload);

          await this.submitBulkInvoice(payload);
        });
    },

    async submitBulkInvoice(payload) {
      try {
        this.loading = true;
        try {
          this.$api.post("sendBulkInvoice", payload);
        } catch {}
        this.$q.notify({
          type: "positive",
          message: this.$t("reports.sendInvoiceSuccess"),
        });
      } catch (error) {
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

          return (
            name.includes(normalizedVal) ||
            surname.includes(normalizedVal) ||
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

    usedDealersFilter() {
      logger.log("usedDealersFilter called", this.selectedUsedDealers);
      if (this.selectedUsedDealers.length > 0) {
        const selectedIds = this.selectedUsedDealers.map((d) => d.id);
        this.rows = this.rows.filter((row) =>
          selectedIds.includes(row?.customer?.dealerId),
        );
      }
    },

    sendInvoice(row) {
      this.showDateTimeDialog(row);
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

          this.$logger.log("sendInvoice payload", invoiceData);

          await this.submitInvoice(invoiceData, row);
        });
    },
    confirmPayment(row) {
      this.paymentSelectedRow = row;
      this.paymentDialogHtml = "";

      this.paymentDialogData = {
        name: `${row.customer?.name || ""} ${
          row.customer?.surname || ""
        }`.trim(),
        date: this.dateFormat(row.startTime),
        amount:
          (row.paymentAmount ?? row.amount ?? 0).toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + " ₺",
      };

      this.paymentDialogVisible = true;
    },
    async onConfirmPayment() {
      if (!this.paymentSelectedRow) return;

      this.paymentDialogLoading = true;
      this.paymentDialogHtml = "";

      await this.getPayment(this.paymentSelectedRow);

      this.paymentDialogLoading = false;
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
      return now.toISOString().split("T")[0]; // YYYY-MM-DD
    },

    getCurrentTime() {
      const now = new Date();
      return now.toTimeString().split(" ")[0].substring(0, 5); // HH:MM
    },

    exportTable() {
      const table = this.$refs.table;
      this.filteredRows = table?.filteredSortedRows || [];

      // Başlık, Veri ve sütun genişlikleri birlikte hesaplanıyor
      const header = this.columns.map((col) => col.label);
      const colWidths = this.columns.map(() => 0); // Her sütun için max uzunluk
      const data = this.filteredRows.map((row) =>
        this.columns.map((col, i) => {
          const val =
            typeof col.field === "function" ? col.field(row) : row[col.field];
          const str = val?.toString() ?? "";
          colWidths[i] = Math.max(colWidths[i] || 0, str.length);
          return val;
        }),
      );

      // Sheet oluştur
      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      // Otomatik sütun genişliği
      worksheet["!cols"] = this.columns.map((col, index) => {
        const headerLength = col.label?.toString().length || 10;
        return { wch: Math.max(headerLength, colWidths[index]) + 2 }; // + padding
      });

      XLSX.writeFile(
        { Sheets: { Data: worksheet }, SheetNames: ["Data"] },
        "TransactionReport.xlsx",
      );
    },
    exportGrouppedTable() {
      const table = this.$refs.tableGroupped;
      const filteredRows = table?.filteredSortedRows || [];

      const header = this.columnsGroupping.map((col) => col.label);
      const colWidths = this.columnsGroupping.map(() => 0);

      const data = filteredRows.map((row) =>
        this.columnsGroupping.map((col, i) => {
          const val =
            typeof col.field === "function" ? col.field(row) : row[col.field];
          const str = val?.toString() ?? "";
          colWidths[i] = Math.max(colWidths[i] || 0, str.length);
          return val;
        }),
      );

      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);

      worksheet["!cols"] = this.columnsGroupping.map((col, index) => {
        const headerLength = col.label?.toString().length || 10;
        return { wch: Math.max(headerLength, colWidths[index]) + 2 };
      });

      XLSX.writeFile(
        { Sheets: { Data: worksheet }, SheetNames: ["Data"] },
        "TransactionReport_Grouped.xlsx",
      );
    },

    async getPayment(row) {
      let message = this.$t("getPaymentError");

      try {
        const body = { chargeTransactionId: row.id };
        this.$logger?.log?.("getPayment payload", body);

        this.loading = true;
        this.paymentDialogLoading = true;

        const response = await this.$api.post(
          "/paytr/chargePaytrForAdmin",
          body,
        );
        const data = response?.data;

        let rawHtml = "";
        if (typeof data === "string") rawHtml = data;
        else if (typeof data?.data === "string") rawHtml = data.data;
        else if (typeof data?.html === "string") rawHtml = data.html;
        else if (typeof data?.error === "string") rawHtml = data.error;
        else if (typeof data?.message === "string") rawHtml = data.message;

        if (rawHtml && rawHtml.trim()) {
          this.paymentDialogHtml = rawHtml;
          this.paymentDialogVisible = true;
          return;
        }

        if (
          response?.status === 200 &&
          (data?.success === true || data?.ok === true)
        ) {
          this.$q.notify({
            type: "positive",
            message: this.$t("getPaymentSuccess"),
          });
          return;
        }

        if (data?.error) message = data.error;
        else if (data?.message) message = data.message;

        this.$q.notify({ type: "negative", message });
      } catch (error) {
        this.$logger?.error?.("getPayment error", error);

        const errData = error?.response?.data;

        let rawHtml = "";
        if (typeof errData === "string") rawHtml = errData;
        else if (typeof errData?.data === "string") rawHtml = errData.data;
        else if (typeof errData?.html === "string") rawHtml = errData.html;
        else if (typeof errData?.error === "string") rawHtml = errData.error;
        else if (typeof errData?.message === "string")
          rawHtml = errData.message;

        if (rawHtml && rawHtml.trim()) {
          this.paymentDialogHtml = rawHtml;
          this.paymentDialogVisible = true;
          return;
        }

        if (errData?.error) message = errData.error;
        else if (errData?.message) message = errData.message;

        this.$q.notify({ type: "negative", message });
      } finally {
        this.loading = false;
        this.paymentDialogLoading = false;

        try {
          await this.getList();
        } catch (err) {
          this.$logger?.error?.("getPayment getList error", err);
        }
      }
    },
    extractFailMessage(html) {
      if (!html || typeof html !== "string") {
        return null;
      }

      const match = html.match(
        /name=["']fail_message["'][^>]*value=["']([^"']*)["']/i,
      );

      return match ? match[1] : null;
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
  },
});
</script>

<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s
.my-sticky-header-table
  /* height or max-height is important */
  max-height: 600px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

.option-inline-wrap
  display: flex
  flex-wrap: wrap
  gap: 8px
</style>
