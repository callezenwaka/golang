<template>
  <div class="dashboard">
    <div>
      <h1>Minted NFTs</h1>
      <div v-if="markets.length" class="card--wrapper">
        <NftCard v-for="market in markets" :key="market.tokenId" class="card">
          <template #header>
            <img :src="market.image" alt="market.name" class="card--image" />
          </template>

          <template #body>
            <div class="card--body">
              <h4 class="card--title">{{ market.name }}</h4>
              <p class="card--text" data-v-fae5bece="">{{ market.description }}</p>
            </div>
          </template>

          <template #footer>
            <!-- <div class="card--footer">
              <button type="button" class="button" @click="handleBuy()">Buy</button>
            </div> -->
          </template>
        </NftCard>
        <!-- <div v-for="market in markets" :key="market.tokenId" class="">
          <b-card
            :title="market.name"
            :img-src="market.image"
            :img-alt="market.name"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2"
          >
          <b-card-text>{{ market.price }}</b-card-text>
          </b-card>
        </div> -->
      </div>
      <div v-else>No nft created yet</div>
    </div>
    <div>
      <h1>Sold NFTs</h1>
      <div v-if="sales.length" class="card--wrapper">
        <NftCard v-for="sale in sales" :key="sale.tokenId" class="card">
          <template #header>
            <img :src="sale.image" alt="market.name" class="card--image" />
          </template>

          <template #body>
            <div class="card--body">
              <h4 class="card--title">{{ sale.name }}</h4>
              <p class="card--text" data-v-fae5bece="">{{ sale.description }}</p>
            </div>
          </template>

          <template #footer>
          </template>
        </NftCard>
      </div>
      <div v-else>No sales made yet</div>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { computed, defineComponent, onMounted } from 'vue';
import NftCard from '@/components/NftCard.vue';
import { useStore } from 'vuex';
import Market from '@/types/Market';
export default defineComponent({
  name: 'Dashboard',
  components: {
    NftCard,
  },
  setup() {
    const store = useStore();
    const getMarket = () => store.dispatch('getMarket');
    onMounted(async () => await getMarket());
    const markets = computed((): Market[] => store.getters.markets);
    const sales = computed((): Market[] => store.getters.sales);

    return { markets, sales }
  },
});
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}
</style>