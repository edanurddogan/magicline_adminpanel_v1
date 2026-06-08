<template>
  <div>
    <q-card>
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <!--<q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-avatar size="150px">
                <img
                  src="https://scontent.fyei6-5.fna.fbcdn.net/v/t1.6435-9/159907106_10159130608929555_4447847519082786461_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=UFttAVi8CvUAX9MhEyB&_nc_ht=scontent.fyei6-5.fna&oh=00_AfAV0Jd-pfByFyW2jKOfMMJNNzZz-VcUaan0G7Vn3gT2HQ&oe=63DBAB2A"
                />
              </q-avatar>
            </q-item-section> </q-item
          ><q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-uploader
                :style="{
                  display: mode === 'details' ? 'none' : 'block',
                }"
                url="http://localhost:4444/upload"
                :headers="[
                  { name: 'X-Custom-Timestamp', value: 1550240306080 },
                ]"
                :label="$t('users.uploadphoto')"
                style="max-width: 200px"
              />
            </q-item-section>
          </q-item>-->

          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                dense
                :disable="mode === 'details'"
                v-model="user.gender"
                :options="genderFiltered"
                option-value="id"
                option-label="genderName"
                :label="$t('users.gender')"
              />
            </q-item-section>
          </q-item>

          <!--<q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                :disable="mode === 'details'"
                v-model="user.langugage"
                :options="language"
                option-value="id"
                option-label="languageName"
                :label="$t('users.language')"
              />
            </q-item-section>
          </q-item>-->

          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('users.usertitle')"
                v-model="user.title"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('users.name')"
                v-model="user.name"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('users.surname')"
                v-model="user.surname"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('users.birthday')"
                v-model="user.birthday"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer q-pa-sm">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="user.birthday">
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
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('users.email')"
                v-model="user.email"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('users.phone')"
                v-model="user.phone1"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                :disable="mode === 'details'"
                :label="$t('users.phone')"
                v-model="user.phone2"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                dense
                type="textarea"
                :disable="mode === 'details'"
                :label="$t('users.about')"
                v-model="user.description"
              />
            </q-item-section>
          </q-item>

          <!--<q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                :disable="mode === 'details'"
                :label="$t('users.password')"
                v-model="user.password"
                type="password"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-toggle
                class="q-pa-sm col-lg-12 col-md-12 col-sm-12 col-xs-12"
                :label="$t('users.changepassword')"
                v-model="user.changepassword"
                checked-icon="published_with_changes"
                color="green"
                unchecked-icon="clear"
                :disable="mode === 'details'"
              />
            </q-item-section>
          </q-item>-->

          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-toggle
                dense
                class="q-pa-sm col-lg-12 col-md-12 col-sm-12 col-xs-12"
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
import { useQuasar } from "quasar";

export default defineComponent({
  name: "UserForm",
  setup(props, { emit }) {
    const $q = useQuasar();
    const user = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    return {
      user,
    };
  },
  data() {
    return {
      genderFull: [],
      genderFiltered: [],
    };
  },
  emits: ["completed"],
  // onBeforeCreate() {
  //   this.localModel = this.modelValue;
  // },
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
    this.init();
  },
  methods: {
    init() {
      this.getGender();
    },
    onSubmit() {
      this.$logger.log(this.user.birthday);
      this.user.birthday = new Date(this.user.birthday).toISOString();
      this.$logger.log(this.user.birthday);

      this.$logger.log("form submitted", this.user);
      if (this.mode === "add") {
        this.$logger.log("add");
        this.addUser();
      } else if (this.mode === "edit") {
        this.$logger.log("edit");
        this.editUser();
      }
    },
    async addUser() {
      const response = this.$api
        .post("users", JSON.stringify(this.user))
        .then(() => {
          this.$logger.log(response.data);
          this.$logger.log("add completed");

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
    async editUser() {
      const response = this.$api
        .put("users", JSON.stringify(this.user))
        .then(() => {
          this.$logger.log(response);
          this.$logger.log("edit completed");

          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("users.user"),
            caption: this.$t("success"),
          });

          this.$emit("completed");
        });
    },

    async getGender() {
      const response = this.$api.get("genders").then((data) => {
        this.$logger.log(data.data);
        this.genderFull = data.data;
      });
    },

    filterGenderType(val, update) {
      if (val === "") {
        update(() => {
          this.genderFiltered = this.genderFull;
        });
        return;
      }

      update(() => {
        this.genderFiltered = this.genderFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },
  },
});
</script>
