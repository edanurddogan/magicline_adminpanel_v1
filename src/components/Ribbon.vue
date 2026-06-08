<template>
  <div class="ribbon" :style="{ backgroundColor: color }">
    <span>{{ text }}</span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  text: { type: String, default: "NEW!" }, // Ribbon metni
  color: { type: String, default: "#007BFF" }, // Arka plan rengi
  textColor: { type: String, default: "#FFF" }, // Yazı rengi
});
</script>

<style scoped>
.ribbon {
  position: absolute;
  top: 73px;
  right: -32px;
  width: 150px; /* Ribbon genişliği */
  height: 40px; /* Ribbon yüksekliği */
  background-color: v-bind(color); /* Dinamik renk */
  color: v-bind(textColor); /* Yazı rengi */
  text-align: center;
  line-height: 32px;
  font-size: 12px;
  font-weight: bold;
  transform: rotate(45deg);
  transform-origin: top right;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  clip-path: polygon(28% 0%, 72% 0%, 100% 100%, 0% 100%);
  overflow: hidden; /* Efektin taşmasını önler */
}

/* Parlak ışık efekti */
.ribbon::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.8) 50%,
    transparent 100%
  );
  transform: skewX(-45deg); /* Açılı bir geçiş efekti oluştur */
  animation: shine 3s infinite linear;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
