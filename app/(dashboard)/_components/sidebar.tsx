import Logo from "./logo";
import SideBarRoutes from "./sideBarRoutes";

const SideBar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex w-full justify-center">
        <SideBarRoutes />
      </div>
    </div>
  );
};

export default SideBar;
