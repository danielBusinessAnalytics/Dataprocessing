import csv
import json


INPUT_CSV =  'data.csv'
YEAR = '2016'


def csv_to_json(input_file):
    csv_file = open(input_file, 'r')
    json_file = open('data.json', 'w')
    reader = csv.DictReader(csv_file)
    list = []
    # Makes list of dictionaries of which country has how much renewable energy for the year
    for row in reader:
        if row['TIME'] == YEAR and row['MEASURE'] == "PC_PRYENRGSUPPLY" and row["Value"] != "":
            list.append({'country': row['LOCATION'],
                         'value': row['Value']})
    json.dump(list, json_file)


if __name__ == "__main__":
    csv_to_json(INPUT_CSV)
