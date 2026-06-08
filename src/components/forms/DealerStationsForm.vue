<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      class="statement-table"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="filter"
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
            {{ $t("station.stations") }}
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
          <!-- <q-btn
            flat
            round
            dense
            icon="add"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="onAdd"
          >
            <q-tooltip>
              {{ $t("station.addStation") }}
            </q-tooltip>
          </q-btn> -->
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
      <template #body-cell-isActive="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.isActive === true ? 'green' : 'red'"
            text-color="white"
            dense
            class="text-weight-bolder"
            square
          >
            {{ props.row.isActive ? $t("active") : $t("inactive") }}
          </q-chip>
        </q-td>
      </template>
      <!-- <template #body-cell-action="props">
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
            @click="onDeleteUser(props.row)"
          />
        </q-td>
      </template> -->

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3"
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
                        icon="mail"
                        :href="'mailto:' + props.row.email"
                      />
                      <q-btn
                        flat
                        round
                        color="secondary"
                        icon="phone"
                        :href="'tel:' + props.row.phone1"
                      />&nbsp;&nbsp;&nbsp;
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

                  <q-item-label v-else caption
                    ><p>{{ col.value }}</p></q-item-label
                  >
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
    </q-table>

    <!-- Form Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 75vw; max-height: 85vh">
        <q-card-section class="q-pa-sm">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("station.station") }}</span>
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
        <q-card-section class="scroll q-pa-sm">
          <station-form
            class="q-pa-sm"
            v-model="currentRow"
            :mode="currentMode"
            @completed="onFormCompleted"
          />
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
          <div class="text-h6 q-mb-sm">{{ $t("station.deleteConfirm") }}</div>
          <div class="text-subtitle2">
            {{ $t("station.selectedStation") }}: <b>{{ currentRow.name }}</b>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="$t('delete')"
            color="negative"
            @click="deleteStation()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import StationForm from "src/components/forms/StationForm.vue";
import { LocalStorage } from "quasar";
import exportFromJSON from "export-from-json";

export default defineComponent({
  components: {
    StationForm,
  },

  props: {
    dealerId: {
      type: Number,
    },
  },
  data() {
    return {
      rows: [],
      filter: "",
      loading: true,
      formVisible: false,
      deleteConfirm: false,
      maximizedToggle: false,
      currentMode: "add",
      currentRow: {},
      pagination: { rowsPerPage: 20 },
      user: LocalStorage.getItem("userinfo") || null,
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "stationName",
          label: this.$t("station.stationName"),
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "stationCode",
          label: this.$t("station.stationCode"),
          field: "code",
          align: "left",
          sortable: true,
        },
        {
          name: "stationRegion",
          label: this.$t("station.stationRegion"),
          field: (row) => row.stationRegion?.name || "-",
          align: "left",
          sortable: true,
        },
        {
          name: "serialNumber",
          label: this.$t("station.serialNumber"),
          field: "serialNumber",
          align: "left",
          sortable: false,
        },
        {
          name: "location",
          label: this.$t("station.location"),
          field: (row) =>
            row.latitude && row.longitude
              ? `${row.latitude.toFixed(5)}, ${row.longitude.toFixed(5)}`
              : "-",
          align: "left",
          sortable: false,
        },
        {
          name: "isActive",
          label: this.$t("status"),
          field: "isActive",
          align: "center",
          sortable: true,
          format: (val) => (val ? this.$t("active") : this.$t("passive")),
        },
        // {
        //   name: "action",
        //   label: this.$t("action"),
        //   field: (row) => row,
        //   align: "center",
        // },
      ];
    },
  },

  async mounted() {
    this.init();
  },
  methods: {
    init() {
      document.title = `Magicline-${this.$t("station.stations")}`;
      this.getList();
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
    async deleteStation() {
      try {
        this.currentRow.isActive = false;
        await this.$api.put("updateStation", this.currentRow);
        this.getList();
        this.deleteConfirm = false;
        this.$q.notify({
          type: "positive",
          message: this.$t("success"),
        });
      } catch (error) {
        this.$logger.log(error);
        this.$q.notify({
          type: "negative",
          message: this.$t("error"),
        });
      }
    },
    async onFormCompleted(data) {
      try {
        this.formVisible = false;
        this.getList();
      } catch (error) {
        this.$logger.log("Kaydetme hatası:", error);
      }
    },

    exportTable() {
      const fileName = "UserList";
      const exportType = exportFromJSON.types.xls;
      exportFromJSON({ data: this.rows, fileName, exportType });
    },
    clickMenu(row) {
      this.$logger.log("Context menu clicked", row);
    },
    async getList() {
      try {
        const response = await this.$api.get(
          `getDelaerStationsByDelaerId/${this.dealerId}`,
        );
        this.rows = response?.data.data;
        this.$logger.log("getDelaerStationsByDelaerId", this.rows);
        this.loading = false;
      } catch (error) {
        this.$logger.error("getList error", error);
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
