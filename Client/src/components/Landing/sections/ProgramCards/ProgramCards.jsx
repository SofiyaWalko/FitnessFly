import styles from "./programcards.module.css";
import ProgramCard from "@components/Programs/components/ProgramCard";
import ButtonGray from "@components/ui/ButtonGray/ButtonGray";
import { useEffect, useState } from "react";
import SectionTitle from "@components/Landing/components/SectionTitle/SectionTitle";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

function ProgramCards() {
	const [programs, setPrograms] = useState([]);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1200);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		fetch("https://fitnessfly.local/api/landing/getPrograms.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({}),
		})
			.then((res) => {
				if (!res.ok) throw new Error("Ошибка загрузки программ");
				return res.json();
			})
			.then((data) => {
				setPrograms(data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		<section className={styles.programs}>
			<div className={styles.container}>
				<SectionTitle
					title="Готовые программы под любую цель"
					viewAllLink="/programs"
					showViewAll={true}
				/>

				<div className={styles.programcards}>
					{isMobile ? (
						<Swiper
							modules={[Pagination]}
							spaceBetween={20}
							slidesPerView={1}
							pagination={{ clickable: true }}
							breakpoints={{
								768: { slidesPerView: 2 },
								1024: { slidesPerView: 3 },
							}}
							className={styles.swiper}
						>
							{programs.map((program) => (
								<SwiperSlide key={program.id}>
									<ProgramCard
										id={program.id}
										title={program.title}
										days={program.duration_days}
										level={program.difficulty_level}
										image={program.image_url}
										status={program.status}
									/>
								</SwiperSlide>
							))}
						</Swiper>
					) : (
						<div className={styles.grid}>
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
					)}
				</div>
			</div>
		</section>
	);
}

export default ProgramCards;
