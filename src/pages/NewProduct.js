import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Form, Row, Button } from "react-bootstrap";
import { useCreateProductMutation } from '../services/appApi';
import axios from '../axios';
import validator from 'validator'; // Importing the validator library
import '../CSS/NewProduct.css';
import { cloudName, uploadPreset } from '../utils/frontend_thresould'

function NewProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imgToRemove, setImgToRemove] = useState(null);
  const navigate = useNavigate();
  const [createProduct, { isError, error, isLoading, isSuccess }] = useCreateProductMutation();

  // Function to sanitize input
  function sanitizeInput(input) {
    return validator.escape(input); // Escape special characters
  }

  // Input validation function
  function validateInputs() {
    if (!name || !description || !price || !category || !images.length) {
      return "Please fill out all the fields.";
    }
    if (!validator.isNumeric(price) || price <= 0) {
      return "Please enter a valid price greater than zero.";
    }
    if (!validator.isLength(name, { min: 3 })) {
      return "Product name must be at least 3 characters long.";
    }
    return null; // No errors
  }

  function handleRemoveImg(imgObj) {
    setImgToRemove(imgObj.public_id);
    axios
      .delete(`/images/${imgObj.public_id}/`)
      .then((res) => {
        setImgToRemove(null);
        setImages((prev) => prev.filter((img) => img.public_id !== imgObj.public_id));
      })
      .catch((e) => console.log(e));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      return alert(validationError); // Show validation error
    }

    // Sanitize inputs before submission
    const sanitizedData = {
      name: sanitizeInput(name),
      description: sanitizeInput(description),
      price: parseFloat(price),
      category: sanitizeInput(category),
      images: images,
    };

    createProduct(sanitizedData).then((response) => {
      // Check if the response is valid
      if (response.data) {
        // Access data safely
        if (response.data.length > 0) {
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          alert("Product created, but no data returned."); // Handle case when data is empty
        }
      } else {
        // Handle unexpected response shape
        console.error("Unexpected response structure:", response);
        alert("Failed to create product. Please try again.");
      }
    }).catch((err) => {
      // Handle error case
      console.error("Error creating product:", err);
      alert("An error occurred while creating the product. Please try again.");
    });
  }

  function showWidget() {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
      },
      (error, result) => {
        if (!error && result.event === "success") {
          setImages((prev) => [...prev, { url: result.info.url, public_id: result.info.public_id }]);
        }
      }
    );
    widget.open();
  }

  return (
    <Container>
      <Row>
        <Col md={6} className="new-product__from--container">
          <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <h1 className='mt-4'>Create a Product</h1>
            {isSuccess && <Alert variant="success">Product created successfully!</Alert>}
            {isError && <Alert variant="danger">{error.data}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Product name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Product description"
                style={{ height: "100px" }}
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (Rs)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Price"
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" onChange={(e) => setCategory(e.target.value)}>
              <Form.Label>Category</Form.Label>
              <Form.Select required>
                <option disabled selected>-- Select One --</option>
                <option value="technology">Technology</option>
                <option value="tablets">Tablets</option>
                <option value="phones">Phones</option>
                <option value="laptops">Laptops</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Button type="button" onClick={showWidget}>
                Upload Images
              </Button>
              <div className="images-preview-container">
                {images.map((image) => (
                  <div className="image-preview" key={image.public_id}>
                    <img src={image.url} alt="preview" />
                    {imgToRemove !== image.public_id && (
                      <i className="fa fa-times-circle" onClick={() => handleRemoveImg(image)}></i>
                    )}
                  </div>
                ))}
              </div>
            </Form.Group>

            <Form.Group>
              <Button type="submit" disabled={isLoading || isSuccess}>Create Product</Button>
            </Form.Group>
          </Form>
        </Col>
        <Col md={6} className="new-product__image--container"></Col>
      </Row>
    </Container>
  );
}

export default NewProduct;
