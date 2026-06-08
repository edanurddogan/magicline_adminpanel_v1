<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <q-splitter v-model="splitterModel">
      <!-- Araç Marka Ekleme -->
      <template v-slot:before>
        <q-card class="q-ma-md">
          <q-card-section class="bg-grey-5 text-h6 text-center">
            {{ brandName }}
          </q-card-section>
        </q-card>
        <q-table
          flat
          dense
          bordered
          :grid="isGrid"
          :hide-header="isGrid"
          class="statement-table q-ma-md"
          :rows="brands"
          :columns="brandColumns"
          :loading="loading"
          :filter="brandFilter"
          :pagination="pagination"
          :loading-label="$t('loading')"
          :no-data-label="$t('nodatalabel')"
          :no-results-label="$t('noresultslabel')"
          row-key="id"
          @row-click="onRowClick"
        >
          <template v-slot:body-cell="props">
            <q-td :props="props">
              {{ props.value }}
            </q-td>
          </template>
          <template v-slot:top="">
            <div class="row col-12">
              <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
                {{ $t("vehicle.vehicleBrandList") }}
              </div>
              <q-space />
              <!-- Tablo arama -->
              <q-input
                class="col-lg-6 col-md-4 col-sm-12 col-xs-12"
                bottom-slots
                dense
                debounce="300"
                v-model="brandFilter"
                :placeholder="$t('users.search')"
              >
                <template v-slot:append
                  ><q-icon
                    v-if="brandFilter !== ''"
                    name="close"
                    @click="brandFilter = ''"
                    class="cursor-pointer"
                  />
                  <q-icon name="search" />
                </template>
              </q-input>
              <!-- Ekle butonu-->
              <q-btn
                flat
                round
                dense
                icon="add"
                class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                @click="onAddBrand()"
              >
                <q-tooltip>
                  {{ $t("vehicle.vehicleBrandAdd") }}
                </q-tooltip>
              </q-btn>
              <!-- Yenileme butonu-->
              <q-btn
                flat
                round
                dense
                icon="refresh"
                class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                @click="getVehicleBrands"
              >
                <q-tooltip>
                  {{ $t("refresh") }}
                </q-tooltip>
              </q-btn>
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
                icon="info"
                @click="onViewBrand(props.row)"
              >
                <q-tooltip
                  transition-show="flip-right"
                  transition-hide="flip-left"
                >
                  {{ $t("view") }}
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                color="secondary"
                icon="edit"
                @click="onEditBrand(props.row)"
              >
                <q-tooltip
                  transition-show="flip-right"
                  transition-hide="flip-left"
                  >{{ $t("edit") }}</q-tooltip
                >
              </q-btn>
              <q-btn
                flat
                dense
                round
                color="negative"
                icon="delete_forever"
                @click="onDeleteBrand(props.row)"
              >
                <q-tooltip
                  transition-show="flip-right"
                  transition-hide="flip-left"
                  >{{ $t("delete") }}</q-tooltip
                >
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
      </template>
      <!-- Araç Model Ekleme -->
      <template v-slot:after>
        <div v-if="selectedBrand.id">
          <q-card class="q-ma-md">
            <q-card-section class="bg-grey-5 text-h6 text-center">
              {{ $t("vehicle.vehicleModel") }}
            </q-card-section>
          </q-card>
          <q-table
            flat
            dense
            bordered
            :grid="isGrid"
            :hide-header="isGrid"
            class="statement-table q-ma-md"
            :rows="models"
            :columns="modelColumns"
            :loading="loading"
            :filter="modelFilter"
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
            <template v-slot:top="">
              <div class="row col-12">
                <div
                  class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title"
                >
                  {{ $t("vehicle.vehicleModelsList") }}
                </div>
                <q-space />
                <!-- Tablo arama -->
                <q-input
                  class="col-lg-6 col-md-4 col-sm-12 col-xs-12"
                  bottom-slots
                  dense
                  debounce="300"
                  v-model="modelFilter"
                  :placeholder="$t('users.search')"
                >
                  <template v-slot:append
                    ><q-icon
                      v-if="modelFilter !== ''"
                      name="close"
                      @click="modelFilter = ''"
                      class="cursor-pointer"
                    />
                    <q-icon name="search" />
                  </template>
                </q-input>
                <!-- Ekle butonu-->
                <q-btn
                  flat
                  round
                  dense
                  icon="add"
                  class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                  @click="onAddModel()"
                >
                  <q-tooltip>
                    {{ $t("vehicle.vehicleModelAdd") }}
                  </q-tooltip>
                </q-btn>
                <!-- Yenile Butonu -->
                <q-btn
                  flat
                  round
                  dense
                  icon="refresh"
                  class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                  @click="getVehicleModels"
                >
                  <q-tooltip>
                    {{ $t("refresh") }}
                  </q-tooltip>
                </q-btn>
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
                  icon="info"
                  @click="onViewModel(props.row)"
                >
                  <q-tooltip
                    transition-show="flip-right"
                    transition-hide="flip-left"
                  >
                    {{ $t("view") }}
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  color="secondary"
                  icon="edit"
                  @click="onEditModel(props.row)"
                >
                  <q-tooltip
                    transition-show="flip-right"
                    transition-hide="flip-left"
                    >{{ $t("edit") }}</q-tooltip
                  >
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  color="negative"
                  icon="delete_forever"
                  @click="onDeleteModel(props.row)"
                >
                  <q-tooltip
                    transition-show="flip-right"
                    transition-hide="flip-left"
                    >{{ $t("delete") }}</q-tooltip
                  >
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
        </div>
      </template>
    </q-splitter>
    <!-- Add & Edit Brand Dialog -->
    <q-dialog
      v-model="formVisibleBrand"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 40vw; max-height: 90vh">
        <!-- Bölüm başlık ve butonlar -->
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="directions_car" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("vehicle.vehicleBrand")
              }}</span>
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
        <!-- Marka Ekleme -->
        <q-card-section>
          <q-list class="row">
            <q-item class="col-4">
              <q-item-section>
                <q-input
                  ref="brandNameRef"
                  dense
                  :disable="currentMode === 'details'"
                  :label="$t('vehicle.vehicleBrandName')"
                  v-model="newBrand.name"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                />
              </q-item-section>
            </q-item>
            <!-- Fotoğraf Yükleme -->
            <q-item class="col-8">
              <q-item-section>
                <q-uploader
                  ref="uploader"
                  :label="$t('pages.uploadImage')"
                  multiple
                  batch
                  @finish="onUploadFinish"
                  :factory="uploadFiles"
                  :disable="!newBrand.id || currentMode === 'details'"
                  :style="{
                    opacity: newBrand.id ? 1 : 0.5,
                    pointerEvents: newBrand.id ? 'auto' : 'none',
                    width: '100%',
                    maxWidth: '100%',
                  }"
                >
                  <template v-slot:header="scope">
                    <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                      <q-btn
                        v-if="scope.queuedFiles.length > 0"
                        icon="clear_all"
                        @click="scope.removeQueuedFiles"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>{{ $t("pages.clearAll") }}</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="scope.uploadedFiles.length > 0"
                        icon="done_all"
                        @click="scope.removeUploadedFiles"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>{{
                          $t("pages.removeUploadedFiles")
                        }}</q-tooltip>
                      </q-btn>
                      <q-spinner
                        v-if="scope.isUploading"
                        class="q-uploader__spinner"
                      />
                      <div class="col">
                        <div class="q-uploader__title">
                          {{ $t("pages.uploadYourFiles") }}
                        </div>
                        <div class="q-uploader__subtitle">
                          {{ scope.uploadSizeLabel }} /
                          {{ scope.uploadProgressLabel }}
                        </div>
                      </div>
                      <q-btn
                        v-if="scope.canAddFiles"
                        icon="add_box"
                        @click="scope.pickFiles"
                        round
                        dense
                        flat
                      >
                        <q-uploader-add-trigger />
                        <q-tooltip>{{ $t("pages.uploadFiles") }}</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="scope.canUpload"
                        icon="cloud_upload"
                        @click="scope.upload"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>{{ $t("pages.uploadFiles") }}</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="scope.isUploading"
                        icon="clear"
                        @click="scope.abort"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>{{ $t("pages.abortUpload") }}</q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                </q-uploader>

                <q-inner-loading
                  :showing="uploaderLoading"
                  color="red"
                  :dark="true"
                  label="Please wait..."
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <!-- Kaydet / Güncelle Buton -->
        <q-card-actions class="q-pa-lg justify-between">
          <q-toggle
            class="col-lg-8 col-md-8 col-sm-8 col-xs-12"
            :label="newBrand.isActive === true ? $t('active') : $t('inactive')"
            color="green"
            checked-icon="check"
            unchecked-icon="cancel"
            :disable="currentMode === 'details'"
            v-model="newBrand.isActive"
          />

          <q-btn
            v-if="currentMode !== 'details'"
            class="text-capitalize bg-info q-mr-lg"
            @click="addUpdateVehicleBrand"
          >
            {{ newBrand.id ? $t("updatedata") : $t("savedata") }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Add & Edit Model Dialog -->
    <q-dialog
      v-model="formVisibleModel"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 40vw; max-height: 90vh">
        <!-- Bölüm başlık ve butonlar -->
        <q-card-section class="q-pa-none">
          <q-bar class="q-pa-sm">
            <q-icon name="directions_car" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{
                $t("vehicle.vehicleModel")
              }}</span>
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
        <!-- Model Ekleme -->
        <q-card-section>
          <q-list class="row">
            <q-item class="col-4">
              <q-item-section>
                <q-input
                  ref="modelNameRef"
                  dense
                  :disable="currentMode === 'details'"
                  :label="$t('vehicle.vehicleModelName')"
                  v-model="newModel.name"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                />
              </q-item-section>
            </q-item>
            <!-- Model Fotoğraf Yükleme -->
            <q-item class="col-8">
              <q-item-section>
                <q-uploader
                  ref="uploader"
                  :label="$t('pages.uploadImage')"
                  multiple
                  batch
                  @finish="onUploadFinish"
                  :factory="uploadFiles"
                  :disable="!newModel.id || currentMode === 'details'"
                  :style="{
                    opacity: newModel.id ? 1 : 0.5,
                    pointerEvents: newModel.id ? 'auto' : 'none',
                    width: '100%',
                    maxWidth: '100%',
                  }"
                >
                  <template v-slot:header="scope">
                    <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                      <q-btn
                        v-if="scope.queuedFiles.length > 0"
                        icon="clear_all"
                        @click="scope.removeQueuedFiles"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>{{ $t("pages.clearAll") }}</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="scope.uploadedFiles.length > 0"
                        icon="done_all"
                        @click="scope.removeUploadedFiles"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>{{
                          $t("pages.removeUploadedFiles")
                        }}</q-tooltip>
                      </q-btn>
                      <q-spinner
                        v-if="scope.isUploading"
                        class="q-uploader__spinner"
                      />
                      <div class="col">
                        <div class="q-uploader__title">
                          {{ $t("pages.uploadYourFiles") }}
                        </div>
                        <div class="q-uploader__subtitle">
                          {{ scope.uploadSizeLabel }} /
                          {{ scope.uploadProgressLabel }}
                        </div>
                      </div>
                      <q-btn
                        v-if="scope.canAddFiles"
                        icon="add_box"
                        @click="scope.pickFiles"
                        round
                        dense
                        flat
                      >
                        <q-uploader-add-trigger />
                        <q-tooltip>{{ $t("pages.uploadFiles") }}</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="scope.canUpload"
                        icon="cloud_upload"
                        @click="scope.upload"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>{{ $t("pages.uploadFiles") }}</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="scope.isUploading"
                        icon="clear"
                        @click="scope.abort"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>{{ $t("pages.abortUpload") }}</q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                </q-uploader>

                <q-inner-loading
                  :showing="uploaderLoading"
                  color="red"
                  :dark="true"
                  label="Please wait..."
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <!-- Kaydet / Güncelle Buton -->
        <q-card-actions class="q-pa-lg justify-between">
          <q-toggle
            class="col-lg-8 col-md-8 col-sm-8 col-xs-12"
            :label="newModel.isActive === true ? $t('active') : $t('inactive')"
            color="green"
            checked-icon="check"
            unchecked-icon="cancel"
            :disable="currentMode === 'details'"
            v-model="newModel.isActive"
          />

          <q-btn
            v-if="currentMode !== 'details'"
            class="text-capitalize bg-info q-pa-lg"
            @click="addUpdateVehicleModel"
          >
            {{ newModel.id ? $t("updatedata") : $t("savedata") }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Brand Delete Dialog -->
    <q-dialog v-model="deleteConfirmBrand" persistent>
      <q-card class="q-pa-md text-center">
        <q-card-section>
          <q-avatar icon="car_crash" color="negative" text-color="white" />
          <h5>{{ $t("vehicle.brandDeleteConfirm") }}</h5>
          <p>{{ $t("vehicle.vehicleBrand") }} : {{ newBrand.name }}</p>
        </q-card-section>

        <q-card-actions align="between">
          <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('delete')"
            color="negative"
            v-on:click="deleteBrandRow()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Model Delete Dialog -->
    <q-dialog v-model="deleteConfirmModel" persistent>
      <q-card class="q-pa-md text-center">
        <q-card-section>
          <q-avatar
            icon="car_crash"
            color="negative"
            text-color="white"
          />&nbsp; &nbsp; &nbsp; &nbsp;
          <h5>{{ $t("vehicle.modelDeleteConfirm") }}</h5>
          <p>{{ $t("vehicle.vehicleModel") }} : {{ newModel.name }}</p>
        </q-card-section>

        <q-card-actions align="between">
          <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('delete')"
            color="negative"
            v-on:click="deleteModelRow()"
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

export default defineComponent({
  components: {},
  computed: {
    brandColumns() {
      return [
        {
          name: "vehicleBrand",
          label: this.$t("vehicle.vehicleBrandName"),
          align: "left",
          field: (row) => row.name,
          sortable: true,
        },
        {
          name: "vehicleImage",
          label: this.$t("vehicle.vehicleBrandImage"),
          align: "left",
          field: "logo",
          sortable: true,
        },
        {
          name: "status",
          label: this.$t("status"),
          field: "isActive",
          align: "center",
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
    modelColumns() {
      return [
        {
          name: "vehicleBrand",
          label: this.$t("vehicle.vehicleModelName"),
          align: "left",
          field: (row) => row.name,
          sortable: true,
        },
        {
          name: "vehicleModelImage",
          label: this.$t("vehicle.vehicleModelImage"),
          align: "left",
          field: "logo",
          sortable: true,
        },
        {
          name: "status",
          label: this.$t("status"),
          field: "isActive",
          align: "center",
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
      brands: [],
      models: [],
      selectedBrand: {},
      brandName: this.$t("vehicle.vehicleBrand"),
      formVisibleBrand: false,
      formVisibleModel: false,
      deleteConfirmBrand: false,
      deleteConfirmModel: false,
      currentMode: "add",
      currentRowBrand: null,
      currentRowModel: null,
      maximizedToggle: false,
      brandFilter: "",
      modelFilter: "",
      isGrid: false,
      splitterModel: 50,
      pagination: { rowsPerPage: 20 },
      uploaderLoading: false,

      newBrand: {
        id: null,
        name: "",
        detail: "",
        logo: "",
        isActive: true,
      },
      newModel: {
        id: null,
        name: "",
        logo: "",
        vehicleBrandId: "",
        isActive: true,
      },
    };
  },
  async mounted() {
    document.title = `${firm.name}-${this.$t("vehicle.vehicles")}`;
    this.init();
  },
  methods: {
    init() {
      this.getVehicleBrands();
    },

    async getVehicleBrands() {
      try {
        const response = await this.$api.get("getVehicleBrands");
        this.brands = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getVehicleBrands", error);
      }
    },
    async getVehicleModels() {
      try {
        const response = await this.$api.get(
          `getVehicleModelsByBrand/${this.selectedBrand.id}`
        );
        this.models = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getVehicleModels", error);
      }
    },

    async addUpdateVehicleBrand() {
      try {
        if (!this.newBrand.name) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }
        if (this.newBrand.id) {
          // Update existing brand
          await this.$api.put(`vehicleBrands`, this.newBrand);
        } else {
          // Add new brand
          await this.$api.post("vehicleBrands", this.newBrand);
        }
        this.$q.notify({
          type: "positive",
          message: this.newBrand.id ? this.$t("updated") : this.$t("saved"),
        });
        this.getVehicleBrands();
        this.formVisibleBrand = false;
      } catch (error) {
        this.$logger.error("addUpdateVehicleBrand", error);
      }
    },
    async addUpdateVehicleModel() {
      try {
        const isValid = await this.$refs.modelNameRef?.validate?.();
        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }
        this.newModel.vehicleBrandId = this.selectedBrand.id;
        if (this.newModel.id) {
          // Update existing model
          await this.$api.put(`vehicleModels`, this.newModel);
        } else {
          // Add new model
          await this.$api.post("vehicleModels", this.newModel);
        }
        this.$q.notify({
          type: "positive",
          message: this.newModel.id ? this.$t("updated") : this.$t("saved"),
        });
        this.getVehicleModels();
        this.formVisibleModel = false;
      } catch (error) {
        this.$logger.error("addUpdateVehicleModel", error);
      }
    },
    async uploadFiles(files) {
      this.$logger.log("Uploading files: ", files);
      this.uploaderLoading = true;

      try {
        const data = new FormData();
        const fileInfo = {
          fileType: "services",
          referenceId: this.serviceId, // Blog ID'si
        };

        files.forEach((file) => {
          data.append("files", file); // Orijinal isim ile gönderiyoruz
        });

        data.append("fileInfo", JSON.stringify(fileInfo));

        const response = await this.$api.post("postUpload", data);
        this.$logger.log("Upload Success:", response);
        this.getStockCardPhoto();
        return true;
      } catch (error) {
        this.$logger.error("Upload Error:", error);
        return false;
      } finally {
        this.uploaderLoading = false;
      }
    },

    onUploadFinish() {
      this.$refs.uploader.reset();
    },
    onAddBrand() {
      this.newBrand = {
        id: null,
        name: "",
        detail: "",
        logo: "",
        isActive: true,
        vehicleModels: {},
      };
      this.currentMode = "add";
      this.formVisibleBrand = true;
    },
    onViewBrand(row) {
      this.newBrand = row;
      this.currentMode = "details";
      this.formVisibleBrand = true;
    },
    onEditBrand(row) {
      this.newBrand = row;
      this.currentMode = "edit";
      this.formVisibleBrand = true;
    },
    onAddModel() {
      this.newModel = {
        id: null,
        name: "",
        logo: "",
        isActive: true,
        vehicleBrandId: "",
      };
      this.currentMode = "add";
      this.formVisibleModel = true;
    },
    onViewModel(row) {
      this.newModel = row;
      this.currentMode = "details";
      this.formVisibleModel = true;
    },
    onEditModel(row) {
      this.newModel = row;
      this.currentMode = "edit";
      this.formVisibleModel = true;
    },
    onDeleteBrand(row) {
      this.newBrand = row;
      this.deleteConfirmBrand = true;
    },
    onDeleteModel(row) {
      this.newModel = row;
      this.deleteConfirmModel = true;
    },
    async deleteBrandRow() {
      try {
        this.newBrand.isActive = false;
        await this.$api.put(`vehicleBrands`, this.newBrand);
        this.$q.notify({
          type: "positive",
          message: this.$t("vehicle.brandDeleted"),
        });
        this.getVehicleBrands();
        this.deleteConfirmBrand = false;
      } catch (error) {
        this.$logger.error("brandDelete", error);
      }
    },
    async deleteModelRow() {
      try {
        this.newModel.isActive = false;
        await this.$api.put(`vehicleModels`, this.newModel);
        this.$q.notify({
          type: "positive",
          message: this.$t("vehicle.modelDeleted"),
        });
        this.getVehicleModels();
        this.deleteConfirmModel = false;
      } catch (error) {
        this.$logger.error("modelDelete", error);
      }
    },

    finished() {
      this.$refs.uploader.reset();
    },
    onRowClick(event) {
      const text = event.target
        .closest("tr")
        ?.querySelector("td.q-td.text-left")
        ?.textContent?.trim();

      this.selectedBrand = this.brands.find((obj) => obj.name === text);

      this.brandName = `${this.$t("vehicle.vehicleBrand")} : ${
        this.selectedBrand.name
      }`;
      this.getVehicleModels();
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
