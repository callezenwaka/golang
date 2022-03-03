<template>
  <div class="login">
    <form class="form--container" @submit.prevent="handleLogin">
      <div class="form--header">
        <h2 class="form--title">Log in to your account</h2>
      </div>
      <div v-if="!!validations.length" class="validations">
        <ul style="text-align: left;"><li style="list-style-type: disc;" v-for="(validation, index) in validations" :key="index">{{validation}}</li></ul>
      </div>
      <div class="form--item">
        <label class="form--label" for="key">Private Key: </label>
        <input class="form--input" type="password" name="key" id="key" v-model="key" @blur="handleBlur($event)" placeholder="Enter your private key" required />
      </div>
      <div class="form--item">
        <button class="form--button" :class="{isValid: isValid}" :disabled="!isValid" type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { computed, defineComponent, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import Key from '@/types/Key';
export default defineComponent({
  name: "Login",
  components: {
  },
  setup() {
    const store = useStore();
    // const route = useRoute();
    const router = useRouter();
    const login = (key: Key) => store.dispatch('login', key);
    let validations = reactive<string[]>([]);
    const key = ref('');
    const isValid = computed(() => {
      return key.value !== "";
    });
    const handleBlur = (event: Event) => {
      const target = event.target as HTMLInputElement;
      target.style.borderColor = target.value
        ? "rgba(229,231,235, 1)"
        : "rgba(255, 0, 0, 1)";
    };
    const handleValidation = (): boolean => {
      validations = [];
      if (!key.value) {
        validations.push("Private key is required!");
      }
      setTimeout(() => (validations = []), 5000);
      // If No Errors Return True
      if (validations.length) return false;
      return true;
    };
    const handleLogin = async () => {
      if (!handleValidation()) return;
      try {
        await login({privateKey: key.value});
        router.push({ name: "Home" });
      } catch (error) {
        console.log(error);
      }
    };

    return { validations, key, isValid, handleBlur, handleValidation, handleLogin };
  },
});
</script>

<style scoped>
/* login */
.login {
  padding: 1rem;
  height: 100%;
  min-height: 100vh;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  transition: all 500ms linear;
}
.form--container {
  width: 100%;
  margin: 50px auto;
}
.form--title {
  text-align: center;
  margin: 2rem 0;
}
.validations {
  display: flex;
  justify-content: center;
  color: #ff0000;
  padding: 0.5rem;
  border-radius: 5px;
}
.form--item {
  display: flex;
  flex-direction: column;
  border: none;
  margin: 0px 0px 20px;
  padding: 0px;
}
.form--label {
  font-size: 14px;
  color: rgb(61, 79, 88);
  position: relative;
  height: 16px;
  text-align: left;
  font-weight: bold;
  line-height: 16px;
  letter-spacing: 0.02em;
}
.form--input {
  background-color: rgb(255, 255, 255);
  border: 1px solid rgba(229, 231, 235, 1);
  border-radius: 4px;
  height: 52px;
  font-size: 16px;
  line-height: 24px;
  margin-top: 5px;
  padding-left: 12px;
  padding-right: 12px;
  transition: border-color 150ms ease-in-out 0s;
}
.form--button {
  position: relative;
  background-color: transparent;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  -webkit-box-align: stretch;
  height: 45px;
  width: 100%;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 5px;
  border-radius: 4px;
  border-color: transparent;
  text-decoration: none;
  cursor: not-allowed;
  z-index: 0;
  transition: all 150ms ease-in-out 0s;
  box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%);
}
.form--button.isValid {
  cursor: pointer;
  background-color: #0d6efd;
}
.form--button.isValid:hover {
  opacity: 0.5;
}
/* mini */
@media only screen and (min-width: 481px) {
  .form--container {
    width: 410px;
    margin: 0 auto;
  }
}
/* max */
@media only screen and (min-width: 981px) {
}
</style>