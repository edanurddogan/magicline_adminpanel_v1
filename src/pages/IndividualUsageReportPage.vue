<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <!-- User Filtreleme -->
  <div id="divToHideFilter" class="row q-pa-md">
    <q-card>
      <q-list class="row">
        <q-item>
          <!-- Başlangıç Tarihi Seçimi -->
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
                      <q-btn v-close-popup label="Close" color="primary" flat />
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
                  <q-time v-model="startDate" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <q-item>
          <!-- Bitiş Tarihi Seçimi -->
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
                      <q-btn v-close-popup label="Close" color="primary" flat />
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
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <q-item>
          <q-btn
            class="q-ml-md"
            color="primary"
            :label="$t('Listele')"
            @click="getList"
          >
            <q-tooltip>
              {{ $t("search") }}
            </q-tooltip>
          </q-btn>
        </q-item>
      </q-list>
    </q-card>
  </div>
  <!-- User Tablo -->
  <div class="q-pa-md">
    <q-table
      flat
      :dense="tableDense"
      bordered
      :rows="filteredRows"
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
            :icon="props.row.EInvoiceNumber ? 'receipt' : 'receipt'"
            :color="props.row.EInvoiceNumber ? 'green' : 'amber'"
            @click="sendInvoice(props.row)"
            ><!--:disabled="props.row.EInvoiceNumber"-->
            <q-tooltip>
              {{
                !props.row.EInvoiceNumber
                  ? $t("sendInvoice")
                  : $t("sendInvoiceSuccess")
              }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            :icon="
              props.row.UserAmount > props.row.TotalAmount
                ? 'credit_card'
                : 'credit_score'
            "
            :color="
              props.row.UserAmount > props.row.TotalAmount ? 'amber' : 'green'
            "
            :disabled="
              props.row.UserAmount > props.row.TotalAmount ? false : true
            "
            @click="getPayment(props.row)"
          >
            <q-tooltip>
              {{
                props.row.UserAmount > props.row.TotalAmount
                  ? $t("getPayment")
                  : $t("getPaymentSuccess")
              }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          <span> {{ message }}... </span>
        </div>
      </template>
    </q-table>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import { Platform } from "quasar";
import * as XLSX from "xlsx";

export default defineComponent({
  components: {},
  computed: {
    columns() {
      return [
        {
          name: "TransactionID",
          label: this.$t("TransactionID"),
          align: "left",
          field: "TransactionID",
        },
        {
          name: "StationName",
          label: this.$t("StationName"),
          align: "left",
          field: "StationName",
        },
        {
          name: "StartTime",
          label: this.$t("date"),
          align: "left",
          sortable: true,
          field: (row) => this.dateFormat(row.StartTime),
        },
        {
          name: "FirstName",
          label: this.$t("FirstName"),
          align: "left",
          field: (row) =>
            row.CustomerName ? row.CustomerName : row.UserFirstName,
          sortable: true,
        },
        {
          name: "Surname",
          label: this.$t("Surname"),
          align: "center",
          field: (row) =>
            row.CustomerSurname ? row.CustomerSurname : row.UserSurname,
          sortable: true,
        },
        {
          name: "Plate",
          label: this.$t("Plate"),
          align: "center",
          field: "Plate",
          sortable: true,
        },
        {
          name: "CompanyType",
          label: this.$t("CompanyType"),
          align: "right",
          field: (row) => (row.CompanyType == 1 ? "Kurumsal" : "Bireysel"),
          sortable: true,
        },
        //{
        //  name: "UsedMeter",
        //  label: this.$t("UsedMeter"),
        //  align: "center",
        //  field: "UsedMeter",
        //  sortable: true,
        //},
        //{
        //  name: "Price",
        //  label: this.$t("Price"),
        //  align: "right",
        //  field: (row) => (row.Price ? row.Price.toFixed(2) : 0) + " ₺",
        //  sortable: true,
        //},
        //{
        //  name: "Amount",
        //  label: this.$t("Amount"),
        //  align: "right",
        //  field: (row) => (row.Amount ? row.Amount.toFixed(2) : 0) + " ₺",
        //  sortable: true,
        //},
        {
          name: "DiscountRate",
          label: this.$t("DiscountRate"),
          align: "right",
          field: (row) => row.DiscountRate + " %",
          sortable: true,
        },
        //{
        //  name: "UserPrice",
        //  label: this.$t("UserPrice"),
        //  align: "right",
        //  field: (row) => (row.UserPrice ? row.UserPrice.toFixed(2) : 0) + " ₺",
        //  sortable: true,
        //},
        //{
        //  name: "DiscountAmount",
        //  label: this.$t("DiscountAmount"),
        //  align: "right",
        //  field: (row) =>
        //    (row.DiscountAmount ? row.DiscountAmount.toFixed(2) : 0) + " ₺",
        //  sortable: true,
        //},
        {
          name: "UserAmount",
          label: this.$t("UserAmount"),
          align: "right",
          field: (row) =>
            (row.UserAmount ? row.UserAmount.toFixed(2) : 0) + " ₺",
          sortable: true,
        },
        {
          name: "receivedPayment",
          label: this.$t("receivedPayment"),
          align: "right",
          field: (row) =>
            (row.TotalAmount ? row.TotalAmount.toFixed(2) : 0) + " ₺",
          sortable: true,
        },
        {
          name: "EInvoiceNumber",
          label: this.$t("EInvoiceNumber"),
          align: "right",
          field: (row) => row.EInvoiceNumber,
          sortable: true,
        },
        {
          name: "action",
          label: this.$t("action"),
          align: "center",
        },
      ];
    },
  },
  data() {
    return {
      loading: false,
      rows: [],
      filteredRows: [],
      maximizedToggle: false,
      filter: "",
      isGrid: false,
      pagination: {
        rowsPerPage: 20,
      },

      whereDidYou: [],
      selectedWhereDidYou: [],
      userTypes: [],
      selectedUserTypes: [],
      referenceUsers: [],
      tableDense: true,

      startDate: new Date(),
      endDate: new Date(),
      stations: [],
      selectedFirm: { DealerID: 0, DealerName: "Firma Seç" },
      firmFiltered: [],
      firmFull: [],
    };
  },
  async mounted() {
    this.init();
    document.title = `${firm.name}-${this.$t("reports.individualUsageReport")}`;
  },
  methods: {
    init() {
      //this.getList();
      this.getFirm();
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
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
            <p>${this.$t("reports.sendInvoiceMessage")}</p>
            <div class="q-mt-md">
              <label class="text-subtitle2">${
                this.$t("selectDateTime") || "Tarih ve Saat Seçin"
              }:</label>
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
            label: this.$t("send") || "Gönder",
            color: "primary",
          },
          cancel: {
            label: this.$t("cancel") || "İptal",
            flat: true,
          },
        })
        .onOk(() => {
          // Dialog'dan tarih ve saat değerlerini al
          const dateInput = document.getElementById("invoiceDate");
          const timeInput = document.getElementById("invoiceTime");

          const selectedDate = dateInput
            ? dateInput.value
            : this.getCurrentDate();
          const selectedTime = timeInput
            ? timeInput.value
            : this.getCurrentTime();
          const selectedDateTime = `${selectedDate} ${selectedTime}`;

          // API'ye gönderilecek veriyi hazırla
          const invoiceData = {
            ...row,
            selectedDateTime: selectedDateTime,
          };

          this.$api
            .post("sendInvoice", invoiceData)
            .then((response) => {
              if (response.data.success) {
                this.$q.notify({
                  type: "positive",
                  message: this.$t("sendInvoiceSuccess"),
                });
                row.EInvoiceNumber = response.data.data.invoiceNumber;
              } else {
                this.$q.notify({
                  type: "negative",
                  message: response.data.error || this.$t("sendInvoiceError"),
                });
              }
            })
            .catch((error) => {
              this.$logger.error(error);
              this.$q.notify({
                type: "negative",
                message:
                  error.response.data.error || this.$t("sendInvoiceError"),
              });
            });
        });
    },

    getCurrentDate() {
      const now = new Date();
      return now.toISOString().split("T")[0]; // YYYY-MM-DD formatı
    },

    getCurrentTime() {
      const now = new Date();
      return now.toTimeString().split(" ")[0].substring(0, 5); // HH:MM formatı
    },

    formatCurrentDateTime() {
      const now = new Date();
      return this.dateFormat(now);
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
        second: "2-digit",
        hour12: false,
      };

      const formatted = date
        .toLocaleString("tr-TR", options)
        .replace(/\. /g, ".") // Ay ve gün arasında nokta
        .replace(",", ""); // Virgülü kaldır

      //this.$logger.log(formatted);
      return formatted;
    },

    async getList() {
      try {
        this.loading = true;
        let body = {
          startDate: this.startDate,
          endDate: this.endDate,
        };
        const response = await this.$api.post(
          `/old/getStationTransactionsFull`,
          body
        );

        this.rows = this.filteredRows = response?.data;
        this.$logger.log("this.rows", this.rows);

        this.loading = false;
      } catch (error) {
        this.$logger.error(error);
      }
    },

    async getFirm() {
      const response = this.$api.get("old/getDealer").then((data) => {
        this.firmFull = this.firmFiltered = data.data;
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

    exportTable() {
      try {
        // Başlıkları ekle
        const headers = this.columns.map((col) => col.label);
        const rows = this.rows.map((obj) =>
          headers.map((header) => obj[header])
        );
        const data = [headers, ...rows];

        // Çalışma sayfası oluştur
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Kolon formatları (ör: tarih ve fiyat için)
        // Tarih sütunu örneği: 2. kolonu (B) tarih olarak ayarla
        //ws["!cols"] = [
        //  { wch: 15 }, // StationCode
        //  { wch: 22, z: "dd.mm.yyyy hh:mm:ss" }, // Tarih
        //  {},
        //  {},
        //  {},
        //  {},
        //  {},
        //  {},
        //  {},
        //  {},
        //];

        // Dosya oluştur
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `${this.selectedFirm.DealerName}`);

        // Kaydet
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          `KullanımRaporu_${this.selectedFirm.DealerName}.xlsx`
        );
      } catch (error) {
        this.$logger.error("Export error:", error);
      }
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
</style>
