import React, { useState, useEffect, useContext } from 'react';
import { Form, Container, Row, Col, Table, Button } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import ShowMoreText from 'react-show-more-text';
import { useQuery, useMutation } from 'react-query';
import Navbar from '../components/Navbar';
import DeleteData from '../components/modal/DeleteData';
import imgEmpty from '../assets/empty.svg';

import { API } from '../config/api';

export default function Home() {

    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])
    const title = 'Home';
    document.title = 'crud | ' + title;

    const [idDelete, setIdDelete] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let { data: students, refetch } = useQuery('studentsCache', async () => {
        const response = await API.get('/students');
        return response.data.data;
    });
    console.log(students);
    const addProduct = () => {
        navigate('/addstudents');
    };

    const handleUpdate = (id) => {
        navigate('/updatestudents/' + id);
    };

    const handleDelete = (id) => {
        setIdDelete(id);
        handleShow();
    };

    const deleteById = useMutation(async (id) => {
        try {
            await API.delete(`/students/${id}`);
            refetch();
        } catch (error) {
            console.log(error);
        }
    });
    const [dataFilter, setDataFilter] = useState([]);

    function handleChangeStudents(e) {
        if (!e.target.value) {
            setDataFilter(students);
            return;
        }
        const filter = students?.filter((item) => {
            return item.name.toLowerCase().includes(e.target.value.toLowerCase());
        });
        setDataFilter(filter);
    }

    useEffect(() => {
        if (students) setDataFilter(students);
      }, [students]);
    
      const breakpointColumnsObj = {
        default: 6,
        1100: 4,
        700: 3,
        500: 2,
      };
    
    useEffect(() => {
        if (confirmDelete) {
            handleClose();
            deleteById.mutate(idDelete);
            setConfirmDelete(null);
        }
    }, [confirmDelete]);

    return (
        <>
            <Navbar title={title} />
            <div className="d-grid gap-2" >
                <Form>
                    <Row>
                        <Col
                            xs={7}
                            style={{
                                marginLeft: "120px",
                                justifyContent: "center",
                            }}
                        >
                            <Form.Control
                                placeholder="Search for Students"
                                onChange={handleChangeStudents}
                            />
                        </Col>
                        <Col>
                            <Button

                                className="ml-2"
                                type="submit"
                                style={{
                                    padding: 5,
                                    backgroundColor: "red",
                                }}

                            >
                                <AiOutlineSearch size="26px" color="white" />
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <Container className="py-5">
                <Row>
                    <Col xs="6">
                        <div className="text-header-category mb-4">List Product</div>
                    </Col>
                    <Col xs="6" className="text-end">
                        <Button
                            onClick={addProduct}
                            className="btn-dark"
                            style={{ width: '100px' }}
                        >
                            Add
                        </Button>
                    </Col>
                    <Col xs="12">
                        {students?.length !== 0 ? (
                            <Table striped hover size="lg" variant="dark">
                                <thead>
                                    <tr>
                                        <th width="1%" className="text-center">
                                            ID
                                        </th>
                                        <th>Avatar</th>
                                        <th>Name</th>
                                        <th>Gender</th>
                                        <th>Dob</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataFilter?.map((item, index) => (
                                        <tr  key={index} >
                                            <td className="align-middle text-center">{index + 1}</td>
                                            <td className="align-middle">
                                                <img
                                                    src={item?.avatar_url}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                    }}
                                                    alt={item.name}
                                                />
                                            </td>
                                            <td className="align-middle">{item.name}</td>
                                            <td className="align-middle">
                                                <ShowMoreText
                                                    /* Default options */
                                                    lines={1}
                                                    more="show"
                                                    less="hide"
                                                    className="content-css"
                                                    anchorClass="my-anchor-css-class"
                                                    expanded={false}
                                                    width={280}
                                                >
                                                    {item.gender}
                                                </ShowMoreText>
                                            </td>
                                            <td className="align-middle">
                                                {item.dob}
                                            </td>

                                            <td className="align-middle">
                                                <Button
                                                    onClick={() => {
                                                        handleUpdate(item.id);
                                                    }}
                                                    className="btn-sm btn-success me-2"
                                                    style={{ width: '135px' }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        handleDelete(item.id);
                                                    }}
                                                    className="btn-sm btn-danger"
                                                    style={{ width: '135px' }}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center pt-5">
                                <img
                                    src={imgEmpty}
                                    className="img-fluid"
                                    style={{ width: '40%' }}
                                    alt="empty"
                                />
                                <div className="mt-3">No data product</div>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
            <DeleteData
                setConfirmDelete={setConfirmDelete}
                show={show}
                handleClose={handleClose}
            />
        </>
    );
}
