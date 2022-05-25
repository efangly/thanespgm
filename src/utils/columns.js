/* eslint-disable */
import { Button } from 'react-bootstrap';
import { FaRegEdit,FaTrashAlt  } from "react-icons/fa";
import { Link } from 'react-router-dom'
export const columnPlan=()=>{
  const columns = [
    {
      name: "สถานที่",
      selector: (row) => row.location,
      reorder: true
    },
    {
      name: "วัตถุประสงค์",
      selector: (row) => row.objective,
      hide: "md",
      reorder: true
    },
    {
      name: "ผู้ร่วมเดินทาง",
      selector: (row) => row.buddy,
      hide: "md",
      maxWidth: "150px"
    },
    {
      name: "วันที่ปฏิบัติงาน",
      cell: row => (`${row.date_start}-${row.date_end}`),
      maxWidth: "180px",
      center: true
    },
    {
      name: "แก้ไข",
      cell: row => (
        <Link to={`/detailplan/${row.planID}`}>
          <Button variant="outline-info" raised primary > <FaRegEdit /></Button>
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      maxWidth: "30px",
      center: true
    }
  ]
  return columns
}