<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <div id="divToHideFilter" class="row q-pa-md">
      <q-card>
        <q-list class="row">
          <q-item class="col-3">
            <!-- Başlangıç Tarihi Seçimi -->
            <q-input filled v-model="startDate">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="startDate" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="startDate"
                      mask="YYYY-MM-DD HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>

          <q-item class="col-3">
            <!-- Bitiş Tarihi Seçimi -->
            <q-input filled v-model="endDate">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="endDate" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="endDate" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>

          <q-item class="col-4">
            <q-select
              v-model="selectedRegions"
              :options="regionOptions"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              multiple
              use-chips
              clearable
              outlined
              dense
              use-input
              :loading="loading"
              transition-show="scale"
              transition-hide="scale"
              :label="$t('region.regionSelect')"
              @filter="onFilterRegion"
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

          <q-item class="col-1">
            <q-btn
              class="q-ml-md"
              color="primary"
              :label="$t('Listele')"
              @click="getList"
            >
              <q-tooltip>
                {{ $t("search") }}
              </q-tooltip>
            </q-btn>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <q-table
      flat
      bordered
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
      <template v-slot:body-cell="props">
        <q-td :props="props">
          {{ props.value }}
        </q-td>
        <q-menu touch-position context-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section @click="clickMenu(props.row)"
                >Open...</q-item-section
              >
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>New</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("reports.regionReports") }}
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
            icon="filter_alt"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="onAdd"
          >
            <q-tooltip>
              {{ $t("regionReport.filterReports") }}
            </q-tooltip>
          </q-btn>
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
          <q-space />
          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
          >
            <q-tooltip>
              {{ $t("maximize") }}
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
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            dense
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
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          <span> {{ message }}... </span>
        </div>
      </template>
    </q-table>

    <!-- Filter Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 60vw; max-height: 120vh">
        <q-card-section class="q-pa-sm">
          <q-bar class="q-pa-sm">
            <q-icon name="filter_list" />
            <q-toolbar-title>
              <span class="text-weight-bold">{{
                $t("regionReport.filter")
              }}</span>
            </q-toolbar-title>

            <q-btn
              dense
              flat
              icon="close_fullscreen"
              @click="maximizedToggle = false"
              :disable="!maximizedToggle"
            >
              <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">
                {{ $t("minimize") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              dense
              flat
              icon="open_in_full"
              @click="maximizedToggle = true"
              :disable="maximizedToggle"
            >
              <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">
                {{ $t("maximize") }}
              </q-tooltip>
            </q-btn>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">{{
                $t("close")
              }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-form @submit.prevent="onSubmit">
            <q-list class="row q-col-gutter-md">
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="filterModel.startDate"
                    ref="startDateRef"
                    :label="$t('startDate')"
                    :rules="[(val) => !!val || $t('requiredlabel')]"
                    lazy-rules
                    outlined
                    mask="####-##-##"
                    :disable="loading"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" />
                    </template>
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="filterModel.startDate"
                        mask="YYYY-MM-DD"
                      />
                    </q-popup-proxy>
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="filterModel.endDate"
                    ref="endDateRef"
                    :label="$t('endDate')"
                    :rules="[(val) => !!val || $t('requiredlabel')]"
                    lazy-rules
                    outlined
                    mask="####-##-##"
                    :disable="loading"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" />
                    </template>
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="filterModel.endDate" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-input>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="row justify-end q-mt-md">
              <q-btn
                :label="$t('show')"
                icon="search"
                color="primary"
                unelevated
                type="submit"
                :loading="loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="deleteConfirm" persistent>
      <q-card class="q-pa-md text-center">
        <q-card-section>
          <q-avatar
            size="56px"
            icon="delete_forever"
            color="negative"
            text-color="white"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6 q-mb-sm">{{ $t("region.deleteConfirm") }}</div>
          <div class="text-subtitle2">
            {{ $t("region.selectedRegion") }} <b>{{ currentRow.name }}</b>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('delete')"
            color="negative"
            @click="deleteReport()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import exportFromJSON from "export-from-json";
import { Platform } from "quasar";

export default defineComponent({
  components: {},
  data() {
    return {
      rows: [],
      filter: "",
      loading: false,
      selectedRegions: [],
      regionOptions: [],
      startDate: new Date(),
      endDate: new Date(),

      formVisible: false,
      deleteConfirm: false,
      maximizedToggle: false,
      currentMode: "add",
      currentRow: null,
      filterModel: {
        startDate: "",
        endDate: "",
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "name",
          label: this.$t("region.regionName"),
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "totalkWh",
          label: this.$t("regionReport.totalkWh"),
          field: "totalkWh",
          align: "left",
          sortable: true,
        },
        {
          name: "totalTransactions",
          label: this.$t("regionReport.totalTransactions"),
          field: "totalTransactions",
          align: "left",
          sortable: true,
        },
        {
          name: "totalAmount",
          label: this.$t("regionReport.totalAmount"),
          field: "totalAmount",
          align: "left",
          sortable: false,
        },
        {
          name: "userAmount",
          label: this.$t("regionReport.userAmount"),
          field: "userAmount",
          align: "left",
          sortable: false,
        },
        {
          name: "discountAmount",
          label: this.$t("regionReport.discountAmount"),
          field: "discountAmount",
          align: "left",
          sortable: false,
        },
        {
          name: "action",
          label: this.$t("action"),
          field: "",
          align: "center",
        },
      ];
    },
  },

  async mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getRegions();
      this.$setPageTitle("Bölge Raporları");
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onEdit(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onView(row) {
      this.maximizedToggle = false;
      this.currentRow = row;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onDeleteUser(row) {
      this.currentRow = row;
      this.deleteConfirm = true;
    },
    // async deleteReport() {
    //   try {
    //     await this.$api.delete(`stationRegions/${this.currentRow.id}`);
    //     this.getList();
    //     this.deleteConfirm = false;
    //     this.$q.notify({
    //       type: "positive",
    //       message: this.$t("success"),
    //     });
    //   } catch (error) {
    //     this.$logger.error(error);
    //     this.$q.notify({
    //       type: "negative",
    //       message: this.$t("error"),
    //     });
    //   }
    // },
    onFormCompleted() {
      this.formVisible = false;
      this.getList();
    },
    exportTable() {
      const fileName = "Region Report";
      const exportType = exportFromJSON.types.xls;
      exportFromJSON({ data: this.rows, fileName, exportType });
    },
    clickMenu(row) {
      this.$logger.log("Context menu clicked", row);
    },
    // async getList() {
    //   try {
    //     const response = await this.$api.get("getRegionsWithStation");
    //     this.rows = response?.data || [];
    //     this.loading = false;
    //   } catch (error) {
    //     this.$logger.error("getList error", error);
    //   }
    // },
    async getRegions() {
      this.loading = true;
      try {
        const response = await this.$api.get("getRegions");
        this.regionOptions = response?.data || [];
      } catch (error) {
        this.$logger.error("getRegions error", error);
      } finally {
        this.loading = false;
      }
    },
    onFilterRegion(val, update) {
      if (val === "") {
        update(() => {
          this.getRegions();
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.regionOptions = this.regionOptions.filter((region) =>
          region.name?.toLowerCase().includes(needle)
        );
      });
    },
    async onSubmit() {
      if (!this.filterModel.startDate || !this.filterModel.endDate) return;

      this.loading = true;
      try {
        // API çağrısı veya filtreleme işlemi
        this.$logger.log("Filtre gönderildi:", this.filterModel);
      } catch (err) {
        this.$q.notify({ type: "negative", message: this.$t("errorOccurred") });
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style lang="sass">
.my-sticky-header-table
  max-height: 600px
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    thead tr th
      position: sticky
      z-index: 1
    thead tr:first-child th
      top: 0
  &.q-table--loading thead tr:last-child th
    top: 48px
</style>
