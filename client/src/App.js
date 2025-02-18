import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/header/Header';
import Leave from './pages/leave/Leave';
import Store from './pages/store/Store';
import SignUp from './pages/signup/SignUp';
import Login from './pages/login/Login';
import SignOut from './pages/signout/SignOut';
import Home from './pages/home/Home';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import Profile from './pages/profile/Profile';
import Appointment from './pages/appointment/Appointment';
import OrderDetails from './pages/order_details/OrderDetails';
import AppointmentList from './pages/appointment/AppointmentList';
import SupplierDashboard from './pages/SupplierDashboard/SupplierDashboard';
import SupplierOrder from './pages/SupplierOrder/SupplierOrder';
import Service from './pages/service/Service';
import Offer from './pages/Offer/Offer';
import Nailcare from './pages/service/Nail_care';
import Haircare from './pages/service/Hair_care';
import Skincare from './pages/service/Skin_care';
import FeedbackHome from './pages/customer_feedback/FeedbackHome';
import CreatePost from './pages/customer_feedback/CreatePost';
import EditPost from './pages/customer_feedback/EditPost';
import EditAppointment from './pages/appointment/EditAppointment'
import CoursePage from './pages/Course-list-page/CoursePage';
import Enroll from './pages/EnrollForm/Enroll';
import CourseDetailsPage from './pages/course-details/CourseDetailsPage';
import CourseFeedback from './pages/courseFeedbacks/FeedbackHome';
import addFeedBack from './pages/courseFeedbacks/EditPost';
import EnrollList from './pages/EnrollForm/EnrollList'; 
import AddCourseReview from './pages/courseFeedbacks/CreatePost';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<LayoutWithHeader />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        <Route path="/supplier-order" element={<SupplierOrder />} /> 
      </Routes>
    </BrowserRouter>
  );
}

function LayoutWithHeader() {
  const location = useLocation();
  const showHeader = location.pathname !== "/supplier-dashboard";

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/leave" element={<Leave />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/store" element={<Store />} />
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-app" element={<Appointment />} />
        <Route path="/invoice/:id" element={<OrderDetails />} />
        <Route path="/my-app" element={<AppointmentList />} />
        <Route path="/service" element={<Service/>} />
        <Route path="/offer" element={<Offer/>} />
        <Route path="/Nail_care" element={<Nailcare />} />
        <Route path="/Hair_care" element={<Haircare/>} />
        <Route path="/Skin_care" element={<Skincare/>} />
        <Route path="/contact" element={<FeedbackHome/>} />
        <Route path="/addfeedback" element={<CreatePost/>} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/edit-app/:id" element={<EditAppointment />} />
        
        
        <Route path='/courselist' element={<CoursePage/>}/>
        <Route path='/enroll/:id' element={<Enroll/>}/>
        <Route path='/seedetails/:id' element={<CourseDetailsPage/>}/>
        <Route path='/coursefeedback' element={<CourseFeedback/>}/>
        <Route path='/addfeedbackCourse' element={<addFeedBack/>}/>
        <Route path='/enrollList' element={<EnrollList/>}/>
        <Route path='/add_course_review' element={<AddCourseReview/>}/>

        

      </Routes>
    </>
  );
}

export default App;