/* eslint-disable */
import Logo from '../utils/images/bbb.png'
import { useState,useEffect } from "react";
import { FaUser,FaSignInAlt,FaLock,FaLanguage } from "react-icons/fa"
import { Navbar,Nav,Container,Row,Col,Card,Form,Button } from 'react-bootstrap'
import { authenticate } from "../utils/authorize"
import { withRouter } from 'react-router-dom'
import { Helmet } from "react-helmet";
import axios from "axios";
import Swal from "sweetalert2";
import '../index.css'

const loginFormComponent = (props)=>{
  const [login,setLogin] = useState({username:"",password:""})
  const {username,password} = login
  const inputValue = name=>event=>{
    setLogin({...login,[name]:event.target.value});
  }
  const submitForm=(e)=>{
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API}/login`,{username,password})
    .then(response=>{
      authenticate(response,()=>props.history.push("/"))
      setLogin({...login,username:"",password:""});
    }).catch(err=>{
      Swal.fire('Errors',err.response.data.error,'error');
      setLogin({...login,username:"",password:""});
    })
  }
  return(
    <>
    <Helmet>
      <title>ลงชื่อเข้าใช้งาน | ThanesPGM</title>
    </Helmet>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Container>
      <Navbar.Brand href='/'>
        <h2>
          <img alt="" src={Logo} width="40" height="40" className="d-inline-block align-top" />{' '}
          Thanes Programmer
        </h2>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='ms-auto' style={{ padding: 5 }}>
          <h5 className='text-white'><FaUser /> ลงชื่อเข้าใช้งาน</h5>
        </Nav>
      </Navbar.Collapse>
    </Container> 
    </Navbar>
    <Container style={{ padding: 5, marginTop: 5}}>
      <Row>
        <Col md={3}>
        </Col>
        <Col md={6}>
          <Card className='bg-incard'>
            <Card.Header className='bg-cardheader text-white'>
              <Row>
                <Col lg={6}>
                  <h4 style={{ textAlign: 'left'}}><FaLock /> กรอกชื่อผู้ใช้งาน</h4>
                </Col>
                <Col lg={6} align="right">
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={submitForm}>
                <Row>
                  <Col lg={2}>

                  </Col>
                  <Col lg={8}>
                    <Form.Label className="text-white"><FaUser /> Username : </Form.Label>
                    <Form.Control type="text" placeholder="กรอกusername" value={username} onChange={inputValue("username")} required />
                    <Form.Label className="text-white"><FaLanguage /> Password : </Form.Label>
                    <Form.Control type="password" placeholder="กรอกpassword" value={password} onChange={inputValue("password")} required/> 
                    <hr />
                    <Button type="submit" className='registerbtn'><FaSignInAlt /> ลงชื่อเข้าใช้งาน</Button>  
                  </Col>
                </Row>     
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </> 
  )
}

export default withRouter(loginFormComponent) 