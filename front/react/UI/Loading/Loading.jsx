import React from "react";
import styles from "./styles.css"

const Loading = () => {
    return (
        <div className={styles['lds-ring']}><div></div><div></div><div></div><div></div></div>
    )
}

export default Loading;