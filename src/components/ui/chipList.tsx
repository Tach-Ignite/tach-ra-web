import { useRef, useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { Chip } from './chip';
import { Label } from './label';
import { InputFooter } from './inputFooter';

export interface ChipListProps {
  placeholder?: string;
  value: string[];
  onChange?: (list: string[]) => void;
  errorMessage?: string;
  label?: string;
  required?: boolean;
}

export type Ref = HTMLInputElement;

export function ChipList({
  placeholder,
  value,
  onChange,
  errorMessage,
  label,
  required,
}: ChipListProps) {
  const [maxKey, setMaxKey] = useState<number>(0);
  const [keys, setKeys] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!value) {
    value = [];
  } else {
    for (let i = 0; i < value.length - keys.length; i++) {
      setKeys((previousKeys) => [...previousKeys, maxKey.toString()]);
      setMaxKey((previousMaxKey) => previousMaxKey + 1);
    }
  }

  function onKeyUpHandler(event: any) {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      addChip();
      event.preventDefault();
    }
  }

  function addChip() {
    if (inputRef.current!.value !== '') {
      setKeys((previousKeys) => [...previousKeys, maxKey.toString()]);
      onChange!([...value, inputRef.current!.value]);
      setMaxKey((previousMaxKey) => previousMaxKey + 1);
      inputRef.current!.value = '';
    }
  }

  function onChipChangedHandler(index: number, newValue: string) {
    onChange!(value.map((item, i) => (i === index ? newValue : item)));
  }

  function onChipDeletedHandler(key: string, item: string) {
    const index = keys.indexOf(key);
    const result = value.filter((x, i) => i !== index);
    onChange!(result);
    setKeys(keys.filter((k, i) => k !== key));
  }

  return (
    <div className="mb-1">
      <Label required={required} name={label}>
        {label}
      </Label>
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          onKeyUp={onKeyUpHandler}
          className="border rounded block w-full py-1 px-1.5"
        />
        <button
          type="button"
          onClick={() => {
            addChip();
          }}
          className="absolute top-0 right-0 border rounded-r p-1.5 bg-violet-500 hover:bg-cyan-700 text-white"
        >
          <HiPlus className="h-5 w-5" />
        </button>
      </div>
      {value && value.length > 0 && (
        <div className="flex flex-wrap w-full border rounded p-1 mt-2">
          {value?.map((item, index) => (
            <div key={item} className="flex-left mr-1">
              <Chip
                value={item}
                editable
                deletable
                onChanged={(oldValue, newValue) => {
                  onChipChangedHandler(index, newValue);
                }}
                onDeleted={(value) => {
                  onChipDeletedHandler(keys[index], value);
                }}
              />
            </div>
          ))}
        </div>
      )}
      <InputFooter errorMessage={errorMessage} />
    </div>
  );
}
