<template>
  <Loader v-if="isLoading"></Loader>
  <Header></Header>
  <router-view/>
</template>

<script lang="ts">
// @ is an alias to /src
import { defineComponent, computed } from 'vue';
import Header from '@/components/Header.vue';
import Loader from '@/components/Loader.vue';
import { useStore } from 'vuex';
export default defineComponent({
  components: {
    Header,
    Loader,
  },
  setup() {
    const store = useStore();
    const isLoading = computed(():boolean => store.getters.isLoading);

    return { isLoading }
  },
});
</script>

<style>
body {
  padding: 0%;
  margin: 0%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
}
ol, ul, dl {
  margin-top: 0;
  margin-bottom: 0;
}
.card--wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 320px;
  word-wrap: break-word;
  margin-bottom: 0.5rem !important;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}
.card--image {
  width: 100%;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px);
}
img {
  vertical-align: middle;
}
.card--body, .card--footer {
  flex: 1 1 auto;
  padding: 1rem 1rem;
}
.card--title {
  margin-bottom: 0.5rem;
  font-size: calc(1.275rem + 0.3vw);
}
.card--text {
  margin-top: 0;
  margin-bottom: 1rem;
}
.button {
  display: inline-block;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
  border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.button:hover {
  background-color: #6b95d4;
}
</style>
