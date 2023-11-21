import MobileSidebar from "./MobileSideBar";
import NavbarRoutes from "./NavbarRoutes";

const Navbar = () => {
  return (
    <div className="p-4 h-full flex flex-center bg-white shadow-sm items-center">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
