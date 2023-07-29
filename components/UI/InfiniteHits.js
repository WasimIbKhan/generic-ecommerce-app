import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  titleText: {
    fontWeight: 'bold',
  },
});

const InfiniteHits = ({ hits, hasMore, refine, listItem, navigation }) => {

  return (
    <FlatList
        data={hits}
        showsVerticalScrollIndicator={false} 
        keyExtractor={item => item.objectID}
        onEndReached={() => hasMore && refine()}
        renderItem={({ item }) => (
          listItem(item, navigation)
        )
      }
    />
  )
};

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refine: PropTypes.func.isRequired,
  listItem: PropTypes.func.isRequired
};

export default connectInfiniteHits(InfiniteHits);
