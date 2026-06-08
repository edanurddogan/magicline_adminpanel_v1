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
      no-data-label="I didn't find anything for you"
      no-results-label="Filtreleme Sonucu Yok"
      row-key="id"
    >
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("pages.employees") }}
          </div>
          <q-input
            class="col-lg-2 col-md-6 col-sm-12 col-xs-12"
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
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("users.addemployee") }}
            </q-tooltip>
          </q-btn>
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
          <q-btn
            flat
            round
            dense
            icon="lock_person"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="authorizationFormVisible = true"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{ $t("users.employeegroups") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
          >
            <q-tooltip transition-show="flip-right" transition-hide="flip-left">
              {{
                props.inFullscreen ? $t("fullscreen_exit") : $t("fullscreen")
              }}
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
            :href="'tel:' + props.row.mobilePhone"
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
            :href="
              'https://wa.me/' + formatPhoneForWhatsApp(props.row.mobilePhone)
            "
            target="_blank"
          >
            <q-tooltip>{{ $t("users.whatsapp") }}</q-tooltip>
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

    <!-- Employee Form -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 90vw; max-height: 90vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("users.employee") }}</span>
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
          <employee-form
            class="q-pa-sm"
            v-model="currentRow"
            :mode="currentMode"
            @completed="onFormCompleted"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Authorization Form -->
    <q-dialog
      v-model="authorizationFormVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 50vw; max-height: 90vh">
        <q-card-section class="q-pa-sm">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("users.employee") }}</span>
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
        <q-card-section style="max-height: 85vh" class="scroll q-pa-sm">
          <authorization
            class="q-pa-sm"
            v-model="currentRow"
            :mode="currentMode"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Employee Delete -->
    <q-dialog v-model="deleteConfirm" persistent>
      <q-card class="q-pa-md text-center">
        <q-card-section>
          <q-avatar icon="person_off" color="negative" text-color="white" />
          <h5>{{ $t("users.employeedeleteconfirm") }}</h5>
          <p>{{ $t("users.email") }} : {{ currentRow.email }}</p>
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
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { firm } from "../../package.json";
import EmployeeForm from "src/components/forms/EmployeeForm.vue";
import Authorization from "src/pages/Authorization.vue";
import * as XLSX from "xlsx";

export default defineComponent({
  components: {
    EmployeeForm,
    Authorization,
  },
  computed: {
    columns() {
      return [
        {
          name: "usertitle",
          label: this.$t("usertitle"),
          align: "left",
          field: "title",
          sortable: true,
        },
        {
          name: "nameSurname",
          label: this.$t("users.nameSurname"),
          align: "left",
          field: (row) => `${row.name} ${row.surname}`,
          sortable: true,
        },
        {
          label: this.$t("email"),
          field: "email",
          align: "left",
        },
        {
          label: this.$t("phone"),
          field: "mobilePhone",
          align: "left",
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
      ];
    },
  },
  data() {
    return {
      loading: true,
      rows: [],
      selectedId: 0,
      formVisible: false,
      authorizationFormVisible: false,
      deleteConfirm: false,
      currentMode: "add",
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      pagination: {
        rowsPerPage: 20,
      },
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    init() {
      document.title = `${firm.name}-${this.$t("pages.employees")}`;
      try {
        this.getList();
      } catch (error) {}
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onView(employee) {
      this.maximizedToggle = false;
      this.currentRow = employee;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onEdit(employee) {
      this.maximizedToggle = false;
      this.currentRow = employee;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onDeleteUser(employee) {
      this.currentRow = employee;
      this.deleteConfirm = true;
    },
    onFormCompleted() {
      this.formVisible = false;
      this.getList();
    },
    toCall(id) {
      const _user = Object.assign(
        {},
        this.rows.find((row) => row.id === id)
      );
      return "tel:" + _user.mobilePhone;
    },
    toMail(id) {
      const _user = Object.assign(
        {},
        this.rows.find((row) => row.id === id)
      );
      return "mailto:" + _user.email;
    },
    exportTable() {
      const table = this.$refs.table;
      const rows = table.filteredSortedRows; // sadece filtrelenmiş ve sıralanmışlar
      // İstenmeyen sütunlarını hariç tut
      const excludedLabels = ["İşlem"];
      const exportColumns = this.columns.filter(
        (col) => !excludedLabels.includes(col.label)
      );

      // Başlık ve Veri
      const header = exportColumns.map((col) => col.label);
      const data = rows.map((row) =>
        exportColumns.map((col) =>
          typeof col.field === "function" ? col.field(row) : row[col.field]
        )
      );

      const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      //Sütun sabit genişlik verme
      worksheet["!cols"] = [
        { wch: 30 }, // 1. sütun
        { wch: 30 }, // 2. sütun
        { wch: 20 }, // 3. sütun
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      XLSX.writeFile(workbook, "EmployeesList.xlsx");
    },
    async deleteRow() {
      const response = await this.$api.put("employees/" + this.currentRow.id);
      this.getList();
      this.deleteConfirm = false;
      this.$logger.log(response);
    },
    async getList() {
      try {
        const response = await this.$api.get("getEmployees");
        this.rows = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.log(error);
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
