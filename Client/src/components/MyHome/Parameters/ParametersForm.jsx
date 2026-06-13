import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import styles from "../shared/formModal.module.css";
import LitleButton from "@/components/ui/LittleButton/LittleButton";
import { API_BASE } from "@/config";

function ParametersForm({ closeForm, onSuccess, initial }) {
	const [form, setForm] = useState({
		height: initial?.height ?? "",
		weight: initial?.weight ?? "",
		waist: initial?.waist ?? "",
		chest: initial?.chest ?? "",
		hips: initial?.hips ?? "",
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

		fetch(`${API_BASE}/home/updateParameters.php`, {
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
						<input
							name="height"
							value={form.height}
							onChange={handleChange}
						/>
					</div>

					<div className={styles.field}>
						<label>Вес, кг</label>
						<input
							name="weight"
							value={form.weight}
							onChange={handleChange}
						/>
					</div>

					<div className={styles.field}>
						<label>Обхват талии, см</label>
						<input
							name="waist"
							value={form.waist}
							onChange={handleChange}
						/>
					</div>

					<div className={styles.field}>
						<label>Обхват груди, см</label>
						<input
							name="chest"
							value={form.chest}
							onChange={handleChange}
						/>
					</div>

					<div className={styles.field}>
						<label>Обхват бёдер, см</label>
						<input
							name="hips"
							value={form.hips}
							onChange={handleChange}
						/>
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
