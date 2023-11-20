import backgroundImage1 from '../../assets/images/background1.jpg';
import backgroundImage2 from '../../assets/images/background2.jpg';
import backgroundImage3 from '../../assets/images/background3.jpg';
import backgroundImage4 from '../../assets/images/background4.jpg';
import backgroundImage5 from '../../assets/images/background5.jpg';
import backgroundImage6 from '../../assets/images/background6.jpg';
import backgroundImage7 from '../../assets/images/background7.jpg';
import backgroundImage8 from '../../assets/images/background8.jpg';
import '../../assets/styles/background.css';

function BackgroundOptions({ onChangeBackground }) {
    return (
    <div className="background-options">
      <div className="background-header">
        <h1>Background</h1>
      </div>
      <div className="backgrounds">
        {[backgroundImage1, backgroundImage2, backgroundImage3, backgroundImage4, backgroundImage5, backgroundImage6, backgroundImage7, backgroundImage8].map((bgImage, index) => (
          <div key={index} className="background-item" onClick={() => onChangeBackground(bgImage)}>
            <img src={bgImage} alt={`Background ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
    );
}

export default BackgroundOptions;