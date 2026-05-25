import { Link } from "react-router-dom"
import styles from "./forwho.module.css"
import icon1 from "../../assets/images/icon1.png"
import icon2 from "../../assets/images/icon2.png" 
import icon3 from "../../assets/images/icon3.png" 
import icon4 from "../../assets/images/icon4.png" 

function ForWho() {

    const user_id = localStorage.getItem("user_id");
	const linkTo = user_id ? "/programs" : "/register";

	return (
        <section className={styles.forwho}>
              <div className={styles.container}>   
                <h2 className={styles.title}>Подойдёт тебе, если</h2>   
                
                <div className={styles.forwhocontent}>
                    <div className={styles.forwhocards}>
                    <div className={styles.forwhocard}>
                        <img src={icon1} alt="icon" />
                        <span>Хочешь подтянуть тело без изнурения</span>
                    </div>  
                    <div className={styles.forwhocard}>
                        <img src={icon2} alt="icon" />
                        <span>Не знаешь, как правильно <br />питаться</span>
                    </div> 
                    <div className={styles.forwhocard}>
                        <img src={icon3} alt="icon" />
                        <span>Хочешь видеть реальный <br />прогресс</span>
                    </div> 
                    <div className={styles.forwhocard}>
                        <img src={icon4} alt="icon" />
                        <span>Нужна мотивация <br />и структура</span>
                    </div>                   
                </div>  
                <Link to={linkTo} className={styles.button_container}>
                    <button className={styles.forwhobutton}>Присоединиться</button>
                </Link> 
                </div>      

              </div>
        </section> 
    )
}

export default ForWho;
