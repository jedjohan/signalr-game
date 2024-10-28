import React from 'react';

interface LocationUpdatesProps {
  locationUpdates: { teamName: string; location: any }[];
}

const LocationUpdates: React.FC<LocationUpdatesProps> = ({ locationUpdates }) => {
  return (
    <div>
      <h3>Location Updates</h3>
      <div className="gameupdates">
        <ul className="location-list">
          {locationUpdates.slice(0, 30).map((update, index) => (
            <li key={index} className="location-item">
              <strong>Team:</strong> {update.teamName}
              <br />
              <strong>Location (GeoJSON):</strong> {JSON.stringify(update.location, null, 2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LocationUpdates;
