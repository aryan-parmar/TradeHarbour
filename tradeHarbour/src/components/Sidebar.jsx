import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

let buttons = [
  { name: "Home", link: "/"},
  { name: "Select Stock", link: "/add-csv" },
  { name: "View Stock", link: "/view-stock" },
  { name: "LSTM", link: "/lstm" },
  { name: "BROWNIAN", link: "/brownian" },
  { name: "CNN", link: "/cnn" },
  { name: "SIP Calculator", link: "/sip-calculator" },
];

// eslint-disable-next-line react/prop-types
const Sidebar = ({ className }) => {
  let [active, setActive] = useState(0);
  return (
    <div
      className={
        className +
        " h-full border-r flex flex-col items-center justify-start gap-4"
      }
    >
      {buttons.map((button, ind) => (
        <Button
          key={button.name}
          variant={ind === active ? "default" : "outline"}
          className="w-[85%]"
          onClick={() => setActive(ind)}
          asChild
        >
          <Link to={button.link}>{button.name}</Link>
        </Button>
      ))}
    </div>
  );
};

export default Sidebar;
