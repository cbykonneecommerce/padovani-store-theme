import React from 'react'
import Skeleton from "../../../../UI/Skeleton"
import styles from "../../../../styles/css/pages.page-manager"

const ListProduct = ({ section, SearchCustomQuery }) => {
    const queryFieldd = section?.queryField ?? '153'
    const orderByy = section?.orderby ?? "OrderByScoreDESC"
    const hideUnavailableItemss = section?.hideUnavailableItems ?? false
    const maxItemsPerPagee = section?.maxItemsPerPage ?? 8
    
    return (
        <Skeleton height={1094}>
            <div className={styles.ListProductContainer}>

                {section.title && (
                    <>
                        <h2 className={styles.ListProductTitle} >{section.title}</h2>
                        <div className={styles.ListProductTitleBar}></div>
                    </>
                )}
                
                <SearchCustomQuery
                    querySchema={{
                        hideUnavailableItems: hideUnavailableItemss,
                        maxItemsPerPage: maxItemsPerPagee,
                        queryField: queryFieldd,
                        mapField: "productClusterIds",
                        orderByField: orderByy
                    }}
                />
            </div>
        </ Skeleton>
    );
}

export default ListProduct;
