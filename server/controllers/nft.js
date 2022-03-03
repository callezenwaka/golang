'use strict';

// Import packages and dependencies
const { ethers } = require('ethers');
const axios = require('axios');
const { create } = require('ipfs-http-client');
const client = create('https://ipfs.infura.io:5001/api/v0')

const { nftaddress, marketaddress } = require('../config.js');
const NFT = require('../artifacts/contracts/NFT.sol/NFT.json');
const Market = require('../artifacts/contracts/Market.sol/Market.json');

/**
 * [START GET ALL]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json items
 * Retrieve items
 */
exports.getAll = async (req, res, next) => {
	try {
		let nfts = [];
		/* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(marketaddress, Market.abi, provider);
    const data = await marketContract.fetchMarketItems();
		if (!data.length) {
			return res.status(200).json(nfts);
		}
		/*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    nfts = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
		return res.status(200).json(nfts);
	} catch (error) {
		return res.status(500).json('Internal Server Error!');
	}
}
// [END GET ALL]

/**
 * [START GET ASSET]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json items
 * Retrieve assets
 */
 exports.getAsset = async (req, res, next) => {
	try {
		let nfts = [];
		/* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`);
    const wallet = new ethers.Wallet(req.payload.privateKey);
    const signer = wallet.connect(provider);

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);
    const marketContract = new ethers.Contract(marketaddress, Market.abi, signer);
    const data = await marketContract.fetchMyNFTs();
		if (!data.length) {
			return res.status(200).json(nfts);
		}
		/*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    nfts = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        image: meta.data.image,
        name: meta.data.name,
        seller: i.seller,
        owner: i.owner,
      }
      return item
    }))
		return res.status(200).json(nfts);
	} catch (error) {
		return res.status(500).json('Internal Server Error!');
	}
}
// [END GET ASSET]

/**
 * [START GET MARKET]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json items
 * Retrieve market items
 */
 exports.getMarket = async (req, res, next) => {
	try {
		let nfts = [];
		/* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`);
    const wallet = new ethers.Wallet(req.payload.privateKey);
    const signer = wallet.connect(provider);

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);
    const marketContract = new ethers.Contract(marketaddress, Market.abi, signer);
    const data = await marketContract.fetchItemsCreated();
		if (!data.length) {
			return res.status(200).json(nfts);
		}
		/*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    nfts = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        image: meta.data.image,
        name: meta.data.name,
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
      }
      return item
    }))

		return res.status(200).json(nfts);
	} catch (error) {
		return res.status(500).json('Internal Server Error!');
	}
}
// [END GET MARKET]

/**
 * [START POST]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json item
 * Add item
 */
exports.postOne = async (req, res, next) => {
	try {
    // 
    const { name, description, image, price } = req.body;
    if (!name || !description || !image || !price) return;
    const data = JSON.stringify({
      name,
      description,
      image
    });
    const result = await client.add(data)
    const url = `https://ipfs.infura.io/ipfs/${result.path}`

    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`);
    const wallet = new ethers.Wallet(req.payload.privateKey);
    const signer = wallet.connect(provider);

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const _price = ethers.utils.parseUnits(price, 'ether');

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(marketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, _price, { value: listingPrice });
    await transaction.wait();
    return res.status(200).json("Created");
	} catch (error) {
		return res.status(500).json('Internal Server Error!');
	}
}
// [END POST]

/**
 * [START POST IMAGE]
 * Create a request. If an image is uploaded, add public URL from cloud storage to firestore
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object}
 * Add image
 */
 exports.postImage = async (req, res, next) => {
  try {
    // Add file
    if (!req.file) {
      return res.json("Please choose file to upload!");
    }

    // Send url back to client
    let result = await client.add(Buffer.from(req.file.buffer));
    const image = `https://ipfs.infura.io/ipfs/${result.path}`;
    return res.status(200).json(image);
  } catch (error) {
		return res.status(500).json('Internal Server Error!');
  }
};
// [END POST IMAGE]

/**
 * [START GET ONE]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json item
 * Buy item
 */
 exports.getOne = async (req, res, next) => {
	try {
    // Buy asset
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`);
    const wallet = new ethers.Wallet(req.payload.privateKey);
    const signer = wallet.connect(provider);
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    const marketContract = new ethers.Contract(marketaddress, Market.abi, signer)
    const data = await marketContract.fetchMarketItems();

    // const item = await data.find(i => i.tokenId.toNumber() == Number(req.params.id));
    const item = await data.find( i => {
      return i.tokenId.toNumber() == Number(req.params.id)
    });
    const tokenUri = await nftContract.tokenURI(item.tokenId)
    const meta = await axios.get(tokenUri)
    let price = ethers.utils.formatUnits(item.price.toString(), 'ether')
    let nft = {
      price,
      tokenId: item.tokenId.toNumber(),
      seller: item.seller,
      owner: item.owner,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,
    }

    /* user will be prompted to pay the asking proces to complete the transaction */
    const _price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await marketContract.createMarketSale(nftaddress, nft.tokenId, {
      value: _price
    })

    await transaction.wait()
    return res.status(200).json("Purchased");
	} catch (error) {
		return res.status(500).json('Internal Server Error!');
	}
}
// [END GET ONE]