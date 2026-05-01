import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
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
const DEFAULT_CENTER = CAMPUS_COORDS;
const MAP_PICK_LABEL = "Titik pilihan di peta";
const ROUTE_SERVICE_URL = "https://router.project-osrm.org/route/v1/driving";

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

export default function PriceCalculatorSection({ onOrderMessageChange }) {
  const [campusCoords] = useState(CAMPUS_COORDS);
  const [campusLabel] = useState(CAMPUS_QUERY);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [destinationQuery, setDestinationQuery] = useState("");
  const [destinationResults, setDestinationResults] = useState([]);
  const [destination, setDestination] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [isRouting, setIsRouting] = useState(false);
  const [routeLine, setRouteLine] = useState(null);
  const [routeDistanceKm, setRouteDistanceKm] = useState(null);
  const [distanceKmInput, setDistanceKmInput] = useState("");

  useEffect(() => {
    if (!destinationQuery.trim()) {
      setDestinationResults([]);
      setSearchError("");
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
      setIsSearching(true);
      setSearchError("");

      try {
        const results = await fetchGeocode(trimmedQuery);
        if (!results.length) {
          setSearchError("Lokasi tidak ditemukan. Coba kata kunci lain.");
          setDestinationResults([]);
          return;
        }

        setDestinationResults(
          results.map((result) => ({
            id: result.place_id,
            label: result.display_name,
            coords: {
              lat: Number.parseFloat(result.lat),
              lng: Number.parseFloat(result.lon),
            },
          }))
        );
      } catch (error) {
        setSearchError("Lokasi tidak ditemukan. Coba kata kunci lain.");
        setDestinationResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [destinationQuery, destination]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError("Browser tidak mendukung lokasi GPS.");
      return;
    }

    setIsLocating(true);
    setSearchError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setSearchError("Gagal mengambil lokasi saat ini.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectDestination = useCallback((coords, label = MAP_PICK_LABEL) => {
    setDestination({ id: label, label, coords });
    setDestinationQuery(label);
    setDestinationResults([]);
    setSearchError("");
  }, []);

  useEffect(() => {
    if (!campusCoords || !destination?.coords) {
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
        const route = await fetchRoute(campusCoords, destination.coords);
        if (isCancelled) return;
        setRouteLine(route.line);
        setRouteDistanceKm(route.distanceKm);
        setDistanceKmInput(route.distanceKm.toFixed(1));
      } catch (error) {
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
  }, [campusCoords, destination]);

  const distanceKm = useMemo(() => {
    const value = Number.parseFloat(distanceKmInput);
    if (!Number.isFinite(value) || value <= 0) return null;
    return value;
  }, [distanceKmInput]);

  const estimatedFare = useMemo(() => {
    if (!distanceKm) return null;
    const extraKm = Math.max(0, distanceKm - BASE_KM);
    const extraFare = Math.ceil(extraKm) * EXTRA_PER_KM;
    return BASE_FARE + extraFare;
  }, [distanceKm]);

  const orderMessage = useMemo(() => {
    if (!destination && !distanceKm) return DEFAULT_ORDER_MESSAGE;

    const destinationLabel = destination?.label || destinationQuery || "...";
    const messageLines = [`Bang, mau ke ${destinationLabel} dong!`];

    if (distanceKm) {
      messageLines.push(
        `Jarak dari Kampus UINSU Tuntungan: ${distanceKm.toFixed(1)} km.`
      );
    }

    if (estimatedFare) {
      messageLines.push(`Estimasi tarif: Rp ${formatRupiah(estimatedFare)}.`);
    }

    if (currentCoords) {
      messageLines.push(
        `Lokasi saya: https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}`
      );
    }

    if (destination?.coords) {
      messageLines.push(
        `Tujuan: https://maps.google.com/?q=${destination.coords.lat},${destination.coords.lng}`
      );
    }

    return messageLines.join("\n");
  }, [
    destination,
    destinationQuery,
    distanceKm,
    estimatedFare,
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

  const mapCenter = campusCoords || DEFAULT_CENTER;
  const mapPoints = [campusCoords, currentCoords, destination?.coords].filter(
    Boolean
  );

  const destinationMarkerHandlers = useMemo(
    () => ({
      dragend: (event) => {
        const { lat, lng } = event.target.getLatLng();
        selectDestination({ lat, lng });
      },
    }),
    [selectDestination]
  );

  return (
    <section id="tarif" className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Kalkulator Tarif <span className="text-green-600">MahaGo</span>
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Hitung estimasi harga berdasarkan argo Kampus UINSU Tuntungan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lokasi Saat Ini
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="bg-green-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    {isLocating ? "Mendeteksi..." : "Gunakan Lokasi Saya"}
                  </button>
                  <div className="flex-1 rounded-lg bg-white border border-gray-200 px-4 py-3 text-sm text-gray-600">
                    {currentCoords
                      ? `Lat: ${currentCoords.lat.toFixed(5)}, Lng: ${currentCoords.lng.toFixed(5)}`
                      : "Belum dipilih"}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lokasi Tujuan
                </label>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={destinationQuery}
                    onChange={(event) => setDestinationQuery(event.target.value)}
                    placeholder="Mau ke..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {isSearching && (
                  <p className="text-xs text-gray-500 mt-2">
                    Mencari saran lokasi...
                  </p>
                )}
                {searchError && (
                  <p className="text-xs text-red-600 mt-2">{searchError}</p>
                )}
                {destinationResults.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {destinationResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => {
                          selectDestination(result.coords, result.label);
                        }}
                        className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 text-sm hover:border-green-500 hover:bg-green-50 transition"
                      >
                        {result.label}
                      </button>
                    ))}
                  </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Ketik minimal 3 huruf untuk melihat saran lokasi. Kamu juga
                    bisa klik peta atau geser marker tujuan.
                  </p>
                  {routeError && (
                    <p className="text-xs text-amber-600 mt-2">{routeError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jarak dari Kampus UINSU Tuntungan (km)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={distanceKmInput}
                  onChange={(event) => setDistanceKmInput(event.target.value)}
                    placeholder="Terisi otomatis dari rute"
                    readOnly={Boolean(routeDistanceKm)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                    3 km pertama Rp 5.000, berikutnya Rp 2.000 per km (dibulatkan
                    ke atas). Jarak diambil dari rute jalan.
                </p>
                  {isRouting && (
                    <p className="text-xs text-gray-500 mt-2">
                      Mengambil jarak rute...
                    </p>
                  )}
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
                  Estimasi Tarif
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {estimatedFare ? `Rp ${formatRupiah(estimatedFare)}` : "-"}
                  </span>
                  <span className="text-xs text-gray-500">perkiraan</span>
                </div>
                {distanceKm && (
                  <p className="text-xs text-gray-500 mt-2">
                    Jarak dihitung dari kampus ke tujuan, bukan dari lokasi
                    saat ini.
                  </p>
                )}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg"
              >
                Chat Admin dengan Tujuan Ini
              </a>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-lg">
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={14}
              className="h-80 sm:h-96 w-full rounded-xl"
              scrollWheelZoom={false}
            >
              <MapClickHandler
                onSelect={(latlng) =>
                  selectDestination({ lat: latlng.lat, lng: latlng.lng })
                }
              />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {campusCoords && (
                <Marker position={[campusCoords.lat, campusCoords.lng]}>
                  <Popup>
                    Kampus UINSU Tuntungan
                    <br />
                    {campusLabel}
                  </Popup>
                </Marker>
              )}
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
              {routeLine && <Polyline positions={routeLine} color="#16a34a" />}
              {!routeLine && campusCoords && destination?.coords && (
                <Polyline
                  positions={[
                    [campusCoords.lat, campusCoords.lng],
                    [destination.coords.lat, destination.coords.lng],
                  ]}
                  color="#16a34a"
                  dashArray="6 10"
                />
              )}
              {mapPoints.length > 0 && <FitBounds points={mapPoints} />}
            </MapContainer>
            <div className="mt-4 text-xs text-gray-500">
              Klik peta untuk menentukan tujuan, lalu geser marker jika perlu.
              Peta menggunakan OpenStreetMap.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
