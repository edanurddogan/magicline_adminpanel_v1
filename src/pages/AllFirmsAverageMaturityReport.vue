<!--backenddeki verileri çekip tabloya yazdırma işlemi, öncelikle firma q-select ile seçilip bir tabloda toplam tutar, vade günü ve vade tarihi bilgisi yer alacak şekilde bir tablo oluşturulacak.
yukarıdaki bilgilere göre kodu yaz <-->
<template>
  <div class="row">
    <div class="col-12">
      <q-card>
        <q-card-actions> </q-card-actions>
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
                  {{ $t("reports.allFirmsAverageMaturityReport") }}
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
                  label="Raporu Oluştur"
                  class="q-ml-md float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
                  icon-right="send"
                  text-color="white"
                  @click="fetchData"
                />
                <q-btn
                  :label="$t('export')"
                  class="q-ml-md float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
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
            <!--<template v-slot:body-cell-vade="props">
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
            </template>-->
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import exportFromJSON from "export-from-json";
import numeral from "numeral";
import "numeral/locales/tr";
import "numeral/locales/en-au";
import "numeral/locales/de";

export default defineComponent({
  name: "AllFirmsAverageMaturityReport",
  computed: {
    columns() {
      return [
        {
          name: "firma",
          required: true,
          label: "Firma",
          align: "left",
          sortable: true,
          field: (row) => row.firma,
        },
        /*{
          name: "vade",
          required: true,
          label: "B/A",
          align: "center",
          field: (row) => row.vade,
        },*/
        {
          name: "tutarTL",
          required: true,
          label: "Toplam TL",
          align: "center",
          sortable: true,
          field: "tutarTL",
          format: (val) => numeral(val).format("0,0.00") + " ₺",
        },
        /*{
          name: "TLBA",
          required: true,
          label: "TL B/A",
          align: "center",
          field: (row) => (row.tutarTL > 0 ? "B" : "A"),
        },*/
        {
          name: "tutarUSD",
          required: true,
          label: "Toplam USD",
          align: "center",
          sortable: true,
          field: "tutarUSD",
          format: (val) => numeral(val).format("0,0.00") + " $",
        },
        {
          name: "tutarEUR",
          required: true,
          label: "Toplam EUR",
          align: "center",
          sortable: true,
          field: "tutarEUR",
          format: (val) => numeral(val).format("0,0.00") + " €",
        },
        {
          name: "tutarGBP",
          required: true,
          label: "Toplam GBP",
          align: "center",
          sortable: true,
          field: "tutarGBP",
          format: (val) => numeral(val).format("0,0.00" + " £"),
        },
        {
          name: "tarih",
          required: true,
          label: "Vade Tarihi",
          align: "center",
          sortable: true,
          field: (row) => row.tarih,
        },
      ];
    },
  },
  setup() {},
  created() {},
  data() {
    return {
      selectedFirm: null,
      rows: [],
      firmFull: [],
      firmFiltered: [],
      filter: "",
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
    async fetchData() {
      let countdown = 0;
      this.$q.loading.show({
        message: `Cari Raporu Yükleniyor... ${countdown} / 656`,
      });

      const intervalId = setInterval(() => {
        countdown += 1;
        this.$q.loading.show({
          message: `Cari Raporu Yükleniyor... ${countdown} / 656`,
        });

        if (countdown >= 656) {
          clearInterval(intervalId);
          //this.$q.loading.hide();
        }
      }, 80);

      try {
        // API çağrısını burada yapın
        const data = await this.createReport();
      } catch (error) {
        this.$logger.error("API çağrısı başarısız:", error);
      } finally {
        clearInterval(intervalId);
        this.$q.loading.hide();
      }
    },
    async createReport() {
      try {
        this.$q.loading.show({
          message: "Some important process  is in progress. Hang on...",
        });
        const { data } = await this.$api.post(`allFirmsAverageMaturityReport`);
        this.$logger.log("data", data);

        this.rows = data.map((d) => {
          return {
            firma: d.entityCode + " - " + d.entityName,
            vade: "Borç Alacak Farkı",
            tutarTL:
              d.totalPaymentCredit.TRY - d.totalPaymentDebt.TRY /*+ " ₺"*/,
            tutarUSD:
              d.totalPaymentCredit.USD - d.totalPaymentDebt.USD /*+ " $"*/,
            tutarEUR:
              d.totalPaymentCredit.EUR - d.totalPaymentDebt.EUR /*+ " €"*/,
            tutarGBP:
              d.totalPaymentCredit.GBP - d.totalPaymentDebt.GBP /*+ " £"*/,
            tarih:
              "Borç: " +
              (d?.averageMaturityDebt || 0)?.toFixed(0) +
              " Gün" +
              " - Alacak: " +
              (d?.averageMaturityCredit || 0)?.toFixed(0) +
              " Gün",
          };
        });
      } catch (error) {
        this.$logger.error(error);
      } finally {
        this.$q.loading.hide();
      }
    },
    exportTable() {
      const data = this.rows;
      const fileName = "OrtalamaVadeRaporu";
      const exportType = exportFromJSON.types.xls;

      exportFromJSON({ data, fileName, exportType });
    },
  },
});
</script>
