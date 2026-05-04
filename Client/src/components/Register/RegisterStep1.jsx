import { Link } from "react-router-dom"
import styles from "./registerform.module.css"

function RegisterStep1({formData,setFormData,next}){

function change(e){
setFormData({...formData,[e.target.name]:e.target.value})
}

function validate(){

if(!formData.name.trim()){
alert("Введите имя")
return false
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if(!emailRegex.test(formData.email)){
alert("Введите корректный email")
return false
}

const phoneRegex = /^\+375\d{9}$/

if(!phoneRegex.test(formData.phone)){
alert("Введите телефон в формате +375XXXXXXXXX")
return false
}

if(!formData.notify){
alert("Выберите способ уведомлений")
return false
}

if(formData.password.length < 8){
alert("Пароль должен содержать минимум 8 символов")
return false
}

if(formData.password !== formData.repeatPassword){
alert("Пароли не совпадают")
return false
}

return true
}

function nextStep(){

if(validate()){
next()
}

}

return(

<>
<h2 className={styles.title}>Регистрация</h2>

<div className={styles.grid}>

<div className={styles.field}>
<label>Имя</label>
<input name="name" value={formData.name} onChange={change}/>
</div>

<div className={styles.field}>
<label>Телефон</label>
<input
name="phone"
placeholder="+375XXXXXXXXX"
value={formData.phone}
onChange={change}
/>
</div>

<div className={styles.field}>
<label>Email</label>
<input name="email" value={formData.email} onChange={change}/>
</div>

<div className={styles.field}>
<label>Выберите способ получения уведомлений</label>

<div className={styles.radioGroup}>

<label>
<input
type="radio"
name="notify"
value="email"
checked={formData.notify==="email"}
onChange={change}
/>
Эл. почта
</label>

<label>
<input
type="radio"
name="notify"
value="telegram"
checked={formData.notify==="telegram"}
onChange={change}
/>
Телеграм-бот
</label>

</div>

</div>

<div className={styles.field}>
<label>Пароль</label>
<input
type="password"
name="password"
value={formData.password}
onChange={change}
/>
</div>

<div className={styles.field}>
<label>Повторите пароль</label>
<input
type="password"
name="repeatPassword"
value={formData.repeatPassword}
onChange={change}
/>
</div>

</div>

<button className={styles.button} onClick={nextStep}>
Далее
</button>

<div className={styles.login}>
Уже есть аккаунт? <Link to="/login">Войти</Link>
</div>

</>

)

}

export default RegisterStep1