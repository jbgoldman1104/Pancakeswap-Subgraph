/* eslint-disable prefer-const */
import { BigDecimal, Address } from "@graphprotocol/graph-ts/index";
import { Pair, Token, Bundle } from "../generated/schema";
import { ZERO_BD, factoryContract, ADDRESS_ZERO, ONE_BD } from "./utils";
import {
  ethereum,
  BigInt, log
} from "@graphprotocol/graph-ts";

let CNO_ADDRESS = "0x322e21dcace43d319646756656b29976291d7c76";
let USDC_CNO_PAIR = "0x50af1c38af0481c9d06f72a045274201781773ae";
let USDT_CNO_PAIR = "0x07d47d97b717c6cfdb23b434273e51ac05ebb46a";

export function getBnbPriceInUSD(): BigDecimal {
  // fetch eth prices for each stablecoin
  let usdtPair = Pair.load(USDT_CNO_PAIR); // usdt is token0
  let usdcPair = Pair.load(USDC_CNO_PAIR); // usdc is token1

  if (usdcPair !== null && usdtPair !== null) {
    let totalLiquidityBNB = usdcPair.reserve0.plus(usdtPair.reserve1);
    if (totalLiquidityBNB.notEqual(ZERO_BD)) {
      let usdcWeight = usdcPair.reserve0.div(totalLiquidityBNB);
      let usdtWeight = usdtPair.reserve1.div(totalLiquidityBNB);

      //log.info('---------------usdcWeight {} usdtWeight {}, ret {}\n', 
      //[usdcWeight.toString(), usdtWeight.toString(), ( usdcPair.token1Price.times(usdcWeight).plus(usdtPair.token0Price.times(usdtWeight)) ).toString()]);

      return usdcPair.token1Price.times(usdcWeight).plus(usdtPair.token0Price.times(usdtWeight));
    } else {
      return ZERO_BD;
    }
  } else if (usdcPair !== null) {
    return usdcPair.token1Price;
  } else if (usdtPair !== null) {
    return usdtPair.token0Price;
  } else {
    return ZERO_BD;
  }
}

// // token where amounts should contribute to tracked volume and liquidity
// let WHITELIST: string[] = [
//   "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", // WCRO
//   "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
//   "0x55d398326f99059ff775485246999027b3197955", // USDT
//   "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // USDC
//   "0x23396cf899ca06c4472205fc903bdb4de249d6fc", // UST
//   "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c", // BTCB
//   "0x2170ed0880ac9a755fd29b2688956bd959f933f8", // WETH
// ];

// token where amounts should contribute to tracked volume and liquidity
let WHITELIST: string[] = [
  "0x322e21dcace43d319646756656b29976291d7c76", // CNO : must lower case
  "0xca2503482e5d6d762b524978f400f03e38d5f962", // WCRO
  "0x89610846dadab76a8b5b2db0a4d33d743bce4d43", // CHRONOBAR
  "0xf2001b145b43032aaf5ee2884e456ccd805f677d", // DAI
  "0xc21223249ca28397b4b6541dffaecc539bff0c59", // USDC
  "0x66e428c3f67a68878562e79a0234c1f83c208770", // USDT
  "0xb888d8dd1733d72681b30c00ee76bde93ae7aa93", // ATOM
  "0x1a8e39ae59e5556b56b76fcba98d22c9ae557396" // DOGE
];

// minimum liquidity for price to get tracked
let MINIMUM_LIQUIDITY_THRESHOLD_BNB = BigDecimal.fromString("10");

/**
 * Search through graph to find derived BNB per token.
 * @todo update to be derived BNB (add stablecoin estimates)
 **/
export function findBnbPerToken(token: Token): BigDecimal {
  //log.info('############### findBnbPerToken param <{}:{}> \n', 
  //[token.id, CNO_ADDRESS]);

  if (CNO_ADDRESS == token.id) {
    //log.info('++++++++++++++++++++ CNO Token Price is 1 +++++++++++++++++++++++ {}\n\n', ['']);
    return ONE_BD;
  }
  // loop through whitelist and check if paired with any
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i]));

    //log.info('Check pair exists between {} -> {}\n', [token.id, WHITELIST[i]]);
    
    if (pairAddress.toHex() != ADDRESS_ZERO) {
      let pair = Pair.load(pairAddress.toHex());
      
      //log.info('===========Pair Information : {}===============\n', [pairAddress.toHex().toString()]);
      //log.info('token0 : {}\n token1 : {}\n reserve0: {}\n reserve1: {}\n totalSupply: {}\n reserveBNB: {}\n',
       //[pair.token0, pair.token1, pair.reserve0.toString(), pair.reserve1.toString(), pair.totalSupply.toString(), pair.reserveBNB.toString()]);
      

      //log.info('Pair Exists : {} reserveBNB : {}\n', [pairAddress.toHex(), pair.reserveBNB.toString()]);
      
      if (pair.token0 == token.id && pair.reserveBNB.gt(MINIMUM_LIQUIDITY_THRESHOLD_BNB)) {
      //if (pair.token0 == token.id) {
        let token1 = Token.load(pair.token1);
        
        //log.info("Token price : {} * {} = {}\n", 
        //[pair.token1Price.toString(), token1.derivedBNB.toString(), pair.token1Price.times(token1.derivedBNB as BigDecimal).toString()]);
        
        return pair.token1Price.times(token1.derivedBNB as BigDecimal); // return token1 per our token * BNB per token 1
      }
      if (pair.token1 == token.id && pair.reserveBNB.gt(MINIMUM_LIQUIDITY_THRESHOLD_BNB)) {
      //if (pair.token1 == token.id) {
        let token0 = Token.load(pair.token0);
        
        //log.info("Token price : {} * {} = {}\n", 
        //[pair.token0Price.toString(), token0.derivedBNB.toString(), pair.token0Price.times(token0.derivedBNB as BigDecimal).toString()]);
        
        return pair.token0Price.times(token0.derivedBNB as BigDecimal); // return token0 per our token * BNB per token 0
      }
    }
  }
  return ZERO_BD; // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  bundle: Bundle,
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let price0 = token0.derivedBNB.times(bundle.bnbPrice);
  let price1 = token1.derivedBNB.times(bundle.bnbPrice);

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1)).div(BigDecimal.fromString("2"));
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0);
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1);
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  bundle: Bundle,
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let price0 = token0.derivedBNB.times(bundle.bnbPrice);
  let price1 = token1.derivedBNB.times(bundle.bnbPrice);

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1));
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString("2"));
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString("2"));
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}
