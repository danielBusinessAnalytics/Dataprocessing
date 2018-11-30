import csv
import json

INPUT_CSV =  'winter.csv'

def csv_to_json(input_file):
    csv_file = open(input_file, 'r')
    json_file = open('input_file.json', 'w')
    reader = csv.DictReader(csv_file)

    total_medals = 0

    medals_dict = {}

    brons_medals = 0
    silver_medals = 0
    gold_medals = 0

    # counts number of medals for each year for the Netherlands
    for row in reader:
        if row['Country'] == 'NED':
            if row['Year'] in medals_dict:
                medals_dict[row['Year']] += 1
            else:
                medals_dict[row['Year']] = 1

    json.dump(medals_dict, json_file)



if __name__ == "__main__":
    csv_to_json(INPUT_CSV)
