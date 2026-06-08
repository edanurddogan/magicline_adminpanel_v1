<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <q-table
      ref="table"
      flat
      dense
      bordered
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
      <template v-slot:body-cell="props">
        <q-td :props="props">
          {{ props.value }}
        </q-td>
      </template>
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("pages.customers") }}
          </div>
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
            icon="person_add"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="onAdd"
          >
            <q-tooltip>
              {{ $t("pages.addCustomer") }}
            </q-tooltip>
          </q-btn>
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
          >
            <q-tooltip>
              {{ $t("maximize") }}
            </q-tooltip>
          </q-btn>
          <q-space />

          <q-btn
            :label="$t('export')"
            class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
            icon="cloud_download"
            @click="exportTable"
          />
        </div>
      </template>
      <!-- Menu Butonu -->
      <template #body-cell-additionalInfo="props">
        <q-td :props="props">
          <q-btn flat color="primary" icon="more_vert">
            <q-menu transition-show="scale" transition-hide="scale">
              <q-list style="min-width: 100px">
                <!-- Araçlar -->
                <q-item
                  clickable
                  @click="onMenu(props.row, 'CustomerVehiclesForm')"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      size="sm"
                      color="primary"
                      name="electric_car"
                      class="q-mr-sm"
                    />
                    {{ $t("vehicle.vehicles") }}
                  </div>
                </q-item>
                <q-separator />
                <!-- Kredi kartı Bilgileri -->
                <q-item
                  clickable
                  @click="onMenu(props.row, 'CustomerCreditCardsForm')"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      size="sm"
                      color="primary"
                      name="credit_card"
                      class="q-mr-sm"
                    />
                    <span>{{ $t("order.creditCards") }}</span>
                  </div>
                </q-item>
                <q-separator />
                <!-- Şifre Gönder -->
                <q-item
                  clickable
                  @click="onMenu(props.row, 'CustomerResetPasswordForm')"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      size="sm"
                      color="primary"
                      name="password"
                      class="q-mr-sm"
                    />
                    {{ $t("users.resetCustomerPassword") }}
                  </div>
                </q-item>
                <q-separator />
                <!-- Kullanım Geçmişi-->
                <q-item
                  clickable
                  @click="onMenu(props.row, 'CustomerTransactionsForm')"
                  v-close-popup
                >
                  <div class="row items-center">
                    <q-icon
                      size="sm"
                      color="primary"
                      name="history"
                      class="q-mr-sm"
                    />
                    {{ $t("reports.transactionReport") }}
                  </div>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
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
            >{{ props.row.isActive ? $t("active") : $t("inactive") }}
          </q-chip>
        </q-td>
      </template>
      <!-- İşlemler Butonları -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            color="primary"
            icon="mail"
            :href="'mailto:' + props.row.email"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("sendemail") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            color="secondary"
            icon="phone"
            :href="'tel:' + props.row.phone"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("tocall") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            color="green"
            icon="chat"
            :href="'https://wa.me/' + formatPhoneForWhatsApp(props.row.phone)"
            target="_blank"
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              >{{ $t("users.whatsapp") }}</q-tooltip
            >
          </q-btn>

          <q-btn
            flat
            dense
            round
            color="primary"
            icon="info"
            @click="onView(props.row)"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("view") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            color="secondary"
            icon="edit"
            @click="onEdit(props.row)"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("edit") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            color="negative"
            icon="delete_forever"
            @click="onDeleteUser(props.row)"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("delete") }}
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

    <!-- Form Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 70vw; max-height: 90vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("users.customer") }}</span>
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
        <q-card-section style="max-height: 80vh" class="scroll">
          <customer-form
            class="q-pa-sm"
            v-model="currentRow"
            :mode="currentMode"
            @completed="onFormCompleted"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="deleteConfirm" persistent>
      <q-card class="q-pa-md text-center">
        <q-card-section>
          <q-avatar icon="person_off" color="negative" text-color="white" />
          <h5>{{ $t("users.customerdeleteconfirm") }}</h5>
        </q-card-section>
        <q-card-section>
          <p>
            {{ $t("users.name") }} {{ $t("users.surname") }} :
            {{ currentRow.name }} {{ currentRow.surname }}
          </p>
        </q-card-section>

        <q-card-actions align="between">
          <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('delete')"
            color="negative"
            v-on:click="deleteRow()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Form Dialog Menu-->
    <q-dialog
      v-model="formVisibleMenu"
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card :style="{ minWidth: cardWidth, maxHeight: cardHeight }">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold"
                >{{ $t("users.customer") }} - {{ currentRow.name }}
                {{ currentRow.surname }}</span
              >
            </q-toolbar-title>

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
        <q-card-section class="q-pa-sm">
          <component
            :is="currentComponent"
            :modelValue="currentRow"
            @completed="onFormCompleted"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import * as XLSX from "xlsx";
import CustomerForm from "src/components/forms/CustomerForm.vue";
import CustomerVehiclesForm from "src/components/forms/CustomerVehiclesForm.vue";
import CustomerCreditCardsForm from "src/components/forms/CustomerCreditCardsForm.vue";
import CustomerTransactionsForm from "src/components/forms/CustomerTransactionsForm.vue";
import CustomerResetPasswordForm from "src/components/forms/CustomerResetPasswordForm.vue";

export default defineComponent({
  components: {
    CustomerForm,
    CustomerVehiclesForm,
    CustomerCreditCardsForm,
    CustomerTransactionsForm,
    CustomerResetPasswordForm,
  },
  computed: {
    columns() {
      return [
        {
          name: "nameSurname",
          label: this.$t("users.nameSurname"),
          align: "left",
          field: (row) => `${row.name} ${row.surname}`,
          sortable: true,
        },
        {
          name: "email",
          label: this.$t("email"),
          field: "email",
          align: "left",
        },
        {
          label: this.$t("phone"),
          field: (row) => row.phone,
          align: "left",
        },
        {
          name: "additionalInfo",
          label: this.$t("additionalInfo"),
          field: (row) => row,
          align: "center",
          sortable: false,
        },
        {
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
        },
        /*{
          required: true,
          name: "id",
          field: (row) => row.kullaniciId,
          sortable: false,
          classes: "hidden",
        },*/
      ];
    },
  },
  data() {
    return {
      loading: true,
      rows: [],
      selectedId: 0,
      cardWidth: "70vw",
      cardHeight: "70vh",
      formVisible: false,
      formVisibleMenu: false,
      deleteConfirm: false,
      currentComponent: "",
      currentMode: "add",
      currentRow: {},
      maximizedToggle: false,
      filter: "",
      pagination: { rowsPerPage: 20 },
    };
  },
  async mounted() {
    document.title = `${firm.name}-${this.$t("pages.customers")}`;
    this.init();
  },
  methods: {
    init() {
      this.getList();
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onView(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onEdit(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onDelete(row) {
      this.currentRow = row;
      this.deleteConfirm = true;
    },
    onMenu(row, componentName) {
      if (componentName === "CustomerTransactionsForm") {
        this.cardWidth = "90vw";
      } else if (componentName === "CustomerResetPasswordForm") {
        this.cardWidth = "40vw";
      } else {
        this.cardWidth = "70vw";
      }
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentComponent = componentName;
      this.formVisibleMenu = true;
    },

    toCall(id) {
      const _user = Object.assign(
        {},
        this.rows.find((row) => row.kullaniciId === id),
      );
      return "tel:" + _user.kullaniciTelefon;
    },
    toMail(id) {
      const _user = Object.assign(
        {},
        this.rows.find((row) => row.kullaniciId === id),
      );
      return "mailto:" + _user.kullaniciEposta;
    },
    exportTable() {
      const table = this.$refs.table;
      const rows = table.filteredSortedRows; // sadece filtrelenmiş ve sıralanmışlar
      // İstenmeyen sütunlarını hariç tut
      const excludedLabels = ["İşlem", "Araçlar"];
      const exportColumns = this.columns.filter(
        (col) => !excludedLabels.includes(col.label),
      );

      // Başlık ve Veri
      const header = exportColumns.map((col) => col.label);
      const data = rows.map((row) =>
        exportColumns.map((col) =>
          typeof col.field === "function" ? col.field(row) : row[col.field],
        ),
      );

      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      worksheet["!cols"] = [
        { wch: 30 }, // 1. sütun
        { wch: 30 }, // 2. sütun
        { wch: 20 }, // 3. sütun
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      XLSX.writeFile(workbook, "CustomerList.xlsx");
    },
    async deleteRow() {
      this.currentRow.isActive = false;
      const response = await this.$api.put("putCustomer", this.currentRow);

      this.deleteConfirm = false;
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        const response = await this.$api.get("getCustomers/999/1/false");
        this.rows = response?.data;
        this.$logger.log("getCustomers:", this.rows);
        this.loading = false;
      } catch (error) {
        this.$logger.error("Error getList:", error);
      }
    },

    formatPhoneForWhatsApp(number) {
      if (!number) return "";
      number = number.trim();

      if (!number.startsWith("+")) {
        number = "+90" + number;
      }

      return number.replace(/\D/g, "");
    },
    onFormCompleted() {
      try {
        this.formVisible = false;
        this.formVisibleMenu = false;
        this.getList();
      } catch (error) {
        this.$logger.error("onFormCompleted", error);
      }
    },
  },
});
</script>
<style lang="sass">
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
