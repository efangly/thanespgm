
/* eslint-disable */
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useState,useEffect,forwardRef,useImperativeHandle } from "react";
import { Button } from 'react-bootstrap';
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import "../../styles.css";
import { getToken,getUserId } from "../../utils/authorize";

const userDatatableComponent = forwardRef((props, ref)=>{
  const columns = [
    {
      name: "รหัสพนักงาน",
      selector: (row) => row.userID,
      maxWidth: "130px",
      reorder: true
    },
    {
      name: "ชื่อ-นามสกุล",
      selector: (row) => row.fullname,
      reorder: true
    },
    {
      name: "ชื่อเล่น",
      selector: (row) => row.nickname,
      maxWidth: "130px",
      hide: "md",
      reorder: true
    },
    {
      name: "แผนก",
      selector: (row) => row.job,
      maxWidth: "130px",
      hide: "md",
      reorder: true
    },
    {
      name: "ลบ",
      cell: row => (
          <Button variant="outline-danger" raised primary onClick={()=>{removeUser(row.fullname,row.userID)}} > <FaTrashAlt /></Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      maxWidth: "30px",
      center: true
    }
  ]

  useImperativeHandle(ref, () => ({
    reData(){
      fetchData()
    },
  }))
  useEffect(()=>{
    fetchData()
  },[])
  
  const [User,setUser] = useState([])
  const fetchData=()=>{
    axios.get(`${process.env.REACT_APP_API}/userlistnoself/${getUserId()}`,
    {
      headers:{
        authorization:`Bearer ${getToken()}`
      }
    }
    )
    .then(response=>{
      setUser(response.data)
    })
    .catch(err=>{
      if(err.response.statusText == "Unauthorized"){
        window.location = "/login"
      }
      else{
        Swal.fire('Errors',err.response.data.error,'error')
      }
    })
  }

  const removeUser=(userName,userID)=>{
    Swal.fire({
      text: "ต้องการที่จะลบ "+userName+" ?",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '##FF3030',
      cancelButtonColor: '#595959',
      confirmButtonColor: '#FF3030',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed){
        axios.delete(`${process.env.REACT_APP_API}/removeuser/${userID}`,
        {
          headers:{
            authorization:`Bearer ${getToken()}`
          }
        })
        .then(response=>{
          fetchData()
        })
        .catch(err=>{
          if(err.response.statusText == "Unauthorized"){
            window.location = "/login"
          }
          else{
            Swal.fire('Errors',err.response.data.error,'error')
          }
        })
      }
    })
  }
  return(
    <div>
      <DataTable
        columns={columns}
        data={User}
        theme='dark'
        pagination
        defaultSortAsc={false}
      /> 
    </div>
  )
}
)

export default userDatatableComponent;