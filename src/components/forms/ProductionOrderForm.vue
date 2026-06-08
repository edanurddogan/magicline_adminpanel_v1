<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("production.productioninfo") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('production.productionno')"
                  v-model="formModel.productionNo"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  :disable="mode === 'details'"
                  :label="$t('products.productiondate')"
                  v-model="formModel.productionDate"
                  mask="date"
                  :rules="['date']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer q-pa-sm">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="formModel.productionDate"
                          first-day-of-week="1"
                        >
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
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  disable
                  :label="$t('production.productionstartdate')"
                  v-model="formModel.productionStartDate"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  disable
                  :label="$t('production.productionFinishDate')"
                  v-model="formModel.productionFinishDate"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  type="number"
                  :disable="mode === 'details'"
                  :label="$t('production.productionpiece')"
                  v-model="formModel.piece"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  disable
                  :label="$t('products.stockcode')"
                  v-model="formModel.stockCard.stockCode"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  disable
                  :label="$t('products.productname')"
                  v-model="formModel.stockCard.stockName"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  disable
                  :label="$t('products.unit')"
                  v-model="formModel.stockCard.unit.name"
                />
              </q-item-section>
            </q-item>
            <q-item
              class="col-lg-3 col-md-3 col-sm-6 col-xs-12"
              v-if="formModel.stockCard.serialNumberTracking"
            >
              <q-item-section>
                <q-checkbox
                  dense
                  disable
                  v-model="formModel.stockCard.serialNumberTracking"
                  :label="
                    formModel.stockCard.serialNumberTracking
                      ? $t('products.serialnumbertracking')
                      : ''
                  "
                  checked-icon="task_alt"
                  unchecked-icon="highlight_off"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-toggle
                  dense
                  class="q-pa-sm col-lg-12 col-md-12 col-sm-12 col-xs-12"
                  :label="$t('status')"
                  v-model="formModel.isActive"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="cancel"
                  :disable="mode === 'details'"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <!--<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t('production.productionreport') }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list class="row">
            <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input
                  dense
                  :disable="mode === 'details'"
                  :label="$t('production.productionno')"
                  v-model="formModel.productionNo"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>-->

    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("products.products") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-list class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item>
              <q-item-section>
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
                  :no-data-label="$t('nodatalabel')"
                  :no-results-label="$t('noresultslabel')"
                  row-key="id"
                  :visible-columns="visibleColumns"
                >
                  <template v-slot:top="props">
                    <div class="row col-12">
                      <div
                        class="col-lg-2 col-md-3 col-sm-12 col-xs-12 q-table__title"
                      >
                        {{ $t("pages.products") }}
                      </div>
                      <q-input
                        class="col-lg-3 col-md-3 col-sm-12 col-xs-12"
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
                        </template> </q-input
                      ><q-space />
                      <!--<q-btn
                        flat
                        round
                        dense
                        icon="add"
                        class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                        @click="onAdd"
                      />

                      <q-space />-->
                      <q-btn
                        flat
                        round
                        dense
                        icon="refresh"
                        class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
                        @click="getList"
                      >
                        <q-tooltip>
                          {{ $t("refresh") }}
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        dense
                        :icon="
                          props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                        "
                        @click="props.toggleFullscreen"
                        class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                      />
                      <q-btn
                        flat
                        round
                        dense
                        :icon="isGrid ? 'list' : 'grid_on'"
                        @click="isGrid = !isGrid"
                        class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                      >
                        <q-tooltip v-close-popup>{{
                          isGrid ? "List" : "Grid"
                        }}</q-tooltip>
                      </q-btn>
                    </div>
                  </template>

                  <template #body-cell-productionstatus="props">
                    <q-td :props="props">
                      <q-chip
                        :color="props.row.productionOrderDetailStatus.color"
                        text-color="white"
                        dense
                        class="text-weight-bolder"
                        square
                        >{{ props.row.productionOrderDetailStatus.name }}
                      </q-chip>
                    </q-td>
                  </template>

                  <template #body-cell-status="props">
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
                    <q-td :props="props">
                      <q-btn
                        flat
                        round
                        color="primary"
                        icon="visibility"
                        @click="onViewDetail(props.row)"
                      />
                      <!--<q-btn
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
                      />-->
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
                                :color="
                                  props.row.isActive === true ? 'green' : 'red'
                                "
                                text-color="white"
                                dense
                                class="text-weight-bolder"
                                square
                                >{{
                                  props.row.isActive
                                    ? $t("active")
                                    : $t("inactive")
                                }}
                              </q-chip>

                              <q-chip
                                v-else-if="col.name === 'productionstatus'"
                                :color="
                                  props.row.productionOrderDetailStatus.color
                                "
                                text-color="white"
                                dense
                                class="text-weight-bolder"
                                square
                                >{{
                                  props.row.productionOrderDetailStatus.name
                                }}
                              </q-chip>

                              <q-item-section
                                v-else-if="col.name === 'action'"
                                class="row"
                              >
                                <div class="row">
                                  <q-btn
                                    flat
                                    round
                                    color="primary"
                                    icon="visibility"
                                    @click="onViewDetail(props.row)"
                                  />
                                  <!--<q-btn
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
                                  />-->
                                </div>
                              </q-item-section>

                              <q-item-label v-else caption
                                ><p class="">
                                  {{ col.value }}
                                </p></q-item-label
                              >
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card>
                    </div>
                  </template>

                  <template v-slot:no-data="{ icon, message, filter }">
                    <div class="full-width row flex-center q-gutter-sm">
                      <q-icon
                        size="2em"
                        :name="filter ? 'filter_b_and_w' : icon"
                      />
                      <span> {{ message }}... </span>
                    </div>
                  </template>
                </q-table>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-actions>
      </q-card>
    </div>

    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-actions>
          <q-space />
          <q-btn
            color="secondary"
            :label="$t('savedata')"
            icon-right="send"
            text-color="white"
            :style="{
              display: mode === 'details' ? 'none' : '',
              width: '150px',
            }"
            @click="save"
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>

  <!-- ProductiondetailMovement Form Dialog -->
  <q-dialog
    v-model="productionOrderDetailMovementsformVisible"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 90vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-lg">
          <q-icon name="category" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{
              $t("production.production")
            }}</span>
            {{ $t(currentMode) }}</q-toolbar-title
          >

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 85vh" class="scroll q-pa-sm">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-card-section class="bg-primary text-white">
              <div>{{ $t("products.products") }}</div>
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-list class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item>
                  <q-item-section>
                    <q-table
                      flat
                      bordered
                      :grid="isGrid"
                      :hide-header="isGrid"
                      :rows="movementsRows"
                      :columns="columnsMovemets"
                      :loading="loadingMovemets"
                      :filter="filterMovemets"
                      :loading-label="$t('loading')"
                      :no-data-label="$t('nodatalabel')"
                      :no-results-label="$t('noresultslabel')"
                      row-key="id"
                    >
                      <template v-slot:top="props">
                        <div class="row col-12">
                          <div
                            class="col-lg-2 col-md-6 col-sm-12 col-xs-12 q-table__title"
                          >
                            {{ $t("production.transactionsMade") }}
                          </div>
                          <q-space />
                          <q-input
                            class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
                            bottom-slots
                            dense
                            debounce="300"
                            v-model="filter"
                            :placeholder="$t('search')"
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
                          <q-btn
                            flat
                            round
                            dense
                            :icon="
                              props.inFullscreen
                                ? 'fullscreen_exit'
                                : 'fullscreen'
                            "
                            @click="props.toggleFullscreen"
                            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                          />
                          <q-btn
                            flat
                            round
                            dense
                            :icon="isGrid ? 'list' : 'grid_on'"
                            @click="isGrid = !isGrid"
                            class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                          >
                            <q-tooltip v-close-popup>{{
                              isGrid ? "List" : "Grid"
                            }}</q-tooltip>
                          </q-btn>
                        </div>
                      </template>

                      <template #body-cell-addRemoveProcess="props">
                        <q-td :props="props">
                          <q-icon
                            v-if="props.row.addRemoveProcess"
                            :name="
                              props.row.addRemoveProcess == 'added'
                                ? 'add_circle_outline'
                                : props.row.addRemoveProcess == 'removed'
                                ? 'remove_circle_outline'
                                : props.row.addRemoveProcess == 'repaired'
                                ? 'auto_fix_high'
                                : ''
                            "
                            :style="{
                              color:
                                props.row.addRemoveProcess == 'added'
                                  ? 'green'
                                  : props.row.addRemoveProcess == 'removed'
                                  ? 'red'
                                  : props.row.addRemoveProcess == 'repaired'
                                  ? 'blue'
                                  : '#fff',
                            }"
                            style="font-size: 1.6em"
                          />
                          {{ $t(props.row.addRemoveProcess) }}
                        </q-td>
                      </template>

                      <template v-slot:item="props">
                        <div
                          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                          :style="
                            props.selected ? 'transform: scale(0.95);' : ''
                          "
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
                                    :color="
                                      props.row.isActive === true
                                        ? 'green'
                                        : 'red'
                                    "
                                    text-color="white"
                                    dense
                                    class="text-weight-bolder"
                                    square
                                    >{{
                                      props.row.isActive
                                        ? $t("active")
                                        : $t("inactive")
                                    }}
                                  </q-chip>

                                  <q-item-section
                                    v-else-if="col.name === 'addRemoveProcess'"
                                    class="row"
                                  >
                                    <div class="row">
                                      <q-icon
                                        v-if="props.row.order.buysell"
                                        :name="
                                          props.row.order.buysell == 'Satış'
                                            ? 'arrow_upward'
                                            : props.row.order.buysell == 'Alış'
                                            ? 'arrow_downward'
                                            : ''
                                        "
                                        :style="{
                                          color:
                                            props.row.order.buysell == 'Satış'
                                              ? '#24792E'
                                              : props.row.order.buysell ==
                                                'Alış'
                                              ? '#FF7100'
                                              : '#fff',
                                        }"
                                        style="font-size: 1.6em"
                                      />
                                      {{ props.row.order.buysell }}
                                    </div>
                                  </q-item-section>
                                  <!--<q-item-section
                                v-else-if="col.name === 'action'"
                                class="row"
                              >
                                <div class="row">
                                  <q-btn
                                    dense
                                    flat
                                    round
                                    color="primary"
                                    icon="info"
                                    @click="onView(props.row)"
                                  />
                                  <q-btn
                                    dense
                                    flat
                                    round
                                    color="secondary"
                                    icon="edit"
                                    @click="onEdit(props.row)"
                                  />
                                  <q-btn
                                    dense
                                    flat
                                    round
                                    color="negative"
                                    icon="delete_forever"
                                    @click="onDelete(props.row)"
                                  />
                                </div>
                              </q-item-section>-->

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
                          <q-icon
                            size="2em"
                            :name="filter ? 'filter_b_and_w' : icon"
                          />
                          <span> {{ message }}... </span>
                        </div>
                      </template>
                    </q-table>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-actions>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Delete Dialog -->
  <q-dialog v-model="deleteConfirm" persistent>
    <q-card class="q-ma-xs">
      <q-card-section class="items-center row">
        <q-avatar icon="person_off" color="negative" text-color="white" />&nbsp;
        &nbsp; &nbsp; &nbsp;
        <h5>{{ $t("products.deleteconfirm") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>{{ $t("products.barcode") }} : {{ currentRow.barcode }}</p>
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
          v-on:click="rowDelete()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar, date } from "quasar";

export default defineComponent({
  name: "ProductionOrderForm",
  components: {},
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
  computed: {
    columns() {
      return [
        {
          name: "productionbarcode",
          label: this.$t("production.productionbarcode"),
          align: "left",
          field: (row) => row.productionBarcode,
          sortable: true,
        },
        {
          name: "productserialno",
          label: this.$t("production.serialno"),
          align: "left",
          field: (row) => row.serialno,
          sortable: true,
          visibleColumns: this.formModel.stockCard.serialNumberTracking,
        },
        {
          name: "productionstartdate",
          label: this.$t("production.productionstartdate"),
          align: "left",
          field: (row) =>
            date.formatDate(row.productionStartDate, "YYYY-MM-DD"),
          sortable: true,
        },
        {
          name: "productionFinishDate",
          label: this.$t("production.productionFinishDate"),
          align: "left",
          field: (row) =>
            date.formatDate(row.productionFinishDate, "YYYY-MM-DD"),
          sortable: true,
        },
        {
          name: "detail",
          label: this.$t("production.productiondetail"),
          align: "left",
          field: (row) => row.detail,
          sortable: true,
        },
        {
          name: "productionstatus",
          label: this.$t("production.productionstatus"),
          align: "left",
          field: (row) => row.productionOrderDetailStatus.name,
          sortable: true,
        },
        {
          name: "completionrate",
          label: this.$t("production.completionrate"),
          field: (row) => "0 %",
          align: "center",
        },

        /*{
          name: 'status',
          align: 'center',
          label: this.$t('status'),
          field: 'isActive',
          sortable: true,
        },*/
        {
          name: "action",
          align: "center",
          label: this.$t("action"),
          field: "",
        },
      ];
    },
    columnsMovemets() {
      return [
        {
          name: "addRemoveProcess",
          label: this.$t("production.addremoveprocess"),
          align: "left",
          field: (row) => row.addRemoveProcess,
          sortable: true,
        },
        {
          name: "productionProcess",
          label: this.$t("production.productionProcess"),
          align: "left",
          field: (row) => row.productionOrderDetailStatus.name,
          sortable: true,
        },
        {
          name: "stockcode",
          label: this.$t("products.stockcode"),
          align: "left",
          field: (row) => row.addedRemovedProduct?.stockName,
          sortable: true,
        },
        {
          name: "serialNo",
          label: this.$t("products.serialNo"),
          align: "left",
          field: (row) => row.addedRemovedProductSerialNo?.serialNo,
          sortable: true,
        },
        {
          name: "piece",
          label: this.$t("products.piece"),
          align: "center",
          field: (row) => row.piece,
          sortable: true,
        },
        {
          name: "employee",
          label: this.$t("users.employee"),
          align: "left",
          field: (row) => row.employee.name,
          sortable: true,
        },
        {
          name: "detail",
          label: this.$t("detail"),
          align: "left",
          field: (row) => row.detail,
          sortable: true,
        },
        {
          name: "transactionDate",
          label: this.$t("production.transactionDate"),
          align: "left",
          field: (row) => row.createdAt,
          sortable: true,
        },
        /*{
          name: 'status',
          name: 'status',
          align: 'center',
          label: this.$t('status'),
          field: 'isActive',
          sortable: true,
        },
        {
          name: 'action',
          align: 'center',
          label: this.$t('action'),
          field: '',
        },*/
      ];
    },
  },
  data() {
    return {
      loading: true,
      loadingMovemets: false,
      rows: [],
      movementsRows: [],
      selectedId: 0,
      productionOrderDetailMovementsformVisible: false,
      formVisible: false,
      deleteConfirm: false,
      currentMode: "add",
      currentRow: null,
      maximizedToggle: false,
      filter: "",
      filterMovemets: "",
      isGrid: false,
      visibleColumns: [],
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
      if (this.formModel.id) {
        this.getList();
      }

      if (this.formModel.productionStartDate) {
        this.formModel.productionStartDate = date.formatDate(
          this.formModel.productionStartDate,
          "YYYY-MM-DD"
        );
        this.$logger.log(this.formModel.productionStartDate);
      }

      if (this.formModel.productionFinishDate) {
        this.formModel.productionFinishDate = date.formatDate(
          this.formModel.productionFinishDate,
          "YYYY-MM-DD"
        );
      }
      this.loading = false;

      this.columns.forEach((c) => {
        if (c.name == "productserialno") {
          if (this.formModel.stockCard.serialNumberTracking) {
            this.visibleColumns.push(c.name);
          }
        } else {
          this.visibleColumns.push(c.name);
        }
      });
      this.$logger.log("visibleColumns", this.visibleColumns);
      //this.getList();
      /*if (this.formModel.productionDate) {
        this.formModel.productionDate = new Date(
          this.formModel.productionDate
        ).toISOString();
      }
      try {
        if (this.formModel?.id) {
          const response = await this.$api.get(
            'getProductionById/' + this.formModel.id
          );
          this.$logger.log('getProductionById/', response?.data);
          this.formModel = response?.data;
          this.loading = false;
        }
      } catch (error) {}*/
    },
    async getList() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "getProductionOrderDetailList/" + this.formModel.id
        );
        this.rows = response?.data;

        // this.formModel.order.orderDate = date.formatDate(
        //   this.formModel.order.orderDate,
        //   'YYYY-MM-DD'
        // );
        // this.formModel.order.dispatchDate = date.formatDate(
        //   this.formModel.order.dispatchDate,
        //   'YYYY-MM-DD'
        // );

        this.$logger.log("rows: ", this.rows);
        this.loading = false;
        //this.tutarBilgileri();
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getDetailList() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "getProductionOrderDetailList/" + this.formModel.id
        );
        this.rows = response?.data;

        // this.formModel.order.orderDate = date.formatDate(
        //   this.formModel.order.orderDate,
        //   'YYYY-MM-DD'
        // );
        // this.formModel.order.dispatchDate = date.formatDate(
        //   this.formModel.order.dispatchDate,
        //   'YYYY-MM-DD'
        // );

        this.$logger.log("rows: ", this.rows);
        this.loading = false;
        this.tutarBilgileri();
      } catch (error) {
        this.$logger.log(error);
      }
    },

    async onViewDetail(detail) {
      this.loadingMovemets = true;
      this.productionOrderDetailMovementsformVisible = true;
      this.currentRow = detail;
      this.$logger.log("detail", detail);

      const response = await this.$api
        .get("getproductionOrderDetailMovements/" + detail.id)
        .then((itemsMovement) => {
          this.movementsRows = itemsMovement.data;
          this.$logger.log("data", itemsMovement.data);
          this.$logger.log("movementsRows", this.movementsRows);
        });

      this.loadingMovemets = false;
    },

    onSubmit() {},

    save() {
      if (this.mode === "add") {
        this.$logger.log("add");
        this.addFormModel();
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.editFormModel();
      }
    },
    async getproductionOrderDetailMovements() {},

    async addFormModel() {
      const _response = this.$api
        .post("productionOrder", JSON.stringify(this.formModel))
        .then((response) => {
          this.$logger.log(response.data);
          this.$logger.log("add completed");
          this.formModel = response.data;
          this.$logger.log(this.formModel);
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("success"),
            caption: this.$t("success"),
          });
          this.$emit("completed");
        });
    },

    async editFormModel() {
      const response = this.$api
        .put("productionOrder", JSON.stringify(this.formModel))
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
        });
    },

    async getStockType() {
      const response = this.$api.get("stockTypes").then((data) => {
        this.$logger.log(data.data);
        this.stockType = data.data;
        if (this.formModel.stockType) this.selectedStockType();
      });
    },

    async selectedStockType() {
      var sType = this.stockType.find((b) => {
        return b.stockType === this.formModel.stockType.name;
      });
    },

    async getBrands() {
      const response = this.$api.get("brands").then((data) => {
        this.$logger.log(data.data);
        this.brandsFull = data.data;
        if (this.formModel.brand) this.selectedBrand();
      });
    },

    filterBrands(val, update) {
      if (val === "") {
        update(() => {
          this.brandsFiltered = this.brandsFull;
        });
        return;
      }

      update(() => {
        this.brandsFiltered = this.brandsFull.filter((v) =>
          this.$normalizeTurkishString(v.name).includes(
            this.$normalizeTurkishString(val)
          )
        );
      });
    },

    async selectedBrand() {
      this.$logger.log(this.brandsFull);
      this.$logger.log(this.formModel.brand.name);
      var sBrand = this.brandsFull.find((b) => {
        return b.name === this.formModel.brand.name;
      });
      this.getModels(sBrand.id);
    },

    async formatDate(_date) {
      this.$logger.log("_date", _date);
      var newDate = date.formatDate(_date, "YYYY-MM-DD");
      this.$logger.log("newDate", newDate);
      return newDate;
    },
  },
});
</script>
