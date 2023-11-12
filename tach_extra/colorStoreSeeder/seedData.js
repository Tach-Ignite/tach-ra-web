import { createCopiesWithRandomColor, svg } from './image_creator/imageCreator';
import {
  folderHasFiles,
  getFilenamesInFolder,
  generateRandomHexString,
} from './utils';

function getRandomColorBrand() {
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  switch (randomNumber) {
    case 1:
      return 'Colors Unlimited';
    case 2:
      return 'The Rainbow Factory';
    case 3:
      return 'RGBoom';
  }
}

function getRandomBoolean() {
  const randomNumber = Math.floor(Math.random() * 2) + 1;
  switch (randomNumber) {
    case 1:
      return true;
    case 2:
      return false;
  }
}

function getRandomLoremIpsum() {
  const randomNumber = Math.floor(Math.random() * 5) + 1;
  switch (randomNumber) {
    case 1:
      return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis arcu ut tincidunt varius. Aliquam vel ipsum mollis, convallis elit auctor, finibus enim. Vestibulum augue dolor, scelerisque vitae mollis a, accumsan et eros. Ut tempor suscipit quam sed lobortis. Ut condimentum porttitor urna non mattis. Pellentesque eget orci luctus dolor pellentesque iaculis. Maecenas quam orci, congue et ex nec, malesuada aliquam magna. Nam facilisis luctus elit bibendum pellentesque.';
    case 2:
      return 'Curabitur augue nulla, porttitor sit amet egestas consequat, egestas ac mi. Integer ligula diam, porta in viverra non, porta eget dui. Cras ultricies nisi lectus, vel luctus ligula luctus ut. Aliquam vel egestas velit, ultrices interdum neque. Etiam dignissim dui eu nunc posuere viverra. Etiam pellentesque tempor enim a tempus.';
    case 3:
      return 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque neque velit, vulputate nec tellus vel, iaculis hendrerit metus. Quisque ac nulla sed mi dapibus sodales. Fusce malesuada metus vel risus convallis, ut lacinia dolor lacinia. Mauris nisl felis, vulputate nec massa eget, volutpat malesuada nunc.';
    case 4:
      return 'Morbi finibus velit mauris, et venenatis diam vehicula at. Pellentesque maximus neque eu est eleifend, a pharetra nunc semper. Duis id risus id enim pulvinar ultrices eget quis orci. Aenean ornare imperdiet neque eget placerat. Etiam sit amet aliquet neque. Fusce laoreet mi quam, cursus pretium lectus euismod quis.';
    case 5:
      return 'Quisque pulvinar congue mauris at posuere. Sed erat quam, pellentesque vel tellus id, rhoncus porta felis. Sed tincidunt justo lectus, accumsan euismod neque molestie et. Aliquam non ultrices eros, in pulvinar purus. Phasellus eu ligula lectus.';
  }
}

const categories = [
  {
    _id: generateRandomHexString(24),
    name: 'Budget',
    categoryProperties: [
      {
        _id: generateRandomHexString(24),
        name: 'Finish',
        values: ['Matte', 'Glossy', 'Semi-Glossy'],
      },
    ],
  },
  {
    _id: generateRandomHexString(24),
    name: 'Mid-Range',
    categoryProperties: [
      {
        _id: generateRandomHexString(24),
        name: 'Mechanism',
        values: ['Analog', 'Digital', 'Magic'],
      },
    ],
  },
  {
    _id: generateRandomHexString(24),
    name: 'Luxury',
    categoryProperties: [
      {
        _id: generateRandomHexString(24),
        name: 'Material',
        values: ['Mahogany', 'Gold', 'Diamond'],
      },
    ],
  },
];

function generateRandomColorProduct(imageFileName) {
  //   let r,
  //     g,
  //     b = 0;
  //   r = Math.floor(Math.random() * 255);
  //   g = Math.floor(Math.random() * 255);
  //   b = Math.floor(Math.random() * 255);
  //   const hexString = r.toString(16) + g.toString(16) + b.toString(16);
  const hexString = imageFileName.split('.')[0];
  const friendlyId = hexString;
  const name = `#${hexString}`;
  const description = getRandomLoremIpsum();
  const brand = getRandomColorBrand();
  const price =
    ((Math.floor(Math.random() * 10000) + Number.EPSILON) * 100) / 100;
  const oldPrice =
    ((Math.floor(Math.random() * 10000) + Number.EPSILON) * 100) / 100;
  const categoryIds = [];
  const categoryPropertyValues = {};
  const randomNumber = Math.floor(Math.random() * 3) + 1;

  if (price < 3000) {
    categoryIds.push(categories[0]._id);

    switch (randomNumber) {
      case 1:
        categoryPropertyValues.Finish = {
          categoryId: categories[0]._id,
          categoryPropertyId: categories[0].categoryProperties[0]._id,
          value: 'Matte',
        };
        break;
      case 2:
        categoryPropertyValues.Finish = {
          categoryId: categories[0]._id,
          categoryPropertyId: categories[0].categoryProperties[0]._id,
          value: 'Glossy',
        };
        break;
      case 3:
        categoryPropertyValues.Finish = {
          categoryId: categories[0]._id,
          categoryPropertyId: categories[0].categoryProperties[0]._id,
          value: 'Semi-Glossy',
        };
        break;
    }
  } else if (price < 6000) {
    categoryIds.push(categories[1]._id);
    switch (randomNumber) {
      case 1:
        categoryPropertyValues.Mechanism = {
          categoryId: categories[1]._id,
          categoryPropertyId: categories[1].categoryProperties[0]._id,
          value: 'Analog',
        };
        break;
      case 2:
        categoryPropertyValues.Mechanism = {
          categoryId: categories[1]._id,
          categoryPropertyId: categories[1].categoryProperties[0]._id,
          value: 'Digital',
        };
        break;
      case 3:
        categoryPropertyValues.Mechanism = {
          categoryId: categories[1]._id,
          categoryPropertyId: categories[1].categoryProperties[0]._id,
          value: 'Magic',
        };
        break;
    }
  } else {
    categoryIds.push(categories[2]._id);
    switch (randomNumber) {
      case 1:
        categoryPropertyValues.Material = {
          categoryId: categories[2]._id,
          categoryPropertyId: categories[2].categoryProperties[0]._id,
          value: 'Mahogany',
        };
        break;
      case 2:
        categoryPropertyValues.Material = {
          categoryId: categories[2]._id,
          categoryPropertyId: categories[2].categoryProperties[0]._id,
          value: 'Gold',
        };
        break;
      case 3:
        categoryPropertyValues.Material = {
          categoryId: categories[2]._id,
          categoryPropertyId: categories[2].categoryProperties[0]._id,
          value: 'Diamond',
        };
        break;
    }
  }

  const isNew = getRandomBoolean();
  const quantity = Math.floor(Math.random() * 100);
  const imageStorageKeys = [`images/${imageFileName}`];

  return {
    friendlyId,
    name,
    description,
    brand,
    price,
    oldPrice,
    categoryIds,
    categoryPropertyValues,
    isNew,
    quantity,
    imageStorageKeys,
  };
}

function getRandomProducts(imageFileNames = []) {
  const products = [];
  for (let i = 0; i < imageFileNames.length; i++) {
    products.push(generateRandomColorProduct(imageFileNames[i]));
  }
  return products;
}

const folderName = 'local_data';
const hasFiles = folderHasFiles(folderName);
if (!hasFiles) {
  createCopiesWithRandomColor(svg, 25, folderName);
}
const files = getFilenamesInFolder(folderName);

const data = {
  categories,
  products: getRandomProducts(files),
};

export default data;
