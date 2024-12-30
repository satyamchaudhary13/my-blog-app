import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const profilePictureUrl = profilePicture ? `${apiUrl}${profilePicture}` : null;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
      setProfilePicture(user.profilePicture);
    }
  }, [localStorage.getItem("user")]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsername(null);
    setProfilePicture(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and brand name */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white text-4xl font-extrabold tracking-wider hover:text-blue-200 transition duration-300">
            MyBlog
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <ul className="flex space-x-6 text-white">
            <li>
              <Link to="/" className="hover:text-blue-200 transition duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-200 transition duration-200">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-200 transition duration-200">
                Contact
              </Link>
            </li>

            {!localStorage.getItem("token") ? (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-200 transition duration-200">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-200 transition duration-200">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Create Post */}
                <li>
                  <Link to="/create-post" className="hover:text-blue-200 transition duration-200">
                    Create Post
                  </Link>
                </li>

                {/* Profile Section with Modal */}
                <li className="relative group">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    {profilePictureUrl && (
                      <img
                        src={profilePictureUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-blue-400"
                      />
                    )}
                    <span className="text-gray-200 font-medium text-lg">Hi, {username}!</span>
                  </div>

                  {/* Modal */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200">
                    <ul className="py-2">
                      <li className="px-4 py-2 hover:bg-gray-100">
                        <Link to="/profile" className="text-gray-700">Profile</Link>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100">
                        <Link to="/settings" className="text-gray-700">Settings</Link>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100">
                        <button
                          onClick={handleLogout}
                          className="text-red-500 w-full text-left"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
