<template>
  <div class="row">
    <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card-section class="bg-primary text-white">
        <div>{{ $t("products.stockinfo") }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list class="row">
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('products.productname')"
                v-model="formModel.stockName"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('products.stockcode')"
                v-model="formModel.stockCode"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <q-card class="q-ma-none col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-card-section class="bg-primary text-white">
            <div>{{ $t("production.productionProcessSequence") }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none row">
            <div class="q-ma-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div class="row">
                <div class="col q-mx-md">
                  <h6>{{ $t("production.productionProcesses") }}</h6>
                  <draggable
                    class="draggable-list"
                    :list="processStatusList"
                    group="my-group"
                    v-bind="dragOptions"
                  >
                    <template #item="{ element }">
                      <q-card class="col q-ma-xs q-pa-xs">
                        * {{ element.name }}
                      </q-card>
                    </template>
                  </draggable>
                </div>

                <q-separator vertical />

                <div class="col q-mx-md">
                  <h6>{{ $t("production.productionProcessSequence") }}</h6>
                  <draggable
                    class="list-group q-ma-md"
                    tag="transition-group"
                    group="my-group"
                    v-model="processStatusSequence"
                    v-bind="dragOptions"
                    @start="drag = true"
                    @end="drag = false"
                    item-key="order"
                    @change="processStatusListChange"
                  >
                    <template #item="{ element }">
                      <q-card class="col q-ma-xs q-pa-xs">
                        {{ element.sequence }} -
                        {{
                          element.name
                            ? element.name
                            : element.productionOrderDetailStatus.name
                        }}
                      </q-card>
                    </template>
                  </draggable>
                </div>
              </div>
              <rawDisplayer class="col-3" :value="list" title="List" />
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </div>

  <div class="q-pa-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
    <q-card class="q-pa-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";
import draggable from "vuedraggable";

const $q = useQuasar();
export default defineComponent({
  name: "ProductionProcessSequenceForm",
  display: "Transitions",
  order: 8,
  components: {
    draggable,
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
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
      processStatusList: [],
      processStatusSequence: [],
      drag: false,
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
    this.getProductionProcesses();
    this.getProductionOrderDetailStatusSequences();
    this.$logger.log(this.formModel);
  },
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order);
    },
    async getProductionProcesses() {
      const response = this.$api
        .get("productionOrderDetailStatuses")
        .then((data) => {
          this.processStatusList = data.data;
        })
        .catch((error) => {
          this.$logger.log("error", error);
        });
    },
    async getProductionOrderDetailStatusSequences() {
      const response = await this.$api
        .get("getProductionOrderStatusByStockCardId/" + this.formModel.id)
        .then((response) => {
          this.processStatusSequence = response?.data;
          this.$logger.log(
            "processStatusSequence => ",
            this.processStatusSequence
          );
        })
        .catch(function (error) {
          this.$logger.log("error :", error);
        });
    },
    async postProductionOrderDetailStatusSequences(podssl) {
      const response = await this.$api
        .post("postProductionOrderDetailStatusSequences", podssl)
        .then((response) => {
          this.$logger.log(
            "postProductionOrderDetailStatusSequences => ",
            response
          );
        })
        .catch(function (error) {
          this.$logger.log("error :", error);
        });
    },

    async processStatusListChange() {
      for (let i = 0; i < this.processStatusSequence.length; i++) {
        this.processStatusSequence[i].sequence = i + 1;
        this.processStatusSequence[i].stockCardId = this.formModel.id;
      }

      this.$logger.log(
        "this.processStatusSequence",
        this.processStatusSequence
      );
    },

    async save() {
      if (this.processStatusSequence.length == 0) {
        this.$q.notify({
          progress: true,
          type: "warning",
          color: "warning",
          message: this.$t("production.noProductionProcessSequence"),
          caption: this.$t("unsuccessful"),
        });
      } else {
        var podssl = [];
        this.processStatusSequence.forEach((p) => {
          var podss = {};
          podss.sequence = p.sequence;
          podss.stockCardId = p.stockCardId;
          podss.productionOrderDetailStatusId = p.id;
          podssl.push(podss);
        });
        this.$logger.log("processStatusSequence", podssl);
        this.postProductionOrderDetailStatusSequences(podssl);
      }
    },
  },
});
</script>

<style>
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>
