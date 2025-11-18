// Utility function untuk mendapatkan admin yang sedang aktif berdasarkan jam
export const admins = [
  {
    name: "Admin 1",
    schedule: "07:00 - 13:00",
    phone: "628388613541",
    displayPhone: "0838-8613-541",
  },
  {
    name: "Admin 2",
    schedule: "13:00 - 21:00",
    phone: "6282294687911",
    displayPhone: "0822-9468-7911",
  },
  {
    name: "Admin 3",
    schedule: "21:00 - 07:00",
    phone: "62895612297912",
    displayPhone: "0895-6122-97912",
  },
];

export const getCurrentAdmin = () => {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 7 && hours < 13) return admins[0];
  if (hours >= 13 && hours < 21) return admins[1];
  if (hours >= 21 || hours < 7) return admins[2];
  return admins[0];
};

export const getWhatsAppLink = (message = "Bang,%20mau%20dianter%20ke%20...%20dong!") => {
  const admin = getCurrentAdmin();
  return `https://wa.me/${admin.phone}?text=${message}`;
};
