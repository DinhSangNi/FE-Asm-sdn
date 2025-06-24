import { ChangeEvent, KeyboardEvent } from 'react';

type Props = {
  className?: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
};

const QuantityStepper = ({
  className,
  value,
  onIncrease,
  onDecrease,
  onChange,
  onKeyDown,
  onBlur,
}: Props) => {
  return (
    <div className={`${className ?? 'flex h-10 w-full items-center'}`}>
      <button
        className="aspect-square h-full cursor-pointer border border-gray-300 text-[1.5rem]"
        onClick={onDecrease}
      >
        -
      </button>
      <input
        className="box-border h-full w-12 border-gray-300 text-center focus-within:outline-none focus:border-black"
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
      <button
        className="aspect-square h-full cursor-pointer border border-gray-300 text-[1.5rem]"
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  );
};

export default QuantityStepper;
