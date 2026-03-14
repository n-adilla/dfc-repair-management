import {
  db,
  storage,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  storageRef,
  uploadBytes,
  getDownloadURL,
  doc,
  updateDoc
} from '@/firebase';

const INQUIRIES_COLLECTION = 'inquiries';

export async function createInquiry(payload, files) {
  const uploadedFiles = [];

  if (files && files.length) {
    for (const file of files) {
      const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const ref = storageRef(
        storage,
        `inquiries/${uniqueId}-${file.name}`
      );
      await uploadBytes(ref, file);
      const url = await getDownloadURL(ref);
      uploadedFiles.push({ name: file.name, url });
    }
  }

  const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), {
    ...payload,
    files: uploadedFiles,
    status: 'new',
    createdAt: new Date()
  });

  return docRef.id;
}

export async function getInquiries() {
  const q = query(
    collection(db, INQUIRIES_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateInquiryStatus(id, status) {
  const ref = doc(db, INQUIRIES_COLLECTION, id);
  await updateDoc(ref, { status, updatedAt: new Date() });
}


