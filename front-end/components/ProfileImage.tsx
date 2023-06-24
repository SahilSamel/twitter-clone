import Image from "next/image";

const ProfileImage = ({ width = 400, height = 400, ...restProps }) => {
  return (
    <Image
      src="https://pbs.twimg.com/profile_images/1369150025360494593/U6uUYd2l_400x400.jpg"
      width={width}
      height={height}
      alt="Picture of the author"
      {...restProps}
    />
  );
};

export default ProfileImage;
