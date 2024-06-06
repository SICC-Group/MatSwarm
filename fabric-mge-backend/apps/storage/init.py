from apps.storage.models.Data import Data
from textrank4zh import TextRank4Keyword
from djangoProject.MiddleWare import MPT
from apps.storage.utils import DataToJson
import json

storage = {}
mpt = MPT.MerklePatriciaTrie(storage)


def init_data():
    data = Data.objects()
    for res_ in data:
        tr4w = TextRank4Keyword()
        res = DataToJson(res_)
        item = str(res['content'])
        tr4w.analyze(text=item, lower=True, window=2)
        # print('关键词：')
        for item_ in tr4w.get_keywords(40, word_min_len=1):
            # print(item_.word, item_.weight)
            mpt.update_mge(item_.word.encode('utf-8'), str(res))


def init_MPT():
    data = Data.objects()
    for item in data:
        res = DataToJson(item)
        mpt.update_mge(str(item.id).encode('utf-8'), json.dumps(res))
    print(mpt.get(b'test').data)
