import firebase from 'firebase';

function createUniqueId() {
  return (
    new Date().getTime().toString(36) +
    Math.random()
      .toString(36)
      .substr(2, 16)
  );
}

interface Image {
  cancelled: boolean;
  type: string;
  uri: string;
  width: number;
  height: number;
  base64: string;
}

export function uploadImageAsPromise(image: Image, path: string) {
  // return new Promise<{ id: string; url: string; ref: string }>(
  //   (resolve, reject) => {
  const imageId = createUniqueId();

  const fileArray = image.uri.split('/');
  const fileName = fileArray[fileArray.length - 1];
  const ref = `${path}/${imageId}_${fileName}`;
  const storageRef = firebase.storage().ref(ref);

  const metadata = {
    contentType: 'image/jpeg'
  };

  const { base64 } = image;
  return storageRef
    .putString(base64, 'base64', metadata)
    .then(snapshot => {
      console.log(snapshot);
      return snapshot.ref
        .getDownloadURL()
        .then(downloadURL => {
          return { id: imageId, url: downloadURL, ref };
        })
        .catch(error => {
          console.log(error);
          return false;
        });
    })
    .catch(error => {
      console.log(error);
      return false;
    });
}