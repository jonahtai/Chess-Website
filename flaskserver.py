from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

names = ["Calvin", "Edward", "Vincent", "Valen", "Chingadinga", "calvin wang", "calvins hot sweaty balls"]

@app.route("/api/search", methods=['GET'])
def search():
    query = request.args.get('query', '').lower()
    if not query:
        return jsonify({"results" : []})
    
    results = [name for name in names if query in name.lower()]
    return jsonify({"results": results})
if __name__ == '__main__':
    app.run(port=8000)

