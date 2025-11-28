import { useState } from "react";
import { Str1 } from "../Components/index";

export default ({ completeModal, setCompleteModal, completeShipment }) => {
  const [completeShip, setCompleteShip] = useState({
    receiver: "",
    index: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const changeStatus = async () => {
    const receiver = completeShip.receiver.trim();
    if (!receiver) {
      setErrorMessage("Receiver address is required.");
      return;
    }

    const parsedIndex = Number(completeShip.index);
    if (Number.isNaN(parsedIndex) || parsedIndex < 0) {
      setErrorMessage("Index must be a non-negative number.");
      return;
    }

    try {
      await completeShipment({ receiver, index: parsedIndex });
      setCompleteModal(false);
      setCompleteShip({ receiver: "", index: "" });
      setErrorMessage("");
    } catch (error) {
      console.log("Error completing shipment", error);
      setErrorMessage("Unable to complete shipment. Check inputs and status.");
    }
  };
  return completeModal ? (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-40"
        onClick={() => setCompleteModal(false)}
        ></div>
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-lg p-4 mx-auto bg-white border-4 border-black rounded-xl
         shadow-lg">
          <div className="flex jsutify-end">
            <button
              className="p-2 text-gray-400 rounded-md hover:bg-gray-100"
              onClick={() => setCompleteModal(false)}
            >
              <Str1/>
            
            </button>
          </div>
          <div className="max-w-sm mx-auto py-3 space-y-3 text-center">
            <h4 className="text-lg font-medium text-gray-800">
              Complete Shipment
            </h4>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative mt-3">
                <input
                  type="text"
                  placeholder="receiver"
                  className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent
               outline-none border focus:border-gray-400 shadow-sm rounded-lg"
                  onChange={(e) =>
                    setCompleteShip({
                      ...completeShip,
                      receiver: e.target.value,
                    })
                  }
                />
              </div>
              <div className="relative mt-3">
                <input
                  type="number"
                  placeholder="ID"
                  className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent
              outline-none border focus:border-gray-400 shadow-sm rounded lg"
                  value={completeShip.index}
                  onChange={(e) =>
                    setCompleteShip({
                      ...completeShip,
                      index: e.target.value,
                    })
                  }
                />
              </div>
              {errorMessage && (
                <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
              )}

              <button
                 onClick={changeStatus}
                className="block w-full mt-3 py-3 px-4 font-medium text-sm text-center
            text-white bg-black hover:bg-white hover:text-black active:bg-black
            rounded-lg border-4 border-black "
              >
                Change Status
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

