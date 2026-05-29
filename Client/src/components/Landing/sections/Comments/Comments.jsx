import styles from "./comments.module.css";
import Comment from "@components/Landing/components/Comment/Comment";
import SectionTitle from "@components/Landing/components/SectionTitle/SectionTitle";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { useEffect, useState } from "react";

function Comments() {
	const [comments, setComments] = useState([]);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 1200);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		fetch("https://fitnessfly.local/api/landing/getReviews.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({}),
		})
			.then((res) => {
				if (!res.ok) throw new Error("Ошибка загрузки отзывов");
				return res.json();
			})
			.then((data) => {
				setComments(data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		<section className={styles.comments} id="reviews">
			<div className={styles.container}>
				<SectionTitle
					title="Отзывы тех, кто уже занимается с нами"
					showViewAll={false}
				/>

				<div className={styles.commentsWrapper}>
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
							{comments.map((comment) => (
								<SwiperSlide key={comment.id}>
									<Comment {...comment} />
								</SwiperSlide>
							))}
						</Swiper>
					) : (
						<div className={styles.grid}>
							{comments.map((comment) => (
								<Comment key={comment.id} {...comment} />
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

export default Comments;
