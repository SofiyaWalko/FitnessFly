import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function AuthLayout({ children }) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}

export default AuthLayout;
