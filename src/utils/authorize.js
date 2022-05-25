//เก็บ token login
export const authenticate=(response,next)=>{
  if(window !== "undefined"){
    //เก็บข้อมูล session storage
    const userinfo = JSON.stringify(response.data.firstname+","+response.data.lastname+","+response.data.job+","+response.data.department)
    localStorage.setItem("token",JSON.stringify(response.data.token))
    localStorage.setItem("username",JSON.stringify(response.data.username))
    localStorage.setItem("userID",JSON.stringify(response.data.userID))
    localStorage.setItem("userInfo",userinfo)
  }
  next()
}
//ดึงข้อมูล token
export const getToken=()=>{
  if(window !== "undefined"){
    if(localStorage.getItem("token")){
      return JSON.parse(localStorage.getItem("token"))
    }
    else{
      return false
    }
  }
}
//ดึงข้อมูล username
export const getUser=()=>{
  if(window !== "undefined"){
    if(localStorage.getItem("username")){
      return JSON.parse(localStorage.getItem("username"))
    }
    else{
      return false
    }
  }
}
//ดึงข้อมูล userID
export const getUserId=()=>{
  if(window !== "undefined"){
    if(localStorage.getItem("userID")){
      return JSON.parse(localStorage.getItem("userID"))
    }
    else{
      return false
    }
  }
}
//ดึงข้อมูล user
export const getUserInfo=()=>{
  if(window !== "undefined"){
    if(localStorage.getItem("userInfo")){
      return JSON.parse(localStorage.getItem("userInfo"))
    }
    else{
      return false
    }
  }
}
//logout
export const logout=(next)=>{
  if(window !== "undefined"){
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("userID")
    localStorage.removeItem("userInfo")
  }
  next()
}

// //เก็บ token login
// export const authenticate=(response,next)=>{
//   if(window !== "undefined"){
//     //เก็บข้อมูล session storage
//     sessionStorage.setItem("token",JSON.stringify(response.data.token))
//     sessionStorage.setItem("username",JSON.stringify(response.data.username))
//     sessionStorage.setItem("userID",JSON.stringify(response.data.userID))
//     sessionStorage.setItem("firstname",JSON.stringify(response.data.firstname))
//   }
//   next()
// }
// //ดึงข้อมูล token
// export const getToken=()=>{
//   if(window !== "undefined"){
//     if(sessionStorage.getItem("token")){
//       return JSON.parse(sessionStorage.getItem("token"))
//     }
//     else{
//       return false
//     }
//   }
// }
// //ดึงข้อมูล username
// export const getUser=()=>{
//   if(window !== "undefined"){
//     if(sessionStorage.getItem("username")){
//       return JSON.parse(sessionStorage.getItem("username"))
//     }
//     else{
//       return false
//     }
//   }
// }
// //ดึงข้อมูล userID
// export const getUserId=()=>{
//   if(window !== "undefined"){
//     if(sessionStorage.getItem("userID")){
//       return JSON.parse(sessionStorage.getItem("userID"))
//     }
//     else{
//       return false
//     }
//   }
// }
// //ดึงข้อมูล firstname
// export const getFirstName=()=>{
//   if(window !== "undefined"){
//     if(sessionStorage.getItem("firstname")){
//       return JSON.parse(sessionStorage.getItem("firstname"))
//     }
//     else{
//       return false
//     }
//   }
// }
// //logout
// export const logout=(next)=>{
//   if(window !== "undefined"){
//     sessionStorage.removeItem("token")
//     sessionStorage.removeItem("username")
//     sessionStorage.removeItem("userID")
//     sessionStorage.removeItem("firstname")
//   }
//   next()
// }