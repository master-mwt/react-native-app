import React, {Component} from 'react';
import * as API from '../api/Api';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class TvShowsPopularPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      loading: false,
      data: [],
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const {page} = this.state;
    this.setState({loading: true});

    API.getTvShowsPopular(page)
      .then(res => {
        this.setState({
          data: [...this.state.data, ...res.results],
          loading: false,
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({loading: false});
      });
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#694fad" />
        <FlatList
          data={this.state.data}
          style={styles.flat_list}
          numColumns={3}
          renderItem={({item}) => (
            <View style={styles.card_container}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  this.props.navigation.navigate('tv_show_details', {
                    item: {
                      id: item.id,
                    },
                  });
                }}>
                {item.poster_path && (
                  <Image
                    style={styles.card_image}
                    source={{
                      uri: `https://image.tmdb.org/t/p/w500/${
                        item.poster_path
                      }`,
                    }}
                  />
                )}
                {!item.poster_path && (
                  <Image
                    style={styles.card_image}
                    source={require('../../imgs/no_content.jpg')}
                  />
                )}
                <View style={styles.card_text_container}>
                  <Text numberOfLines={1} style={styles.card_text}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
          onEndReached={() => this.handleLoadMore()}
          onEndReachedThreshold={0.2}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // maybe useless
    flexDirection: 'row', // maybe useless
    flexWrap: 'wrap', // maybe useless
    backgroundColor: '#fff',
  },
  flat_list: {
    height: '100%',
  },
  card_container: {
    width: '33.3333%',
    padding: 2,
  },
  card: {
    backgroundColor: '#ccc',
    padding: 3,
    borderRadius: 5,
  },
  card_image: {
    width: '100%', // maybe useless
    height: 170,
    borderRadius: 5,
  },
  card_text_container: {
    padding: 3,
  },
  card_text: {
    textAlign: 'center',
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loading_icon: {
    flex: 1,
    justifyContent: 'center',
  },
});
