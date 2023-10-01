import { useState } from 'react';
import { Image } from '@chakra-ui/react';

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
            />
      );
};

export default ImageWithPreview;
