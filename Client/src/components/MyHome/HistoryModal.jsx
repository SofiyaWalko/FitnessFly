import { useEffect, useState } from "react";
import styles from "./historyparameters.module.css";
import EditParameterRow from "./EditParameterRow";
import LitleButton from "../LitleButton";

function HistoryModal({ close, onUpdate }) {
	const [data, setData] = useState([]);
	const [editing, setEditing] = useState(null);

	const user_id = localStorage.getItem("user_id");

	useEffect(() => {
		load();
	}, []);

	function load() {
		fetch("http://fitnessfly.local/api/home/getParametersHistory.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ user_id }),
		})
			.then((res) => res.json())
			.then(setData);
	}

	return (
		<div className={styles.modal}>
			<div className={styles.modal_content}>
				<h2>История параметров</h2>

				<div className={styles.table_wrapper}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>Дата</th>
								<th>Вес</th>
								<th>Рост</th>
								<th>Грудь</th>
								<th>Талия</th>
								<th>Бёдра</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{data.map((item) => (
								<tr key={item.id}>
									<td>{item.created_at}</td>
									<td>{item.weight}</td>
									<td>{item.height}</td>
									<td>{item.chest}</td>
									<td>{item.waist}</td>
									<td>{item.hips}</td>
									<td>
										<button
											className={styles.button_edit}
											onClick={() => setEditing(item)}
										>
											Изменить
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<LitleButton variant="outline" onClick={close}>
					Закрыть
				</LitleButton>
			</div>

			{editing && (
				<EditParameterRow
					item={editing}
					onClose={() => setEditing(null)}
					onSuccess={() => {
						setEditing(null);
						load();
						onUpdate();
					}}
				/>
			)}
		</div>
	);
}

export default HistoryModal;
