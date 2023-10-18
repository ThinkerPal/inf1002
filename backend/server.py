from flask import Flask, Response, request
from flask_cors import CORS, cross_origin
import pandas as pd
import numpy as np
import json
import scipy.stats as stats

data = pd.read_csv("combined_cleaned.csv", low_memory=False)

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

@app.route("/")
def home():
    return "Hello World"

@app.route("/towns")
@cross_origin()
def towns():
    print(data.town)
    return Response(json.dumps(list(set(data.town))), mimetype="application/json")

@app.route("/heatmap")
@cross_origin()
def heatmap():
    start = request.args.get("start", 2020)
    end = request.args.get("end", 2023)
    heatmap_data = list(data.groupby(["latitude", "longitude"], as_index=False).adjusted_resale_price.mean().apply(lambda x: json.loads(x.to_json()), axis=1))
    # heatmap_data = list(data[["latitude","longitude", "adjusted_resale_price"]])
    # print(heatmap_data)
    return Response(json.dumps(heatmap_data), mimetype="application/json")

@app.route("/storey_range")
@cross_origin()
def storey_range():
    storey_price = dict(data.groupby(['storey_range'])['adjusted_resale_price'].mean())
    storey = [[key, value] for key, value in storey_price.items()]
    # print(storey_price)
    return Response(json.dumps(storey), mimetype="application/json") 

@app.route("/floor_area")
@cross_origin()
def floor_area():
    bin_means, bin_edges, binnumber = stats.binned_statistic(data.floor_area_sqm, data.adjusted_resale_price, 'mean', bins=10)
    bin_width = round(bin_edges[1] - bin_edges[0], 1)
    bin_centers = bin_edges[1:] - bin_width/2
    floor_price_pairs = list(zip(bin_centers, bin_means))
    floors = {}
    floors[bin_width] = floor_price_pairs
    # floor_area = dict(data.groupby(['floor_area_sqm'])['adjusted_resale_price'].mean())
    # floor_area = list(zip(data.floor_area_sqm, data.adjusted_resale_price))
    # floors = [[key, value] for key, value in floor_area.items()]
    # print(floor_area)
    return Response(json.dumps(floors), mimetype="application/json")

if __name__ == "__main__":
    app.run("0.0.0.0", 8000, debug=True)