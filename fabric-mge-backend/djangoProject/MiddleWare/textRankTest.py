from __future__ import print_function
import codecs
from textrank4zh import TextRank4Keyword, TextRank4Sentence

text = codecs.open('testdata.txt', 'r', 'utf-8').read()
tr4w = TextRank4Keyword()
tr4w.analyze(text=text, lower=True, window=2)  #
print('关键词：')
for item in tr4w.get_keywords(40, word_min_len=1):
    print(item.word, item.weight)
print()
print('关键短语：')
for phrase in tr4w.get_keyphrases(keywords_num=20, min_occur_num=1):
    print(phrase)
tr4s = TextRank4Sentence()
tr4s.analyze(text=text, lower=True, source='all_filters')
print()
# print('摘要：')
# for item in tr4s.get_key_sentences(num=3):
#     print(item.index, item.weight, item.sentence)  # index是语句在文本中位置，weight是权重
