<template>
  <div class="row">
    <q-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card-section class="bg-primary text-white">
        {{ $t("discountList.campaignInfo") }}
      </q-card-section>
      <q-card-section>
        <q-list class="row">
          <!-- Kampanya Prefix -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                ref="prefixRef"
                v-model="formModel.prefix"
                type="text"
                :label="$t('discountList.campaignPrefix')"
                :disable="mode === 'details'"
                outlined
                dense
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="lists" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <!-- Fiyat -->
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                ref="pieceRef"
                v-model="formModel.piece"
                type="number"
                :label="$t('production.productionpiece')"
                :disable="mode === 'details'"
                outlined
                dense
                :rules="[(val) => !!val || $t('requiredlabel')]"
              >
                <template #prepend>
                  <q-icon name="pin" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions class="q-pr-lg justify-end">
        <q-btn class="text-capitalize bg-info q-pa-lg" @click="onSubmit">
          {{ $t("send") }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "ChampaignForm",
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
      formModel: {
        id: null,
        prefix: "",
        piece: null,
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      try {
        this.$logger.log("campaign formModel", this.formModel);
      } catch (error) {
        this.$logger.error("CampaignForm init", error);
      }
    },

    async onSubmit() {
      try {
        const isValid =
          (await this.$refs.prefixRef?.validate?.()) &&
          (await this.$refs.pieceRef?.validate?.());

        if (!isValid) {
          this.$q.notify({
            type: "negative",
            message: this.$t("region.formValidationError"),
          });
          return;
        }
        if (this.mode === "add") {
          //this.addFormModel();
        } else {
          //this.editFormModel();
        }
      } catch (error) {
        this.$logger.error("Hata onSubmit:", error);
      }
    },

    async addFormModel() {
      try {
        const response = await this.$api.post(
          "createChargePriceList",
          this.formModel,
        );
        if (response.status == 200) {
          this.$q.notify({
            type: "positive",
            message: `${this.$t("priceList.price")} ${this.$t("added")}`,
          });
          this.$emit("completed");
        } else
          this.$q.notify({ type: "negative", message: this.$t("apierror") });
      } catch (error) {
        this.$logger.error("Fiyat eklenirken hata:", error);
      }
    },
    async editFormModel() {
      try {
        const response = await this.$api.put(
          "updateChargePriceList",
          this.formModel,
        );
        if (response.status == 200) {
          this.$q.notify({
            type: "positive",
            message: `${this.$t("priceList.price")} ${this.$t("updated")}`,
          });
          this.$emit("completed");
        } else
          this.$q.notify({ type: "negative", message: this.$t("apierror") });
      } catch (error) {
        this.$logger.error("Fiyat düzenlenirken hata:", error);
      }
    },
  },
});
</script>
