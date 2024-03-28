'use client';

import styles from "./page.module.css";
import { CesiumViewer } from "./components/cesium-viewer/CesiumViewer";
import { Provider } from "react-redux";
import { store } from "./store";

export default function Home() {
  return (
    <main className={styles.main}>
      <Provider store={store}>
        <link rel="stylesheet" href="cesium/Widgets/widgets.css" />
        <CesiumViewer />
      </Provider>
    </main>
  );
}
