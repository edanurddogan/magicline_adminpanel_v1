<!--backenddeki verileri çekip tabloya yazdırma işlemi, öncelikle firma q-select ile seçilip bir tabloda toplam tutar, vade günü ve vade tarihi bilgisi yer alacak şekilde bir tablo oluşturulacak.
yukarıdaki bilgilere göre kodu yaz <-->
<template>
  <div class="row">
    <div class="col-12">
      <q-card>
        <q-card-section>
          <q-list class="row">
            <q-item class="q-ml-md col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  use-input
                  v-model="selectedFirm"
                  :options="firmFiltered"
                  label="Firma"
                  option-value="id"
                  option-label="value"
                  map-options
                  options-dense
                  @filter="filterFirm"
                >
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="q-ml-md col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <q-item-section>
                <q-btn
                  color="secondary"
                  label="Raporu Oluştur"
                  icon-right="send"
                  text-color="white"
                  @click="createReport"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12">
      <q-card>
        <q-card-section>
          <q-list class="row">
            <q-item class="q-ml-md col-lg-2 col-md-2 col-sm-4 col-xs-4">
              <q-item-section>
                <q-select
                  v-model="selectedBA"
                  :options="listBA"
                  label="B/A"
                  map-options
                  options-dense
                  @update:model-value="(val) => filterReport(val)"
                >
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="q-ml-md col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="selectedMovementType"
                  :options="listStatementType"
                  label="Hareket Tipi"
                  map-options
                  options-dense
                  @update:model-value="(val) => filterReport(val)"
                >
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="q-ml-md col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  v-model="startDate"
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('startDate')"
                  @change="filterReport()"
                />
              </q-item-section>
            </q-item>
            <q-item class="q-ml-md col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  v-model="endDate"
                  type="date"
                  :disable="mode === 'details'"
                  :label="$t('endDate')"
                  @change="filterReport()"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12">
      <q-card>
        <q-card-section>
          <q-table
            dense
            :rows="rows"
            :columns="columns"
            row-key="name"
            wrap-cells
            :filter="filter"
            :pagination="pagination"
            no-data-label="Veri Bulunamadı"
          >
            <template v-slot:top="props">
              <div class="row col-12">
                <div
                  class="col-lg-3 col-md-6 col-sm-12 col-xs-12 q-table__title"
                >
                  {{ $t("reports.accountStatement") }}
                </div>
                <q-space />
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
                  :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  @click="props.toggleFullscreen"
                  class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                >
                  <q-tooltip>
                    {{ $t("fullscreen") }}
                  </q-tooltip>
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

            <template v-slot:no-data="{ icon, message, filter }">
              <div class="full-width row flex-center q-gutter-sm">
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                <span> {{ message }}... </span>
              </div>
            </template>
            <template v-slot:body-cell-vade="props">
              <q-td :props="props">
                {{ props.row.vade }}
              </q-td>
            </template>
            <template v-slot:body-cell-tutar="props">
              <q-td :props="props">
                {{ props.row.tutar }}
              </q-td>
            </template>
            <template v-slot:body-cell-tarih="props">
              <q-td :props="props">
                {{ props.row.tarih }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar, date } from "quasar";
import numeral from "numeral";
import "numeral/locales/tr";
import "numeral/locales/en-au";
import "numeral/locales/de";
import tr from "src/i18n/tr";

export default defineComponent({
  name: "EntityReport",
  computed: {
    columns() {
      return [
        {
          name: "type",
          required: true,
          label: "B/A",
          align: "center",
          sortable: true,
          field: (row) => row.type,
        },
        {
          name: "DoC_NO",
          required: true,
          label: "Belge No",
          align: "center",
          sortable: true,
          field: (row) => row.doC_NO,
        },
        {
          name: "amT_TRA",
          required: true,
          label: "Tutar",
          align: "center",
          sortable: true,
          field: (row) =>
            numeral(row.amT_TRA).format("0.0[,]00") + " " + row.currency,
        },
        {
          name: "cratedDate",
          required: true,
          label: "Belge Tarihi",
          align: "center",
          sortable: true,
          sortMethod: (a, b) => parseDate(a) - parseDate(b),
          field: (row) => this.parseDate(row.doC_DATE),
          format: (val) => val.toLocaleDateString("tr-TR"),
        },
        {
          name: "date",
          required: true,
          label: "Vade Tarihi",
          align: "center",
          sortable: true,
          field: (row) => this.parseDate(row.duE_DATE),
          format: (val) => val.toLocaleDateString("tr-TR"),
        },
        {
          name: "movementType",
          required: true,
          label: "Hareket Tipi",
          align: "center",
          sortable: true,
          field: (row) => row.movementType,
        },
      ];
    },
  },
  setup() {},
  data() {
    return {
      filter: "",
      selectedFirm: null,
      startDate: new Date(new Date().getFullYear(), 0, 2)
        .toISOString()
        .substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      selectedBA: "Tümü",
      listBA: ["Tümü", "Borç", "Alacak"],
      selectedMovementType: "Tümü",
      listStatementType: ["Tümü", "Banka Hareketi", "Çek", "Fatura"],
      rows: [],
      dataFull: [],
      firmFull: [],
      firmFiltered: [],
      pagination: {
        rowsPerPage: 50,
      },
    };
  },
  mounted() {
    this.getFirm();
  },
  methods: {
    async getFirm() {
      const response = this.$api.get("firmDetailList").then((data) => {
        this.firmFull = data.data;
        this.firmFull = this.firmFull.map((f) => {
          f.value = `${f.firmCode} - ${f.commercialTitle}`;
          return f;
        });
      });
    },
    async filterFirm(val, update) {
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
    async createReport() {
      this.$logger.log("createReport", this.selectedFirm);
      if (!this.selectedFirm.firmCode) {
        return;
      }
      this.$logger.log(this.selectedFirm.firmCode);
      try {
        this.$q.loading.show();
        const { data } = await this.$api.post(
          `getEntityReport/${this.selectedFirm.firmCode}`
        );
        this.$logger.log("data", data);
        const rows = [];

        data.bankMovements.forEach((item) => {
          rows.push({
            doC_NO: item.doC_NO,
            duE_DATE: date.formatDate(item.duE_DATE, "DD.MM.YYYY"),
            doC_DATE: date.formatDate(item.doC_DATE, "DD.MM.YYYY"),
            amT_TRA: item.amT_TRA,
            type: item.type,
            currency: item.currency,
            movementType: "Banka Hareketi",
          });
        });

        data.checks.forEach((item) => {
          rows.push({
            doC_NO: item.doC_NO,
            duE_DATE: date.formatDate(item.duE_DATE, "DD.MM.YYYY"),
            doC_DATE: date.formatDate(item.doC_DATE, "DD.MM.YYYY"),
            amT_TRA: item.amT_TRA,
            type: item.type,
            currency: item.currency,
            movementType: "Çek",
          });
        });

        data.invoices.forEach((item) => {
          rows.push({
            doC_NO: item.doC_NO,
            duE_DATE: date.formatDate(item.duE_DATE, "DD.MM.YYYY"),
            doC_DATE: date.formatDate(item.doC_DATE, "DD.MM.YYYY"),
            amT_TRA: item.amT_TRA,
            type: item.type,
            currency: item.currency,
            movementType: "Fatura",
          });
        });

        rows.sort(
          (a, b) => this.parseDate(a.doC_DATE) - this.parseDate(b.doC_DATE)
        );

        this.$logger.log("rows", rows);
        this.rows = rows;
        this.dataFull = rows;
      } catch (error) {
        this.$logger.error(error);
      } finally {
        this.$q.loading.hide();
      }
    },
    filterReport() {
      try {
        if (this.selectedBA === "Tümü") this.rows = this.dataFull;
        else if (this.selectedBA === "Borç")
          this.rows = this.dataFull.filter((v) => v.type === "Borç");
        else if (this.selectedBA === "Alacak")
          this.rows = this.dataFull.filter((v) => v.type === "Alacak");

        if (this.selectedMovementType === "Banka Hareketi") {
          this.rows = this.rows.filter(
            (v) => v.movementType === "Banka Hareketi"
          );
        } else if (this.selectedMovementType === "Çek")
          this.rows = this.rows.filter((v) => v.movementType === "Çek");
        else if (this.selectedMovementType === "Fatura")
          this.rows = this.rows.filter((v) => v.movementType === "Fatura");

        this.rows = this.rows.filter((v) => {
          let startDate = new Date(this.startDate);
          let endDate = new Date(this.endDate);
          let doC_DATE = v.doC_DATE.replace(/\./gi, "-");
          // doc_DATE to YYYY-MM-DD format
          doC_DATE = doC_DATE.split("-").reverse().join("-");
          let date = new Date(doC_DATE);
          //startdate to timestamp number format
          startDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          ).getTime();
          //enddate to timestamp number format
          endDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
          ).getTime();
          //date to timestamp number format
          date = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).getTime();

          return date >= startDate && date <= endDate;
        });

        this.$logger.log("rows", this.rows);
      } catch (error) {
        this.$logger.error(error);
      }
    },
    parseDate(dateString) {
      const [day, month, year] = dateString.split(".").map(Number);
      return new Date(year, month - 1, day);
    },
  },
});
</script>
