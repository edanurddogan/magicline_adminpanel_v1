<template>
  <div>
    <q-card>
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <q-item class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                :label="$t('product.barcode')"
                v-model="formModel.barcode"
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
        >
          {{ formMode == "edit" ? $t("updatedata") : $t("savedata") }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "StokBarcodeForm",
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
    var formModel = computed({
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
      stockType: [],
      newModel: {},
      resp: {},
      formMode: "add",

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
      this.$logger.log(this.formModel);
      this.$logger.log("mode", this.mode);
      try {
        const response = await this.$api.get("stockTypes");
        this.$logger.log("stocTypes", response?.data);
        this.rows = response?.data;
        this.loading = false;
      } catch (error) {}

      if (this.mode == "add") {
      }
    },
    onSubmit() {},
    save() {
      this.$logger.log("form submitted", this.formModel);
      if (this.mode === "add") {
        this.$logger.log("add");
        this.addFormModel();
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },
    async addFormModel() {
      const _response = this.$api
        .post("stockBarcodes", JSON.stringify(this.formModel))
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

          this.$emit("completed");
          this.$emit("close");
        });
    },
    async editFormModel() {
      this.$logger.log("editFormModel", this.formModel);
      const response = this.$api
        .put("stockBarcodes", JSON.stringify(this.formModel))
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
        const response = await this.$api.delete("stockBarcodes/" + row.id);
        this.getList();
        this.deleteConfirm = false;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },
  },
});
</script>
