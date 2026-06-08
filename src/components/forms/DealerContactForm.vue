<template>
  <!-- Yetkili Kişi Ekleme Düzenleme -->
  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
    <q-card
      v-if="formVisible"
      class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-my-md"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card-section class="q-pa-none">
        <q-bar>
          <q-icon name="person" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{
              $t("dealer.contactName")
            }}</span>
            {{ $t(currentMode) }}</q-toolbar-title
          >
          <q-btn dense flat icon="close" @click="formVisible = false">
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-list dense class="row q-mt-sm items-start">
        <!-- Yetkili Kişi Ünvan -->
        <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              v-model="formModel.title"
              :label="$t('users.usertitle')"
              :disable="currentMode === 'details'"
              lazy-rules
              dense
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="badge" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <!-- Yetkili Kişi Adı -->
        <q-item class="col-lg-2 col-md-2 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              ref="nameRef"
              v-model="formModel.name"
              :label="$t('users.name')"
              :disable="currentMode === 'details'"
              :rules="[(val) => !!val || $t('requiredlabel')]"
              lazy-rules
              dense
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <!-- Yetkili Kişi Soyadı -->
        <q-item class="col-lg-2 col-md-2 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              ref="nameRef"
              v-model="formModel.surname"
              :label="$t('users.surname')"
              :disable="currentMode === 'details'"
              :rules="[(val) => !!val || $t('requiredlabel')]"
              lazy-rules
              dense
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <!-- Yetkili Kişi Email -->
        <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              ref="emailRef"
              v-model="formModel.email"
              :label="$t('users.email')"
              :disable="currentMode === 'details'"
              placeholder="example@mail.com"
              :rules="[validateEmail]"
              lazy-rules
              dense
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <!-- Yetkili Kişi Password -->
        <q-item class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
          <q-item-section>
            <q-input
              ref="passwordRef"
              v-model="formModel.password"
              :label="$t('users.password')"
              type="text"
              :disable="currentMode === 'details'"
              :rules="[(val) => !!val || $t('requiredlabel')]"
              lazy-rules
              dense
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <!-- Yetkili Kişi Telefon -->
        <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
          <q-item-section>
            <q-input
              ref="phoneRef"
              v-model="formModel.phone"
              :label="$t('users.phone')"
              :disable="currentMode === 'details'"
              placeholder="(__) ___ __ __"
              mask="(###) ### ## ##"
              unmasked-value
              :rules="[validatePhoneNumber]"
              fill-mask
              lazy-rules
              dense
              outlined
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <!-- Yetkili Dil -->
        <q-item class="col-lg-2 col-md-4 col-sm-6 col-xs-6">
          <q-item-section>
            <q-select
              v-model="formModel.languageId"
              :options="languages"
              option-value="id"
              option-label="name"
              :label="$t('users.language')"
              :disable="currentMode === 'details'"
              emit-value
              map-options
              dense
              outlined
              @update:model-value="onCountryChange"
            >
              <template #prepend>
                <q-icon name="public" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <!-- Yetkili Kişi Açıklama -->
        <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
          <q-item-section>
            <q-input
              ref="passwordRef"
              v-model="formModel.description"
              :label="$t('description')"
              type="text"
              :disable="currentMode === 'details'"
              lazy-rules
              outlined
              dense
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <!-- Durum ve Kayıt Butonları -->
        <q-card-actions class="q-ml-auto">
          <q-toggle
            :label="formModel.isActive === true ? $t('active') : $t('inactive')"
            color="green"
            checked-icon="check"
            unchecked-icon="cancel"
            :disable="currentMode === 'details'"
            v-model="formModel.isActive"
          />
          <q-btn
            class="text-capitalize bg-info q-ml-xl"
            :style="{ display: currentMode === 'details' ? 'none' : 'block' }"
            @click="onSubmit"
          >
            {{ currentMode === "edit" ? $t("updatedata") : $t("savedata") }}
          </q-btn>
        </q-card-actions>
      </q-list>
    </q-card>
    <!-- Yetkili Kişiler Tablosu-->
    <q-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card-section class="bg-primary text-white">
        <div>{{ $t("region.contactList") }}</div>
      </q-card-section>
      <q-separator />
      <q-table
        flat
        dense
        bordered
        class="statement-table"
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
            <!-- Arama Butonu -->
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
            <!-- Ekleme Butonu -->
            <q-btn
              flat
              round
              dense
              icon="add"
              class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
              @click="onAdd()"
            >
              <q-tooltip>
                {{ $t("region.addContact") }}
              </q-tooltip>
            </q-btn>
            <q-space />
            <!-- Yenileme Butonu -->
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
            <!-- Excel Export Butonu -->
            <q-btn
              :label="$t('export')"
              class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
              icon="cloud_download"
              @click="exportTable"
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
          <q-td :props="props">
            <q-btn
              flat
              dense
              round
              color="primary"
              icon="mail"
              :href="'mailto:' + props.row.email"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                {{ $t("sendemail") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              round
              color="secondary"
              icon="phone"
              :href="'tel:' + props.row.phone"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                {{ $t("tocall") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              round
              color="green"
              icon="chat"
              :href="'https://wa.me/' + formatPhoneForWhatsApp(props.row.phone)"
              target="_blank"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                >{{ $t("users.whatsapp") }}</q-tooltip
              >
            </q-btn>

            <q-btn
              flat
              dense
              round
              color="primary"
              icon="info"
              @click="onView(props.row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                {{ $t("view") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              round
              color="secondary"
              icon="edit"
              @click="onEdit(props.row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                {{ $t("edit") }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              round
              color="negative"
              icon="delete_forever"
              @click="onDelete(props.row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                {{ $t("delete") }}
              </q-tooltip>
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
    </q-card>
  </div>

  <!-- Form Dialog Contact Delete-->
  <q-dialog v-model="deleteConfirm" persistent>
    <q-card class="q-pa-md text-center">
      <q-card-section>
        <q-avatar
          size="56px"
          icon="delete_forever"
          color="negative"
          text-color="white"
        />
      </q-card-section>

      <q-card-section>
        <div class="text-h6 q-mb-sm">
          {{ $t("region.contactDeleteConfirm") }}
        </div>
        <div class="text-subtitle2">
          {{ $t("dealer.contactName") }} :
          <b>{{ formModel.name }} {{ formModel.surname }}</b>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
        <q-btn flat :label="$t('delete')" color="negative" @click="deleteRow" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "DealerContactForm",
  components: {},
  emits: ["completed"],
  props: {
    dealerId: {
      type: Number,
    },
  },
  data() {
    return {
      formModel: {
        name: "",
        surname: "",
        email: "",
        phone: "",
        password: "",
        language: "",
        description: "",
        isActive: true,
      },

      rows: [],
      filter: "",
      loading: false,
      deleteConfirm: false,
      formVisible: false,
      currentRow: {},
      currentMode: "add",
      languages: [],
      pagination: { rowsPerPage: 10 },
      countryCode: "+90",

      countryCodes: [
        { label: "+90 (TR)", value: "+90" },
        { label: "+1 (US)", value: "+1" },
        { label: "+49 (DE)", value: "+49" },
        { label: "+44 (UK)", value: "+44" },
      ],
    };
  },

  computed: {
    columns() {
      return [
        {
          name: "title",
          label: this.$t("users.usertitle"),
          field: "title",
          align: "left",
          sortable: true,
        },
        {
          name: "name",
          label: this.$t("region.contactName"),
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "surname",
          label: this.$t("region.contactSurname"),
          field: "surname",
          align: "left",
          sortable: true,
        },
        {
          name: "phone",
          label: this.$t("region.contactPhone"),
          field: "phone",
          align: "left",
          sortable: false,
        },
        {
          name: "email",
          label: this.$t("region.contactEmail"),
          field: "email",
          align: "left",
          sortable: false,
        },
        {
          name: "isActive",
          label: this.$t("status"),
          field: "isActive",
          align: "center",
          sortable: true,
        },
        {
          name: "action",
          label: this.$t("action"),
          field: "",
          align: "center",
        },
      ];
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.getList();
      this.getLanguages();
    },

    onAdd() {
      this.maximizedToggle = false;
      this.formModel = { isActive: true };
      this.currentMode = "add";
      this.formVisible = true;
    },
    onEdit(row) {
      this.maximizedToggle = false;
      this.formModel = row;
      this.currentMode = "edit";
      this.formVisible = true;
    },
    onView(row) {
      this.maximizedToggle = false;
      this.formModel = row;
      this.currentMode = "details";
      this.formVisible = true;
    },
    onDelete(row) {
      this.formModel = row;
      this.deleteConfirm = true;
    },

    onSubmit() {
      this.formModel.dealerId = this.dealerId;
      //this.$logger.log("Dealer Cont Form", this.formModel);
      if (this.currentMode === "add") {
        this.addFormModel();
      } else {
        this.updateFormModel();
      }
    },

    async addFormModel() {
      try {
        const response = await this.$api.post(
          "createDealerUser",
          this.formModel,
        );
        if (response.status === 200) {
          this.$q.notify({ type: "positive", message: this.$t("saved") });
          this.closeForm();
        }
      } catch (error) {
        this.$logger.error("create DealerUser", error);
      }
    },
    async updateFormModel() {
      try {
        if (this.formModel.password == null) {
          delete this.formModel.password;
        }

        const response = await this.$api.put(
          "updateDealerUser",
          this.formModel,
        );
        if (response.status === 200) {
          this.$q.notify({ type: "positive", message: this.$t("updated") });
          this.closeForm();
        }
      } catch (error) {
        this.$logger.error("update DealerUser:", error);
      }
    },

    async getList() {
      try {
        const response = await this.$api.get(
          `getDealerUsersByDealerId/${this.dealerId}`,
        );
        this.rows = response.data.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getList error", error);
      }
    },
    async getLanguages() {
      try {
        const response = await this.$api.get("languages");
        this.languages = response?.data;
      } catch (error) {
        this.$logger.error("getLanguages error", error);
      }
    },
    async deleteRow() {
      try {
        this.formModel.isActive = false;
        const response = await this.$api.put("dealerUsers", this.formModel);
        if (response.status === 200) {
          this.closeForm();
          this.$q.notify({
            type: "negative",
            message: this.$t("region.contactDeleted"),
          });
        }
      } catch (error) {
        this.$logger.error("deleteContact", error);
      }
    },

    closeForm() {
      try {
        this.formVisible = this.deleteConfirm = false;
        this.getList();
      } catch (error) {
        this.$logger.error("closeForm", error);
      }
    },
    formatPhoneForWhatsApp(number) {
      if (!number) return "";
      number = number.trim();

      if (!number.startsWith("+")) {
        number = "+90" + number;
      }

      return number.replace(/\D/g, "");
    },

    validatePhoneNumber(val) {
      if (!val) return this.$t("requiredlabel");
      if (!/\d{9}$/.test(val)) return this.$t("users.invalidPhoneNumber");
      return true;
    },
    validateEmail(val) {
      if (!val) return this.$t("requiredlabel");
      const emailPattern =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$/;
      if (!emailPattern.test(val)) return this.$t("users.invalidEmail");
      return true;
    },
  },
});
</script>
