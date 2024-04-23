import { useState } from "react";
import Container from "@/components/Container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Chart from "react-google-charts";

const SIP_calculator = () => {
  let [monthlyInvestment, setMonthlyInvestment] = useState(500);
  let [expectedReturns, setExpectedReturns] = useState(1);
  let [timePeriod, setTimePeriod] = useState(1);
  let [data, setData] = useState();
  const options = {
    // is3D: true,
    backgroundColor: "transparent",
    pieHole: 0.4,
    legend: {
      position: "bottom",
      textStyle: {
        color: "#FFF",
      },
    },
    slices: { 0: { color: "#006EFF" }, 1: { color: "#55298f" } },
  };
  const Calculate = () => {
    fetch("http://localhost:5000/sip-calculator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sip_amount: monthlyInvestment,
        sip_rate: expectedReturns,
        sip_period: timePeriod,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let d = [
          ["investment", "returns"],
          ["Investment", parseFloat(data.returns[0])],
          ["Returns", parseFloat(data.returns[1])],
        ];
        console.log(d);
        setData(d);
      });
  };
  return (
    <Container header="SIP Calculator">
      <div className="w-full flex justify-center items-center h-full">
        <Card className="w-[70%]">
          <CardHeader>
            <CardTitle>SIP Calculator</CardTitle>
            <CardDescription>
              Calculate the amount you need to invest in SIP to achieve your
              financial goals.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex w-full mt-3 gap-5">
            <div className="flex flex-col gap-7 w-1/2">
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <h1>Monthly investment</h1>
                  <div className="h-8 w-24 bg-green-200 flex items-center justify-between p-3 rounded-md text-background">
                    <span className="font-bold">₹</span>
                    <span>{monthlyInvestment}</span>
                  </div>
                </div>
                <Slider
                  name="Expected returns"
                  min={500}
                  max={100000}
                  onValueChange={(e) => setMonthlyInvestment(e[0])}
                />
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <h1>Expected returns</h1>
                  <div className="h-8 w-24 bg-green-200 flex items-center justify-between p-3 rounded-md text-background">
                    <span>{expectedReturns}</span>
                    <span className="font-bold">%</span>
                  </div>
                </div>
                <Slider
                  name="Month Investment"
                  min={1}
                  max={30}
                  onValueChange={(e) => setExpectedReturns(e[0])}
                />
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <h1>Time period</h1>
                  <div className="h-8 w-24 bg-green-200 flex items-center justify-between p-3 rounded-md text-background">
                    <span>{timePeriod}</span>
                    <span className="font-bold">Yr</span>
                  </div>
                </div>
                <Slider
                  name="Month Investment"
                  min={1}
                  max={30}
                  onValueChange={(e) => setTimePeriod(e[0])}
                />
              </div>
              <Button onClick={Calculate}>Calculate</Button>
            </div>
            <div>
              {data && (
                <Chart
                  width={"100%"}
                  height={"100%"}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={data}
                  options={options}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default SIP_calculator;
