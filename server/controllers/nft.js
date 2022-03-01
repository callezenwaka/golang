'use strict';

// Import packages and dependencies
const { ethers } = require('ethers');
const axios = require('axios');
const fs = require("fs");
const projectId = fs.readFileSync("./secrets/projectId").toString();
// const privateKey = fs.readFileSync("./secrets/privateKey").toString();
// const sender = fs.readFileSync("./secrets/sender").toString();
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
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${projectId}`);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(marketaddress, Market.abi, provider);
    const data = await marketContract.fetchMarketItems();
    // console.log(data)
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
		console.log(error);
		return res.status(500).json('Internal Server Error!');
	}
}
// [END GET ALL]

/**
 * [START GET ALL]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json items
 * Retrieve items
 */
 exports.getAsset = async (req, res, next) => {
	try {
		let nfts = [];
		/* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${projectId}`);
    const wallet = new ethers.Wallet(req.payload.privateKey);
    const signer = wallet.connect(provider);

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);
    const marketContract = new ethers.Contract(marketaddress, Market.abi, signer);
    const data = await marketContract.fetchMyNFTs()
    // console.log(data)
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
      }
      return item
    }))
		return res.status(200).json(nfts);
	} catch (error) {
		console.log(error);
		return res.status(500).json('Internal Server Error!');
	}
}
// [END GET ALL]

/**
 * [START GET ALL]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json items
 * Retrieve items
 */
 exports.getMarket = async (req, res, next) => {
	try {
		let nfts = [];
		/* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${projectId}`);
    const wallet = new ethers.Wallet(req.payload.privateKey);
    const signer = wallet.connect(provider);

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);
    const marketContract = new ethers.Contract(marketaddress, Market.abi, signer);
    const data = await marketContract.fetchItemsCreated()
    // console.log(data)
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
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))

    /* create a filtered array of items that have been sold */
    // const items = nfts.filter(i => i.sold)

		return res.status(200).json(nfts);
	} catch (error) {
		console.log(error);
		return res.status(500).json('Internal Server Error!');
	}
}
// [END GET ALL]

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
    // console.log(req.body);
    const { name, description, image, price } = req.body;
    if (!name || !description || !image || !price) return;
    const data = JSON.stringify({
      name,
      description,
      image
    });
    const result = await client.add(data)
    const url = `https://ipfs.infura.io/ipfs/${result.path}`

    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${projectId}`);
    const wallet = new ethers.Wallet(req.payload.privateKey);
    const signer = wallet.connect(provider);
    // console.log(signer);
    // const signer = provider.getSigner(req.body.signer);

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const _price = ethers.utils.parseUnits(price, 'ether');
    // console.log('here')

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(marketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, _price, { value: listingPrice });
    await transaction.wait();
    return res.status(200).json("Created");
	} catch (error) {
		console.log(error);
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
    if (!req.file) {
      return res.json("Please choose file to upload!");
    }
    // console.log(req.body);
    // console.log(req.file);
    // let val = fs.readFileSync("./package.json")
    // let options = {
    //   warpWithDirectory: false,
    //   progress: (prog) => console.log(`Saved :${prog}`)
    // }
    let result = await client.add(Buffer.from(req.file.buffer));
    const image = `https://ipfs.infura.io/ipfs/${result.path}`;
    console.log(image)
    return res.status(200).json({image});
    // const { name, description } = req.body;
    // const added = await client.add(req.file);
    // console.log("added")
    // const fileURL = `https://ipfs.infura.io/ipfs/${added.path}`;
    // const data = JSON.stringify({
    //   name,
    //   description,
    //   image: fileURL
    // });
    // return res.status(200).json("Created");
  } catch (error) {
    console.log(error);
		return res.status(500).json('Internal Server Error!');
  }
};
// [END POST IMAGE]

/**
 * [START POST]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json item
 * Add item
 */
 exports.getOne = async (req, res, next) => {
	try {
    // console.log(req.params.id);
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${projectId}`);
    const wallet = new ethers.Wallet(req.payload.privateKey);
    const signer = wallet.connect(provider);
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    // const nftContract = new ethers.Contract(marketaddress, Market.abi, signer);
    const marketContract = new ethers.Contract(marketaddress, Market.abi, signer)
    const data = await marketContract.fetchMarketItems();

    const item = await data.find(async i => i.tokenId.toNumber() == Number(req.params.id));
    console.log(item.tokenId.toNumber());
    console.log(Number(req.params.id));
      // if (i.tokenId.toNumber() !== Number(req.params.id)) return;
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
    // console.log(item);
    // console.log('###########################');
    // return item;
    
    console.log(nft);
    // i.tokenId.toNumber() == req.params.id
    // const signer = provider.getSigner(req.body.signer);
    /* user will be prompted to pay the asking proces to complete the transaction */
    const _price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await marketContract.createMarketSale(nftaddress, nft.tokenId, {
      value: _price
    })

    await transaction.wait()
    return res.status(200).json("Purchased");
	} catch (error) {
		console.log(error);
		return res.status(500).json('Internal Server Error!');
	}
}
// [END POST]

/**
 * [START PUT]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json item
 * Update item
 */
//  exports.updateOne = async (req, res, next) => {
// 	try {
// 		let agent = {
// 			displayName: req.body.displayName,
// 			email: req.body.email,
// 			phoneNumber: req.body.phoneNumber,
// 			roles: req.body.roles,
// 			photoURL: req.body.photoURL,
// 			updated_at: Date.now(),
// 		}
// 		await firestore.collection('agents').doc(req.params.id).update(agent);
// 		return res.json({ status: 200, message: 'Ok' });
// 	} catch (error) {
// 		// next(error);
// 		return res.json(error);
// 	}
// }
// [END PUT]

/**
 * [START GET]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json item
 * Retrieve item
 */
//  exports.getOne = async (req, res, next) => {
// 	try {
//     const provider = new ethers.providers.JsonRpcProvider();
//     const signer = provider.getSigner()
//     const contract = new ethers.Contract(marketaddress, Market.abi, signer)

//     /* user will be prompted to pay the asking proces to complete the transaction */
//     const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
//     const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
//       value: price
//     })
//     await transaction.wait();
// 		return res.json(agent);
// 	} catch (error) {
// 		// next(error);
// 		return res.json(error);
// 	}
// }
// [END GET]

/**
 * [START DELETE]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json item
 * Remove item
 */
//  exports.deleteOne = async (req, res, next) => {
// 	try {
// 		await firestore.collection('agents').doc(req.params.id).delete();
// 		return res.json(`Delete successful`);
// 	} catch (error) {
// 		// next(error);
// 		return res.json(error);
// 	}
// }
// [END DELETE]

// export default {
// 	getAll
// }