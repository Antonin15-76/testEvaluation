import { Route, Routes } from "react-router-dom"
import Home from "../pages"
import PageHome from "../pages/app/pageHome"
import SubscribeForm from "../pages/app/subscribe/SubscribeForm"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/app' element={<Home />} />
            <Route path='pageHome/*' element={<PageHome />} />
            <Route path='subscribe/*' element={<SubscribeForm />} />
        </Routes>
    )
}

export default AppRoutes