import styles from "./litlebutton.module.css";

function LitleButton({ children, onClick }) {
	return (
		<button onClick={onClick} className={styles.litlebutton}>
			{children}
		</button>
	);
}

export default LitleButton;
