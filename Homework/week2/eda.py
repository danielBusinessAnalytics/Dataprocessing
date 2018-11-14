import csv
import pandas as pd
import matplotlib.pyplot as plt
import json


INPUT_CSV = "input.csv"


def load_parse_preprocess():
    '''
    Load csvfile.
    Parses and prepocesses data.
    Returns simplified dictionary.
    '''

    # Basis simplified dictionary
    dict_simple = {'Country': [],
                    'Region': [],
                    'Pop. Density (per sq. mi.)': [],
                    'Infant mortality (per 1000 births)': [],
                    'GDP ($ per capita) dollars': []
                    }

    # Load csv
    with open(INPUT_CSV, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        # Scan rows in list
        for row in reader:
            # Fill up empty values with NaN
            for keys in row:
                if row[keys] == 'unknown' or row[keys] == '':
                    row[keys] = float('NaN')

            # Dictionary of country, Region, Pop. Density, Infant mortality, GDP
            dict_simple['Country'].append(row['Country'].strip())
            dict_simple['Region'].append(row['Region'].strip())
            if isinstance(row['Pop. Density (per sq. mi.)'], str):
                dict_simple['Pop. Density (per sq. mi.)'].append(float(row['Pop. Density (per sq. mi.)'].replace(',','.')))
            else:
                dict_simple['Pop. Density (per sq. mi.)'].append(row['Pop. Density (per sq. mi.)'])
            if isinstance(row['Infant mortality (per 1000 births)'], str):
                dict_simple['Infant mortality (per 1000 births)'].append(float(row['Infant mortality (per 1000 births)'].replace(',','.')))
            else:
                dict_simple['Infant mortality (per 1000 births)'].append(row['Infant mortality (per 1000 births)'])
            # check if '.... dollars' or NaN
            if isinstance(row['GDP ($ per capita) dollars'], str):
                dict_simple['GDP ($ per capita) dollars'].append(int(row['GDP ($ per capita) dollars'].split()[0]))
            else:
                dict_simple['GDP ($ per capita) dollars'].append(row['GDP ($ per capita) dollars'])

    return dict_simple


def central_tendency(dataframe, column_name):
    '''
    Central tendency of column from datafram.
    Prints mean, mode and median.
    Plots a histogram of column.
    '''
    # Mean, mode and median
    mean =  dataframe.loc[:,column_name].mean()
    median = dataframe.loc[:,column_name].median()
    mode = dataframe.loc[:,column_name].mode()
    print('Summary: ' + column_name)
    print('Mean: ' + str(mean))
    print('median: ' + str(median))
    print('mode: ' + str(mode)[:10])

    # Plot
    # plt.title(column_name)
    # plt.xlabel('Amount')
    # plt.ylabel('Frequency')
    # plt.hist(dataframe.loc[:,column_name])
    dataframe.hist(column=column_name)
    plt.show()


def five_number_summary(dataframe, column_name):
    '''
    Prints five number summary consisting of minimum, first quartile, median,
    third quartile and Maximum.
    Plots a boxplot
    '''
    # Five number summary
    min = dataframe.loc[:,column_name].min()
    q1 = dataframe.loc[:,column_name].quantile(.25)
    median = dataframe.loc[:,column_name].median()
    q3 = dataframe.loc[:,column_name].quantile(.75)
    max = dataframe.loc[:,column_name].max()
    print('Five number summary: ' + column_name)
    print('Minumum: ' + str(min))
    print('First Quantile: ' + str(q1))
    print('Median: ' + str(median))
    print('Third quantile: ' + str(q3))
    print('Maximum: ' + str(max))

    # Plot
    dataframe.boxplot(column=column_name)
    plt.show()


def convert_to_json(dataframe):
    '''
    Write dataframe to json file.
    '''
    json_dict = {}
    # Turns datafram in proper dictionary
    for i in range(len(dataframe)):
        json_dict[dataframe.loc[i][0]] = {
                    'Region': dataframe.loc[i][1],
                    'Pop. Density (per sq. mi.)': dataframe.loc[i][2],
                    'Infant mortality (per 1000 births)': dataframe.loc[i][3],
                    'GDP ($ per capita) dollars': dataframe.loc[i][4],
                    }

    # Write dictionary to json
    with open('dataframe_simple.json', 'w') as file:
        json.dump(json_dict, file)


if __name__ == "__main__":
    dict_simple = load_parse_preprocess()
    dataframe = pd.DataFrame.from_dict(dict_simple)
    central_tendency(dataframe, 'GDP ($ per capita) dollars' )
    five_number_summary(dataframe, 'Infant mortality (per 1000 births)')
    convert_to_json(dataframe)
