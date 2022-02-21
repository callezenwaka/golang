'use strict';

// Import packages and dependencies
const {ethers} = require('ethers')
const axios = require('axios')
const fs = require("fs");
const projectId = fs.readFileSync("./secrets/projectId").toString();
const { create: ipfsHttpClient } = require('ipfs-http-client');
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

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
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${projectId}`)
    // const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(marketaddress, Market.abi, provider);
    const data = await marketContract.fetchMarketItems();
    console.log(data)
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
 * [START POST]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json item
 * Add item
 */
 exports.postOne = async (req, res, next) => {
	try {
    const added = await client.add(data)
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
		// const web3Modal = new Web3Modal()
    // const connection = await web3Modal.connect()
    // const provider = new ethers.providers.Web3Provider(connection) 
    const provider = new ethers.providers.JsonRpcProvider();   
    const signer = provider.getSigner(req.body.signer);

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice });
    await transaction.wait();
    return res.status(200).json("Created");
	} catch (error) {
		// next(error);
		return res.json(error);
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