<template>
  <div class="row q-pa-md q-space-x-md">
    <!-- Employess -->
    <q-card class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
      <q-card-section>
        <!-- Başlık -->
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-toolbar-title>{{
            $t("technicalService.technicianSelect")
          }}</q-toolbar-title>
        </q-toolbar>
        <!-- Employess List-->
        <q-list bordered padding class="rounded-borders text-primary">
          <q-item
            v-for="(employee, index) in employees"
            :key="index"
            clickable
            v-ripple
            @click="selectedTechnician(employee)"
            :class="formModel.technician === employee ? 'mark-employee' : ''"
          >
            <q-item-section avatar v-if="false">
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section
              >{{ employee.name }} {{ employee.surname }}</q-item-section
            >
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Teknisyen Atama-->
    <q-card class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>{{
          $t("technicalService.technicianAssignments")
        }}</q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <q-list class="row">
          <q-item
            class="q-pa-none q-ma-none col-lg-3 col-md-12 col-sm-12 col-xs-12"
          >
            <q-item-section>
              <q-field
                dense
                outlined
                stack-label
                :label="$t('technicalService.technicianInformation')"
              >
                {{ formModel.technician?.name }}
                {{ formModel.technician?.surname }}
              </q-field>
            </q-item-section>
          </q-item>
          <!-- Marka seç -->
          <q-item class="col-lg-3 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                dense
                use-input
                :disable="mode === 'details'"
                outlined
                v-model="formModel.brand"
                :options="filteredBrands"
                @filter="filterBrands"
                option-value="id"
                option-label="name"
                :label="$t('products.brand')"
                clearable
                @update:model-value="(val) => brandSelected(val)"
              />
            </q-item-section>
          </q-item>
          <q-space />
          <!-- Model seç -->
          <q-item class="col-lg-3 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                dense
                use-input
                :disable="mode === 'details'"
                outlined
                v-model="formModel.model"
                :options="filteredModels"
                @filter="filterModels"
                option-value="id"
                option-label="name"
                :label="$t('products.model')"
                clearable
                @update:model-value="(val) => modelSelected(val)"
              />
            </q-item-section>
          </q-item>
          <q-space />
          <!-- Durum Butonu -->
          <q-item class="col-lg-1 col-md-1 col-sm-6 col-xs-6">
            <q-item-section>
              <q-toggle
                dense
                :label="$t('status')"
                v-model="formModel.isActive"
                checked-icon="check"
                color="green"
                unchecked-icon="cancel"
                :disable="mode === 'details'"
              />
            </q-item-section>
          </q-item>
          <q-space />
          <!-- Kayıt / Güncelle Butonu -->
          <q-item class="col-lg-2 col-md-2 col-sm-12 col-xs-12">
            <q-item-section>
              <q-btn
                :disable="
                  !formModel.technician ||
                  !formModel.brand?.id ||
                  !formModel.model?.id
                "
                dense
                color="secondary"
                :label="mode == 'add' ? $t('save') : $t('edit')"
                icon-right="send_and_archive"
                text-color="white"
                :loading="saveLoading"
                class="text-capitalize q-pa-sm q-mx-sm q-ml-auto"
                @click="addOrUpdateTechnicianAssignment"
              >
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <q-table
          flat
          dense
          bordered
          class="statement-table"
          :rows="filteredRows"
          :columns="columns"
          :loading="loading"
          :filter="filter"
          :loading-label="$t('loading')"
          :no-data-label="$t('nodatalabel')"
          :no-results-label="$t('noresultslabel')"
          row-key="id"
        >
          <template v-slot:top="props">
            <div class="row col-12">
              <!-- Arama bölümü -->
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
              <q-btn
                flat
                round
                dense
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen"
                class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
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
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                icon="edit"
                color="primary"
                @click="editTechnicianRow(props.row)"
              />
              <q-btn
                flat
                round
                icon="delete"
                color="negative"
                @click="openDeleteAssignmentDialog(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>

  <!--Delete Dialog-->
  <q-dialog v-model="deleteAssignmentDialogVisible" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="delete" color="negative" text-color="white" />
        <h5>{{ $t("technicalService.technicianAssignment") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>"Seçtiğiniz atama silinecektir. Emin misiniz?"</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          color="primary"
          @click="deleteAssignmentDialogVisible = false"
        />
        <q-btn
          flat
          :label="$t('delete')"
          color="negative"
          @click="deleteAccessoryRowConfirmed"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "TechnicianAssignment",
  setup() {},

  data() {
    return {
      mode: "add",
      deleteAssignmentDialogVisible: false,
      selectedRowForDeletion: {},

      formModel: {
        technician: {},
        brand: { id: 0, name: "Marka seçiniz" },
        model: { id: 0, name: "Model seçiniz" },
      },

      // Personeller
      employees: [],
      filteredEmployees: [],

      // Marka Model
      brands: [],
      models: [],
      filteredBrands: [],
      filteredModels: [],

      // Tablo
      rows: [],
      filteredRows: [],
      filter: "",
    };
  },

  async mounted() {
    this.init();
    await this.getEmployees();
    await this.getBrands();
    await this.getList();
  },

  computed: {
    columns() {
      return [
        {
          name: "name",
          field: (row) => row.technician.name,
          label: "Adı",
          align: "left",
          required: true,
          sortable: true,
        },
        {
          name: "surname",
          field: (row) => row.technician.surname,
          label: "Soyadı",
          align: "left",
          required: true,
          sortable: true,
        },
        {
          name: "brand",
          field: (row) => row.brand.name,
          label: "Marka",
          align: "left",
          required: true,
          sortable: true,
        },
        {
          name: "model",
          field: (row) => row.model.name,
          label: "Model",
          align: "left",
          required: true,
          sortable: true,
        },
        {
          name: "status",
          align: "center",
          label: this.$t("status"),
          field: "userstatus",
          sortable: true,
        },
        { name: "actions", label: "İşlemler" },
      ];
    },
  },

  methods: {
    init() {
      document.title = "Magicline - Technician Assignment";
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
    },

    async getEmployees() {
      try {
        const response = await this.$api.get("getEmployees");
        this.employees = response?.data;
        this.$logger.log("employees", this.employees);
        this.employeesFiltered = this.employees;
        this.loading = false;
      } catch (error) {
        this.$logger.error("Error getEmployees:", error);
      }
    },

    async getBrands() {
      try {
        const response = await this.$api.get("getBrands");
        this.brands = response.data;
        this.filteredBrands = this.brands;
      } catch (error) {
        this.$logger.error("Error fetching brands:", error);
      }
    },

    async getList() {
      try {
        const response = await this.$api.get("technicianAssignments");
        this.rows = this.filteredRows = response?.data;

        this.rows.forEach((item) => {
          // Markayı bul
          item.brand =
            this.brands.find((brand) => brand.id === item.brandId) ||
            "Marka Bulunamadı";
          // Modeli bul
          item.model =
            item.brand.models?.find((model) => model.id === item.modelId) ||
            "Model Bulunamadı";
          // Teknisyeni bul
          item.technician =
            this.employees.find(
              (employee) => employee.id === item.technicianId
            ) || "Çalışan Bulunamadı";

          this.resetForm();
        });

        this.loading = false;
      } catch (error) {
        this.$logger.error("Error getTechnicianAssignments:", error);
      }
    },

    filterBrands(val, update) {
      if (val === "") {
        update(() => {
          this.filteredBrands = this.brands;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredBrands = this.brands.filter((brand) =>
          brand.name.toLowerCase().includes(needle)
        );
      });
    },

    filterModels(val, update) {
      if (val === "") {
        update(() => {
          this.filteredModels = this.models;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredModels = this.models.filter((model) =>
          model.name.toLowerCase().includes(needle)
        );
      });
    },

    brandSelected(selectedBrand) {
      try {
        this.formModel.model = { id: 0, name: "Model seçiniz" };

        if (selectedBrand) {
          this.models = selectedBrand.models;
          this.filteredModels = selectedBrand.models;
        } else {
          this.models = [];
          this.filteredModels = [];
        }
        this.$logger.log("filteredModels", this.filteredModels);
        this.filterAssignments();
      } catch (error) {
        this.$logger.error("Error brandSelected:", error);
      }
    },
    modelSelected(selectedModel) {
      try {
        if (selectedModel) {
          this.formModel.model = selectedModel;
        } else {
          this.formModel.model = { id: 0, name: "Model seçiniz" };
        }
      } catch (error) {
        this.$logger.error("Error modelSelected:", error);
      }
      this.filterAssignments();
    },

    filterAssignments() {
      //seçilen marka ve modele göre personelleri filtrele
      try {
        if (this.formModel.brand && this.formModel.brand?.id) {
          this.filteredRows = this.rows.filter((employee) => {
            return employee.brandId === this.formModel.brand.id;
          });
        } else {
          this.filteredRows = this.rows;
        }

        if (this.formModel.model.id) {
          this.filteredRows = this.filteredRows.filter((employee) => {
            return employee.modelId === this.formModel.model.id;
          });
        }

        this.$logger.log("filteredEmployees", this.filteredRows);
      } catch (error) {
        this.$logger.error("Error filterAssignments:", error);
      }
    },

    selectedTechnician(employee) {
      try {
        // Eğer edit modda değilse aynı öğeye tıklanmışsa seçimi kaldır
        if (this.formModel.technician === employee && this.mode === "add") {
          this.formModel.technician = "";
        } else {
          // Yeni bir öğe seç
          this.formModel.technician = employee;
        }

        this.rowsFilter();
      } catch (error) {
        this.$logger.error("Error toggleSelectionEmployees:", error);
      }
    },

    rowsFilter() {
      try {
        this.filteredRows = [];
        if (this.formModel.technician) {
          this.rows.forEach((item) => {
            // Teknisyen için kontrol yap
            if (item.technician.id === this.formModel.technician.id) {
              this.filteredRows.push(item);
            }
          });
        } else {
          this.filteredRows = this.rows;
        }
      } catch (error) {
        this.$logger.error("TechnicianRowFilter", error);
      }
    },

    editTechnicianRow(row) {
      this.mode = "edit";
      this.models = this.filteredModels = row.brand.models; // Seçilen modeli ayarla
      this.formModel = row;
    },

    openDeleteAssignmentDialog(row) {
      this.deleteAssignmentDialogVisible = true;
      this.selectedRowForDeletion = row;
    },

    deleteAccessoryRowConfirmed() {
      if (this.selectedRowForDeletion) {
      }
    },

    addOrUpdateTechnicianAssignment() {
      try {
        // Girilmesi zorunlu alanları belirle
        const requiredFields = [
          { key: "technician", idKey: "technicianId", label: "Teknisyen" },
          { key: "brand", idKey: "brandId", label: "Marka" },
          { key: "model", idKey: "modelId", label: "Model" },
        ];

        const requiredList = [];
        // Girilmesi zorunlu alanların değerleri varsa body hazırla yoksa uyarı listesine ekle
        requiredFields.forEach((field) => {
          if (this.formModel[field.key]) {
            this.formModel[field.idKey] = this.formModel[field.key].id;
          } else {
            requiredList.push(field.label);
          }
        });

        if (requiredList.length > 0) {
          this.$q.notify({
            progress: true,
            type: "warning",
            color: "warning",
            message: requiredList.join(", ") + " Seçilmeli",
            caption: "Ürün Bilgileri Eksik",
          });
          return;
        }

        if (this.mode === "add") {
          this.addTechnicianAssignment();
        } else {
          this.updateTechnicianAssignment();
        }
      } catch (error) {
        this.$logger.error("Error addOrUpdateTechnicianAssignment:", error);
      }
    },

    async addTechnicianAssignment() {
      try {
        const response = this.$api
          .post("technicianAssignments", this.formModel)
          .then((response) => {
            this.$q.notify({
              progress: true,
              type: "positive",
              color: "positive",
              message: this.$t("technicalService.technicalAssignmentSaved"),
              caption: this.$t("success"),
            });

            this.saveLoading = false;
          });
        this.resetForm();
        await this.getList();
      } catch (error) {
        this.$logger.error("Error adding technician assignment:", error);
      }
    },

    async updateTechnicianAssignment() {
      try {
        const response = this.$api
          .put("technicianAssignments", this.formModel)
          .then((response) => {
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: this.$t("technicalService.technicalAssignmentUpdated"),
              caption: this.$t("success"),
            });

            this.saveLoading = false;
          });
        this.resetForm();
        await this.getList();
      } catch (error) {
        this.$logger.error("Error adding technician assignment:", error);
      }
    },

    resetForm() {
      try {
        this.mode = "add";
        this.formModel = {
          technician: {},
          brand: { id: 0, name: "Marka seçiniz" },
          model: { id: 0, name: "Model seçiniz" },
        };
      } catch (error) {
        this.$logger.error("resetForm:", error);
      }
    },
  },
});
</script>
<style lang="sass">
.mark-employee
  color: white
  background: #0097a7
</style>
