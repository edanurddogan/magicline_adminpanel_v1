<template>
  <div>
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="q-ma-md col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-card-section class="bg-primary text-white">
            <div>{{ $t("users.personelInformation") }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list class="row">
              <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <!-- Employee Title -->
                <q-item-section>
                  <q-input
                    :disable="mode === 'details'"
                    :label="$t('users.usertitle')"
                    v-model="user.title"
                    dense
                    outlined
                  >
                    <template v-slot:prepend>
                      <q-icon name="badge" />
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <!-- Employee Name -->
              <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <q-item-section>
                  <q-input
                    :disable="mode === 'details'"
                    :label="$t('users.name')"
                    v-model="user.name"
                    dense
                    outlined
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <!-- Employee Surname -->
              <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <q-item-section>
                  <q-input
                    :disable="mode === 'details'"
                    :label="$t('users.surname')"
                    v-model="user.surname"
                    dense
                    outlined
                  >
                    <template v-slot:prepend>
                      <q-icon name="person_outline" />
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <q-item-section>
                  <div class="row q-col-gutter-sm">
                    <!-- Telefon Ülke kod -->
                    <q-select
                      v-model="countryCode"
                      :options="countryCodes"
                      emit-value
                      map-options
                      dense
                      outlined
                      class="col-4"
                      :disable="mode === 'details'"
                      :label="$t('users.countrycode')"
                    >
                      <template v-slot:prepend>
                        <q-icon name="flag" />
                      </template>
                    </q-select>
                    <!-- Telefon Numarası -->
                    <q-input
                      v-model="user.mobilePhone"
                      dense
                      outlined
                      class="col-8"
                      :disable="mode === 'details'"
                      :label="$t('users.phone')"
                      mask="### ### ## ##"
                      fill-mask
                      unmasked-value
                    >
                      <template v-slot:prepend>
                        <q-icon name="phone" />
                      </template>
                    </q-input>
                  </div>
                </q-item-section>
              </q-item>
              <!-- Employee Email -->
              <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <q-item-section>
                  <q-input
                    :disable="mode === 'details'"
                    :label="$t('users.email')"
                    v-model="user.email"
                    dense
                    outlined
                  >
                    <template v-slot:prepend>
                      <q-icon name="mail" />
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <!-- Employee Password -->
              <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <q-item-section>
                  <q-input
                    v-model="userpassword"
                    :label="$t('users.password')"
                    @change="userpasswordChange"
                    :type="isPwd ? 'password' : 'text'"
                    :disable="mode === 'details'"
                    dense
                    outlined
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <!-- Employee employeeGroup -->
              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    use-input
                    input-debounce="0"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="user.employeeGroup"
                    option-value="id"
                    option-label="name"
                    :label="$t('users.employeegroups')"
                    :options="employeeGroupFiltered"
                    @filter="filterEmployeeGroup"
                    @update:model-value="selectEmployeeGroup"
                  >
                    <template v-slot:prepend>
                      <q-icon name="groups" />
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          {{ $t("noresults") }}
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>

              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-toggle
                    class="q-pa-sm col-lg-4 col-md-4 col-sm-12 col-xs-12"
                    :label="$t('users.changepassword')"
                    v-model="user.changepassword"
                    checked-icon="published_with_changes"
                    color="green"
                    unchecked-icon="clear"
                    :disable="mode === 'details'"
                  />
                </q-item-section>
              </q-item>

              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-toggle
                    class="q-pa-sm col-lg-4 col-md-4 col-sm-12 col-xs-12"
                    :label="$t('users.status')"
                    v-model="user.isActive"
                    checked-icon="how_to_reg"
                    color="green"
                    unchecked-icon="person_off"
                    :disable="mode === 'details'"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <!-- Kayıt butonu -->
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
    </div>
  </div>
</template>
<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  setup(props, { emit }) {
    const user = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    return { user };
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
  data() {
    return {
      userpassword: "",
      employeeGroupFiltered: [],
      employeeGroupFull: [],
      employeeGroup: null,
      selectedEmployeeGroup: null,
      profilePhotoUrl: "",
      isPwd: true,
      countryCodes: [
        { label: "+90 (TR)", value: "+90" },
        { label: "+1 (US)", value: "+1" },
        { label: "+49 (DE)", value: "+49" },
        { label: "+44 (UK)", value: "+44" },
      ],
      countryCode: "+90",
      mobilePhone: "",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      //await this.getEmployeeGroup();
      this.user.password = "";
      this.$logger.log(this.user);
    },
    onSubmit() {
      this.user.birthday =
        this.user.birthday == undefined ? null : this.user.birthday;
      if (this.user.birthday != null)
        this.user.birthday = new Date(this.user.birthday).toISOString();

      this.$logger.log("form submitted", this.user);
      if (this.mode === "add") {
        this.addFormModel();
      } else if (this.mode === "edit") {
        this.updateFormModel();
      }
    },
    async addFormModel() {
      this.user.languageId = 1;
      //this.user.employeeGroupId = this.user.employeeGroup.id;
      this.user.phone =
        this.countryCode + this.user.mobilePhone.replace(/\s/g, "");

      const response = await this.$api.post("employees", this.user);
      if (response.status === 200) {
        this.$q.notify({ type: "positive", message: this.$t("saved") });
        this.$emit("completed");
      }
    },
    async updateFormModel() {
      const response = await this.$api.put("employees", this.user);
      if (response.status === 200) {
        this.$q.notify({ type: "positive", message: this.$t("saved") });
        this.$emit("completed");
      }
    },
    userpasswordChange() {
      this.user.password = this.userpassword;
      this.$logger.log(this.user.password);
    },
  },
});
</script>
