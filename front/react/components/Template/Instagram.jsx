import { useState, useLayoutEffect } from "react"
import styles from "../../styles/css/template.instagram.css";

const Instagram = (props) => {
    const [dataInstagram, setDataInstagram] = useState()

    const getData = async () => {
        try {
            let url = `https://graph.instagram.com/me/media?fields=thumbnail_url,caption,media_url,media_type,permalink,timestamp,username&access_token=${props.keyToken}`
            fetch(url)
            .then((r) => r.json())
            .then((json) => {
                setDataInstagram(json)
            })
        } catch (err) {
            console.error("🚀 ~ file: index.js ~ line 18 ~ getData ~ err", err)
        }
    }

    useLayoutEffect(() => {
        getData()
    }, [])

    if (!dataInstagram || dataInstagram?.data == undefined || dataInstagram?.data?.length === 0) return null
    return (
        <section className={styles.wrapperInstagram}>
            { props.title &&
                <div className={styles.instagramTitle}>
                    {props.subtitle && <small className={styles.InstagramTitleSmall}>{ props.subtitle }</small> }
                    <a href={`https://www.instagram.com/${props.slug}`} className={styles.userNameInsta} target="_blank">
                        { props.title }
                    </a>
                </div>
            }
            <div className={styles.containerInstagram}>
                <div className={styles.gridInstagram}>
                    {
                        dataInstagram?.data?.map((post, index) => {
                            if(index >= props.maxPosts){
                                return null
                            }
                            if (post.media_type == "VIDEO") {
                                return(
                                    <div key={index} style={{height: `${ window.innerWidth > 1023 ?  window.innerWidth / props.maxPosts : 200 }px`}}>
                                        <a className={styles.postItem} key={post?.id} href={post?.permalink} target="_blank">
                                        <video poster={post?.thumbnail_url} width="200" height="200" controls><source src={post?.media_url} type="video/mp4"/></video>
                                        </a>
                                    </div>
                                )
                            } else {
                                return(
                                    <a className={styles.postItem} key={post?.id} href={post?.permalink} target="_blank" style={{height: `${ window.innerWidth > 1023 ?  window.innerWidth / props.maxPosts : 200 }px`}}>
                                        <img className={styles.postImage} src={post?.media_url} alt={post?.username} />
                                    </a>
                                )
                            }
                        })
                    }
                </div>
            </div>
        </section>
    )

}

Instagram.schema = {
    type: 'object',
    title: 'Configurações do Instagram',
    properties: {
        maxPosts: {
            type: 'number',
            title: 'Maximo de imagens',
            descrption: 'Quantidade máxima de imagens na linha',
            default: 6
        },
        keyToken: {
            type: 'string',
            title: 'Token',
            descrption: 'Token de acesso gerado no Instagram',
            default: "IGQVJXYmJBN2E0VUtCdjZAhXzYwUGhvZAHhWMjhaZA0dwTHZACZAkxlTWtld2NiWm50UzRnUmlfUHk2SkkyaTdpVHVNZA1dTandkbnFXcnNBeXZAEY1FidmstWXJtcFp5a01FOWYyQnFTWXpvQV9mMi1pRUpKZAwZDZD"
        },
        title: {
            type: 'string',
            title: 'Arroba',
            descrption: 'Titulo acima das fotos',
            default: "SIGA @LIZLINGERIE"
        },
        slug: {
            type: 'string',
            title: 'Link do Insta',
            descrption: 'Titulo acima das fotos',
            default: "lizlingerie"
        }
    }
};


export default Instagram
