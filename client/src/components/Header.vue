<template>
  <div class="header">
    <nav class="nav">
      <ul class="nav--wrapper">
        <li class="nav--list">
          <router-link class="nav--link" to="/">Home</router-link>
        </li>
        <li v-if="isAuthenticated" class="nav--list">
          <router-link class="nav--link" to="/asset">Asset</router-link>
        </li>
        <li v-if="isAuthenticated" class="nav--list">
          <router-link class="nav--link" to="/dashboard">Dashboard</router-link>
        </li>
        <li v-if="isAuthenticated" class="nav--list">
          <router-link class="nav--link" to="/mint">Mint</router-link>
        </li>
        <li v-if="isAuthenticated" class="nav--list profile">
          <span class="address">
            {{ profile }}
          </span>
          <div class="profile--content">
            <router-link class="nav--link link--item" :to="{ name: 'Login' }" @click.prevent="handleLogout">Logout</router-link>
          </div>
        </li>
        <li v-if="!isAuthenticated" class="nav--list">
          <router-link class="nav--link" to="/login">
            Login
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'
export default defineComponent({
  name: 'Header',
  setup() {
    const store = useStore();
    const router = useRouter();
    const logout = (token: string | null) => store.dispatch('logout', token);
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const address = computed(() => store.getters.address);
    const profile = computed(() => store.getters.profile);
    const handleLogout = async () => {
      try {
        const token = localStorage.getItem('refresh_token');
        await logout(token);
        router.push({ name: "Home" });
      } catch (error) {
        console.log(error);
      }
    };

    return { isAuthenticated, address, profile, handleLogout }
  },
})
</script>

<style scoped>
.header {
  margin: 0;
  padding: 0;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}
.nav a, .address {
  font-weight: bold;
  color: #0d6efd;
}
.nav a.router-link-exact-active {
  color: #6b95d4;
  background-color: #f5f5f5;
}
.nav--wrapper {
  display: flex;
  flex-wrap: wrap;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-bottom: 0;
  list-style: none;
}
.nav--list {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.nav--list:last-child {
  margin-left: auto;
}
.nav--link {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
h3 {
  margin: 40px 0 0;
}
ul,
li {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
li {
  display: inline-block;
}
a {
  color: #0d6efd;
}
/* profile */
.profile {
  position: relative;
}
.profile--icon {
  width: 2rem;
  height: 2rem;
  color: #42b983;
}
.profile--content {
  display: none;
  flex-direction: column;
  position: absolute;
  color: #42b983;
  min-width: max-content;
  z-index: 1;
  background-color: #f5f5f5;
}
.profile:hover .profile--content {
  display: flex;
  top: 54px;
}
.profile:hover .profile--content > .link--item:hover {
  background-color: #ffffff;
}
/* mini */
@media only screen and (min-width: 481px) {
  .profile:hover .profile--content {
    display: flex;
    min-width: 100px;
  }
}
</style>
