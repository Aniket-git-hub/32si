import { useState } from 'react';
import { Image } from '@chakra-ui/react';

// Shown when the picture can't be loaded (missing file, server down).
const FALLBACK = '/default-avatar.svg';

const ImageWithPreview = ({ smallURL, largeURL, ...rest }) => {
      const [src, setSrc] = useState(smallURL);

      return (
            <Image
                  {...rest}
                  onLoad={() => {
                        const img = new window.Image();
                        img.src = largeURL;
                        img.onload = () => setSrc(largeURL);
                  }}
                  src={src && src}
                  fallbackSrc={FALLBACK}
                  onError={() => setSrc(FALLBACK)}
            />
      );
};

export default ImageWithPreview;
