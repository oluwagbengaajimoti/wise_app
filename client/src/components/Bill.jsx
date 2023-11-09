import BillForm from "./BillForm";
import hero from "../assets/hero.webp";

export default function Bill() {
  return (
    <section className="bg-white border-b py-8">
      <div className="container max-w-7xl mx-auto m-8">
        <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
          Payment
        </h2>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
        </div>
        <div className="flex flex-wrap">
          <div className="w-5/6 sm:w-1/2 p-6">
            <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
              Are you sure?
            </h3>
            <p className="text-gray-600 mb-8">
              Please check the information before you click the Submit button
            </p>
            <div className="w-full md:w-3/5 py-6 mx-auto text-center">
              <img className="w-full md:w-4/5 z-50" src={hero} />
            </div>
          </div>
          <div className="w-full sm:w-1/2 p-2">
            <BillForm />
          </div>
        </div>
      </div>
    </section>
  );
}
