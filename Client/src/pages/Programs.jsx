import { useEffect, useState } from "react";
import ProgramCard from "../components/Programs/ProgramCard";
import styles from "./programs.module.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

function Programs() {
	const [programs, setPrograms] = useState([]);

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/programs/getPrograms.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id }),
		})
			.then((res) => res.json())
			.then((data) => {
				setPrograms(data);
			});
	}, []);

	return (
		<>
			<Header />
			<div className={styles.container}>
				<div className={styles.programspage}>
					<h2 className={styles.title}>Программы тренировок</h2>
				</div>

				<div className={styles.programs_cards}>
					{programs.map((program) => (
						<ProgramCard
							key={program.id}
							id={program.id}
							title={program.title}
							days={program.duration_days}
							level={program.difficulty_level}
							image={program.image_url}
							status={program.status}
						/>
					))}
				</div>
			</div>

			<Footer />
		</>
	);
}

export default Programs;
