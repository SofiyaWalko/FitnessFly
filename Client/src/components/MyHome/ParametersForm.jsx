import { useState } from "react";
import styles from "./goalform.module.css";
import LitleButton from "../LitleButton";

function ParametersForm({ closeForm, onSuccess }) {
	const [form, setForm] = useState({
		height: "",
		weight: "",
		waist: "",
		chest: "",
		hips: "",
	});

	function handleChange(e) {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	}

	function submitForm() {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/home/updateParameters.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id,
				...form,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					closeForm();

					if (onSuccess) {
						onSuccess();
					}
				} else {
					alert(res.message);
				}
			})
			.catch((err) => console.log(err));
	}

	return (
		<div className={styles.modal}>
			<div className={styles.modal_content}>
				<h2>Контроль параметров</h2>

				<div className={styles.form_grid}>
					<input
						name="height"
						placeholder="Рост, см"
						onChange={handleChange}
					/>

					<input
						name="weight"
						placeholder="Вес, кг"
						onChange={handleChange}
					/>

					<input
						name="waist"
						placeholder="Обхват талии"
						onChange={handleChange}
					/>

					<input
						name="chest"
						placeholder="Обхват груди"
						onChange={handleChange}
					/>

					<input
						name="hips"
						placeholder="Обхват бёдер"
						onChange={handleChange}
					/>
				</div>

				<LitleButton onClick={submitForm}>Сохранить</LitleButton>

				<LitleButton onClick={closeForm}>Закрыть</LitleButton>
			</div>
		</div>
	);
}

export default ParametersForm;
