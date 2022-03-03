import { createStore } from 'vuex';
import Nft from '@/types/Nft';
import index from '@/services';

export default createStore({
  state: {
    nfts: [] as Nft[],
    nft: {} as Nft,
    assets: [] as Nft[],
    markets: [] as Nft[],
    sales: [] as Nft[],
    address: '',
    token: '',
    refresh_token: '',
    isLoading: false,
  },
  getters: {
    nfts: state => state.nfts,
    nft: state => state.nft,
    assets: state => state.assets,
    markets: state => state.markets,
    sales: state => state.sales,
    address: state => state.address,
    token: state => state.token,
    refresh_token: state => state.refresh_token,
    profile: state => state.address && `${state.address.slice(0, 4)}...${state.address.slice(state.address.length - 3)}`,
    isAuthenticated: state => state.address && state.address != ''? true : false,
    isLoading: state => state.isLoading,
  },
  actions: {
    async addNftImage(context, payload) {
      try {
        // TODO: api call
        const data = await index.addNftImage(context.state.token, payload);
        return data;
      } catch (error) {
        return;
      }
    },
    async addNft(context, payload) {
      try {
        // TODO: api call
        context.dispatch('loading', true);
        await index.addNft(context.state.token, payload);
        context.dispatch('getNfts', payload);
        context.dispatch('loading', false);
        return;
      } catch (error) {
        return;
      }
    },
    async getNfts(context, payload) {
      try {
        if (!payload && context.state.nfts && !!context.state.nfts.length) return context.state.nfts;
        // TODO: api call
        context.dispatch('loading', true);
        const data = await index.getNfts();
        if (!Array.isArray(data)) return;
        context.commit('SET_NFTS', data);
        context.dispatch('loading', false);
        return;
      } catch (error) {
        return;
      }
    },
    async getAsset(context, payload) {
      try {
        if (!payload && context.state.assets && !!context.state.assets.length) return context.state.assets;
        // TODO: api call
        context.dispatch('loading', true);
        const data = await index.getAsset(context.state.token);
        if (!Array.isArray(data)) return;
        context.commit('SET_ASSETS', data);
        context.dispatch('loading', false);
        return;
      } catch (error) {
        return;
      }
    },
    async getMarket(context, payload) {
      try {
        if (!payload && context.state.markets && !!context.state.markets.length) return context.state.markets;
        // TODO: api call
        context.dispatch('loading', true);
        const data = await index.getMarket(context.state.token);
        if (!Array.isArray(data)) return;
        context.commit('SET_MARKETS', data);
        context.commit('SET_SALES', data.filter(i => i.sold));
        context.dispatch('loading', false);
        return;
      } catch (error) {
        return;
      }
    },
    async getNft(context, payload) {
      try {
        // TODO: api call
        context.dispatch('loading', true);
        const data = await index.getNft(context.state.token, payload);
        if (typeof data != 'string') return;
        context.dispatch('getNfts', payload);
        context.dispatch('getAsset', payload);
        context.dispatch('loading', false);
        return data;
      } catch (error) {
        return;
      }
    },
    async login(context, payload) {
			try {
        // TODO: api call
        const data = await index.login(payload);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('address', data.address);
        context.commit('SET_TOKEN', data.accessToken);
        context.commit('SET_REFRESH_TOKEN', data.refreshToken);
        context.commit('SET_ADDRESS', data.address);
      } catch (error) {
        return;
      }
		},
    async refresh(context, payload) {
      try {
        // TODO: api call
        // const { data } = await index.refresh(context.state.token, payload);
        const data = await index.refresh({token: payload});
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('address', data.address);
        context.commit('SET_TOKEN', data.accessToken);
        context.commit('SET_REFRESH_TOKEN', data.refreshToken);
        context.commit('SET_ADDRESS', data.address);
      } catch (error) {
        return;
      }
		},
    async fetch(context) {
      try {
        // TODO: api call
        context.commit('SET_TOKEN', localStorage.getItem('token'));
        context.commit('SET_REFRESH_TOKEN', localStorage.getItem('refresh_token'));
        context.commit('SET_ADDRESS', localStorage.getItem('address'));
      } catch (error) {
        return;
      }
		},
    async logout(context, payload) {
			try {
        // TODO: api call
        const data = await index.logout(context.state.token, {token: payload});
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('address');
        context.commit('SET_TOKEN', '');
        context.commit('SET_REFRESH_TOKEN', '');
        context.commit('SET_ADDRESS', '');
        return data;
      } catch (error) {
        return;
      }
		},
    async loading(context, payload) {
			try {
        // TODO: api call
        context.commit('SET_LOADING', payload);
        return;
      } catch (error) {
        return;
      }
		},
  },
  mutations: {
    ADD_NFT(state, nft: Nft) {
      state.nfts.unshift(nft);
    },
    SET_NFTS(state, nfts) {
      state.nfts = nfts;
    },
    SET_ASSETS(state, assets) {
      state.assets = assets;
    },
    SET_MARKETS(state, markets) {
      state.markets = markets;
    },
    SET_SALES(state, sales) {
      state.sales = sales;
    },
    SET_NFT(state, nft) {
      state.nft = nft;
    },
    SET_ADDRESS(state, address) {
      state.address = address;
		},
    SET_TOKEN(state, token) {
			state.token = token;
		},
    SET_REFRESH_TOKEN(state, refresh_token) {
			state.refresh_token = refresh_token;
		},
    SET_LOADING(state, isLoading) {
			state.isLoading = isLoading;
		},
  },
  modules: {
  }
})