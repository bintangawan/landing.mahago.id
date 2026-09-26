import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  BowlFood,
  CaretDown,
  CloudRain,
  Crosshair,
  FlagCheckered,
  GearSix,
  MapPin,
  MapTrifold,
  Moon,
  Moped,
  NotePencil,
  Receipt,
  Storefront,
  Calculator,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import { DEFAULT_ORDER_MESSAGE, getWhatsAppLink } from "../utils/adminHelper";
import SectionHeading, { Highlight } from "./neo/SectionHeading";
import { Sparkle, XMark } from "./neo/Decor";

const CAMPUS_QUERY = "Kampus UINSU Tuntungan";
const CAMPUS_COORDS = { lat: 3.494206212068243, lng: 98.58842246724845 };
const BASE_KM = 3;
const BASE_FARE = 5000;
const EXTRA_PER_KM = 2000;
const EXTRA_STOP_FEE = 1000;
const LATE_CHARGE_FEE = 2000;
const LATE_CHARGE_START_MINUTES = 23 * 60;
const LATE_CHARGE_END_MINUTES = 6 * 60;
const RAIN_CHARGE_FEE = 2000;
const RAIN_PRECIPITATION_THRESHOLD = 2.0;
const DEFAULT_CENTER = CAMPUS_COORDS;
const MAP_PICK_LABEL = "Titik pilihan di peta";
const ROUTE_SERVICE_URL = "https://router.project-osrm.org/route/v1/driving";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

const INK = "#0f1720";
const ROUTE_COLOR = "#0f7846";
const PICKUP_COLOR = "#4f46e5";

// Penanda peta berupa label stiker (lihat .neo-pin di index.css)
const makePin = (label, background, color = INK) =>
  L.divIcon({
    className: "neo-pin",
    html: `<span style="background:${background};color:${color}">${label}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -40],
  });

const CAMPUS_PIN = makePin("Kampus", "#0f7846", "#ebffde");
const CURRENT_PIN = makePin("Kamu", "#00b3a6");
const DESTINATION_PIN = makePin("Tujuan", "#ffd166");

function Panel({ icon: Icon, title, tile, defaultOpen = false, children }) {
  return (
    <details open={defaultOpen} className="group neo-card bg-white">
      <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-4 py-3 font-bold text-mg-ink [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3 min-w-0">
          <span
            className={`grid place-items-center w-9 h-9 shrink-0 border-2 border-mg-ink rounded-neo ${tile}`}
          >
            <Icon size={20} aria-hidden="true" />
          </span>
          <span className="text-sm sm:text-base truncate">{title}</span>
        </span>
        <CaretDown
          size={18}
          className="shrink-0 transition group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t-2 border-mg-ink p-4 space-y-4">{children}</div>
    </details>
  );
}

function SegmentedToggle({ label, options, value, onChange, size = "md" }) {
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex border-2 border-mg-ink rounded-neo shadow-neo-sm bg-white overflow-hidden"
    >
      {options.map(({ value: optionValue, label: optionLabel, icon: Icon }) => {
        const active = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(optionValue)}
            className={`inline-flex items-center gap-2 font-bold transition not-first:border-l-2 not-first:border-mg-ink ${pad} ${
              active
                ? "bg-mg-green-deep text-mg-cream"
                : "text-mg-ink hover:bg-mg-sun"
            }`}
          >
            {Icon && <Icon size={16} aria-hidden="true" />}
            {optionLabel}
          </button>
        );
      })}
    </div>
  );
}

function ChargeRow({ icon: Icon, label, active }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={20} className="text-mg-ink" aria-hidden="true" />
      <span className="text-sm font-semibold text-mg-ink">{label}</span>
      <span
        className={`ml-auto border-2 border-mg-ink rounded-neo px-2 py-0.5 text-xs font-bold ${
          active ? "bg-mg-sun text-mg-ink" : "bg-white text-mg-ink/60"
        }`}
      >
        {active ? "On" : "Off"}
      </span>
    </div>
  );
}

const labelClass = "block text-sm font-bold text-mg-ink mb-2";
const hintClass = "text-xs text-mg-ink/70 mt-2";
const errorClass = "text-xs font-semibold text-mg-red mt-2";
const resultButtonClass =
  "w-full text-left bg-white border-2 border-mg-ink rounded-neo p-3 text-sm transition hover:bg-mg-sun hover:shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5";

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
    if (timeMinutes === null) return false;
    // Rentang malam melewati tengah malam: 23:00 sampai sebelum 06:00.
    return (
      timeMinutes >= LATE_CHARGE_START_MINUTES ||
      timeMinutes < LATE_CHARGE_END_MINUTES
    );
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
      } catch {
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
      } catch {
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
      setWeatherError(
        "Cuaca tidak tersedia. Charge hujan akan dikonfirmasi admin saat order."
      );
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
    orderTime,
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

  // Bar total di bawah layar baru muncul saat section tarif terlihat
  // atau setelah ada hasil hitungan, supaya tidak tampil "-" di hero.
  const sectionRef = useRef(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsSectionVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showStickyBar = isSectionVisible || totalFare !== null;
  const totalLabel =
    totalFare !== null ? `Rp ${formatRupiah(totalFare)}` : "-";

  return (
    <section
      id="tarif"
      ref={sectionRef}
      className="relative overflow-hidden bg-mg-cream bg-neo-dots py-16 sm:py-24 pb-32 sm:pb-36"
    >
      <Sparkle className="absolute top-14 right-[10%] w-10" />
      <XMark className="absolute top-24 left-[6%] w-7 hidden md:block" color="#0f8c3c" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Estimasi cepat"
          icon={Calculator}
          title={
            <>
              Kalkulator Tarif <Highlight tone="green">MahaGo</Highlight>
            </>
          }
          subtitle="Dari kampus ke tujuan, instan."
        />

        <div className="grid gap-6 lg:grid-cols-5 items-start">
          {/* Peta */}
          <div className="neo-card bg-white p-3 sm:p-4 lg:col-span-3 lg:sticky lg:top-24">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-9 h-9 bg-mg-teal text-mg-ink border-2 border-mg-ink rounded-neo">
                  <MapTrifold size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-mg-ink/70">
                    Peta
                  </p>
                  <p className="text-sm font-bold text-mg-ink">
                    Tap untuk {mapActionLabel.toLowerCase()}.
                  </p>
                </div>
              </div>
              {serviceType === "food" && (
                <SegmentedToggle
                  label="Mode peta"
                  size="sm"
                  value={mapMode}
                  onChange={setMapMode}
                  options={[
                    { value: "destination", label: "Set Tujuan" },
                    { value: "pickup", label: "Tambah Resto" },
                  ]}
                />
              )}
            </div>

            <div className="border-2 border-mg-ink rounded-neo overflow-hidden">
              <MapContainer
                center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
                zoom={14}
                className="h-80 sm:h-[450px] w-full"
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
                <Marker
                  position={[CAMPUS_COORDS.lat, CAMPUS_COORDS.lng]}
                  icon={CAMPUS_PIN}
                >
                  <Popup>{CAMPUS_QUERY}</Popup>
                </Marker>
                {currentCoords && (
                  <Marker
                    position={[currentCoords.lat, currentCoords.lng]}
                    icon={CURRENT_PIN}
                  >
                    <Popup>Lokasi Saat Ini</Popup>
                  </Marker>
                )}
                {destination?.coords && (
                  <Marker
                    position={[destination.coords.lat, destination.coords.lng]}
                    icon={DESTINATION_PIN}
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
                    pathOptions={{
                      color: INK,
                      weight: 2,
                      fillColor: PICKUP_COLOR,
                      fillOpacity: 1,
                    }}
                  >
                    <Tooltip
                      direction="top"
                      offset={[0, -10]}
                      permanent
                      className="neo-tooltip"
                    >
                      {index + 1}
                    </Tooltip>
                    <Popup>{point.label}</Popup>
                  </CircleMarker>
                ))}
                {routeLine && (
                  <>
                    <Polyline positions={routeLine} color={INK} weight={8} />
                    <Polyline positions={routeLine} color={ROUTE_COLOR} weight={5} />
                  </>
                )}
                {!routeLine && destination?.coords && (
                  <Polyline
                    positions={[
                      [CAMPUS_COORDS.lat, CAMPUS_COORDS.lng],
                      [destination.coords.lat, destination.coords.lng],
                    ]}
                    color={ROUTE_COLOR}
                    weight={4}
                    dashArray="6 10"
                  />
                )}
                {mapPoints.length > 0 && <FitBounds points={mapPoints} />}
              </MapContainer>
            </div>
            <p className="mt-3 text-xs text-mg-ink/70">
              Tujuan dan resto bisa disetel dari peta atau saran lokasi.
            </p>
          </div>

          {/* Panel form */}
          <div className="space-y-4 lg:col-span-2">
            <Panel
              icon={MapPin}
              title="Lokasi & Layanan"
              tile="bg-mg-green text-mg-cream"
              defaultOpen
            >
              <div>
                <p className={labelClass}>Layanan</p>
                <SegmentedToggle
                  label="Jenis layanan"
                  value={serviceType}
                  onChange={setServiceType}
                  options={[
                    { value: "ride", label: "Ojek", icon: Moped },
                    { value: "food", label: "Pesan Makanan", icon: BowlFood },
                  ]}
                />
              </div>

              <div>
                <p className={labelClass}>Lokasi Saya</p>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="neo-btn w-full bg-mg-teal text-mg-ink px-4 py-3 text-sm"
                >
                  <Crosshair size={18} aria-hidden="true" />
                  {isLocating ? "Mengambil lokasi..." : "Ambil Lokasi GPS"}
                </button>
                {currentCoords && (
                  <p className={hintClass}>
                    {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </Panel>

            <Panel
              icon={FlagCheckered}
              title={`Tujuan${destination?.label ? ` (${destination.label})` : ""}`}
              tile="bg-mg-sun text-mg-ink"
            >
              <div>
                <label htmlFor="destination-search" className={labelClass}>
                  Tujuan
                </label>
                <input
                  id="destination-search"
                  type="text"
                  value={destinationQuery}
                  onChange={(event) => setDestinationQuery(event.target.value)}
                  placeholder="Cari tujuan..."
                  className="neo-input"
                />
                {isDestinationSearching && <p className={hintClass}>Mencari...</p>}
                {destinationError && (
                  <p className={errorClass}>{destinationError}</p>
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
                        className={resultButtonClass}
                      >
                        {result.label}
                      </button>
                    ))}
                  </div>
                )}
                <p className={hintClass}>Min 3 huruf atau tap peta.</p>
                {routeError && <p className={errorClass}>{routeError}</p>}
              </div>

              <div>
                <label htmlFor="distance-km" className={labelClass}>
                  Jarak (km)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="distance-km"
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
                    className="neo-input"
                  />
                  {distanceMode === "auto" && routeDistanceKm && (
                    <button
                      type="button"
                      onClick={() => {
                        setDistanceMode("manual");
                        setRouteDistanceKm(null);
                      }}
                      className="neo-btn bg-white text-mg-ink px-4 py-3 text-sm"
                    >
                      Manual
                    </button>
                  )}
                </div>
                <p className={hintClass}>
                  Dari kampus via rute. {BASE_KM} km pertama Rp{" "}
                  {formatRupiah(BASE_FARE)}, +Rp {formatRupiah(EXTRA_PER_KM)}/km.
                </p>
                {isRouting && <p className={hintClass}>Ambil rute...</p>}
              </div>
            </Panel>

            {serviceType === "food" && (
              <Panel
                icon={Storefront}
                title={`Resto${pickupPoints.length > 0 ? ` (${pickupPoints.length})` : ""}`}
                tile="bg-mg-indigo text-white"
              >
                <label htmlFor="pickup-search" className="sr-only">
                  Cari resto
                </label>
                <input
                  id="pickup-search"
                  type="text"
                  value={pickupQuery}
                  onChange={(event) => setPickupQuery(event.target.value)}
                  placeholder="Cari resto..."
                  className="neo-input"
                />
                {isPickupSearching && <p className={hintClass}>Mencari...</p>}
                {pickupError && <p className={errorClass}>{pickupError}</p>}
                {pickupResults.length > 0 && (
                  <div className="space-y-2">
                    {pickupResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() =>
                          addPickupPoint(result.coords, result.label)
                        }
                        className={resultButtonClass}
                      >
                        {result.label}
                      </button>
                    ))}
                  </div>
                )}
                {pickupPoints.length > 0 && (
                  <ul className="space-y-2 pt-3 border-t-2 border-dashed border-mg-ink/30">
                    {pickupPoints.map((point, index) => (
                      <li
                        key={point.id}
                        className="flex items-center justify-between gap-3 bg-mg-cream border-2 border-mg-ink rounded-neo px-3 py-2 text-sm"
                      >
                        <p className="flex-1 min-w-0 font-semibold text-mg-ink">
                          {index + 1}. {point.label}
                        </p>
                        <button
                          type="button"
                          onClick={() => removePickupPoint(point.id)}
                          aria-label={`Hapus titik resto ${index + 1}`}
                          className="grid place-items-center w-8 h-8 shrink-0 bg-mg-red text-white border-2 border-mg-ink rounded-neo transition hover:shadow-neo-sm"
                        >
                          <X size={16} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            )}

            <Panel
              icon={GearSix}
              title="Pengaturan Charge"
              tile="bg-mg-teal text-mg-ink"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="order-time" className={labelClass}>
                    Waktu Booking
                  </label>
                  <input
                    id="order-time"
                    type="time"
                    value={orderTime}
                    onChange={(event) => setOrderTime(event.target.value)}
                    className="neo-input"
                  />
                  <p className={hintClass}>
                    Charge Rp {formatRupiah(LATE_CHARGE_FEE)} untuk booking
                    jam 23:00 – 06:00.
                  </p>
                </div>

                <div>
                  <p className={labelClass}>Cuaca</p>
                  <button
                    type="button"
                    onClick={requestWeather}
                    disabled={isWeatherLoading}
                    className="neo-btn w-full bg-mg-indigo text-white px-4 py-3 text-sm"
                  >
                    <CloudRain size={18} aria-hidden="true" />
                    {isWeatherLoading ? "Ambil cuaca..." : "Ambil Cuaca"}
                  </button>
                  {weatherDetails && (
                    <p className={hintClass}>
                      {weatherDetails.sourceLabel}: {weatherDetails.precipitation}mm, kode {weatherDetails.weatherCode}
                      {weatherUpdatedAt &&
                        ` · update ${weatherUpdatedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
                    </p>
                  )}
                </div>
              </div>

              {weatherError && <p className={errorClass}>{weatherError}</p>}

              <div className="space-y-3 pt-3 border-t-2 border-dashed border-mg-ink/30">
                <ChargeRow
                  icon={Moon}
                  label={`Charge Waktu (Rp ${formatRupiah(LATE_CHARGE_FEE)})`}
                  active={isLateCharge}
                />
                {weatherDetails && (
                  <ChargeRow
                    icon={CloudRain}
                    label={`Charge Hujan (Rp ${formatRupiah(RAIN_CHARGE_FEE)})`}
                    active={isRaining}
                  />
                )}
              </div>
            </Panel>

            {serviceType === "food" && (
              <Panel
                icon={NotePencil}
                title="Catatan"
                tile="bg-white text-mg-ink"
              >
                <label htmlFor="order-notes" className="sr-only">
                  Catatan pesanan
                </label>
                <textarea
                  id="order-notes"
                  value={orderNotes}
                  onChange={(event) => setOrderNotes(event.target.value)}
                  placeholder="Contoh: ayam geprek lvl 2, teh manis"
                  className="neo-input"
                  rows={3}
                ></textarea>
              </Panel>
            )}

            {/* Ringkasan harga */}
            <div className="neo-card bg-mg-sun shadow-neo-lg p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="grid place-items-center w-9 h-9 bg-white text-mg-ink border-2 border-mg-ink rounded-neo">
                  <Receipt size={20} aria-hidden="true" />
                </span>
                <h3 className="font-display font-black text-lg text-mg-ink">
                  Ringkas Harga
                </h3>
              </div>
              <dl className="space-y-2 text-sm text-mg-ink">
                <div className="flex items-center justify-between">
                  <dt>Tarif dasar</dt>
                  <dd className="font-bold">
                    {baseFare ? `Rp ${formatRupiah(baseFare)}` : "-"}
                  </dd>
                </div>
                {serviceType === "food" && (
                  <div className="flex items-center justify-between">
                    <dt>Tambahan titik resto ({extraStopCount}x)</dt>
                    <dd className="font-bold">
                      Rp {formatRupiah(extraStopCharge)}
                    </dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt>Charge waktu</dt>
                  <dd className="font-bold">
                    {lateCharge > 0 ? `Rp ${formatRupiah(lateCharge)}` : "-"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Charge hujan</dt>
                  <dd className="font-bold">
                    {rainCharge > 0 ? `Rp ${formatRupiah(rainCharge)}` : "-"}
                  </dd>
                </div>
                <div className="mt-3 pt-3 border-t-2 border-dashed border-mg-ink flex items-center justify-between">
                  <dt className="font-bold">Total Estimasi</dt>
                  <dd className="font-display font-black text-2xl">
                    {totalLabel}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Bar total + CTA di bawah layar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-3 pointer-events-none transition-transform duration-300 ${
          showStickyBar ? "translate-y-0" : "translate-y-[120%]"
        }`}
        aria-hidden={!showStickyBar}
      >
        <div className="pointer-events-auto mx-auto max-w-3xl neo-card bg-mg-cream shadow-neo-lg flex items-center gap-3 p-3 sm:p-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wider font-bold text-mg-ink/70">
              Total Estimasi
            </p>
            <p className="font-display font-black text-xl sm:text-2xl text-mg-green-deep">
              {totalLabel}
            </p>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            tabIndex={showStickyBar ? undefined : -1}
            className="neo-btn bg-mg-sun text-mg-ink px-4 sm:px-5 py-3 text-sm whitespace-nowrap"
          >
            <WhatsappLogo size={20} aria-hidden="true" />
            Lanjut ke WA
          </a>
        </div>
      </div>
    </section>
  );
}
