import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Class Schedule Management
        </Link>
        <div className="space-x-4">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-900 transition duration-300 ease-in-out"
          >
            Home
          </Link>
          <Link
            to="/teacher"
            className="text-gray-600 hover:text-gray-900 transition duration-300 ease-in-out"
          >
            Teacher
          </Link>
          <Link
            to="/class"
            className="text-gray-600 hover:text-gray-900 transition duration-300 ease-in-out"
          >
            Class
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;