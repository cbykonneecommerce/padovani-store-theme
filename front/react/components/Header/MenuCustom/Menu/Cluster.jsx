import { useCssHandles } from 'vtex.css-handles'
import styles from "../../../../styles/css/header.menu.css"

import { ExtensionPoint } from 'vtex.render-runtime'

const CSS_HANDLES = ['children']

  const Cluster = ({shelfs}) => {

  const  { handles }  =  useCssHandles ( CSS_HANDLES )
  
  if(shelfs == undefined) return null

  return(
    shelfs?.map(item => {
        return(
          <div className={styles.children}>
              <ExtensionPoint
                  id="list-context.product-list"
                  category={item.category}
                  specificationFilters={item.specificationFilters}
                  collection={item.clusterid}
                  orderBy={item.orderby}
                  hideUnavailableItems={item.hideunavailableitems}
                  maxItems={item.maxitems}
              />
          </div>
        )
    })
  )
}

export default Cluster;