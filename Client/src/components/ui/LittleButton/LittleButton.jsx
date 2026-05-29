import styles from "./littlebutton.module.css";

function LitleButton({ children, onClick, variant = "primary" }) {
	return (
		<button
			onClick={onClick}
			className={
				variant === "outline"
					? `${styles.litlebutton} ${styles.outline}`
					: styles.litlebutton
			}
		>
			{children}
		</button>
	);
}

export default LitleButton;
