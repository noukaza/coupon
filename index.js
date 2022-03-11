const {
    keccak256,
    toBuffer,
    ecsign,
    privateToAddress,
    bufferToHex,
  } = require("ethereumjs-utils");
  const { ethers } = require('ethers');
  const crypto = require("crypto");
const la = "0x7CE7Ff6224E04990ECDCae684AC1819673faCCd2"
let presaleAddresses= ["0x8753dFd2e4F782DdD97F7bfEFFfa569630C1279e"]
const signerPvtKey= Buffer.from("cef733f1313b3afdbf25bbb5b24112f04aa27188210d9df20d5cdb24eec3a5c3", "hex")  // create an object to match the contracts struct
  const CouponTypeEnum = {
    Genesis: 0,
    Author: 1,
    Presale: 2,
  };
  let coupons = {};
  for (let i = 0; i < presaleAddresses.length; i++) {
    const userAddress = ethers.utils.getAddress(presaleAddresses[i]);
    const hashBuffer = generateHashBuffer(
      ["uint256", "address"],
      [CouponTypeEnum["Presale"], userAddress]
    );
    const coupon = createCoupon(hashBuffer, signerPvtKey);
    
    coupons[userAddress] = {
      coupon: serializeCoupon(coupon)
    };
  }
  // HELPER FUNCTIONS
  function createCoupon(hash, signerPvtKey) {
     return ecsign(hash, signerPvtKey);
  }
  function generateHashBuffer(typesArray, valueArray) {
     return keccak256(
       toBuffer(ethers.utils.defaultAbiCoder.encode(typesArray,
       valueArray))
     );
  }
  function serializeCoupon(coupon) {
     return {
       r: bufferToHex(coupon.r),
       s: bufferToHex(coupon.s),
       v: coupon.v,
     };
  }

  console.log(coupons)

  const pvtKey = crypto.randomBytes(32);
  const pvtKeyString = pvtKey.toString("hex");
const signerAddress = ethers.utils.getAddress(privateToAddress(pvtKey).toString("hex"));
console.log({ signerAddress, pvtKeyString });