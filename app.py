import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()                       # loads .env if present

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app, origins=os.getenv("WEB_ORIGIN", "*"))     # remove "*" in prod

###############################################################################
# Simple in-memory “settings” store (gone when the server restarts)
###############################################################################
SETTINGS = {
    "workMinutes" : 25,
    "breakMinutes": 5,
    "blockedSites": ["youtube.com", "reddit.com"]
}

###############################################################################
# Routes
###############################################################################

@app.route("/api/health")
def health():
    """For load-balancers / uptime checks."""
    return jsonify(status="ok")

@app.route("/api/settings", methods=["GET", "PUT"])
def settings():
    if request.method == "GET":
        return jsonify(SETTINGS)
    SETTINGS.update(request.get_json(force=True))
    return "", 204

@app.route("/")
def root():
    """Serve index.html from the static folder."""
    return send_from_directory(app.static_folder, "index.html")

    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)  # debug=True enables debug mode for development