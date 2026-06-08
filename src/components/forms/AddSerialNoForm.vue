<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  ref="inputSerialNo"
                  :label="$t('products.serialNo')"
                  v-model="newModel.stockSerialNo.serialNo"
                  dense
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                  v-on:keyup.enter="save"
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
          >
            {{ formMode == "edit" ? $t("updatedata") : $t("savedata") }}
          </q-btn>
        </q-card-actions>
        <q-card-section>
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
                  <div
                    class="col-lg-3 col-md-4 col-sm-12 col-xs-12 q-table__title"
                  >
                    {{ $t("products.serialNos") }}
                  </div>
                  <q-input
                    class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
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
                  <q-btn
                    flat
                    round
                    dense
                    icon="refresh"
                    class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                    @click="getList()"
                  >
                    <q-tooltip>
                      {{ $t("refresh") }}
                    </q-tooltip>
                  </q-btn>
                </div>
              </template>
              <template #body-cell-sended="props">
                <q-td :props="props">
                  <q-icon
                    :color="props.row.stockSerialNo.used ? 'teal' : 'warning'"
                    size="24px"
                    :name="
                      props.row.stockSerialNo.used ? 'done_all' : 'pending'
                    "
                  />
                </q-td>
              </template>
              <template #body-cell-action="props">
                <q-td :props="props">
                  <div v-if="!props.row.stockSerialNo.used">
                    <q-btn
                      dense
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
                      @click="(deleteConfirm = true), (selectedRow = props.row)"
                    />
                  </div>
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
        </q-card-section>
      </q-card>
      <!-- Delete Dialog -->
      <q-dialog v-model="deleteConfirm" persistent>
        <q-card class="q-pa-md">
          <q-card-section class="items-center row">
            <q-avatar
              icon="delete_forever"
              color="negative"
              text-color="white"
            />&nbsp; &nbsp; &nbsp; &nbsp;
            <h5>{{ $t("deleteConfirm") }}</h5>
          </q-card-section>
          <q-card-section class="items-center row">
            <p>
              {{ $t("products.serialNo") }} :
              {{ selectedRow.stockSerialNo.serialNo }}
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
              v-on:click="onDelete()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "AddSerialNoForm",
  components: {},
  computed: {
    columns() {
      return [
        {
          name: "name",
          label: this.$t("name"),
          align: "left",
          field: (row) => row.stockSerialNo.serialNo,
          sortable: true,
        },
        {
          name: "sended",
          label: this.$t("order.sended"),
          align: "left",
          field: (row) => row.stockSerialNo.used,
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
      currentMode: "add",
      formMode: "add",
      newModel: { stockSerialNo: { serialNo: "" } },
      deleteConfirm: false,
      maximizedToggle: false,
      loading: false,
      rows: [],
      selectedRow: {},
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
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}

      this.$logger.log("formModel", this.formModel);
      this.$refs.inputSerialNo.$el.focus();

      this.rows = this.formModel.serialNoOnOrders;
      //this.getList(this.formModel.id, this.formModel.stockCard.id);
    },

    async getList() {
      this.loading = true;
      this.$api
        .get(
          `getStockSerialNo/${this.formModel.id}/${this.formModel.stockCardId}`
        )
        .then((data) => {
          this.$logger.log(data.data.serialNoOnOrders);
          this.rows = data.data.serialNoOnOrders;
        });

      this.loading = false;
    },

    save() {
      var newStockSerialNo = {
        orderItemId: this.formModel.id,
        stockCardId: this.formModel.stockCardId,
        stockSerialNo: this.newModel.stockSerialNo,
      };
      this.$logger.log("newStockSerialNo", newStockSerialNo);
      this.$logger.log(this.newModel);
      //this.$logger.log("form submitted", this.formModel);
      if (this.formMode === "add") {
        //this.$logger.log("add");
        this.addStockSerialNo(newStockSerialNo);
      } else if (this.formMode === "edit") {
        //this.$logger.log("edit");
        this.editStockSerialNo(newStockSerialNo);
      }
    },

    async onEdit(row) {
      this.newModel = row;
      this.formMode = "edit";
      this.$logger.log(this.formMode);
    },

    async onDelete() {
      try {
        this.$logger.log(this.selectedRow.id);
        const response = await this.$api.post(
          "deleteStockSerialNo/" + this.selectedRow.stockSerialNoId
        );
        this.getList();
        this.deleteConfirm = false;
        this.$logger.log(response);
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async addStockSerialNo(newStockSerialNo) {
      try {
        if (this.formModel.quantity <= this.rows.length) {
          this.$q.notify({
            progress: true,
            type: "warning",
            color: "warning",
            message: "Sipaişteki ürün adedi kadar seri numarası eklenebilir.",
            caption: this.$t("unsuccessful"),
          });
          return;
        }
      } catch (error) {}
      const _response = this.$api
        .post("postStockSerialNo", JSON.stringify(newStockSerialNo))
        .then((response) => {
          this.$logger.log(response.data);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("messages.stokSerialNoEdit"),
            caption: this.$t("success"),
          });
          this.getList();
        })
        .catch((err) => {
          this.$q.notify({
            progress: true,
            type: "error",
            color: "error",
            message: this.$t("messages.stokSerialNoAddError"),
            caption: this.$t("success"),
          });
          this.$logger.log("err", err);
        });
    },

    async editStockSerialNo() {
      const _response = this.$api
        .put("stockSerialNos", JSON.stringify(this.newModel.stockSerialNo))
        .then((response) => {
          //this.$logger.log(response.data);
          this.formModel.stockSerialNo = response.data;
          this.formModel.stockSerialNoId = response.data.id;
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("messages.stokSerialNoEdit"),
            caption: this.$t("success"),
          });
          this.getList();
        })
        .catch((err) => {
          this.$q.notify({
            progress: true,
            type: "error",
            color: "error",
            message: this.$t("messages.stokSerialNoEditError"),
            caption: this.$t("success"),
          });
          this.$logger.log("err", err);
        });
    },

    async addSerialNoToOrder() {
      const _response = this.$api
        .put("orderItems", JSON.stringify(this.formModel))
        .then((response) => {
          //this.$logger.log(response.data);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("messages.stokSerialNoAdd"),
            caption: this.$t("success"),
          });
          this.$emit("addcompleted");
          this.$emit("close");
        })
        .catch((err) => {
          this.$q.notify({
            progress: true,
            type: "error",
            color: "error",
            message: this.$t("messages.stokSerialNoAddOrderItemsError"),
            caption: this.$t("success"),
          });
          this.$logger.log("err", err);
        });
    },

    async newFormMode() {
      (this.newModel = { stockSerialNo: { serialNo: "" } }),
        (this.formMode = "add");
    },
  },
});
</script>
