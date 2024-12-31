from flask import Flask, jsonify, request, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import sqlite3
import os
import secrets
import hashlib
import keys

app = Flask(__name__)
cors = CORS(app)
bcrypt = Bcrypt(app)

app.secret_key = keys.secret_key

challenges = {}

def db_connect():
    conn = sqlite3.connect('../players.db')
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
    WHERE name LIKE ? or name LIKE ? 
    ORDER BY firstname ASC, lastname ASC;
    """, (query + '%', "% " + query + "%"))

    results = cursor.fetchall()
    conn.close()

    response = [{'name': row['name'], 'school': row['school'], 'uscfid': row['uscfid'], 'rating': row['rating'], 'link': row['link']} for row in results]
    return jsonify(response)

@app.route("/api/leaderboard", methods=["GET"])
def leaderboard():
    schools = request.args.get("schools", "")
    schools = schools.split(',')
    minRating = request.args.get("minRating", "0")
    maxRating = request.args.get("maxRating", "3000")
    # page = request.args.get("pageNo", "1")  still not sure if we should implement this
    print(f"Schools: {schools}")
    conn = db_connect()
    cursor = conn.cursor()
    if schools == ['']:
        cursor.execute("""
        SELECT name, school, rating, link FROM names
        WHERE rating BETWEEN ? AND ?
        ORDER BY rating DESC
        LIMIT 10
        """, (minRating, maxRating))
        results = cursor.fetchall()
        conn.close()
        return jsonify([dict(row) for row in results])
    
    placeholders = ",".join("?" for _ in schools)  # Creates ?,?,?
    query = f"SELECT name, school, rating FROM names WHERE school IN ({placeholders}) AND RATING BETWEEN ? AND ? ORDER BY rating DESC LIMIT 10"
    cursor.execute(query, schools + [minRating, maxRating])
    results = cursor.fetchall()
    conn.close
    return jsonify([dict(row) for row in results])

@app.route('/api/secure/challenge', methods=['POST'])
def get_challenge():
    data = request.json
    username = data.get('username')

    challenge = secrets.token_hex(16)
    challenges[username] = challenge
    return jsonify({"challenge": challenge}), 200

@app.route('/api/secure/login', methods=["POST"])
def login():
    data = request.json
    username = data.get('username')
    client_response = data.get('response')

    if username not in challenges:
        return jsonify({"message": "Invalid Challenge"}), 401
    
    challenge = challenges.pop(username)
    
    with sqlite3.connect('../users.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT password FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()

        if user:
            stored_password_hash = user[0]
            expected_hash = hashlib.sha256((stored_password_hash + challenge).encode()).hexdigest()
            if client_response == expected_hash:
                session['username'] = username
                print(session)
                return jsonify({"message": "Login Successful"}), 200
    return jsonify({"message": "Invalid Credentials"}), 401

@app.route('/api/secure/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    print(session)
    return jsonify({"message": "Logged out successfully"}), 200

if __name__ == '__main__':
    print("Running in directory:" + os.getcwd()) 
    app.run(port=8000)

