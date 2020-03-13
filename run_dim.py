# This Python file uses the following encoding: utf-8
import io
import os, sys
import re
import nltk
# uncomment this if you get an update error for wordnet
#nltk.download('wordnet')
import logging
from gensim import corpora, utils
from gensim.models.wrappers.dtmmodel import DtmModel
import numpy as np
import pymysql.cursors
import pymysql
import csv
from collections import Counter
import string
import pickle
import multiprocessing
import joblib
from joblib import Parallel, delayed

dir_ext = '/dsl/eebo/2020.02.03-phase1-phase2'

######

ids = []
dates = []
indices = []

# open metadata file and retrieve file_IDs (A##### format) and pub dates
with open('/dsl/eebo/2020.02.03-phase1-phase2/metadata/eebo_phase1_2_meta.csv') as metadata:
    csvReader = csv.reader(metadata)
    for row in csvReader:
        ids.append(row[3])
        dates.append(row[13])

print(ids[0:10])
print(dates[0:10])

# remove title rows
ids = ids[1:]
dates = dates[1:]

decades = []

# create a date filter so only texts between 1470-1700 are considered
# append each date to the decade array
for i in range(len(dates)):
    if len(dates[i]) == 4:
        if int(dates[i]) >= 1470 and int(dates[i]) <= 1700:
            decades.append(round(int(dates[i]), -1))
            indices.append(ids[i])

combined = zip(decades, indices)
zipped_sorted = sorted(combined, key=lambda x: x[0])
decades, indices = map(list, zip(*zipped_sorted))

print(len(decades))
decade_count = Counter(decades)
print("counted decades")
print(decade_count)

# don't hate me - making manual list with Counter tally:
# Counter({1680: 9050, 1660: 7880, 1690: 7545, 1650: 7544,
# 1640: 7438, 1700: 5270, 1670: 3441, 1620: 2550, 1630: 1680,
# 1600: 1606, 1610: 1606, 1590: 1035, 1580: 979, 1570: 593,
# 1550: 538, 1560: 526, 1540: 313, 1530: 192, 1520: 104,
# 1510: 84, 1500: 75, 1480: 61, 1490: 26, 1470: 2})
# *** for whatever reason A76047 is not in the SQL database
# so I am removing one document from the count for 1640
time_seq = [2,61,26,75,84,104,192,313,538,526,593,979,1035,1606,1606,2550,1680,7437,7544,7880,3441,9050,7545,5270]

######

#connect to mysql server
connection = pymysql.connect(user="avkoehl", password="E]h+65S<5t395=!k",
                             db="quintessence_corpus", host="127.0.0.1")

# pull the lemmatized spelling from rows
# and list of file_ids to filter
with connection.cursor() as cursor:
    sql = "SELECT `Lemma` FROM `Lemma`"
    file_id = "SELECT `File_ID` FROM `Lemma`"
    cursor.execute(sql)
    docs = cursor.fetchall()
    cursor.execute(file_id)
    file_ids = cursor.fetchall()

connection.close()

#######

# docs2 is the corpus in an array filtered based on date range
docs2 = []

for i in range(len(file_ids)):
    if file_ids[i][0] in indices:
        docs2.append(docs[i])

print("total docs in date range")
print(len(docs2))

# file_list = []
# for i in range(len(file_ids)):
#     file_list.append(file_ids[i][0])
#
# solution = list(set(indices) - set(file_list))
# print(solution)

# Tokenize the documents.
from nltk.tokenize import RegexpTokenizer
tokenizer = RegexpTokenizer(r'\w+')

def get_docs(doc_content):
    doc_content = doc_content.replace("\t", " ")
    doc_content = tokenizer.tokenize(doc_content) # split into words
    return doc_content

docs_cleaned = Parallel(n_jobs=20)(delayed(get_docs)(doc[0]) for doc in docs2)
print("parallel process finished.")
print(docs_cleaned[0][0])
for ds in docs_cleaned:
    for s in ds:
        s = s.lower()
        s = s.replace('|', ' ')
        s = s.translate(str.maketrans('', '', string.punctuation))


# Remove numbers, but not words that contain numbers.
docs_cleaned = [[token for token in doc if not token.isnumeric()] for doc in docs_cleaned]

# Remove words that are only one character.
docs_cleaned = [[token for token in doc if len(token) > 1] for doc in docs_cleaned]

print("docs cleaned.")
print(docs_cleaned[0][0:50])

# ######

# Remove rare and common tokens.
from gensim.corpora import Dictionary

# Create a dictionary representation of the documents.
dictionary = Dictionary(docs_cleaned)

# Filter out words that occur in less than 30 documents, or more than 50% of the documents.
dictionary.filter_extremes(no_below=30, no_above=0.5)

####

# Bag-of-words representation of the documents.
corpus = [dictionary.doc2bow(doc) for doc in docs_cleaned]

####

print('Number of unique tokens: %d' % len(dictionary))
print('Number of documents: %d' % len(corpus))

####

# path to dtm binary
dtm_path = "/dsl/quintessence/dtm-linux64"

# model = fixed makes a DIM
#if DTMcorpus class is uncommented, change id2word = corpus.dictionary
### this model returns the following:
# doc_topic (numpy.ndarray) – Document-topic proportions.
# topic_term (numpy.ndarray) – Calculated term of topic suitable for pyLDAvis format.
# doc_lengths (list of int) – Length of each documents in corpus.
# term_frequency (numpy.ndarray) – Frequency of each word from vocab.
# vocab (list of str) – List of words from docpus.
model = DtmModel(dtm_path, corpus, time_seq, num_topics=60,
                 id2word=dictionary, initialize_lda=True, model='fixed', rng_seed=9001)

model.save("/dsl/quintessence/dim_combined.model")
file = open("/dsl/quintessence/dim_combined_model.obj", 'wb')
pickle.dump(model, file)
