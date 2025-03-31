import { useCssHandles } from 'vtex.css-handles'
import "../../../../styles/css/header.menu.css"


const Banner = (props) => {

    const CSS_HANDLES = ['menuBanners', 'menuBannersList', 'imageBanner']
	const  { handles }  =  useCssHandles ( CSS_HANDLES )

    if(props?.banners == undefined) return null
    return(
        <div className={handles.menuBanners}>
            {
                props?.banners?.length > 0 &&
                    <div className={handles.menuBannersList}>
                        {
                            props?.banners?.map(banner => (
                                banner?.url ? (
                                    <a href={banner.url} target={banner.external ? '_blank' : '_self'}>
                                        <img src={banner.banner} className={handles.imageBanner} />
                                    </a>
                                ): (
                                    <img src={banner.banner} className={handles.imageBanner} />
                                )

                            ))
                        }
                    </div>
            }
        </div>
    )
}

export default Banner