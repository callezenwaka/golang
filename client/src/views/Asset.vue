<template>
  <div class="asset">
    <h1>Acquired Assets</h1>
    <div v-if="assets.length" class="card--wrapper">
      <NftCard v-for="asset in assets" :key="asset.tokenId" class="card">
       <template #header>
          <img :src="asset.image" alt="asset.name" class="card--image" />
        </template>

        <template #body>
          <div class="card--body">
            <h4 class="card--title">{{ asset.name }}</h4>
            <p class="card--text" data-v-fae5bece="">{{ asset.description }}</p>
          </div>
        </template>

        <template #footer>
        </template>
      </NftCard>
    </div>
    <div v-else>No asset acquired yet</div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { computed, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import NftCard from '@/components/NftCard.vue';
import Asset from '@/types/Asset';
export default defineComponent({
  name: 'Asset',
  components: {
    NftCard,
  },
  setup() {
    const store = useStore();
    const getAsset = () => store.dispatch('getAsset');
    onMounted(async () => await getAsset());
    const assets = computed((): Asset[] => store.getters.assets);

    return { assets }
  },
});
</script>

<style scoped>
.asset {
  padding: 2rem;
}
</style>
