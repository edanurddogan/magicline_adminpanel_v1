<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("station.connectorType") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list class="row">
            <!-- Konnektör Adı -->
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  ref="nameRef"
                  v-model="formModel.name"
                  dense
                  debounce="300"
                  clearable
                  outlined
                  :placeholder="$t('station.connectorName')"
                  :disable="mode === 'details'"
                  :rules="[(val) => !!val || $t('requiredlabel')]"
                >
                </q-input>
              </q-item-section>
            </q-item>
            <!-- Konnektör Açıklama -->
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  v-model="formModel.description"
                  dense
                  debounce="300"
                  clearable
                  outlined
                  :placeholder="$t('description')"
                  :disable="mode === 'details'"
                >
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions class="q-pr-lg justify-between">
          <q-toggle
            class="col-lg-1 col-md-1 col-sm-1 col-xs-11"
            :label="formModel.isActive === true ? $t('active') : $t('inactive')"
            color="green"
            checked-icon="check"
            unchecked-icon="cancel"
            :disable="mode === 'details'"
            v-model="formModel.isActive"
          />
          <q-btn
            class="text-capitalize bg-info q-pa-lg"
            :style="{ display: mode === 'details' ? 'none' : 'block' }"
            @click="onSubmit"
          >
            {{ mode === "edit" ? $t("updatedata") : $t("savedata") }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "ConnectorTypeForm",
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
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},

    async onSubmit() {
      try {
        const isValid = this.$refs.nameRef?.validate?.();

        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }

        let response;
        if (this.mode === "add") {
          response = await this.$api.post(
            "stationConnectorTypes",
            this.formModel,
          );
        } else {
          response = await this.$api.put(
            "stationConnectorTypes",
            this.formModel,
          );
        }
        if (response.status === 200)
          this.$q.notify({
            type: "positive",
            message: this.mode == "add" ? this.$t("saved") : this.$t("updated"),
          });

        this.$emit("completed", this.formModel);
      } catch (error) {}
    },
  },
});
</script>
