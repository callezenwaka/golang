'use strict'

import axios, { AxiosResponse } from "axios";
type method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH" | "purge" | "PURGE" | "link" | "LINK" | "unlink" | "UNLINK" | undefined;

// export default apiClient;
import Nft from '@/types/Nft';
import Key from '@/types/Key';
import Account from '@/types/Account';
import Token from '@/types/Token';
export const request = async <T = never, R = AxiosResponse<T>>(url: string, method: method, token?: string, data?: unknown): Promise<R> => {
  const res = await axios({
    method: method,
    url: `${url}`,
    data: data,
    headers: {
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
	return res.data;
};

// Uncomment for local development
// export const API_URL = 'http://localhost:4000/';
export const API_URL = `https://fullstack-nft.herokuapp.com/`;

export default {
	async addNftImage(token: string, params: File): Promise<string> {
		return await request(`${API_URL}nft/image`, 'post', token, params);
	},
	async addNft(token: string, params: Nft): Promise<unknown> {
		return await request(`${API_URL}nft`, 'post', token, params);
	},
	async getNfts(): Promise<Nft[]> {
		return await request(`${API_URL}nft`, 'get');
	},
	async getAsset(token: string): Promise<Nft[]> {
		return await request(`${API_URL}nft/asset`, 'get', token);
	},
	async getMarket(token: string): Promise<Nft[]> {
		return await request(`${API_URL}nft/market`, 'get', token);
	},
	async getNft(token: string, params: Nft): Promise<string> {
		return await request(`${API_URL}nft/${params.tokenId}`, 'get', token, params);
	},
	async login(params: Key): Promise<Account> {
		return await request(`${API_URL}login`, 'post', "", params);
	},
	async logout(token: string, params: Token): Promise<string> {
		return await request(`${API_URL}logout`, 'post', token, params);
	},
	async refresh(params: Token): Promise<Account> {
		return await request(`${API_URL}refresh`, 'post', "", params);
	},
};