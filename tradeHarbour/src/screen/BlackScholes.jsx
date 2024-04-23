import { useState } from "react";
import Container from "@/components/Container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const BlackScholes = () => {
  const [strikePrice, setStrikePrice] = useState(0);
  const [riskFreeRate, setRiskFreeRate] = useState(0);
  const [timeToMaturity, setTimeToMaturity] = useState(0);
  const [volatility, setVolatility] = useState(0);
  const [callOptionPrice, setCallOptionPrice] = useState(0);
  const [annualizedVolatility, setAnnualizedVolatility] = useState(0);
  const Calculate = () => {
    fetch("http://localhost:5000/black-scholes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticker: localStorage.getItem("stock"),
        strike_price: strikePrice,
        risk_free_rate: riskFreeRate,
        time_to_maturity: timeToMaturity,
        volatility: volatility,
      }),
    })
      .then((res) => res.json())
      .then((dat) => {
        setCallOptionPrice(dat.call_option_price);
        setAnnualizedVolatility(dat.annualized_volatility);
      });
  };

  return (
    <Container header="Black Scholes Calculator">
      <div className="w-full flex justify-center items-center h-full">
        <Card className="w-[70%]">
          <CardHeader>
            <CardTitle>Black Scholes Calculator</CardTitle>
            <CardDescription>
              Black Scholes Calculator is a mathematical model used for
              calculating the theoretical price
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex w-full mt-3 gap-5">
            <div className="flex flex-col w-full gap-5">
              <div className="flex flex-col w-full gap-2">
                <Input
                  label="Strike Price"
                  type="number"
                  id="strike-price"
                  placeholder="Strike Price"
                  onChange={(e) => {
                    setStrikePrice(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <Input
                  label="Risk-Free Rate"
                  type="number"
                  id="risk-free-rate"
                  placeholder="Risk-Free Rate"
                  onChange={(e) => {
                    setRiskFreeRate(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <Input
                  label="Time to Maturity"
                  type="number"
                  id="time-to-maturity"
                  placeholder="Time to Maturity"
                  onChange={(e) => {
                    setTimeToMaturity(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <Input
                  label="Volatility"
                  type="number"
                  id="volatility"
                  placeholder="Volatility"
                  onChange={(e) => {
                    setVolatility(e.target.value);
                  }}
                />
              </div>
              <div className="flex w-full gap-2">
                <Input
                  label="Stock"
                  type="text"
                  id="stock"
                  placeholder="Stock"
                  value={"Annualized volatility: " + annualizedVolatility}
                  disabled
                />
                <Input
                  label="Call option price"
                  type="text"
                  id="stock"
                  placeholder="Stock"
                  value={"call option price: " + callOptionPrice}
                  disabled
                />
              </div>
              <Button onClick={Calculate}>Calculate</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default BlackScholes;
