import { useEffect, useState, useRef } from "react";
import styles from "../../pages/myhome.module.css";

import avatar from "../../assets/images/photo.png";
import coinsIcon from "../../assets/images/icon_cost.svg";
import changeIcon from "../../assets/images/change.svg";

import GoalForm from "./GoalForm";

function PersonalInfo({ onUpdate }) {

	const [data,setData] = useState(null);
	const [photo,setPhoto] = useState(null);
	const [showForm,setShowForm] = useState(false);

	const fileInput = useRef();

	function loadProfile(){

		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/home/getPersonalInfo.php",{
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({user_id})
		})
		.then(res=>res.json())
		.then(data=>{
			setData(data);
			setPhoto(data.photo);
		});

	}

	useEffect(()=>{
		loadProfile();
	},[]);

	function openFile(){
		fileInput.current.click();
	}

	function uploadPhoto(e){

		const file = e.target.files[0];

		if(!file) return;

		const user_id = localStorage.getItem("user_id");

		const formData = new FormData();
		formData.append("photo",file);
		formData.append("user_id",user_id);

		fetch("http://fitnessfly.local/api/home/uploadUserPhoto.php",{
			method:"POST",
			body:formData
		})
		.then(res=>res.json())
		.then(res=>{

			if(res.success){
				setPhoto(res.photo);
			}

		});

	}

	function handleSuccess(){

		loadProfile();

		if(onUpdate){
			onUpdate();
		}

	}

	if(!data) return null;

	return(

		<>

			<div className={styles.pesonal_info}>

				<div className={styles.info_header}>

					<img
						src={photo ? photo : avatar}
						alt="avatar"
						className={styles.photo}
						onClick={openFile}
					/>

					<input
						type="file"
						ref={fileInput}
						style={{display:"none"}}
						accept="image/*"
						onChange={uploadPhoto}
					/>

					<div className={styles.name_age}>
						<span>{data.name}</span>
						<span>{data.age}</span>						
					</div>

				</div>

				<div className={styles.balance}>

					<div className={styles.balance_name}>
						<span>Баланс</span>
						<span>Fitcoins</span>
					</div>

					<div className={styles.balance_count}>
						<span>{data.points}</span>
						<img src={coinsIcon} alt="balance"/>
					</div>

				</div>

				<div className={styles.goal}>
					<div className={styles.goal_item}>
						<span>Цель</span>
						<span>{data.goal}</span>
					</div>
				</div>

				<div
					className={styles.change}
					onClick={()=>setShowForm(true)}
				>
					<img src={changeIcon} alt="icon"/>
					<span>Изменить цель</span>
				</div>

			</div>

			{showForm && (
				<GoalForm
					closeForm={()=>setShowForm(false)}
					onSuccess={handleSuccess}
				/>
			)}

		</>

	);

}

export default PersonalInfo;