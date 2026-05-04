import { useState } from "react";
import styles from "./goalform.module.css";
import LitleButton from "../LitleButton";

function EditParameterRow({ item, onClose, onSuccess }) {

	const [form,setForm] = useState({
		height:item.height,
		weight:item.weight,
		waist:item.waist,
		chest:item.chest,
		hips:item.hips
	});

	function change(e){
		setForm({...form,[e.target.name]:e.target.value});
	}

	function save(){

		fetch("http://fitnessfly.local/api/home/updateParameterRow.php",{
			method:"POST",
			headers:{ "Content-Type":"application/json" },
			body:JSON.stringify({
				id:item.id,
				...form
			})
		})
		.then(res=>res.json())
		.then(res=>{
			if(res.success){
				onSuccess();
			}
		});

	}

	return (

		<div className={styles.modal}>
			<div className={styles.modal_content}>

				<div className={styles.modal_close} onClick={onClose}>
					×
				</div>

				<h2>Редактирование параметров</h2>

				<div className={styles.form_grid}>

					<input
						name="height"
						placeholder="Рост, см"
						value={form.height}
						onChange={change}
					/>

					<input
						name="weight"
						placeholder="Вес, кг"
						value={form.weight}
						onChange={change}
					/>

					<input
						name="waist"
						placeholder="Обхват талии"
						value={form.waist}
						onChange={change}
					/>

					<input
						name="chest"
						placeholder="Обхват груди"
						value={form.chest}
						onChange={change}
					/>

					<input
						name="hips"
						placeholder="Обхват бёдер"
						value={form.hips}
						onChange={change}
					/>

				</div>

				<LitleButton onClick={save}>
					Сохранить
				</LitleButton>

				<LitleButton onClick={onClose}>
					Отмена
				</LitleButton>

			</div>
		</div>

	);
}

export default EditParameterRow;