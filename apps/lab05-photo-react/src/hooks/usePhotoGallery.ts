import { useEffect, useState } from "react";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";

export interface UserPhoto {
  filepath: string; // ชื่อไฟล์ที่เราเซฟ
  webviewPath?: string; // path สำหรับแสดงในเว็บ/แอป
}

const PHOTO_STORAGE_KEY = "photos";

function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

async function savePicture(photo: Photo, fileName: string): Promise<UserPhoto> {
  // กรณีเว็บจะได้ webPath เป็น url ที่เปิดได้
  const response = await fetch(photo.webPath!);
  const blob = await response.blob();
  const base64Data = await convertBlobToBase64(blob);

  // เซฟลง filesystem (Data directory)
  await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Data,
  });

  return {
    filepath: fileName,
    webviewPath: photo.webPath, // เอาไว้แสดงทันที
  };
}

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  const loadSaved = async () => {
    const { value } = await Preferences.get({ key: PHOTO_STORAGE_KEY });
    const savedPhotos: UserPhoto[] = value ? JSON.parse(value) : [];

    // โหลดไฟล์จาก filesystem ให้เป็น base64 เพื่อแสดงในหน้า
    for (const p of savedPhotos) {
      const file = await Filesystem.readFile({
        path: p.filepath,
        directory: Directory.Data,
      });
      p.webviewPath = `data:image/jpeg;base64,${file.data}`;
    }

    setPhotos(savedPhotos);
  };

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt, // ให้เลือก กล้อง/รูปในเครื่อง
      quality: 90,
    });

    const fileName = `${new Date().getTime()}.jpeg`;
    const savedFileImage = await savePicture(photo, fileName);

    const newPhotos = [savedFileImage, ...photos];
    setPhotos(newPhotos);

    await Preferences.set({
      key: PHOTO_STORAGE_KEY,
      value: JSON.stringify(newPhotos.map((p) => ({ filepath: p.filepath }))),
    });
  };

  useEffect(() => {
    loadSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    photos,
    takePhoto,
    loadSaved,
  };
}
