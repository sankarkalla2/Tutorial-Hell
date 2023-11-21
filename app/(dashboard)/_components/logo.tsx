import Image from "next/image";

const Logo = () => {
  return (
    <Image
      className="cursor-pointer"
      src="/logo.svg"
      alt="logo"
      height={60}
      width={60}
    />
  );
};

export default Logo;
