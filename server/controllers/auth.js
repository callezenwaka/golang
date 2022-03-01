'use strict'

// Import packages and dependencies
const { verify, sign } = require('jsonwebtoken')
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');
const { ethers } = require('ethers')
const fs = require("fs");
const projectId = fs.readFileSync("./secrets/projectId").toString();

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
    const { privateKey } = req.body;
    // return res.status(200).json(privateKey);

    if (!privateKey) res.status(400).json("Private key is incorrect!");

    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${projectId}`);
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
    const refreshToken = req.body.token

    //send error if there is no token or it's invalid
    if (!refreshToken) return res.status(401).json('Unauthorized!')
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json('Forbidden!')
    }

    const privateKey = await verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(privateKey);
    const newRefreshToken = generateRefreshToken(privateKey);
    refreshTokens.push(newRefreshToken);
    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
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
    // take the refresh token from the user
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);

    res.status(200).json("You logged out successfully.");
  } catch (error) {
    return res.status(500).json('Internal Server Error!');
  }
}
// [END LOGOUT]
