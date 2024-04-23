import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container header="Home">
      <ul className="flex flex-col gap-4 w-full items-start h-full justify-start ml-14 list-disc">
        <li>
          <div>
            <h1 className="text-xl font-bold">Welcome to Trade Harbour</h1>
            <p className="text-md text-muted-foreground text-center">
              Trade Harbour is a stock market prediction tool that uses machine
              learning models to predict the stock price of a given stock
              ticker.
            </p>
            <Button asChild variant="link" className="p-0 m-0 h-fit">
              <Link to="/add-csv">Get Started</Link>
            </Button>
          </div>
        </li>
        <li>
          <div className="flex gap-4 flex-col">
            <h1 className="text-xl font-bold">Made by</h1>
            <ul className="list-disc ml-10">
              <li>
                <Button asChild variant="link">
                  <a href="https://github.com/aryan-parmar">Aryan Parmar</a>
                </Button>
              </li>
              <li>
                <Button asChild variant="link">
                  <a href="https://github.com/adityaparikh7">Aditya Parikh</a>
                </Button>
              </li>
              <li>
                <Button asChild variant="link">
                  <a href="https://github.com/madhavpatl">Madhav Patel</a>
                </Button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </Container>
  );
};

export default Home;
