// import { VscThreeBars } from "react-icons/vsc";
const Header = () => {
  // const handleSidebarToggle = () => {
  //   alert("Coming Soon");
  // };
  return (
    <div className="relative flex items-center justify-center py-4 bg-purple-500">
      {/* <VscThreeBars
        className="text-3xl absolute left-[16px]"
        onClick={() => handleSidebarToggle()}
      /> */}
      <h1 className="text-2xl font-bold">FAMILY TREE</h1>
    </div>
  );
};

export default Header;
