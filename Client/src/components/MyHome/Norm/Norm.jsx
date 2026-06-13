import { useEffect, useState } from "react";
import styles from "./norm.module.css";
import NormItem from "./NormItem";
import { API_BASE } from "@/config";

function Norm({ refresh }) {
	const [data, setData] = useState(null);

	function loadNorms() {
		const user_id = localStorage.getItem("user_id");

		fetch(`${API_BASE}/home/getNorms.php`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id }),
		})
			.then((res) => res.json())
			.then((data) => setData(data));
	}

	useEffect(() => {
		loadNorms();
	}, [refresh]);

	if (!data) return null;

	return (
		<div className={styles.norm}>
			<NormItem
				name="Норма калорий"
				count={data.calories}
				unit="ккал"
				note={data.goal_note}
			/>

			<NormItem
				name="Норма воды"
				count={data.water_ml}
				unit="мл"
				note={`${data.water_glasses} стаканов по 250 мл`}
			/>

			<NormItem
				name="Индекс массы тела"
				count={data.bmi}
				unit=""
				note={data.bmi_note}
			/>
		</div>
	);
}

export default Norm;
