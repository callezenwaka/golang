<template>
  <div class="home">
    <div v-if="nfts.length" class="card--wrapper">
      <NftCard v-for="nft in nfts" :key="nft.tokenId" class="card">
        <template #header>
          <img :src="nft.image" alt="nft.name" class="card--image" />
        </template>

        <template #body>
          <div class="card--body">
            <h4 class="card--title">{{ nft.name }}</h4>
            <p class="card--text" data-v-fae5bece="">{{ nft.description }}</p>
          </div>
        </template>

        <template #footer>
          <div class="card--footer">
            <button type="button" class="button" @click="handleBuy(nft)">Buy</button>
          </div>
        </template>
      </NftCard>
    </div>
    <div v-else>No items in marketplace</div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { computed, defineComponent, onMounted } from 'vue';
import NftCard from '@/components/NftCard.vue';
import { useStore } from 'vuex';
import Nft from '@/types/Nft';
export default defineComponent({
  name: 'Home',
  components: {
    NftCard,
  },
  setup() {
    const store = useStore();
    const getNfts = () => store.dispatch('getNfts');
    const getNft = (nft: Nft) => store.dispatch('getNft', nft);
    onMounted(async () => await getNfts());
    const nfts = computed((): Nft[] => store.getters.nfts);
    const handleBuy = async (nft: Nft) => {
      await getNft(nft);
    };

    return { nfts, handleBuy }
  },
})
</script>

<style scoped>
.home {
  padding: 2rem;
}
</style>
