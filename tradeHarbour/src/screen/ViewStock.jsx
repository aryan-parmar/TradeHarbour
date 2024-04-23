import Container from "@/components/Container";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { BadgeIndianRupee } from "lucide-react";

const ViewStock = () => {
  let [data, setData] = useState();
  let [period, setPeriod] = useState("1mo");
  let [skip, setSkip] = useState(5);
  useEffect(() => {
    setData(null);
    document.title = "View Stock";
    fetch("http://localhost:5000/get_stock_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticker: localStorage.getItem("stock"),
        period,
      }),
    }).then((res) => {
      res.json().then((data) => {
        setData([["Day", "", "", "", ""], ...data.data]);
      });
    });
  }, [period]);
  const options = {
    legend: "none",
    bar: { groupWidth: "100%" }, // Remove space between bars.
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
      risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
    },
    backgroundColor: "#0a0a0a",
    hAxis: {
      textStyle: {
        color: "#858585",
        width: 1,
        overflow: "hidden",
        slantedText: false,
      },
      showTextEvery: skip,
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
    selectionMode: "multiple",
    tooltip: { trigger: "selection" },
    aggregationTarget: "category",
    chartArea: { width: "90%", height: "90%" },
  };
  return (
    <Container header="View Stock">
      <div className="w-full h-full flex flex-col">
        {data ? (
          <Chart
            chartType="CandlestickChart"
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
        <Tabs
          defaultValue="1mo"
          className="w-[600px]"
          onValueChange={(e) => {
            setPeriod(e);
            if (e === "1mo") setSkip(5);
            else if (e === "3mo") setSkip(10);
            else if (e === "6mo") setSkip(20);
            else if (e === "1y") setSkip(40);
            else if (e === "5y") setSkip(200);
          }}
        >
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="1mo">1M</TabsTrigger>
            <TabsTrigger value="3mo">3M</TabsTrigger>
            <TabsTrigger value="6mo">6M</TabsTrigger>
            <TabsTrigger value="1y">1Y</TabsTrigger>
            <TabsTrigger value="5y">5Y</TabsTrigger>
          </TabsList>
          {/* <TabsContent value="1m">1M</TabsContent>
          <TabsContent value="3m">3M</TabsContent>
          <TabsContent value="6m">6M</TabsContent>
          <TabsContent value="1y">1Y</TabsContent>
          <TabsContent value="5y">5Y</TabsContent> */}
        </Tabs>
      </div>
    </Container>
  );
};

export default ViewStock;
