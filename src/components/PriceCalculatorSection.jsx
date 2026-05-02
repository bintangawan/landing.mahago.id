import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { DEFAULT_ORDER_MESSAGE, getWhatsAppLink } from "../utils/adminHelper";

const CAMPUS_QUERY = "Kampus UINSU Tuntungan";
const CAMPUS_COORDS = { lat: 3.494206212068243, lng: 98.58842246724845 };
const BASE_KM = 3;
const BASE_FARE = 5000;
const EXTRA_PER_KM = 2000;
const EXTRA_STOP_FEE = 1000;
const LATE_CHARGE_FEE = 2000;
const RAIN_CHARGE_FEE = 1000;
const RAIN_PRECIPITATION_THRESHOLD = 2.0;
const DEFAULT_CENTER = CAMPUS_COORDS;
const MAP_PICK_LABEL = "Titik pilihan di peta";
const ROUTE_SERVICE_URL = "https://router.project-osrm.org/route/v1/driving";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);

  return null;
}

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click: (event) => {
      onSelect(event.latlng);
    },
  });

  return null;
}

const fetchGeocode = async (query) => {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "5");
  url.searchParams.set("q", query);

  const response = await fetch(url.toString(), {
    headers: {
      "Accept-Language": "id",
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data lokasi");
  }

  return response.json();
};

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID").format(Math.round(value));

const parseTimeToMinutes = (timeValue) => {
  if (!timeValue) return null;
  const [hours, minutes] = timeValue.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const fetchRoute = async (from, to) => {
  const url = new URL(
    `${ROUTE_SERVICE_URL}/${from.lng},${from.lat};${to.lng},${to.lat}`
  );
  url.searchParams.set("overview", "full");
  url.searchParams.set("geometries", "geojson");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Gagal mengambil rute");
  }

  const data = await response.json();
  if (!data.routes?.length) {
    throw new Error("Rute tidak ditemukan");
  }

  const route = data.routes[0];
  return {
    distanceKm: route.distance / 1000,
    line: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
  };
};

const isHeavyRainWeatherCode = (code) => {
  if (!Number.isFinite(code)) return false;
  return code === 65 || code === 82 || (code >= 95 && code <= 99);
};

const fetchWeather = async (coords) => {
  const url = new URL(WEATHER_API_URL);
  url.searchParams.set("latitude", coords.lat);
  url.searchParams.set("longitude", coords.lng);
  url.searchParams.set("current", "precipitation,weather_code");
  url.searchParams.set("timezone", "Asia/Jakarta");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Gagal mengambil data cuaca");
  }

  const data = await response.json();
  const precipitation = Number.parseFloat(data.current?.precipitation || 0);
  const weatherCode = Number.parseInt(data.current?.weather_code, 10);
  const isRaining =
    precipitation >= RAIN_PRECIPITATION_THRESHOLD ||
    isHeavyRainWeatherCode(weatherCode);

  return {
    isRaining,
    precipitation,
    weatherCode,
  };
};

const buildLocationResult = (result) => ({
  id: result.place_id,
  label: result.display_name,
  coords: {
    lat: Number.parseFloat(result.lat),
    lng: Number.parseFloat(result.lon),
  },
});

export default function PriceCalculatorSection({ onOrderMessageChange }) {
  const [serviceType, setServiceType] = useState("ride");
  const [mapMode, setMapMode] = useState("destination");
  const [currentCoords, setCurrentCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const [destinationQuery, setDestinationQuery] = useState("");
  const [destinationResults, setDestinationResults] = useState([]);
  const [destination, setDestination] = useState(null);
  const [destinationError, setDestinationError] = useState("");
  const [isDestinationSearching, setIsDestinationSearching] = useState(false);

  const [pickupQuery, setPickupQuery] = useState("");
  const [pickupResults, setPickupResults] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [pickupError, setPickupError] = useState("");
  const [isPickupSearching, setIsPickupSearching] = useState(false);

  const [orderNotes, setOrderNotes] = useState("");
  const [orderTime, setOrderTime] = useState(() => getCurrentTime());
  const [lateChargeStart, setLateChargeStart] = useState("23:00");

  const [distanceKmInput, setDistanceKmInput] = useState("");
  const [distanceMode, setDistanceMode] = useState("auto");
  const [routeLine, setRouteLine] = useState(null);
  const [routeDistanceKm, setRouteDistanceKm] = useState(null);
  const [routeError, setRouteError] = useState("");
  const [isRouting, setIsRouting] = useState(false);

  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [weatherDetails, setWeatherDetails] = useState(null);
  const [autoRain, setAutoRain] = useState(false);
  const [weatherUpdatedAt, setWeatherUpdatedAt] = useState(null);
  const [rainMode, setRainMode] = useState("auto");
  const [manualRain, setManualRain] = useState(false);

  useEffect(() => {
    if (serviceType === "ride") {
      setMapMode("destination");
    }
  }, [serviceType]);

  useEffect(() => {
    if (!destinationQuery.trim()) {
      setDestinationResults([]);
      setDestinationError("");
      return;
    }

    if (destination?.label === destinationQuery) {
      return;
    }

    const trimmedQuery = destinationQuery.trim();
    if (trimmedQuery.length < 3) {
      setDestinationResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsDestinationSearching(true);
      setDestinationError("");

      try {
        const results = await fetchGeocode(trimmedQuery);
        if (!results.length) {
          setDestinationError("Lokasi tidak ditemukan. Coba kata kunci lain.");
          setDestinationResults([]);
          return;
        }

        setDestinationResults(results.map(buildLocationResult));
      } catch {
        setDestinationError("Lokasi tidak ditemukan. Coba kata kunci lain.");
        setDestinationResults([]);
      } finally {
        setIsDestinationSearching(false);
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [destinationQuery, destination]);

  useEffect(() => {
    if (!pickupQuery.trim()) {
      setPickupResults([]);
      setPickupError("");
      return;
    }

    const trimmedQuery = pickupQuery.trim();
    if (trimmedQuery.length < 3) {
      setPickupResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsPickupSearching(true);
      setPickupError("");

      try {
        const results = await fetchGeocode(trimmedQuery);
        if (!results.length) {
          setPickupError("Lokasi tidak ditemukan. Coba kata kunci lain.");
          setPickupResults([]);
          return;
        }

        setPickupResults(results.map(buildLocationResult));
      } catch {
        setPickupError("Lokasi tidak ditemukan. Coba kata kunci lain.");
        setPickupResults([]);
      } finally {
        setIsPickupSearching(false);
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [pickupQuery]);

  const selectDestination = useCallback((coords, label = MAP_PICK_LABEL) => {
    setDestination({ id: label, label, coords });
    setDestinationQuery(label);
    setDestinationResults([]);
    setDestinationError("");
    setDistanceMode("auto");
  }, []);

  const addPickupPoint = useCallback((coords, label) => {
    setPickupPoints((prev) => {
      const nextIndex = prev.length + 1;
      const pointLabel = label || `Titik resto ${nextIndex}`;
      return [
        ...prev,
        { id: `${Date.now()}-${nextIndex}`, label: pointLabel, coords },
      ];
    });
    setPickupQuery("");
    setPickupResults([]);
    setPickupError("");
  }, []);

  const removePickupPoint = useCallback((id) => {
    setPickupPoints((prev) => prev.filter((point) => point.id !== id));
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setDestinationError("Browser tidak mendukung lokasi GPS.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setDestinationError("Gagal mengambil lokasi saat ini.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (!destination?.coords) {
      setRouteLine(null);
      setRouteDistanceKm(null);
      setRouteError("");
      return;
    }

    let isCancelled = false;

    const loadRoute = async () => {
      setIsRouting(true);
      setRouteError("");

      try {
        const route = await fetchRoute(CAMPUS_COORDS, destination.coords);
        if (isCancelled) return;
        setRouteLine(route.line);
        setRouteDistanceKm(route.distanceKm);
        setDistanceKmInput(route.distanceKm.toFixed(1));
        setDistanceMode("auto");
      } catch {
        if (isCancelled) return;
        setRouteLine(null);
        setRouteDistanceKm(null);
        setRouteError(
          "Rute tidak ditemukan. Geser titik tujuan atau isi jarak manual."
        );
      } finally {
        if (!isCancelled) {
          setIsRouting(false);
        }
      }
    };

    loadRoute();

    return () => {
      isCancelled = true;
    };
  }, [destination]);

  const requestWeather = useCallback(async () => {
    setIsWeatherLoading(true);
    setWeatherError("");

    try {
      const coords = currentCoords || CAMPUS_COORDS;
      const sourceLabel = currentCoords ? "Lokasi saya" : "Kampus";
      const result = await fetchWeather(coords);
      setAutoRain(result.isRaining);
      setWeatherDetails({
        ...result,
        sourceLabel,
        coords,
      });
      setWeatherUpdatedAt(new Date());
    } catch (error) {
      console.warn("Weather fetch failed", error);
      setWeatherError("Cuaca tidak tersedia. Bisa atur manual jika perlu.");
      setWeatherDetails(null);
    } finally {
      setIsWeatherLoading(false);
    }
  }, [currentCoords]);

  useEffect(() => {
    requestWeather();
  }, [requestWeather]);

  const distanceKm = useMemo(() => {
    const value = Number.parseFloat(distanceKmInput);
    if (!Number.isFinite(value) || value <= 0) return null;
    return value;
  }, [distanceKmInput]);

  const baseFare = useMemo(() => {
    if (!distanceKm) return null;
    const extraKm = Math.max(0, distanceKm - BASE_KM);
    const extraFare = Math.ceil(extraKm) * EXTRA_PER_KM;
    return BASE_FARE + extraFare;
  }, [distanceKm]);

  const extraStopCount =
    serviceType === "food" ? Math.max(0, pickupPoints.length - 1) : 0;
  const extraStopCharge = extraStopCount * EXTRA_STOP_FEE;

  const orderMinutes = parseTimeToMinutes(orderTime);
  const lateStartMinutes = parseTimeToMinutes(lateChargeStart);
  const isLateCharge =
    orderMinutes !== null &&
    lateStartMinutes !== null &&
    orderMinutes >= lateStartMinutes;

  const isRaining = rainMode === "manual" ? manualRain : autoRain;
  const rainCharge = isRaining ? RAIN_CHARGE_FEE : 0;
  const lateCharge = isLateCharge ? LATE_CHARGE_FEE : 0;

  const totalFare =
    baseFare !== null
      ? baseFare + extraStopCharge + rainCharge + lateCharge
      : null;

  const orderMessage = useMemo(() => {
    if (!destination && !distanceKm) return DEFAULT_ORDER_MESSAGE;

    const lines = [];
    const destinationLabel = destination?.label || destinationQuery || "...";

    lines.push(
      `Jenis layanan: ${serviceType === "food" ? "Pesan Makanan" : "Ojek"}`
    );
    lines.push(`Tujuan antar: ${destinationLabel}`);

    if (serviceType === "food") {
      if (pickupPoints.length) {
        lines.push("Titik resto:");
        pickupPoints.forEach((point, index) => {
          lines.push(
            `- ${index + 1}. ${point.label} (https://maps.google.com/?q=${point.coords.lat},${point.coords.lng})`
          );
        });
      } else {
        lines.push("Titik resto: belum dipilih");
      }
    }

    if (distanceKm) {
      lines.push(`Jarak rute dari kampus: ${distanceKm.toFixed(1)} km.`);
    }

    if (baseFare) {
      lines.push(`Tarif dasar: Rp ${formatRupiah(baseFare)}.`);
    }

    if (extraStopCharge > 0) {
      lines.push(
        `Charge titik resto tambahan: Rp ${formatRupiah(extraStopCharge)}.`
      );
    }

    if (lateCharge > 0) {
      lines.push(`Charge waktu: Rp ${formatRupiah(lateCharge)}.`);
    }

    if (rainCharge > 0) {
      lines.push(`Charge hujan: Rp ${formatRupiah(rainCharge)}.`);
    }

    if (totalFare !== null) {
      lines.push(`Total estimasi: Rp ${formatRupiah(totalFare)}.`);
    }

    if (orderNotes.trim()) {
      lines.push(`Catatan pesanan: ${orderNotes.trim()}`);
    }

    if (currentCoords) {
      lines.push(
        `Lokasi saya: https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}`
      );
    }

    if (destination?.coords) {
      lines.push(
        `Tujuan: https://maps.google.com/?q=${destination.coords.lat},${destination.coords.lng}`
      );
    }

    return lines.join("\n");
  }, [
    destination,
    destinationQuery,
    serviceType,
    pickupPoints,
    distanceKm,
    baseFare,
    extraStopCharge,
    lateCharge,
    rainCharge,
    totalFare,
    orderNotes,
    currentCoords,
  ]);

  useEffect(() => {
    if (typeof onOrderMessageChange === "function") {
      onOrderMessageChange(orderMessage);
    }
  }, [onOrderMessageChange, orderMessage]);

  const whatsappLink = useMemo(
    () => getWhatsAppLink(orderMessage),
    [orderMessage]
  );

  const mapPoints = [
    CAMPUS_COORDS,
    currentCoords,
    destination?.coords,
    ...pickupPoints.map((point) => point.coords),
  ].filter(Boolean);

  const destinationMarkerHandlers = useMemo(
    () => ({
      dragend: (event) => {
        const { lat, lng } = event.target.getLatLng();
        selectDestination({ lat, lng });
      },
    }),
    [selectDestination]
  );

  const mapActionLabel =
    serviceType === "food" && mapMode === "pickup"
      ? "Tambah titik resto"
      : "Set tujuan antar";

  return (
    <section
      id="tarif"
      className="py-12 sm:py-20 pb-28 sm:pb-20 bg-gradient-to-b from-white via-emerald-50/40 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
            Estimasi cepat
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Kalkulator Tarif <span className="text-emerald-600">MahaGo</span>
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            Dari kampus ke tujuan, instan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="order-2 lg:order-1 bg-white/80 border border-emerald-100 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur transition-transform duration-200 active:scale-[0.99]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Layanan
                </p>
                <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1 mt-2">
                  <button
                    type="button"
                    onClick={() => setServiceType("ride")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      serviceType === "ride"
                        ? "bg-green-600 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    Ojek
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceType("food")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      serviceType === "food"
                        ? "bg-green-600 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    Pesan Makanan
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lokasi Saya
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="bg-emerald-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition active:scale-[0.98]"
                  >
                    {isLocating ? "Mendeteksi..." : "Pakai GPS"}
                  </button>
                  <div className="flex-1 rounded-lg bg-white border border-gray-200 px-4 py-3 text-sm text-gray-600">
                    {currentCoords
                      ? `${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}`
                      : "Belum dipilih"}
                  </div>
                </div>
              </div>

              {serviceType === "food" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titik Resto
                  </label>
                  <input
                    type="text"
                    value={pickupQuery}
                    onChange={(event) => setPickupQuery(event.target.value)}
                    placeholder="Cari resto (min 3 huruf)"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {isPickupSearching && (
                    <p className="text-xs text-gray-500 mt-2">
                      Mencari...
                    </p>
                  )}
                  {pickupError && (
                    <p className="text-xs text-red-600 mt-2">{pickupError}</p>
                  )}
                  {pickupResults.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {pickupResults.map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onClick={() =>
                            addPickupPoint(result.coords, result.label)
                          }
                          className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 text-sm hover:border-green-500 hover:bg-green-50 transition"
                        >
                          {result.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {pickupPoints.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {pickupPoints.map((point, index) => (
                        <div
                          key={point.id}
                          className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {index + 1}. {point.label}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePickupPoint(point.id)}
                            className="text-xs font-semibold text-red-600 hover:text-red-700"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {serviceType === "food" ? "Tujuan Antar" : "Tujuan"}
                </label>
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(event) => setDestinationQuery(event.target.value)}
                  placeholder="Mau ke..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {isDestinationSearching && (
                  <p className="text-xs text-gray-500 mt-2">
                    Mencari...
                  </p>
                )}
                {destinationError && (
                  <p className="text-xs text-red-600 mt-2">
                    {destinationError}
                  </p>
                )}
                {destinationResults.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {destinationResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() =>
                          selectDestination(result.coords, result.label)
                        }
                        className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 text-sm hover:border-green-500 hover:bg-green-50 transition"
                      >
                        {result.label}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Min 3 huruf atau tap peta.
                </p>
                {routeError && (
                  <p className="text-xs text-amber-600 mt-2">{routeError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jarak (km)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={distanceKmInput}
                    onChange={(event) => {
                      setDistanceKmInput(event.target.value);
                      setDistanceMode("manual");
                    }}
                    placeholder="Terisi otomatis dari rute"
                    readOnly={distanceMode === "auto" && !!routeDistanceKm}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {distanceMode === "auto" && routeDistanceKm && (
                    <button
                      type="button"
                      onClick={() => {
                        setDistanceMode("manual");
                        setRouteDistanceKm(null);
                      }}
                      className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-100"
                    >
                      Manual
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Dari kampus via rute. 3 km pertama Rp 5.000, +Rp 2.000/km.
                </p>
                {isRouting && (
                  <p className="text-xs text-gray-500 mt-2">
                    Ambil rute...
                  </p>
                )}
              </div>

              <details className="rounded-2xl border border-gray-200 bg-white p-4">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-gray-900">
                    Pengaturan charge
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        isLateCharge
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      Waktu {isLateCharge ? "On" : "Off"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        isRaining
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      Hujan {isRaining ? "On" : "Off"}
                    </span>
                  </div>
                </summary>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Jam Order
                      </p>
                      <input
                        type="time"
                        value={orderTime}
                        onChange={(event) => setOrderTime(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Charge Mulai
                      </p>
                      <input
                        type="time"
                        value={lateChargeStart}
                        onChange={(event) =>
                          setLateChargeStart(event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Cuaca
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {isRaining ? "Hujan deras" : "Aman"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {weatherUpdatedAt
                            ? `Update ${weatherUpdatedAt.toLocaleTimeString(
                                "id-ID",
                                { hour: "2-digit", minute: "2-digit" }
                              )}`
                            : "Belum ada data"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={requestWeather}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {isWeatherLoading ? "Memuat..." : "Perbarui"}
                      </button>
                    </div>

                    {weatherDetails && (
                      <details className="mt-3 text-xs text-gray-500">
                        <summary className="cursor-pointer">Detail cuaca</summary>
                        <div className="mt-2 space-y-1">
                          <p>
                            Curah hujan: {weatherDetails.precipitation.toFixed(2)}
                            {" "}mm/jam
                          </p>
                          <p>
                            Kode cuaca: {Number.isFinite(weatherDetails.weatherCode)
                              ? weatherDetails.weatherCode
                              : "-"}
                          </p>
                          <p>
                            Charge hujan aktif jika &gt;= {RAIN_PRECIPITATION_THRESHOLD}
                            {" "}mm/jam atau kode hujan deras.
                          </p>
                        </div>
                      </details>
                    )}

                    {weatherError && (
                      <p className="text-xs text-amber-600 mt-2">
                        {weatherError}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={rainMode === "manual"}
                          onChange={(event) =>
                            setRainMode(event.target.checked ? "manual" : "auto")
                          }
                          className="h-4 w-4"
                        />
                        Manual
                      </label>
                      {rainMode === "manual" && (
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={manualRain}
                            onChange={(event) =>
                              setManualRain(event.target.checked)
                            }
                            className="h-4 w-4"
                          />
                          Hujan sekarang
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </details>

              {serviceType === "food" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catatan
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(event) => setOrderNotes(event.target.value)}
                    placeholder="Contoh: ayam geprek lvl 2, teh manis"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  ></textarea>
                </div>
              )}

              <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-emerald-700 font-semibold mb-2">
                  Ringkas
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <span>Tarif dasar</span>
                    <span className="font-semibold">
                      {baseFare ? `Rp ${formatRupiah(baseFare)}` : "-"}
                    </span>
                  </div>
                  {serviceType === "food" && (
                    <div className="flex items-center justify-between">
                      <span>
                        Tambahan titik resto ({extraStopCount}x)
                      </span>
                      <span className="font-semibold">
                        Rp {formatRupiah(extraStopCharge)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Charge waktu</span>
                    <span className="font-semibold">
                      {lateCharge > 0 ? `Rp ${formatRupiah(lateCharge)}` : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Charge hujan</span>
                    <span className="font-semibold">
                      {rainCharge > 0 ? `Rp ${formatRupiah(rainCharge)}` : "-"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 border-t border-emerald-100 pt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-emerald-700">
                    {totalFare !== null ? `Rp ${formatRupiah(totalFare)}` : "-"}
                  </span>
                </div>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg"
              >
                Lanjut ke WhatsApp
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2 bg-white/90 border border-emerald-100 rounded-3xl p-4 shadow-xl backdrop-blur transition-transform duration-200 active:scale-[0.99]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Peta
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  Tap untuk {mapActionLabel.toLowerCase()}.
                </p>
              </div>
              {serviceType === "food" && (
                <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setMapMode("destination")}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      mapMode === "destination"
                        ? "bg-emerald-600 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    Set Tujuan
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapMode("pickup")}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      mapMode === "pickup"
                        ? "bg-emerald-600 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    Tambah Resto
                  </button>
                </div>
              )}
            </div>

              <MapContainer
              center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
              zoom={14}
              className="h-[320px] sm:h-96 w-full rounded-2xl"
              scrollWheelZoom={false}
            >
              <MapClickHandler
                onSelect={(latlng) => {
                  if (serviceType === "food" && mapMode === "pickup") {
                    addPickupPoint({ lat: latlng.lat, lng: latlng.lng });
                  } else {
                    selectDestination({ lat: latlng.lat, lng: latlng.lng });
                  }
                }}
              />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[CAMPUS_COORDS.lat, CAMPUS_COORDS.lng]}>
                <Popup>{CAMPUS_QUERY}</Popup>
              </Marker>
              {currentCoords && (
                <Marker position={[currentCoords.lat, currentCoords.lng]}>
                  <Popup>Lokasi Saat Ini</Popup>
                </Marker>
              )}
              {destination?.coords && (
                <Marker
                  position={[destination.coords.lat, destination.coords.lng]}
                  draggable
                  eventHandlers={destinationMarkerHandlers}
                >
                  <Popup>{destination.label}</Popup>
                </Marker>
              )}
              {pickupPoints.map((point, index) => (
                <CircleMarker
                  key={point.id}
                  center={[point.coords.lat, point.coords.lng]}
                  radius={10}
                  pathOptions={{ color: "#2563eb", fillColor: "#2563eb" }}
                >
                  <Tooltip direction="top" offset={[0, -10]} permanent>
                    {index + 1}
                  </Tooltip>
                  <Popup>{point.label}</Popup>
                </CircleMarker>
              ))}
              {routeLine && <Polyline positions={routeLine} color="#16a34a" />}
              {!routeLine && destination?.coords && (
                <Polyline
                  positions={[
                    [CAMPUS_COORDS.lat, CAMPUS_COORDS.lng],
                    [destination.coords.lat, destination.coords.lng],
                  ]}
                  color="#16a34a"
                  dashArray="6 10"
                />
              )}
              {mapPoints.length > 0 && <FitBounds points={mapPoints} />}
            </MapContainer>
            <div className="mt-4 text-xs text-gray-500">
              Tujuan dan resto bisa disetel dari peta atau saran lokasi.
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 lg:hidden pointer-events-none">
          <div className="pointer-events-auto mx-auto max-w-7xl rounded-2xl border border-emerald-200 bg-white/95 shadow-2xl backdrop-blur px-4 py-3 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Total
              </p>
              <p className="truncate text-lg font-bold text-emerald-700">
                {totalFare !== null ? `Rp ${formatRupiah(totalFare)}` : "-"}
              </p>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition active:scale-[0.98]"
            >
              Chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
