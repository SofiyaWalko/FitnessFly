import { useState } from "react";
import styles from "./faqitem.module.css";

function FAQItem({ question, answer }) {
	const [open, setOpen] = useState(false);

	return (
		<div
			className={`${styles.item} ${open ? styles.active : ""}`}
			onClick={() => setOpen(!open)}
		>
			<div className={styles.question}>
				<span>{question}</span>
				<span className={styles.icon}>↗</span>
			</div>

			{open && <div className={styles.answer}>{answer}</div>}
		</div>
	);
}

export default FAQItem;
