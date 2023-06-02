import React from "react";
import storage from "../../firebase";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadedComponent = () => {
  const [img, setImg] = useState(null);

  const uploadImg = async () => {
    try {
      const imageRef = ref(storage, `images/${img.name}`);
      await uploadBytes(imageRef, img);
      const imageURL = await getDownloadURL(imageRef);
      console.log("URL của hình ảnh:", imageURL);
    } catch (error) {
      console.error("Lỗi khi tải lên hình ảnh và lấy URL:", error);
    }
  };
  console.log(img)

  return (
    <div>
      UploadedComponent
      <input type="file" onChange={(e) => setImg(e.target.files[0])} />
      <button onClick={uploadImg}>Uploaded</button>
    </div>
  );
};

export default UploadedComponent;
