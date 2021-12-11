import {
  selectInventoryId,
  selectCategorySetId,
  selectCSSetId,
  setInventoryId,
  setCategorySetId,
  setPartTypeCategories,
  setAuxiliaryParts,
  setWithdrawAuxiliaryParts,
  setCSSetId,
} from './inventorySlice.js';

export default ({state, dispatch, userResult}) => {
  const inventoryId = selectInventoryId(state);
  const categorySetId = selectCategorySetId(state);
  const CSSetId = selectCSSetId(state);

  if(userResult.settings) {
    dispatch(setPartTypeCategories(userResult.settings?.partTypeCategories))
    dispatch(setAuxiliaryParts(userResult.settings?.auxiliaryParts))
    dispatch(setWithdrawAuxiliaryParts(userResult.settings?.withdrawAuxiliaryParts))
  }
  if( !inventoryId) {
    dispatch(setInventoryId(userResult.defaultInventory));
  }
  if( !categorySetId) {
    dispatch(setCategorySetId(userResult.defaultCategorySet));
  }
  if( !CSSetId) {
    dispatch(setCSSetId(userResult.defaultCSSet));
  }
}