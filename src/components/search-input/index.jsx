import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';
import "./search-input.scss";

const SearchInput = props => (
	<DebounceInput
		className="object-search__input"
		key="objectSearchBar"
		placeholder="Search Objects"
		debounceTimeout={200}
		type="search"
		{...props}
	/>);

SearchInput.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func
}

export default SearchInput
