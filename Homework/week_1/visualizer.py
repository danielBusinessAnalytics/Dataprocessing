#!/usr/bin/env python
# Name: Daniel Velleman
# Student number: 10106723
"""
This script visualizes data obtained from a .csv file
"""

import csv
import numpy as np
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# parse the data
def data_parse():
    # Open movies.csv and makes dictionary with keys Year and values list Rating
    with open('movies.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data_dict[row['Year']].append(float(row['Rating']))

    # stores means of the values
    for key in data_dict:
        data_dict[key] = np.mean(data_dict.get(key))


def plot():
    # matplotlib plot
    plt.plot(data_dict.keys(), data_dict.values())
    # y axle is between 0 and 10
    plt.ylim(0, 10)
    # labels
    plt.title('Average movie rating')
    plt.xlabel('Year')
    plt.ylabel('Rating')
    plt.show()


if __name__ == "__main__":
    data_parse()
    plot()
