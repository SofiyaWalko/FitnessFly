import { useEffect, useState } from "react";
import styles from "./parameters.module.css";
import Parameter from "./Parameter";
import BigButton from "@components/ui/BigButton/BigButton";
import ParametersForm from "./ParametersForm";
import HistoryModal from "./HistoryModal";

function Parameters({ refresh, onUpdate }) {
	const [data, setData] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [showHistory, setShowHistory] = useState(false);

	function loadParameters() {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/home/getParameters.php", {
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
		loadParameters();
	}, [refresh]);

	function handleSuccess() {
		loadParameters();

		if (onUpdate) {
			onUpdate();
		}
	}

	if (!data) return null;

	return (
		<>
			<div className={styles.parameters}>
				<h3>Мои параметры</h3>

				<div className={styles.items}>
					<div className={styles.parameterGroup}>
						<Parameter
							name="Текущий вес"
							value={data.weight}
							unit="кг"
						/>
						<Parameter name="Рост" value={data.height} unit="см" />
						<Parameter
							name="Обхват груди"
							value={data.chest}
							unit="см"
						/>
						<Parameter
							name="Обхват талии"
							value={data.waist}
							unit="см"
						/>
						<Parameter
							name="Обхват бёдер"
							value={data.hips}
							unit="см"
						/>
					</div>

					<div className={styles.parametersActions}>
						<BigButton
							text="Добавить новые измерения"
							onClick={() => setShowForm(true)}
						/>
						<BigButton
							text="История изменений"
							onClick={() => setShowHistory(true)}
						/>
					</div>
				</div>
			</div>

			{showForm && (
				<ParametersForm
					closeForm={() => setShowForm(false)}
					onSuccess={handleSuccess}
				/>
			)}
			{showHistory && (
				<HistoryModal
					close={() => setShowHistory(false)}
					onUpdate={onUpdate}
				/>
			)}
		</>
	);
}

export default Parameters;
