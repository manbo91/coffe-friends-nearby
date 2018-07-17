import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.ScrollView`
  flex: 1;
`;
const SomeText = styled.Text`
  font-size: 20px;
`;
const UserContainer = styled.View`
  padding: 15px;
  border-bottom-width: 1px;
`;
const UserText = styled.Text`
  font-size: 16px;
`;
const UserImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

class MemberItem extends React.PureComponent<any> {
  render() {
    const {
      docId,
      photoURL,
      displayName,
      email,
      cafeName,
      isConnected,
      distance,
      lastAccessTime
    } = this.props.item;
    return (
      <UserContainer key={docId}>
        <UserImage
          source={{
            // uri: `${photoURL}?type=large&redirect=true&width=600&height=600`
            uri: photoURL
          }}
        />
        <UserText>{displayName}</UserText>
        <UserText>{email}</UserText>
        <UserText>{cafeName}</UserText>
        <UserText>{isConnected ? 'ON' : 'OFF'}</UserText>
        <UserText>{distance}</UserText>
        <UserText>
          {lastAccessTime &&
            new Date(lastAccessTime.seconds * 1000).toLocaleString()}
        </UserText>
      </UserContainer>
    );
  }
}

const Presenter = (props: any) => (
  <FlatList
    data={props.data}
    extraData={props.data}
    keyExtractor={(item: any) => item.docId}
    renderItem={({ item }) => <MemberItem item={item} />}
    onEndReached={() => console.log('scroll end')}
    refreshControl={
      <RefreshControl
        refreshing={props.loadingTop}
        onRefresh={props.handleOnRefresh}
        colors={['#00ac62']}
        tintColor="#00ac62"
      />
    }
  />
);

export default Presenter;