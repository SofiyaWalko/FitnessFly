import styles from "./parameters.module.css";

function Parameter({ name, value, unit }) {
	return (
		<div className={styles.parameter}>
			<span>{name}</span>
			<div className={styles.value}>
				<span>{value}</span>
				<span>{unit}</span>
			</div>
		</div>
	);
}

export default Parameter;
