import { useState, useRef, Children, cloneElement, ReactElement } from 'react';
import { HiX } from 'react-icons/hi';
import { HiOutlinePencil } from 'react-icons/hi2';

export class IChipProps {
  children?: React.ReactNode;

  value?: string = '';

  editable?: boolean = false;

  editType?: 'inline' | 'button' = 'inline';

  deletable?: boolean = false;

  onChanged?: (oldValue: string | undefined, newValue: string) => void =
    () => {};

  onEditClicked?: (value: string) => void = () => {};

  onDeleted?: (value: string) => void = () => {};
}

export function Chip(props: IChipProps) {
  const {
    value: initValue,
    children,
    editable,
    editType,
    deletable,
    onChanged,
    onDeleted,
    onEditClicked,
  } = props;
  const [editMode, setEditMode] = useState<boolean>();
  const [value, setValue] = useState<string>(initValue ?? '');
  const [oldValue, setOldValue] = useState<string>(initValue ?? '');
  const input = useRef<HTMLInputElement>(null);

  function onValueClicked(event: any) {
    if (editable && editType === 'inline') {
      setEditMode(true);
    }
  }

  return (
    <div className="block m-1">
      <div className="border border-tachGrey rounded-full px-1.5 py-1.5 flex items-center justify-center gap-1">
        {Children.toArray(children).map((element, idx) =>
          cloneElement(element as ReactElement, {
            className: 'h-4 w-4 inline mr-1',
          }),
        )}
        {!editMode && (
          <div
            onClick={onValueClicked}
            className="inline text-sm mr-1 align-middle"
          >
            {value}
          </div>
        )}
        {editMode && (
          <input
            ref={input}
            value={value}
            onFocus={(event: any) => {
              event.target.select();
            }}
            onChange={(event: any) => {
              setValue(event.target.value);
            }}
            className="inline mr-1 text-sm pl-1"
            onBlur={(event) => {
              setOldValue(value);
              setEditMode(false);
              onChanged && onChanged!(oldValue, value);
            }}
            onKeyUp={(event: any) => {
              if (event.key === 'Enter') {
                setOldValue(value);
                setEditMode(false);
                onChanged && onChanged!(oldValue, value);
              }
            }}
          />
        )}
        {editable && editType === 'button' && (
          <button
            type="button"
            className="rounded-full border border-tachGrey hover:bg-tachPurple align-middle p-1"
            onClick={() => {
              onEditClicked && onEditClicked!(value);
            }}
          >
            <HiOutlinePencil className="h-4 w-4" />
          </button>
        )}
        {deletable && (
          <button
            type="button"
            className="rounded-full border border-tachGrey hover:bg-tachPurple align-middle p-1"
            onClick={() => {
              onDeleted && onDeleted!(value);
            }}
          >
            <HiX className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
