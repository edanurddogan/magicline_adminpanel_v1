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
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="name"
            wrap-cells
            no-data-label="Veri Bulunamadı"
          >
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
import numeral from "numeral";
import "numeral/locales/tr";
import "numeral/locales/en-au";
import "numeral/locales/de";

export default defineComponent({
  name: "AverageMaturityReport",
  computed: {
    columns() {
      return [
        {
          name: "vade",
          required: true,
          label: "B/A",
          align: "center",
          field: (row) => row.vade,
        },
        {
          name: "tutarTL",
          required: true,
          label: "Toplam TL",
          align: "center",
          field: (row) => numeral(row.tutarTL).format("0.0[,]00 ₺"),
        },
        {
          name: "tutarUSD",
          required: true,
          label: "Toplam USD",
          align: "center",
          field: (row) => numeral(row.tutarUSD).format("0.0[,]00 $"),
        },
        {
          name: "tutarEUR",
          required: true,
          label: "Toplam EUR",
          align: "center",
          field: (row) => numeral(row.tutarEUR).format("0.0[,]00 €"),
        },
        {
          name: "tutarGBP",
          required: true,
          label: "Toplam GBP",
          align: "center",
          field: (row) => numeral(row.tutarGBP).format("0.0[,]00 £"),
        },
        {
          name: "tarih",
          required: true,
          label: "Vade Tarihi",
          align: "center",
          field: (row) => row.tarih,
        },
      ];
    },
  },
  setup() {},
  data() {
    return {
      selectedFirm: null,
      rows: [],
      firmFull: [],
      firmFiltered: [],
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
          `averageMaturityReport/${this.selectedFirm.firmCode}`
        );
        this.$logger.log("data", data);
        /*data.totalPaymentDebt = Object.entries(data.totalPaymentDebt)
          .map(([key, value]) => `${key}: ${value?.toFixed(2)}`)
          .join("\n");

        data.totalPaymentCredit = Object.entries(data.totalPaymentCredit)
          .map(([key, value]) => `${key}: ${value?.toFixed(2)}`)
          .join("\n");*/

        this.rows = [
          {
            vade: "Borç",
            tarih: data.averageMaturityDebt?.toFixed(0) + " Gün",
            tutarTL: data.totalPaymentDebt.TRY,
            tutarUSD: data.totalPaymentDebt.USD,
            tutarEUR: data.totalPaymentDebt.EUR,
            tutarGBP: data.totalPaymentDebt.GBP,
            tutar: data.totalPaymentDebt,
          },
          {
            vade: "Alacak",
            tarih: data.averageMaturityCredit?.toFixed(0) + " Gün",
            tutarTL: data.totalPaymentCredit.TRY,
            tutarUSD: data.totalPaymentCredit.USD,
            tutarEUR: data.totalPaymentCredit.EUR,
            tutarGBP: data.totalPaymentCredit.GBP,
            tutar: data.totalPaymentCredit,
          },
        ];
      } catch (error) {
        this.$logger.error(error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
});
</script>
