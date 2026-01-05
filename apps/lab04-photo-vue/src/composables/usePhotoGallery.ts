import { ref, onMounted } from "vue";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { isPlatform } from "@ionic/vue";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

const PHOTO_STORAGE = "photos";

export function usePhotoGallery() {
  const photos = ref<UserPhoto[]>([]);

  const cachePhotos = async () => {
    await Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });
  };

  const savePicture = async (
    photo: Photo,
    fileName: string
  ): Promise<UserPhoto> => {
    let base64Data: string;

    if (isPlatform("hybrid")) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = file.data as string;
    } else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = (await convertBlobToBase64(blob)) as string;
    }

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (isPlatform("hybrid")) {
      return {
        filepath: savedFile.uri,
        webviewPath: photo.webPath,
      };
    }

    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  };

  const takePhoto = async () => {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90,
    });

    const fileName = `${new Date().getTime()}.jpeg`;
    const savedImageFile = await savePicture(capturedPhoto, fileName);

    photos.value = [savedImageFile, ...photos.value];
    await cachePhotos();
  };

  const loadSaved = async () => {
    const { value } = await Preferences.get({ key: PHOTO_STORAGE });
    const savedPhotos = (value ? JSON.parse(value) : []) as UserPhoto[];

    const converted: UserPhoto[] = [];

    for (const p of savedPhotos) {
      try {
        // บนเว็บและมือถือ: อ่านไฟล์จาก Filesystem แล้วทำเป็น data URL
        const file = await Filesystem.readFile({
          path: p.filepath,
          directory: Directory.Data,
        });

        converted.push({
          filepath: p.filepath,
          webviewPath: `data:image/jpeg;base64,${file.data}`,
        });
      } catch (e) {
        // กันกรณีไฟล์ถูกลบหรืออ่านไม่ได้
        console.warn("Cannot read photo:", p.filepath, e);
      }
    }

    photos.value = converted;
  };

  onMounted(loadSaved);

  return {
    photos,
    takePhoto,
    loadSaved,
  };
}

const convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
