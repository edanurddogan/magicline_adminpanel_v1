<template>
  <div>
    <q-card>
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-item-section>
              <q-input
                :label="$t('firmName')"
                v-model="newModel.description"
                :rules="[(val) => !!val || 'Firma Gerekli']"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="newModel.description = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-item-section>
              <q-input
                :label="$t('LicencePlate')"
                v-model="newModel.licensE_PLATE"
                :rules="[(val) => !!val || 'Araç Plakası Gerekli']"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="newModel.licensE_PLATE = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-item-section>
              <q-input
                :label="$t('driverName')"
                v-model="newModel.driveR_NAME"
                :rules="[(val) => !!val || 'Sürücü Adı Gerekli']"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="newModel.driveR_NAME = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-item-section>
              <q-input
                :label="$t('surname')"
                v-model="newModel.driveR_FAMILY_NAME"
                :rules="[(val) => !!val || 'Sürücü Soyadı Gerekli']"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="newModel.driveR_FAMILY_NAME = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-item-section>
              <q-input
                :label="$t('IdentifyNo')"
                v-model="newModel.driveR_IDENTIFY_NO"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="newModel.driveR_IDENTIFY_NO = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-item-section>
              <q-input
                :label="$t('driverPhone')"
                v-model="newModel.driveR_GSM_NO"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="newModel.driveR_GSM_NO = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
            <q-item-section>
              <q-input
                type="textarea"
                :label="$t('detail')"
                v-model="newModel.note"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="newModel.detail = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
            <q-item-section>
              <q-toggle
                dense
                class="q-pa-sm col-lg-12 col-md-12 col-sm-12 col-xs-12"
                :label="$t('inactive')"
                v-model="newModel.iS_PASSIVE"
                checked-icon="check"
                color="green"
                unchecked-icon="cancel"
                :disable="mode === 'details'"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right" class="q-t-md">
        <q-space />
        <q-btn
          v-if="formMode == 'edit'"
          class="text-capitalize bg-info q-pa-xl"
          @click="newModel = {}"
        >
          {{ $t("new") }}
        </q-btn>
        <q-btn
          class="text-capitalize bg-info q-pa-xl"
          @click="save()"
          :disable="newModel.licensE_PLATE ? false : true"
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
            <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12 q-table__title">
              {{ $t("finance.drivers") }}
            </div>
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
            <q-input
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
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
              :color="props.row.iS_PASSIVE === 0 ? 'green' : 'red'"
              text-color="white"
              dense
              class="text-weight-bolder"
              square
              >{{ props.row.iS_PASSIVE === 0 ? $t("active") : $t("inactive") }}
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
            <q-btn
              flat
              round
              color="negative"
              icon="delete_forever"
              @click="
                currentRow = props.row;
                deleteConfirm = true;
              "
            />
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
          <q-avatar icon="cancel" color="negative" text-color="white" />&nbsp;
          &nbsp; &nbsp; &nbsp;
          <h5>{{ $t("deleteConfirm") }}</h5>
        </q-card-section>
        <q-card-section class="items-center">
          <p>{{ $t("name") }} &nbsp;: {{ currentRow.productName }}</p>
          <br />
          <p>
            {{ $t("products.referenceCode") }} &nbsp;:
            {{ currentRow.referenceCode }}
          </p>
          <br />
          <p>
            {{ $t("products.productCode") }} &nbsp;:
            {{ currentRow.productCode }}
          </p>
          <br />
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
</template>
<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "EditProductForm",
  components: {},
  computed: {
    columns() {
      return [
        {
          name: "firmName",
          label: this.$t("firmName"),
          align: "left",
          field: (row) => row.description,
          sortable: true,
        },
        {
          name: "LicencePlate",
          label: this.$t("LicencePlate"),
          align: "left",
          field: (row) => row.licensE_PLATE,
          sortable: true,
        },
        {
          name: "IdentifyNo",
          label: this.$t("IdentifyNo"),
          align: "left",
          field: (row) => row.driveR_IDENTIFY_NO,
          sortable: true,
        },
        {
          name: "driverName",
          label: this.$t("driverName"),
          align: "left",
          field: (row) => row.driveR_NAME,
          sortable: true,
        },
        {
          name: "driverSurname",
          label: this.$t("driverSurname"),
          align: "left",
          field: (row) => row.driveR_FAMILY_NAME,
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
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.getList();
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
      this.newModel.iS_PASSIVE = this.newModel.iS_PASSIVE ? 1 : 0;
      this.$logger.log("addFormModel", this.newModel);
      const _response = this.$api
        .post("postUyumVehicle", JSON.stringify(this.newModel))
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
          //this.$emit("close");
        });
    },
    async editFormModel() {
      this.newModel.iS_PASSIVE = this.newModel.iS_PASSIVE ? 1 : 0;
      this.$logger.log("editFormModel", this.newModel);
      const response = this.$api
        .put("putUyumVehicle", JSON.stringify(this.newModel))
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
          //this.$emit("close");
        });
    },
    async onEdit(row) {
      this.newModel = row;
      this.formMode = "edit";
    },

    async onDelete() {
      try {
        this.$logger.log("currentRow", this.currentRow);
        const response = await this.$api.delete(
          "deleteUyumVehicle/" + this.currentRow.vehiclE_ID
        );
        this.getList();
        this.deleteConfirm = false;
        this.$logger.log(response);
        this.$emit("completed");
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async getList() {
      this.loading = true;
      const response = this.$api.get("getUyumVehicle").then((data) => {
        this.$logger.log(data.data.result);
        this.rows = data.data.result;
        this.loading = false;
      });
    },

    async newFormMode() {
      this.newModel = {};
      this.formMode = "add";
    },
  },
});
</script>
