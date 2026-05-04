import styles from "./comments.module.css";
import Comment from "./Comment";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { useEffect, useState } from "react";

function Comments() {

    const [comments, setComments] = useState([]);

    useEffect(() => {

        fetch("https://fitnessfly.local/api/landing/getReviews.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        })
        .then(res => {
            if (!res.ok) throw new Error("Ошибка загрузки отзывов");
            return res.json();
        })
        .then(data => {
            setComments(data);
        })
        .catch(err => {
            console.error(err);
        });

    }, []);

	return (
		<section className={styles.comments} id="reviews">
			<div className={styles.container}>
				<h2 className={styles.title}>
					Отзывы тех, кто уже занимается с нами
				</h2>

				<Swiper
					modules={[Autoplay, Pagination]}
					spaceBetween={20}
					slidesPerView={3}
					loop={true}
					autoplay={{
						delay: 3000,
						disableOnInteraction: false,
					}}
					pagination={{ clickable: true }}
					breakpoints={{
						320: { slidesPerView: 1 },
						768: { slidesPerView: 2 },
						1024: { slidesPerView: 3 },
					}}
				>
					{comments.map((comment) => (
						<SwiperSlide key={comment.id}>
							<Comment {...comment} />
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
}

export default Comments;