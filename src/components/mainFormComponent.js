/* eslint-disable */
import { FaFilePdf,FaCalendarAlt,FaMoneyBillAlt,FaRegAddressCard,FaList,FaTrashAlt,FaStream } from "react-icons/fa"
import { Container,Row,Col,Card,Dropdown } from 'react-bootstrap'
import { Helmet } from "react-helmet";
import { useRef } from "react";
import { getUserInfo } from "../utils/authorize";
import PlanDatatableComponent from './child_components/planDatatableComponent';
import '../index.css'

const mainFormComponent = ()=>{
  //recall childcomponent
  const childCompRef = useRef()
  return(
    <>
    <Helmet>
      <title>หน้าแรก | {' '+getUserInfo().split(",",1)}</title>
    </Helmet>
    <Container style={{ padding: 5, marginTop: 5}}>
      <Card className='bg-incard'>
        <Card.Header className='bg-cardheader text-white'>
          <Row>
            <Col sm={3}>
              <h4 style={{ textAlign: 'left'}}><FaFilePdf size={24} /> รายงาน</h4>
            </Col>
            <Col sm={9} align="right">
              <Dropdown>
                <Dropdown.Toggle variant="outline-light" id="dropdown-basic"><FaList size={20} /> เลือกรายการออกรายงาน</Dropdown.Toggle>
                <Dropdown.Menu className='dropdown-menu-dark'>
                  <Dropdown.Item onClick={()=>{childCompRef.current.showPDF('month')}}><FaCalendarAlt /> รายงานการปฎิบัติงาน</Dropdown.Item>
                  <Dropdown.Item onClick={()=>{childCompRef.current.showPDF('money')}}><FaMoneyBillAlt /> เบิกค่าเดินทาง</Dropdown.Item>
                  <Dropdown.Item onClick={()=>{childCompRef.current.showPDF('money_sum')}}><FaMoneyBillAlt /> เบิกค่าเดินทาง(รวมเงิน)</Dropdown.Item>
                  <Dropdown.Item onClick={()=>{childCompRef.current.showPDF('hr')}}><FaRegAddressCard /> รายงาน(HR)</Dropdown.Item>
                  <Dropdown.Item onClick={()=>{childCompRef.current.showPDF('all')}}><FaStream /> ออกรายงานทั้งหมด</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-danger" onClick={()=>{childCompRef.current.deleteData()}}><FaTrashAlt /> ลบรายการที่เลือก</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row>
            <PlanDatatableComponent ref={childCompRef} />
          </Row>
        </Card.Body>
      </Card>
    </Container>
    </>
  )
}

export default mainFormComponent