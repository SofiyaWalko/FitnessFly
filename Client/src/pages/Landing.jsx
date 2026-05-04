import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Landing/Hero";
import ProgramCards from "../components/Landing/ProgramCards";
import RecipeCards from "../components/Landing/RecipeCards";
import ForWho from "../components/Landing/ForWho";
import Comments from "../components/Landing/Comments";
import FAQ from "../components/Landing/FAQ";

function Landing() {
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
    )
}

export default Landing;
