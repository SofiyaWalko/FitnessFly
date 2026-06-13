import { useState, useMemo, useEffect } from "react";
import styles from "./progressstats.module.css";
import ProgressChart from "./ProgressChart";
import CustomSelect from "@/components/ui/CustomSelect/CustomSelect";
import { API_BASE } from "@/config";

const periods = [
  { key: "all", label: "Весь период" },
  { key: "week", label: "Неделя" },
  { key: "month", label: "Месяц" },
  { key: "3month", label: "3 месяца" },
  { key: "6month", label: "6 месяцев" },
  { key: "year", label: "Год" }
];

export default function ProgressStats({ refresh }) {

  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("all");
  const [metric, setMetric] = useState("weight");

  function loadStats() {
    const user_id = localStorage.getItem("user_id");

    fetch(`${API_BASE}/home/getProgressStats.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id })
    })
      .then(res => res.json())
      .then(setData);
  }

  useEffect(() => {
    loadStats();
  }, [refresh]);

  /* ======================
     СОРТИРОВКА
  ====================== */
  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [data]);

  /* ======================
     ФИЛЬТР ПО ПЕРИОДУ
  ====================== */
  const filteredData = useMemo(() => {
    if (!sortedData.length) return [];

    const now = new Date();

    return sortedData.filter(item => {
      const itemDate = new Date(item.date);

      switch (period) {

        case "week": {
          const d = new Date(now);
          d.setDate(d.getDate() - 7);
          return itemDate >= d;
        }

        case "month": {
          const d = new Date(now);
          d.setMonth(d.getMonth() - 1);
          return itemDate >= d;
        }

        case "3month": {
          const d = new Date(now);
          d.setMonth(d.getMonth() - 3);
          return itemDate >= d;
        }

        case "6month": {
          const d = new Date(now);
          d.setMonth(d.getMonth() - 6);
          return itemDate >= d;
        }

        case "year": {
          const d = new Date(now);
          d.setFullYear(d.getFullYear() - 1);
          return itemDate >= d;
        }

        default:
          return true;
      }
    });

  }, [sortedData, period]);

  return (
    <div className={styles.wrapper_chart}>

      <h3>Статистика изменений</h3>

      <div className={styles.tabs}>
        {periods.map((p) => (
          <button
            key={p.key}
            className={`${styles.tab} ${period === p.key ? styles.activeTab : ""}`}
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.chartCard}>

        <div className={styles.chartHeader}>
          <div className={styles.selectWrap}>
          <CustomSelect
            value={metric}
            options={[
              { value: "weight", label: "Вес" },
              { value: "waist", label: "Обхват талии" },
              { value: "chest", label: "Обхват груди" },
              { value: "hips", label: "Обхват бёдер" },
            ]}
            onChange={(value) => setMetric(value)}
          />
          </div>
        </div>

        {filteredData.length > 0 ? (
          <ProgressChart
            data={filteredData}
            metric={metric}
          />
        ) : (
          <div className={styles.empty}>
            Нет данных за выбранный период
          </div>
        )}

      </div>

    </div>
  );
}