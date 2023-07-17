/* eslint-disable no-restricted-syntax */
function cleanEmptyObject(riskObject) {
  const cleanObject = riskObject;
  for (const propName in cleanObject) {
    if (!cleanObject[propName]) {
      delete cleanObject[propName];
    }
  }
  return cleanObject;
}

function getAllBrandsOfCategories(categories) {
  const allBrands = categories
    .reduce(
      (result, current) => (Array.isArray(result) ? result.concat(current.brands) : current.brands),
      {},
    )
    .filter((currentBrand, currentIndex, originalArray) => (
      originalArray.findIndex(
        (originalCurrentBrand) => (originalCurrentBrand.name === currentBrand.name),
      ) === currentIndex
    ));
  return allBrands;
}

/**
 * @use will return clean search params and categories inclue category with all brands
 * @param initCategories fetch from API
 * @param searchParams fetch from `useSearchParams` hook
 * @return object { newSearchParams, newCategories }
 */
function handleSearchParamsAndCategories(initCategories, searchParams) {
  const initSearchParams = Object.fromEntries([...searchParams]);
  const allBrandsOfCategories = getAllBrandsOfCategories(initCategories);
  const categoryWithAllBrands = {
    _id: '',
    name: '',
    brands: allBrandsOfCategories,
  };
  const categoriesIncludeAllBrands = { all: categoryWithAllBrands, list: initCategories };

  // find category match categoryId in search params
  if (initSearchParams.categoryId) {
    initSearchParams.categoryId = initCategories.find(
      (ctg) => ctg._id === initSearchParams.categoryId,
    )?._id || '';
  }

  // find brand match brandId in search params
  if (initSearchParams.brandId) {
    initSearchParams.brandId = allBrandsOfCategories.find(
      (brd) => brd._id === initSearchParams.brandId,
    )?._id || '';
  }

  // set near page number match in search params
  if (initSearchParams.page) {
    initSearchParams.page = parseInt(initSearchParams.page, 10); // search params always is string
    // page always is number and >= 1
    initSearchParams.page = (initSearchParams.page < 1) ? 1 : initSearchParams.page;
  }

  if (initSearchParams.keywords) {
    initSearchParams.keywords = initSearchParams.keywords.substring(0, 64);
  }

  const cleanSearchParams = cleanEmptyObject(initSearchParams);
  return { newSearchParams: cleanSearchParams, newCategories: categoriesIncludeAllBrands };
}

/**
 * @param {Object} objectA
 * @param {Object} objectB
 * @returns {Boolean} deep compares of two objects
 */
function comparesObjects(objectA, objectB) {
  const objectJsonA = JSON.stringify(objectA ?? {});
  const objectJsonB = JSON.stringify(objectB ?? {});
  return (objectJsonA === objectJsonB);
}

export {
  cleanEmptyObject,
  comparesObjects,
  handleSearchParamsAndCategories,
};
