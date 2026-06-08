<script setup>
import { useLayoutStore } from "src/stores/layout";
const layout = useLayoutStore();
</script>
<template>
  <div class="subcontent">
    <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-splitter
        v-model="splitterModel"
        :limits="[15, 40]"
        style="max-width: 100%; max-height: 100%"
      >
        <template v-slot:before>
          <div class="q-pa-md">
            <div class="row text-h6 q-mb-md">
              <!--{{ $t("calendar.categoriesToView") }}-->
              <q-btn
                flat
                round
                dense
                icon="refresh"
                class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                @click="getProductionOrderList"
              >
                <q-tooltip>
                  {{ $t("refresh") }}
                </q-tooltip>
              </q-btn>
            </div>
            <q-input
              ref="filterRef"
              dense
              filled
              v-model="filter"
              :label="$t('search')"
            >
              <template v-slot:append>
                <q-icon
                  v-if="filter !== ''"
                  name="clear"
                  class="cursor-pointer"
                  @click="filter = ''"
                ></q-icon>
              </template>
            </q-input>
            <q-checkbox
              v-model="selectAll"
              :label="$t('selectAll')"
              @update:model-value="selectAllProcess($event)"
            />
            <q-tree
              ref="calendarTaskTree"
              :nodes="calendarTaskTree"
              node-key="id"
              label-key="name"
              tick-strategy="leaf-filtered"
              v-model:selected="selected"
              @update:selected="selectedNode"
              v-model:ticked="ticked"
              @update:ticked="tickedNode"
              v-bind:ticked="ticked"
              default-expand-all
              :filter="filter"
              :filter-method="myFilterMethod"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
            </q-tree>
          </div>
        </template>

        <template v-slot:separator>
          <q-avatar
            color="primary"
            text-color="white"
            size="30px"
            icon="settings_ethernet"
          />
        </template>

        <template v-slot:after>
          <div class="q-pa-sm">
            <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-card-section class="justify-center items-center">
                <q-list class="row justify-center items-center">
                  <q-item class="col-lg-2 col-md-3 col-sm-4 col-xs-4">
                    <q-item-section>
                      <q-btn
                        color="secondary"
                        icon="arrow_back_ios"
                        @click="onPrev"
                      >
                      </q-btn>
                    </q-item-section>
                  </q-item>
                  <q-item class="col-lg-2 col-md-3 col-sm-4 col-xs-4">
                    <q-item-section>
                      <q-btn
                        color="secondary"
                        text-color="white"
                        :label="$t('calendar.today')"
                        @click="onToday"
                      >
                      </q-btn>
                    </q-item-section>
                  </q-item>
                  <q-item class="col-lg-2 col-md-3 col-sm-4 col-xs-4">
                    <q-item-section>
                      <q-btn
                        color="secondary"
                        icon-right="arrow_forward_ios"
                        @click="onNext"
                      >
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
            <q-separator />
            <q-calendar-month
              ref="calendar"
              v-model="selectedDate"
              animated
              bordered
              focusable
              :focus-type="focustype"
              use-navigation
              hoverable
              WeekFirstDayMonday
              :day-min-height="140"
              :day-height="10"
              :locale="$i18n.locale"
              :weekdays="[1, 2, 3, 4, 5, 6, 0]"
              month-label-size="md"
              @change="onChange"
              @moved="onMoved"
              @click-date="onClickDate"
              @click-day="onClickDay"
              @click-workweek="onClickWorkweek"
              @click-head-workweek="onClickHeadWorkweek"
              @click-head-day="onClickHeadDay"
            >
              <template #day="{ scope: { timestamp } }">
                <template
                  v-for="event in eventsMap[timestamp.date]"
                  :key="event.id"
                >
                  <div
                    :class="badgeClasses(event, 'day')"
                    :style="badgeStyles(event, 'day')"
                    class="my-event"
                    @click.stop.prevent="showEvent(event)"
                  >
                    <abbr :title="event.details" class="tooltip row">
                      <q-icon :name="event.icon" color="white" size="16px" />
                      <q-space />
                      <span class="title q-calendar__ellipsis">
                        {{
                          event.title + (event.time ? " - " + event.time : "")
                        }}</span
                      >
                      <q-space />
                    </abbr>
                  </div>
                </template>
              </template>
            </q-calendar-month>
          </div>
        </template>
      </q-splitter>
    </q-card>
  </div>

  <q-ajax-bar position="bottom" color="light-blue-5" size="10px" />
</template>
<script>
import { defineComponent } from "vue";
import { Platform } from "quasar";
import {
  QCalendarMonth,
  addToDate,
  parseDate,
  getDayIdentifier,
  parseTimestamp,
  today,
} from "@quasar/quasar-ui-qcalendar";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.scss";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.scss";
import "@quasar/quasar-ui-qcalendar/src/QCalendarMonth.scss";

function leftClick(e) {
  return e.button === 0;
}
const CURRENT_DAY = new Date();
function getCurrentDay(day) {
  const newDay = new Date(CURRENT_DAY);
  newDay.setDate(day);
  const tm = parseDate(newDay);
  return tm.date;
}

export default defineComponent({
  name: "Calendar",
  components: {
    QCalendarMonth,
  },
  computed: {
    eventsMap() {
      const map = {};
      if (this.events.length > 0) {
        this.events.forEach((event) => {
          (map[event.date] = map[event.date] || []).push(event);
          if (event.days !== undefined) {
            let timestamp = parseTimestamp(event.date);
            let days = event.days;
            // add a new event for each day
            // skip 1st one which would have been done above
            do {
              timestamp = addToDate(timestamp, { day: 1 });
              if (!map[timestamp.date]) {
                map[timestamp.date] = [];
              }
              map[timestamp.date].push(event);
              // already accounted for 1st day
            } while (--days > 1);
          }
        });
      }
      //this.$logger.log(map);
      return map;
    },
  },
  setup() {},
  data() {
    return {
      selectedDate: today(),
      events: [
        /*{
          id: 1,
          title: "Ödeme",
          details: "Tedarikçi firma ödemesi",
          date: getCurrentDay(1),
          bgcolor: "orange",
          icon: "credit_card",
        },
        {
          id: 2,
          title: "Toplantı",
          details: "Ekip toplantısı",
          date: getCurrentDay(4),
          bgcolor: "green",
          icon: "handshake",
        },
        {
          id: 3,
          title: "Toplantı",
          details: "Olağan Üstü Toplantı",
          date: getCurrentDay(10),
          time: "10:00",
          duration: 120,
          bgcolor: "red",
          icon: "handshake",
        },
        {
          id: 6,
          title: "Konferans",
          details: "Teaching Javascript 101",
          date: getCurrentDay(22),
          time: "09:00",
          duration: 540,
          bgcolor: "blue",
          icon: "groups",
        },
        {
          id: 7,
          title: "ISG Eğitimi",
          details: "Toplu Eğitim",
          date: getCurrentDay(22),
          time: "14:00",
          duration: 180,
          bgcolor: "teal",
          icon: "favorite",
        },
        {
          id: 10,
          title: "Tatil",
          details: "",
          date: getCurrentDay(29),
          bgcolor: "purple",
          icon: "plane",
          days: 5,
        },*/
      ],

      filter: "",
      filterRecipe: "",
      filterRef: null,
      selected: "",
      selectedProduction: "",
      ticked: [""],
      expanded: [""],
      define: "",

      splitterModel: 15,
      calendarTaskTree: [
        { id: 1, name: "Ödemeler" },
        { id: 2, name: "Faturalar" },
        { id: 3, name: "Sipariş Teslim" },
        { id: 4, name: "Personel İzin" },
        { id: 5, name: "Doğum Günleri" },
      ],
      focustype: ["day", "weekday", "date"],
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    init() {
      try {
        if (Platform.is.mobile) {
          this.layout.closeLeftDrawer();
          //this.isGrid = true;
        }
      } catch (error) {}

      this.$logger.log("lang", this.$i18n.locale);
    },

    showEvent(event) {
      //this.$logger.log("event => ", event);
      /*if (this.calendarView.indexOf('agenda') < 0) {
        this.event = event
        this.displayEvent = true
      }*/
    },
    badgeClasses(event, type) {
      return {
        [`text-white bg-${event.bgcolor}`]: true,
        "rounded-border": true,
      };
    },
    badgeStyles(day, event) {
      const s = {};
      // s.left = day.weekday === 0 ? 0 : (day.weekday * this.parsedCellWidth) + '%'
      // s.top = 0
      // s.bottom = 0
      // s.width = (event.days * this.parsedCellWidth) + '%'
      return s;
    },
    onToday() {
      this.$refs.calendar.moveToToday();
    },
    onPrev() {
      this.$refs.calendar.prev();
    },
    onNext() {
      this.$refs.calendar.next();
    },
    onMoved(data) {
      //this.$logger.log("onChange", data);
    },
    onClickDate(data) {
      //this.$logger.log("onClickDate", data);
    },
    onClickDay(data) {
      //this.$logger.log("onClickDay", data);
    },
    onClickWorkweek(data) {
      //this.$logger.log("onClickWorkweek", data);
    },
    onClickHeadDay(data) {
      //this.$logger.log("onClickHeadDay", data);
    },
    onClickHeadWorkweek(data) {
      //this.$logger.log("onClickHeadWorkweek", data);
    },
  },
  myFilterMethod(node, filter) {
    const filt = filter.toLowerCase();
    return node.name && node.name.toLowerCase().indexOf(filt) > -1;
  },
  resetFilter() {
    //this.$logger.log("resetFilter", this.filter);
    this.filter = "";
    this.filterRef.focus();
  },
  tickedNode(node) {
    //this.$logger.log("node", node);
  },
});
</script>

<style>
.my-event {
  position: relative;
  font-size: 12px;
  width: 100%;
  margin: 1px 0 0 0;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.rounded-border {
  border-radius: 2px;
}
abbr.tooltip {
  text-decoration: none;
}
</style>
