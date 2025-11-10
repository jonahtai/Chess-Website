import requests

def getLiveRating(url):
    data = requests.get(url).json()
    return data["items"][0]["ratingRecords"][0]["postRating"]

def getOfficialRating(url):
    data = requests.get(url).json()
    return data["items"][0]["ratingRecords"][0]["preRating"]

url = "https://ratings-api.uschess.org/api/v1/members/30757348/sections"

print(getLiveRating(url), getOfficialRating(url))
