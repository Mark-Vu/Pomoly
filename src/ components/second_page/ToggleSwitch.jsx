import "../../assets/styles/toggleSwitch.css";

const ToggleSwitch = ({ leftLabel, rightLabel, onToggle }) => {
    return (
        <div className="toggle-switch__container">
            <span>{leftLabel}</span>
            <div className="toggle-switch">
                <input
                    type="checkbox"
                    className="checkbox"
                    name={leftLabel}
                    id={leftLabel}
                    onChange={onToggle} // Call the onToggle function on change
                />
                <label className="label" htmlFor={leftLabel}>
                    <span className="inner" />
                    <span className="switch" />
                </label>
            </div>
            <span>{rightLabel}</span>
        </div>
    );
};

export default ToggleSwitch;
