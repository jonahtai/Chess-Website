import sqlite3
from bs4 import BeautifulSoup
import requests
import time

#CODE BY SOHAIL AJI
def getRating(url):
    html = requests.get(url)
    s = BeautifulSoup(html.text, "html.parser")
    table = s.find("table", {"border" : "1", "cellpadding": "4", "cellspacing" : "0", "valign": "top", "width": "960"})
    rows = table.find_all("tr")[1:]
    event_data = []

    for row in rows:
        cells = row.find_all("td")
        event = {
            "Event Name" : cells[2].text.strip(),
            "Regular Rating Before/After" : cells[2].text.strip()
        }
        event_data.append(event)
    for event in event_data:
        if event["Regular Rating Before/After"] != "":
            rating_regular = event["Regular Rating Before/After"].split()[2]
            if rating_regular != "/":
                if rating_regular == "=>":
                    rating_regular = event["Regular Rating Before/After"].split()[3]
                break
    rating_regular = int(rating_regular)
    return(rating_regular)

#CODE BY CALVIN WANG
def officialRating(url):
    a = url.replace("TmntHst", "Main")
    a = a.replace("TnmtHst", "Main")
    result = requests.get(a)
    doc = BeautifulSoup(result.text, "html.parser")
    print(a)
    rating = str(doc.find_all(["nobr"])).split()[1]
    return(rating)

if __name__ == "__main__":
    start = time.perf_counter()
    conn = sqlite3.connect('../players.db')
    cursor = conn.cursor()

    cursor.execute("SELECT id, link FROM names")
    rows = cursor.fetchall()
    for row in rows:
        row_id, url = row
        live_rating = getRating(url)
        official_rating = officialRating(url)
        cursor.execute("UPDATE names SET rating = ?, officialRating = ? WHERE id = ?", (live_rating, official_rating, row_id))
    conn.commit()
    print("pp")
    end = time.perf_counter()
    print(f"Database updated in : {end-start} seconds")