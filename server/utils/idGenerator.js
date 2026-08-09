const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique order ID in format: StyleHive-order-xxxx
 */
const generateOrderId = () => {
  const uniqueId = uuidv4().split('-')[0].substring(0, 8);
  return `StyleHive-order-${uniqueId}`;
};

/**
 * Generate a unique coupon code in format: coupon-xxxxxxxxx
 */
const generateCouponCode = () => {
  const uniqueId = uuidv4().split('-')[0].substring(0, 9);
  return `coupon-${uniqueId}`;
};

module.exports = { generateOrderId, generateCouponCode };