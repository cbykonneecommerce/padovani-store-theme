import React, {useState ,useEffect} from "react";

import { useBuyTogether } from "../context/BuyTogetherProvider";
import styles from "../../../../styles/css/product.buy-together.css";

const BombSelect = ({title, images, text, mainProduct}) => {
    const { selectedBombPosition, setSelectedBombPosition } = useBuyTogether();
    const [values, setValues] = useState([]);
    const [imageBombPosition, setImageBombPosition] = useState(null);

    function getValues() {
        if (mainProduct.id == 4780) {
            setValues([{ value: "P1" }, { value: "P2" }, { value: "P3" }, { value: "P4" }]);
        } else {
            setValues([{ value: "P1" }, { value: "P2" }]);
        }
    }

    function getImageBombPosition() {
        setImageBombPosition(images?.find((item) => item?.imageLabel?.toLowerCase() == "posicaobomba"));
    }

    useEffect(() => {
        getValues();
        getImageBombPosition();
    }, [mainProduct])

    return (
        <div className={styles.bombPositionContainer} >
            <div className={styles.bombPositionAction}>
                {title && (
                    <h3 className={styles.bombPositionTitle}>{title}</h3>
                )}

                <select
                    className={styles.bombPositionSelect}
                    value={selectedBombPosition}
                    onChange={(e) => setSelectedBombPosition(e.target.value)}
                >
                    <option value="">Posição da bomba</option>
                    {values?.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.value}
                        </option>
                    ))}
                </select>
                
                {text && (
                    <p className={styles.bombPositionText}>{text}</p>
                )}
                
            </div>

            {imageBombPosition && (
                <img
                    className={styles.bombPositionImage}
                    src={imageBombPosition?.imageUrl}
                    alt={imageBombPosition?.imageLabel}
                />
            )}

        </div>
    )
}

export default BombSelect;