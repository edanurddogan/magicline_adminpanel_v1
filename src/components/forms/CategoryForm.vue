<template>
  <div>
    <q-card>
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <q-item class="col-lg-7 col-md-7 col-sm-7 col-xs-12">
            <q-item-section>
              <q-select
                dense
                outlined
                use-input
                clearable
                transition-show="scale"
                transition-hide="scale"
                input-debounce="0"
                v-model="selectedcategory"
                option-value="id"
                option-label="name"
                :label="$t('products.category')"
                :options="categoriesFiltered"
                @filter="filterCategoris"
                :disable="maincat"
                @update:model-value="selectedCat($event)"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{ $t("noresults") }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-5 col-md-5 col-sm-5 col-xs-12">
            <q-item-section>
              <q-toggle
                dense
                class="q-pa-sm col-lg-12 col-md-12 col-sm-12 col-xs-12"
                :label="$t('products.maincategory')"
                v-model="maincat"
                checked-icon="qr_code"
                color="green"
                unchecked-icon="qr_code"
                :disable="mode === 'details'"
                @update:model-value="mainChange"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('name')"
                v-model="newModel.name"
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template v-slot:append>
                  <q-icon
                    dense
                    name="close"
                    @click="newFormMode"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('description')"
                type="textarea"
                v-model="newModel.detail"
              >
                <template v-slot:append>
                  <q-icon
                    dense
                    name="close"
                    @click="newFormMode"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right" class="q-t-md">
        <q-space />
        <q-btn
          dense
          class="text-capitalize bg-info q-pa-xl"
          :style="{
            display: mode === 'details' ? 'none' : 'block',
          }"
          @click="save()"
          :disable="newModel.name ? false : true"
        >
          {{ formMode == "edit" ? $t("updatedata") : $t("savedata") }}
        </q-btn>
      </q-card-actions>
    </q-card>

    <div class="q-pa-xs">
      <q-table
        flat
        dense
        bordered
        :grid="isGrid"
        :hide-header="isGrid"
        class="statement-table"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :filter="filter"
        :loading-label="$t('loading')"
        no-data-label="I didn't find anything for you"
        no-results-label="The filter didn't uncover any results"
        row-key="id"
      >
        <template v-slot:top>
          <div class="row col-12">
            <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
              {{ $t("products.category") }}
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
                  dense
                  v-if="filter !== ''"
                  name="close"
                  @click="filter = ''"
                  class="cursor-pointer"
                />
                <q-icon name="search" />
              </template>
            </q-input>
            <q-space />
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
              dense
              flat
              round
              color="secondary"
              icon="edit"
              @click="onEdit(props.row)"
            />
            <!--<q-btn
              flat
              round
              color="negative"
              icon="delete_forever"
              @click="onDelete(props.row)"
            />-->
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

    <!-- Delete Dialog -->
    <q-dialog v-model="deleteConfirm" persistent>
      <q-card class="q-pa-xs">
        <q-card-section class="items-center row">
          <q-avatar
            dense
            icon="person_off"
            color="negative"
            text-color="white"
          />&nbsp; &nbsp; &nbsp; &nbsp;
          <h5>{{ $t("products.deleteconfirm") }}</h5>
        </q-card-section>
        <q-card-section class="items-center row">
          <p>{{ $t("products.barcode") }} : {{ currentRow.barcode }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            dense
            flat
            :label="$t('cancel')"
            color="primary"
            v-close-popup
          /><q-space />
          <q-btn
            dense
            flat
            :label="$t('delete')"
            color="negative"
            v-on:click="rowDelete()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "CategoryForm",
  components: {},
  computed: {
    columns() {
      return [
        {
          name: "name",
          label: this.$t("name"),
          align: "left",
          field: (row) => row.name,
          sortable: true,
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
  setup(props, { emit }) {
    const $q = useQuasar();
  },
  data() {
    return {
      newModel: {},
      resp: {},
      formMode: "add",
      inputref: null,

      maincat: true,
      selectedcategory: null,
      loading: true,
      rows: [],
      selectedId: 0,
      formVisible: false,
      deleteConfirm: false,
      currentMode: "add",
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      isGrid: false,
      categoriesFull: [],
      categoriesFiltered: [],
    };
  },
  emits: ["completed"],
  onBeforeCreate() {},
  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: "add",
    },
  },
  mounted() {
    this.newModel.parentCategoryId = 0;
    this.init();
  },
  methods: {
    async init() {
      this.$logger.log(this.newModel);
      this.getList();
    },
    onSubmit() {},
    save() {
      this.$logger.log(this.newModel);
      this.$logger.log("form submitted", this.newModel);
      if (this.formMode === "add") {
        this.$logger.log("add");
        this.addFormModel();
      } else if (this.formMode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },
    async addFormModel() {
      const _response = this.$api
        .post("categories", JSON.stringify(this.newModel))
        .then((response) => {
          this.$logger.log(response.data);
          this.resp = response.data;
          this.$logger.log(this.resp);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
          this.getList();
          this.$emit("completed");
          this.$emit("close");
        });
    },
    async editFormModel() {
      const response = this.$api
        .put("categories", JSON.stringify(this.newModel))
        .then((_response) => {
          this.$logger.log(_response);
          this.$logger.log("edit completed");

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
          this.getList();
          this.$emit("completed");
          this.$emit("close");
        });
    },
    async onEdit(row) {
      this.newModel = row;
      this.formMode = "edit";
    },

    async onDelete(row) {
      try {
        this.$logger.log(row.id);
        const response = await this.$api.delete("categories/" + row.id);
        this.getList();
        this.deleteConfirm = false;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async getList() {
      const response = this.$api.get("categories").then((data) => {
        this.$logger.log(data.data);
        this.rows = data.data;
        this.categoriesFull = data.data;
        this.$logger.log(this.categoriesFull);
      });
    },

    async newFormMode() {
      this.newModel = {};
      this.formMode = "add";
    },

    filterCategoris(val, update) {
      if (val === "") {
        update(() => {
          this.categoriesFiltered = this.categoriesFull;
        });
        return;
      }

      update(() => {
        this.categoriesFiltered = this.categoriesFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },
    mainChange() {
      if (this.mainCat == true) this.newModel.parentCategoryId = 0;
      this.$logger.log(this.newModel);
    },
    selectedCat(event) {
      if (this.selectedcategory)
        this.newModel.parentCategoryId = this.selectedcategory.id;
      else this.newModel.parentCategoryId = 0;

      this.$logger.log(this.selectedcategory.id);
      this.$logger.log(event);
    },
  },
});
</script>
