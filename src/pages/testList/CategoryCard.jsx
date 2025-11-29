import useStore from "./store";
import TestList from "./TestList";
const CategoryCard = ({ categoryList }) => {
  const { setPopup, setModal } = useStore();
  return (
    <div>
      {categoryList.map((item) => (
        <div key={item._id} className=" border-2 m-1 p-2 flex justify-between items-center">
          <div>
            <p>Name: {item.categoryName}</p>
            <p>Total Test: {item.tests.length}</p>
            <TestList categoryId={item._id} list={item.tests}/>
          </div>
          <div>
            <button
              onClick={() => {
                setPopup({
                  type: "confirmation",
                  action: "deleteCategoy",
                  message: `You are going to delete ${item.categoryName} category`,
                  data: item._id
                });
              }}
              className="delete-btn mx-2"
            >
              Delete Category
            </button>
            <button onClick={() => setModal({ view: "addTestForm", data: item._id })} className="add-btn-sm">
              Add Test
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
