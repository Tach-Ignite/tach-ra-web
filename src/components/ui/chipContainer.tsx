import { Chip } from './chip';
import { Label } from './label';
import { InputFooter } from './inputFooter';

export interface ChipContainerProps {
  chips: string[];
  label?: string;
  editable?: boolean;
  deletable?: boolean;
  editType: 'inline' | 'button';
  onChanged?: (oldValue: string, newValue: string) => void;
  onDeleted?: (value: string) => void;
  onEditClicked?: (value: string) => void;
}

export function ChipContainer({
  chips,
  label,
  editable,
  deletable,
  editType,
  onChanged,
  onDeleted,
  onEditClicked,
}: ChipContainerProps) {
  return (
    <div className="mb-1">
      {label && <Label name={label}>{label}</Label>}
      {chips && chips.length > 0 && (
        <div className="flex flex-wrap w-full border border-tachGrey rounded p-1 mt-2">
          {chips?.map((chip) => (
            <div key={chip} className="flex-left">
              <Chip
                value={chip}
                editable={editable ?? false}
                deletable={deletable ?? false}
                editType={editType}
                onChanged={(oldValue, newValue) =>
                  onChanged && onChanged(oldValue ?? '', newValue)
                }
                onDeleted={(value) => onDeleted && onDeleted(value)}
                onEditClicked={(value) => onEditClicked && onEditClicked(value)}
              />
            </div>
          ))}
        </div>
      )}
      <InputFooter errorMessage="" />
    </div>
  );
}
