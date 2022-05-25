/* eslint-disable */
import { FaUserPlus } from "react-icons/fa"
import { BsFillPinMapFill } from "react-icons/bs"
import { BiMap } from "react-icons/bi";
import { Container,Row,Col,Card,Form,Modal,Button } from 'react-bootstrap'
import { useState,useRef } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import axios from "axios";
import '../index.css'
import LocDatatableComponent from '../components/child_components/locDatatableComponent'
import NavbarComponent from '../components/child_components/navbarComponent'
import { getToken,getUserInfo} from "../utils/authorize"

const locFormComponent = ()=>{
  const [Location,setLocation] = useState({locname:"",price:""})
  const {locname,price} = Location;
  const inputValue = name=>event=>{
    setLocation({...Location,[name]:event.target.value});
  }
  //recall childcomponent
  const childCompRef = useRef()
  //modal add location
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const submitForm=(e)=>{
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API}/createlocation`,{locname,price},
    {
      headers:{
        authorization:`Bearer ${getToken()}`
      }
    })
    .then(response=>{
      Toast.fire({
        icon: 'success',
        title: 'เพิ่มสถานที่ปฏิบัติงานสำเร็จ'
      })
      childCompRef.current.reData()
      setLocation({...Location,locname:"",price:""});
    }).catch(err=>{
      if(err.response.statusText == "Unauthorized"){
        window.location = "/login"
      }
      else{
        Swal.fire('Errors',err.response.statusText,'error')
      }
    })
  }

  return(
    <>
    <Helmet>
      <title>จัดการสถานที่ปฏิบัติงาน | {' '+getUserInfo().split(",",1)}</title>
    </Helmet>
    <NavbarComponent />
    <Container style={{ padding: 5, marginTop: 5}}>
    <Row>  
      <Col sm={2}>
      </Col>
      <Col sm={8}>
        <Card className='bg-incard'>
          <Card.Header className='bg-cardheader text-white'>
            <Row>
              <Col sm={5}>
                <h4 style={{ textAlign: 'left'}}><BsFillPinMapFill /> จัดการสถานที่ปฏิบัติงาน</h4>
              </Col>
              <Col sm={7} align="right">
                <Button className="btn-create" onClick={handleShow}> <BiMap size={24} /> เพิ่มสถานที่</Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <LocDatatableComponent ref={childCompRef} />
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </Container>
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={submitForm}>
      <Modal.Header closeButton className='bg-cardheader text-white'>
        <Modal.Title><BiMap size={24} /> เพิ่มสถานที่ปฏิบัติงาน</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-incard text-white'>
        <Form> 
          <Form.Label className="text-white"> ชื่อสถานที่ : </Form.Label>
          <Form.Control type="text" placeholder="ใส่ชื่อสถานที่" value={locname} onChange={inputValue("locname")} required />
          <Form.Label className="text-white"> ค่าเดินทาง : </Form.Label>  
          <Form.Control type="number" placeholder="0.00" value={price} onChange={inputValue("price")} required /> 
        </Form>
      </Modal.Body>
      <Modal.Footer className='bg-cardheader text-white'>
        <Button type="submit" className='btn-create' onClick={handleClose}>
          <FaUserPlus /> เพิ่มสถานที่ทำงาน
        </Button>
      </Modal.Footer>
      </Form>
    </Modal>
    </>
  )
}

export default locFormComponent;