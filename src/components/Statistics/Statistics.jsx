import React, { useEffect, useState } from "react";
import css from "./Statistics.module.scss";
import TopCard from "./TopCard";
import BottomCard from "./BottomCard";
import Graph from "./Graph";
import { useTrail, animated as a } from "@react-spring/web";
import { useGetBusinessStatisticsQuery } from "@/services/api/profileApi/profileApi";

const config = { mass: 15, tension: 5000, friction: 300 };

const Statistics = () => {
  const [toggle, set] = useState(true);
  const [toggle2, set2] = useState(false);

  const [topData, setTopData] = useState([
    {
      name: "Queue Time",
    },
    {
      name: "Total Cancelation",
    },
    {
      name: "Total Visits",
    },
    {
      name: "Avg Visit Cost",
    },
    {
      name: "Total Revenue",
    },
  ]);

  const [bottomData, setBottomData] = useState([
    {
      heading: "Percent",
      subHeading: "Cancellations",
      value: "5%",
    },
    {
      heading: "Appointment Cancelled",
      subHeading: "Most",
      value: "Haircut For a Man",
    },
    {
      heading: "Best Turn",
      subHeading: "Sold",
      value: "Queue Description",
    },
    {
      heading: "The Fast Queue",
      subHeading: "Most",
      value: "Queue Description",
    },
    {
      heading: "The Space Queue",
      subHeading: "Most",
      value: "Queue Description",
    },
  ]);

  const trail = useTrail(topData ? topData.length : 0, {
    config,
    opacity: toggle ? 1 : 0,
    y: toggle ? 0 : 50,
    height: toggle ? 10 : 0,
    from: { opacity: 0, y: 50, height: 0 },
  });

  const trail2 = useTrail(topData ? topData.length : 0, {
    config,
    opacity: toggle2 ? 1 : 0,
    y: toggle2 ? 0 : 50,
    height: toggle2 ? 10 : 0,
    from: { opacity: 0, y: 50, height: 0 },
  });

  // Get Business Statistics
  const { data, isLoading, error } = useGetBusinessStatisticsQuery();
  const [isInitialized, setIsInitialized] = useState(false);
  console.log(data);

  useEffect(() => {
    setTimeout(() => {
      set2(true);
    }, 30);
  }, []);

  useEffect(() => {
    if (data) {
      // Set Top Data
      const res = data.data;
      
      setTopData([
        {
          name: "Queue Time",
          value: "23 min",
        },
        {
          name: "Total Cancelation",
          value: res?.cancelledAppointmentsCount,
        },
        {
          name: "Total Visits",
          value: res?.totalAppointments,
        },
        {
          name: "Avg Visit Cost",
          value: new Intl.NumberFormat("he-IL", {
            style: "currency",
            currency: "ILS",
          }).format(res?.averageAppointmentCost),
        },
        {
          name: "Total Revenue",
          value: new Intl.NumberFormat("he-IL", {
            style: "currency",
            currency: "ILS",
          }).format(res?.totalRevenue),
        },
      ]);

      // Set Bottom Data
      setBottomData([
        {
          heading: "Percent",
          subHeading: "Cancellations",
          value: res?.percentageCancellations,
        },
        {
          heading: "Appointment Cancelled",
          subHeading: "Most",
          value: "Haircut for a Man",
        },
        {
          heading: "Best Turn",
          subHeading: "Sold",
          value: "Queue Description",
        },
        {
          heading: "The Fast Queue",
          subHeading: "Most",
          value: "Queue Description",
        },
        {
          heading: "The Space Queue",
          subHeading: "Most",
          value: "Queue Description",
        },
      ]);

      setIsInitialized(true);
    }
  }, [data]);

  return (
    <div className={`${css.wrapper}`}>
      <div className={css.headingTop}>
        <h1>Statistics</h1>
        <div className={css.bottom}>
          <p>Visits</p>
        </div>
      </div>

      {/* Top Cards  */}
      <div
        className={`${css.topCards} grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-3 md:gap-x-5 md:gap-y-5`}
      >
        {topData?.map((item, index) => {
          const x = trail[index]?.y;
          return (
            <a.div
              className={css.cardTop}
              key={index}
              style={{
                transform: x ? x.to((x) => `translate3d(0,${x}px,0)`) : "none",
              }}
            >
              <TopCard key={index} data={item} isInitialized={isInitialized} />
            </a.div>
          );
        })}
      </div>

      {/* Bottom Cards  */}
      <h3
        className="mt-10 -mb-1 md:hidden"
        style={{ fontSize: "23px", fontWeight: "500", color: "#3c3b3b" }}
      >
        Metrics Overview
      </h3>
      <div
        className={`${css.cardBottom} mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-3 md:gap-x-5 md:gap-y-5`}
      >
        {bottomData?.map((item, index) => {
          const x = trail2[index]?.y;
          return (
            <a.div
              className={css.subCard}
              key={index}
              style={{
                transform: x ? x.to((x) => `translate3d(0,${x}px,0)`) : "none",
              }}
            >
              <BottomCard
                key={index}
                index={index}
                data={item}
                isInitialized={isInitialized}
              />
            </a.div>
          );
        })}
      </div>

      {/* Graph  */}
      <Graph />
    </div>
  );
};

export default Statistics;
