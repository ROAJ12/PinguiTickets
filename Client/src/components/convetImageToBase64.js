const convertImageToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const binaryString = reader.result;
      const base64String = btoa(binaryString);
      resolve(base64String);
    };
    reader.onerror = error => {
      reject(error);
    };
    reader.readAsBinaryString(file);
  });
};

export default convertImageToBase64;