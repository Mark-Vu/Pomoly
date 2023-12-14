import backgroundImage1 from '../../assets/images/background1.jpg';
import backgroundImage2 from '../../assets/images/background2.jpg';
import backgroundImage3 from '../../assets/images/background3.jpg';
import backgroundImage4 from '../../assets/images/background4.jpg';
import backgroundImage5 from '../../assets/images/background5.jpg';
import backgroundImage6 from '../../assets/images/background6.jpg';
import backgroundImage7 from '../../assets/images/background7.jpg';
import backgroundImage8 from '../../assets/images/background8.jpg';
import '../../assets/styles/background.css';
import React, {useState, useEffect} from 'react';
import { Blurhash  } from 'react-blurhash';

const backgrounds = [
  { src: backgroundImage1, name: 'Urban Sunset', hash: 'L9MrrhJ44-IcOJ-i-iwi1B0fI9x]' },
  { src: backgroundImage2, name: 'Urban Calm', hash: 'LBFr^w}.00Xq0qMxr;tTANV?-ia%' },
  { src: backgroundImage3, name: 'Springtime Bloom', hash: 'LfE|JY#rNEX8Xrxuxuba9GOXkDnl' },
  { src: backgroundImage4, name: 'Ancient Pathway', hash: 'LEB{[gS$00D%~qxu9FRiJDafaJ-o' },
  { src: backgroundImage5, name: 'Sunny Dorm', hash: 'LGDmv}4:IT$yT#rWrB9GR4XTf4$|' },
  { src: backgroundImage6, name: 'Café Twilight', hash: 'L37nI4RQ0K}m1%9uInM_9^}s=G9t' },
  { src: backgroundImage7, name: 'Springtime Rail', hash: 'LNG8+tv|MwIU-@4ns;xvxVxUr@Or' },
  { src: backgroundImage8, name: 'Evening Serenade', hash: 'LAF;p701u0rq17-AM_%102~nicS$' },
];

function BackgroundOptions({ onChangeBackground }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let imagesLoaded = 0;
    const imageObjects = backgrounds.map(background => {
      const img = new Image();
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === backgrounds.length) {
          setImageLoaded(true);
        }
      };
      img.src = background.src;
      return img;
    });
  }, []);

  return (
    <div className="background-options">
      <div className="background-header">
        <h1>Background</h1>
      </div>
      <div className="backgrounds">
        {backgrounds.map((background, index) => (
          <div key={index} className="background-item" onClick={() => onChangeBackground(background.src)}>
            <div className="hash-container" style={{ display: imageLoaded ? ' none' : 'inline' }}>
              {!imageLoaded && (
                <Blurhash
                  className='blurhash'
                  hash={background.hash}
                  width={200}
                  height={112.5}
                  resolutionX={32}
                  resolutionY={32}
                  punch={1} />
              )}
            </div>
            {imageLoaded && 
            <img src={background.src} className={`background-image ${imageLoaded ? 'loaded' : ''}`}/>}
            <div className="background-name">{background.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BackgroundOptions;