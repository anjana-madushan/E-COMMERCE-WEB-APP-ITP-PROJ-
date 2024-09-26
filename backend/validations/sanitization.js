const validator = require('validator');

function sanitizeProductInput(data) {
  return {
    name: validator.escape(data.name),
    description: validator.escape(data.description),
    price: data.price,
    category: validator.escape(data.category),
    images: data.images
  };
}

function sanitizeFeedBackInput(data) {
  return {
    title: validator.escape(data.title),
    description: validator.escape(data.description),
  };
}

module.exports = { sanitizeProductInput, sanitizeFeedBackInput }