<template>
  <div class="row">
    <q-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-table
        flat
        dense
        bordered
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
              {{ $t("advancedSettings") }}
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

        <!-- value kolonuna özel slot -->
        <template v-slot:body-cell-value="props">
          <q-td :props="props">
            <!-- Eğer değer boolean ise toggle göster -->
            <template
              v-if="
                props.row.value === 'TRUE' ||
                props.row.value === 'FALSE' ||
                props.row.value === 'False'
              "
            >
              <q-toggle
                :model-value="toBoolean(props.row.value)"
                dense
                color="secondary"
                checked-icon="check"
                unchecked-icon="close"
                :disable="props.row.readonly"
                @update:model-value="onToggleChange(props.row)"
              />
            </template>

            <!-- Değer boolean değilse normal text göster -->
            <template v-else>
              <q-input
                v-model="props.row.value"
                type="text"
                dense
                borderless
                :disable="props.row.readonly"
                @update:v-model="(val) => (props.row.value = val)"
              />
            </template>
          </q-td>
        </template>

        <!-- İşlemler Butonları -->
        <template #body-cell-action="props">
          <q-td :props="props">
            <q-btn
              v-if="!props.row.readonly"
              flat
              dense
              color="white"
              :label="$t('edit')"
              class="text-capitalize bg-secondary q-pa-xs"
              @click="onSubmit(props.row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                >{{ $t("edit") }}</q-tooltip
              >
            </q-btn>
          </q-td>
        </template>
        <template v-slot:item="props">
          <div
            class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3"
            :style="props.selected ? 'transform: scale(0.95);' : ''"
          ></div>
        </template>

        <template v-slot:no-data="{ icon, message, filter }">
          <div class="full-width row flex-center q-gutter-sm">
            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
            <span> {{ message }}... </span>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "StationAdvancedSettingsForm",
  setup(props, { emit }) {
    let formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode == "add") {
      formModel.value.isActive = true;
    }

    return { formModel };
  },
  emits: ["completed"],
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    mode: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      rows: [],
      filter: "",
      pagination: { rowsPerPage: 20 },
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "key",
          label: this.$t("station.key"),
          field: "key",
          align: "left",
          sortable: true,
          headerStyle: "width: 40%;",
        },
        {
          name: "value",
          label: this.$t("station.value"),
          field: "value",
          align: "left",
          sortable: true,
        },
        {
          name: "action",
          label: this.$t("action"),
          field: (row) => row,
          align: "center",
        },
      ];
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      try {
        this.getList();
      } catch (error) {
        this.$logger.error("StationAdvancedSettingsForm init", error);
      }
    },

    async getList() {
      try {
        const body = {};
        const response = await this.$api.post(
          `sas/remoteGetConfiguration/${this.formModel.code}`,
          body
        );

        this.rows = response.data.data.configurationKey;
      } catch (error) {
        this.$logger.error("Hata", error);
      }
    },

    async onSubmit(row) {
      try {
        delete row.readonly;
        this.$logger.log("put configurationKeys", row);
        const response = await this.$api.post(
          `sas/remoteChangeConfiguration/${this.formModel.code}`,
          row
        );
        if (response.data.data.status == 200) {
          this.$q.notify({
            type: "positive",
            message: `${row.key} ${this.$t("updated")}`,
          });
          this.getList();
          this.$emit("completed");
        } else
          this.$q.notify({ type: "negative", message: this.$t("apierror") });
      } catch (error) {
        this.$logger.error("Fiyat düzenlenirken hata:", error);
      }
    },

    // Gerçek boolean dönüştürme
    toBoolean(val) {
      try {
        if (val === true || val === "TRUE" || val === "true") {
          return true;
        } else if (
          val === false ||
          val === "FALSE" ||
          val === "False" ||
          val === "false"
        ) {
          return false;
        }
      } catch (error) {}
    },

    onToggleChange(row) {
      try {
        // Toggle değiştiğinde satırı güncelle
        row.value = this.toBoolean(row.value) ? "FALSE" : "TRUE";
      } catch (error) {
        this.$logger.error("Hata", error);
      }
    },
  },
});
</script>
