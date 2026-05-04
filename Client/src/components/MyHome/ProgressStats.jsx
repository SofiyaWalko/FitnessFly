import { useState, useMemo, useEffect } from "react";
import styles from "./progressstats.module.css";
import ProgressChart from "./ProgressChart";

const periods = [
  { key: "all", label: "Весь период" },
  { key: "week", label: "Неделя" },
  { key: "month", label: "Месяц" },
  { key: "3month", label: "3 месяца" },
  { key: "6month", label: "6 месяцев" },
  { key: "year", label: "Год" }
];

export default function ProgressStats({ refresh }) {

  const [data,setData] = useState([]);
  const [period,setPeriod] = useState("all");
  const [metric,setMetric] = useState("weight");

  function loadStats(){

    const user_id = localStorage.getItem("user_id");

    fetch("http://fitnessfly.local/api/home/getProgressStats.php",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({user_id})
    })
    .then(res=>res.json())
    .then(data=>setData(data));

  }

  useEffect(()=>{
    loadStats();
  },[refresh]);

  const filteredData = useMemo(()=>{

    switch(period){
      case "week":
        return data.slice(-7);
      case "month":
        return data.slice(-30);
      case "3month":
        return data.slice(-90);
      case "6month":
        return data.slice(-180);
      case "year":
        return data.slice(-365);
      default:
        return data;
    }

  },[data,period]);

  return (
    <div className={styles.wrapper_chart}>

      <h3>Статистика изменений</h3>

      <div className={styles.tabs}>
        {periods.map((p)=>(
          <button
            key={p.key}
            className={`${styles.tab} ${period===p.key ? styles.activeTab : ""}`}
            onClick={()=>setPeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.chartCard}>

        <div className={styles.chartHeader}>

          <select
            className={styles.select}
            value={metric}
            onChange={(e)=>setMetric(e.target.value)}
          >
            <option value="weight">Вес</option>
            <option value="waist">Обхват талии</option>
            <option value="chest">Обхват груди</option>
            <option value="hips">Обхват бёдер</option>
          </select>

        </div>

        <ProgressChart
          data={filteredData}
          metric={metric}
        />

      </div>

    </div>
  );
}