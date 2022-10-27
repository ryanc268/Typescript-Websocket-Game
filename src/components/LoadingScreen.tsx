import { Puff } from "react-loader-spinner";

const LoadingScreen: React.FC = () => {
  //TODO: Maybe add some user stats once they are available / a db is introduced to store that stuff
  return (
    <div className="bg-bl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform items-center text-center">
      <h1 className="text-2xl text-white">- Loading Next Game -</h1>
      <br />
      <Puff
        height="300"
        width="300"
        radius={1}
        color="#7ca6e4"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default LoadingScreen;
