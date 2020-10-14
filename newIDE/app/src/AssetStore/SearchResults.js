// @flow
import { Trans } from '@lingui/macro';
import * as React from 'react';
import PlaceholderLoader from '../UI/PlaceholderLoader';
import PlaceholderError from '../UI/PlaceholderError';
import ErrorBoundary from '../UI/ErrorBoundary';
import { AutoSizer, Grid } from 'react-virtualized';
import EmptyMessage from '../UI/EmptyMessage';

type Props<SearchItem> = {|
  searchItems: ?Array<SearchItem>,
  renderSearchItem: (item: SearchItem, size: number) => React.Node,
  error: ?Error,
  onRetry: () => void,
|};

const styles = {
  container: { flex: 1 },
  grid: { overflowX: 'hidden' },
};

export const SearchResults = <SearchItem>({
  searchItems,
  renderSearchItem,
  error,
  onRetry,
}: Props<SearchItem>) => {
  if (!searchItems) {
    if (!error) return <PlaceholderLoader />;
    else {
      return (
        <PlaceholderError onRetry={onRetry}>
          <Trans>
            Can't load the results. Verify your internet connection or retry
            later.
          </Trans>
        </PlaceholderError>
      );
    }
  } else if (searchItems.length === 0) {
    return (
      <EmptyMessage>
        <Trans>
          No results returned for your search. Try something else, browse the
          categories or create your object from scratch!
        </Trans>
      </EmptyMessage>
    );
  }

  return (
    <ErrorBoundary>
      <div style={styles.container}>
        <AutoSizer>
          {({ width, height }) => {
            if (!width || !height) return null;

            const baseSize = 128;
            const columnCount = Math.max(Math.floor((width - 5) / baseSize), 1);
            const columnWidth = Math.max(Math.floor(width / columnCount), 30);
            const rowCount = Math.max(
              1,
              Math.ceil(searchItems.length / columnCount)
            );

            function cellRenderer({ columnIndex, key, rowIndex, style }) {
              const indexInList = rowIndex * columnCount + columnIndex;
              const searchItem =
                indexInList < searchItems.length
                  ? searchItems[indexInList]
                  : null;

              return (
                <div key={key} style={style}>
                  {searchItem
                    ? renderSearchItem(searchItem, columnWidth)
                    : null}
                </div>
              );
            }

            return (
              <Grid
                width={width}
                height={height}
                columnCount={columnCount}
                columnWidth={columnWidth}
                rowHeight={columnWidth}
                rowCount={rowCount}
                cellRenderer={cellRenderer}
                style={styles.grid}
              />
            );
          }}
        </AutoSizer>
      </div>
    </ErrorBoundary>
  );
};
