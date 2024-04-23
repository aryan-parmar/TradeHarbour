import { useState } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const AddCsv = () => {
  let [stock, setStock] = useState();
  const { toast } = useToast();
  return (
    <Container header="Select Stock">
      <div className="flex flex-col gap-4 w-full items-center h-full justify-center">
        <Card className="w-[50%]">
          <CardHeader>
            <CardTitle>Select Stock Ticker</CardTitle>
            <CardDescription>
              Select the stock ticker for which you want to predict the stock
              price.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(e) => setStock(e)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Stock Ticker"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Stocks</SelectLabel>
                  {/* indian stock tickers */}
                  <SelectItem value="SJVN.NS">SJVN</SelectItem>
                  <SelectItem value="SBIN.NS">SBI</SelectItem>
                  <SelectItem value="TCS.NS">TCS</SelectItem>
                  <SelectItem value="INFY.NS">INFY</SelectItem>
                  <SelectItem value="HDFC.NS">HDFC</SelectItem>
                  <SelectItem value="HDFCBANK.NS">HDFCBANK</SelectItem>
                  <SelectItem value="HCLTECH.NS">HCLTECH</SelectItem>
                  <SelectItem value="HDFCLIFE.NS">HDFCLIFE</SelectItem>
                  <SelectItem value="ICICIBANK.NS">ICICIBANK</SelectItem>
                  <SelectItem value="ITC.NS">ITC</SelectItem>
                  <SelectItem value="INDUSINDBK.NS">INDUSINDBK</SelectItem>
                  <SelectItem value="IOC.NS">IOC</SelectItem>
                  <SelectItem value="JSWSTEEL.NS">JSWSTEEL</SelectItem>
                  <SelectItem value="KOTAKBANK.NS">KOTAKBANK</SelectItem>
                  <SelectItem value="LT.NS">LT</SelectItem>
                  <SelectItem value="MARUTI.NS">MARUTI</SelectItem>
                  <SelectItem value="NTPC.NS">NTPC</SelectItem>
                  <SelectItem value="RELIANCE.NS">RELIANCE</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                if (stock) {
                  localStorage.setItem("stock", stock);
                  toast({
                    title: "Stock Ticker Selected",
                    description: `You have selected ${stock}`,
                    type: "success",
                  });
                } else {
                  toast({
                    title: "Stock Ticker Not Selected",
                    description: `Please select a stock ticker`,
                    variant: "destructive",
                  });
                }
              }}
            >
              Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
};

export default AddCsv;
