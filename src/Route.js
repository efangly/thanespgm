import { BrowserRouter, Switch,Route } from "react-router-dom"
import App from "./App"
import AuthRoute from "./AuthRoute"
import CreateFormComponent from "./components/createFormComponent"
import LoginFormComponent from "./components/loginFormComponent"
import UserFormComponent from "./components/userFormComponent"
import LocFormComponent from "./components/locFormComponent"
import DetailPlanFormComponent from "./components/detailPlanFormComponent"
//import ExportHrPDFComponent from "./components/PDF/hrPdfComponent"<AuthRoute path="/exporthrpdf" exact component={ExportHrPDFComponent} />


const route = ()=>{
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={LoginFormComponent} />
        <AuthRoute path="/" exact component={App} />
        <AuthRoute path="/createreport" exact component={CreateFormComponent} />
        <AuthRoute path="/user" exact component={UserFormComponent} />
        <AuthRoute path="/location" exact component={LocFormComponent} />
        <AuthRoute path="/detailplan/:planID" exact component={DetailPlanFormComponent} />
      </Switch>
    </BrowserRouter>
  )
}

export default route