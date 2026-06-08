<template>
  <div>
    <q-card>
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <q-item class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                :label="$t('code')"
                v-model="formModel.code"
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
          <q-item class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                :label="$t('detail')"
                v-model="formModel.detail"
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
          <q-item class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                :label="$t('priority')"
                v-model="formModel.priority"
                :rules="[(val) => !!val || $t('requiredlabel')]"
                type="number"
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
          <q-item class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
            <q-item-section>
              <q-toggle
                class="q-pa-sm col-lg-8 col-md-8 col-sm-8 col-xs-12"
                :label="$t('status')"
                v-model="formModel.isActive"
                checked-icon="how_to_reg"
                color="green"
                unchecked-icon="person_off"
                :disable="mode === 'details'"
              />
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
        >
          {{ mode == "edit" ? $t("updatedata") : $t("savedata") }}
        </q-btn>
      </q-card-actions>
    </q-card>

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
  name: "UnitForm",
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
    const formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    return {
      formModel,
    };
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
        const response = await this.$api.get("units");
        this.$logger.log("units", response?.data);
        this.rows = response?.data;
        this.loading = false;
      } catch (error) {}
    },
    onSubmit() {},
    save() {
      this.$logger.log(this.inputref);
      this.$logger.log("form submitted", this.newModel);
      if (this.mode === "add") {
        this.$logger.log("add");
        this.addFormModel();
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },
    async addFormModel() {
      this.$logger.log("add =>", this.formModel);
      const _response = this.$api
        .post("faultCodes", this.formModel)
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
      this.$logger.log("edit =>", this.formModel);
      const response = this.$api
        .put("faultCodes", this.formModel)
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
        const response = await this.$api.delete("faultCodes/" + row.id);
        this.getList();
        this.deleteConfirm = false;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async getList() {
      const response = this.$api.get("faultCodes").then((data) => {
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
