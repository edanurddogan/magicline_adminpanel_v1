<template>
  <div class="row">
    <div class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
  </div>

  <!-- Warehouse Form -->
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section>
          <q-list dense bordered>
            <q-card-section class="bg-secondary text-white">
              <div>{{ $t("İstek/ Parça Listesi") }}</div>
            </q-card-section>
            <q-item
              v-for="item in formModel.serviceMaterials"
              :key="item.id"
              clickable
            >
              <q-item-section>
                <q-checkbox
                  dense
                  v-model="selectedItems"
                  :val="item.id"
                  :disable="item.placedInBox == true"
                  :checked="item.placedInBox"
                />
              </q-item-section>
              <q-item-section class="row">
                <q-item-label>{{ item.material?.stockCode }}</q-item-label>
              </q-item-section>
              <q-item-section class="row">
                <q-item-label>{{ item.material?.stockName }}</q-item-label>
              </q-item-section>

              <q-item-section class="row">
                <q-item-label>{{ item.quantity }}</q-item-label>
              </q-item-section>
              <q-item-section class="row">
                <q-item-label>{{ item.material?.unit?.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section class="row items-center q-gutter-sm">
          <q-input
            dense
            filled
            v-model="boxNumber"
            label="Kutu Numarası"
            class="col"
          />
        </q-card-section>

        <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-card-section class="bg-primary text-white">
            <div>{{ $t("technicalService.technicianInformation") }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list v-if="formModel" class="row">
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section v-if="formModel">
                  <q-input
                    disable
                    outlined
                    v-model="formModel.assignedTechnician.name"
                    :label="$t('technicalService.technicianName')"
                    clearable
                  />
                </q-item-section>
              </q-item>

              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section v-if="formModel">
                  <q-input
                    disable
                    outlined
                    v-model="formModel.assignedTechnician.surname"
                    :label="$t('technicalService.technicianSurname')"
                    clearable
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator />
        </q-card>

        <q-card-actions align="right">
          <q-btn
            color="secondary"
            icon-right="send"
            text-color="white"
            :label="$t('save')"
            @click="save"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useQuasar, date, LocalStorage } from "quasar";

export default defineComponent({
  name: "TechnicalServiceWarehouseForm",
  components: {},
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
  setup(props, { emit }) {
    var formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    // Initialize selectedItems based on placedInBox value
    //const selectedItems = computed(() =>
    //  formModel.value.serviceMaterials
    //    .filter((item) => item.placedInBox)
    //    .map((item) => item.id)
    //);
    //
    return {
      formModel,
      //selectedItems,
    };
  },
  data() {
    return {
      processesFormVisibile: false,
      serviceTypesFormVisibile: false,
      faultCodesFormVisibile: false,
      maximizedToggle: false,
      deleteImageFormVisible: false,
      boxNumber: "",
      selectedItems: [],
    };
  },
  mounted() {
    this.$logger.log("mode: ", this.mode);
    this.$logger.log("formModel: ", this.formModel);
    this.init();
  },
  emits: ["completed"],
  methods: {
    init() {
      //formModel.value.serviceMaterials dizindeki placedInBox değeri tru olanları seçiliItems dizisine ekle
      this.selectedItems = this.formModel.serviceMaterials
        .filter((item) => item.placedInBox)
        .map((item) => item.id);
      this.$logger.log("selectedItems", this.selectedItems);
    },
    async save() {
      try {
        this.formModel.serviceMaterials.forEach(async (serviceMaterial) => {
          if (
            this.selectedItems.includes(serviceMaterial.id) &&
            !serviceMaterial.placedInBox
          ) {
            serviceMaterial.boxNumber = this.boxNumber;
            serviceMaterial.placedInBox = true;
            serviceMaterial.placedInBoxDate = new Date();
            serviceMaterial.serviceMaterialStatusId = 3;
            this.$logger.log("serviceMaterial", serviceMaterial);
            this.serviceMaterialUpdate(serviceMaterial);
          }
        });

        //this.formModel.serviceMaterials içindeki item ların her birinin placedInBox değeri true ise tecnicalService durumunu güncelle
        //const placedInBox = this.formModel.serviceMaterials.every(
        //  (serviceMaterial) => serviceMaterial.placedInBox
        //);
        //if (placedInBox) {
        //  this.formModel.technicalServiceStatusId = 2;
        //  this.$api.put("technicalServices", this.formModel);
        //}

        //this.$logger.log("serviceMaterials", this.formModel.serviceMaterials);
        //this.$logger.log("selectedItems", this.selectedItems);
      } catch (error) {
        this.$logger.error("serviceMaterial put error", error);
      }
    },
    async serviceMaterialUpdate(serviceMaterial) {
      try {
        const response = this.$api
          .put("serviceMaterials", serviceMaterial)
          .then((_response) => {
            this.$logger.log("serviceMaterials", _response.data);
            this.$q.notify({
              progress: true,
              type: "info",
              color: "info",
              message: "Parça Listesi Güncellendi" /*this.$t("success")*/,
              caption: this.$t("success"),
            });
            //emit completed
            this.$emit("completed");
          });
      } catch (error) {
        this.$logger.error("serviceMaterial put error", error);
      }
    },
  },
});
</script>

<style scoped>
.q-ma-xs {
  margin: 0.5rem !important;
}
</style>
