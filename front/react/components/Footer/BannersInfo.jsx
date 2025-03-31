import React from "react";
import styles from "../../styles/css/footer.banner-info.css";

import Skeleton from "../../UI/Skeleton";

const BannerInfo = (props) => {
    if(props?.data == undefined) return <></>

    return (
        <section className={styles.mainBannerInfoContainer}>
            {props?.data?.map(element => (
                <Skeleton height={140}>
                <div className={styles.mainBannerElementContainer} style={{ backgroundImage: `url(${element.bannerBackground})` }} key={element.title}>
                    {element.icon && (
                        <img src={element?.icon} alt="Icone de informação" />
                    )}
                    <div className={styles.mainBannerElementTextWrapper}>
                        <p>{element.title}</p>
                        <a href={element.link}>{element.linkText}</a>
                    </div>
                </div>
                </Skeleton>
            ))}   
        </section>
    );
};

BannerInfo.schema = {
  title: "Banner Info",
  type: "object",
  properties: {
    data: {
        type: "array",
        title: "Banners",
        minItems: 2,
        maxItems: 2,
        items: {
            properties: {
                title: {
                    title: "Título",
                    type: "string",
                 },
                link: {
                    title: "link",
                    type: "string",
                },
                linkText: {
                    title: "Texto do link",
                    type: "string",
                },
                icon: {
                    title: "Ícone/Imagem",
                    type: "string",
                    widget: {
                        'ui:widget': 'image-uploader',
                    }, 
                },
                bannerBackground: {
                    title: "Banner de background",
                    type: "string",
                    widget: {
                        'ui:widget': 'image-uploader',
                    }, 
                }
            }
        }
    }
  },
};

export default BannerInfo;
