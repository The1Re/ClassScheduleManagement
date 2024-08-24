import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { HomePage, TeacherPage, ClassPage, NotFoundPage } from './pages';
import NavBar from './components/Navbar';

const App = () => {
  const dev = true;
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={dev ? <Navigate to="/teacher" /> : <HomePage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/class" element={<ClassPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
