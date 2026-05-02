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

export default function PriceCalculatorSection({ onOrderMessageChange }) {
  const [serviceType, setServiceType] = useState("ride");
  const [currentCoords, setCurrentCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [destination, setDestination] = useState(null);
  const [destinationQuery, setDestinationQuery] = useState("");
  const [destinationResults, setDestinationResults] = useState([]);
  const [isDestinationSearching, setIsDestinationSearching] = useState(false);
  const [destinationError, setDestinationError] = useState("");
  const [pickupPoints, setPickupPoints] = useState([]);
  const [pickupQuery, setPickupQuery] = useState("");
  const [pickupResults, setPickupResults] = useState([]);
  const [isPickupSearching, setIsPickupSearching] = useState(false);
  const [pickupError, setPickupError] = useState("");
  const [routeLine, setRouteLine] = useState(null);
  const [routeDistanceKm, setRouteDistanceKm] = useState(null);
  const [distanceKmInput, setDistanceKmInput] = useState("");
  const [distanceMode, setDistanceMode] = useState("auto");
  const [isRouting, setIsRouting] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [orderTime, setOrderTime] = useState(getCurrentTime());
  const [autoRain, setAutoRain] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [weatherDetails, setWeatherDetails] = useState(null);
  const [weatherUpdatedAt, setWeatherUpdatedAt] = useState(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [mapMode, setMapMode] = useState("destination");

  const isLateCharge = useMemo(() => {
    const timeMinutes = parseTimeToMinutes(orderTime);
    return timeMinutes !== null && timeMinutes >= 23 * 60;
  }, [orderTime]);

  const isRaining = autoRain;

  const distanceKm = useMemo(() => {
    if (distanceMode === "auto" && routeDistanceKm) {
      return routeDistanceKm;
    }
    return distanceKmInput ? Number.parseFloat(distanceKmInput) : null;
  }, [distanceMode, routeDistanceKm, distanceKmInput]);

  const baseFare = useMemo(() => {
    if (!distanceKm || distanceKm < 0) return null;
    if (distanceKm <= BASE_KM) return BASE_FARE;
    const extraKm = distanceKm - BASE_KM;
    return BASE_FARE + Math.ceil(extraKm) * EXTRA_PER_KM;
  }, [distanceKm]);

  const extraStopCount = Math.max(0, pickupPoints.length - 1);
  const extraStopCharge = extraStopCount * EXTRA_STOP_FEE;

  const lateCharge = isLateCharge ? LATE_CHARGE_FEE : 0;

  const rainCharge = isRaining ? RAIN_CHARGE_FEE : 0;

  const totalFare = useMemo(() => {
    if (baseFare === null) return null;
    return baseFare + extraStopCharge + lateCharge + rainCharge;
  }, [baseFare, extraStopCharge, lateCharge, rainCharge]);

  useEffect(() => {
    if (!destinationQuery || destinationQuery.length < 3) {
      setDestinationResults([]);
      setDestinationError("");
      return;
    }

    let isCancelled = false;
    setIsDestinationSearching(true);
    setDestinationError("");

    const timeoutId = setTimeout(async () => {
      try {
        const results = await fetchGeocode(destinationQuery);
        if (isCancelled) return;

        setDestinationResults(
          results.map((result, index) => ({
            id: index,
            label: result.display_name,
            coords: { lat: Number.parseFloat(result.lat), lng: Number.parseFloat(result.lon) },
          }))
        );
      } catch (error) {
        if (!isCancelled) {
          setDestinationError("Lokasi tidak ditemukan.");
        }
      } finally {
        if (!isCancelled) setIsDestinationSearching(false);
      }
    }, 450);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [destinationQuery]);

  const selectDestination = useCallback((coords, label = null) => {
    setDestination({ coords, label: label || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` });
    setDestinationQuery("");
    setDestinationResults([]);
    setDestinationError("");
  }, []);

  useEffect(() => {
    if (!pickupQuery || pickupQuery.length < 3) {
      setPickupResults([]);
      setPickupError("");
      return;
    }

    let isCancelled = false;
    setIsPickupSearching(true);
    setPickupError("");

    const timeoutId = setTimeout(async () => {
      try {
        const results = await fetchGeocode(pickupQuery);
        if (isCancelled) return;

        setPickupResults(
          results.map((result, index) => ({
            id: index,
            label: result.display_name,
            coords: { lat: Number.parseFloat(result.lat), lng: Number.parseFloat(result.lon) },
          }))
        );
      } catch (error) {
        if (!isCancelled) {
          setPickupError("Lokasi tidak ditemukan.");
        }
      } finally {
        if (!isCancelled) setIsPickupSearching(false);
      }
    }, 450);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [pickupQuery]);

  const addPickupPoint = useCallback((coords, label = null) => {
    const id = `${Date.now()}-${Math.random()}`;
    setPickupPoints((prev) => [
      ...prev,
      {
        id,
        coords,
        label: label || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
      },
    ]);
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

  useEffect(() => {
    setMapMode(serviceType === "food" ? "pickup" : "destination");

    if (serviceType === "food") {
      setDestination(null);
      setDestinationQuery("");
      setDestinationResults([]);
      setRouteLine(null);
      setRouteDistanceKm(null);
      setDistanceKmInput("");
      setDistanceMode("auto");
      setRouteError("");
      return;
    }

    setPickupPoints([]);
    setPickupQuery("");
    setPickupResults([]);
    setPickupError("");
    setOrderNotes("");
  }, [serviceType]);

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

  const orderMessage = useMemo(() => {
    const lines = [];

    if (serviceType === "ride") {
      lines.push("Ojek");
    } else if (serviceType === "food") {
      lines.push("Pesan Makanan");
    }

    if (currentCoords) {
      lines.push(
        `Dari: https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}`
      );
    } else {
      lines.push(
        `Dari: Kampus UINSU Tuntungan (https://maps.google.com/?q=${CAMPUS_COORDS.lat},${CAMPUS_COORDS.lng})`
      );
    }

    if (serviceType === "food") {
      if (pickupPoints.length > 0) {
        lines.push("Titik Resto:");
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

    lines.push(`Waktu booking: ${orderTime}.`);

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

  return (
    <section
      id="tarif"
      className="py-12 sm:py-20 pb-32 bg-gradient-to-b from-white via-emerald-50/40 to-white"
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

        {/* Full-Width Map Container */}
        <div className="bg-white/90 border border-emerald-100 rounded-3xl p-4 shadow-xl backdrop-blur mb-8">
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
            className="h-96 sm:h-[450px] w-full rounded-2xl"
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

        {/* Collapsible Form Panels */}
        <div className="space-y-3">
          {/* Service & Location Panel */}
          <details className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 open:shadow-lg open:border-emerald-200">
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none font-semibold text-gray-900 hover:text-emerald-600 transition">
              <span className="text-sm">📍 Lokasi & Layanan</span>
              <span className="transition group-open:rotate-180">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </summary>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Layanan
                </label>
                <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setServiceType("ride")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition active:scale-95 ${
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
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition active:scale-95 ${
                      serviceType === "food"
                        ? "bg-green-600 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    Pesan Makanan
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lokasi Saya
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50 active:scale-95"
                >
                  {isLocating ? "Mengambil lokasi..." : "📍 Ambil Lokasi GPS"}
                </button>
                {currentCoords && (
                  <p className="text-xs text-gray-500 mt-2">
                    {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </details>

          {/* Destination Panel */}
          <details className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 open:shadow-lg open:border-emerald-200">
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none font-semibold text-gray-900 hover:text-emerald-600 transition">
              <span className="text-sm">
                🎯 Tujuan {destination?.label && `(${destination.label})`}
              </span>
              <span className="transition group-open:rotate-180">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </summary>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tujuan
                </label>
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(event) => setDestinationQuery(event.target.value)}
                  placeholder="Cari tujuan..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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
                        className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 text-sm hover:border-green-500 hover:bg-green-50 transition active:scale-95"
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                  {distanceMode === "auto" && routeDistanceKm && (
                    <button
                      type="button"
                      onClick={() => {
                        setDistanceMode("manual");
                        setRouteDistanceKm(null);
                      }}
                      className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-100 transition active:scale-95"
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
            </div>
          </details>

          {/* Food Pickups Panel */}
          {serviceType === "food" && (
            <details className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 open:shadow-lg open:border-emerald-200">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none font-semibold text-gray-900 hover:text-emerald-600 transition">
                <span className="text-sm">
                  🍜 Resto {pickupPoints.length > 0 && `(${pickupPoints.length})`}
                </span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              </summary>

              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  value={pickupQuery}
                  onChange={(event) => setPickupQuery(event.target.value)}
                  placeholder="Cari resto..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                {isPickupSearching && (
                  <p className="text-xs text-gray-500">
                    Mencari...
                  </p>
                )}
                {pickupError && (
                  <p className="text-xs text-red-600">{pickupError}</p>
                )}
                {pickupResults.length > 0 && (
                  <div className="space-y-2">
                    {pickupResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() =>
                          addPickupPoint(result.coords, result.label)
                        }
                        className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 text-sm hover:border-green-500 hover:bg-green-50 transition active:scale-95"
                      >
                        {result.label}
                      </button>
                    ))}
                  </div>
                )}
                {pickupPoints.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    {pickupPoints.map((point, index) => (
                      <div
                        key={point.id}
                        className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">
                            {index + 1}. {point.label}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePickupPoint(point.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Settings Panel */}
          <details className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 open:shadow-lg open:border-emerald-200">
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none font-semibold text-gray-900 hover:text-emerald-600 transition">
              <span className="text-sm">⚙️ Pengaturan Charge</span>
              <span className="transition group-open:rotate-180">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </summary>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Waktu Booking
                  </label>
                  <input
                    type="time"
                    value={orderTime}
                    onChange={(event) => setOrderTime(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Charge Rp 2.000 kalau booking di jam &gt;= 23:00.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cuaca
                  </label>
                  <button
                    type="button"
                    onClick={requestWeather}
                    disabled={isWeatherLoading}
                    className="w-full rounded-lg bg-blue-50 border border-blue-300 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition disabled:opacity-50 active:scale-95"
                  >
                    {isWeatherLoading ? "Ambil cuaca..." : "🌡️ Ambil Cuaca"}
                  </button>
                  {weatherDetails && (
                    <p className="text-xs text-gray-500 mt-2">
                      {weatherDetails.sourceLabel}: {weatherDetails.precipitation}mm, kode {weatherDetails.weatherCode}
                    </p>
                  )}
                </div>
              </div>

              {weatherError && (
                <p className="text-xs text-amber-600">{weatherError}</p>
              )}

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLateCharge}
                    disabled
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Charge Waktu (Rp 2.000)
                  </span>
                  <span
                    className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold ${
                      isLateCharge
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isLateCharge ? "On" : "Off"}
                  </span>
                </label>

                {weatherDetails && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRaining}
                      disabled
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Charge Hujan (Rp 1.000)
                    </span>
                    <span
                      className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold ${
                        isRaining
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isRaining ? "On" : "Off"}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </details>

          {/* Notes Panel */}
          {serviceType === "food" && (
            <details className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 open:shadow-lg open:border-emerald-200">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none font-semibold text-gray-900 hover:text-emerald-600 transition">
                <span className="text-sm">📝 Catatan</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              </summary>

              <div className="mt-4">
                <textarea
                  value={orderNotes}
                  onChange={(event) => setOrderNotes(event.target.value)}
                  placeholder="Contoh: ayam geprek lvl 2, teh manis"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  rows={3}
                ></textarea>
              </div>
            </details>
          )}

          {/* Summary Panel */}
          <details open className="group rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-md transition-all duration-300 open:shadow-lg">
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none font-semibold text-gray-900 hover:text-emerald-600 transition">
              <span className="text-sm">💰 Ringkas Harga</span>
              <span className="transition group-open:rotate-180">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </summary>

            <div className="mt-4 space-y-3 text-sm text-gray-700">
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
              <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total Estimasi</span>
                <span className="text-2xl font-bold text-emerald-700">
                  {totalFare !== null ? `Rp ${formatRupiah(totalFare)}` : "-"}
                </span>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 px-4 py-3 pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-7xl rounded-2xl border border-emerald-200 bg-white/95 shadow-2xl backdrop-blur flex items-center gap-3 p-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
              Total Estimasi
            </p>
            <p className="text-xl font-bold text-emerald-700">
              {totalFare !== null ? `Rp ${formatRupiah(totalFare)}` : "-"}
            </p>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-5 py-3 text-sm font-semibold shadow-lg transition active:scale-[0.95] hover:bg-emerald-700 whitespace-nowrap"
          >
            Lanjut ke WA
          </a>
        </div>
      </div>
    </section>
  );
}
