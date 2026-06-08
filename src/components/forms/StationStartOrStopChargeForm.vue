<template>
  <q-card
    class="q-pa-md position-relative"
    :class="{ 'dialog-disabled': isStartProcessing }"
  >
    <div
      v-if="isStartProcessing"
      class="dialog-dark-overlay column flex-center"
    >
      <q-spinner color="white" size="40px" />
    </div>

    <q-card-section class="text-center">
      <q-avatar
        size="56px"
        :icon="modeProps[currentMode].icon"
        :color="modeProps[currentMode].color"
        text-color="white"
      />
    </q-card-section>

    <q-card-section>
      <div
        class="text-h5 text-weight-bold q-mb-sm text-center"
        :class="modeProps[currentMode].headerColor"
      >
        {{ modeProps[currentMode].header }}
      </div>

      <div class="text-subtitle1">
        {{ $t("station.connectorCode") }} : <b>{{ connector?.code || "-" }}</b>
      </div>

      <div class="text-subtitle1">
        {{ $t("users.username") }} :
        <b>{{ plate?.customer?.name }} {{ plate?.customer?.surname }}</b>
      </div>

      <div class="text-subtitle1">
        {{ $t("vehicle.licensePlate") }} :
        <b>{{ plate?.licensePlate || "-" }}</b>
      </div>
    </q-card-section>

    <q-card-actions align="around">
      <q-btn
        :label="$t('cancel')"
        color="red"
        :disable="isStartProcessing"
        @click="$emit('close')"
        v-close-popup
      />

      <q-btn
        v-if="currentMode === 'stop'"
        :label="$t('station.forceStop')"
        color="warning"
        @click="$emit('forceStop')"
      />
      <q-btn
        v-if="currentMode === 'stop'"
        :label="$t('station.forceStop')"
        color="warning"
        @click="emit('forceStop')"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "StationStartOrStopChargeForm",
  emits: ["confirmStart", "confirmStop", "forceStop", "close"],
  props: {
    currentMode: {
      type: String,
      default: "start", // "start" | "stop"
    },
    connector: {
      type: Object,
      default: () => ({}),
    },
    plate: {
      type: Object,
      default: () => ({}),
    },
    isStartProcessing: {
      type: Boolean,
      default: false,
    },
    isStopProcessing: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    modeProps() {
      return {
        start: {
          icon: "play_circle",
          color: "secondary",
          header: this.$t("station.chargeStart"),
          headerColor: "text-secondary",
        },
        stop: {
          icon: "stop_circle",
          color: "red",
          header: this.$t("station.chargeStop"),
          headerColor: "text-red-8",
        },
      };
    },
  },
  methods: {
    onConfirm() {
      if (this.currentMode === "start") this.$emit("confirmStart");
      else this.$emit("confirmStop");
    },
  },
});
</script>

<style lang="sass">
.dialog-dark-overlay
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: rgba(0, 0, 0, 0.45)
  z-index: 10
  border-radius: 12px
</style>
