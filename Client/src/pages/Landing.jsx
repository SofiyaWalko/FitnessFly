import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Landing/Hero";
import ProgramCards from "../components/Landing/ProgramCards";
import RecipeCards from "../components/Landing/RecipeCards";
import ForWho from "../components/Landing/ForWho";
import Comments from "../components/Landing/Comments";
import FAQ from "../components/Landing/FAQ";
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
			<Header/>
			<Hero/>
			<ProgramCards/>
			<RecipeCards/>
			<ForWho/>
			<Comments/>
			<FAQ/>
			<Footer/>
		</>
	);
}

export default Landing;
