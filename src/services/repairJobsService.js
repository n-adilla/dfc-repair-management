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

const REPAIRS_COLLECTION = 'repairJobs';

export async function createJob(payload) {
  const docRef = await addDoc(collection(db, REPAIRS_COLLECTION), {
    ...payload,
    createdAt: new Date()
  });

  return docRef.id;
}

export async function listRepairJobs() {
  const q = query(
    collection(db, REPAIRS_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateJobStatus(jobId, status) {
  const jobRef = doc(db, REPAIRS_COLLECTION, jobId);
  await updateDoc(jobRef, {
    status,
    updatedAt: new Date()
  });
}

export async function updateJob(jobId, data) {
  const jobRef = doc(db, REPAIRS_COLLECTION, jobId);
  await updateDoc(jobRef, {
    ...data,
    updatedAt: new Date()
  });
}



