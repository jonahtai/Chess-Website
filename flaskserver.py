from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
cors = CORS(app)

def db_connect():
    conn = sqlite3.connect('players.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/api/search", methods=['GET'])
def search():
    query = request.args.get('query', '').lower()
    conn = db_connect()
    cursor = conn.cursor()

    if not query:
        return jsonify({"results" : []})
    
    cursor.execute("""
    SELECT name, school, uscfid, rating, link FROM names
    WHERE name LIKE ?
    """, ('%' + query + '%',))

    results = cursor.fetchall()
    conn.close()

    response = [{'name': row['name'], 'school': row['school'], 'uscfid': row['uscfid'], 'rating': row['rating'], 'link': row['link']} for row in results]
    return jsonify(response)
if __name__ == '__main__':
    print("Running in directory:" + os.getcwd()) 
    app.run(port=8000)    