'use strict'

// Import packages and dependencies
const { verify, sign } = require('jsonwebtoken')
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');
const { ethers } = require('ethers');

let refreshTokens = [];

/**
 * [START LOGIN]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json items
 * Login
 */
exports.login = async (req, res, next) => {
  try {
    // take the refresh token from the user
    // console.log(req.body)
    const { privateKey } = req.body;
    if (!privateKey) res.status(400).json("Private key is incorrect!");

    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`);
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider);

    const accessToken = generateAccessToken(privateKey);
    const refreshToken = generateRefreshToken(privateKey);
    refreshTokens.push(refreshToken);

    res.status(200).json({
      address: signer.address,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    // console.log(error)
    return res.status(500).json('Internal Server Error!');
  }
}
// [END LOGIN]

/**
 * [START REFRESH TOKEN]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json items
 * Refresh token
 */
 exports.refresh = async (req, res, next) => {
  try {
    // take the refresh token from the user
    const refreshToken = req.body.token;
    // console.log(req.body.token)

    //send error if there is no token or it's invalid
    if (!refreshToken) return res.status(401).json('Unauthorized!')
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json('Forbidden!')
    }

    const payload = await verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`);

    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`);
    const wallet = new ethers.Wallet(payload.privateKey);
    const signer = wallet.connect(provider);

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(payload.privateKey);
    const newRefreshToken = generateRefreshToken(payload.privateKey);
    refreshTokens.push(newRefreshToken);
    res.status(200).json({ 
      address: signer.address,
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error!')
  }
}
// [END REFRESH TOKEN]

/**
 * [START LOGOUT]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * @return {object} json items
 * Login
 */
 exports.logout = async (req, res, next) => {
  try {
    // console.log(req.body)
    // take the refresh token from the user
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);

    res.status(200).json("You logged out successfully.");
  } catch (error) {
    // console.log(error)
    return res.status(500).json('Internal Server Error!');
  }
}
// [END LOGOUT]
