import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

//import components
import Header from './components/Header';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import CreateCourse from './components/CreateCourse';
import CourseDetail from './components/CourseDetail';
import UpdateCourse from './components/UpdateCourse';
import NotFound from './components/NotFound';
import Courses from './components/Courses';
import UnhandledError from './components/UnhandledError';
import Forbidden from './components/Forbidden';
import PrivateRoute from './PrivateRoute'
import withContext from './Context';
import EmailInUse from './components/EmailInUse';

//SignIn, SignUp, and SignOut variables with context

const HeaderWithContext = withContext(Header);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const CoursesWithContext = withContext(Courses);
const CreateCourseWithContext = withContext(CreateCourse);
const CourseDetailWithContext = withContext(CourseDetail);
const UpdateCourseWithContext = withContext(UpdateCourse);


export default () => (
  <Router>
    <div>
      <HeaderWithContext />
      <Switch>
        <Route exact path='/' render={() => <Redirect to='/courses'/>} />
        <Route exact path='/courses' component={CoursesWithContext} />
        <PrivateRoute path='/courses/create' component={CreateCourseWithContext} />
        <PrivateRoute path='/courses/:id/update' component={UpdateCourseWithContext} />
        <Route path='/courses/:id' component={CourseDetailWithContext} />
        <Route path='/signin' component={UserSignInWithContext} />
        <Route path='/signup' component={UserSignUpWithContext} />
        <Route path='/signout' component={UserSignOutWithContext} />
        <Route path='/notfound' component={NotFound} />
        <Route path='/forbidden' component={Forbidden} />
        <Route path='/error' component={UnhandledError} />
        <Route path='email-in-use' component={EmailInUse} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);
