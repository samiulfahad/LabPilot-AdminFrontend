import useStore from "./store";
const TestList = ({ list, categoryId }) => {
  const { setPopup } = useStore();
  return (
    <div>
      {list.map((test) => (
        <div key={test._id} className="flex justify-between items-centr m-1.5 border-1 p-1">
          <div>Name: {test.name}</div>
          <div>
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

export default TestList;
