import { NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const onLogout = () => {
    localStorage.removeItem(storageKey);
    setTimeout(() => {
      location.replace(pathname);
    }, 1500);
  };
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/75 border-b border-gray-200 shadow-sm mb-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ul className="flex items-center justify-between">
          <li className="text-gray-900 hover:text-indigo-600 transition-colors font-bold text-xl tracking-tight">
            <NavLink to="/">Home</NavLink>
          </li>
          {userData ? (
            <div className="flex items-center space-x-6">
              <li className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                <NavLink to="/todos">Todos</NavLink>
              </li>
              <button
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <li className="text-gray-600 hover:text-indigo-600 transition-colors font-medium px-2">
                <NavLink to="/register">Register</NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Login
                </NavLink>
              </li>
            </div>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
