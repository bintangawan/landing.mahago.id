// Utility function untuk mendapatkan admin yang sedang aktif berdasarkan jam
export const admins = [
  {
    name: "Admin 1",
    schedule: "07:00 - 13:00",
    phone: "6282279019789",
    displayPhone: "0822-7901-9789",
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

export const DEFAULT_ORDER_MESSAGE = "Bang, mau ke ... dong!";

export const buildWhatsAppLink = (
  phone,
  message = DEFAULT_ORDER_MESSAGE
) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

export const getWhatsAppLink = (message = DEFAULT_ORDER_MESSAGE) => {
  const admin = getCurrentAdmin();
  return buildWhatsAppLink(admin.phone, message);
};
