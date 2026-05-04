import { useNavigate } from "react-router-dom";
import styles from "./addbutton.module.css";

function AddButton({ text = "Добавить", to, onClick }) {
	const navigate = useNavigate();

	function handleClick() {
		if (onClick) {
			onClick();
		} else if (to) {
			navigate(to);
		}
	}

	return (
		<div className={styles.actions}>
			<button
				className={styles.addButton}
				onClick={handleClick}
			>
				+ {text}
			</button>
		</div>
	);
}

export default AddButton;