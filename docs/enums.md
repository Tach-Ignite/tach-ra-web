# Enums

Enums in Javascript are hard. To make them slightly easier to manage, this RA includes a simple enum factory that supports more advanced features like reverse-lookup.

## Example

```typescript
import { EnumFactory } from '@/lib/enums';

const enumFactory = new EnumFactory();

interface IFruitEnum extends IEnum {
  BloodOrange: string;
  Strawberry: string;
  RedGrape: string;
}

const FruitEnum = enumFactory.create({
  BloodOrange: 'Blood Orange',
  Strawberry: 'Strawberry',
  RedGrape: 'Red Grape',
}) as IFruitEnum;

console.log(FruitEnum.BloodOrange); // 'Blood Orange'
console.log(FruitEnum.reverseLookup('Blood Orange')); // 'BloodOrange'
console.log(FruitEnum.reverseLookup(FruitEnum.RedGrape)); // 'RedGrape'
```
