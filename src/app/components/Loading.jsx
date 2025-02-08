const Loading = ({ small }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        small ? "" : "min-h-screen"
      } `}
    >
      <div
        className={`${
          small ? "w-8 h-8" : "w-16 h-16"
        } border-4 border-t-4 border-gray-200 border-t-secondColor rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loading;
