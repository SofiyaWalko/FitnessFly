import styles from "./bigbutton.module.css";

function BigButton({text, onClick}) {	

	return (
		<button className={styles.bigbutton} onClick={onClick}>
			{text}
		</button>
	);
}

export default BigButton;
