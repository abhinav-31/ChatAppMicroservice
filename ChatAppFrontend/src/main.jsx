import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./features/store.js";
import { GlobalContextProvider } from "./context/GlobalContextProvider.jsx";

createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<BrowserRouter>
			<GlobalContextProvider>
				<Toaster position='top-center' />
				<App />
			</GlobalContextProvider>
		</BrowserRouter>
	</Provider>
);
