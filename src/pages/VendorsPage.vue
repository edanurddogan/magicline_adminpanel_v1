<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="q-pa-md">
    <q-table
      :grid="isGrid"
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
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("offices.offices") }}
          </div>
          <q-space />
          <q-input
            class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
            bottom-slots
            dense
            debounce="300"
            v-model="filter"
            :placeholder="$t('offices.search')"
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
            icon="add_home_work"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="onAdd"
          />
          <q-space />
          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
          />
          <q-space />
          <q-btn
            flat
            round
            dense
            :icon="isGrid ? 'list' : 'grid_on'"
            @click="isGrid = !isGrid"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
          />
          <q-space />
          <q-btn
            :label="$t('export')"
            class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
            icon="cloud_download"
            @click="exportTable"
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

      <template #body-cell-action="props">
        <q-td :props="props">
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
          />
          <q-btn
            flat
            round
            color="accent"
            icon="link"
            :href="props.row.website"
            target="_blank"
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
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
            @click="onDelete(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          <span> {{ message }}... </span>
        </div>
      </template>

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
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
                      />
                      <q-btn
                        flat
                        round
                        color="accent"
                        icon="link"
                        :href="props.row.website"
                        target="_blank"
                      />
                      &nbsp;&nbsp;&nbsp;&nbsp;
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
                        @click="onDelete(props.row)"
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
    </q-table>

    <!-- Form Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 40vw; max-height: 90vh">
        <q-card-section>
          <q-bar class="q-pa-sm">
            <q-icon name="maps_home_work" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("offices.office") }}</span>
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
        <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
          <vendor-form
            v-model="currentRow"
            :mode="currentMode"
            @completed="onFormCompleted"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="deleteConfirm" persistent>
      <q-card class="q-pa-md">
        <q-card-section class="items-center row">
          <q-avatar icon="person_off" color="negative" text-color="white" />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <h5>{{ $t("offices.officedeleteconfirm") }}</h5>
          <!-- <p>{{ $t("users.username") }} : {{ currentRow.kullaniciAdi }}</p> -->
        </q-card-section>
        <q-card-section>
          <p>
            {{ $t("offices.firmtitle") }} :
            {{ currentRow.commercialTitle }}
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
            v-on:click="userDelete()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import VendorForm from "src/components/forms/VendorForm.vue";
import exportFromJSON from "export-from-json";
import { Platform } from "quasar";

export default defineComponent({
  components: {
    VendorForm,
  },
  computed: {
    // currentRow() {
    //   return JSON.parse(
    //     JSON.stringify(
    //       this.rows.length > 0 && this.selectedId > 0
    //         ? this.rows.find((row) => row.kullaniciId === this.selectedId)
    //         : {}
    //     )
    //   );
    // },
    columns() {
      return [
        {
          name: "name",
          label: this.$t("offices.name"),
          field: (row) => row.vendorName,
          align: "left",
        },
        {
          name: "firmtitle",
          required: true,
          label: this.$t("offices.firmtitle"),
          align: "left",
          field: (row) => row.commercialTitle,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "email",
          label: this.$t("offices.email"),
          field: "email",
          align: "left",
        },
        {
          label: this.$t("offices.phone"),
          field: "phone1",
          align: "left",
        },
        {
          label: this.$t("offices.phone"),
          field: "phone2",
          align: "left",
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
  async mounted() {
    this.init();
    const response = await this.$api.get("vendors");
    this.rows = response.data;
    this.$logger.log(this.rows);

    this.loading = false;
  },
  methods: {
    init() {
      document.title = "Magicline - Vendors";
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}
    },
    onAdd() {
      this.maximizedToggle = false;
      this.currentRow = {};
      this.currentMode = "add";
      this.formVisible = true;
    },
    onView(_row) {
      this.maximizedToggle = false;
      this.currentRow = _row;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onEdit(_row) {
      this.maximizedToggle = false;
      this.currentRow = _row;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onDelete(_row) {
      this.currentRow = _row;
      this.deleteConfirm = true;
    },
    onFormCompleted() {
      this.formVisible = false;
      this.$logger.log("form completed");

      // await this.$api.post("Kullanici/Kaydet", model);
    },
    toCall(id) {
      const _row = Object.assign(
        {},
        this.rows.find((row) => row.firmId === id)
      );
      return "tel:" + _row.firmPhone;
    },
    toMail(id) {
      const _row = Object.assign(
        {},
        this.rows.find((row) => row.firmId === id)
      );
      return "mailto:" + _row.firmEmail;
    },
    toWebSite(id) {
      const _row = Object.assign(
        {},
        this.rows.find((row) => row.firmId === id)
      );
      return _row.firmWebsite; //target="_blank"
    },
    exportTable() {
      const data = this.rows;
      const fileName = "FirmList";
      const exportType = exportFromJSON.types.xls;

      exportFromJSON({ data, fileName, exportType });
    },
  },
});
</script>
<style lang="sass">
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
