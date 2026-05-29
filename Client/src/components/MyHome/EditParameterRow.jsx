import { useState } from "react";
import styles from "./goalform.module.css";
import LitleButton from "@/components/ui/LittleButton/LittleButton";

function EditParameterRow({ item, onClose, onSuccess }) {
	const [form, setForm] = useState({
		height: item.height,
		weight: item.weight,
		waist: item.waist,
		chest: item.chest,
		hips: item.hips,
	});

	function change(e) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	function save() {
		fetch("http://fitnessfly.local/api/home/updateParameterRow.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: item.id,
				...form,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					onSuccess();
				}
			});
	}

	return (
		<div className={styles.modal}>
			<div className={styles.modal_content}>
				<h2>Редактирование параметров</h2>

				<div className={styles.form_grid}>
					<div className={styles.field}>
						<label>Вес, кг</label>
						<input
							name="weight"
							value={form.weight}
							onChange={change}
						/>
					</div>

					<div className={styles.field}>
						<label>Обхват талии, см</label>
						<input
							name="waist"
							value={form.waist}
							onChange={change}
						/>
					</div>

					<div className={styles.field}>
						<label>Обхват груди, см</label>
						<input
							name="chest"
							value={form.chest}
							onChange={change}
						/>
					</div>

					<div className={styles.field}>
						<label>Обхват бёдер, см</label>
						<input
							name="hips"
							value={form.hips}
							onChange={change}
						/>
					</div>
				</div>

				<div className={styles.buttons}>
					<LitleButton onClick={save}>Сохранить</LitleButton>
					<LitleButton variant="outline" onClick={onClose}>
						Отмена
					</LitleButton>
				</div>
			</div>
		</div>
	);
}

export default EditParameterRow;
