import PropTypes from "prop-types";
import { ChevronDown, ChevronUp } from "lucide-react";

const Container = ({ children, header, stock }) => {
  return (
    <div className="border h-[97%] w-[97%] rounded-lg flex flex-col p-3 gap-2 items-center">
      <div className="w-full flex justify-center">
        <h1 className="text-2xl w-[98%] border-b pb-3 font-bold">{header}</h1>
        {stock && (
          <h1
            className={`text-2xl w-fit flex justify-center items-center text-end border-b pb-3 font-bold ${
              stock.up ? "text-green-500" : "text-red-400"
            }`}
          >
            {/* indian currency */}
            ₹
            {stock.prediction}
            {stock.up ? <ChevronUp strokeWidth={3} /> : <ChevronDown strokeWidth={3} />}
          </h1>
        )}
      </div>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.string.isRequired,
  stock: PropTypes.object,
};

export default Container;
