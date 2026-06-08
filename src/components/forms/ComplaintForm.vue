<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-primary text-white">
          <div>{{ $t("callCenter.complaintInfo") }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <!-- Ön Kayıt Belirleme -->
          <div class="row q-pa-md">
            <q-card class="col-6">
              <q-list
                dense
                class="row q-col-gutter-md q-gutter-y-md items-start"
              >
                <!-- Kullanıcı Seçimi -->
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      v-model="formModel.customer"
                      :options="filteredCustomer"
                      option-value="id"
                      :option-label="customersLabel"
                      :label="$t('users.users')"
                      :loading="loading"
                      map-options
                      clearable
                      readonly
                      outlined
                      dense
                      use-input
                      style="width: 100%"
                      transition-show="scale"
                      transition-hide="scale"
                      @filter="filterCustomers"
                    >
                      <template #prepend>
                        <q-icon name="person" />
                      </template>
                      <template #selected-item="scope">
                        {{ scope.opt.name }} {{ scope.opt.surname }}
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
                <!-- Araç Seçimi -->
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      v-model="formModel.vehicle"
                      :options="filteredVehicle"
                      option-value="id"
                      option-label="licensePlate"
                      :label="$t('vehicle.vehicles')"
                      :loading="loading"
                      map-options
                      clearable
                      readonly
                      outlined
                      dense
                      use-input
                      style="width: 100%"
                      transition-show="scale"
                      transition-hide="scale"
                      @filter="filterLicensePlate"
                    >
                      <template #prepend>
                        <q-icon name="electric_car" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
                <!-- İstasyon Seçimi -->
                <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      v-model="formModel.station"
                      :options="filteredStation"
                      option-value="id"
                      option-label="name"
                      :label="$t('station.stations')"
                      :loading="loading"
                      map-options
                      readonly
                      clearable
                      outlined
                      dense
                      use-input
                      style="width: 100%"
                      transition-show="scale"
                      transition-hide="scale"
                      @filter="filterStations"
                    >
                      <template #prepend>
                        <q-icon name="ev_station" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>

                <!-- İşletim Sistemi Seçimi -->
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      v-model="formModel.callOperatingSystem"
                      :options="filteredOperatingSystem"
                      option-value="id"
                      option-label="name"
                      :label="$t('callCenter.operatingSystem')"
                      outlined
                      dense
                      clearable
                      style="width: 100%"
                    >
                      <template #prepend>
                        <q-icon name="devices" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
                <!-- Tarih/Saat Seçimi -->
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input filled v-model="formModel.occurredAt">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="formModel.occurredAt"
                              mask="YYYY-MM-DD HH:mm"
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

                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-time
                              v-model="formModel.occurredAt"
                              mask="YYYY-MM-DD HH:mm"
                              format24h
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
            <!-- Durum-Atama Seçimi -->
            <q-card class="col-6">
              <q-list
                dense
                class="row q-col-gutter-md q-gutter-y-md items-start"
              >
                <!-- Durum Seçimi -->
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      v-model="formModel.callStatus"
                      :options="filteredStatus"
                      option-value="id"
                      option-label="name"
                      :label="$t('callCenter.selectStatus')"
                      :loading="loading"
                      map-options
                      clearable
                      outlined
                      dense
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <template #prepend>
                        <q-icon name="list_alt" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
                <!-- Atama Seçimi -->
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      v-model="formModel.assignedDepartment"
                      :options="filteredAssigment"
                      option-value="id"
                      option-label="name"
                      :label="$t('callCenter.selectAssigment')"
                      :loading="loading"
                      map-options
                      clearable
                      outlined
                      dense
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <template #prepend>
                        <q-icon name="assignment_returned" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
                <!-- Çağrı Kategori Seçimi -->
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      v-model="formModel.callComplaintCategory"
                      :options="filteredCallCategory"
                      option-value="id"
                      option-label="name"
                      :label="$t('callCenter.selectCallCategory')"
                      :loading="loading"
                      map-options
                      clearable
                      outlined
                      dense
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <template #prepend>
                        <q-icon name="subject" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
                <!-- Öncelik Seçimi -->
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      v-model="formModel.callPriority"
                      :options="filteredPriority"
                      option-value="id"
                      option-label="name"
                      :label="$t('callCenter.selectPriority')"
                      :loading="loading"
                      map-options
                      clearable
                      outlined
                      dense
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <template #prepend>
                        <q-icon name="priority_high" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
                <!-- Kaynak -->
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      v-model="formModel.callSource"
                      :options="filteredSource"
                      option-value="id"
                      option-label="name"
                      :label="$t('callCenter.selectSource')"
                      :loading="loading"
                      map-options
                      clearable
                      outlined
                      dense
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <template #prepend>
                        <q-icon name="apps" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
          <!-- Şikayet ve Çözüm -->
          <div class="q-pa-md">
            <q-card class="q-pa-lg">
              <q-list class="row q-col-gutter-lg">
                <!-- Müşteri Şikayeti -->
                <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input
                      v-model="formModel.complaintText"
                      type="textarea"
                      outlined
                      readonly
                      rows="3"
                      :label="
                        $t('callCenter.customerComplaint') || 'Müşteri Şikayeti'
                      "
                      input-style="min-height: unset;"
                    >
                      <template #prepend>
                        <q-icon name="report_problem" />
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
          <!-- Departman Yorumları -->
          <div class="q-pa-md">
            <q-card class="q-pa-lg">
              <div class="text-subtitle1 q-mb-md">
                {{ $t("callCenter.callManagementProcess") }} -
                {{ $t("callCenter.departmentComment") }}
              </div>

              <div class="row justify-center">
                <div style="width: 100%; max-width: 900px">
                  <!-- Yorum listesi -->
                  <div v-if="comments.length === 0" class="text-grey q-mb-md">
                    {{ $t("callCenter.noComments") || "Henüz yorum yok." }}
                  </div>

                  <div v-for="c in formModel.comments" :key="c.id">
                    <q-chat-message
                      :name="c.author"
                      :text="[c.text]"
                      :sent="false"
                      :stamp="c.stamp"
                    />
                  </div>

                  <!-- Yorum Ekle -->
                  <div class="row q-gutter-sm q-mt-md items-center">
                    <q-input
                      v-model="newComment"
                      class="col-grow"
                      dense
                      outlined
                      :disable="commenting"
                      :placeholder="$t('callCenter.addComment')"
                    >
                      <template #prepend>
                        <q-icon name="chat_bubble_outline" />
                      </template>
                    </q-input>

                    <q-btn
                      color="primary"
                      icon="send"
                      class="q-px-md"
                      :loading="commenting"
                      :disable="!newComment || commenting"
                      @click="addDepartmentComment"
                    >
                      <q-tooltip>{{ $t("add") || "Ekle" }}</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <q-card-actions class="q-pa-lg justify-end">
    <q-btn
      class="text-capitalize bg-info q-pa-lg"
      :style="{ display: mode === 'details' ? 'none' : 'block' }"
      @click="onSubmit"
    >
      {{ mode === "edit" ? $t("updatedata") : $t("savedata") }}
    </q-btn>
  </q-card-actions>
</template>

<script>
import { defineComponent, computed } from "vue";
import { date } from "quasar";
import { LocalStorage } from "quasar";

export default defineComponent({
  name: "complaintForm",
  components: {},
  setup(props, { emit }) {
    let formModel = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    if (props.mode === "add") {
    } else {
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
      dealers: [],
      filteredDealers: [],
      currentRow: "",
      complaintText: "",
      user: LocalStorage.getItem("userinfo"),
      comments: [],
      newComment: "",
      commenting: false,

      operatingSystem: [],
      filteredOperatingSystem: [],
      status: [],
      filteredStatus: [],
      assigment: [],
      filteredAssigment: [],
      callCategory: [],
      filteredCallCategory: [],
      priority: [],
      filteredPriority: [],
      source: [],
      filteredSource: [],
    };
  },
  computed: {},

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.$logger.log("user", this.user);
      this.$logger.log("formModel", this.formModel);
      this.getCallComments();
      this.getOperatingSystem();
      this.getStatus();
      this.getAssigment();
      this.getCallCategory();
      this.getPriority();
      this.getSource();
      //this.getCall();
    },
    async addDepartmentComment() {
      try {
        if (!this.newComment || !this.newComment.trim()) return;

        const callId = this.formModel?.id ?? this.formModel?.callId;
        if (!callId) return;

        const body = {
          content: this.newComment.trim(),
          isInternal: true,
        };

        await this.$api.post(`callCenter/callAddComment/${callId}`, body);
        this.$logger.log("Comment add post", body, callId);
        this.newComment = "";
        this.$q.notify({ type: "positive", message: "Yorum eklendi." });

        await this.getCallComments();
      } catch (error) {
        this.$logger.error("addDepartmentComment error", error);
        this.$q.notify({ type: "negative", message: "Yorum eklenemedi." });
      }
    },
    async getCallComments() {
      try {
        const callId = this.formModel?.id ?? this.formModel?.callId;
        if (!callId) {
          this.comments = [];
          return;
        }

        const response = await this.$api.get(
          `callCenter/getCallComments/${callId}`,
        );
        const list = response.data?.comments || [];

        this.formModel.comments = list.map((item) => {
          return {
            id: item.id,
            text: item.content,
            author: item.employee
              ? `${item.employee.name} ${item.employee.surname}`
              : "",
            stamp: date.formatDate(item.createdAt, "YYYY-MM-DD HH:mm"),
          };
        });
      } catch (error) {
        this.$logger.error("getCallComments error", error);
      }
    },

    async getOperatingSystem() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "callCenter/getOperatingSystem/true",
        );
        this.operatingSystem = this.filteredOperatingSystem =
          response?.data?.operatingSystems || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getOperatingSystem error", error);
      }
    },
    async getStatus() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "callCenter/getCallCenterStatuses/true",
        );
        this.status = this.filteredStatus = response?.data?.statuses || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getStatus error", error);
      }
    },
    async getAssigment() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "callCenter/getCallDepartments/true",
        );
        this.assigment = this.filteredAssigment =
          response?.data?.callDepartments || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getAssigment error", error);
      }
    },
    async getCallCategory() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "callCenter/getCallComplaintCategories/true",
        );
        this.callCategory = this.filteredCallCategory =
          response?.data?.callComplaintCategories || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getCallCategory error", error);
      }
    },
    async getPriority() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          "callCenter/getCallPriorities/true",
        );
        this.priority = this.filteredPriority =
          response?.data?.callPriorities || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getPriority error", error);
      }
    },
    async getSource() {
      try {
        this.loading = true;
        const response = await this.$api.get("callCenter/getCallSources/true");
        this.source = this.filteredSource = response?.data?.callSources || [];
        this.loading = false;
      } catch (error) {
        this.$logger.error("getSource error", error);
      }
    },
    async getCall() {
      try {
        this.loading = true;
        const response = await this.$api.get(
          `callCenter/getCall/${this.formModel.id}`,
        );
        this.formModel = response?.data;
        this.loading = false;
      } catch (error) {
        this.$logger.error("getCall error", error);
      }
    },
    async onSubmit() {
      try {
        Object.assign(this.formModel, {
          ...this.formModel,
          callStatusId: this.formModel.callStatus?.id,
          assignedDepartmentId: this.formModel.assignedDepartment?.id,
          callComplaintCategoryId: this.formModel.callComplaintCategory?.id,
          callPriorityId: this.formModel.callPriority?.id,
          callSourceId: this.formModel.callSource?.id,
          callOperatingSystemId: this.formModel.callOperatingSystem?.id,
        });
        // this.formModel = {
        //   ...this.formModel,
        //   callStatusId: this.formModel.callStatus?.id,
        //   assignedDepartmentId: this.formModel.assignedDepartment?.id,
        //   callComplaintCategoryId: this.formModel.callComplaintCategory?.id,
        //   callPriorityId: this.formModel.callPriority?.id,
        //   callSourceId: this.formModel.callSource?.id,
        //   callOperatingSystemId: this.formModel.callOperatingSystem?.id,
        // };
        this.$logger.log("Submitting form:", this.formModel);
        const response = await this.$api.put(
          "callCenter/callUpdate",
          this.formModel,
        );
        if (response?.status === 200) {
          this.$emit("completed");
          this.$q.notify({
            type: "positive",
            message: this.$t("updated"),
          });
        }
      } catch (error) {
        this.$logger.error("onSubmit error", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("errordata") || "Kaydedilemedi.",
        });
      }
    },
  },
});
</script>
