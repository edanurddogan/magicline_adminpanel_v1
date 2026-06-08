<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>

<template>
  <div class="q-pa-md">
    <q-table
      flat
      dense
      bordered
      class="statement-table q-mb-md"
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
      <template v-slot:top="props">
        <div class="row col-12">
          <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title">
            {{ $t("order.creditCards") }}
          </div>
          <q-space />

          <!-- Search -->
          <q-input
            class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
            bottom-slots
            dense
            debounce="300"
            v-model="filter"
            :placeholder="$t('users.search')"
          >
            <template v-slot:append>
              <q-icon
                v-if="filter !== ''"
                name="close"
                @click="filter = ''"
                class="cursor-pointer"
              />
              <q-icon name="search" />
            </template>
          </q-input>

          <q-space />

          <!-- Refresh -->
          <q-btn
            flat
            round
            dense
            icon="refresh"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
            @click="getList"
          >
            <q-tooltip>{{ $t("refresh") }}</q-tooltip>
          </q-btn>

          <q-space />

          <!-- Fullscreen -->
          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
          >
            <q-tooltip>{{ $t("maximize") }}</q-tooltip>
          </q-btn>

          <q-space />

          <!-- Export -->
          <q-btn
            :label="$t('export')"
            class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
            icon="cloud_download"
            @click="exportVehicles"
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

      <template #body-cell-action="props">
        <q-td :props="props" class="text-center">
          <q-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            :disable="props.row.isActive !== true"
            @click="openRemoveCardDialog(props.row)"
          >
            <q-tooltip>{{ $t("deleteCard") }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="star"
            :color="props.row.defaultCard ? 'yellow' : 'grey'"
            :disable="props.row.isActive !== true"
            @click="openDefaultCardDialog(props.row)"
          >
            <q-tooltip>{{ $t("defaultCard") }}</q-tooltip>
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

  <!-- Dialog -->
  <q-dialog v-model="removeCardDialog">
    <q-card style="min-width: 520px; max-width: 92vw">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ $t("confirm") }}</div>
        <q-space />
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-body1">
          <b>{{
            selectedCard && selectedCard.cardLastFour
              ? selectedCard.cardLastFour
              : ""
          }}</b>
          ile biten
          <b>{{
            selectedCard && selectedCard.c_bank ? selectedCard.c_bank : ""
          }}</b>
          kartı kaldırılacak. Onaylıyor musunuz?
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" v-close-popup />
        <q-btn
          unelevated
          color="negative"
          :label="$t('confirm')"
          :loading="removeCardLoading"
          @click="confirmRemoveCard"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="defaultCardDialog">
    <q-card style="min-width: 520px; max-width: 92vw">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ $t("confirm") }}</div>
        <q-space />
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-body1">
          <b>{{
            selectedCard && selectedCard.cardLastFour
              ? selectedCard.cardLastFour
              : ""
          }}</b>
          ile biten
          <b>{{
            selectedCard && selectedCard.c_bank ? selectedCard.c_bank : ""
          }}</b>
          kartı varsayılan olarak değiştirilecek. Onaylıyor musunuz?
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" v-close-popup />
        <q-btn
          unelevated
          color="negative"
          :label="$t('confirm')"
          :loading="removeCardLoading"
          @click="confirmDefaultCard"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "CustomerCreditCardsForm",
  props: {
    modelValue: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["completed"],
  computed: {
    columns() {
      return [
        {
          name: "bankName",
          label: this.$t("finance.cashBox.bank"),
          align: "left",
          sortable: true,
          field: (row) => row.c_bank,
        },
        {
          name: "cardlastFour",
          label: this.$t("order.lastFour"),
          align: "center",
          sortable: true,
          field: (row) => row.cardLastFour,
        },
        {
          name: "schema",
          label: this.$t("order.network"),
          field: (row) => row.schema,
          align: "left",
          sortable: true,
        },
        {
          name: "cardType",
          label: this.$t("order.creditCardType"),
          field: (row) => row.c_type,
          align: "left",
          sortable: true,
        },
        {
          name: "date",
          label: this.$t("date"),
          field: (row) => this.dateFormat(row.createdAt),
          align: "center",
          sortable: true,
        },
        {
          name: "defaultCard",
          label: this.$t("default"),
          align: "center",
          sortable: true,
          field: (row) => (row.defaultCard ? this.$t("confirm") : ""),
        },
        {
          name: "isActive",
          label: this.$t("status"),
          align: "center",
          field: (row) => row.isActive,
        },
        {
          name: "action",
          label: this.$t("action"),
          align: "center",
          field: () => "",
          sortable: false,
        },
      ];
    },
  },
  data() {
    return {
      loading: true,
      rows: [],
      filter: "",
      maximizedToggle: false,
      pagination: { rowsPerPage: 10 },

      removeCardDialog: false,
      removeCardLoading: false,
      defaultCardDialog: false,
      defaultCardLoading: false,
      selectedCard: null,
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getList();
    },

    async getList() {
      try {
        this.loading = true;

        const response = await this.$api.get(
          `getCustomerCards/${this.modelValue.id}`,
        );

        this.$logger.log("data", response.data);
        this.rows = response.data.data;
      } catch (error) {
        this.$logger.error("getList", error);
      } finally {
        this.loading = false;
      }
    },

    openRemoveCardDialog(row) {
      this.selectedCard = row;
      this.removeCardDialog = true;
    },
    openDefaultCardDialog(row) {
      this.selectedCard = row;
      this.defaultCardDialog = true;
    },

    async confirmRemoveCard() {
      try {
        this.removeCardLoading = true;

        const body = {
          cardId: this.selectedCard.id,
        };

        await this.$api.post("deleteCardForAdmin", body);
        await this.getList();
        this.removeCardDialog = false;
        this.selectedCard = null;

        this.$q.notify({
          type: "positive",
          message: this.$t("success"),
        });
      } catch (error) {
        this.$logger.error("confirmRemoveCard", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("error"),
        });
      } finally {
        this.removeCardLoading = false;
      }
    },
    async confirmDefaultCard() {
      try {
        this.defaultCardLoading = true;

        const body = {
          cardId: this.selectedCard.id,
          customerId: this.selectedCard?.customerId,
        };

        await this.$api.post("/postDefaultCustomerCard", body);
        await this.getList();
        this.defaultCardDialog = false;
        this.selectedCard = null;

        this.$q.notify({
          type: "positive",
          message: this.$t("success"),
        });
      } catch (error) {
        this.$logger.error("confirmDefaultCard", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("error"),
        });
      } finally {
        this.defaultCardLoading = false;
      }
    },
    dateFormat(date) {
      date = new Date(date);

      const options = {
        timeZone: "Europe/Istanbul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formatted = date
        .toLocaleString("tr-TR", options)
        .replace(/\. /g, ".")
        .replace(",", "");

      return formatted;
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
