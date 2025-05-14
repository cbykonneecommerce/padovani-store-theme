import { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'

import styles from '../../styles/css/product.css'

const Video = () => {
  const context = useProduct()
  const [video, setVideo] = useState(null)

  if (context == null) return null

  useEffect(() => {
    const getVideo = context.product.properties.filter((find) => {
      if (find.name == 'Vídeo') {
        return find
      }
    })

    if (getVideo.length > 0) setVideo(getVideo[0]?.values[0])
  }, [context])

  if (video == null || video == undefined) return null

  return (
    <div className={styles.wrapperVideo}>
      {video.indexOf('https://youtu.be/') != -1 ? (
        <iframe
          width="100%"
          height="450"
          src={`https://www.youtube.com/embed/${
            video?.split('https://youtu.be/')[1]
          }`}
        />
      ) : (
        <div
          className={styles.video}
          dangerouslySetInnerHTML={{
            __html: `
                            <video
                                width="100%"
                                loop
                                muted
                                autoplay
                                playsinline
                                src="${video}"
                            />
                    `,
          }}
        ></div>
      )}
    </div>
  )
}

export default Video
