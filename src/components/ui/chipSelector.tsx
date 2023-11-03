import { useEffect, useRef, useState } from 'react';
import { IEnum } from '@/lib/abstractions';
import { Chip } from './chip';
import { InputFooter } from './inputFooter';
import { Label } from './label';

export interface ChipSelectorProps {
  $enum: IEnum;
  editable?: boolean;
  deletable?: boolean;
  editType?: 'inline' | 'button';
  value: string[];
  onChange?: (list: string[]) => void;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  initValue?: string[];
}

export function ChipSelector({
  $enum,
  value,
  onChange,
  errorMessage,
  label,
  required,
  editable,
  deletable,
  editType,
  initValue,
}: ChipSelectorProps) {
  const [optionKeys, setOptionKeys] = useState<string[]>($enum._keys);
  const selectRef = useRef<HTMLSelectElement>(null);
  if (!value) {
    value = [];
  }

  useEffect(() => {
    if (initValue) {
      setOptionKeys($enum._keys);
      for (let i = 0; i < initValue.length; i++) {
        addToKeysAndRemoveFromOptions(initValue[i]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initValue, setOptionKeys, $enum._keys]);

  function addToKeysAndRemoveFromOptions(key: string) {
    setOptionKeys((previousOptionKeys) =>
      previousOptionKeys.filter((k) => k !== key),
    );
  }

  function removeFromKeysAndAddToOptions(key: string) {
    setOptionKeys((previousOptionKeys) => [...previousOptionKeys, key]);
  }

  function addChip() {
    if (selectRef.current!.value !== '') {
      onChange!([...value, selectRef.current!.value]);
      selectRef.current!.value = '';
    }
  }

  function onChipDeletedHandler(key: string) {
    onChange!(value.filter((k) => k !== key));
  }

  return (
    <div className="mb-1">
      <Label id="selectLabel" required={required}>
        {label}
      </Label>
      <div className="relative w-full">
        <select
          ref={selectRef}
          aria-label={label}
          name="selectElement"
          className={`appearance-none border border-tachGrey rounded py-1 px-1.5 w-full mb-1 ${
            errorMessage ? 'border-red-600' : ''
          }`}
          onChange={(event) => {
            addChip();
          }}
        >
          <option aria-label="Default Option" key="defaultOption" />
          {optionKeys.map((key: string) => (
            <option key={key} value={key}>
              {$enum[key]}
            </option>
          ))}
        </select>
      </div>
      {value && value.length > 0 && (
        <div className="flex flex-wrap w-full border border-tachGrey rounded p-1 mt-2">
          {value?.map((item, index) => (
            <div key={item} className="flex-left mr-1">
              <Chip
                value={$enum[item]}
                editable={editable}
                deletable={deletable}
                editType={editType}
                onDeleted={(value) => {
                  onChipDeletedHandler($enum.reverseLookup(value));
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
