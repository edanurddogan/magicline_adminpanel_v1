<template>
  <div>
    <q-card>
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <q-item class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                :label="$t('name')"
                v-model="newModel.name"
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="newFormMode"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>

              <q-input
                :disable="mode === 'details'"
                :label="$t('currency.shortname')"
                v-model="newModel.shortName"
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="newFormMode"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>

              <q-input
                :disable="mode === 'details'"
                :label="$t('currency.symbol')"
                v-model="newModel.symbol"
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template v-slot:append>
                  <q-icon
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

    <div class="q-pa-md">
      <q-table
        flat
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
              {{ $t("products.currency") }}
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
      <q-card class="q-pa-md">
        <q-card-section class="items-center row">
          <q-avatar
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
            flat
            :label="$t('cancel')"
            color="primary"
            v-close-popup
          /><q-space />
          <q-btn
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
  name: "CurrencyForm",
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
          name: "shortname",
          label: this.$t("currency.shortname"),
          align: "left",
          field: (row) => row.shortName,
          sortable: true,
        },
        {
          label: this.$t("currency.symbol"),
          align: "left",
          field: (row) => row.symbol,
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
    this.init();
  },
  methods: {
    async init() {
      try {
        const response = await this.$api.get("currencies");
        this.$logger.log("currency", response?.data);
        this.rows = response?.data;
        this.loading = false;
      } catch (error) {}
    },
    onSubmit() {},
    save() {
      this.$logger.log(this.inputref);
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
        .post("currencies", JSON.stringify(this.newModel))
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
        .put("currencies", JSON.stringify(this.newModel))
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
        const response = await this.$api.delete("currencies/" + row.id);
        this.getList();
        this.deleteConfirm = false;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async getList() {
      const response = this.$api.get("currencies").then((data) => {
        this.$logger.log(data.data);
        this.rows = data.data;
      });
    },

    async newFormMode() {
      this.newModel = {};
      this.formMode = "add";
    },
  },
});
</script>
