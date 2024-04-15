import _ from 'lodash';

export const GENERIC_INLINE_FILTER_DATA = {
  sourceFilterDataList: [],
  filterDataList: [],
  dateFilterForm: null,
};

export const GENERIC_INLINE_FILTER_SHARED_DATA = JSON.parse(JSON.stringify({
  selectedFilterItems: [],
  selectedFilterValues: [],
  tempSelectedItems: [],
  filterPayload: null,
  lastFilteredItem: null,
  dateFilterForm: null,
}));
