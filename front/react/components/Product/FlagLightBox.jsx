import { useQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import GetCollection from '../../queries/collection.gql'
import styles from '../../styles/css/product.css'

const FlagHighlight = ({ id, name }) => {
  const { data, loading, error } = useQuery(GetCollection, {
    variables: { id },
    ssr: false,
  })

  return (
    <div className={styles.FlagHighlight}>
      <div className={styles.NameFlagHighlight}>
        {name}
        {data?.collection?.description && (
          <span className={styles.tooltiptext}>
            {data.collection.description}
          </span>
        )}
      </div>
    </div>
  )
}

const FlagLightBox = (props) => {
  const prodContext = useProduct()

  const clusterHighlights = prodContext?.product?.clusterHighlights

  if (!clusterHighlights || clusterHighlights.length === 0) return null

  return (
    <div className={styles.FlagWrap}>
      {clusterHighlights.map(
        (item) =>
          item.id !== '528' && (
            <FlagHighlight key={item.id} id={item.id} name={item.name} />
          )
      )}
    </div>
  )
}

export default FlagLightBox
