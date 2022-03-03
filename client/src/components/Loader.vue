<template>
  <div class="loader">
    <div class="pulse-container">
      <div class="pulse-bubble pulse-bubble-1"></div>
      <div class="pulse-bubble pulse-bubble-2"></div>
      <div class="pulse-bubble pulse-bubble-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.loader {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2f2e2ecc;
  position: absolute;
  z-index: 10;
  min-height: 100vh;
  min-width: 100%;
}
.pulse-container {
  width: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pulse-bubble {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #0d6efd;
}

.pulse-bubble-1 {
  animation: pulse 0.4s ease 0s infinite alternate;
}
.pulse-bubble-2 {
  animation: pulse 0.4s ease 0.2s infinite alternate;
}
.pulse-bubble-3 {
  animation: pulse 0.4s ease 0.4s infinite alternate;
}
@keyframes pulse {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0.25;
    transform: scale(0.75);
  }
}
</style>
