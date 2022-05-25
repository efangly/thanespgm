
/* eslint-disable */
import DataTable from 'react-data-table-component';
import axios from "axios";
import Swal from "sweetalert2";
import { useState,useEffect,useCallback,forwardRef,useImperativeHandle } from "react";
import { getToken,getUserId } from "../../utils/authorize";
import { columnPlan } from '../../utils/columns';
import { exportHrPDFComponent } from './exportPdfHrComponent';
import { exportMonthPDFComponent } from './exportPdfMonthComponent';
import { exportMoneyPDFComponent } from './exportPdfMoneyComponent';
import "../../styles.css";

const planDatatableComponent = forwardRef((props, ref)=>{
  const [Plan,setPlan] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [toggleCleared, setToggleCleared] = useState(false)

  useImperativeHandle(ref, () => ({
    deleteData(){ deletePlan() },
    showPDF(report_type){
      if(selectedRows.length === 0){
        Swal.fire({icon: 'warning',text: 'โปรดเลือกอย่างน้อย 1 รายการ',})
      }
      else{ 
        let allplanlist = []
        for(let i = 0; i < selectedRows.length; i++){
          allplanlist.push(selectedRows[i].planID)
        }
        axios.get(`${process.env.REACT_APP_API}/exportplanpdf/${allplanlist}`,
        { headers:{authorization:`Bearer ${getToken()}`} }
        ).then(response=>{
          switch(report_type){
            case 'hr':
              exportHrPDFComponent(response.data)
              setToggleCleared(!toggleCleared) 
              break;
            case 'money':
              exportMoneyPDFComponent(response.data,'F')
              setToggleCleared(!toggleCleared)
              break;
            case 'money_sum':
              exportMoneyPDFComponent(response.data,'T')
              setToggleCleared(!toggleCleared)
              break;
            case 'month':
              exportMonthPDFComponent(response.data)
              setToggleCleared(!toggleCleared)
              break;
            case 'all':
              exportHrPDFComponent(response.data)
              exportMoneyPDFComponent(response.data,'T')
              exportMonthPDFComponent(response.data)
              setToggleCleared(!toggleCleared)
              break;
            default:
              Swal.fire('Errors','ข้อมูลไม่ถูกต้อง','error')
          }}
        ).catch(err=>{
          if(err.response.statusText == "Unauthorized"){ window.location = "/login" }
          else{ Swal.fire('Errors',err.response.data.error,'error') }
        }) 
      }
    }
  }))

  const handleChange = useCallback(state => {
		setSelectedRows(state.selectedRows)
	},[])

  useEffect(()=>{
    fetchData()
  },[])

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
    axios.get(`${process.env.REACT_APP_API}/planlist/${getUserId()}`,
    { headers:{ authorization:`Bearer ${getToken()}` }}
    ).then(response=>{
      setPlan(response.data)
    }).catch(err=>{
      if(err.response.statusText == "Unauthorized"){ window.location = "/login" }
      else{ Swal.fire('Errors',err.response.data.error,'error') } 
    })
  }

  const deletePlan=()=>{
    if(selectedRows.length === 0){
      Swal.fire({
        icon: 'warning',
        text: 'โปรดเลือกอย่างน้อย 1 รายการ',
      })
    }
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
        if (result.isConfirmed){
          let planidlist = []
          for(let i = 0; i < selectedRows.length; i++) {
            planidlist.push(selectedRows[i].planID)
          }
          axios.delete(`${process.env.REACT_APP_API}/removeplan/${planidlist}`,
          {
            headers:{
              authorization:`Bearer ${getToken()}`
            }
          })
          .then(response=>{
            fetchData()
            Toast.fire({
              icon: 'success',
              title: 'ลบรายการสำเร็จ'
            })
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
  }

  return(
    <>
      <DataTable
        columns={columnPlan()}
        data={Plan}
        selectableRows
        onSelectedRowsChange={handleChange}
        clearSelectedRows={toggleCleared}
        theme='dark'
        pagination
        defaultSortAsc={false}
      />
    </>
  )
})

export default planDatatableComponent;