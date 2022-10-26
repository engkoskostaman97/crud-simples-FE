import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useMutation } from "react-query";

import Navbar from "../components/Navbar";

import { API } from "../config/api";

export default function Addstudent() {
    // console.clear();
    const title = "Add Student";
    document.title = "crud | " + title;

    let navigate = useNavigate();

    const [preview, setPreview] = useState(null); //For image preview
    const [form, setForm] = useState({
        avatar: "",
        name: "",
        gender: "",
        dob: "",
    }); //Store product data


   


    // Handle change data on form
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === "file" ? e.target.files : e.target.value,
        });

        // Create image url for preview
        if (e.target.type === "file") {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            // Configuration
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            // Store data with FormData as object
            const formData = new FormData();
            formData.set("avatar", form.avatar[0], form.avatar[0].name);
            formData.set("name", form.name);
            formData.set("gender", form.gender);
            formData.set("dob", form.dob);

            // Insert product data
            const response = await API.post("/students", formData, config);
            console.log("response.data.data");
            console.log(response.data.data);

            if (response.data.code == 200) {
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    });

  
    return (
        <>
            <Navbar title={title} />
            <Container className="py-5">
                <Row>
                    <Col xs="12">
                        <div className="text-header-category mb-4">Add Product</div>
                    </Col>
                    <Col xs="12">
                        <form onSubmit={(e) => handleSubmit.mutate(e)}>
                            {preview && (
                                <div>
                                    <img
                                        src={preview}
                                        style={{
                                            maxWidth: "150px",
                                            maxHeight: "150px",
                                            objectFit: "cover",
                                        }}
                                        alt={preview}
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                id="upload"
                                name="avatar"
                                hidden
                                onChange={handleChange}
                            />
                            <label for="upload" className="label-file-add-product">
                                Upload file
                            </label>
                            <input
                                type="text"
                                placeholder="Name"
                                name="name"
                                onChange={handleChange}
                                className="input-edit-category mt-4"
                            />
                               <input
                                type="text"
                                placeholder="Gender"
                                name="gender"
                                onChange={handleChange}
                                className="input-edit-category mt-4"
                            />
                         
                            <input
                                type="date"
                                placeholder="Dob"
                                name="dob"
                                onChange={handleChange}
                                className="input-edit-category mt-4"
                            />

                            <div className="d-grid gap-2 mt-4">
                                <Button type="submit" variant="success" size="md">
                                    Add
                                </Button>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
