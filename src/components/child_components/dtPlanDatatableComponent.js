/* eslint-disable */
import DataTable from 'react-data-table-component';
import axios from "axios";
import Swal from "sweetalert2";
import { useState,useEffect,useCallback,forwardRef,useImperativeHandle } from "react";
import { Button,Modal,Form,Row,Col } from 'react-bootstrap';
import { FaRegEdit } from "react-icons/fa";
import { getToken} from "../../utils/authorize";
import "../../styles.css";

const detailPlanDatatableComponent = forwardRef(({ planID }, ref)=>{
  const columns = [
    {
      name: "วันที่ปฏิบัติงาน",
      selector: (row) => row.dateplan,
      maxWidth: "150px",
      center: true,
      reorder: true
    },
    {
      name: "สถานที่",
      selector: (row) => row.location,
      hide: "md"
    },
    {
      name: "วัตถุประสงค์",
      selector: (row) => row.objective,
      reorder: true
    },
    {
      name: "ผู้ร่วมเดินทาง",
      selector: (row) => row.buddy,
      maxWidth: "150px",
      hide: "md"
    },
    {
      name: "ค่าเดินทาง",
      selector: (row) => row.travel_money,
      hide: "md",
      maxWidth: "110px",
      center: true
    },
    {
      name: "ค่าที่พัก",
      selector: (row) => row.hotel_money,
      hide: "md",
      maxWidth: "40px",
      center: true
    },
    {
      name: "ค่าอื่นๆ",
      selector: (row) => row.other_money,
      hide: "md",
      maxWidth: "40px",
      center: true
    },
    {
      name: "แก้ไข",
      cell: row => (
        <Button variant="outline-info" raised primary onClick={()=>{handleShow(row.detailID)}} > <FaRegEdit /></Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      maxWidth: "20px",
      center: true
    }
  ]

  const [DtPlan,setDtPlan] = useState([])
  const [selectedRows,setSelectedRows] = useState([])
  const [editplan,setEditplan] = useState({detailID:"",travel_money: 0,hotel_money: 0,other_money: 0,location:"",objective:"",buddy:""})
  const {detailID,travel_money,hotel_money,other_money,location,objective,buddy} = editplan
  const [show, setShow] = useState(false)

  const inputValue = name=>event=>{
    setEditplan({...editplan,[name]:event.target.value});
  }
  useImperativeHandle(ref, () => ({
    deleteData(){
      deleteDtPlan()
    },
  }))
  useEffect(()=>{
    fetchData()
  },[])
  const handleChange = useCallback(state => {
		setSelectedRows(state.selectedRows)
	},[])
  const handleClose = () =>{
    setShow(false);
  }
  const handleShow = (DtplanID) =>{
    axios.get(`${process.env.REACT_APP_API}/dtplanlist/${DtplanID}`,
    { headers:{authorization:`Bearer ${getToken()}`} }
    ).then(response=>{
      const {detailID,travel_money,hotel_money,other_money,location,objective,buddy} = response.data
      setEditplan({...editplan,detailID,travel_money,hotel_money,other_money,location,objective,buddy})
      setShow(true)}
    ).catch(err=>{
      if(err.response.statusText == "Unauthorized"){ window.location = "/login" }
      else{ Swal.fire('Errors','ทำรายการไม่สำเร็จ','error') }
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

  const fetchData=()=>{
    axios.get(`${process.env.REACT_APP_API}/dtplanlistbyplan/${planID}`,
    { headers:{ authorization:`Bearer ${getToken()}`} }
    ).then(response=>{
      setDtPlan(response.data)
    }).catch(err=>{
      if(err.response.statusText == "Unauthorized"){ window.location = "/login" }
      else{ Swal.fire('Errors','ลบข้อมูลไม่สำเร็จ','error') }
    })
  }

  const submitForm=(e)=>{
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_API}/updatedtplan/${detailID}`,
    {travel_money,hotel_money,other_money,location,objective,buddy},
    { headers:{authorization:`Bearer ${getToken()}`} }
    ).then(response=>{
      Toast.fire({
        icon: 'success',
        title: 'แก้ไขข้อมูลสำเร็จ'
      })
      fetchData()
      setEditplan({...editplan,detailID:"",travel_money: 0,hotel_money: 0,other_money: 0,location:"",objective:"",buddy:""});
    }).catch(err=>{
      if(err.response.statusText == "Unauthorized"){ window.location = "/login" }
      else{ Swal.fire('Errors',err.response.data.error,'error') }
    })
  }

  const deleteDtPlan=()=>{
    if(selectedRows.length === 0){
      Swal.fire({icon: 'warning',text: 'โปรดเลือกอย่างน้อย 1 รายการ',})}
    else{
      Swal.fire({
        text: "ต้องการที่จะลบ?",
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '##FF3030',
        cancelButtonColor: '#595959',
        confirmButtonColor: '#FF3030',
        confirmButtonText: 'Delete'
      }).then((result) => {
        if(result.isConfirmed){
          let DTplanidlist = []
          for(let i = 0; i < selectedRows.length; i++) {
            DTplanidlist.push(selectedRows[i].detailID)
          }
          axios.delete(`${process.env.REACT_APP_API}/removedtplan/${DTplanidlist}`,
          { headers:{authorization:`Bearer ${getToken()}`}
          }).then(response=>{
            fetchData()
            Toast.fire({icon: 'success',title: 'ลบรายการสำเร็จ'})
          }).catch(err=>{
            if(err.response.statusText == "Unauthorized"){ window.location = "/login" }
            else{ Swal.fire('Errors',err.response.data.error,'error') }
          })
        }
      })  
    }
  }


  return(
    <>
      <DataTable
        columns={columns}
        data={DtPlan}
        defaultSortFieldId={1}
        selectableRows
        onSelectedRowsChange={handleChange}
        theme='dark'
        pagination
      />

      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={submitForm}>
        <Modal.Header closeButton className='bg-cardheader text-white'>
          <Modal.Title><FaRegEdit size={24} /> แก้ไขข้อมูล</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-incard text-white'>
          <Form>
            <Row>
              <Col sm={12}>
                <Form.Label className="text-white"> ชื่อสถานที่ : </Form.Label>
                <Form.Control type="text" placeholder="ชื่อสถานที่" value={location} onChange={inputValue("location")} />
                <Form.Label className="text-white"> วัตถุประสงค์ : </Form.Label>
                <Form.Control type="text" placeholder="วัตถุประสงค์การปฎิบัติงาน" value={objective} onChange={inputValue("objective")} required />
                <Form.Label className="text-white"> ผู้ร่วมเดินทาง : </Form.Label>
                <Form.Control type="text" placeholder="พิมพ์ชื่อผู้ร่วมเดินทาง" value={buddy} onChange={inputValue("buddy")} />
              </Col>
            </Row>
            <Row>
            <Col sm={4}>
              <Form.Label className="text-white"> ค่าเดินทาง : </Form.Label>  
              <Form.Control type="number" placeholder="0.00" value={travel_money} onChange={inputValue("travel_money")} required />
            </Col>
            <Col sm={4}>
              <Form.Label className="text-white"> ค่าที่พัก : </Form.Label>  
              <Form.Control type="number" placeholder="0.00" value={hotel_money} onChange={inputValue("hotel_money")} /> 
            </Col>
            <Col sm={4}>
              <Form.Label className="text-white"> ค่าอื่นๆ : </Form.Label>  
              <Form.Control type="number" placeholder="0.00" value={other_money} onChange={inputValue("other_money")} /> 
            </Col>
            </Row> 
          </Form>
        </Modal.Body>
        <Modal.Footer className='bg-cardheader text-white'>
          <Button type="submit" className='btn-create' onClick={handleClose}>
            <FaRegEdit size={24} /> แก้ไข
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
})

export default detailPlanDatatableComponent;