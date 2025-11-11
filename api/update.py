import sqlite3
from bs4 import BeautifulSoup
import requests
import time

def getRating(url):
    data = requests.get(url).json()
    data1 = data["items"][0]["ratingRecords"][0]["postRating"]
    data2 = data["items"][0]["ratingRecords"][0]["preRating"]
    print(f"scraped {url}")
    return data1,data2

if __name__ == "__main__":
    start = time.perf_counter()
    conn = sqlite3.connect('../players.db')
    cursor = conn.cursor()

    cursor.execute("SELECT id, link FROM names")
    rows = cursor.fetchall()
    for row in rows:
        row_id, url = row
        new_rating, new_official_rating = getRating(url)
        cursor.execute("UPDATE names SET rating = ?, officialrating = ? where id = ?", (new_rating, new_official_rating, row_id))
    conn.commit()
    print("pp")
    end = time.perf_counter()
    print(f"Database updated in : {end-start} seconds")