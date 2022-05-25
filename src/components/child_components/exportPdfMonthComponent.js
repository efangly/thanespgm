/* eslint-disable */
import pdfMake from "pdfmake/build/pdfmake"; 
import pdfFonts from "pdfmake/build/vfs_fonts";
import { getUserInfo } from "../../utils/authorize";
import { currentdate } from "../../utils/getdate";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew-Bold.ttf',
    italics: 'THSarabunNew-Italic.ttf',
    bolditalics: 'THSarabunNew-BoldItalic.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
}

export const exportMonthPDFComponent = (planid)=>{
  const userinfo = getUserInfo().split(",")
  let arrPlan = []
  arrPlan.push([
      { text: 'วันที่ปฎิบัติงาน', fontSize:14, alignment:'center'},
      { text: 'สถานที่ปฎิบัติงาน', fontSize:16, alignment:'center'}
    ]
  )
  for(let i = 0; i < planid.length; i++) {
    arrPlan.push([
      { text: planid[i].dateplan, fontSize:16, alignment:'center'},
      { text: planid[i].objective+' '+planid[i].location, fontSize:16}
    ])
  }

  const docDefinition = {
    info: { title: 'Report-Month' },
    pageSize: "A4",
    pageMargins: [60, 70, 60, 135],
    header:{
      stack:[
        { text: 'รายงานปฎิบัติงานประจําเดือน', alignment:'center',fontSize:20,margin:[0,20,0,0] },
        { text: 'วันที่: '+currentdate(), alignment:'right',fontSize:16,margin:[0,0,60,0] },
        { columns: [
          { text: 'ชื่อ: '+userinfo[0]+' '+userinfo[1],fontSize:16,margin:[60,0,0,0] },
          { text: 'แผนก: '+userinfo[3], alignment:'right',fontSize:16,margin: [0,0,60,0] }
        ]}
      ]
    },
    footer:(currentPage, pageCount)=>{ 
      return {
        stack:[
          { layout: 'noBorders',
            table: {
              widths: [ 50,'*','*',50 ],
              body: [
                [' ',' ',' ',' '],
                ['',{ text: '........................................................', fontSize:16, alignment:'center'},
                { text: '........................................................', fontSize:16, alignment:'center'},''],
                ['',{ text: 'ผู้ขอเบิกค่ายานพาหนะ', fontSize:14, alignment:'center'},
                { text: 'ผู้จัดการแผนก', fontSize:14, alignment:'center'},''],
                [' ',' ',' ',' '],
                ['',{ text: '........................................................', fontSize:16, alignment:'center'},
                { text: '........................................................', fontSize:16, alignment:'center'},''],
                ['',{ text: 'ผู้จัดการบัญชี ', fontSize:14, alignment:'center'},
                { text: 'กรรมการผู้จัดการ/ผู้จัดการทั่วไป', fontSize:14, alignment:'center'},'']
              ]
            }
          },
          { text: 'หน้า: '+currentPage.toString()+'/'+pageCount, alignment: 'right',fontSize:14,margin: [0,0,60,0] }
        ]
      }
    },
    content: [
      { table: { 
        headerRows: 1,
        widths: [ 60,'*' ],
        body: arrPlan,
      }}
    ],
    defaultStyle:{
      font: 'THSarabunNew',
      lineHeight:0.7
    }
  }

  return pdfMake.createPdf(docDefinition).open()
}