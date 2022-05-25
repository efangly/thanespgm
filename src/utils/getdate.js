//all utils
export function currentdate(){
  let date = new Date()
  const currdate = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear()
  return currdate
}

