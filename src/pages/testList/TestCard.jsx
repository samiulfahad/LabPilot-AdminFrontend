import useStore from "./store";
const TestCard = ({ list, categoryId }) => {
  const { setPopup, setModal } = useStore();
  return (
    <div>
      {list.map((test) => (
        <div key={test._id} className="flex justify-between items-centr m-1.5 border-1 p-1">
          <div>
            <p>Name: {test.name}</p>
            {test.defaultSchema ? (
              <div className="flex justify-center items-center">
                <p className="text-green-500">Live</p>
                 <button className="border-2 px-2 mx-2">Change Schema</button>
                <button className="border-2 px-2 mx-2">Unset Schema</button>
              </div>
            ) : (
              <button
                onClick={() => setModal({ view: "testAssociatedschemaList", data: { categoryId, testId: test._id } })}
                className="border-1 p-.5 px-2 text-blue-500"
              >
                Set Schema
              </button>
            )}
          </div>

          <div>
            <button
              onClick={() => {
                setModal({
                  view: "editTestForm",
                  data: { categoryId: categoryId, testId: test._id, testName: test.name },
                });
              }}
              className="add-btn-sm mx-2"
            >
              Edit Test
            </button>
            <button
              onClick={() => {
                setPopup({
                  type: "confirmation",
                  message: `Are you going to delete ${test.name}`,
                  action: "deleteTest",
                  data: { categoryId, testId: test._id },
                });
              }}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestCard;
