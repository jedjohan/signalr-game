import React from 'react';

export interface LocationUpdateData { // Add export here
  Name: string;
  Location: any;
}

interface LocationUpdatesProps {
  locationUpdates: LocationUpdateData[];
}

const LocationUpdates: React.FC<LocationUpdatesProps> = ({ locationUpdates }) => {
  return (
    <div>
      <h3>Location Updates</h3>
      <div className="locationupdates">
        <ul className="location-list">
          {locationUpdates.slice(0, 30).map((update, index) => (
            <li key={index} className="location-item">
              <strong>Team:</strong> {update.Name}
              <br />
              <strong>Location:</strong> {JSON.stringify(update.Location)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LocationUpdates;
