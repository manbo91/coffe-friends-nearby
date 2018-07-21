import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import Presenter from './Presenter';
import { Post } from '../../redux/types';
import { StoreToProps } from '.';

interface Props extends StoreToProps {
  cafeId?: string;
}

export interface State {
  data: Array<Post>;
  loadingTop: boolean;
  loadingBottom: boolean;
  isFilterOpen: boolean;
}

class Container extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: this.props.posts,
      loadingTop: false,
      loadingBottom: false,
      isFilterOpen: false
    };

    this.handleOnRefresh = this.handleOnRefresh.bind(this);
    this.navigateCafe = this.navigateCafe.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleOnPressFilter = this.handleOnPressFilter.bind(this);
  }

  static getDerivedStateFromProps(props: StoreToProps, state: State) {
    if (state.data[0] !== props.posts[0]) {
      return { data: props.posts, loadingTop: false };
    } else if (props.posts.length === 0) {
      return { loadingTop: false };
    }
    return null;
  }

  componentDidMount() {
    if (!this.props.cafeId && this.state.data.length === 0) {
      this.handleSetFeed();
    }

    if (this.props.cafeId) {
      const postCollectionRef = firebase.firestore().collection('posts');

      const currentTime = new Date();
      const query = postCollectionRef
        .where('cafeId', '==', this.props.cafeId)
        .orderBy('createdAt', 'desc')
        .startAt(currentTime);

      query
        .limit(50)
        .get()
        .then(documentSnapshots => {
          const posts: any = [];
          documentSnapshots.forEach(doc => {
            const docData = doc.data();
            posts.push({ ...docData, docId: doc.id });
          });

          console.log('[FIRESTORE] -- GET COLLECTION "posts" --', posts);
          const readCount = firebase.database().ref('read');
          readCount.transaction(currentValue => (currentValue || 0) + 1);

          this.setState({ data: posts });
        })
        .catch(error => {
          console.log(error);
          throw new Error('firebase Error');
        });
    }
  }

  navigateCafe(cafeId: string) {
    if (!this.props.cafeId) {
      this.props.navigation.navigate('Cafe', { cafeId });
    }
  }

  handleSetFeed() {
    this.setState({ loadingTop: true });
    this.props.setPosts();
  }

  handleOnRefresh() {
    this.setState({ loadingTop: true });
    console.log('refresh');
    setTimeout(() => {
      this.setState({ loadingTop: false });
    }, 1500);
  }

  handleChangeFilter(filter: 'cafeId' | 'city' | 'countryCode' | 'all') {
    this.props.changePostsFilter(filter);
    this.handleSetFeed();
    this.setState({ isFilterOpen: false });
  }

  handleOnPressFilter() {
    this.setState(prevState => ({
      isFilterOpen: !prevState.isFilterOpen
    }));
  }

  render() {
    return (
      <Presenter
        {...this.state}
        filter={this.props.filter}
        cafeId={this.props.cafeId}
        favoriteCafe={this.props.favoriteCafe}
        navigateCafe={this.navigateCafe}
        handleOnRefresh={this.handleOnRefresh}
        handleOnPressFilter={this.handleOnPressFilter}
        handleChangeFilter={this.handleChangeFilter}
      />
    );
  }
}

export default Container;
