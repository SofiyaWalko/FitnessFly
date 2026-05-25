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
					<div className={styles.field}>
						<label>Рост, см</label>
						<input name="height" onChange={handleChange} />
					</div>

					<div className={styles.field}>
						<label>Вес, кг</label>
						<input name="weight" onChange={handleChange} />
					</div>

					<div className={styles.field}>
						<label>Обхват талии, см</label>
						<input name="waist" onChange={handleChange} />
					</div>

					<div className={styles.field}>
						<label>Обхват груди, см</label>
						<input name="chest" onChange={handleChange} />
					</div>

					<div className={styles.field}>
						<label>Обхват бёдер, см</label>
						<input name="hips" onChange={handleChange} />
					</div>
				</div>

				<div className={styles.buttons}>
					<LitleButton onClick={submitForm}>Сохранить</LitleButton>
					<LitleButton variant="outline" onClick={closeForm}>
						Закрыть
					</LitleButton>
				</div>
			</div>
		</div>
	);
}

export default ParametersForm;
