import { useState, useEffect } from "react";
import styles from "../../styles/css/header.search-bar.css"

const SearchBar = ({...props}) => {

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const body = document.body; 

    if(open) 
      body.classList.add(styles.searchActive)
    else 
      body.classList.remove(styles.searchActive)

  }, [open])

  setTimeout(() => {
    setLoading(true)
  }, 1000)

  if(!loading) return null
  
  return (
    <div className={`${styles.searchBar} ${styles[props.blockClass]}`}>
      {
        props.isOpen ? 
            <div className={styles.wrapperSearch}>
              { props.children[0] }
            </div>
        :
          <button className={styles.iconSearch} onClick={ () => { setOpen(open ? false : true) } }>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.3636 3C8.90722 3 7.48354 3.43187 6.2726 4.24099C5.06167 5.05011 4.11786 6.20015 3.56052 7.54567C3.00319 8.89119 2.85737 10.3718 3.14149 11.8002C3.42562 13.2286 4.12693 14.5406 5.15675 15.5704C6.18657 16.6003 7.49863 17.3016 8.92703 17.5857C10.3554 17.8698 11.836 17.724 13.1815 17.1667C14.527 16.6093 15.6771 15.6655 16.4862 14.4546C17.2953 13.2437 17.7272 11.82 17.7272 10.3636C17.7271 8.41069 16.9512 6.5378 15.5703 5.15688C14.1894 3.77597 12.3165 3.00012 10.3636 3Z" stroke="black" stroke-width="0.625" stroke-miterlimit="10"/><path d="M15.8574 15.8574L21 21" stroke="black" stroke-width="0.625" stroke-miterlimit="10" stroke-linecap="round"/></svg>
            { props.label && <label>{props.label}</label>}
          </button>
      }
      { 
        open &&
          <div className={styles.containerSearchBar}>
            <button className={styles.iconSearchClose} onClick={ () => { setOpen(open ? false : true) } }>
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_247_5952" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="25"><rect width="25" height="25" fill="#D9D9D9"/></mask><g mask="url(#mask0_247_5952)"><path d="M6.45833 19.5833L5 18.125L10.8333 12.2916L5 6.4583L6.45833 4.99997L12.2917 10.8333L18.125 4.99997L19.5833 6.4583L13.75 12.2916L19.5833 18.125L18.125 19.5833L12.2917 13.75L6.45833 19.5833Z" fill="white"/></g></svg> FECHAR
            </button>
            <div className={styles.wrapperSearch}>
              { props.children[1] }
              { props.children[0] }
            </div>
          </div>
      }
    </div>
  )
}

export default SearchBar