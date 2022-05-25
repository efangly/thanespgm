/* eslint-disable */
import Logo from '../../utils/images/bbb.png'
import { withRouter } from 'react-router-dom'
import { FaHome,FaUser,FaSignOutAlt,FaFilePdf } from "react-icons/fa"
import { BsFillPinMapFill } from "react-icons/bs"
import { Navbar,Nav,Container,Button } from 'react-bootstrap'
import { logout } from '../../utils/authorize'
import Swal from "sweetalert2";

const navbarComponent = ({history})=>{
  const signout=()=>{
    Swal.fire({
      title: 'Are you sure?',
      text: "ต้องการที่จะ Logout?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '##dc3545',
      cancelButtonColor: '#595959',
      confirmButtonText: 'Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        logout(()=>history.push("/login"))
      }
    })
  }
  return(
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top" >
    <Container>
        <Navbar.Brand href='/'>
        <h2>
          <img alt="" src={Logo} width="40" height="40" className="d-inline-block align-top"/>{' '}
          Thanes Programmer
        </h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto' style={{ padding: 5 }}>
            <Button href='/createreport' className='btn-create' size="sm"><FaFilePdf size={28} /> <br /> สร้างรายงาน</Button>{' '}
            <Nav.Link href='/' align="center"><FaHome size={28} /> <br /> หน้าแรก</Nav.Link>
            <Nav.Link href='/user' align="center"><FaUser size={28} /> <br /> จัดการผู้ใช้งาน</Nav.Link>
            <Nav.Link href='/location' align="center"><BsFillPinMapFill size={28} /><br /> จัดการสถานที่</Nav.Link>
            <Nav.Link onClick={signout} align="center"><FaSignOutAlt size={28} /> <br /> Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
    </Container>
    </Navbar>
  )
}

export default withRouter(navbarComponent)