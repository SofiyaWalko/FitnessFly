import styles from "./recipecards.module.css"
import RecipeCard from "../Recipes/RecipeCard"
import ButtonGray from "./ButtonGray"
import { useEffect, useState } from "react"

function RecipeCards() {

    const [recipes,setRecipes] = useState([])

    useEffect(()=>{

        const user_id = localStorage.getItem("user_id")

        fetch("https://fitnessfly.local/api/landing/getRecipes.php",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({user_id})
        })
        .then(res=>res.json())
        .then(data=>{
            setRecipes(data)
        })

    },[])

	return (
        <section className={styles.recipes}>
            <div className={styles.container}>   

                <div className={styles.title}>
                    <h2>Питайся вкусно и без строгих запретов</h2>
                    <ButtonGray text="Смотреть все" to="/recipes"/>
                </div>

                <div className={styles.recipecards}>

                    {recipes.map(recipe => (
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

            </div>
        </section>         
    )
}

export default RecipeCards