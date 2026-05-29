import styles from "./recipecards.module.css";
import RecipeCard from "@components/Recipes/components/RecipeCard";
import ButtonGray from "@components/ui/ButtonGray/ButtonGray";
import { useEffect, useState } from "react";
import SectionTitle from "@components/Landing/components/SectionTitle/SectionTitle";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

function RecipeCards() {
	const [recipes, setRecipes] = useState([]);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1200);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch("https://fitnessfly.local/api/landing/getRecipes.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ user_id }),
		})
			.then((res) => res.json())
			.then((data) => {
				setRecipes(data);
			});
	}, []);

	return (
		<section className={styles.recipes}>
			<div className={styles.container}>
				<SectionTitle
					title="Питайся вкусно и без строгих запретов"
					viewAllLink="/recipes"
					showViewAll={true}
				/>

				<div className={styles.recipecards}>
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
							{recipes.map((recipe) => (
								<SwiperSlide key={recipe.id}>
									<RecipeCard
										id={recipe.id}
										title={recipe.title}
										category={recipe.category}
										points={recipe.points_price}
										calories={recipe.calories}
										image={recipe.image_url}
										isFavoriteInitial={recipe.isFavorite}
									/>
								</SwiperSlide>
							))}
						</Swiper>
					) : (
						<div className={styles.grid}>
							{recipes.map((recipe) => (
								<RecipeCard
									key={recipe.id}
									id={recipe.id}
									title={recipe.title}
									category={recipe.category}
									points={recipe.points_price}
									calories={recipe.calories}
									image={recipe.image_url}
									isFavoriteInitial={recipe.isFavorite}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

export default RecipeCards;
