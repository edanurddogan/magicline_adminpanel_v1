<script setup>
import { useLayoutStore } from "src/stores/layout";

const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <q-card>
      <q-list class="row">
        <q-item>
          <q-select
            ref="selectProduct"
            outlined
            use-input
            clearable
            transition-show="scale"
            transition-hide="scale"
            input-debounce="0"
            v-model="selectedStockCard"
            option-value="id"
            option-label="value"
            :label="$t('products.product')"
            @filter="filterProduct"
            :options="productsFiltered"
            @update:model-value="(val) => getList()"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("noresults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item>
        <q-item v-if="false">
          <q-select
            ref="selectCategories"
            outlined
            use-input
            clearable
            transition-show="scale"
            transition-hide="scale"
            input-debounce="0"
            v-model="selectedCategories"
            option-value="id"
            option-label="name"
            :label="$t('products.category')"
            :options="filtredCategories"
            @filter="filterCategory"
            @update:model-value="(val) => getList()"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("noresults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              autofocus
              use-input
              ref="selectFirm"
              outlined
              v-model="selectedFirm"
              option-value="id"
              option-label="value"
              :options="firmFiltered"
              @filter="filterFirm"
              :label="$t('order.orderfirm')"
              @update:model-value="(val) => getList(val)"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-btn
            outline
            flat
            round
            color="primary"
            icon="category"
            @click="showCategoryPopup"
          >
            {{ $t("products.category") }}
          </q-btn>
        </q-item>
        <q-item>
          <q-input
            v-model="startDate"
            type="date"
            :disable="mode === 'details'"
            :label="$t('startDate')"
            @change="getList()"
          />
        </q-item>
        <q-item>
          <q-input
            v-model="endDate"
            type="date"
            :disable="mode === 'details'"
            :label="$t('endDate')"
            @change="getList()"
          />
        </q-item>
      </q-list>
    </q-card>
  </div>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      dense
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
      :body-style="{ 'max-width': '150px' }"
      row-key="id"
    >
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("reports.SalesReport") }}
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
          <!-- <q-btn flat round dense icon="add" class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2" @click="onAdd">
            <q-tooltip>
              {{ $t("add") }}
            </q-tooltip>
          </q-btn> -->

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
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
          >
            <q-tooltip>
              {{ $t("fullscreen") }}
            </q-tooltip>
          </q-btn>
          <!-- <q-space />
          <q-btn flat round dense :icon="isGrid ? 'list' : 'grid_on'" @click="isGrid = !isGrid"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2">
            <q-tooltip v-close-popup>{{ isGrid ? "List" : "Grid" }}</q-tooltip>
          </q-btn>
          <q-space /> -->
          <q-space />
          <q-space />
          <q-btn
            :label="$t('Listeyi Getir')"
            class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-1 col-sm-1 col-xs-2"
            icon="get_app"
            @click="getList"
          >
            <q-tooltip>
              {{ $t("Listeyi Getir") }}
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

      <template #body-cell-technicalServiceStatus="props">
        <q-td :props="props">
          <!--<q-chip
            color="info"
            text-color="white"
            dense
            class="text-weight-bolder"
            square
            >-->{{ props.row.technicalServiceStatus.status }}
          <!--</q-chip>-->
        </q-td>
      </template>
      <template #body-cell-detail="props">
        <q-td :props="props">
          {{ props.row.detail.substring(0, 20) }}...
          <q-tooltip style="max-width: 400px" class="text-body2">
            {{ props.row.detail }}
          </q-tooltip>
        </q-td>
      </template>
      <template #body-cell-firmname="props">
        <q-td :props="props">
          {{ props.row.firm.name.substring(0, 20) }}...
          <q-tooltip style="max-width: 400px" class="text-body2">
            {{ props.row.firm.name }}
          </q-tooltip>
        </q-td>
      </template>

      <template #body-cell-technicalServiceProcess="props">
        <q-td :props="props">
          {{ props.row.technicalServiceStatus.process }}
        </q-td>
      </template>

      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="primary"
            icon="info"
            @click="onView(props.row)"
          />
          <q-btn
            flat
            round
            color="secondary"
            icon="edit"
            @click="onEdit(props.row)"
          />
          <q-btn
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
                    >{{ props.row.isActive ? $t("active") : $t("inactive") }}
                  </q-chip>

                  <q-item-section v-else-if="col.name === 'action'" class="row">
                    <div class="row">
                      <q-btn
                        flat
                        round
                        color="primary"
                        icon="info"
                        @click="onView(props.row)"
                      />
                      <q-btn
                        flat
                        round
                        color="secondary"
                        icon="edit"
                        @click="onEdit(props.row)"
                      />
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete_forever"
                        @click="onDeleteUser(props.row)"
                      />
                    </div>
                  </q-item-section>

                  <q-item-label v-else caption>
                    <p>{{ col.value }}</p>
                  </q-item-label>
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

      <template v-slot:bottom-row>
        <q-tr>
          <q-td> </q-td>
          <q-td>
            <b> {{ $t("reports.total") }}:</b></q-td
          >
          <q-td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b>{{ totalQuantity }}</b>
          </q-td>
          <q-td> </q-td>
          <q-td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b>{{ totalAmountVatExcluded }}</b>
          </q-td>
          <q-td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b>{{ totalAmountVat }} </b>
          </q-td>
        </q-tr>
      </template>

      <!-- <template v-slot:bottom>
        Bottom
      </template> -->
    </q-table>

    <!-- Form Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 40vw; max-height: 95vh">
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-lg">
            <q-icon name="category" />

            <q-toolbar-title
              ><span class="text-weight-bold"></span>
              {{ $t(currentMode) }}</q-toolbar-title
            >

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
          <TechnicalServiceFrontDeskForm
            class="q-ma-none q-pa-none"
            v-model="currentRow"
            :mode="currentMode"
            @completed="onFormCompleted"
            @technicalServiceListRefresh="getList"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="deleteConfirm" persistent>
      <q-card class="q-pa-md">
        <q-card-section class="items-center row">
          <q-avatar
            icon="view_in_ar"
            color="negative"
            text-color="white"
          />&nbsp; &nbsp; &nbsp; &nbsp;
          <h5>{{ $t("order.deleteconfirm") }}</h5>
        </q-card-section>
        <q-card-section class="items-center row">
          <p>
            "{{ currentRow.orderNo }} - {{ currentRow.firm.name }} -
            {{ currentRow.title }}"
            {{ $t("order.deleteMessage") }}
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('cancel')"
            color="primary"
            v-close-popup
          /><q-space />
          <q-btn
            flat
            :label="$t('delete')"
            color="negative"
            v-on:click="Delete()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <!-- Category Tree Popup -->
  <q-dialog v-model="categoryPopup" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="view_in_ar" color="negative" text-color="white" />&nbsp;
        &nbsp; &nbsp; &nbsp;
        <h5>{{ $t("products.category") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <div class="q-pa-md q-col-gutter-sm">
          <q-input
            ref="filterRef"
            filled
            v-model="filterCategory"
            label="Search"
          >
            <template v-slot:append>
              <q-icon
                v-if="filterCategory !== ''"
                name="clear"
                class="cursor-pointer"
                @click="filterCategory = ''"
              ></q-icon>
            </template>
          </q-input>
          <q-tree
            ref="categorytree"
            :nodes="categoryTree"
            node-key="id"
            label-key="name"
            children-key="subCategories"
            tick-strategy="leaf-filtered"
            v-model:selected="selected"
            v-model:ticked="ticked"
            v-bind:ticked="ticked"
            @update:ticked="tickedNode"
            :filter="filterCategory"
            :filter-method="myFilterMethod"
            default-expand-all
          ></q-tree>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
        <q-btn
          flat
          :label="$t('select')"
          color="negative"
          @click="selectCategory"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import TechnicalServiceFrontDeskForm from "src/components/forms/TechnicalServiceFrontDeskForm.vue";
import exportFromJSON from "export-from-json";
import { Platform } from "quasar";
import { date } from "quasar";
import numeral from "numeral";
import "numeral/locales/tr";
import "numeral/locales/en-au";
import "numeral/locales/de";

export default defineComponent({
  components: {
    TechnicalServiceFrontDeskForm,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
  },
  computed: {
    columns() {
      return [
        {
          name: "stockCode",
          label: this.$t("products.stockcode"),
          align: "left",
          field: (row) => row.stockCode,
          sortable: true,
          style: "width: 50px",
          headerStyle: "width: 50px",
        },
        {
          name: "stockName",
          label: this.$t("products.productname"),
          align: "left",
          field: (row) => row.stockName,
          sortable: true,
          style: "width: 50px",
          headerStyle: "width: 50px",
        },
        {
          name: "quantity",
          label: this.$t("products.piece"),
          align: "center",
          field: (row) => row.quantity,
          sortable: true,
          style: "width: 100px",
          headerStyle: "width: 50px",
        },
        {
          name: "vatRate",
          label: this.$t("products.vatrate"),
          align: "center",
          field: (row) => row.vatRate,
          sortable: true,
          style: "width: 100px",
          headerStyle: "width: 50px",
        },
        {
          name: "price",
          label: this.$t("products.unitPrice"),
          align: "center",
          field: (row) => numeral(row.price).format("0,0[.]00 $"),
          sortable: true,
          style: "width: 100px",
          headerStyle: "width: 50px",
        },
        {
          name: "price",
          label: this.$t("reports.priceVatExcluded"),
          align: "center",
          field: (row) =>
            numeral(row.price * row.quantity).format("0,0[.]00 $"), //TODO:
          sortable: true,
          style: "width: 100px",
          headerStyle: "width: 50px",
        },
        {
          name: "priceVatExcluded",
          align: "center",
          label: this.$t("reports.priceVat"),
          field: (row) =>
            numeral(row.price * row.quantity * (1 + row.vatRate * 0.01)).format(
              "0,0[.]00 $"
            ),
          sortable: true,
          style: "width: 100px",
          headerStyle: "width: 50px",
        },
      ];
    },
  },
  data() {
    return {
      selected: "",
      ticked: [],
      expanded: [""],
      startDate: "",
      endDate: "",
      loading: true,
      technicalServiceStatuses: [],
      productsFull: [],
      productsFiltered: [],
      selectProduct: {},
      selectedStockCard: { id: 0, value: "Seçim yapın" },
      categories: [],
      selectedCategories: { id: 0, name: "Seçim yapın" },
      selectedFirm: null,
      filtredCategories: [{ id: 0, name: "Seçim yapın" }],
      rows: [],
      fullList: [],
      filtredList: [],
      selectedId: 0,
      formVisible: false,
      deleteConfirm: false,
      currentMode: "add",
      currentRow: null,
      maximizedToggle: false,
      categoryPopup: false,
      filter: "",
      filterCategory: "",
      isGrid: false,
      pagination: {
        rowsPerPage: 20,
      },
      totalQuantity: 0,
      totalAmountVat: 0,
      totalAmountVatExcluded: 0,
      firmFiltered: [],
      firmFull: [],
    };
  },
  async mounted() {
    this.init();
    this.$setPageTitle(this.$t("reports.SalesReport"));
  },
  methods: {
    init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
      this.setStartDate();
      this.setEndDate();
      //this.getList();
      this.getCategoryTreeFlatten();
      this.getFirm();
      this.getCategoryTree();
    },

    customSort(rows, sortBy, descending) {
      const data = [...rows];

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a;
          const y = descending ? a : b;

          if (sortBy !== "startService") {
            // string sort
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0;
          } else {
            // numeric sort (timestamp)
            return (
              new Date(x[sortBy]).getTime() - new Date(y[sortBy]).getTime()
            );
          }
        });
      }

      return data;
    },

    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onView(product) {
      this.$logger.log(product);
      this.maximizedToggle = false;
      this.currentRow = product;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onEdit(product) {
      this.$logger.log("onedit product", product);
      this.maximizedToggle = false;
      this.currentRow = product;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onDelete(product) {
      this.currentRow = product;
      this.deleteConfirm = true;
    },
    onFormCompleted() {
      this.formVisible = false;
      this.$logger.log("form completed");
      this.getList();
    },
    exportTable() {
      const data = this.rows.map((item) => {
        return {
          "Ürün Kodu": item.stockCode,
          "Ürün Adı": item.stockName,
          Adet: item.quantity,
          "KDV Oranı": item.vatRate,
          "Toplam Tutar (KDV Hariç)": numeral(item.price).format("0,0[.]00 $"),
          "Toplam Tutar (KDV Dahil)": numeral(
            item.price * (1 + item.vatRate * 0.01)
          ).format("0,0[.]00 $"),
        };
      });
      const fileName = "TechServiceList";
      const exportType = exportFromJSON.types.xls;

      exportFromJSON({ data, fileName, exportType });
    },
    async Delete() {
      try {
        this.$logger.log(this.currentRow.id);
        /*const response = await this.$api.delete(
          "stockCards/" + this.currentRow.id
        );*/
        this.getList();
        this.deleteConfirm = false;
        stockCard;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async showCategoryPopup() {
      this.categoryPopup = true;
      this.$nextTick(() => {
        if (this.$refs.categorytree) {
          this.$refs.categorytree.expandAll();
        }
      });
    },
    selectCategory() {
      this.$logger.log("selected", this.selected);
      this.$logger.log("ticked", this.ticked);
      this.categoryPopup = false;
      this.$logger.log("selectedCategories", this.selectedCategories);
      this.getList();
    },
    async getCategoryTree() {
      const response = await this.$api.get("getCategoryTree");
      this.categoryTree = response.data;
      this.$logger.log("getCategoryTree", this.categoryTree);

      setTimeout(() => this.$refs.categorytree.expandAll(), 200);
    },
    myFilterMethod(node, filter) {
      //this.$logger.log('node', node);
      //this.$logger.log('filter', filter);
      const filt = filter.toLowerCase();

      return node.name && node.name.toLowerCase().indexOf(filt) > -1;
    },
    /*tickedNode(node) {
      this.$logger.log("node", node);
      this.$logger.log("selected", this.selected);
      this.$logger.log("ticked", this.ticked);
    },
    selectedNode(node) {
      //this.$logger.log('node', node);
      this.$logger.log("selected", this.selected);
      this.$logger.log("ticked", this.ticked);
    },*/
    async getList() {
      try {
        this.loading = true;
        this.$logger.log("selectedFirm", this.selectedFirm);
        let body = {
          startDate: this.startDate,
          finishDate: this.endDate,
          firmId: this.selectedFirm?.id,
          categories: this.ticked,
        };

        const response = await this.$api.post("getSalesOrderReport", body);
        this.fullList = response?.data;
        this.listFilter();
        //this.rows = response?.data;
        this.$logger.log("getSalesOrderReport", this.rows);
        this.loading = false;
        //toplam adet ve fiyat hesapla
        this.totalQuantity = 0;
        this.totalAmountVat = 0;
        this.totalAmountVatExcluded = 0;
        this.rows.forEach((element) => {
          //totalAmountVat: "Toplam Tutar (KDV Dahil)",
          //totalAmountVatExcluded: "Toplam Tutar (KDV Hariç)",
          this.totalQuantity += element.quantity;
          this.totalAmountVat += element.price;
          this.totalAmountVatExcluded +=
            element.price * (1 - element.vatRate * 0.01);
        });

        this.totalAmountVat = numeral(this.totalAmountVat).format("0,0[.]00 $");
        this.totalAmountVatExcluded = numeral(
          this.totalAmountVatExcluded
        ).format("0,0[.]00 $");
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getCategoryTreeFlatten() {
      const response = await this.$api.get("getCategoryTreeFlatten");
      this.categories = response.data;
    },

    async getFirm() {
      const response = this.$api.get("firmDetailList").then((data) => {
        this.firmFull = data.data;
        this.firmFull = this.firmFull.map((f) => {
          f.value = `${f.firmCode} - ${f.commercialTitle}`;
          return f;
        });

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
        this.firmFiltered = this.firmFull.filter((v) =>
          this.$normalizeTurkishString(v.commercialTitle).includes(
            this.$normalizeTurkishString(val)
          )
        );
      });
    },

    async filterCategoryx(val, update) {
      if (val === "") {
        update(() => {
          this.filtredCategories = this.categories;
        });
        return;
      }

      update(() => {
        this.filtredCategories = this.categories.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },
    async getTechnicalServiceStatuses() {
      const response = this.$api
        .get("getTechnicalServiceStatuses")
        .then((data) => {
          this.$logger.log("data", data.data);
          let result = data.data;
          result.map((item) => {
            if (item.status)
              item.process = item.process + " (" + item.status + ")";
          });
          this.technicalServiceStatuses = result;
          this.$logger.log(this.technicalServiceStatuses);
        });
    },
    listFilter() {
      this.$logger.log("listFilter", this.startDate, this.endDate);
      try {
        //eğer startDate ve endDate arasında iki aydan fazla bir fark varsa uyarı ver
        var date1 = new Date(this.startDate);
        var date2 = new Date(this.endDate);
        var diffTime = Math.abs(date2 - date1);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        /*if (diffDays > 60) {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: this.$t("reports.dateRageLimitWarning"),
            icon: "warning",
          });
          this.setStartDate();
          this.setEndDate();
          return;
        }*/
        //endDate tarihi startDate tarihinden küçükse uyarı ver
        if (date1 > date2) {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: this.$t("reports.endDateStartDateWarning"),
            icon: "warning",
          });
          this.setStartDate();
          this.setEndDate();
          return;
        }

        this.filtredList = this.fullList;

        if (this.selectedStockCard && this.selectedStockCard.id > 0) {
          this.filtredList = this.filtredList.filter((item) => {
            return item.stockCardId === this.selectedStockCard.id;
          });
        } else {
          if (this.selectedCategories && this.selectedCategories.id > 0) {
            this.filtredList = this.filtredList.filter((item) => {
              return item.categoryId === this.selectedCategories.id;
            });
          } else {
            this.filtredList = this.fullList;
          }
        }
        this.rows = this.filtredList;
      } catch (error) {
        this.$logger.error("productSelected", error);
      }
    },

    async getProduct() {
      const response = this.$api.get("stockCards").then((data) => {
        this.$logger.log(data.data);
        this.productsFull = data.data.map((p) => {
          p.value = `${p.stockCode} - ${p.stockName}`;
          return p;
        });
      });
    },

    async filterProduct(val, update) {
      if (val.length < 3) {
        return;
      }

      update(() => {
        try {
          var body = { letters: val };
          this.$logger.log("body", body);
          const response = this.$api
            .put("searchStockCards/", body)
            .then((data) => {
              var products = data.data.map((p) => {
                p.value = `${p.stockCode} - ${p.stockName}`;
                return p;
              });
              this.productsFiltered = products;
              this.$logger.log("productsFiltered", this.productsFiltered);
            })
            .catch((err) => this.$logger.log());
        } catch (error) {}
      });
    },
    formatDate(datef) {
      if (!datef) return ""; // Boş tarih ise boş bir dize döndür

      // Tarihi JavaScript Date nesnesine dönüştür
      const formattedDate = new Date(datef);

      // Gün, ay ve yılı al
      const day = formattedDate.getDate();
      const month = formattedDate.getMonth() + 1; // JavaScript'de aylar 0'dan başlar, bu yüzden 1 ekleyin
      const year = formattedDate.getFullYear();

      // Biçimlendirilmiş tarih dizesini oluştur
      const formattedDateString = `${day < 10 ? "0" : ""}${day}.${
        month < 10 ? "0" : ""
      }${month}.${year}`;

      return formattedDateString;
    },
    setStartDate() {
      const date = new Date();
      date.setMonth(date.getMonth() - 1); // Bir ay öncesinin tarihi
      this.startDate = date.toISOString().slice(0, 10); // ISO formatında tarih
    },
    setEndDate() {
      const date = new Date();
      date.setDate(date.getDate()); // Yarının tarihi
      this.endDate = date.toISOString().slice(0, 10); // ISO formatında tarih
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
