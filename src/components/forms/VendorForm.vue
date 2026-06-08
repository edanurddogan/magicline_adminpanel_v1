<template>
  <div>
    <q-card>
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-avatar size="150px">
                <img src="src/assets/logo/infaura_trn.png" />
              </q-avatar>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-uploader
                :style="{
                  display: mode === 'details' ? 'none' : 'block',
                }"
                url="http://localhost:4444/upload"
                :headers="[
                  { name: 'X-Custom-Timestamp', value: 1550240306080 },
                ]"
                :label="$t('offices.uploadlogo')"
                style="max-width: 200px"
                class="q-pa-xs"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                :label="$t('offices.firmtitle')"
                v-model="office.officeName"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                :label="$t('offices.firmtitle')"
                v-model="office.commercialTitle"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                :label="$t('offices.email')"
                v-model="office.email"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                :label="$t('offices.phone')"
                v-model="office.phone1"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                :label="$t('offices.phone')"
                v-model="office.phone2"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                :label="$t('office.website')"
                v-model="office.website"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                autogrow
                :label="$t('offices.address')"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                :label="$t('offices.city')"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                :label="$t('offices.state')"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                :label="$t('offices.postalcode')"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                :label="$t('offices.taxoffice')"
                v-model="office.taxOffice"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                :label="$t('offices.taxnumber')"
                v-model="office.taxNumber"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                class="q-pa-xs"
                type="textarea"
                :label="$t('offices.about')"
                v-model="office.note"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-toggle
                class="q-pa-sm col-lg-12 col-md-12 col-sm-12 col-xs-12"
                :label="$t('offices.einvoice')"
                v-model="office.firmEInvoice"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
                :disable="mode === 'details'"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-toggle
                :style="{
                  visibility: mode === 'details' ? 'hidden' : 'visible',
                }"
                class="q-pa-sm col-lg-12 col-md-12 col-sm-12 col-xs-12"
                :label="$t('offices.status')"
                v-model="office.isActive"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
                :disable="mode === 'details'"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-lg">
        <q-btn
          class="text-capitalize bg-info q-pa-lg"
          :style="{
            display: mode === 'details' ? 'none' : 'block',
          }"
          @click="onSubmit"
        >
          {{ $t("headquarters.savedata") }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  setup(props, { emit }) {
    const office = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    return { office };
  },
  emits: ["completed"],
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
  methods: {
    onSubmit() {
      if (this.mode === "add") {
        this.$logger.log("add");
        this.add();
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.edit();
      }
    },
    async add() {
      const response = this.$api
        .post("Firm/PostFirm/", JSON.stringify(this.office))
        .then(() => {
          this.$logger.log(response.data);
          this.$logger.log("add completed");

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: "Başarılı",
            caption: $t("success"),
          });

          this.$emit("completed");
        });
    },
    async edit() {
      const response = this.$api
        .put("Firm/PutFirm/", JSON.stringify(this.office))
        .then(() => {
          this.$logger.log(response.data);
          this.$logger.log("edit completed");

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: "Başarılı",
            caption: "success",
          });

          this.$emit("completed");
        });
    },
  },
});
</script>
