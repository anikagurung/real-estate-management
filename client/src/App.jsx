{/*import { BrowserRouter, Routes, Route} from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

import SellerDashboard from './pages/SellerDashboard';
import AddProperty from './pages/AddProperty.jsx';
import Home from './pages/Home';
import Signin from './pages/Signin';
import SignOut from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Properties from './pages/properties';
import PropertyDetails from './components/PropertyDetails';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';


export default function App() {
  return <BrowserRouter>
  <Header/>
  

  <Routes>
  

 
    <Route path="/" element={<Home />} />
    <Route path="/sign-in" element={<Signin />} />
    <Route path="/sign-up" element={<SignOut />} />
    <Route path="/about" element={<About />} />
    <Route path="/properties" element={<Properties />} />
    <Route path="/property/:id" element={<PropertyDetails />} />
    <Route  element={<PrivateRoute />} >
       <Route path="/profile" element={<Profile />} />
       <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/admin-dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />

         
    </Route>
  
    </Routes>
    </BrowserRouter>
    
  
}*/}
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

import SellerDashboard from './pages/SellerDashboard';
import AddProperty from './pages/AddProperty';
import Home from './pages/Home';
import Signin from './pages/Signin';
import SignOut from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Properties from './pages/properties';
import PropertyDetails from './components/PropertyDetails';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/AdminLayout'; // Import AdminLayout
import Users from "./components/Users";
import Appointments from './components/Appointments';
import Bookings from './components/Bookings';




export default function App() {
  return (
    <BrowserRouter>
      <Header /> 
      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignOut />} />
        <Route path="/about" element={<About />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
       

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/appointments" element={<Appointments />} />
         

          <Route path="/add-property" element={<AddProperty />} />
        </Route>

        {/* Admin Routes with Layout */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route path="/Users" element={<AdminLayout><Users /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
