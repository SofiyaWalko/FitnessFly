import Hero from "@components/Landing/sections/Hero/Hero";
import ProgramCards from "@components/Landing/sections/ProgramCards/ProgramCards";
import RecipeCards from "@components/Landing/sections/RecipeCards/RecipeCards";
import ForWho from "@components/Landing/sections/ForWho/ForWho";
import Comments from "@components/Landing/sections/Comments/Comments";
import FAQ from "@components/Landing/sections/FAQ/FAQ";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Landing() {
	const location = useLocation();

	useEffect(() => {
		if (location.hash) {
			const el = document.querySelector(location.hash);

			if (el) {
				setTimeout(() => {
					el.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				}, 100);
			}
		}
	}, [location]);

	return (
		<>
			<Hero />
			<ProgramCards />
			<RecipeCards />
			<ForWho />
			<Comments />
			<FAQ />
		</>
	);
}

export default Landing;
