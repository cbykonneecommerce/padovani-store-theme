import React, {useState, useEffect} from 'react'
import styles from "../../../styles/css/landing.page.filter-anchor.css"
import { Icon } from 'vtex.store-icons'
import Skeleton from "../../../UI/Skeleton"

const FilterAnchor = (props) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isAbsolute, setIsAbsolute] = useState(false);

    if(window && window?.location?.href?.indexOf("debugFiltro") != -1)
        console.log("Filtro:", JSON.stringify(props), props)

    const handleScroll = () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const containerHeight = getHeightContainer();

        if (currentScroll > 400 && currentScroll < containerHeight - 500) {
            setIsAbsolute(true);
        } else {
            setIsAbsolute(false);
        }
    };

    const getHeightContainer = () => {
        const container = document.querySelector(".vtex-flex-layout-0-x-flexRow--main-section-campaign");
        
        return container?.offsetHeight;
    } 

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [window.scrollY]);
    
    
    return (
        <Skeleton height={200}>
            <aside className={`${styles.FilterCustomContainer} ${isOpen ? styles.FilterOpen : styles.FilterClose} ${isAbsolute ? styles.IsAbstolute : styles.NotAbstolute}`} >
                {props?.img && props?.alt &&  (
                    <img className={`${styles.FilterCustomImage} ${isAbsolute ? styles.ImageOn : styles.ImageOff}`} alt={props.alt} src={props.img} />
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={`${isOpen ? 'Abrir' : ' Fechar '} componentes de navegação entre os produtos`}>
                    Filtrar 
                    
                    <Icon id="nav-caret--up" size="16" />
                </button>

                <ul className={`${styles.FilterCustomWrapper} ${isOpen ? styles.FilterOpen : styles.FilterClose}`} > 
                    {props?.items?.map((element, index)=> (
                        <li key={index} className={styles.FilterCustomItem} >
                            <a className={styles.FilterCustomItemLink} href={`#${element.id}`}>
                                <div className={styles.FilterCustomMarker}></div>
                                {element.__editorItemTitle}
                            </a>
                        </li>
                    ))}
                </ul>
            </aside>
        </Skeleton>
    )
}

export default FilterAnchor

FilterAnchor.schema = {
    title: 'Items do Filtro',
    type: 'object',
    properties: {
        img: {
            title: 'Imagem',
            type: 'string',
            widget: {
                'ui:widget': 'image-uploader',
            },
        },
        alt: {
            title: 'Descrição da imagem',
            type: 'string',
            widget: {
                'ui:widget': 'textarea',
            }
        },
        items: {
            title: 'Items do Filtro',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    __editorItemTitle: {
                        title: "Nome",
                        type: 'string'
                    },
                    id: {
                        title: "ID de âncora",
                        type: 'string',
                        description: "Mesmo id do componente para navegar até ele"
                    },
                }
            }
        }
    }
}