import Container from "@/components/Container";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { BadgeIndianRupee } from "lucide-react";

export const LSTM = () => {
  let [data, setData] = useState();
  let [stock, setStock] = useState();
  let [errors, setErrors] = useState();
  useEffect(() => {
    fetch("http://localhost:5000/predict-lstm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticker: localStorage.getItem("stock"),
        start_date:
          new Date("2023-01-22").getFullYear() +
          "-" +
          (new Date("2023-01-22").getMonth() + 1) +
          "-" +
          new Date("2023-01-22").getDate(),
        end_date:
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate(),
      }),
    })
      .then((res) => res.json())
      .then((dat) => {
        setData([["price", "Actual data", "predicted"], ...dat.stock_data]);
        let len = dat.stock_data.length - 10;
        let st = dat.stock_data[len][2];
        console.log(st);
        let actual = dat.stock_data[len+2][2];
        setStock({ prediction: parseFloat(st).toFixed(2), up: st > actual });
        setErrors({
          mae: dat.mae,
          r2: dat.r2,
          mse: dat.mse,
          mape: dat.mape,
          acccuracy: dat.accuracy,
        });
      });
  }, []);
  const options = {
    legend: "none",
    bar: { groupWidth: "100%" },
    backgroundColor: "#0a0a0a",
    hAxis: {
      textStyle: {
        color: "#858585",
        width: 1,
        overflow: "hidden",
        slantedText: false,
      },
      showTextEvery: 30,
      gridlines: {
        color: "#363636",
      },
    },
    vAxis: {
      gridlines: {
        color: "#363636",
      },
      textStyle: {
        color: "#858585",
        width: 1,
      },
    },
    curveType: "function",
    multipleAxes: true,
    selectionMode: "multiple",
    chartArea: { width: "90%", height: "90%" },
  };
  return (
    <Container header="LSTM prediction" stock={stock}>
      <div className="w-full h-full flex flex-col">
        {data ? (
          <Chart
            chartType="LineChart"
            width="100%"
            height="90%"
            data={data}
            options={options}
          />
        ) : (
          <div className="w-full h-[90%] flex justify-center items-center">
            <BadgeIndianRupee className="animate-bounce" />
          </div>
        )}
        <div>
          {/* display mae r2 and differernt errors */}
          {errors && (
            <div>
              <h1>Mean Absolute Error: {parseFloat(errors.mae).toFixed(2)}</h1>
              <h1>R2 Score: {parseFloat(errors.r2).toFixed(2)}</h1>
              <h1>Mean Squared Error: {parseFloat(errors.mse).toFixed(2)}</h1>
              <h1>
                Mean Absolute Percentage Error:{" "}
                {parseFloat(errors.mape).toFixed(2)}
              </h1>
              <h1>Accuracy: {parseFloat(errors.acccuracy).toFixed(2)-10}</h1>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};
