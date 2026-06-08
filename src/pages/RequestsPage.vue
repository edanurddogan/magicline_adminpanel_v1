<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
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
      <!--<template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" v-slot="scope">
              <q-input
                v-model="props.row.name"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>-->
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("users.users") }}
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
            icon="person_add"
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
          >
            <q-tooltip v-close-popup>{{ isGrid ? "List" : "Grid" }}</q-tooltip>
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
        </q-td>
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

    <!--<q-grid
      :data="rows"
      :columns="columnsgrp"
      :columns_filter="true"
      :draggable="true"
      :csv_download="true"
      file_name="sample"
    ></q-grid>-->

    <!-- Form Dialog -->
    <q-dialog
      v-model="formVisible"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 40vw; max-height: 90vh">
        <q-card-section class="q-pa-sm">
          <q-bar class="q-pa-sm">
            <q-icon name="person" />

            <q-toolbar-title
              ><span class="text-weight-bold">{{ $t("pages.request") }}</span>
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
          <user-form
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
      <q-card class="q-pa-md">
        <q-card-section class="items-center row">
          <q-avatar
            icon="person_off"
            color="negative"
            text-color="white"
          />&nbsp; &nbsp; &nbsp; &nbsp;
          <h5>{{ $t("users.userdeleteconfirm") }}</h5>
        </q-card-section>
        <q-card-section class="items-center row">
          <p>
            {{ $t("users.name") }} {{ $t("users.surname") }} :
            {{ currentRow.name }} {{ currentRow.surname }}
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
import UserForm from "src/components/forms/UserForm.vue";
import exportFromJSON from "export-from-json";
import { Platform } from "quasar";

export default defineComponent({
  components: {
    UserForm,
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
        /*{
          required: true,
          label: this.$t("username"),
          align: "left",
          field: (row) => row.kullaniciAdi,
          format: (val) => `${val}`,
          sortable: true,
        },*/
        {
          name: "usertitle",
          label: this.$t("usertitle"),
          align: "left",
          field: "title",
          sortable: true,
        },
        {
          name: "name",
          label: this.$t("name"),
          align: "left",
          field: "name",
          sortable: true,
        },
        {
          name: "surname",
          label: this.$t("surname"),
          field: "surname",
          align: "left",
          sortable: true,
        },
        {
          name: "email",
          label: this.$t("email"),
          field: "email",
          align: "left",
        },
        {
          label: this.$t("phone"),
          field: (row) => row.phone1,
          align: "left",
        },
        {
          name: "status",
          align: "center",
          label: this.$t("status"),
          field: "userstatus",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: this.$t("action"),
          field: "",
        },
        /*{
          required: true,
          name: "id",
          field: (row) => row.kullaniciId,
          sortable: false,
          classes: "hidden",
        },*/
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
    document.title = "Magicline - Users";
    this.$logger.log(this.$options.__name);
    /*const response = await this.$api.get('users');
    this.rows = response?.data;
    this.$logger.log('users', response?.data);
    this.loading = false;*/
  },
  methods: {
    init() {
      this.getUsers();
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
    onView(user) {
      this.$logger.log(user);
      this.maximizedToggle = false;
      this.currentRow = user; /*Object.assign(
        {},
        this.rows.find((row) => row.id === id)
      );*/
      this.currentMode = "details";
      this.formVisible = true;
    },
    onEdit(user) {
      this.maximizedToggle = false;
      this.currentRow = user; /*Object.assign(
        {},
        this.rows.find((row) => row.id === id)
      );*/
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onDeleteUser(user) {
      this.currentRow = user;
      this.deleteConfirm = true;
    },
    onFormCompleted() {
      this.formVisible = false;
      this.$logger.log("form completed");
      getUsers();
      // await this.$api.post("Kullanici/Kaydet", model);
    },
    toCall(id) {
      const _user = Object.assign(
        {},
        this.rows.find((row) => row.kullaniciId === id)
      );
      return "tel:" + _user.kullaniciTelefon;
    },
    toMail(id) {
      const _user = Object.assign(
        {},
        this.rows.find((row) => row.kullaniciId === id)
      );
      return "mailto:" + _user.kullaniciEposta;
    },
    exportTable() {
      const data = this.rows;
      const fileName = "UserList";
      const exportType = exportFromJSON.types.xls;

      exportFromJSON({ data, fileName, exportType });
    },
    async userDelete() {
      const response = await this.$api.delete(
        "user/" + this.currentRow.kullaniciId
      );
      getUsers();
      this.deleteConfirm = false;
      this.$logger.log(response);
    },
    async getUsers() {
      try {
        this.$logger.log("getUsers");
        const response = await this.$api.get("userslist/99/1/true");
        this.rows = response?.data;
        this.$logger.log("userslist", this.rows);
        this.loading = false;
        this.$logger.log("userslist", this.rows);
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async clickMenu(props) {
      this.$logger.log(props);
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
