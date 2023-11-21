import backgroundImage1 from '../../assets/images/background1.jpg';
import backgroundImage2 from '../../assets/images/background2.jpg';
import backgroundImage3 from '../../assets/images/background3.jpg';
import backgroundImage4 from '../../assets/images/background4.jpg';
import backgroundImage5 from '../../assets/images/background5.jpg';
import backgroundImage6 from '../../assets/images/background6.jpg';
import backgroundImage7 from '../../assets/images/background7.jpg';
import backgroundImage8 from '../../assets/images/background8.jpg';
import '../../assets/styles/background.css';

const backgrounds = [
  { src: backgroundImage1, name: 'Urban Sunset' },
  { src: backgroundImage2, name: 'Urban Calm' },
  { src: backgroundImage3, name: 'Springtime Bloom' },
  { src: backgroundImage4, name: 'Ancient Pathway' },
  { src: backgroundImage5, name: 'Sunny Dorm' },
  { src: backgroundImage6, name: 'Café Twilight' },
  { src: backgroundImage7, name: 'Springtime Rail' },
  { src: backgroundImage8, name: 'Evening Serenade' },
];

function BackgroundOptions({ onChangeBackground }) {
  return (
      <div className="background-options">
      <div className="background-header">
        <h1>Background</h1>
      </div>
      <div className="backgrounds">
        {backgrounds.map((background, index) => (
          <div key={index} className="background-item" onClick={() => onChangeBackground(background.src)}>
            <img src={background.src} alt={background.name} />
            <div className="background-name">{background.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BackgroundOptions;