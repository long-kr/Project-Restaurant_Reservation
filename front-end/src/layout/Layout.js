import { Toaster } from "sonner";
import Header from "./Header";
import "./Layout.css";
import Menu from "./Menu";
import Routes from "./Routes";

/**
 * Defines the main layout of the application.
 * @returns {JSX.Element}
 */
function Layout() {
	return (
		<div className='container-fuild h-100'>
			<div className='row h-100'>
				<div
					id='sidebarMenu'
					className='collapse d-lg-block sidebar collapse col-sm'
				>
					<Menu />
				</div>
				<div>
					<Header />
				</div>
				<div className='col'>
					<div style={{ marginTop: 90 }} className='main-background'>
						<Routes />
					</div>
				</div>
			</div>

			<Toaster />
		</div>
	);
}

export default Layout;
