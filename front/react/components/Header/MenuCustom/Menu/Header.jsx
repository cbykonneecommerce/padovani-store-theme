import { useCssHandles } from 'vtex.css-handles'
import "../../../../styles/css/header.menu.css"

const HeaderMenu = (props) => {

    const CSS_HANDLES = ['headerMenu', 'titleMenu', 'iconClose']
	const  { handles }  =  useCssHandles ( CSS_HANDLES )

    const windowWidth = window && window.innerWidth

    const backMenu = () => {
		props.setReset(true)
        props.setTitle(null)
	}

    if(windowWidth < props.breakpoint) return null

    return(
        <div className={handles.headerMenu}>
            <span className={handles.titleMenu}>{ props.title == null ? props.initialTitle : props?.title }</span>
            { props.iconClose && props.title != null && <button className={handles.iconClose} onClick={ () => { backMenu() } }>{props.iconClose}</button> }
        </div>
    )
}

export default HeaderMenu