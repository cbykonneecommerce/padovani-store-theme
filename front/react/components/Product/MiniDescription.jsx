import { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import styles from '../../styles/css/product.mini-description.css'

const MiniDescription = () => {
  const { product } = useProduct() ?? {}
  console.log('🚀 ~ MiniDescription ~ product:', product)
  const [specifications, setSpecifications] = useState([])
  const multiplier = product?.items[0]?.unitMultiplier

  const shuffleAndSlice = (array, count) => {
    return [...array].sort(() => 0.5 - Math.random()).slice(0, count)
  }

  useEffect(() => {
    if (!product) return

    const group = product.specificationGroups?.find(
      (group) => group.name === 'allSpecifications'
    )

    if (!group?.specifications?.length) return

    const specs = group.specifications
    const hasPiecesPerBox = product.properties?.some(
      (prop) => prop.name === 'Peças por Caixa'
    )

    if (hasPiecesPerBox) {
      const filteredSpecs = specs.filter((spec) =>
        ['Peças por Caixa', 'Variação de Tom'].includes(spec.name)
      )

      filteredSpecs.push({
        name: 'Caixa com',
        values: [`${String(multiplier).replace('.', ',')}m²`],
      })

      setSpecifications(
        filteredSpecs.sort((a, b) => a.name.localeCompare(b.name))
      )
    } else {
      setSpecifications(shuffleAndSlice(specs, 3))
    }
  }, [product?.specificationGroups])

  if (!specifications.length) return null

  return (
    <ul className={styles.MiniDescriptionsList}>
      {specifications.map((spec, index) => (
        <li key={index} className={styles.MiniDescriptionsListItem}>
          {spec.name}: {spec.values?.[0]}
        </li>
      ))}
    </ul>
  )
}

export default MiniDescription
