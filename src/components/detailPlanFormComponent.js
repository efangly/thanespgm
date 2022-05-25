/* eslint-disable */
import { BsFillGearFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa"
import { Container,Row,Col,Card,Button } from 'react-bootstrap'
import { useRef } from "react";
import DetailPlanDatatableComponent from './child_components/dtPlanDatatableComponent';
import NavbarComponent from '../components/child_components/navbarComponent';
import '../index.css'

const detailPlanFormComponent = (props)=>{
  //recall childcomponent
  const childCompRef = useRef()
  return(
    <>
    <NavbarComponent />
    <Container style={{ padding: 5, marginTop: 5}}>
      <Card className='bg-incard'>
        <Card.Header className='bg-cardheader text-white'>
          <Row>
            <Col sm={6}>
              <h4 style={{ textAlign: 'left'}}><BsFillGearFill /> รายงาน | แก้ไข</h4>
            </Col>
            <Col sm={6} align="right">
              <Button variant="outline-danger" onClick={()=>{childCompRef.current.deleteData()}} ><FaTrashAlt /> ลบรายการที่เลือก</Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row>
            <DetailPlanDatatableComponent planID={props.match.params.planID} ref={childCompRef} />
          </Row>
        </Card.Body>
      </Card>
    </Container>
    </>
  )
}

export default detailPlanFormComponent