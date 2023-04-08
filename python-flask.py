# A very simple Flask Hello World app for you to get started with...

from flask import Flask, request
import pandas as pd
import pvlib
from datetime import date
from datetime import timedelta
from flask_cors import CORS, cross_origin
import sys
# from pvlib import location
# from pvlib.bifacial.pvfactors import pvfactors_timeseries

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    lat = float(request.args.get("lat"))
    lon = float(request.args.get("lon"))
    today = date.today()
    yesterday = today - timedelta(days = 1)
    today = str(today)
    yesterday = str(yesterday)
    # lat = 51
    # lon = 0

    times = pd.date_range(yesterday, today, freq='1H', tz='Etc/GMT+5')
    loc = pvlib.location.Location(latitude=lat, longitude=lon, tz=times.tz)
    sp = loc.get_solarposition(times)
    cs = loc.get_clearsky(times)
    # example array geometry
    pvrow_height = 1
    pvrow_width = 4
    pitch = 10
    gcr = pvrow_width / pitch
    albedo = 0.2
    irrad = pvlib.bifacial.pvfactors.pvfactors_timeseries(
        solar_azimuth=sp['azimuth'],
        solar_zenith=sp['apparent_zenith'],
        surface_azimuth=180,  # south-facing array
        surface_tilt=20,
        axis_azimuth=90,  # 90 degrees off from surface_azimuth.  270 is ok too
        timestamps=times,
        dni=cs['dni'],
        dhi=cs['dhi'],
        gcr=gcr,
        pvrow_height=pvrow_height,
        pvrow_width=pvrow_width,
        albedo=albedo,
        n_pvrows=3,
        index_observed_pvrow=1
    )
    # turn into pandas DataFrame
    irrad = pd.concat(irrad, axis=1)
    labels = []
    for hr in times:
        labels.append(hr.hour)

    irrad['labels'] = labels
    return irrad.to_json()

