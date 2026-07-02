CREATE TABLE weather_data (
    id BIGSERIAL PRIMARY KEY,
    forecast_date DATE NOT NULL,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL,
    temperature_max DECIMAL(5,2),
    temperature_min DECIMAL(5,2),
    temperature_mean DECIMAL(5,2),
    precipitation_sum DECIMAL(7,2),
    wind_speed_max DECIMAL(6,2),
    wind_direction DECIMAL(5,2),
    cloud_cover DECIMAL(5,2),
    humidity DECIMAL(5,2),
    uv_index DECIMAL(4,2),
    weather_code VARCHAR(10)
);

CREATE INDEX idx_weather_date ON weather_data(forecast_date);

CREATE TABLE wave_data (
    id BIGSERIAL PRIMARY KEY,
    forecast_date DATE NOT NULL,
    forecast_time TIME NOT NULL,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL,
    wave_height DECIMAL(6,3),
    wave_period DECIMAL(5,2),
    wave_direction DECIMAL(5,2),
    swell_height DECIMAL(6,3),
    swell_period DECIMAL(5,2),
    swell_direction DECIMAL(5,2),
    wind_wave_height DECIMAL(6,3),
    wind_wave_period DECIMAL(5,2)
);

CREATE INDEX idx_wave_date ON wave_data(forecast_date, forecast_time);
