import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

const storage = getStorage();
const auth = getAuth();

export const uploadFile = async (file) => {
  try {
    const userId = useSelector((state) => state.auth.userId);
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${userId}/media/${filename}`);

    let contentType;

    if (file.type.startsWith('image/')) {
      contentType = file.type;
    } else if (file.type.startsWith('video/')) {
      contentType = 'video/mp4';
    } else {
      throw new Error('Unsupported file type');
    }

    await uploadBytes(storageRef, file, {
      contentType,
    });

    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
