import styles from "./buttongray.module.css";
import { Link } from "react-router-dom";

function ButtonGray({ text, to, onClick, className = "" }) {
	if (to) {
		return (
			<Link className={`${styles.buttongray} ${className}`} to={to}>
				<span>{text}</span>
			</Link>
		);
	}

	return (
		<button
			className={`${styles.buttongray} ${className}`}
			onClick={onClick}
		>
			<span>{text}</span>
		</button>
	);
}

export default ButtonGray;
