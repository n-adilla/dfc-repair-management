import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc
} from '@/firebase';

const INQUIRIES_COLLECTION = 'inquiries';

export async function createInquiry(payload) {
  const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), {
    ...payload,
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


