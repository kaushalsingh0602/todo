export const formatShort = (timestamp: string | number | Date | undefined) => {
  try {
    if (!timestamp) return '';
    // Firestore Timestamp has toDate()
    // To avoid importing types here, we detect
    const maybeDate = (timestamp as any).toDate ? (timestamp as any).toDate() : new Date(timestamp as any);
    return maybeDate.toLocaleString();
  } catch (e) {
    return String(timestamp);
  }
};
