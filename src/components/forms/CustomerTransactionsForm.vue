<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <!-- Tablo -->
  <div class="q-pa-md">
    <q-table
      ref="table"
      flat
      dense
      bordered
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
      <template #body-cell-epdkActions="props">
        <q-td :props="props">
          <!-- EPDK Başlangıç Bildirimi -->
          <q-btn
            flat
            dense
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
                      props.row.epdkStartSessionTime
                    )}`
                  : "Gönderilmedi"
              }}
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            dense
            icon="stop_circle"
            :color="props.row.isEpdkStopSession ? 'green' : 'amber'"
          >
            <q-tooltip>
              {{ `Bitiş Bildirimi` }}
              {{
                props.row.isEpdkStopSession
                  ? `Gönderildi. Zaman: ${formatEpdkDate(
                      props.row.epdkStopSessionTime
                    )}`
                  : "Gönderilmedi"
              }}
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            dense
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
                      props.row.epdkConsumedEnergyInfoTime
                    )}`
                  : "Gönderilmedi"
              }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
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
            flat
            dense
            icon="credit_card"
            :color="
              Array.isArray(props.row.payments) && props.row.payments.length > 0
                ? props.row.payments[0]?.paymentStatus?.id === 7
                  ? 'red'
                  : 'green'
                : 'amber'
            "
            :disabled="
              Array.isArray(props.row.payments) &&
              props.row.payments.length > 0 &&
              props.row.payments[0]?.paymentStatus?.id !== 7
            "
            @click="confirmPayment(props.row)"
          >
            <q-tooltip>
              {{
                Array.isArray(props.row.payments) &&
                props.row.payments.length > 0
                  ? props.row.payments[0]?.paymentStatus?.id === 7
                    ? $t("getPaymentError")
                    : $t("getPaymentSuccess")
                  : $t("getPayment")
              }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template #body-cell-customerInfo="props">
        <q-td :props="props" class="text-center">
          <!-- MORE VERT BUTONU -->
          <q-btn flat dense round icon="more_vert" color="primary" size="sm">
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
        <div v-if="!paymentDialogHtml" class="q-pa-md full-width">
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
          </div>
        </div>

        <div v-else>
          <iframe
            :srcdoc="paymentDialogHtml"
            style="width: 100%; height: 60vh; border: 0"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
          ></iframe>
        </div>
      </q-card-section>

      <q-inner-loading :showing="paymentDialogLoading">
        <q-spinner />
      </q-inner-loading>

      <q-separator />

      <q-card-actions align="right" v-if="!paymentDialogHtml">
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

      <!-- HTML sonucu gösterildikten sonra sadece Kapat -->
      <q-card-actions align="right" v-else>
        <q-btn color="primary" :label="$t('close') || 'Kapat'" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import * as XLSX from "xlsx";

export default defineComponent({
  name: "CustomerTransactionsForm",
  props: {
    modelValue: {
      type: Number,
      default: () => null,
    },
  },
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
          label: this.$t("reports.paymentDate") || "Ödeme Tarihi",
          align: "left",
          sortable: true,
          field: (row) =>
            Array.isArray(row.payments) &&
            row.payments.length > 0 &&
            row.payments[0]?.paymentDate
              ? this.dateFormat(row?.payments[0].paymentDate)
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
      ];
    },
  },

  data() {
    return {
      loading: false,
      rows: [],
      filter: "",
      isGrid: false,
      pagination: {
        rowsPerPage: 20,
      },

      startDate: "2025-01-01 00:00",
      endDate: new Date().toISOString().slice(0, 10) + " 23:59",
    };
  },

  async mounted() {
    this.init();
  },

  methods: {
    async init() {
      try {
        this.getList();
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
          customers: [this.modelValue],
        };

        const response = await this.$api.post("getTransactionReport", body);
        //this.$logger.log("Transaction Report", response?.data);

        this.rows = response?.data || [];
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

    showDateTimeDialog(row) {
      this.$q
        .dialog({
          title: this.$t("reports.sendInvoice"),
          message: `
            <div class="q-pa-md">

              <div class="q-mt-md">
                <label class="text-subtitle2">${this.$t(
                  "reports.selectDateTime"
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
            data?.data?.invoiceNumber
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
        })
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
        "TransactionReportCustomer.xlsx"
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
          body
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
        /name=["']fail_message["'][^>]*value=["']([^"']*)["']/i
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
