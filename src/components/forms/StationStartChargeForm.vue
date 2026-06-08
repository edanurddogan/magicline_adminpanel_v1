<template>
  <q-card style="min-width: 35vw; max-height: 70vh">
    <q-card-section class="q-pa-none">
      <q-bar class="q-pa-md">
        <q-icon name="person" />
        <q-toolbar-title>
          <span class="text-weight-bold">{{ $t("station.chargeStart") }}</span>
        </q-toolbar-title>

        <q-btn
          dense
          flat
          icon="close_fullscreen"
          @click="emit('update:maximized', false)"
          :disable="!maximized"
        />
        <q-btn
          dense
          flat
          icon="open_in_full"
          @click="emit('update:maximized', true)"
          :disable="maximized"
        />
        <q-btn dense flat icon="close" @click="onClose" v-close-popup />
      </q-bar>
    </q-card-section>

    <q-card-section>
      <q-item class="justify-center q-pb-xl">
        <q-select
          ref="plateRef"
          v-model="localModel.plate"
          :options="filteredVehicles"
          option-value="id"
          option-label="licensePlate"
          :label="$t('station.userAndVehicleInfo')"
          options-dense
          map-options
          clearable
          outlined
          dense
          use-input
          @filter="filterVehicles"
          @update:model-value="onChangeVehicle"
          :rules="[(val) => !!val || $t('requiredlabel')]"
          style="width: 80%"
        >
          <template #prepend>
            <q-icon name="11mp" />
          </template>

          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.licensePlate }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  {{
                    scope.opt.customer
                      ? scope.opt.customer?.name +
                        " " +
                        scope.opt.customer?.surname
                      : scope.opt.dealer?.name +
                        " - " +
                        scope.opt.vehicleFleet?.name
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <template #selected-item="scope">
            <span>
              {{ scope.opt.licensePlate }} —
              {{
                scope.opt.customer
                  ? scope.opt.customer?.name + " " + scope.opt.customer?.surname
                  : scope.opt.dealer?.name +
                    " - " +
                    scope.opt.vehicleFleet?.name
              }}
            </span>
          </template>
        </q-select>
      </q-item>
    </q-card-section>

    <q-card-actions class="justify-center">
      <q-item>
        <q-btn
          color="secondary"
          :label="$t('station.chargeStart')"
          icon="play_circle"
          @click="onConfirm"
        />
      </q-item>
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "StationStartChargeForm",
  emits: ["confirm", "close", "update:modelValue", "update:maximized"],
  props: {
    modelValue: { type: Object, default: () => ({ plate: null }) },
    vehicles: { type: Array, default: () => [] },
    maximized: { type: Boolean, default: false },
  },
  data() {
    return {
      filteredVehicles: [],
      localModel: { plate: null },
    };
  },
  watch: {
    vehicles: {
      immediate: true,
      handler(val) {
        this.filteredVehicles = Array.isArray(val) ? val : [];
      },
    },
    modelValue: {
      immediate: true,
      deep: true,
      handler(val) {
        this.localModel = { plate: val?.plate ?? null };
      },
    },
  },
  methods: {
    emitUpdate() {
      this.$emit("update:modelValue", {
        ...this.modelValue,
        plate: this.localModel.plate,
      });
    },

    filterVehicles(val, update) {
      const source = Array.isArray(this.vehicles) ? this.vehicles : [];
      const normalizedVal = this.$normalizeTurkishString(val || "");

      update(() => {
        if (!val) {
          this.filteredVehicles = source;
          return;
        }

        this.filteredVehicles = source.filter((vehicle) => {
          const plate = this.$normalizeTurkishString(
            vehicle.licensePlate || "",
          );
          const name = this.$normalizeTurkishString(
            vehicle.customer?.name || "",
          );
          const surname = this.$normalizeTurkishString(
            vehicle.customer?.surname || "",
          );
          const fullName = `${name} ${surname}`.trim();

          return (
            plate.includes(normalizedVal) ||
            name.includes(normalizedVal) ||
            surname.includes(normalizedVal) ||
            fullName.includes(normalizedVal)
          );
        });
      });
    },

    async onConfirm() {
      const isValid = await this.$refs.plateRef?.validate?.();
      if (!isValid) {
        this.$q.notify({
          type: "negative",
          message: this.$t("region.formValidationError"),
        });
        return;
      }

      this.emitUpdate();
      this.$emit("confirm");
    },

    onClose() {
      this.$emit("close");
    },

    onChangeVehicle() {
      this.emitUpdate();
    },
  },
});
</script>
