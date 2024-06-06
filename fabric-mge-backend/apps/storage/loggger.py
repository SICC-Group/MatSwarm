import datetime
import os


def logger(request, name):
    # fp = open('/home/drs/codes/logs/django-info.log', 'a+')

    # fp.close()
    with open('django-info.log', 'a+') as fp:
        print('**********************************************', file=fp)
        print('时间: ', datetime.datetime.now(), file=fp)
        print('事件: ', name, file=fp)
        print('HOST: ', request.META['REMOTE_ADDR'], file=fp)
        print('方法: ', request.method, file=fp)
        print('URL: ', request.path, file=fp)
        print('**********************************************', file=fp)
        fp.close()

