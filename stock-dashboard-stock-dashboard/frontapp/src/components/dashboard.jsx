/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import Header from "./header";

export function Card({ symbol = "stock", closingPrices = [] }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const prices = Object.values(closingPrices);
    const up = ((prices.slice(-1) - prices[0]) * 100) / prices[0];
    setPercent(up.toFixed(2));
  }, []);

  return (
    <>
      <div className="card shadow border-0 min-w-[200px]">
        <div className="card-body">
          <div className="row items-center">
            <div className="col">
              <strong className="text-muted text-lg d-block mb-2">
                {symbol.split(".")[0]}
              </strong>
            </div>
            <div className="col-auto">
              <div className="icon icon-shape bg-primary text-white text-lg rounded-circle">
                <i className="bi bi-people"></i>
              </div>
            </div>
          </div>
          <div className="mt-2 mb-0 text-lg">
            <span className="badge badge-pill bg-soft-success text-success me-2">
              <i className="bi bi-arrow-up me-1"></i>
              {percent}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function Dashboard() {
  const [consecutiveData, setConsecutiveData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8082/get_consecutive").then(async (res) => {
      const json = await res.json();
      if (json.error) {
        alert(json.error);
        return 0;
      }

      //console.log(json)
      setConsecutiveData(json);
    });
  }, []);

  return (
    <>
      <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
        <div className="h-screen flex-grow-1 overflow-y-lg-auto">
          <Header />
          <main className="py-6 bg-surface-secondary">
            <div className="container-fluid">
              {/* fitler 1 */}
              <h3 className="text-slate-600">
                Stocks that went up for 3-5 consecutive days
              </h3>
              <br />
              <div className="row g-6 mb-6">
                <div className="flex gap-6">
                  {consecutiveData.map((z, i) => (
                    <Card key={i} {...z} />
                  ))}
                </div>
              </div>

              <h3 className="mb-0">STOCKS</h3>
              <div className="card shadow border-0 mb-7"></div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
