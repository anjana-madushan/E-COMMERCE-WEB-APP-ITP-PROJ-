const validator = require('validator');

//validation product inputs
function validateProductInput(data) {
  const { name, description, price, category, images: pictures } = data;

  if (!name || !validator.isLength(name, { min: 3, max: 100 })) {
    throw new Error('Product name must be between 3 and 100 characters');
  }

  if (!description || !validator.isLength(description, { max: 500 })) {
    throw new Error('Description cannot exceed 500 characters');
  }

  if (!price || !validator.isNumeric(price.toString())) {
    throw new Error('Price must be a valid number');
  }

  const validCategories = ['technology', 'tablets', 'phones', 'laptops'];
  if (!category || !validCategories.includes(category)) {
    throw new Error('Category must be one of the predefined values');
  }

  console.log(pictures)
  if (!pictures || !Array.isArray(pictures) || pictures.length === 0) {
    throw new Error('At least one image must be uploaded');
  }
  pictures.forEach((picture) => {
    if (!validator.isURL(picture.url)) {
      throw new Error('Invalid image URL');
    }
  });
}

//validation feedback inputs
function validateFeedBackInput(data) {
  const { title, description, image } = data;

  if (!title || !validator.isLength(title, { min: 3, max: 100 })) {
    throw new Error('FeedBack Title must be between 3 and 100 characters');
  }

  if (!description || !validator.isLength(description, { max: 500 })) {
    throw new Error('Description cannot exceed 500 characters');
  }


  if (!image) {
    throw new Error('At least one image must be uploaded');
  }

  if (!validator.isURL(image)) {
    throw new Error('Invalid image URL')
  }
}

module.exports = { validateProductInput, validateFeedBackInput }