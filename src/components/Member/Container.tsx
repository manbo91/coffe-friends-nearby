import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import Presenter from './Presenter';
// types
import { distance } from '../../redux/modules/gps';
import { StoreToProps } from '.';

export interface State {
  data: Array<any>;
  loadingTop: boolean;
  loadingBottom: boolean;
  limit: number;
  lastDoc: any;
  geoPoint: {
    latitude: number;
    longitude: number;
  };
}

class Container extends React.PureComponent<StoreToProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      geoPoint: {
        latitude: 37.40589,
        longitude: 126.670866
      },
      // radius: 10
      loadingTop: false,
      loadingBottom: false,
      limit: 10,
      lastDoc: null
    };

    this.handleGetMembers = this.handleGetMembers.bind(this);
    this.handleOnRefresh = this.handleOnRefresh.bind(this);
    this.handleOnEndReached = this.handleOnEndReached.bind(this);
    this.createMembersQuery = this.createMembersQuery.bind(this);
  }

  componentDidMount() {
    this.handleGetMembers('loadingTop');
  }

  componentWillUnmount() {
    console.log('Member:: unmount');
    const unsubscribe = firebase
      .firestore()
      .collection('cities')
      .onSnapshot(() => {});
    unsubscribe();
  }

  createMembersQuery() {
    const userCollectionRef = firebase.firestore().collection('users');
    let { filter, filterValue } = this.props;

    let query;
    if (filter !== 'all') {
      query = userCollectionRef.where(filter, '==', filterValue);
    } else {
      query = userCollectionRef;
    }
    const currentTime = new Date();
    if (this.state.lastDoc) {
      query = query
        .orderBy('lastAccessTime', 'desc')
        .startAfter(this.state.lastDoc);
    } else {
      query = query.orderBy('lastAccessTime', 'desc').startAt(currentTime);
    }
    return query;
  }

  handleGetMembers(loadingPosition: 'loadingTop' | 'loadingBottom') {
    const loading: any = { [loadingPosition]: true };
    this.setState(loading);
    const query: firebase.firestore.Query = this.createMembersQuery();

    query.limit(this.state.limit).onSnapshot(querySnapshot => {
      const members: any = [];
      querySnapshot.forEach(doc => {
        const docData = doc.data();
        const geoPoint = {
          latitude: docData.geoPoint._lat,
          longitude: docData.geoPoint._long
        };
        docData.distance = (
          distance(this.state.geoPoint, geoPoint) * 0.621371
        ).toFixed(1);
        const { currentUser } = firebase.auth();
        if (currentUser && doc.id !== currentUser.uid) {
          members.push({ ...docData, docId: doc.id });
        }
      });

      const connectedMembers = members.filter(
        (member: any) => member.isConnected
      );
      const notConnectedMembers = members.filter(
        (member: any) => !member.isConnected
      );

      loading[loadingPosition] = false;
      console.log(members);

      this.setState(prevState => ({
        ...loading,
        data: [...prevState.data, ...connectedMembers, ...notConnectedMembers],
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
      }));
    });
    // .get()
    // .then(querySnapshot => {
    //   console.log('[FIRESTORE] -- GET COLLECTION "users" --');
    //   const readCount = firebase.database().ref('read');
    //   readCount.transaction(currentValue => (currentValue || 0) + 1);
    //   const members: any = [];
    //   querySnapshot.forEach(doc => {
    //     const docData = doc.data();
    //     const geoPoint = {
    //       latitude: docData.geoPoint._lat,
    //       longitude: docData.geoPoint._long
    //     };
    //   docData.distance = (
    //     distance(this.state.geoPoint, geoPoint) * 0.621371
    //   ).toFixed(1);
    //   const { currentUser } = firebase.auth();
    //   if (currentUser && doc.id !== currentUser.uid) {
    //     members.push({ ...docData, docId: doc.id });
    //   }
    // });

    //   const connectedMembers = members.filter(
    //     (member: any) => member.isConnected
    //   );
    //   connectedMembers.sort((a: any, b: any) => a.distance - b.distance);
    //   const notConnectedMembers = members.filter(
    //     (member: any) => !member.isConnected
    //   );
    //   console.log(members);

    //   this.setState({
    //     data: [...connectedMembers, ...notConnectedMembers],
    //     loadingTop: false
    //   });
    // })
    // .catch(error => console.log(error));
  }

  handleOnRefresh() {
    this.setState({ lastDoc: null });
    this.handleGetMembers('loadingTop');
  }

  handleOnEndReached() {
    const { loadingTop, loadingBottom, lastDoc } = this.state;
    if (!loadingTop && !loadingBottom && lastDoc) {
      this.handleGetMembers('loadingBottom');
    }
  }

  render() {
    return (
      <Presenter
        {...this.props}
        {...this.state}
        handleOnRefresh={this.handleOnRefresh}
        handleOnEndReached={this.handleOnEndReached}
      />
    );
  }
}

export default Container;
