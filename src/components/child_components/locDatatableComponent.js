
/* eslint-disable */
import DataTable from 'react-data-table-component';
import axios from "axios";
import Swal from "sweetalert2";
import { useState,useEffect,forwardRef,useImperativeHandle } from "react";
import { Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa"
import { getToken } from "../../utils/authorize";
import "../../styles.css";

const locDatatableComponent = forwardRef((props, ref)=>{
  const columns = [
    {
      name: "ชื่อสถานที่ปฏิบัติงาน",
      selector: (row) => row.locname,
      reorder: true
    },
    {
      name: "ค่าเดินทาง",
      selector: (row) => row.price,
      maxWidth: "140px",
      hide: "md",
      center: true,
      reorder: true
    },
    {
      name: "ลบ",
      cell: row => (
        <Button variant="outline-danger" raised primary onClick={()=>{removeLocation(row.locname,row.locationID)}} > 
          <FaTrashAlt />
        </Button>),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      maxWidth: "30px",
      center: true
    }
  ]

  const [Loc,setLocation] = useState([])

  useImperativeHandle(ref, () => ({
    reData(){
      fetchData()
    },
  }))
  useEffect(()=>{
    fetchData()
  },[])
  
  const fetchData=()=>{
    axios.get(`${process.env.REACT_APP_API}/locationlist`,
    { headers:{authorization:`Bearer ${getToken()}`}}
    ).then(response=>{setLocation(response.data)}
    ).catch(err=>{
      if(err.response.statusText == "Unauthorized"){ window.location = "/login" }
      else{ Swal.fire('Errors',err.response.data.error,'error') }
    })
  }
  const removeLocation=(locName,locID)=>{
    Swal.fire({
      text: "ต้องการที่จะลบ "+locName+" ?",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '##FF3030',
      cancelButtonColor: '#595959',
      confirmButtonColor: '#FF3030',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed){
        axios.delete(`${process.env.REACT_APP_API}/removelocation/${locID}`,
        { headers:{authorization:`Bearer ${getToken()}`} }
        ).then(response=>{ fetchData() }
        ).catch(err=>{
          if(err.response.statusText == "Unauthorized"){ window.location = "/login" }
          else{ Swal.fire('Errors',err.response.data.error,'error') }
        })
      }
    })
  }

  return(
    <div>
      <DataTable
        columns={columns}
        data={Loc}
        theme='dark'
        pagination
        defaultSortAsc={false}
      /> 
    </div>
  )
})

export default locDatatableComponent;