import { useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./goalform.module.css";
import LitleButton from "@/components/ui/LittleButton/LittleButton";

function ParametersForm({ closeForm, onSuccess }) {
	const [form, setForm] = useState({
		height: "",
		weight: "",
		waist: "",
		chest: "",
		hips: "",
	});

	const [infoModal, setInfoModal] = useState({
		open: false,
		title: "",
		message: "",
	});

	function handleChange(e) {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	}

	function closeInfoModal() {
		setInfoModal({
			open: false,
			title: "",
			message: "",
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
					setInfoModal({
						open: true,
						title: "Ошибка",
						message: res.message,
					});
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

			<Modal
				open={infoModal.open}
				title={infoModal.title}
				onClose={closeInfoModal}
			>
				{infoModal.message}
			</Modal>
		</div>
	);
}

export default ParametersForm;
