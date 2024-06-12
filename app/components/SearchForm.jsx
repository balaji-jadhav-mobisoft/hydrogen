import React from 'react';
import {PredictiveSearchForm, PredictiveSearchResults} from './Search';
import CloseIcon from '~/assets/close_icon.svg';

export function SearchForm({setModel}) {
  return (
    <div id="search-asidee">
      <div className="predictive-search-container">
        <br />
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <>
              <div className="input-search-container">
                <input
                  className="input-search"
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="Search"
                  ref={inputRef}
                  type="search"
                />
                {/* &nbsp;
                <button
                  onClick={() => {
                    window.location.href = inputRef?.current?.value
                      ? `/search?q=${inputRef.current.value}`
                      : `/search`;
                  }}
                >
                  Search
                </button> */}
                <CloseAside setModel={setModel} className={'close'} />
              </div>
            </>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </div>
  );
}

export default SearchForm;

function CloseAside({setModel, className}) {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <span
      //   style={{backgroundColor: 'red'}}
      className={className}
      //   href="#"
      //   onChange={() => history.go(-1)}
      onClick={() => setModel(false)}
    >
      <img src={CloseIcon} alt="close-icon" />
    </span>
  );
}
