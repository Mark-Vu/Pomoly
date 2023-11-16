export default function EditBlock(props) {
    const { minute, lengthType, handleDecrease, handleIncrease, onChange, name} = props;
    return (
        <div className='timer--edit__block rounded-md flex'>
            <div className='block__edit--length rounded-sm'>
                <button className='edit--length__sign' onClick={handleDecrease}> - </button>
                <input type='number' value={minute} onChange={onChange} name={name} required />
                <button className='edit--length__sign' onClick={handleIncrease}> + </button>
            </div>
            <h2>{lengthType}</h2>
        </div>
    );
}
