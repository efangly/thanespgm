/* eslint-disable */
import Select from 'react-select'
import axios from "axios";
import Swal from "sweetalert2";
import { FaRegEdit,FaCalendarAlt,FaLocationArrow,FaStar,FaUserFriends,FaSave,FaPlusSquare } from "react-icons/fa";
import { BiMap } from "react-icons/bi";
import { Helmet } from "react-helmet";
import { Container,Row,Col,Card,Form,Button,Modal } from "react-bootstrap";
import { useState,useEffect } from "react";
import NavbarComponent from './child_components/navbarComponent';
import { getToken,getUserId,getUserInfo } from "../utils/authorize";
import '../index.css';

const createFormComponent = ()=>{
  const [report,setReport] = useState({
    date_start:"",date_end:"",travel_money: 0,hotel_money: 0,
    other_money: 0,location:"",objective:"",buddy:""
  })
  const {date_start,date_end,travel_money,hotel_money,other_money,
          location,objective,buddy} = report;
  const inputValue = name=>event=>{
    setReport({...report,[name]:event.target.value}); 
  }
  //calc money
  const calculate = Number(travel_money)+Number(hotel_money)+Number(other_money);
  const locName =(e)=>{
    const locationAll = e.target.value.split("|")
    const locationName = locationAll[0]
    const locationPrice = locationAll[1]
    setReport({ date_start:date_start,date_end:date_end,travel_money:travel_money,hotel_money:hotel_money,
      other_money:Number(locationPrice),location:locationName,objective:objective,buddy:buddy })
  }

  const userID = getUserId()
  //modal add location
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //add location
  const [loc,setLoc] = useState({locname:"",price:""});
  const {locname,price} = loc;
  const inputLocationValue = name=>event=>{
    setLoc({...loc,[name]:event.target.value});
  }
  //show locationlist
  const [locationLists,setlocationList] = useState([])
  const [buddyName,setBuddyName] = useState([]);

  const submitForm=(e)=>{
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API}/createplan`,
    {userID,date_start,date_end,travel_money,hotel_money,other_money,location,objective,buddy},
    { headers:{ authorization:`Bearer ${getToken()}` }
    })
    .then(response=>{
      setReport({...report,date_start:"",date_end:"",travel_money:"",hotel_money:"",other_money:"",location:"",objective:"",buddy:""});
      Swal.fire('Completed','บันทึกข้อมูลเรียบร้อย','success').then(res=>{
        window.location = "/"
      })
    }).catch(err=>{
      if(err.response.statusText == "Unauthorized"){
        window.location = "/login"
      }
      else{
        Swal.fire('Errors',err.response.statusText,'error')
      }
    })
  }
  const submitLocForm=(e)=>{
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API}/createlocation`,{locname,price},
    {
      headers:{
        authorization:`Bearer ${getToken()}`
      }
    })
    .then(response=>{
      Toast.fire({icon: 'success',title: 'เพิ่มสถานที่ปฏิบัติงานสำเร็จ'})
      setLoc({...loc,locname:"",price:""});
      fetchData()
    }).catch(err=>{
      if(err.response.statusText == "Unauthorized"){
        window.location = "/login"
      }
      else{
        Swal.fire('Errors',err.response.statusText,'error')
      }
    })
  }

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
  // get Location
  const fetchData=()=>{
    axios.get(process.env.REACT_APP_API + '/locationlist',
    { headers:{authorization:`Bearer ${getToken()}`} 
    }).then(response=>{
      setlocationList(response.data)
    }).catch(err=>{
      if(err.response.statusText == "Unauthorized"){
        window.location = "/login"
      }
      else{ Swal.fire('Errors',err.response.statusText,'error') }
    })
  }
  
  // get buddy
  const getBuddy=()=>{
    axios.get(process.env.REACT_APP_API + '/userlist/' +userID,
    { headers:{authorization:`Bearer ${getToken()}`} 
    }).then(response=>{
      setBuddyName(response.data)
    }).catch(err=>{
      if(err.response.statusText == "Unauthorized"){
        window.location = "/login"
      }
      else{ Swal.fire('Errors',err.response.statusText,'error') }
    })
  }
  
  useEffect(()=>{
    fetchData()
    getBuddy()
  },[])

  const buddyoptions = buddyName.map(d => ({
    "value" : d.firstname,"label" : d.nickname
  }))
  const handleChange=(e)=>{
    const setBuddy = e
    let arr = []
    for(let i=0;i<setBuddy.length;i++){
      arr.push(setBuddy[i].value)
    }
    setReport({ date_start:date_start,date_end:date_end,travel_money:travel_money,hotel_money:hotel_money,
      other_money:other_money,location:location,objective:objective,buddy:arr.join(" ") })
  }
  return(
  <>
    <Helmet>
      <title>เขียนเอกสารรายงาน | {' '+getUserInfo().split(",",1)}</title>
    </Helmet>
    <NavbarComponent />
    <Container style={{ padding: 5, marginTop: 5}}>
    <Row>
      <Col md={2}>
      </Col>
      <Col lg={8}>
      <Card className='bg-incard'>
        <Card.Header className='bg-cardheader text-white'>
          <Row>
            <Col md={6}>
              <h4 style={{ textAlign: 'left'}}><FaRegEdit /> เขียนรายงาน</h4>
            </Col>
            <Col md={6} align="right">
              <Button className='btn-info' onClick={handleShow}> <FaPlusSquare /> เพิ่มสถานที่ทำงาน</Button>
            </Col> 
          </Row>
        </Card.Header>
        <Card.Body>
        <Form onSubmit={submitForm}> 
          <Row>
            <Col md={6}>
              <Row>
              <Col lg={6}>
                <Form.Label className="text-white"><FaCalendarAlt /> เริ่มงาน : </Form.Label>
                <Form.Control type="date" className="text-center" value={date_start} onChange={inputValue("date_start")} required />
              </Col>
              <Col lg={6}>
                <Form.Label className="text-white"><FaCalendarAlt /> สิ้นสุดงาน : </Form.Label>
                <Form.Control type="date" className="text-center" value={date_end} onChange={inputValue("date_end")} required />
              </Col>
              </Row>
              <Form.Label className="text-white"><BiMap /> สถานที่ทำงาน : 
              </Form.Label>
              <Form.Select onChange={locName}>
                <option value="" disabled selected="selected">.....เลือกสถานที่ทำงาน.....</option>
                {locationLists.map((locationList,index)=>(
                  <option value={locationList.locname+"|"+locationList.price}>{locationList.locname}</option>
                ))}
              </Form.Select>        
            </Col>
            <Col md={6}>
              <Form.Label className="text-white"><FaStar /> วัตถุประสงค์การปฎิบัติงาน : </Form.Label>
              <Form.Control type="text" placeholder="วัตถุประสงค์การปฎิบัติงาน" value={objective} onChange={inputValue("objective")} required />
              <Form.Label className="text-white"><FaUserFriends /> ผู้ร่วมเดินทาง : </Form.Label>
              <Select onChange={handleChange} options={buddyoptions} isMulti />          
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Label className="text-white"> ค่าเดินทาง : </Form.Label>  
              <Form.Control type="number" className="text-center" placeholder="0.00" value={travel_money} onChange={inputValue("travel_money")} required /> 
            </Col>
            <Col md={3}>
              <Form.Label className="text-white"> ค่าที่พัก : </Form.Label>  
              <Form.Control type="number" className="text-center" placeholder="0.00" value={hotel_money} onChange={inputValue("hotel_money")} /> 
            </Col>
            <Col md={3}>
              <Form.Label className="text-white"> ค่าอื่นๆ : </Form.Label>  
              <Form.Control type="number" className="text-center" placeholder="0.00" value={other_money} onChange={inputValue("other_money")} /> 
            </Col>
            <Col md={3}>
              <Form.Label className="text-white"> รวมเป็นเงิน : </Form.Label>  
              <Form.Control type="number" className="text-center" placeholder="0.00"  value={calculate} /> 
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Button type="submit" className='registerbtn'><FaSave /> บันทึกข้อมูล</Button>
            </Col>
          </Row>
          </Form>
        </Card.Body>
      </Card>
      </Col>
    </Row>  
    </Container>
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={submitLocForm}>
      <Modal.Header closeButton className='bg-cardheader text-white'>
        <Modal.Title><FaLocationArrow /> เพิ่มสถานที่ทำงาน</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-incard text-white'>
        <Form> 
          <Form.Label className="text-white"> ชื่อสถานที่ : </Form.Label>
          <Form.Control type="text" placeholder="ใส่ชื่อสถานที่" value={locname} onChange={inputLocationValue("locname")} required />
          <Form.Label className="text-white"> ค่าเดินทาง : </Form.Label>  
          <Form.Control type="number" placeholder="0.00" value={price} onChange={inputLocationValue("price")} required /> 
        </Form>
      </Modal.Body>
      <Modal.Footer className='bg-cardheader text-white'>
        <Button type="submit" className='btn-create' onClick={handleClose}>
        <FaPlusSquare /> เพิ่มสถานที่ทำงาน
        </Button>
      </Modal.Footer>
      </Form>
    </Modal>
  </>
  )
}

export default createFormComponent