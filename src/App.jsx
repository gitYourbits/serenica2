import AppLayout from "./layouts/appLayout"
import Homepage from "./pages/home"
import Login  from "./pages/logIn"
import SignUp  from "./pages/signUp"
import Profile from "./pages/profile"
import Private from "./components/private/private"
import Messages from "./components/messages"
import Resources from "./components/dashboard/resources"
import Settings from "./components/settings"
import Booking ,{ action as bookingAction } from "./pages/booking"
import { RouterProvider, 
        createBrowserRouter, 
        createRoutesFromElements, 
        Route } from "react-router-dom"
import "./assets/styles/app.css"
import { useApp } from "./context/appContext"
import BookingTicket, { loader as bookingTicketLoader } from "./components/bookingTicket"
import RouteError from "./components/error-components/Error"
import About from "./pages/about"
import Appointments, { loader as appointmentLoader } from "./components/dashboard/appointments"
import ComingSoon from "./components/utilities/comingSoon"
import CareerCoachBot from "./components/chatbots/careerCoachBot"
import CognitiveBTBot from "./components/chatbots/cognitiveBTbot"
import MindfulnessBTBot from "./components/chatbots/mindfulnessBTbot"
import Policy from "./pages/policy"
// Questionnaire components
import QuestionnaireList from "./components/questionnaires/QuestionnaireList"
import QuestionnaireForm from "./components/questionnaires/QuestionnaireForm"
import QuestionnaireResults from "./components/questionnaires/QuestionnaireResults"
import QuestionnaireHistory from "./components/questionnaires/QuestionnaireHistory"
// Neurobic exercise components
import NeurobicDashboard from "./components/neurobic/NeurobicDashboard"
import ExerciseSession from "./components/neurobic/ExerciseSession"
import NeurobicProgress from "./components/neurobic/NeurobicProgress"


function App() {

  const userContext = useApp()


  const router = createBrowserRouter(
    createRoutesFromElements(
          <Route path="/" element={<AppLayout />} errorElement={<RouteError />}>
            <Route index element={<Homepage/>}></Route>
            <Route path="about" element={<About/>} />
            <Route path="login" element={<Login/>} />
            <Route path="signup" element={<SignUp/>} />
            <Route path="privacypolicy" element={<Policy/>} />
            <Route element={<Private />}>
              <Route path="profile" element={<Profile/>}>
                <Route index element={<Appointments />} loader={appointmentLoader(userContext)} />
                <Route path="messages" element={<Messages />} />
                <Route path="resources" element={<Resources />} />
                <Route path="settings" element={<Settings />} />
                <Route path="questionnaires" element={<QuestionnaireList />} />
                <Route path="questionnaires/:id" element={<QuestionnaireForm />} />
                <Route path="questionnaires/results/:resultId" element={<QuestionnaireResults />} />
                <Route path="questionnaires/history" element={<QuestionnaireHistory />} />
                <Route path="neurobic" element={<NeurobicDashboard />} />
                <Route path="neurobic/exercise/:exerciseId" element={<ExerciseSession />} />
                <Route path="neurobic/progress" element={<NeurobicProgress />} />
              </Route>
              <Route path="comingsoon" element={<ComingSoon />} />
              <Route path="cbtchat" element={<CognitiveBTBot />} />
              <Route path="mindchat" element={<MindfulnessBTBot />} />
              <Route path="careerchat" element={<CareerCoachBot />} />
              <Route  path="booking" 
                      element={<Booking/>} 
                      action={bookingAction(userContext)}
                      errorElement={<RouteError />}/>
              <Route  path="booking/:uid/:id" 
                      element={<BookingTicket />}
                      loader={bookingTicketLoader(userContext)} 
                      errorElement={<RouteError />}/>
            </Route>
          </Route>
    )
  )


  return(
      
        <RouterProvider router={router}/>
  )
}

export default App
