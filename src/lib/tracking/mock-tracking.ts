export type TrackingEventStatus = "done" | "current" | "pending";

export type TrackingEvent = {
  id: string;
  label: string;
  location: string;
  timestamp: string;
  status: TrackingEventStatus;
};

export type TrackingResult = {
  trackingId: string;
  status: "in_transit" | "delivered" | "not_found";
  origin: string;
  destination: string;
  eta: string;
  service: string;
  events: TrackingEvent[];
};

/** Demo lookup — replace with API in integration ticket. */
export function getMockTrackingResult(trackingId: string): TrackingResult {
  const id = trackingId.trim().toUpperCase();
  if (!id || id.length < 6) {
    return {
      trackingId: id,
      status: "not_found",
      origin: "",
      destination: "",
      eta: "",
      service: "",
      events: [],
    };
  }

  return {
    trackingId: id,
    status: "in_transit",
    origin: "Bergisch Gladbach, DE",
    destination: "Frankfurt am Main, DE",
    eta: "Today, 18:30",
    service: "Express courier",
    events: [
      {
        id: "1",
        label: "Shipment registered",
        location: "Take & Bring HQ",
        timestamp: "29 Jul 2026, 08:15",
        status: "done",
      },
      {
        id: "2",
        label: "Picked up",
        location: "Bergisch Gladbach",
        timestamp: "29 Jul 2026, 09:40",
        status: "done",
      },
      {
        id: "3",
        label: "In transit",
        location: "A3 motorway · Cologne direction",
        timestamp: "29 Jul 2026, 14:20",
        status: "current",
      },
      {
        id: "4",
        label: "Out for delivery",
        location: "Frankfurt depot",
        timestamp: "Estimated 17:45",
        status: "pending",
      },
      {
        id: "5",
        label: "Delivered",
        location: "Recipient address",
        timestamp: "Pending",
        status: "pending",
      },
    ],
  };
}
