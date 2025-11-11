import sqlite3

conn = sqlite3.connect('../players.db')
cursor = conn.cursor()

cursor.execute("SELECT id, link, uscfid FROM names")
rows = cursor.fetchall()
for row in rows:
    row_id, url, uscfid = row

    link = f"https://ratings-api.uschess.org/api/v1/members/{uscfid}/sections?Offset=0&Size=50"
    cursor.execute("UPDATE names SET link = ? where id = ?", (link, row_id))

conn.commit()