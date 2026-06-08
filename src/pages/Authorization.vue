<template>
  <div>
    <q-card>
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <q-item>
            <q-btn
              dense
              icon="add"
              padding="xs lg"
              class="text-capitalize bg-secondary q-pa-xs q-ma-xs"
              text-color="white"
              @click="employeeGroupFormVisibile = true"
            >
              {{ $t("users.addemployee") }}
            </q-btn>
          </q-item>
          <q-item>
            <q-select
              dense
              outlined
              use-input
              clearable
              input-debounce="0"
              transition-show="flip-up"
              transition-hide="flip-up"
              v-model="employeeGroup"
              option-value="id"
              option-label="name"
              :label="$t('users.employeegroups')"
              :options="employeeGroupFiltered"
              @filter="filterEmployeeGroup"
              @update:model-value="selectEmployeeGroup"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{ $t("noresults") }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item>
          <q-item>
            <div v-if="selectedEmployeeGroup">
              {{ selectedEmployeeGroup.detail }}
            </div>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <q-item>
            <q-btn
              :disable="selectedEmployeeGroup == null"
              dense
              icon="save"
              class="text-capitalize bg-primary q-px-md q-ma-xs"
              text-color="white"
              @click="updateFormVisibile = true"
            >
              {{ $t("authorization.savechanges") }}
            </q-btn>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
  <div>
    <q-splitter v-model="splitterModel" :limits="[40, 70]">
      <template v-slot:before>
        <div class="q-pa-md">
          <q-input ref="filterRef" filled v-model="filter" label="Search">
            <template v-slot:append>
              <q-icon
                v-if="filter !== ''"
                name="clear"
                class="cursor-pointer"
                @click="resetFilter"
              ></q-icon>
            </template>
          </q-input>

          <q-tree
            :disable="selectedEmployeeGroup == null"
            ref="authtree"
            :nodes="simple"
            node-key="id"
            label-key="name"
            :tick-strategy="
              selectedEmployeeGroup == null ? 'none' : 'leaf-filtered'
            "
            v-model:selected="selected"
            @update:selected="selectedNode"
            v-model:ticked="ticked"
            @update:ticked="tickedNode"
            v-bind:ticked="ticked"
            default-expand-all
            :filter="filter"
            :filter-method="myFilterMethod"
          ></q-tree>
        </div>
      </template>

      <template v-slot:separator>
        <q-avatar
          color="primary"
          text-color="white"
          size="40px"
          icon="settings_ethernet"
        />
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h6">Açıklama</div>
          <div>
            <div v-html="define"></div>
          </div>
        </div>
      </template>
    </q-splitter>
  </div>

  <!-- Kullanıcı Grubu Formu-->
  <q-dialog
    v-model="employeeGroupFormVisibile"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 90vh">
      <q-card-section class="q-pa-sm">
        <q-bar class="q-pa-sm">
          <q-icon name="add_box" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{
              $t("pages.employeegroup")
            }}</span>
          </q-toolbar-title>

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 70vh" class="scroll q-pa-sm">
        <employee-group-form
          class="q-pa-sm"
          v-model="currentRow"
          :mode="currentMode"
          @completed="getEmployeeGroup"
          @close="employeeGroupFormVisibile = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Update Dialog -->
  <q-dialog v-model="updateFormVisibile" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="person_off" color="primary" text-color="white" />&nbsp;
        &nbsp; &nbsp; &nbsp;
        <h5>{{ $t("authorization.updateEmployeeGroupAuthority") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>
          {{
            $t("authorization.updateEmployeeGroupAuthorityMessage").replace(
              "_groupName_",
              selectedEmployeeGroup.name
            )
          }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          color="negative"
          v-close-popup
        /><q-space />
        <q-btn
          flat
          :label="$t('updatedata')"
          color="positive"
          v-on:click="saveChanges"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from "vue";
import EmployeeGroupForm from "src/components/forms/EmployeeGroupForm.vue";

export default defineComponent({
  components: {
    EmployeeGroupForm,
  },
  setup() {},
  data() {
    return {
      filter: "",
      filterRef: null,
      selected: "",
      ticked: [""],
      expanded: [""],
      define: "",

      simple: [],

      employeeGroupFiltered: [],
      employeeGroupFull: [],
      employeeGroup: null,
      selectedEmployeeGroup: null,

      splitterModel: 50,

      employeeGroupFormVisibile: false,
      updateFormVisibile: false,
    };
  },

  async mounted() {
    document.title = "Magicline - Yetkilendirme";
    const response = await this.$api
      .get("getAuthList")
      .then((response) => {
        this.$logger.log(response?.data.count, response?.data.authlist.length);
        this.$logger.log("response :", response?.data.authlist);
        this.simple = response?.data.authlist.splice(0, response?.data.count);
        this.$logger.log("simple :", this.simple);
        this.init();
      })
      .catch(function (error) {
        this.$logger.log("error :", error);
      });
    //this.loading = false;
    //this.init();
  },
  methods: {
    async init() {
      this.getEmployeeGroup();
      setTimeout(() => this.$refs.authtree.expandAll(), 200);
    },
    myFilterMethod(node, filter) {
      //this.$logger.log('node', node);
      //this.$logger.log('filter', filter);
      const filt = filter.toLowerCase();

      return node.name && node.name.toLowerCase().indexOf(filt) > -1;
    },

    resetFilter() {
      this.filter = "";
      this.filterRef.focus();
    },
    tickedNode(node) {
      //this.$logger.log('node', node);
    },

    selectedNode(node) {
      //this.$logger.log('node', node);
      this.$logger.log("selected", this.selected);
      this.$logger.log("ticked", this.ticked);

      this.nestedArrayFind(this.simple);
      /*for (let i = 0; i < this.simple.length; i++) {
        const _node = this.simple[i];
        this.$logger.log(_node.authorityId, _node.name, _node.key);
      }*/
    },

    nestedArrayFind(nestedArray) {
      for (let i = 0; i < nestedArray.length; i++) {
        const _node = nestedArray[i];
        if (_node.id == this.selected) {
          this.define = _node.detail;
          return _node;
        }
        if (_node.children) {
          this.nestedArrayFind(_node.children);
        }
      }
    },

    async getEmployeeGroup() {
      const response = this.$api.get("employeeGroups").then((data) => {
        this.$logger.log(data.data);
        this.employeeGroupFull = data.data.filter(
          (item) => item.name !== "Admin"
        );
      });
    },

    filterEmployeeGroup(val, update) {
      if (val === "") {
        update(() => {
          this.employeeGroupFiltered = this.employeeGroupFull;
        });
        return;
      }

      update(() => {
        this.employeeGroupFiltered = this.employeeGroupFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },
    selectEmployeeGroup(val) {
      this.ticked = [];
      this.selectedEmployeeGroup = val;
      this.$logger.log("selectedEmployeeGroup", this.selectedEmployeeGroup);
      if (this.selectedEmployeeGroup) {
        const response = this.$api
          .get("getGroupAuthList/" + val.id)
          .then((data) => {
            //this.$logger.log('getGroupAuthList/', data.data);
            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i];
              this.ticked.push(data.data[i].authorityId);
            }
          });
      }
    },
    saveChanges() {
      var groupAuthList = {};
      groupAuthList.employeeGroupId = this.selectedEmployeeGroup.id;
      groupAuthList.authList = this.ticked;
      const response = this.$api
        .post("postGroupAuthList", JSON.stringify(groupAuthList))
        .then((data) => {
          this.$logger.log("postGroupAuthList/", data.data);
          this.updateFormVisibile = false;
          this.$q.notify({
            progress: true,
            type: "positive",
            textColor: "white",
            message: this.$t("authorization.updatedEmployeeGroupAuthority"),
            caption: this.$t("success"),
          });
        });
    },
  },
});
</script>
