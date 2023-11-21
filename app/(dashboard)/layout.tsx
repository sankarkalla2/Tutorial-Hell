import Navbar from "./_components/Navbar";
import SideBar from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex flex-col w-56 fixed inset-y-0 h-full z-50">
        <SideBar />
      </div>
      <div className="border-b-2 fixed inset-y-0 w-full h-[80px] md:pl-56">
        <Navbar />
      </div>
      <main className="md:pl-56 pt-[80px]">{children}</main>
    </div>
  );
};

export default DashboardLayout;
