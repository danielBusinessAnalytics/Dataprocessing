import csv
import json

INPUT_CSV =  'data.csv'

def csv_to_json(input_file):
    csv_file = open(INPUT_CSV, 'r')
    json_file = open('data.json', 'w')
    reader = csv.DictReader(csv_file)

    dict = {}
    value_list = []
    men_list = []
    women_list = []
    countries_list = []



    for row in reader:
        if row["SUBJECT"] == "TRY" and row["TIME"] == "2017":
            value_list.append(row["Value"])
            countries_list.append(row["LOCATION"])
        if row["SUBJECT"] == "TRY_MEN" and row["TIME"] == "2017":
            men_list.append(row["Value"])
        if row["SUBJECT"] == "TRY_WOMEN" and row["TIME"] == "2017":
            women_list.append(row["Value"])

    for i in range(len(countries_list)):
        dict[countries_list[i]] = {"Value": value_list[i], "Men": men_list[i], "Women": women_list[i]}

    json.dump(dict, json_file)


if __name__ == "__main__":
    csv_to_json(INPUT_CSV)
