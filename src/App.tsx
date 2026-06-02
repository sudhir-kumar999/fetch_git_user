import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./component/Navbar"
import SearchField from "./component/SearchField"
import Test from "./component/Test"
const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<SearchField/>} />
        <Route path="/test" element={<Test/>} />
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </div>
  )
}

export default App
