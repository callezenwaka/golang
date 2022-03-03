interface Asset {
  itemId?: number;
  description: string;
  image: string;
  name: string;
  owner?: string;
  seller?: string;
  price: string;
  tokenId: number;
  sold?: boolean;
}

export default Asset;