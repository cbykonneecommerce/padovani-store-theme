import React from "react";

import styles from "./Skeleton.css";
import { NoSSR } from 'vtex.render-runtime'

const Skeleton = ({ children, height = 100 }) => {
    return(
        <NoSSR onSSR={<div className={styles.Skeleton} style={{ height: height + "px" }}></div>}>
            <>{children}</>
        </NoSSR>
    );
};

export default Skeleton;
