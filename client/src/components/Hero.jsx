import logo from "../assets/logo.png";

export default function Hero() {
  return (
    <div className="pt-24">
      <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left">
          <p className="uppercase tracking-loose w-full">
            What business are you?
          </p>
          <h1 className="my-4 text-5xl font-bold leading-tight">
            Please use this payment Page.
          </h1>
          <p className="leading-normal text-2xl mb-8">This is paid by wise.</p>
        </div>
        <div className="w-full md:w-3/5 py-6 text-center">
          <img className="w-full md:w-4/5 z-50" src={logo} />
        </div>
      </div>
    </div>
  );
}
