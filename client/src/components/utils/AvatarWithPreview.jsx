import { useState } from 'react';
import { Avatar } from '@chakra-ui/react';

const AvatarWithPreview = ({ smallURL, largeURL, children, ...rest }) => {
      const [src, setSrc] = useState(smallURL);

      return (
            <Avatar
                  src={src}
                  onLoad={() => {
                        const img = new window.Image();
                        img.src = largeURL;
                        img.onload = () => setSrc(largeURL);
                  }}
                  {...rest}
            > {children} </Avatar>
      );
};

export default AvatarWithPreview;
