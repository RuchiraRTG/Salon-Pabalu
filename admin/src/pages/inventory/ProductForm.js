import React, { useState } from 'react';
import axios from 'axios';
import { useAuthToken } from '../../auth';
import { useNavigate } from "react-router-dom";
import './ProductForm.css'

function AddProduct() {
    var token = useAuthToken();
    var navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [weight, setWeight] = useState('');
    const [discount, setDiscount] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formIsValid = true;
        let errors = {};

        // Name validation (only letters)
        if (!/^[A-Za-z]+$/.test(name)) {
            formIsValid = false;
            errors.name = "Name must contain only letters.";
        }

        // Description validation (cannot be only numeric)
        if (/^\d+$/.test(description)) {
            formIsValid = false;
            errors.description = "Description cannot be only numeric.";
        }

        // Brand validation (cannot be only numeric, but can be letters or alphanumeric)
        if (/^\d+$/.test(brand)) {
            formIsValid = false;
            errors.brand = "Brand cannot be only numeric.";
        }

        // Price validation (must be numeric)
        if (isNaN(price) || price <= 0) {
            formIsValid = false;
            errors.price = "Price must be a positive number.";
        }

        // Quantity validation (must be numeric)
        if (isNaN(quantity) || quantity < 0) {
            formIsValid = false;
            errors.quantity = "Quantity must be a non-negative number.";
        }

        // Weight validation (must be numeric)
        if (weight && isNaN(weight)) {
            formIsValid = false;
            errors.weight = "Weight must be numeric.";
        }

        // Discount validation (must be numeric)
        if (discount && isNaN(discount)) {
            formIsValid = false;
            errors.discount = "Discount must be numeric.";
        }

        if (!formIsValid) {
            setError(errors);
            return;
        }

        const formData = new FormData();
        formData.append("token", token);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('brand', brand);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('weight', weight);
        formData.append('discount', discount);
        formData.append('thumbnail', image);

        if (token != null) {
            axios.post("http://localhost:5000/product/add", formData).then((response) => {
                var data = response.data;
                var status = data.status;
                if (status === "success") {
                    window.alert('Product added successfully!');  // Display popup message
                    setError({});
                    // Clear form fields after successful submission
                    setName('');
                    setDescription('');
                    setCategory('');
                    setBrand('');
                    setPrice('');
                    setQuantity('');
                    setWeight('');
                    setDiscount('');
                    setImage(null);
                } else if (status === "token_expired" || status === "auth_failed") {
                    navigate("/signout");
                } else {
                    alert("Error - " + data.message);
                }
            }).catch((error) => {
                alert("Error 2 - " + error);
            });
        } else {
            navigate("/signout");
        }
    };

    return (
        <div className="PAformout">
            <h2 className="PAtopic">Add Product</h2>
            <form className="PAproductForm" onSubmit={handleSubmit}>
                <div className="PAform-group">
                    <label>Name:</label>
                    <input type="text" className="PAinarea" value={name} onChange={(e) => setName(e.target.value)} required />
                    {error.name && <p style={{ color: 'red' }}>{error.name}</p>}
                </div>
                <div className="PAform-group">
                    <label>Description:</label>
                    <input type="text" className="PAinarea" value={description} onChange={(e) => setDescription(e.target.value)} />
                    {error.description && <p style={{ color: 'red' }}>{error.description}</p>}
                </div>
                <div className="PAform-group">
                    <label>Category:</label>
                    <select id="productCategory" className="PAinarea" value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option>Select Category</option>
                        <option>Hair Care Product</option>
                        <option>Skin Care Product</option>
                        <option>Nail Care Product</option>
                        <option>Lips Care Product</option>
                    </select>
                </div>
                <div className="PAform-group">
                    <label>Brand:</label>
                    <input type="text" className="PAinarea" value={brand} onChange={(e) => setBrand(e.target.value)} />
                    {error.brand && <p style={{ color: 'red' }}>{error.brand}</p>}
                </div>
                <div className="PAform-group">
                    <label>Price:</label>
                    <input type="text" className="PAinarea" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    {error.price && <p style={{ color: 'red' }}>{error.price}</p>}
                </div>
                <div className="PAform-group">
                    <label>Quantity:</label>
                    <input type="number" className="PAinarea" value={quantity} min="0" step="1" onChange={(e) => setQuantity(e.target.value)} required />
                    {error.quantity && <p style={{ color: 'red' }}>{error.quantity}</p>}
                </div>
                <div className="PAform-group">
                    <label>Weight:</label>
                    <input type="text" className="PAinarea" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    {error.weight && <p style={{ color: 'red' }}>{error.weight}</p>}
                </div>
                <div className="PAform-group">
                    <label>Discount:</label>
                    <input type="text" className="PAinarea" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                    {error.discount && <p style={{ color: 'red' }}>{error.discount}</p>}
                </div>
                <div className="PAform-group">
                    <label>Thumbnail:</label>
                    <input type="file" className="PAinarea" onChange={(e) => setImage(e.target.files[0])} accept="image/*" required />
                </div>
                <button type="submit" className="PAbtn">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;
