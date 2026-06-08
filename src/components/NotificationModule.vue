<template>
  <audio ref="audio" :src="notificationSound" muted="muted"></audio>
  <div class="row">
    <q-btn
      dense
      round
      flat
      :icon="unreadMessage == 0 ? iconName : iconName_UnRead"
      class="q-mr-md"
      :text-color="iconColor"
    >
      <q-badge v-if="unreadMessage" color="red" floating transparent>
        {{ unreadMessage }}
      </q-badge>
      <q-menu
        v-if="messages.length > 0"
        fit
        anchor="bottom left"
        self="top right"
      >
        <q-list>
          <q-item
            v-for="item in messages"
            :key="item.id"
            clickable
            v-close-popup
            @click="selectItem(item, index)"
            ><!--@click="selectItem(item, index)"-->
            <q-item-section avatar top>
              <q-avatar :icon="item.icon" :text-color="item.importance" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ item.title }}</q-item-label>
              <q-item-label lines="2" caption
                >{{ item.message.substring(0, 50) }}...</q-item-label
              >
            </q-item-section>

            <q-item-section top side class="items-end">
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  v-show="!item.read"
                  class="gt-xs"
                  flat
                  dense
                  color="secondary"
                  icon="mark_email_unread"
                  @click="readMessage(item)"
                />
                <q-btn
                  class="gt-xs"
                  color="red-5"
                  flat
                  dense
                  icon="delete"
                  @click="deleteMessage(item)"
                />
              </div>
              <div class="text-caption text-grey-7 q-mt-sm text-right">
                {{ formatDate(item.createdAt) }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <!--<q-icon
      class="q-mr-md"
      :name="iconName"
      :style="{ color: iconColor, 'font-size': '2em' }"
    >
      <q-badge color="black"> 4 </q-badge>
    </q-icon>-->
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import notificationSound from "src/assets/sound/notification.mp3";
import {
  brandAssets,
  notificationBrandName,
} from "src/config/brand";

export default defineComponent({
  computed: {},
  data() {
    return {
      user: {},
      iconName: "notifications",
      iconName_UnRead: "notifications_active",
      iconName_Important: "notification_important",
      iconColor: "#191",
      messageImportant: false,
      unreadMessage: 0,
      messages: [],
      audio: {},
      notificationSound,
      notificationLogo: brandAssets.logo,
      notificationBrandName,
    };
  },
  mounted() {
    try {
      this.user = LocalStorage.getItem("userinfo");
    } catch (error) {
      this.$logger.log(error);
    }
    this.init();
  },
  methods: {
    init() {
      this.audio = this.$refs.audio;
      this.audio.muted = true;
      this.audio.muted = false;
      this.audio.volume = 0.1;
      setTimeout(() => {
        try {
          this.firstGetUserNotification(this.user.id);
        } catch (error) {}
      }, 3000);

      this.notificationControl();
    },
    selectItem(item, index) {
      //this.$logger.log(item, index);
      this.$q.notify({
        progress: true,
        type: item.importance,
        color: item.importance,
        html: true,
        multiLine: true,
        message: item.title,
        caption: `${
          item.message
        }<br><br><small style="display:block;text-align:right;">${this.formatDate(
          item.createdAt,
        )}</small>`,
      });
    },

    formatDate(date) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(date).toLocaleDateString("tr-TR", options);
    },

    async notificationControl() {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      while (true) {
        await delay(1000 * 30);
        this.getUserNotification(this.user.id);
      }
    },

    async firstGetUserNotification(userId) {
      if (!userId || userId == 0) return;
      const response = this.$api
        .get("getNotification/" + userId)
        .then((data) => {
          this.messages = data.data;
          this.unreadMessage = this.messages.filter(
            (urm) => urm.read == false,
          ).length;
          if (this.unreadMessage > 0) this.playSound();
        });
    },

    async getUserNotification(userId) {
      if (!userId || userId == 0) return;
      const response = this.$api
        .get("getNotification/" + userId)
        .then((data) => {
          this.messages = data.data;

          var newUnredMsg = this.messages.filter(
            (urm) => urm.read == false,
          ).length;

          if (newUnredMsg > this.unreadMessage) this.playSound();
          this.unreadMessage = newUnredMsg;
        });
    },
    deleteMessage(item) {
      item.isActive = false;
      this.putUserNotification(item);
    },
    readMessage(item) {
      item.read = true;
      this.putUserNotification(item);
    },

    async putUserNotification(notification) {
      //this.$logger.log('notification', notification);
      const response = this.$api
        .put("employeeNotifications", notification)
        .then((data) => {
          /*this.messages = data.data;

        var unreadMsg = this.messages.filter(
          (urm) => urm.read == false
        )
        this.unreadMessage = unreadMsg.length*/
          //this.$logger.log('putUserNotification', data.data);
          this.getUserNotification(this.user.id);
        });
    },
    async playSound() {
      if (!this.audio) return;
      this.desktopNotification("Yeni bir bildirim var!");
      this.audio.muted = true;
      this.audio.muted = false;
      this.audio.currentTime = 0;
      this.audio.play().catch((error) => {
        this.$logger.log("Notification sound could not be played", error);
      });
      setTimeout(() => {
        this.audio.pause();
      }, 4000);
    },
    async desktopNotification(message) {
      if (Notification.permission === "granted") {
        new Notification(this.notificationBrandName, {
          body: message,
          icon: this.notificationLogo,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(this.notificationBrandName, {
              body: message,
              icon: this.notificationLogo,
            });
          }
        });
      }
    },
  },
});
</script>
